import { NextResponse } from "next/server";
import {
    ADMIN_EMAIL,
    verifyPassword,
    signSession,
    getAttemptStore,
    SESSION_COOKIE,
    SESSION_TTL_MS,
    MAX_ATTEMPTS,
    LOCK_MS,
} from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(request) {
    const store = getAttemptStore();
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "local";

    let email = "";
    let password = "";
    try {
        const body = await request.json();
        email = (body.email || "").trim();
        password = body.password || "";
    } catch {
        return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
    }

    const key = `${ip}`;
    const now = Date.now();
    const rec = store.get(key) || { fails: 0, lockedUntil: 0 };

    // Locked out?
    if (rec.lockedUntil && rec.lockedUntil > now) {
        return NextResponse.json(
            {
                success: false,
                locked: true,
                lockedUntil: rec.lockedUntil,
                error: "Too many failed attempts. Account temporarily locked.",
            },
            { status: 429 }
        );
    }

    const ok = email === ADMIN_EMAIL && verifyPassword(password);

    if (!ok) {
        rec.fails += 1;
        let locked = false;
        if (rec.fails >= MAX_ATTEMPTS) {
            rec.lockedUntil = now + LOCK_MS;
            rec.fails = 0;
            locked = true;
        }
        store.set(key, rec);

        if (locked) {
            return NextResponse.json(
                {
                    success: false,
                    locked: true,
                    lockedUntil: rec.lockedUntil,
                    error: "Too many failed attempts. Locked for 15 minutes.",
                },
                { status: 429 }
            );
        }
        return NextResponse.json(
            {
                success: false,
                error: "Invalid email or password.",
                attemptsLeft: Math.max(0, MAX_ATTEMPTS - rec.fails),
            },
            { status: 401 }
        );
    }

    // Success — clear attempts and set signed session cookie
    store.delete(key);
    const token = signSession(email);
    const res = NextResponse.json({ success: true });
    res.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: Math.floor(SESSION_TTL_MS / 1000),
    });
    return res;
}
