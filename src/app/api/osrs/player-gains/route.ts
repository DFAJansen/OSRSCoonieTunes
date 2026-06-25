import { NextResponse } from "next/server";
import { requestedPeriod, requestedPlayer } from "@/lib/api";
import { getPlayerGains } from "@/lib/templeosrs";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    return NextResponse.json(await getPlayerGains(requestedPlayer(params), requestedPeriod(params)));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Onbekende fout" }, { status: 502 });
  }
}
