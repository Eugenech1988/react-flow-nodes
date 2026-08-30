import { useSidebarStore } from './model';
import {
  Folder,
  KeyRound,
  History,
  Star,
  CreditCard,
  LogOut
} from 'lucide-react';

export const Sidebar = () => {
  const isOpen = useSidebarStore((state) => state.isOpen);

  const mainNavItems = [
    { label: 'Workflows', icon: Folder, href: '/workflows' },
    { label: 'Credentials', icon: KeyRound, href: '/credentials' },
    { label: 'Executions', icon: History, href: '/executions', active: true },
  ];

  const bottomNavItems = [
    { label: 'Upgrade to Pro', icon: Star, href: '/upgrade' },
    { label: 'Billing Portal', icon: CreditCard, href: '/billing' },
    { label: 'Sign out', icon: LogOut, action: () => {} },
  ];

  return (
    <aside
      className={`relative h-full border-r border-border bg-background transition-all duration-300 ease-in-out flex flex-col justify-between select-none overflow-hidden ${
        isOpen ? 'w-64' : 'w-0 border-r-0'
      }`}
    >
      {/* Верхняя панель навигации */}
      <div className="p-3 space-y-1">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                item.active
                  ? 'bg-muted text-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Нижняя панель профиля и биллинга */}
      <div className="p-3 space-y-1">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-pointer"
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};