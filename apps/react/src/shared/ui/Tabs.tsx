import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string;
}

interface TabsProps {
  tabs: TabItem[];
  currentTab: string;
  onTabChange: (tabId: string) => void;
  layoutId?: string;
  capitalizeLabels?: boolean;
}

export const Tabs = ({
  tabs,
  currentTab,
  onTabChange,
  layoutId = 'activeTabIndicator',
  capitalizeLabels = false,
}: TabsProps) => {
  return (
    <div className="bg-muted/40 border-border/60 relative inline-flex h-11 flex-wrap items-center gap-1.5 rounded-xl border p-1.5 shadow-xs backdrop-blur-md">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative z-10 flex h-full cursor-pointer items-center gap-2 rounded-lg border-0 px-4 text-sm font-medium transition-all outline-none select-none ${
              isActive
                ? 'font-semibold text-teal-700 shadow-xs dark:text-teal-300'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 -z-10 rounded-lg border border-teal-500/30 bg-teal-500/10 dark:bg-teal-500/20"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            {Icon && (
              <Icon
                className={`h-4 w-4 transition-colors ${isActive ? 'text-teal-600 dark:text-teal-400' : ''}`}
              />
            )}
            <span className={capitalizeLabels ? 'capitalize' : ''}>{tab.label}</span>
            {tab.badge && (
              <span className="ml-1 rounded-md border border-teal-500/30 bg-teal-500/15 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-teal-700 dark:text-teal-300">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
