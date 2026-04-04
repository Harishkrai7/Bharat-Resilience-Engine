export function PanelContent({ views = [], activeView, className = '' }) {
  return (
    <div className={`panel-views ${className}`.trim()}>
      {views.map((view) => (
        <section
          key={view.id}
          className={`panel-view${activeView === view.id ? ' active' : ''}`}
          data-panel-view={view.id}
          hidden={activeView !== view.id}
          aria-hidden={activeView !== view.id}
          aria-label={view.label}
        >
          {typeof view.render === 'function' ? view.render() : view.content}
        </section>
      ))}
    </div>
  );
}