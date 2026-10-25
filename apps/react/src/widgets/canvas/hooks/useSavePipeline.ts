import { useEffect, useCallback, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

import { useStore } from '@/entities';
import type { TPipelineNode, TPipelineEdge } from '@/entities';
import { usePipelineHandler } from '@/features/manage-pipelines';
import { useUser } from '@/shared/hooks';

interface UseSavePipelineProps {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
}

export const useSavePipeline = ({ wrapperRef }: UseSavePipelineProps) => {
  const { user } = useUser();
  const { updatePipeline } = usePipelineHandler();
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const lastRunAt = useStore((state) => state.lastRunAt);
  const lastRunStatus = useStore((state) => state.lastRunStatus);
  const setSaveAction = useStore((state) => state.setSaveAction);
  const setSaveStatus = useStore((state) => state.setSaveStatus);
  const saveInProgress = useRef(false);
  const savePipelineRef = useRef<(withScreenshot?: boolean, notify?: boolean) => Promise<void>>(
    async () => {},
  );

  const { fitView } = useReactFlow<TPipelineNode, TPipelineEdge>();

  const captureScreenshot = useCallback(async (): Promise<string | undefined> => {
    const viewportElement = wrapperRef.current?.querySelector<HTMLElement>('.react-flow__viewport');
    if (!viewportElement) return undefined;

    try {
      return await toPng(viewportElement, {
        quality: 0.8,
        fontEmbedCSS: '',
        filter: (node: Node) => {
          const classNames = (node as HTMLElement)?.className;
          return !(typeof classNames === 'string' && classNames.includes('react-flow__controls'));
        },
      });
    } catch (error) {
      console.error('Failed to capture canvas screenshot:', error);
      return undefined;
    }
  }, [wrapperRef]);

  const handleSavePipeline = useCallback(
    async (withScreenshot = false, notify = false) => {
      const id = user?.currentPipelineId || user?.currentPipeline?.id;
      if (!id) return;

      setSaveStatus('saving');
      try {
        let screenshotBase64: string | undefined;
        if (withScreenshot) {
          await fitView({ padding: 0.2, duration: 300 });
          await new Promise((resolve) => setTimeout(resolve, 350));
          screenshotBase64 = await captureScreenshot();
        }

        const formattedNodes = nodes.map((node: TPipelineNode) => ({
          ...node,
          type: node.type ?? 'default',
        }));

        await updatePipeline.mutateAsync({
          id,
          graphData: {
            nodes: formattedNodes,
            edges,
          },
          ...(screenshotBase64 && { screenshotBase64 }),
          ...(lastRunAt && { lastRunAt: new Date(lastRunAt) }),
          ...(lastRunStatus && { lastRunStatus }),
        });
        setSaveStatus('saved');
        if (notify) toast.success('Pipeline saved');
      } catch (error) {
        setSaveStatus('error');
        console.error('Failed to save pipeline:', error);
        if (notify) toast.error('Failed to save pipeline');
      }
    },
    [
      user,
      fitView,
      captureScreenshot,
      nodes,
      edges,
      lastRunAt,
      lastRunStatus,
      updatePipeline,
      setSaveStatus,
    ],
  );

  useEffect(() => {
    setSaveAction(handleSavePipeline);
    return () => setSaveAction(null);
  }, [setSaveAction, handleSavePipeline]);

  useEffect(() => {
    savePipelineRef.current = handleSavePipeline;
  }, [handleSavePipeline]);

  useEffect(() => {
    const pipelineId = user?.currentPipelineId || user?.currentPipeline?.id;
    if (!pipelineId) return;

    const intervalId = window.setInterval(async () => {
      if (saveInProgress.current) return;

      saveInProgress.current = true;
      try {
        await savePipelineRef.current(false);
      } catch (error) {
        console.error('Failed to autosave pipeline:', error);
      } finally {
        saveInProgress.current = false;
      }
    }, 120_000);

    return () => window.clearInterval(intervalId);
  }, [user?.currentPipelineId, user?.currentPipeline?.id]);

  return {
    handleSavePipeline,
  };
};
