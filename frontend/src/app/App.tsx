import { Header } from '@/widgets/header';
import { Toolbar } from '@/widgets/toolbar';
import { Canvas } from '@/widgets/canvas';

function App() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <Header />
      <Toolbar />
      <main className="flex-1 min-h-0">
        <Canvas />
      </main>
    </div>
  );
}

export default App;
