import { NextResponse } from "next/server";
import { requestedPlayer } from "@/lib/api";
import { getPlayerDatapoints } from "@/lib/templeosrs";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const seconds = Number(params.get("time") ?? 2592000);
    return NextResponse.json(await getPlayerDatapoints(requestedPlayer(params), Number.isFinite(seconds) ? seconds : 2592000));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Onbekende fout" }, { status: 502 });
  }
}
