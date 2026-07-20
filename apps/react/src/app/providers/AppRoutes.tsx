import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from '@/features/auth';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import App from '@/app/App';
import { ProfilePage } from '@/pages/profile';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<AuthForm />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};