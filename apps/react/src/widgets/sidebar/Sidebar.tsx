import { NodesToolbar } from '@/widgets/nodes-toolbar';
import { useSidebarStore } from './model';

export const Sidebar = () => {
  const isOpen = useSidebarStore((state) => state.isOpen);
  return (
    <aside
      className={`relative h-full border-l bg-background transition-all duration-300 ease-in-out ${
        isOpen ? 'w-60' : 'w-0'
      }`}
    >
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