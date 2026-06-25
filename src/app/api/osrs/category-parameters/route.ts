import { NextResponse } from "next/server";
import { getCategoryParameters } from "@/lib/templeosrs";

export async function GET() {
  try {
    return NextResponse.json(await getCategoryParameters());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Onbekende fout" }, { status: 502 });
  }
}
