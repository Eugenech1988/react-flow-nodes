import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { User, Shield, CreditCard } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { ProfileSidebar } from './components/ProfileSidebar';
import { useUser, useSubscription } from '@/shared/hooks';

export const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isInitialMount = useRef(true);
  const { user } = useUser();
  const { isProActive } = useSubscription();

  const currentTab = location.pathname.split('/').pop() || 'profile';

  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  const handleTabChange = (tab: string) => () => {
    navigate(`/settings/${tab}`);
  };

  const pageVariants: Variants = {
    initial: { opacity: 0, y: 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.21, 1.02, 0.43, 1.01] }
    }
  };

  const contentVariants: Variants = {
    initial: (isInitial: boolean) => ({
      opacity: isInitial ? 1 : 0,
      y: isInitial ? 0 : 8,
    }),
    animate: {
      opacity: 1,
      y: 0,
    },
  };

  const watchedFirstName = user?.profile?.firstName || '';
  const watchedLastName = user?.profile?.lastName || '';
  const initials = `${watchedFirstName[0] || ''}${watchedLastName[0] || ''}`.toUpperCase();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account Settings', icon: Shield },
    {
      id: 'billing',
      label: 'Billing & Plans',
      icon: CreditCard,
      badge: isProActive ? 'PRO' : undefined
    },
  ];

  return (
    <motion.div
      className="h-[calc(100vh-4rem)] bg-background text-foreground p-4 md:p-6 transition-colors duration-300 overflow-hidden flex flex-col"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-6xl mx-auto w-full space-y-8 flex-1 flex flex-col min-h-0">
        <div className="shrink-0">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your account details, professional information, and security preferences.
          </p>
        </div>

        <div className="space-y-6 flex-1 flex flex-col min-h-0">
          <div className="bg-muted/30 border border-border p-1 rounded-xl inline-flex gap-1 backdrop-blur-xs relative flex-wrap shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer border-0 outline-hidden relative z-10 ${
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-card border border-border rounded-lg shadow-md -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    />
                  )}
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start flex-1 min-h-0">
            <div className="shrink-0">
              <ProfileSidebar
                avatarPreview={user?.profile?.avatarUrl || null}
                initials={initials}
                onAvatarClick={() => navigate('/settings/profile')}
                fileInputRef={{ current: null }}
                onAvatarChange={() => {}}
                firstName={watchedFirstName}
                lastName={watchedLastName}
                jobTitle={user?.profile?.jobTitle || ''}
              />
            </div>

            <div className="md:col-span-2 h-full overflow-y-auto pr-2 pb-12 min-h-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentTab}
                  custom={isInitialMount.current}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.28, ease: [0.21, 1.02, 0.43, 1.01] }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};