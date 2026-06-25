import { PLAYER_NAMES } from "./players";
import { errorToMessage } from "./format";
import type { ApiResult, Period } from "./types";

export async function safePlayerCall<T>(player: string, loader: (player: string) => Promise<T>): Promise<ApiResult<T>> {
  try {
    return { player, ok: true, data: await loader(player) };
  } catch (error) {
    return { player, ok: false, status: "error", error: errorToMessage(error) };
  }
}

export function requestedPlayer(searchParams: URLSearchParams): string {
  return searchParams.get("player")?.trim() || PLAYER_NAMES[0];
}

export function requestedPeriod(searchParams: URLSearchParams): Period {
  const period = searchParams.get("period") ?? searchParams.get("time") ?? "week";
  return ["day", "week", "month", "year", "cday", "cweek", "cmonth", "cyear"].includes(period)
    ? (period as Period)
    : "week";
}
