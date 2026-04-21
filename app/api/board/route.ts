import { NextResponse } from "next/server";
import { getBoardItems } from "@/lib/services/board";

export { corsPreflight as OPTIONS } from "@/lib/api/cors";

export const revalidate = 60;

export async function GET() {
  const data = await getBoardItems({ includePrivate: false });
  return NextResponse.json(data);
}
