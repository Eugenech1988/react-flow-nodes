'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ClientFlowCanvas = dynamic(
  () => import('./ClientFlowCanvas').then((mod) => mod.ClientFlowCanvas),
  { ssr: false },
);

export function LazyHeroCanvas() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  return ready ? <ClientFlowCanvas /> : null;
}
