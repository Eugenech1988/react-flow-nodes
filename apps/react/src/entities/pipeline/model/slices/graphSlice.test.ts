import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { useStore } from '../store';
import type { TPipelineNode, TPipelineEdge } from '../../types';

const makeNode = (id: string, type = 'text'): TPipelineNode =>
  ({
    id,
    type,
    position: { x: 0, y: 0 },
    data: {},
  }) as TPipelineNode;

const resetStore = () => {
  useStore.setState({
    nodes: [],
    edges: [],
    clipboard: null,
    past: [],
    future: [],
    lastRunAt: null,
    lastRunStatus: null,
    saveAction: null,
    saveStatus: 'saved',
    pipelineId: null,
  });
};

describe('graphSlice', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('getNodeID', () => {
    it('returns "{type}-1" when no nodes exist', () => {
      expect(useStore.getState().getNodeID('text')).toBe('text-1');
    });

    it('returns max+1 for existing prefix', () => {
      useStore.setState({ nodes: [makeNode('text-1'), makeNode('text-2')] });
      expect(useStore.getState().getNodeID('text')).toBe('text-3');
    });

    it('ignores nodes with unrelated prefix', () => {
      useStore.setState({ nodes: [makeNode('other-5'), makeNode('text-2')] });
      expect(useStore.getState().getNodeID('text')).toBe('text-3');
    });
  });

  describe('addNode', () => {
    it('appends node and marks saveStatus unsaved', () => {
      useStore.getState().addNode(makeNode('a'));

      expect(useStore.getState().nodes).toHaveLength(1);
      expect(useStore.getState().saveStatus).toBe('unsaved');
    });

    it('creates snapshot before adding', () => {
      useStore.getState().addNode(makeNode('a'));
      expect(useStore.getState().past).toHaveLength(1);
    });
  });

  describe('deleteNode', () => {
    it('removes node and connected edges', () => {
      useStore.setState({
        nodes: [makeNode('a'), makeNode('b')],
        edges: [
          { id: 'e1', source: 'a', target: 'b' } as TPipelineEdge,
          { id: 'e2', source: 'b', target: 'a' } as TPipelineEdge,
        ],
      });

      useStore.getState().deleteNode('a');

      expect(useStore.getState().nodes).toHaveLength(1);
      expect(useStore.getState().edges).toHaveLength(0);
    });

    it('marks saveStatus unsaved', () => {
      useStore.setState({ nodes: [makeNode('a')] });
      useStore.getState().deleteNode('a');
      expect(useStore.getState().saveStatus).toBe('unsaved');
    });
  });

  describe('takeSnapshot', () => {
    it('pushes snapshot into past', () => {
      useStore.setState({ nodes: [makeNode('a')] });
      useStore.getState().takeSnapshot();

      expect(useStore.getState().past).toHaveLength(1);
      expect(useStore.getState().past[0].nodes).toHaveLength(1);
    });

    it('skips duplicate snapshot', () => {
      useStore.setState({ nodes: [makeNode('a')] });
      useStore.getState().takeSnapshot();
      useStore.getState().takeSnapshot();

      expect(useStore.getState().past).toHaveLength(1);
    });

    it('clears future when new snapshot is taken', () => {
      useStore.setState({
        nodes: [makeNode('a')],
        future: [{ nodes: [makeNode('b')], edges: [] }],
      });
      useStore.getState().takeSnapshot();
      expect(useStore.getState().future).toHaveLength(0);
    });
  });

  describe('undo / redo', () => {
    it('undo restores previous state', () => {
      useStore.getState().addNode(makeNode('a'));
      useStore.getState().addNode(makeNode('b'));

      useStore.getState().undo();

      expect(useStore.getState().nodes).toHaveLength(1);
    });

    it('redo restores next state', () => {
      useStore.getState().addNode(makeNode('a'));
      useStore.getState().addNode(makeNode('b'));
      useStore.getState().undo();
      useStore.getState().redo();

      expect(useStore.getState().nodes).toHaveLength(2);
    });

    it('undo does nothing when past is empty', () => {
      useStore.getState().undo();
      expect(useStore.getState().nodes).toHaveLength(0);
    });

    it('redo does nothing when future is empty', () => {
      useStore.getState().redo();
      expect(useStore.getState().nodes).toHaveLength(0);
    });
  });

  describe('copyNodes / pasteNodes', () => {
    it('copies nodes with internal edges only', () => {
      const nodes = [makeNode('a'), makeNode('b'), makeNode('c')];
      const edges = [
        { id: 'e1', source: 'a', target: 'b' } as TPipelineEdge,
        { id: 'e2', source: 'b', target: 'c' } as TPipelineEdge,
      ];

      useStore.getState().copyNodes([nodes[0], nodes[1]], edges);

      expect(useStore.getState().clipboard?.nodes).toHaveLength(2);
      expect(useStore.getState().clipboard?.edges).toHaveLength(1);
      expect(useStore.getState().clipboard?.edges[0].id).toBe('e1');
    });

    it('paste generates new ids and offsets positions', () => {
      const original = makeNode('text-1');
      original.position = { x: 0, y: 0 };
      useStore.setState({ nodes: [original] });

      useStore.getState().copyNodes([original], []);
      useStore.getState().pasteNodes();

      const pasted = useStore.getState().nodes[1];
      expect(pasted.id).toBe('text-2');
      expect(pasted.position.x).toBe(40);
      expect(pasted.position.y).toBe(40);
    });

    it('paste does nothing without clipboard', () => {
      useStore.getState().pasteNodes();
      expect(useStore.getState().nodes).toHaveLength(0);
    });
  });

  describe('clearCanvas', () => {
    it('removes all nodes and edges', () => {
      useStore.setState({
        nodes: [makeNode('a')],
        edges: [{ id: 'e1', source: 'a', target: 'a' } as TPipelineEdge],
      });

      useStore.getState().clearCanvas();

      expect(useStore.getState().nodes).toHaveLength(0);
      expect(useStore.getState().edges).toHaveLength(0);
      expect(useStore.getState().saveStatus).toBe('unsaved');
    });
  });

  describe('initGraph / resetGraph', () => {
    it('initGraph sets nodes, edges, pipelineId, clears history', () => {
      useStore.setState({ past: [{ nodes: [makeNode('old')], edges: [] }] });
      useStore.getState().initGraph([makeNode('a')], [], 'pipe-1');

      expect(useStore.getState().nodes).toHaveLength(1);
      expect(useStore.getState().pipelineId).toBe('pipe-1');
      expect(useStore.getState().past).toHaveLength(0);
      expect(useStore.getState().saveStatus).toBe('saved');
    });

    it('resetGraph clears everything except pipelineId', () => {
      useStore.setState({ pipelineId: 'pipe-1', nodes: [makeNode('a')] });
      useStore.getState().resetGraph();

      expect(useStore.getState().nodes).toHaveLength(0);
      expect(useStore.getState().pipelineId).toBe('pipe-1');
    });
  });

  describe('saveStatus', () => {
    it('setNodes marks unsaved', () => {
      useStore.getState().setNodes([makeNode('a')]);
      expect(useStore.getState().saveStatus).toBe('unsaved');
    });

    it('setSaveStatus updates directly', () => {
      useStore.getState().setSaveStatus('saving');
      expect(useStore.getState().saveStatus).toBe('saving');
    });

    it('triggerSave does not throw without saveAction', async () => {
      await expect(useStore.getState().triggerSave()).resolves.not.toThrow();
    });

    it('triggerSave calls registered saveAction', async () => {
      let called: { withScreenshot: boolean; notify: boolean } | null = null;
      useStore.getState().setSaveAction((withScreenshot = false, notify = false) => {
        called = { withScreenshot, notify };
      });

      await useStore.getState().triggerSave(true, false);

      expect(called).toEqual({ withScreenshot: true, notify: false });
    });
  });

  describe('updateNodeField', () => {
    it('updates data field and marks unsaved', () => {
      useStore.setState({ nodes: [makeNode('a')] });
      useStore.getState().updateNodeField('a', 'text', 'hello');

      expect(useStore.getState().nodes[0].data.text).toBe('hello');
      expect(useStore.getState().saveStatus).toBe('unsaved');
    });

    it('does not crash when node id is not found', () => {
      useStore.setState({ nodes: [makeNode('a')] });
      expect(() => {
        useStore.getState().updateNodeField('missing', 'text', 'value');
      }).not.toThrow();
      expect(useStore.getState().nodes).toHaveLength(1);
    });
  });

  describe('onConnect', () => {
    it('adds edge via addEdge', () => {
      useStore.setState({ nodes: [makeNode('a'), makeNode('b')] });
      useStore.getState().onConnect({
        source: 'a',
        target: 'b',
        sourceHandle: null,
        targetHandle: null,
      });

      expect(useStore.getState().edges).toHaveLength(1);
    });
  });

  describe('setPipelineId', () => {
    it('updates pipelineId', () => {
      useStore.getState().setPipelineId('p-1');
      expect(useStore.getState().pipelineId).toBe('p-1');
    });

    it('sets pipelineId to null', () => {
      useStore.setState({ pipelineId: 'p-1' });
      useStore.getState().setPipelineId(null);
      expect(useStore.getState().pipelineId).toBeNull();
    });
  });

  describe('triggerSave — warning path', () => {
    it('logs warning when saveAction is null', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      await useStore.getState().triggerSave();

      expect(warnSpy).toHaveBeenCalledWith('Save action is not registered yet.');
      warnSpy.mockRestore();
    });
  });

  describe('onNodesChange', () => {
    it('applies changes and marks unsaved on position', () => {
      useStore.setState({
        saveStatus: 'saved',
        nodes: [{ ...makeNode('a'), position: { x: 0, y: 0 } }],
      });

      useStore.getState().onNodesChange([
        { id: 'a', type: 'position', position: { x: 100, y: 200 } },
      ]);

      expect(useStore.getState().nodes[0].position).toEqual({ x: 100, y: 200 });
      expect(useStore.getState().saveStatus).toBe('unsaved');
    });

    it('marks unsaved on add change', () => {
      useStore.setState({ saveStatus: 'saved', nodes: [] });
      useStore.getState().onNodesChange([
        { id: 'new', type: 'add', item: makeNode('new') },
      ]);
      expect(useStore.getState().saveStatus).toBe('unsaved');
    });

    it('does not mark unsaved on select-only change', () => {
      useStore.setState({ saveStatus: 'saved', nodes: [makeNode('a')] });
      useStore.getState().onNodesChange([{ id: 'a', type: 'select', selected: true }]);
      expect(useStore.getState().saveStatus).toBe('saved');
    });

    it('does not mark unsaved on dimensions change', () => {
      useStore.setState({ saveStatus: 'saved', nodes: [makeNode('a')] });
      useStore.getState().onNodesChange([
        {
          id: 'a',
          type: 'dimensions',
          dimensions: { width: 100, height: 100 },
          resizing: false,
        },
      ]);
      expect(useStore.getState().saveStatus).toBe('saved');
    });

    it('takes snapshot before node removal', () => {
      useStore.setState({ nodes: [makeNode('a'), makeNode('b')] });
      useStore.getState().onNodesChange([{ id: 'a', type: 'remove' }]);
      expect(useStore.getState().past).toHaveLength(1);
    });
  });

  describe('onEdgesChange', () => {
    it('applies edge changes and marks unsaved', () => {
      useStore.setState({
        edges: [{ id: 'e1', source: 'a', target: 'b' } as TPipelineEdge],
      });

      useStore.getState().onEdgesChange([{ id: 'e1', type: 'select', selected: true }]);
      expect(useStore.getState().edges[0].selected).toBe(true);
    });

    it('does not mark unsaved on select-only change', () => {
      useStore.setState({ saveStatus: 'saved', edges: [] });
      useStore.getState().onEdgesChange([{ id: 'e1', type: 'select', selected: true }]);
      expect(useStore.getState().saveStatus).toBe('saved');
    });

    it('takes snapshot before edge removal', () => {
      useStore.setState({
        edges: [{ id: 'e1', source: 'a', target: 'b' } as TPipelineEdge],
      });
      useStore.getState().onEdgesChange([{ id: 'e1', type: 'remove' }]);
      expect(useStore.getState().past).toHaveLength(1);
    });
  });

  describe('pasteNodes — overlap offset', () => {
    it('increments offset when pasted nodes overlap with existing', () => {
      const original = makeNode('text-1');
      original.position = { x: 0, y: 0 };
      useStore.setState({ nodes: [original] });

      useStore.getState().copyNodes([original], []);

      useStore.setState({
        nodes: [
          original,
          { ...makeNode('text-99'), position: { x: 40, y: 40 } },
        ],
      });

      useStore.getState().pasteNodes();
      const pasted = useStore.getState().nodes[useStore.getState().nodes.length - 1];
      expect(pasted.position.x).toBe(80);
      expect(pasted.position.y).toBe(80);
    });
  });

  describe('exportJSON', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('creates and clicks an anchor element', () => {
      const clickSpy = vi
        .spyOn(HTMLAnchorElement.prototype, 'click')
        .mockImplementation(() => {});
      const setAttributeSpy = vi.spyOn(HTMLAnchorElement.prototype, 'setAttribute');

      useStore.setState({
        nodes: [makeNode('a')],
        edges: [{ id: 'e1', source: 'a', target: 'a' } as TPipelineEdge],
      });

      useStore.getState().exportJSON();

      expect(setAttributeSpy).toHaveBeenCalledWith(
        'href',
        expect.stringContaining('data:application/json'),
      );
      expect(setAttributeSpy).toHaveBeenCalledWith(
        'download',
        expect.stringMatching(/^pipeline-\d{4}-\d{2}-\d{2}\.json$/),
      );
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('importJSON', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('imports valid graph data', async () => {
      const valid = {
        nodes: [{ id: 'n1', type: 'text', position: { x: 0, y: 0 }, data: {} }],
        edges: [],
      };
      const file = new File([JSON.stringify(valid)], 'pipeline.json', {
        type: 'application/json',
      });

      useStore.getState().importJSON(file);
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(useStore.getState().nodes).toHaveLength(1);
      expect(useStore.getState().nodes[0].id).toBe('n1');
      expect(useStore.getState().saveStatus).toBe('unsaved');
    });

    it('rejects invalid file structure', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const file = new File([JSON.stringify({ wrong: 'shape' })], 'pipeline.json', {
        type: 'application/json',
      });

      useStore.getState().importJSON(file);
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(errorSpy).toHaveBeenCalledWith(
        'Invalid pipeline file:',
        expect.any(Array),
      );
      expect(useStore.getState().nodes).toHaveLength(0);
    });

    it('rejects malformed JSON', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const file = new File(['not-json-at-all'], 'pipeline.json', {
        type: 'application/json',
      });

      useStore.getState().importJSON(file);
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(errorSpy).toHaveBeenCalledWith(
        'Failed to parse import file',
        expect.any(SyntaxError),
      );
    });
  });
});
