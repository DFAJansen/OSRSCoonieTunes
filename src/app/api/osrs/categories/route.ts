import { NextResponse } from "next/server";
import { getCollectionCategories } from "@/lib/templeosrs";

export async function GET() {
  try {
    return NextResponse.json(await getCollectionCategories());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Onbekende fout" }, { status: 502 });
  }
}
