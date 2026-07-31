import { TwoFactorSection, DangerZoneSection, PasswordSection } from './components';

export const AccountTab = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <TwoFactorSection />
      <PasswordSection />
      <DangerZoneSection />
    </div>
  );
};