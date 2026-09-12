import { Link } from 'react-router-dom';
import { useSidebarStore } from './model';
import { Folder, KeyRound, History, Star, CreditCard, LogOut } from 'lucide-react';

export const Sidebar = () => {
  const isOpen = useSidebarStore((state) => state.isOpen);

  const mainNavItems = [
    { label: 'Workflows', icon: Folder, href: '/workflows' },
    { label: 'Credentials', icon: KeyRound, href: '/credentials' },
    { label: 'Executions', icon: History, href: '/executions' },
  ];

  const bottomNavItems = [
    { label: 'Upgrade to Pro', icon: Star, href: '/upgrade' },
    { label: 'Billing Portal', icon: CreditCard, href: '/billing' },
    { label: 'Sign out', icon: LogOut, action: () => {} },
  ];

  const itemClassName = (isActive?: boolean) =>
    `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
      isActive
        ? 'bg-muted text-foreground font-semibold'
        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
    }`;

  const renderNavItem = (item: {
    label: string;
    icon: any;
    href?: string;
    action?: () => void;
    active?: boolean;
  }) => {
    const Icon = item.icon;
    const content = (
      <>
        <Icon className="h-4 w-4 shrink-0" />
        <span>{item.label}</span>
      </>
    );

    if (item.href) {
      return (
        <Link key={item.label} to={item.href} className={itemClassName(item.active)}>
          {content}
        </Link>
      );
    }

    return (
      <button key={item.label} onClick={item.action} className={itemClassName(item.active)}>
        {content}
      </button>
    );
  };

  return (
    <aside
      className={`border-border bg-background relative flex h-full flex-col justify-between overflow-hidden border-r transition-all duration-300 ease-in-out select-none ${
        isOpen ? 'w-64' : 'w-0 border-r-0'
      }`}
    >
      <div className="space-y-1 p-3">{mainNavItems.map(renderNavItem)}</div>

      <div className="space-y-1 p-3">{bottomNavItems.map(renderNavItem)}</div>
    </aside>
  );
};
