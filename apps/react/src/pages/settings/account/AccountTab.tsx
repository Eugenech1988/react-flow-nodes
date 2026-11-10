import { TwoFactorSection, DangerZoneSection, PasswordSection } from './components';

export const AccountTab = () => {
  return (
    <div className="mx-auto max-h-[calc(100vh-12rem)] max-w-4xl space-y-6 overflow-y-auto pr-2 pb-20">
      <TwoFactorSection />
      <PasswordSection />
      <DangerZoneSection />
    </div>
  );
};
