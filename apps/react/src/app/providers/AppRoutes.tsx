import { Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import { AuthForm } from '@/features/auth';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import App from '@/app/App';
import { SettingsPage, ProfileForm, AccountForm } from '@/pages/settings';

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
        <Route path="/" element={<App />} />

        <Route path="/settings" element={<SettingsPage />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileRouteWrapper />} />
          <Route path="account" element={<AccountRouteWrapper />} />
        </Route>

        <Route path="/profile" element={<Navigate to="/settings/profile" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};