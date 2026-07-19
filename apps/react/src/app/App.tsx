// import { Header } from '@/widgets/header';
// import { NodesToolbar } from '@/widgets/nodes-toolbar';
// import { Canvas } from '@/widgets/canvas';
// import { ReactFlowProvider } from '@xyflow/react';
// import { Toaster } from '@pipeline/ui'
import { AuthForm, useUser, useLogout } from '@/features/auth';

function App() {
  const { user, isLoading, isAuth } = useUser();
  const { logout, isLoggingOut } = useLogout();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-zinc-400 flex items-center justify-center">
        <div className="animate-pulse tracking-wider text-sm">LOADING WORKSPACE...</div>
      </div>
    );
  }

  if (!isAuth) {
    return <AuthForm />;
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/*<Header />*/}
      {/*<NodesToolbar />*/}
      {/*<main className="flex-1 min-h-0">*/}
      {/*  <ReactFlowProvider>*/}
      {/*    <Canvas />*/}
      {/*  </ReactFlowProvider>*/}
      {/*  <Toaster />*/}
      {/*</main>*/}
      {user.email}
      <button
        onClick={() => logout()}
        disabled={isLoggingOut}
        variant="outline"
      >
        {isLoggingOut ? 'Logging out...' : 'Sign Out'}
      </button>
      {/*<AuthForm/>*/}
    </div>
  );
}

export default App;
