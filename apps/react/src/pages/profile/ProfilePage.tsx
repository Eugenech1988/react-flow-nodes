import { ArrowLeft } from 'lucide-react';
import { useProfileForm } from './hooks/useProfileForm';
import { ProfileSidebar } from './components/ProfileSidebar';
import { ProfileForm } from './components/ProfileForm';

export const ProfilePage = () => {
  const {
    formData,
    avatarPreview,
    fileInputRef,
    handleChange,
    handleAvatarChange,
    handleAvatarClick,
    handleSubmit,
    initials,
    navigate,
  } = useProfileForm();

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-hidden"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to app
          </button>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your account details, professional information, and security preferences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProfileSidebar
            avatarPreview={avatarPreview}
            initials={initials}
            onAvatarClick={handleAvatarClick}
            fileInputRef={fileInputRef}
            onAvatarChange={handleAvatarChange}
            firstName={formData.firstName}
            lastName={formData.lastName}
            jobTitle={formData.jobTitle}
          />

          <ProfileForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};