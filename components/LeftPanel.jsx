import { BottomNav } from './BottomNav.jsx';
import { PanelContent } from './PanelContent.jsx';

export function LeftPanel({
  title = 'CRISIS CONTROL PANEL',
  icon,
  views = [],
  activeView = 'dashboard',
  navItems = [],
  onViewChange,
}) {
  return (
    <aside className="panel-left">
      <div className="panel-header">
        {icon}
        <h3>{title}</h3>
      </div>

      <div className="panel-scroll">
        <PanelContent views={views} activeView={activeView} />
      </div>

      <BottomNav items={navItems} activeView={activeView} onViewChange={onViewChange} />
    </aside>
  );
}