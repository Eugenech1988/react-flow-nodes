import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type HeaderTabId = 'editor' | 'executions' | 'tests';

interface HeaderTab {
  id: HeaderTabId;
  label: string;
}

const TABS: readonly HeaderTab[] = [
  { id: 'editor', label: 'Editor' },
  { id: 'executions', label: 'Executions' },
  { id: 'tests', label: 'Tests' },
] as const;

interface HeaderTabsProps {
  onTabChange?: (tabId: HeaderTabId) => void;
  defaultTab?: HeaderTabId;
}

export const HeaderTabs = ({ onTabChange, defaultTab = 'editor' }: HeaderTabsProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<HeaderTabId>(defaultTab);

  const handleTabClick = (tabId: HeaderTabId) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
    navigate('/');
  };

  const preventNavigation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="bg-foreground/3 border-border/50 absolute left-1/2 flex -translate-x-1/2 rounded-lg border p-1 text-sm"
      onClick={preventNavigation}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`relative z-10 cursor-pointer rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              isActive ? 'text-foreground' : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="header-active-tab-indicator"
                className="bg-card border-border/40 absolute inset-0 z-[-1] rounded-md border shadow-xs"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
