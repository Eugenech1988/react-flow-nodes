import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { JobFormWrapper } from './components';

export function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return <Navigate to="/admin/jobs" replace />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <JobFormWrapper
        jobId={id}
        onSuccess={() => navigate('/admin/jobs')}
        onCancel={() => navigate('/admin/jobs')}
      />
    </div>
  );
}
