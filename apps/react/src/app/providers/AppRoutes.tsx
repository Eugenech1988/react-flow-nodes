import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/app/providers/ProtectedRoute';
import { PublicOnlyRoute } from '@/app/providers/PublicOnlyRoute';
import { AppLayout } from '@/app/AppLayout';
import { WorkflowLayout } from '@/app/WorkflowLayout';
import { LoginPage } from '@/pages/login';
import { CanvasPage } from '@/pages/canvas/CanvasPage';
import { SettingsPage, ProfileTab, AccountTab, BillingTab } from '@/pages/settings';
import { PlansPage } from '@/pages/plans';
import { PipelinesPage } from '@/pages/pipelines';
import { ExecutionsPage } from '@/pages/executions';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/reset-password" element={<LoginPage/>}/>

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route element={<WorkflowLayout />}>
            <Route index element={<CanvasPage />} />
            <Route path="/executions" element={<ExecutionsPage />} />
            {/* <Route path="/triggers" element={<TriggersPage />} /> */}
            {/* <Route path="/cron" element={<CronPage />} /> */}
          </Route>

          <Route path="/settings" element={<SettingsPage />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfileTab />} />
            <Route path="account" element={<AccountTab />} />
            <Route path="billing" element={<BillingTab />} />
          </Route>

          <Route path="/executions" element={<ExecutionsPage />} />

          <Route path="/plans" element={<PlansPage />} />
          <Route path="/pipelines" element={<PipelinesPage />} />
        </Route>

        <Route path="/profile" element={<Navigate to="/settings/profile" replace />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};