import { TwoFactorSection, DangerZoneSection, PasswordSection } from './components';

export const AccountTab = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <TwoFactorSection />
      <PasswordSection />
      <DangerZoneSection />
    </div>
  );
};
