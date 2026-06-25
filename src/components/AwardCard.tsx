import type { Award } from "@/lib/types";

export function AwardCard({ award }: { award: Award }) {
  return (
    <div className="card awardCard">
      <h3>{award.title}</h3>
      <div className="metric">{award.player}</div>
      <p className="muted">{award.detail}</p>
    </div>
  );
}
