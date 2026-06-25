export function Accordion({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="accordion" open={open}>
      <summary>{title}</summary>
      <div>{children}</div>
    </details>
  );
}
