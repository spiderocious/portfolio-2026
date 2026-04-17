import { NextResponse } from "next/server";
import { getPublicStats } from "@/lib/services/stats";

export const revalidate = 60;

export async function GET() {
  const stats = await getPublicStats();
  return NextResponse.json(stats);
}
