import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DragEvent } from 'react';
import type { ReactFlowInstance } from '@xyflow/react';
import type { TPipelineNode, TPipelineEdge } from '@/entities';
import { useDragAndDrop } from './useDragAndDrop';

const makeDragEvent = (data: string): DragEvent<HTMLDivElement> =>
  ({
    preventDefault: vi.fn(),
    clientX: 100,
    clientY: 200,
    dataTransfer: {
      getData: vi.fn(() => data),
      dropEffect: '' as DataTransfer['dropEffect'],
    },
  }) as unknown as DragEvent<HTMLDivElement>;

const makeInstance = (): ReactFlowInstance<TPipelineNode, TPipelineEdge> =>
  ({
    screenToFlowPosition: vi.fn(() => ({ x: 50, y: 60 })),
  }) as unknown as ReactFlowInstance<TPipelineNode, TPipelineEdge>;

describe('useDragAndDrop', () => {
  const mockAddNode = vi.fn<(node: TPipelineNode) => void>();
  const mockGetNodeID = vi.fn<(type: string) => string>(() => 'input-1');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('onDrop does nothing without react-flow instance', () => {
    const { result } = renderHook(() =>
      useDragAndDrop({ rfInstance: null, addNode: mockAddNode, getNodeID: mockGetNodeID }),
    );
    const event = makeDragEvent(JSON.stringify({ nodeType: 'input' }));
    result.current.onDrop(event);
    expect(mockAddNode).not.toHaveBeenCalled();
  });

  it('onDrop does nothing without dataTransfer payload', () => {
    const { result } = renderHook(() =>
      useDragAndDrop({
        rfInstance: makeInstance(),
        addNode: mockAddNode,
        getNodeID: mockGetNodeID,
      }),
    );
    const event = makeDragEvent('');
    result.current.onDrop(event);
    expect(mockAddNode).not.toHaveBeenCalled();
  });

  it('onDrop does nothing when nodeType missing', () => {
    const { result } = renderHook(() =>
      useDragAndDrop({
        rfInstance: makeInstance(),
        addNode: mockAddNode,
        getNodeID: mockGetNodeID,
      }),
    );
    const event = makeDragEvent(JSON.stringify({}));
    result.current.onDrop(event);
    expect(mockAddNode).not.toHaveBeenCalled();
  });

  it('onDrop creates node and calls addNode', () => {
    const { result } = renderHook(() =>
      useDragAndDrop({
        rfInstance: makeInstance(),
        addNode: mockAddNode,
        getNodeID: mockGetNodeID,
      }),
    );
    const event = makeDragEvent(JSON.stringify({ nodeType: 'input' }));
    result.current.onDrop(event);

    expect(mockGetNodeID).toHaveBeenCalledWith('input');
    expect(mockAddNode).toHaveBeenCalledWith({
      id: 'input-1',
      type: 'input',
      position: { x: 50, y: 60 },
      data: { id: 'input-1', nodeType: 'input' },
    });
  });

  it('onDrop prevents default', () => {
    const { result } = renderHook(() =>
      useDragAndDrop({
        rfInstance: makeInstance(),
        addNode: mockAddNode,
        getNodeID: mockGetNodeID,
      }),
    );
    const event = makeDragEvent('');
    result.current.onDrop(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('onDragOver prevents default and sets dropEffect', () => {
    const { result } = renderHook(() =>
      useDragAndDrop({ rfInstance: null, addNode: mockAddNode, getNodeID: mockGetNodeID }),
    );
    const event = {
      preventDefault: vi.fn(),
      dataTransfer: { dropEffect: '' },
    } as unknown as DragEvent<HTMLDivElement>;
    result.current.onDragOver(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.dataTransfer.dropEffect).toBe('move');
  });
});
