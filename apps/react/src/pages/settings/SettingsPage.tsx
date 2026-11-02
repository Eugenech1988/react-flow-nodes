import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { ProfileSidebar } from './components';
import { Tabs } from '@/shared/ui';
import { PAGE_VARIANTS, SETTINGS_CONTENT_VARIANTS } from '@/shared/lib';
import { SETTINGS_TABS } from './model';
import { useUser } from '@/shared/hooks';

export const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isInitialMount = useRef(true);
  const { isProActive } = useUser();

  const currentTab = location.pathname.split('/').pop() || 'profile';

  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  const handleTabChange = (tabId: string) => {
    navigate(`/settings/${tabId}`);
  };

  return (
    <motion.div
      className="bg-background text-foreground p-4 transition-colors duration-300 md:p-6"
      variants={PAGE_VARIANTS}
      initial="initial"
      animate="animate"
    >
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your account details, professional information, and security preferences.
          </p>
        </div>

        <div className="space-y-6">
          <Tabs
            layoutId="settings-tabs"
            tabs={SETTINGS_TABS(isProActive)}
            currentTab={currentTab}
            onTabChange={handleTabChange}
          />

          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
            <div className="sticky top-20 self-start md:col-span-1">
              <ProfileSidebar />
            </div>

            <div className="md:col-span-2">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentTab}
                  custom={isInitialMount.current}
                  variants={SETTINGS_CONTENT_VARIANTS}
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
