export function BottomNav({ items = [], activeView, onViewChange }) {
  return (
    <nav className="panel-bottom-nav" aria-label="Left panel navigation">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`panel-nav-btn${activeView === item.id ? ' active' : ''}`}
          data-panel-view={item.id}
          aria-pressed={activeView === item.id}
          onClick={() => onViewChange?.(item.id)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}