import { ProfileForm } from '@/pages/settings';
import { useProfileForm } from '../hooks/useProfileForm';

export const ProfileTab = () => {
  const profile = useProfileForm();

  return (
    <ProfileForm
      alert={profile.alert}
      form={profile.form}
      onSubmit={profile.onSubmit}
      isPristine={profile.isPristine}
      isPending={profile.isPending}
    />
  );
};