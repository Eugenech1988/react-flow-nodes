import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/app/providers/ProtectedRoute';
import { PublicOnlyRoute } from '@/app/providers/PublicOnlyRoute';
import { RoleGuard } from '@/app/providers/RoleGuard';
import { HomeRoute } from '@/app/providers/HomeRoute';
import { AppLayout } from '@/app/AppLayout';
import { GlobalLoader } from '@/shared/ui';
import { ErrorBoundary } from '@/app/providers/ErrorBoundary';
import { LoginPage } from '@/pages/login';

const CanvasPage = lazy(() => import('@/pages/canvas').then((m) => ({ default: m.CanvasPage })));
const PlansPage = lazy(() => import('@/pages/plans').then((m) => ({ default: m.PlansPage })));
const PipelinesPage = lazy(() =>
  import('@/pages/pipelines').then((m) => ({ default: m.PipelinesPage })),
);
const ExecutionsPage = lazy(() =>
  import('@/pages/executions').then((m) => ({ default: m.ExecutionsPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/not-found').then((m) => ({ default: m.NotFoundPage })),
);

const SettingsPage = lazy(() =>
  import('@/pages/settings').then((m) => ({ default: m.SettingsPage })),
);
const ProfileTab = lazy(() => import('@/pages/settings').then((m) => ({ default: m.ProfileTab })));
const AccountTab = lazy(() => import('@/pages/settings').then((m) => ({ default: m.AccountTab })));
const BillingTab = lazy(() => import('@/pages/settings').then((m) => ({ default: m.BillingTab })));

const JobsListPage = lazy(() =>
  import('@/pages/admin-jobs').then((m) => ({ default: m.JobsListPage })),
);
const NewJobPage = lazy(() =>
  import('@/pages/admin-jobs').then((m) => ({ default: m.NewJobPage })),
);
const EditJobPage = lazy(() =>
  import('@/pages/admin-jobs').then((m) => ({ default: m.EditJobPage })),
);

export const AppRoutes = () => (
  <ErrorBoundary>
    <Suspense fallback={<GlobalLoader />}>
      <Routes>
        <Route path="/reset-password" element={<LoginPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<HomeRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<CanvasPage />} />
              <Route path="/pipelines" element={<PipelinesPage />} />
              <Route path="/executions" element={<ExecutionsPage />} />
              <Route path="/plans" element={<PlansPage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/settings" element={<SettingsPage />}>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<ProfileTab />} />
              <Route path="account" element={<AccountTab />} />
              <Route path="billing" element={<BillingTab />} />
            </Route>
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleGuard allowedRoles={['CONTENT_MANAGER', 'SUPER_ADMIN']} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin/jobs" element={<JobsListPage />} />
              <Route path="/admin/jobs/new" element={<NewJobPage />} />
              <Route path="/admin/jobs/:id" element={<EditJobPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </ErrorBoundary>
);