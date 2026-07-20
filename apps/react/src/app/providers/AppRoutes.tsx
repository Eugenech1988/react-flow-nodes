import { Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import { AuthForm } from '@/features/auth';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import AppLayout from '@/app/AppLayout';
import { CanvasPage } from '@/pages/canvas/CanvasPage';
import { SettingsPage, ProfileForm, AccountForm, ActiveProPlanPage } from '@/pages/settings';

const ProfileRouteWrapper = () => {
  const { profile } = useOutletContext<any>();
  return <ProfileForm form={profile.form} onSubmit={profile.onSubmit} isPristine={profile.isPristine} />;
};

const AccountRouteWrapper = () => {
  const { account } = useOutletContext<any>();
  return <AccountForm form={account.form} onSubmit={account.onSubmit} isPristine={account.isPristine} />;
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
          </Route>

          <Route path="/settings/billing" element={<ActiveProPlanPage />} />
        </Route>

        <Route path="/profile" element={<Navigate to="/settings/profile" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};