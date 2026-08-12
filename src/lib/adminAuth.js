// Admin authentication helpers (Node runtime only — uses node:crypto).
// Values can be overridden with environment variables (recommended for production).
import crypto from "crypto";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@boutique";

// scrypt hash of the admin password, format "salt:hash".
// Default corresponds to the password set during setup; override via env in production.
export const ADMIN_PASSWORD_HASH =
    process.env.ADMIN_PASSWORD_HASH ||
    "a5eabd41e2dbcde445557e43a58e68f6:9e3b213402d48400a641dfdb2c8c96d6a2123b8c3614a0fe04d59311ab1572308cd2b14b244f99e095b1321324a96252ee5c99f7d9ace2f113bbe6b66dc7c4c3";

// HMAC secret for signing the session cookie. CHANGE THIS via env in production.
export const AUTH_SECRET =
    process.env.AUTH_SECRET || "7e7cb0bd18e196f4a7cbad7f87f302e3092b592e7ad1b3810383eaee22118703";

export const SESSION_COOKIE = "db_admin_session";
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

// Rate-limit config
export const MAX_ATTEMPTS = 5;
export const LOCK_MS = 15 * 60 * 1000; // 15 minutes lockout after 5 failures

export function verifyPassword(password, stored = ADMIN_PASSWORD_HASH) {
    try {
        const [salt, key] = stored.split(":");
        if (!salt || !key) return false;
        const derived = crypto.scryptSync(String(password), salt, 64);
        const keyBuf = Buffer.from(key, "hex");
        if (keyBuf.length !== derived.length) return false;
        return crypto.timingSafeEqual(keyBuf, derived);
    } catch {
        return false;
    }
}

// Sign a session token: base64url(payload).base64url(hmac)
export function signSession(email) {
    const payload = { sub: email, exp: Date.now() + SESSION_TTL_MS };
    const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const sig = crypto.createHmac("sha256", AUTH_SECRET).update(body).digest("base64url");
    return `${body}.${sig}`;
}

// Verify token (Node side — for route handlers)
export function verifySession(token) {
    try {
        if (!token) return null;
        const [body, sig] = token.split(".");
        if (!body || !sig) return null;
        const expected = crypto.createHmac("sha256", AUTH_SECRET).update(body).digest("base64url");
        const a = Buffer.from(sig);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
        const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
        if (!payload.exp || payload.exp < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
}

// Shared in-memory attempt store (survives HMR in dev via globalThis)
export function getAttemptStore() {
    if (!globalThis.__adminLoginAttempts) {
        globalThis.__adminLoginAttempts = new Map();
    }
    return globalThis.__adminLoginAttempts;
}
