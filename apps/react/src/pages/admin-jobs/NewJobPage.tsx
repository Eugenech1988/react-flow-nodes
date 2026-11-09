import { useNavigate } from 'react-router-dom';
import { JobFormWrapper } from './components';

export function NewJobPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <JobFormWrapper
        jobId={null}
        onSuccess={() => navigate('/admin/jobs')}
        onCancel={() => navigate('/admin/jobs')}
      />
    </div>
  );
}