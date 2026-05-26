import { NavLink } from 'react-router-dom';
import { Home, Plus, Ticket, Settings, Users, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNavItems = [
  { icon: Home, label: 'Dashboard', to: '/' },
  { icon: Ticket, label: 'All Tickets', to: '/' },
];

const createNavItems = [
  { icon: Plus, label: 'New Ticket', to: '/create' },
];

const managementNavItems = [
  { icon: Users, label: 'Customers', to: '/customers' },
  { icon: BarChart3, label: 'Reports', to: '/reports' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Ticket className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">SupportCRM</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {mainNavItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )
              }
              onClick={onClose}
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}

          <div className="pt-4 pb-2">
            <span className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Create
            </span>
          </div>

          {createNavItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )
              }
              onClick={onClose}
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}

          <div className="pt-6 pb-2">
            <span className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Management
            </span>
          </div>

          {managementNavItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )
              }
              onClick={onClose}
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-sm font-medium">
              AK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">AMITH KUPPILI</p>
              <p className="text-xs text-muted-foreground truncate">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
