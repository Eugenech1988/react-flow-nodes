import { useCallback, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useReactFlow } from '@xyflow/react';
import { toPng } from 'html-to-image';

import { useStore } from '@/entities';
import type { PipelineNode, PipelineEdge } from '@/entities';
import { usePipelineHandler } from '@/pages/pipelines/hooks';
import { useUser } from '@/shared/hooks';

interface UseSavePipelineProps {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
}

export const useSavePipeline = ({ wrapperRef }: UseSavePipelineProps) => {
  const { user } = useUser();
  const { updatePipeline } = usePipelineHandler();
  const { resolvedTheme } = useTheme();

  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const lastRunAt = useStore((state) => state.lastRunAt);
  const lastRunStatus = useStore((state) => state.lastRunStatus);
  const setSaveAction = useStore((state) => state.setSaveAction);

  const { fitView } = useReactFlow<PipelineNode, PipelineEdge>();

  const captureScreenshot = useCallback(async (): Promise<string | undefined> => {
    const viewportElement = wrapperRef.current?.querySelector<HTMLElement>('.react-flow__viewport');
    if (!viewportElement) return undefined;

    try {
      return await toPng(viewportElement, {
        backgroundColor: resolvedTheme === 'dark' ? '#030712' : '#f1f5f9',
        quality: 0.8,
        fontEmbedCSS: '',
        filter: (node) => {
          const classNames = node?.className;
          return !(typeof classNames === 'string' && classNames.includes('react-flow__controls'));
        },
      });
    } catch (error) {
      console.error('Failed to capture canvas screenshot:', error);
      return undefined;
    }
  }, [wrapperRef, resolvedTheme]);

  const handleSavePipeline = useCallback(async () => {
    const id = user?.currentPipelineId || user?.currentPipeline?.id;
    if (!id) return;

    await fitView({ padding: 0.2, duration: 300 });
    await new Promise((resolve) => setTimeout(resolve, 350));

    const screenshotBase64 = await captureScreenshot();

    const formattedNodes = nodes.map((node) => ({
      ...node,
      type: node.type ?? 'default',
    }));

    updatePipeline.mutate({
      id,
      graphData: {
        nodes: formattedNodes,
        edges,
      },
      screenshotBase64,
      ...(lastRunAt && { lastRunAt: new Date(lastRunAt).toISOString() as unknown as Date }),
      ...(lastRunStatus && { lastRunStatus }),
    });
  }, [user, fitView, captureScreenshot, nodes, edges, lastRunAt, lastRunStatus, updatePipeline]);

  useEffect(() => {
    setSaveAction(handleSavePipeline);
    return () => setSaveAction(null);
  }, [handleSavePipeline, setSaveAction]);

  return {
    handleSavePipeline,
  };
};