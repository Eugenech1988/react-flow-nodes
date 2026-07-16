import { useStore } from '@/entities';
import { useAutoLayout } from '@/shared/lib/hooks';
import { SquareCenterlineDashedVertical } from 'lucide-react';

export const AutoLayoutButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const setNodes = useStore((state) => state.setNodes);
  const layoutedNodes = useAutoLayout(nodes, edges);

  const handleLayout = () => {
    setNodes(layoutedNodes);
  };

  return (
    <button
      onClick={handleLayout}
      aria-label="Auto Layout"
      className="absolute top-4 left-23 z-10 flex items-center justify-center h-8.5 w-9 cursor-pointer select-none transition-all duration-200 bg-[var(--card)] border border-[var(--border)] text-[var(--card-foreground)] rounded-[var(--radius)] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
    >
      <SquareCenterlineDashedVertical size={20} />
    </button>
  );
};