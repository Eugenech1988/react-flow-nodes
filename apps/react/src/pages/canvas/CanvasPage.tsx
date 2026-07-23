import { NodesToolbar } from '@/widgets/nodes-toolbar';
import { Canvas } from '@/widgets/canvas';

export const CanvasPage = () => {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <NodesToolbar/>
      <Canvas/>
    </div>
  );
};