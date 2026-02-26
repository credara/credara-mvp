import { NextResponse } from "next/server";
import { seedAdminTestUsers } from "@/lib/seed-admin-users";

export const dynamic = "force-dynamic";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Only available in development" },
      { status: 403 }
    );
  }

  try {
    const result = await seedAdminTestUsers();
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Seed failed" },
      { status: 500 }
    );
  }
}
