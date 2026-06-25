export default function Loading() {
  return (
    <div className="panel">
      <h2 className="panelTitle">Scanning TempleOSRS...</h2>
      <div className="skeletonGrid">
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
    </div>
  );
}
