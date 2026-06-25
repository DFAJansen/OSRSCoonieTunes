export function Drawer({ label = "View details", children }: { label?: string; children: React.ReactNode }) {
  return (
    <details className="drawer">
      <summary>{label}</summary>
      <div className="drawerBody">{children}</div>
    </details>
  );
}
