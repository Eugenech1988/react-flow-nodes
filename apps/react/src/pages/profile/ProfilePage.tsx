import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useProfileForm } from './hooks/useProfileForm';
import { ProfileSidebar } from './components/ProfileSidebar';
import { ProfileForm } from './components/ProfileForm';
import { Alert, AlertDescription, AlertTitle } from '@pipeline/ui';

export const ProfilePage = () => {
  const {
    form,
    avatarPreview,
    fileInputRef,
    handleAvatarChange,
    handleAvatarClick,
    onSubmit,
    initials,
    firstName,
    lastName,
    jobTitle,
    alert,
    isPristine
  } = useProfileForm();

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your account details, professional information, and security preferences.
          </p>
        </div>

        {alert && (
          <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className={alert.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/3 text-emerald-600 dark:text-emerald-400 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400' : ''}>
            {alert.type === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <AlertTitle>{alert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProfileSidebar
            avatarPreview={avatarPreview}
            initials={initials}
            onAvatarClick={handleAvatarClick}
            fileInputRef={fileInputRef}
            onAvatarChange={handleAvatarChange}
            firstName={firstName}
            lastName={lastName}
            jobTitle={jobTitle}
          />

          <ProfileForm
            form={form}
            onSubmit={onSubmit}
            isPristine={isPristine}
          />
        </div>
      </div>
    </div>
  );
};