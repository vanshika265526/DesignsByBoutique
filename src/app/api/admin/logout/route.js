// Always run on request - never let Next cache this handler's response.
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/adminAuth";


export const runtime = "nodejs";

function clear() {
    const res = NextResponse.json({ success: true });
    res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
    return res;
}

export async function POST() {
    return clear();
}
export async function GET() {
    return clear();
}
