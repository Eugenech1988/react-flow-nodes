import { ProfileForm } from './components';
import { useProfileForm } from './hooks';

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