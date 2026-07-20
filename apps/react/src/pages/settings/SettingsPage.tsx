import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, User, Shield } from 'lucide-react';
import { useProfileForm } from './hooks/useProfileForm';
import { useAccountForm } from './hooks/useAccountForm';
import { ProfileSidebar } from './components/ProfileSidebar';
import { Alert, AlertDescription, AlertTitle } from '@pipeline/ui';

export const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = location.pathname.split('/').pop() || 'profile';

  const profile = useProfileForm();
  const account = useAccountForm();

  const currentAlert = currentTab === 'account' ? account.alert : profile.alert;

  const handleTabChange = (tab: string) => {
    navigate(`/settings/${tab}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 transition-colors duration-300">
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
          <div className="bg-muted/30 border border-border p-1 rounded-xl inline-flex gap-1 backdrop-blur-xs">
            <button
              onClick={() => handleTabChange('profile')}
              data-state={currentTab === 'profile' ? 'active' : 'inactive'}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-muted-foreground transition-all cursor-pointer border-0 outline-hidden data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs hover:text-foreground"
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => handleTabChange('account')}
              data-state={currentTab === 'account' ? 'active' : 'inactive'}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-muted-foreground transition-all cursor-pointer border-0 outline-hidden data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs hover:text-foreground"
            >
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

            <div className="md:col-span-2">
              <Outlet context={{ profile, account }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};