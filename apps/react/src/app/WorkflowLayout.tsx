import { Sidebar } from '@/widgets/sidebar';
import { Outlet } from 'react-router-dom';

export const WorkflowLayout = () => {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full min-w-0 transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
};