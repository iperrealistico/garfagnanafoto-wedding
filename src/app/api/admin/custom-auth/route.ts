import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env-adapter";

export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json();

        if (!password || password !== env.admin.password) {
            return NextResponse.json({ error: "Wrong password" }, { status: 401 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
