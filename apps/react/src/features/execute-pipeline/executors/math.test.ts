import { describe, it, expect } from 'vitest';
import { executeMathNode } from './math';
import type { TPipelineNode } from '@/entities';

const makeNode = (data: Record<string, unknown>): TPipelineNode =>
  ({ id: 'n1', type: 'math', position: { x: 0, y: 0 }, data }) as unknown as TPipelineNode;

describe('executeMathNode', () => {
  describe('binary ops', () => {
    it('add', async () => {
      const node = makeNode({ operation: 'add', leftOperand: '2', rightOperand: '3' });
      expect((await executeMathNode(node, {})).result).toBe(5);
    });
    it('subtract', async () => {
      const node = makeNode({ operation: 'subtract', leftOperand: '10', rightOperand: '4' });
      expect((await executeMathNode(node, {})).result).toBe(6);
    });
    it('multiply', async () => {
      const node = makeNode({ operation: 'multiply', leftOperand: '3', rightOperand: '4' });
      expect((await executeMathNode(node, {})).result).toBe(12);
    });
    it('divide', async () => {
      const node = makeNode({ operation: 'divide', leftOperand: '10', rightOperand: '2' });
      expect((await executeMathNode(node, {})).result).toBe(5);
    });
    it('divide by zero throws', async () => {
      const node = makeNode({ operation: 'divide', leftOperand: '10', rightOperand: '0' });
      expect(() => executeMathNode(node, {})).toThrow('Division by zero');
    });
    it('modulo', async () => {
      const node = makeNode({ operation: 'modulo', leftOperand: '10', rightOperand: '3' });
      expect((await executeMathNode(node, {})).result).toBe(1);
    });
    it('modulo by zero throws', async () => {
      const node = makeNode({ operation: 'modulo', leftOperand: '10', rightOperand: '0' });
      expect(() => executeMathNode(node, {})).toThrow('Modulo by zero');
    });
    it('power', async () => {
      const node = makeNode({ operation: 'power', leftOperand: '2', rightOperand: '3' });
      expect((await executeMathNode(node, {})).result).toBe(8);
    });
    it('min', async () => {
      const node = makeNode({ operation: 'min', leftOperand: '5', rightOperand: '2' });
      expect((await executeMathNode(node, {})).result).toBe(2);
    });
    it('max', async () => {
      const node = makeNode({ operation: 'max', leftOperand: '5', rightOperand: '2' });
      expect((await executeMathNode(node, {})).result).toBe(5);
    });
    it('avg', async () => {
      const node = makeNode({ operation: 'avg', leftOperand: '4', rightOperand: '8' });
      expect((await executeMathNode(node, {})).result).toBe(6);
    });
  });

  describe('unary ops', () => {
    it('abs', async () => {
      const node = makeNode({ operation: 'abs', leftOperand: '-5', rightOperand: '0' });
      expect((await executeMathNode(node, {})).result).toBe(5);
    });
    it('round', async () => {
      const node = makeNode({ operation: 'round', leftOperand: '3.7', rightOperand: '0' });
      expect((await executeMathNode(node, {})).result).toBe(4);
    });
    it('floor', async () => {
      const node = makeNode({ operation: 'floor', leftOperand: '3.7', rightOperand: '0' });
      expect((await executeMathNode(node, {})).result).toBe(3);
    });
    it('ceil', async () => {
      const node = makeNode({ operation: 'ceil', leftOperand: '3.2', rightOperand: '0' });
      expect((await executeMathNode(node, {})).result).toBe(4);
    });
    it('sqrt', async () => {
      const node = makeNode({ operation: 'sqrt', leftOperand: '9', rightOperand: '0' });
      expect((await executeMathNode(node, {})).result).toBe(3);
    });
    it('sqrt of negative throws', async () => {
      const node = makeNode({ operation: 'sqrt', leftOperand: '-1', rightOperand: '0' });
      expect(() => executeMathNode(node, {})).toThrow('Cannot take sqrt');
    });
    it('negate', async () => {
      const node = makeNode({ operation: 'negate', leftOperand: '5', rightOperand: '0' });
      expect((await executeMathNode(node, {})).result).toBe(-5);
    });
  });

  describe('n-ary ops', () => {
    it('add with comma-separated operands', async () => {
      const node = makeNode({ operation: 'add', operands: '1,2,3' });
      expect((await executeMathNode(node, {})).result).toBe(6);
    });
    it('multiply with comma-separated operands', async () => {
      const node = makeNode({ operation: 'multiply', operands: '2,3,4' });
      expect((await executeMathNode(node, {})).result).toBe(24);
    });
    it('min with comma-separated operands', async () => {
      const node = makeNode({ operation: 'min', operands: '5,2,9' });
      expect((await executeMathNode(node, {})).result).toBe(2);
    });
    it('max with comma-separated operands', async () => {
      const node = makeNode({ operation: 'max', operands: '5,2,9' });
      expect((await executeMathNode(node, {})).result).toBe(9);
    });
    it('avg with comma-separated operands', async () => {
      const node = makeNode({ operation: 'avg', operands: '2,4,6' });
      expect((await executeMathNode(node, {})).result).toBe(4);
    });
  });

  describe('precision', () => {
    it('rounds to precision', async () => {
      const node = makeNode({ operation: 'divide', leftOperand: '1', rightOperand: '3', precision: '2' });
      expect((await executeMathNode(node, {})).result).toBe(0.33);
    });
    it('throws on invalid precision', async () => {
      const node = makeNode({ operation: 'add', leftOperand: '1', rightOperand: '1', precision: '25' });
      expect(() => executeMathNode(node, {})).toThrow('Precision must be between 0 and 20');
    });
  });

  describe('inputs from connected handles', () => {
    it('uses connectedLeftOperand and connectedRightOperand', async () => {
      const node = makeNode({ operation: 'add' });
      const result = await executeMathNode(node, { connectedLeftOperand: 10, connectedRightOperand: 20 });
      expect(result.result).toBe(30);
    });
  });

  describe('errors', () => {
    it('throws on invalid operand', async () => {
      const node = makeNode({ operation: 'add', leftOperand: 'abc', rightOperand: '1' });
      expect(() => executeMathNode(node, {})).toThrow('Operand must be a valid number');
    });
    it('throws on non-finite result', async () => {
      const node = makeNode({ operation: 'power', leftOperand: '10', rightOperand: '1000' });
      expect(() => executeMathNode(node, {})).toThrow('invalid result');
    });
  });
});

describe('executeMathNode — extra coverage', () => {
  describe('n-ary avg', () => {
    it('computes avg of 3+ operands', async () => {
      const node = makeNode({ operation: 'avg', operands: '10,20,30' });
      expect((await executeMathNode(node, {})).result).toBe(20);
    });

    it('computes avg of 4 operands', async () => {
      const node = makeNode({ operation: 'avg', operands: '1,2,3,4' });
      expect((await executeMathNode(node, {})).result).toBe(2.5);
    });
  });

  describe('n-ary add/multiply/min/max', () => {
    it('n-ary add with 4 operands', async () => {
      const node = makeNode({ operation: 'add', operands: '1,2,3,4' });
      expect((await executeMathNode(node, {})).result).toBe(10);
    });

    it('n-ary min of 4 operands', async () => {
      const node = makeNode({ operation: 'min', operands: '5,2,8,1' });
      expect((await executeMathNode(node, {})).result).toBe(1);
    });

    it('n-ary max of 4 operands', async () => {
      const node = makeNode({ operation: 'max', operands: '5,2,8,1' });
      expect((await executeMathNode(node, {})).result).toBe(8);
    });
  });

  describe('operands from data.operands as array', () => {
    it('accepts array form of operands', async () => {
      const node = makeNode({ operation: 'add', operands: [1, 2, 3] });
      expect((await executeMathNode(node, {})).result).toBe(6);
    });
  });

  describe('template resolution in operands', () => {
    it('resolves {{var}} in operand', async () => {
      const node = makeNode({ operation: 'add', operands: '{{x}},{{y}}' });
      const result = await executeMathNode(node, { x: '10', y: '20' });
      expect(result.result).toBe(30);
    });
  });

  describe('operand fallbacks', () => {
    it('uses input.value as left operand fallback', async () => {
      const node = makeNode({ operation: 'add' });
      const result = await executeMathNode(node, { value: 5, connectedRightOperand: 3 });
      expect(result.result).toBe(8);
    });

    it('uses input.compareWith as right operand fallback', async () => {
      const node = makeNode({ operation: 'multiply' });
      const result = await executeMathNode(node, { connectedLeftOperand: 4, compareWith: 5 });
      expect(result.result).toBe(20);
    });
  });
});
