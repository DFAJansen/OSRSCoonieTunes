import { AwardCard } from "@/components/AwardCard";
import type { Award } from "@/lib/types";

export function WeeklyAwardsStrip({ awards }: { awards: Award[] }) {
  return (
    <div className="awardStrip calmStrip">
      {awards.map((award) => (
        <AwardCard award={award} key={award.title} />
      ))}
    </div>
  );
}
