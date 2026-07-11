import { Header } from '@/widgets/header';
import { NodesToolbar } from '@/widgets/nodes-toolbar';
import { Canvas } from '@/widgets/canvas';

function App() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <Header />
      <NodesToolbar />
      <main className="flex-1 min-h-0">
        <Canvas />
      </main>
    </div>
  );
}

export default App;
