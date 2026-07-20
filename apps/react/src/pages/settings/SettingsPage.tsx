import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, User, Shield } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useProfileForm } from './hooks/useProfileForm';
import { useAccountForm } from './hooks/useAccountForm';
import { ProfileSidebar } from './components/ProfileSidebar';
import { Alert, AlertDescription, AlertTitle } from '@pipeline/ui';

export const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isInitialMount = useRef(true);

  const currentTab = location.pathname.split('/').pop() || 'profile';

  const profile = useProfileForm();
  const account = useAccountForm();

  const currentAlert = currentTab === 'account' ? account.alert : profile.alert;

  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  const handleTabChange = (tab: string) => {
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

  const contentVariants = {
    initial: (isInitial: boolean) => ({
      opacity: isInitial ? 1 : 0,
      y: isInitial ? 0 : 8,
    }),
    animate: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground p-6 md:p-12 transition-colors duration-300"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your account details, professional information, and security preferences.
          </p>
        </div>

        {currentAlert && (
          <Alert
            variant={currentAlert.type === 'error' ? 'destructive' : 'default'}
            className={currentAlert.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/3 text-emerald-600 dark:text-emerald-400 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400' : ''}
          >
            {currentAlert.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            <AlertTitle>{currentAlert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
            <AlertDescription>{currentAlert.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <div className="bg-muted/30 border border-border p-1 rounded-xl inline-flex gap-1 backdrop-blur-xs relative">
            <button
              onClick={() => handleTabChange('profile')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer border-0 outline-hidden relative z-10 ${
                currentTab === 'profile' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {currentTab === 'profile' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-card border border-border rounded-lg shadow-md -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                />
              )}
              <User className="w-4 h-4" />
              Profile
            </button>

            <button
              onClick={() => handleTabChange('account')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer border-0 outline-hidden relative z-10 ${
                currentTab === 'account' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {currentTab === 'account' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-card border border-border rounded-lg shadow-md -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                />
              )}
              <Shield className="w-4 h-4" />
              Account Settings
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProfileSidebar
              avatarPreview={profile.avatarPreview}
              initials={profile.initials}
              onAvatarClick={profile.handleAvatarClick}
              fileInputRef={profile.fileInputRef}
              onAvatarChange={profile.handleAvatarChange}
              firstName={profile.firstName}
              lastName={profile.lastName}
              jobTitle={profile.jobTitle}
            />

            <div className="md:col-span-2 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentTab}
                  custom={isInitialMount.current}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.28, ease: [0.21, 1.02, 0.43, 1.01] }}
                >
                  <Outlet context={{ profile, account }} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};