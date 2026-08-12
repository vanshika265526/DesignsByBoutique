"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Lock, Loader2, ShieldAlert } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();
    const from = params.get("from") || "/admin";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [attemptsLeft, setAttemptsLeft] = useState(null);
    const [lockedUntil, setLockedUntil] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const [loading, setLoading] = useState(false);

    // Lockout countdown
    useEffect(() => {
        if (!lockedUntil) return;
        const tick = () => {
            const ms = lockedUntil - Date.now();
            setRemaining(ms > 0 ? ms : 0);
            if (ms <= 0) {
                setLockedUntil(0);
                setError("");
                setAttemptsLeft(null);
            }
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [lockedUntil]);

    const locked = lockedUntil && remaining > 0;
    const mmss = () => {
        const s = Math.ceil(remaining / 1000);
        return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    };

    const submit = async (e) => {
        e.preventDefault();
        if (locked || loading) return;
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const json = await res.json();
            if (json.success) {
                router.replace(from);
                router.refresh();
                return;
            }
            if (json.locked && json.lockedUntil) {
                setLockedUntil(json.lockedUntil);
                setError(json.error || "Account locked.");
            } else {
                setError(json.error || "Login failed.");
                if (typeof json.attemptsLeft === "number") setAttemptsLeft(json.attemptsLeft);
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-boutique-bg px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="relative h-16 w-40 mx-auto mb-2">
                        <Image src="/images/logo.png" alt="Designs by Nisha" fill className="object-contain mix-blend-multiply" />
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-boutique-taupe font-semibold">
                        Admin Portal
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-boutique-muted-border shadow-xl p-7">
                    <div className="flex items-center gap-2 mb-5">
                        <Lock className="w-4 h-4 text-boutique-rose" />
                        <h1 className="font-serif-editorial text-xl font-bold text-boutique-charcoal">Sign in</h1>
                    </div>

                    {locked ? (
                        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-center space-y-2">
                            <ShieldAlert className="w-6 h-6 text-rose-500 mx-auto" />
                            <p className="text-sm font-semibold text-rose-700">Too many failed attempts</p>
                            <p className="text-xs text-rose-600">
                                For security, login is locked. Try again in
                            </p>
                            <p className="font-mono text-2xl font-bold text-rose-700">{mmss()}</p>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1">Email / Username</label>
                                <input
                                    type="text"
                                    autoComplete="username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@boutique"
                                    className="w-full px-3 py-2.5 bg-boutique-bg border border-boutique-muted-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-boutique-rose/40"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1">Password</label>
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-3 py-2.5 bg-boutique-bg border border-boutique-muted-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-boutique-rose/40"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-xs text-rose-600 font-medium">
                                    {error}
                                    {typeof attemptsLeft === "number" && attemptsLeft > 0 && (
                                        <span className="text-rose-500">
                                            {" "}
                                            — {attemptsLeft} attempt{attemptsLeft === 1 ? "" : "s"} left
                                        </span>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex items-center justify-center gap-2 bg-boutique-rose hover:bg-boutique-rose-dark text-white py-2.5 rounded-xl text-xs font-semibold uppercase tracking-[0.15em] transition-colors disabled:opacity-60"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {loading ? "Signing in…" : "Sign in"}
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-[11px] text-boutique-taupe mt-5">
                    Protected area · 5 attempts allowed before a temporary lock.
                </p>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}
