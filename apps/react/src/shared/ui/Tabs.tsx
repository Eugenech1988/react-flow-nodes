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
    <div className="h-11 bg-muted/40 border border-border/60 p-1.5 rounded-xl inline-flex items-center gap-1.5 backdrop-blur-md relative flex-wrap shadow-xs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`h-full flex items-center gap-2 px-4 text-sm font-medium rounded-lg transition-all cursor-pointer border-0 outline-none relative z-10 select-none ${
              isActive
                ? 'text-teal-700 dark:text-teal-300 font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-teal-500/10 dark:bg-teal-500/20 border border-teal-500/30 rounded-lg -z-10"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            {Icon && (
              <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-teal-600 dark:text-teal-400' : ''}`} />
            )}
            <span className={capitalizeLabels ? 'capitalize' : ''}>{tab.label}</span>
            {tab.badge && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold tracking-wider bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 rounded-md">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};