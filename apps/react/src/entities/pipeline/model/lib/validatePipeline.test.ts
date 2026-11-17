import { describe, expect, it } from 'vitest';
import type { TPipelineEdge, TPipelineNode } from '@/entities';
import { validatePipeline } from './validatePipeline';

const makeInput = (id: string, name: string, value = ''): TPipelineNode =>
  ({
    id,
    type: 'input',
    position: { x: 0, y: 0 },
    data: { id, nodeType: 'input', inputName: name, inputValue: value },
  }) as TPipelineNode;

const makeText = (id: string, text: string): TPipelineNode =>
  ({
    id,
    type: 'text',
    position: { x: 0, y: 0 },
    data: { id, nodeType: 'text', text },
  }) as TPipelineNode;

const makeOutput = (id: string, name = 'out'): TPipelineNode =>
  ({
    id,
    type: 'output',
    position: { x: 0, y: 0 },
    data: { id, nodeType: 'output', outputName: name },
  }) as TPipelineNode;

const makeEdge = (id: string, source: string, target: string): TPipelineEdge =>
  ({ id, source, target }) as TPipelineEdge;

describe('validatePipeline / inputConnected', () => {
  it('fails when no input nodes present', () => {
    const report = validatePipeline([makeText('t1', 'hello')], []);
    expect(report.inputConnected).toBe(false);
    expect(report.errors.some((e) => e.includes('At least one Input node'))).toBe(true);
  });

  it('allows Input → Output without any text node', () => {
    const nodes = [makeInput('i1', 'x'), makeOutput('o1')];
    const edges = [makeEdge('e1', 'i1', 'o1')];
    const report = validatePipeline(nodes, edges);

    expect(report.inputConnected).toBe(true);
    expect(report.errors.filter((e) => e.includes('Disconnected variables'))).toHaveLength(0);
  });

  it('fails when an input has no outgoing edges', () => {
    const nodes = [makeInput('i1', 'x'), makeText('t1', 'hi'), makeOutput('o1')];
    const edges = [makeEdge('e1', 't1', 'o1')];
    const report = validatePipeline(nodes, edges);

    expect(report.inputConnected).toBe(false);
  });

  it('fails when {{var}} is used in text but the input is not connected to that text', () => {
    const nodes = [makeInput('i1', 'name'), makeText('t1', 'Hello {{name}}'), makeOutput('o1')];
    const edges = [makeEdge('e1', 't1', 'o1')];
    const report = validatePipeline(nodes, edges);

    expect(report.inputConnected).toBe(false);
  });

  it('passes when input is connected to the text that uses its var', () => {
    const nodes = [makeInput('i1', 'name'), makeText('t1', 'Hello {{name}}'), makeOutput('o1')];
    const edges = [makeEdge('e1', 'i1', 't1'), makeEdge('e2', 't1', 'o1')];
    const report = validatePipeline(nodes, edges);

    expect(report.inputConnected).toBe(true);
  });

  it('fails when input is connected only to text that does not reference its var', () => {
    const nodes = [
      makeInput('i1', 'name'),
      makeText('t1', 'Hello {{name}}'),
      makeText('t2', 'static'),
      makeOutput('o1'),
    ];
    const edges = [
      makeEdge('e1', 'i1', 't2'),
      makeEdge('e2', 't1', 'o1'),
      makeEdge('e3', 't2', 'o1'),
    ];
    const report = validatePipeline(nodes, edges);

    expect(report.inputConnected).toBe(false);
  });

  it('allows unused input to be connected anywhere (non-text consumer)', () => {
    const nodes = [makeInput('i1', 'x'), makeText('t1', 'static'), makeOutput('o1')];
    const edges = [makeEdge('e1', 'i1', 't1'), makeEdge('e2', 't1', 'o1')];
    const report = validatePipeline(nodes, edges);

    expect(report.inputConnected).toBe(true);
  });

  it('requires connection to every text node where the same var is used', () => {
    const nodes = [
      makeInput('i1', 'name'),
      makeText('t1', 'Hi {{name}}'),
      makeText('t2', 'Bye {{name}}'),
      makeOutput('o1'),
    ];
    const edges = [
      makeEdge('e1', 'i1', 't1'),
      makeEdge('e2', 't1', 'o1'),
      makeEdge('e3', 't2', 'o1'),
    ];
    const report = validatePipeline(nodes, edges);

    expect(report.inputConnected).toBe(false);
  });
});