import type { TNodeExecutor } from '../model/types';
import { resolveTemplate, toNumber } from '../model/utils';

type TMathOperation =
  | 'add' | 'subtract' | 'multiply' | 'divide'
  | 'modulo' | 'power' | 'min' | 'max' | 'avg'
  | 'abs' | 'round' | 'floor' | 'ceil' | 'sqrt' | 'negate';

const UNARY_OPS: ReadonlySet<TMathOperation> = new Set([
  'abs', 'round', 'floor', 'ceil', 'sqrt', 'negate',
]);

const resolveOperands = (
  raw: unknown,
  input: Record<string, unknown>,
): number[] => {
  if (Array.isArray(raw)) {
    return raw.map((item) =>
      toNumber(resolveTemplate(String(item), input), 'Operand'),
    );
  }

  if (typeof raw === 'string' && raw.includes(',')) {
    return raw
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => toNumber(resolveTemplate(part, input), 'Operand'));
  }

  return [toNumber(resolveTemplate(String(raw ?? 0), input), 'Operand')];
};

const applyBinary = (op: TMathOperation, a: number, b: number): number => {
  switch (op) {
    case 'add':      return a + b;
    case 'subtract': return a - b;
    case 'multiply': return a * b;
    case 'divide':
      if (b === 0) throw new Error('Division by zero is not allowed.');
      return a / b;
    case 'modulo':
      if (b === 0) throw new Error('Modulo by zero is not allowed.');
      return a % b;
    case 'power':    return a ** b;
    case 'min':      return Math.min(a, b);
    case 'max':      return Math.max(a, b);
    case 'avg':      return (a + b) / 2;
    default:
      throw new Error(`Unsupported binary operation "${op}".`);
  }
};

const applyUnary = (op: TMathOperation, a: number): number => {
  switch (op) {
    case 'abs':    return Math.abs(a);
    case 'round':  return Math.round(a);
    case 'floor':  return Math.floor(a);
    case 'ceil':   return Math.ceil(a);
    case 'sqrt':
      if (a < 0) throw new Error('Cannot take sqrt of a negative number.');
      return Math.sqrt(a);
    case 'negate': return -a;
    default:
      throw new Error(`Unsupported unary operation "${op}".`);
  }
};

const applyNary = (op: TMathOperation, values: number[]): number => {
  if (values.length === 0) {
    throw new Error(`Operation "${op}" requires at least one operand.`);
  }
  switch (op) {
    case 'add':      return values.reduce((acc, v) => acc + v, 0);
    case 'multiply': return values.reduce((acc, v) => acc * v, 1);
    case 'min':      return Math.min(...values);
    case 'max':      return Math.max(...values);
    case 'avg':      return values.reduce((acc, v) => acc + v, 0) / values.length;
    default:
      throw new Error(`Operation "${op}" does not support n operands.`);
  }
};

export const executeMathNode: TNodeExecutor = (node, input) => {
  const data = node.data;
  const operation = String(
    data.operation || 'add',
  ).toLowerCase() as TMathOperation;

  const operandsRaw = data.operands ?? [
    data.leftOperand ?? input.leftOperand ?? 0,
    data.rightOperand ?? input.rightOperand ?? 0,
  ];

  const operands = resolveOperands(operandsRaw, input);

  let result: number;

  if (UNARY_OPS.has(operation)) {
    if (operands.length < 1) {
      throw new Error(`Operation "${operation}" requires one operand.`);
    }
    result = applyUnary(operation, operands[0]);
  } else if (operands.length > 2) {
    result = applyNary(operation, operands);
  } else if (operands.length === 2) {
    result = applyBinary(operation, operands[0], operands[1]);
  } else {
    result = applyNary(operation, operands);
  }

  const precision = data.precision;
  if (precision !== undefined && precision !== null && precision !== '') {
    const p = toNumber(precision, 'Precision');
    if (p < 0 || p > 20) {
      throw new Error('Precision must be between 0 and 20.');
    }
    const factor = 10 ** p;
    result = Math.round(result * factor) / factor;
  }

  if (!Number.isFinite(result)) {
    throw new Error('Math operation returned an invalid result.');
  }

  return {
    ...input,
    result,
    operands,
    operation,
  };
};