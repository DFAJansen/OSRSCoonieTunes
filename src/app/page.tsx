import { WarRoomLayout } from "@/components/war/WarRoomLayout";
import { buildAwards } from "@/lib/awards";
import { formatNumber } from "@/lib/format";
import { loadCorePlayerDataWithInfo } from "@/lib/player-data";
import { generateRoast } from "@/lib/roasts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { infoResults, statsResults, petResults, gainsResults, collectionResults, recent, stats, pets, gains, command, achievements } = await loadCorePlayerDataWithInfo();
  const awards = buildAwards({ stats, pets, gains, recentItems: recent.merged }).filter((award) =>
    ["Highest Total XP", "Highest Total Level", "Boss Goblin", "Biggest Grinder", "Pet Lord", "Collection Log Enjoyer", "Biggest Spoon"].includes(award.title)
  ).slice(0, 6);
  const roasts = [
    command.profiles[0] ? `${command.profiles[0].username} currently controls the war room with ${formatNumber(command.profiles[0].totalScore)} CoonieTunes points.` : generateRoast(gains.length ? gains : stats, pets),
    command.rivalry ? `${command.rivalry.left} vs ${command.rivalry.right}: ${command.rivalry.status}. ${command.rivalry.detail}` : "No rivalry detected yet. Suspiciously peaceful.",
    recent.merged[0] ? `${recent.merged[0].player} pinged loot radar: ${recent.merged[0].itemName}.` : "Loot radar is quiet for now."
  ];

  return (
    <WarRoomLayout
      command={command}
      achievements={achievements}
      awards={awards}
      roasts={roasts}
      recentItems={recent.merged}
      infoResults={infoResults}
      statsResults={statsResults}
      petsResults={petResults}
      gainsResults={gainsResults}
      collectionResults={collectionResults}
    />
  );
}
