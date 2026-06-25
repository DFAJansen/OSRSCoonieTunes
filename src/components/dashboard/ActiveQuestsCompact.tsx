import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatNumber } from "@/lib/format";
import type { PartyQuest } from "@/lib/quests";

export function ActiveQuestsCompact({ quests }: { quests: PartyQuest[] }) {
  return (
    <div className="questList compactQuests">
      {quests.map((quest) => (
        <div className="quest" key={quest.title}>
          <div>
            <strong>{quest.title}</strong>
            <p className="muted">{formatNumber(quest.progress)} / {formatNumber(quest.target)} {quest.unit}</p>
          </div>
          <div>
            <ProgressBar value={(quest.progress / quest.target) * 100} />
            <p className="muted">{quest.reward}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
