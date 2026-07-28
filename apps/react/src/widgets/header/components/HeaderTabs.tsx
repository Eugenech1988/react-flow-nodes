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
      className="absolute left-1/2 -translate-x-1/2 flex bg-foreground/3 p-1 rounded-lg border border-border/50 text-sm"
      onClick={preventNavigation}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`relative px-3 py-1 rounded-md text-sm font-medium cursor-pointer transition-colors z-10 ${
              isActive ? 'text-foreground' : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="header-active-tab-indicator"
                className="absolute inset-0 bg-card rounded-md shadow-xs border border-border/40 z-[-1]"
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