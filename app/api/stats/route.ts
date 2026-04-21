import { NextResponse } from "next/server";
import { getPublicStats } from "@/lib/services/stats";

export { corsPreflight as OPTIONS } from "@/lib/api/cors";

export const revalidate = 60;

export async function GET() {
  const stats = await getPublicStats();
  return NextResponse.json(stats);
}
