import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from '@/features/auth';
import { ProtectedRoute } from './ProtectedRoute';
import App from '@/app/App';
import { ProfilePage } from '@/pages/profile';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthForm />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<ProfilePage/>}/>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};