import type { ElementType } from 'react';
import { Workflow, History, BoxSelect, LogOut, Briefcase, type LucideIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser, useLogout } from '@/shared/hooks';
import { useSidebarStore } from './model';
import { SidebarToggle } from './components';

interface NavItem {
  label: string;
  icon: LucideIcon | ElementType;
  href?: string;
  action?: () => void;
  isDanger?: boolean;
}

export const Sidebar = () => {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const location = useLocation();
  const navigate = useNavigate();
  const { role, isLoading } = useUser();
  const { logout, isLoggingOut } = useLogout();

  const isContentManager = role === 'CONTENT_MANAGER';
  const isSuperAdmin = role === 'SUPER_ADMIN';

  const showProductNav = !isContentManager; // SUPER_ADMIN — не CONTENT_MANAGER → true
  const showAdminNav = isContentManager || isSuperAdmin;

  const mainNavItems: NavItem[] = [
    ...(showProductNav
      ? [
          { label: 'Studio', icon: BoxSelect, href: '/' },
          { label: 'Pipelines', icon: Workflow, href: '/pipelines' },
          { label: 'Executions', icon: History, href: '/executions' },
        ]
      : []),
    ...(showAdminNav ? [{ label: 'Job Vacancies', icon: Briefcase, href: '/admin/jobs' }] : []),
  ];

  const bottomNavItems: NavItem[] = [
    {
      label: isLoggingOut ? 'Signing out…' : 'Sign out',
      icon: LogOut,
      action: () => logout(),
      isDanger: true,
    },
  ];

  const itemClassName = (isActive?: boolean, isDanger?: boolean) =>
    `flex h-10 w-full cursor-pointer items-center overflow-hidden rounded-lg px-[13px] text-sm font-medium select-none transition-[background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
      isDanger
        ? 'text-destructive hover:bg-destructive/10 hover:text-destructive'
        : isActive
          ? 'bg-muted font-semibold text-foreground'
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
    }`;

  const isItemActive = (href?: string) => {
    if (!href) return false;
    if (href === '/') return location.pathname === '/';
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = isItemActive(item.href);

    const handleClick = () => {
      if (item.action) {
        item.action();
        return;
      }
      if (item.href) navigate(item.href);
    };

    return (
      <button
        key={item.label}
        type="button"
        onClick={handleClick}
        disabled={isLoggingOut && item.isDanger}
        title={!isOpen ? item.label : undefined}
        aria-current={isActive ? 'page' : undefined}
        className={itemClassName(isActive, item.isDanger)}
      >
        <div className="flex w-54 shrink-0 items-center gap-3">
          <Icon className="h-4 w-4 shrink-0" />
          <span
            className={`whitespace-nowrap transition-[opacity,transform] ${
              isOpen
                ? 'translate-x-0 opacity-100 duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]'
                : '-translate-x-2 opacity-0 duration-150 ease-in'
            }`}
          >
            {item.label}
          </span>
        </div>
      </button>
    );
  };

  if (isLoading) return null;

  return (
    <aside
      className={`border-border bg-background relative flex h-full shrink-0 flex-col justify-between overflow-hidden border-r select-none ${
        isOpen
          ? 'w-64 transition-[width] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]'
          : 'w-15 transition-[width] duration-200 ease-in'
      }`}
    >
      <div className="space-y-1 p-2">
        <div className="relative flex h-10 items-center">
          <div
            className={`absolute inset-0 flex items-center ${
              isOpen ? 'justify-end pr-1.5' : 'justify-center'
            }`}
          >
            <SidebarToggle />
          </div>
        </div>

        {mainNavItems.map(renderNavItem)}
      </div>

      <div className="space-y-1 p-2">{bottomNavItems.map(renderNavItem)}</div>
    </aside>
  );
};
