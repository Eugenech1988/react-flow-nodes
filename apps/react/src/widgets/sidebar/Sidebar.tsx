import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { NodesToolbar } from '@/widgets/nodes-toolbar';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  return (
    <aside
      className={`relative h-full border-l bg-background transition-all duration-300 ease-in-out ${
        isOpen ? 'w-60' : 'w-0'
      }`}
    >
      <button
        onClick={onToggle}
        className="absolute left-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-md hover:bg-accent"
      >
        {isOpen ? <PanelLeftClose color='grey'/> : <PanelLeftOpen color='grey'/>}
      </button>

      <div className="flex h-full w-80 flex-col divide-y overflow-y-auto p-4">
        <section className="pb-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Nodes
          </h2>
          <NodesToolbar />
        </section>

        <section className="pt-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Properties
          </h2>
        </section>
      </div>
    </aside>
  );
};