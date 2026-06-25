import { cookies } from "next/headers";
import { ACTIVE_PARTY_COOKIE, getDefaultActiveParty, parseActivePartyCookie, type ActivePartySlot } from "./settings";

export async function getServerActiveParty(): Promise<ActivePartySlot[]> {
  try {
    const store = await cookies();
    return parseActivePartyCookie(store.get(ACTIVE_PARTY_COOKIE)?.value);
  } catch {
    return getDefaultActiveParty();
  }
}
