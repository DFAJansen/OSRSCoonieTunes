import { NextResponse } from "next/server";
import { requestedPlayer } from "@/lib/api";
import { getPetCount } from "@/lib/templeosrs";

export async function GET(request: Request) {
  try {
    const player = requestedPlayer(new URL(request.url).searchParams);
    return NextResponse.json(await getPetCount(player));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Onbekende fout" }, { status: 502 });
  }
}
