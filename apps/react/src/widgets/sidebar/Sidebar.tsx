import type { ElementType } from 'react';
import { Folder, History, LogOut, type LucideIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebarStore } from './model';
import { SidebarToggle } from '@/widgets/sidebar/components';

interface NavItem {
  label: string;
  icon: LucideIcon | ElementType;
  href?: string;
  action?: () => void;
}

export const Sidebar = () => {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const location = useLocation();
  const navigate = useNavigate();

  const mainNavItems: NavItem[] = [
    { label: 'Pipelines', icon: Folder, href: '/pipelines' },
    { label: 'Executions', icon: History, href: '/executions' },
  ];

  const bottomNavItems: NavItem[] = [
    { label: 'Sign out', icon: LogOut, action: () => {} },
  ];

  const itemClassName = (isActive?: boolean) =>
    `flex h-10 w-full cursor-pointer items-center overflow-hidden rounded-lg px-[13px] text-sm font-medium select-none transition-[background-color,color] duration-200 ${
      isActive
        ? 'bg-muted font-semibold text-foreground'
        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
    }`;

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = item.href ? location.pathname === item.href : false;

    return (
      <div
        key={item.label}
        onClick={() => {
          if (item.href) {
            navigate(item.href);
          }

          if (item.action) {
            item.action();
          }
        }}
        className={itemClassName(isActive)}
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
      </div>
    );
  };

  return (
    <aside
      className={`relative flex h-full shrink-0 flex-col justify-between overflow-hidden border-r border-border bg-background select-none ${
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

      <div className="space-y-1 p-2">
        {bottomNavItems.map(renderNavItem)}
      </div>
    </aside>
  );
};