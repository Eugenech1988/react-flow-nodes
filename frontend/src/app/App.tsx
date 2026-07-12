import { Header } from '@/widgets/header';
import { NodesToolbar } from '@/widgets/nodes-toolbar';
import { Canvas } from '@/widgets/canvas';
import { ReactFlowProvider } from '@xyflow/react';

function App() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <Header />
      <NodesToolbar />
      <main className="flex-1 min-h-0">
        <ReactFlowProvider>
          <Canvas />
        </ReactFlowProvider>
      </main>
    </div>
  );
}

export default App;
