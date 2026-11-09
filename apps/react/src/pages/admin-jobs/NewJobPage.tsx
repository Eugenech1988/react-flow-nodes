import { useNavigate } from 'react-router-dom';
import { JobForm } from './components';

export function NewJobPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <JobForm
        jobId={null}
        onSuccess={() => navigate('/admin/jobs')}
        onCancel={() => navigate('/admin/jobs')}
      />
    </div>
  );
}