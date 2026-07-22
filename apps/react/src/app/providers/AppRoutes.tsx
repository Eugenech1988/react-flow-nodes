import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from '@/features/auth';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import AppLayout from '@/app/AppLayout';
import { CanvasPage } from '@/pages/canvas/CanvasPage';
import { SettingsPage, ProfileForm, AccountForm } from '@/pages/settings';
import { BillingPage } from '@/pages/billing';
import { PlansPage } from '@/pages/plans';
import { PipelinesPage } from '@/pages/pipelines';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';
import { useProfileForm } from '@/pages/settings/hooks/useProfileForm';
import { useAccountForm } from '@/pages/settings/hooks/useAccountForm';

const ProfileRouteWrapper = () => {
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

const AccountRouteWrapper = () => {
  const account = useAccountForm();
  return (
    <AccountForm
      form={account.form}
      alert={account.alert}
      onSubmit={account.onSubmit}
      isPristine={account.isPristine}
      isPending={account.isPending}
      user2fa={account.user2fa}
      onToggle2fa={account.onToggle2fa}
      is2faPending={account.is2faPending}
      onDeleteAccount={account.onDeleteAccount}
      isDeletePending={account.isDeletePending}
    />
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<AuthForm />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<CanvasPage />} />

          <Route path="/settings" element={<SettingsPage />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfileRouteWrapper />} />
            <Route path="account" element={<AccountRouteWrapper />} />
            <Route path="billing" element={<BillingPage />} />
          </Route>

          <Route path="/plans" element={<PlansPage />} />
          <Route path="/pipelines" element={<PipelinesPage />}></Route>
        </Route>

        <Route path="/profile" element={<Navigate to="/settings/profile" replace />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};