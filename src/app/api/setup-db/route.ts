import { NextResponse } from "next/server";
import { ensureD1DatabaseReady } from "@/lib/ensure-d1";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureD1DatabaseReady();
    return NextResponse.json({
      success: true,
      message: "Cloudflare D1 database initialized and seeded successfully!",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to initialize D1 database",
      },
      { status: 500 }
    );
  }
}
