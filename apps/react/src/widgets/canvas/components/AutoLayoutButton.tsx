import { useStore } from '@/entities';
import { SquareCenterlineDashedVertical } from 'lucide-react';
import { computeAutoLayout } from '../lib/autoLayout';

export const AutoLayoutButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const setNodes = useStore((state) => state.setNodes);
  const takeSnapshot = useStore((state) => state.takeSnapshot);

  const handleLayout = () => {
    takeSnapshot();
    setNodes(computeAutoLayout(nodes, edges));
  };

  return (
    <button
      onClick={handleLayout}
      aria-label="Auto Layout"
      className="border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground absolute top-4 left-23 z-10 flex h-8.5 w-9 cursor-pointer items-center justify-center rounded-(--radius) border shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all duration-200 select-none"
    >
      <SquareCenterlineDashedVertical size={20} />
    </button>
  );
};
