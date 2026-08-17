import { NextResponse } from "next/server";
import {
    ADMIN_EMAIL,
    verifyPassword,
    verifyAdminCredentials,
    verifyCode,
    getAdminSecretCode,
    signSession,
    signPreAuth,
    verifyPreAuth,
    readAttempt,
    writeAttempt,
    clearAttempts,
    SESSION_COOKIE,
    SESSION_TTL_MS,
    PREAUTH_COOKIE,
    PREAUTH_TTL_MS,
    MAX_ATTEMPTS,
    LOCK_MS,
    LOCK_MINUTES,
} from "@/lib/adminAuth"

export const runtime = "nodejs";

function clientIp(request) {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "local"
    );
}

const cookieOpts = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
};

// Shared lockout response for a stage key. Returns { rec } if not locked,
// or { response } (HTTP 429) if currently locked out.
async function checkLock(key) {
    const now = Date.now();
    const rec = await readAttempt(key);
    if (rec.lockedUntil && rec.lockedUntil > now) {
        const minsLeft = Math.ceil((rec.lockedUntil - now) / 60000);
        return {
            response: NextResponse.json(
                {
                    success: false,
                    locked: true,
                    lockedUntil: rec.lockedUntil,
                    error: `Too many failed attempts. Try again in ${minsLeft} minute${minsLeft === 1 ? "" : "s"}.`,
                },
                { status: 429 }
            ),
        };
    }
    return { rec };
}

// Record a failed attempt and return the appropriate error response.
async function registerFailure(key, rec, invalidMessage) {
    const now = Date.now();
    rec.fails += 1;
    let locked = false;
    if (rec.fails >= MAX_ATTEMPTS) {
        rec.lockedUntil = now + LOCK_MS;
        rec.fails = 0;
        locked = true;
    }
    await writeAttempt(key, rec);

    if (locked) {
        return NextResponse.json(
            {
                success: false,
                locked: true,
                lockedUntil: rec.lockedUntil,
                error: `Too many failed attempts. Locked for ${LOCK_MINUTES} minutes.`,
            },
            { status: 429 }
        );
    }
    return NextResponse.json(
        {
            success: false,
            error: invalidMessage,
            attemptsLeft: Math.max(0, MAX_ATTEMPTS - rec.fails),
        },
        { status: 401 }
    );
}

export async function POST(request) {
    const ip = clientIp(request);

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
    }

    // ===== Stage 2 — secret code (after password already verified) =====
    if (typeof body.code === "string") {
        const pre = verifyPreAuth(request.cookies.get(PREAUTH_COOKIE)?.value);
        if (!pre) {
            return NextResponse.json(
                { success: false, restart: true, error: "Session expired. Please sign in again." },
                { status: 401 }
            );
        }

        const key = `code:${ip}`;
        const { response: lockedResp, rec } = await checkLock(key);
        if (lockedResp) return lockedResp;

        const expectedCode = getAdminSecretCode(pre.sub);
        if (!verifyCode(body.code, expectedCode)) {
            return registerFailure(key, rec, "Invalid secret code.");
        }

        // Both factors passed — grant the full session, clear the pre-auth cookie.
        await clearAttempts(key);
        const res = NextResponse.json({ success: true });
        res.cookies.set(SESSION_COOKIE, signSession(pre.sub || ADMIN_EMAIL), {
            ...cookieOpts,
            maxAge: Math.floor(SESSION_TTL_MS / 1000),
        });
        res.cookies.set(PREAUTH_COOKIE, "", { ...cookieOpts, maxAge: 0 });
        return res;
    }

    // ===== Stage 1 — email + password =====
    const email = (body.email || "").trim();
    const password = body.password || "";

    const key = `${ip}`;
    const { response: lockedResp, rec } = await checkLock(key);
    if (lockedResp) return lockedResp;

    const ok = verifyAdminCredentials(email, password);
    if (!ok) {
        return registerFailure(key, rec, "Invalid email or password.");
    }

    // Password correct — issue a short-lived pre-auth cookie and ask for the code.
    // NOTE: the full session is NOT granted yet.
    await clearAttempts(key);
    const res = NextResponse.json({ success: false, codeRequired: true });
    res.cookies.set(PREAUTH_COOKIE, signPreAuth(email), {
        ...cookieOpts,
        maxAge: Math.floor(PREAUTH_TTL_MS / 1000),
    });
    return res;
}
