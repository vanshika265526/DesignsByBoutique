import { NextResponse } from "next/server";

const SESSION_COOKIE = "db_admin_session";
const AUTH_SECRET =
    process.env.AUTH_SECRET || "7e7cb0bd18e196f4a7cbad7f87f302e3092b592e7ad1b3810383eaee22118703";

function b64urlToBytes(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    const pad = s.length % 4 ? 4 - (s.length % 4) : 0;
    s += "=".repeat(pad);
    const bin = atob(s);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
}

async function isValid(token) {
    try {
        if (!token) return false;
        const [body, sig] = token.split(".");
        if (!body || !sig) return false;
        const enc = new TextEncoder();
        const key = await crypto.subtle.importKey(
            "raw",
            enc.encode(AUTH_SECRET),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify"]
        );
        const ok = await crypto.subtle.verify("HMAC", key, b64urlToBytes(sig), enc.encode(body));
        if (!ok) return false;
        const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(body)));
        if (!payload.exp || payload.exp < Date.now()) return false;
        // A pre-auth (password-only) token is not a full session.
        if (payload.stage === "pre") return false;
        return true;
    } catch {
        return false;
    }
}

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const authed = await isValid(token);

    // Admin pages
    if (pathname.startsWith("/admin")) {
        if (pathname.startsWith("/admin/login")) {
            if (authed) return NextResponse.redirect(new URL("/admin", request.url));
            return NextResponse.next();
        }
        if (!authed) {
            const url = new URL("/admin/login", request.url);
            if (pathname !== "/admin") url.searchParams.set("from", pathname);
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // Data API — protect mutations only (public GETs still work)
    if (pathname.startsWith("/api/data")) {
        const method = request.method.toUpperCase();
        if (["POST", "PATCH", "PUT", "DELETE"].includes(method) && !authed) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/data/:path*"],
};
