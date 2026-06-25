export function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="infoTooltip" title={text} aria-label={text}>
      ?
    </span>
  );
}
