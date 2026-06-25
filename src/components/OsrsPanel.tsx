export function OsrsPanel({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="panel">
      {title ? <h2 className="panelTitle">{title}</h2> : null}
      {children}
    </section>
  );
}
