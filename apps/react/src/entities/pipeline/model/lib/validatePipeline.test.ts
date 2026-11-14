import { describe, it, expect } from 'vitest';
import { validatePipeline } from './validatePipeline';
import type { TPipelineNode, TPipelineEdge } from '../../types';

const node = (
  id: string,
  type: string,
  nodeType: string,
  data: Record<string, unknown> = {},
): TPipelineNode =>
  ({
    id,
    type,
    position: { x: 0, y: 0 },
    data: { nodeType, ...data },
  }) as TPipelineNode;

const edge = (id: string, source: string, target: string): TPipelineEdge =>
  ({ id, source, target }) as TPipelineEdge;

const validPipeline = () => ({
  nodes: [
    node('in1', 'customInput', 'input', { inputName: 'name' }),
    node('text1', 'text', 'text', { text: 'Hello {{name}}' }),
    node('out1', 'customOutput', 'output', { outputName: 'result' }),
  ],
  edges: [
    edge('e1', 'in1', 'text1'),
    edge('e2', 'text1', 'out1'),
  ],
});

describe('validatePipeline', () => {
  describe('empty input', () => {
    it('rejects empty pipeline', () => {
      const result = validatePipeline([], []);
      expect(result.isValid).toBe(false);
    });
  });

  describe('valid pipeline', () => {
    it('accepts Input → Text → Output with matching variable', () => {
      const { nodes, edges } = validPipeline();
      const result = validatePipeline(nodes, edges);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('marks all flags true for valid pipeline', () => {
      const { nodes, edges } = validPipeline();
      const result = validatePipeline(nodes, edges);
      expect(result.isDag).toBe(true);
      expect(result.noCycles).toBe(true);
      expect(result.requiredFieldsFilled).toBe(true);
      expect(result.outputConnected).toBe(true);
      expect(result.inputConnected).toBe(true);
      expect(result.noIsolatedNodes).toBe(true);
      expect(result.variableExists).toBe(true);
      expect(result.noDuplicateVariables).toBe(true);
    });
  });

  describe('cycle detection', () => {
    it('rejects cyclic graph', () => {
      const nodes = [
        node('a', 'text', 'text', { text: 'A' }),
        node('b', 'text', 'text', { text: 'B' }),
      ];
      const edges = [edge('e1', 'a', 'b'), edge('e2', 'b', 'a')];
      const result = validatePipeline(nodes, edges);
      expect(result.noCycles).toBe(false);
      expect(result.isDag).toBe(false);
      expect(result.errors.some((e) => e.includes('Loop detected'))).toBe(true);
    });
  });

  describe('required fields', () => {
    it('rejects text node without content', () => {
      const nodes = [
        node('in1', 'customInput', 'input', { inputName: 'x' }),
        node('t1', 'text', 'text', { text: '' }),
        node('out1', 'customOutput', 'output', { outputName: 'y' }),
      ];
      const edges = [edge('e1', 'in1', 't1'), edge('e2', 't1', 'out1')];
      const result = validatePipeline(nodes, edges);
      expect(result.requiredFieldsFilled).toBe(false);
      expect(result.errors.some((e) => e.includes('Text node "t1" has no content'))).toBe(true);
    });

    it('rejects input node without name', () => {
      const nodes = [
        node('in1', 'customInput', 'input', { inputName: '' }),
        node('t1', 'text', 'text', { text: 'Hello' }),
        node('out1', 'customOutput', 'output', { outputName: 'y' }),
      ];
      const edges = [edge('e1', 'in1', 't1'), edge('e2', 't1', 'out1')];
      const result = validatePipeline(nodes, edges);
      expect(result.requiredFieldsFilled).toBe(false);
      expect(result.errors.some((e) => e.includes('Input node "in1" is unnamed'))).toBe(true);
    });

    it('rejects output node without name', () => {
      const nodes = [
        node('in1', 'customInput', 'input', { inputName: 'x' }),
        node('t1', 'text', 'text', { text: 'Hello' }),
        node('out1', 'customOutput', 'output', { outputName: '' }),
      ];
      const edges = [edge('e1', 'in1', 't1'), edge('e2', 't1', 'out1')];
      const result = validatePipeline(nodes, edges);
      expect(result.requiredFieldsFilled).toBe(false);
    });
  });

  describe('variable resolution', () => {
    it('rejects {{unknown}} referenced in text', () => {
      const nodes = [
        node('in1', 'customInput', 'input', { inputName: 'name' }),
        node('t1', 'text', 'text', { text: 'Hello {{unknown}}' }),
        node('out1', 'customOutput', 'output', { outputName: 'y' }),
      ];
      const edges = [edge('e1', 'in1', 't1'), edge('e2', 't1', 'out1')];
      const result = validatePipeline(nodes, edges);
      expect(result.variableExists).toBe(false);
      expect(result.errors.some((e) => e.includes('Unresolved reference'))).toBe(true);
    });

    it('accepts lowercase match of input name', () => {
      const nodes = [
        node('in1', 'customInput', 'input', { inputName: 'Name' }),
        node('t1', 'text', 'text', { text: 'Hi {{name}}' }),
        node('out1', 'customOutput', 'output', { outputName: 'y' }),
      ];
      const edges = [edge('e1', 'in1', 't1'), edge('e2', 't1', 'out1')];
      const result = validatePipeline(nodes, edges);
      expect(result.variableExists).toBe(true);
    });
  });

  describe('duplicates', () => {
    it('rejects duplicate input names', () => {
      const nodes = [
        node('in1', 'customInput', 'input', { inputName: 'x' }),
        node('in2', 'customInput', 'input', { inputName: 'x' }),
        node('t1', 'text', 'text', { text: 'Hello' }),
        node('out1', 'customOutput', 'output', { outputName: 'y' }),
      ];
      const edges = [
        edge('e1', 'in1', 't1'),
        edge('e2', 'in2', 't1'),
        edge('e3', 't1', 'out1'),
      ];
      const result = validatePipeline(nodes, edges);
      expect(result.noDuplicateVariables).toBe(false);
    });
  });

  describe('connectivity', () => {
    it('rejects isolated nodes', () => {
      const nodes = [
        node('in1', 'customInput', 'input', { inputName: 'x' }),
        node('t1', 'text', 'text', { text: 'Hello' }),
        node('out1', 'customOutput', 'output', { outputName: 'y' }),
        node('isolated', 'text', 'text', { text: 'nobody' }),
      ];
      const edges = [edge('e1', 'in1', 't1'), edge('e2', 't1', 'out1')];
      const result = validatePipeline(nodes, edges);
      expect(result.noIsolatedNodes).toBe(false);
    });

    it('rejects output node without incoming edge', () => {
      const nodes = [
        node('in1', 'customInput', 'input', { inputName: 'x' }),
        node('t1', 'text', 'text', { text: 'Hello' }),
        node('out1', 'customOutput', 'output', { outputName: 'y' }),
      ];
      const edges = [edge('e1', 'in1', 't1')];
      const result = validatePipeline(nodes, edges);
      expect(result.outputConnected).toBe(false);
    });
  });

  describe('no input nodes', () => {
    it('rejects when no Input node exists', () => {
      const nodes = [
        node('t1', 'text', 'text', { text: 'Hello' }),
        node('out1', 'customOutput', 'output', { outputName: 'y' }),
      ];
      const edges = [edge('e1', 't1', 'out1')];
      const result = validatePipeline(nodes, edges);
      expect(result.inputConnected).toBe(false);
      expect(result.errors.some((e) => e.includes('At least one Input node'))).toBe(true);
    });
  });
});

describe('validatePipeline — extended coverage', () => {
  describe('variable exists but not connected to text', () => {
    it('marks inputConnected=false when input variable is not connected to text node', () => {
      const nodes = [
        node('in1', 'customInput', 'input', { inputName: 'name' }),
        node('in2', 'customInput', 'input', { inputName: 'email' }),
        node('t1', 'text', 'text', { text: 'Hello {{name}}' }),
        node('out1', 'customOutput', 'output', { outputName: 'y' }),
      ];
      const edges = [
        edge('e1', 'in1', 't1'),
        edge('e2', 't1', 'out1'),
      ];

      const result = validatePipeline(nodes, edges);

      expect(result.inputConnected).toBe(false);
      expect(
        result.errors.some((e) => e.includes('Active inputs must map to their target steps')),
      ).toBe(true);
    });
  });
});

describe('validatePipeline — getFieldName fallbacks', () => {
  const buildValid = (inputData: Record<string, unknown>) => {
    const nodes = [
      node('in1', 'customInput', 'input', inputData),
      node('t1', 'text', 'text', { text: 'Hi' }),
      node('out1', 'customOutput', 'output', { outputName: 'y' }),
    ];
    const edges = [edge('e1', 'in1', 't1'), edge('e2', 't1', 'out1')];
    return { nodes, edges };
  };

  it('uses fieldName when inputName missing', () => {
    const { nodes, edges } = buildValid({ fieldName: 'name' });
    const result = validatePipeline(nodes, edges);
    expect(result.requiredFieldsFilled).toBe(true);
  });

  it('uses name when inputName and fieldName missing', () => {
    const { nodes, edges } = buildValid({ name: 'name' });
    const result = validatePipeline(nodes, edges);
    expect(result.requiredFieldsFilled).toBe(true);
  });

  it('uses label when other fields missing', () => {
    const { nodes, edges } = buildValid({ label: 'name' });
    const result = validatePipeline(nodes, edges);
    expect(result.requiredFieldsFilled).toBe(true);
  });

  it('uses value when no other name field', () => {
    const { nodes, edges } = buildValid({ value: 'name' });
    const result = validatePipeline(nodes, edges);
    expect(result.requiredFieldsFilled).toBe(true);
  });

  it('trims whitespace around field name', () => {
    const { nodes, edges } = buildValid({ inputName: '   spaced   ' });
    const result = validatePipeline(nodes, edges);
    expect(result.requiredFieldsFilled).toBe(true);
    expect(result.inputConnected).toBe(true);
  });

  it('rejects non-string field name', () => {
    const { nodes, edges } = buildValid({ inputName: 42 });
    const result = validatePipeline(nodes, edges);
    expect(result.requiredFieldsFilled).toBe(false);
  });
});

describe('validatePipeline — getNodeKinds combinations', () => {
  it('recognizes input node with text in type name', () => {
    const nodes = [
      node('in1', 'customInput', 'input-text', { inputName: 'x', text: '' }),
      node('t1', 'text', 'text', { text: 'hi' }),
      node('out1', 'customOutput', 'output', { outputName: 'y' }),
    ];
    const edges = [edge('e1', 'in1', 't1'), edge('e2', 't1', 'out1')];
    const result = validatePipeline(nodes, edges);
    expect(result.errors.some((e) => e.includes('Text node "in1" has no content'))).toBe(
      true,
    );
  });

  it('recognizes output node with text in type name', () => {
    const nodes = [
      node('in1', 'customInput', 'input', { inputName: 'x' }),
      node('t1', 'text', 'text', { text: 'hi' }),
      node('out1', 'customOutput', 'output-text', { outputName: '', text: '' }),
    ];
    const edges = [edge('e1', 'in1', 't1'), edge('e2', 't1', 'out1')];
    const result = validatePipeline(nodes, edges);
    expect(result.requiredFieldsFilled).toBe(false);
  });
});
