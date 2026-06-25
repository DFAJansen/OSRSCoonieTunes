export function Badge({
  children,
  tone = "gold",
  title
}: {
  children: React.ReactNode;
  tone?: "gold" | "green" | "blue" | "muted" | "purple";
  title?: string;
}) {
  return (
    <span className={`softBadge ${tone}`} title={title}>
      {children}
    </span>
  );
}
