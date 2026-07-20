import { NodesToolbar } from '@/widgets/nodes-toolbar';
import { Canvas } from '@/widgets/canvas';
import { ReactFlowProvider } from '@xyflow/react';

export const CanvasPage = () => {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <NodesToolbar />
      <ReactFlowProvider>
        <Canvas />
      </ReactFlowProvider>
    </div>
  );
};