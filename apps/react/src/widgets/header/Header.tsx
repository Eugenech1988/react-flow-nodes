import { CloudCheck, Settings, Share2 } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/features/theme-toggle';
import logo from '@/assets/logo.svg';
import { UserDropdown } from '@/features/user-dropdown';
import { WorkflowExecutionControl } from './components/WorkflowExecutionControl';

const TABS = [
  { id: 'editor', label: 'Editor' },
  { id: 'executions', label: 'Executions' },
  { id: 'tests', label: 'Tests' },
] as const;

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  // Локальное состояние активной табы
  const [activeTab, setActiveTab] = useState<'editor' | 'executions' | 'tests'>('editor');

  const handleTabClick = (tabId: 'editor' | 'executions' | 'tests') => {
    setActiveTab(tabId);
    navigate('/');
  };

  const handleHeaderClick = () => {
    if (!isHome) {
      navigate('/');
    }
  };

  const preventNavigation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <header
      className={`flex h-14 fixed bg-background top-0 w-full items-center justify-between px-6 bg-header-bg border-b border-border z-40 shrink-0 transition-colors duration-300 ${
        !isHome ? 'cursor-pointer hover:bg-foreground/1' : ''
      }`}
      onClick={handleHeaderClick}
    >
      <div className="flex items-center gap-4 w-[320px]" onClick={preventNavigation}>
        <Link to="/">
          <img className="h-6 w-auto object-contain" src={logo} alt="Pipeline logo"/>
        </Link>
        <div className="h-4 w-px bg-border"/>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground truncate">untitled_pipeline_1</span>
          <CloudCheck className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex bg-foreground/3 p-1 rounded-lg border border-border/50 text-sm" onClick={preventNavigation}>
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

      <div className="flex items-center gap-3 w-[320px] justify-end" onClick={preventNavigation}>
        <WorkflowExecutionControl/>
        <button
          className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium border border-border bg-card hover:bg-foreground/3 rounded-md cursor-pointer transition-colors">
          <Share2 className="w-3.5 h-3.5"/>
          Share
        </button>

        <button
          className="p-2 text-foreground/70 hover:text-foreground hover:bg-foreground/3 border border-transparent hover:border-border rounded-md cursor-pointer transition-all">
          <Settings className="w-4 h-4"/>
        </button>

        <ThemeToggle/>

        <div className="h-4 w-px bg-border"/>

        <UserDropdown/>
      </div>
    </header>
  );
};