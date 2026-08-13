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

// Second-factor secret code (step 2 after the password). Override via env in prod.
export const SECRET_CODE = process.env.ADMIN_SECRET_CODE || "1234";
// Short-lived cookie proving the password step passed, while the code is entered.
export const PREAUTH_COOKIE = "db_admin_pre";
export const PREAUTH_TTL_MS = 10 * 60 * 1000; // 10 minutes to enter the code

// Rate-limit config
export const MAX_ATTEMPTS = 5;
export const LOCK_MS = 5 * 60 * 1000; // 5 minutes lockout after 5 failed attempts
export const LOCK_MINUTES = Math.round(LOCK_MS / 60000);

// Constant-time check of the second-factor secret code.
export function verifyCode(code) {
    try {
        const a = Buffer.from(String(code));
        const b = Buffer.from(String(SECRET_CODE));
        if (a.length !== b.length) return false;
        return crypto.timingSafeEqual(a, b);
    } catch {
        return false;
    }
}

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

// Sign a token: base64url(payload).base64url(hmac)
function sign(payload) {
    const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const sig = crypto.createHmac("sha256", AUTH_SECRET).update(body).digest("base64url");
    return `${body}.${sig}`;
}

function verify(token) {
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
}

// Full admin session (granted only after BOTH password and secret code pass).
export function signSession(email) {
    return sign({ sub: email, stage: "full", exp: Date.now() + SESSION_TTL_MS });
}

export function verifySession(token) {
    try {
        const payload = verify(token);
        if (!payload) return null;
        // A pre-auth (password-only) token must never count as a full session.
        if (payload.stage === "pre") return null;
        return payload;
    } catch {
        return null;
    }
}

// Pre-auth token: proves the password step passed, pending the secret code.
export function signPreAuth(email) {
    return sign({ sub: email, stage: "pre", exp: Date.now() + PREAUTH_TTL_MS });
}

export function verifyPreAuth(token) {
    try {
        const payload = verify(token);
        if (!payload || payload.stage !== "pre") return null;
        return payload;
    } catch {
        return null;
    }
}

// Shared in-memory attempt store (fallback for dev / DB outages; survives HMR via globalThis).
export function getAttemptStore() {
    if (!globalThis.__adminLoginAttempts) {
        globalThis.__adminLoginAttempts = new Map();
    }
    return globalThis.__adminLoginAttempts;
}

// Persistent brute-force lockout store, keyed by client IP.
//
// On serverless (Vercel) the in-memory Map is per-instance and wiped on cold
// start, so the lockout is unreliable. These helpers persist attempt counters
// in MongoDB Atlas so the "5 strikes → 5 minute lock" holds across every
// instance and restart. If the database is unreachable they transparently fall
// back to the in-memory store so login still functions.
const ATTEMPTS_COLLECTION = "adminLoginAttempts";

export async function readAttempt(ip) {
    try {
        const { getDatabase } = await import("./mongodb");
        const db = await getDatabase();
        const doc = await db.collection(ATTEMPTS_COLLECTION).findOne({ _id: ip });
        return { fails: doc?.fails || 0, lockedUntil: doc?.lockedUntil || 0 };
    } catch {
        return getAttemptStore().get(ip) || { fails: 0, lockedUntil: 0 };
    }
}

export async function writeAttempt(ip, rec) {
    const value = { fails: rec.fails || 0, lockedUntil: rec.lockedUntil || 0 };
    try {
        const { getDatabase } = await import("./mongodb");
        const db = await getDatabase();
        await db.collection(ATTEMPTS_COLLECTION).updateOne(
            { _id: ip },
            { $set: { ...value, updatedAt: new Date() } },
            { upsert: true }
        );
    } catch {
        getAttemptStore().set(ip, value);
    }
}

export async function clearAttempts(ip) {
    try {
        const { getDatabase } = await import("./mongodb");
        const db = await getDatabase();
        await db.collection(ATTEMPTS_COLLECTION).deleteOne({ _id: ip });
    } catch {
        getAttemptStore().delete(ip);
    }
}
