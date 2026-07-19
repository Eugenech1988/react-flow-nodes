import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from '@/features/auth';
import { ProtectedRoute } from './ProtectedRoute';
import App from '../App';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthForm />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<App />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};