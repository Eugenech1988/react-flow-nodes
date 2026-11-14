import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { executeApiNode } from './api';
import type { TPipelineNode } from '@/entities';

const makeNode = (data: Record<string, unknown>): TPipelineNode =>
  ({ id: 'n1', type: 'api', position: { x: 0, y: 0 }, data }) as unknown as TPipelineNode;

const mockFetch = vi.fn();
const originalFetch = global.fetch;

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch as unknown as typeof fetch;
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe('executeApiNode', () => {
  it('throws when URL missing', async () => {
    const node = makeNode({ url: '' });
    await expect(executeApiNode(node, {})).rejects.toThrow('Endpoint URL is required');
  });

  it('sends GET request with resolved URL', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ data: 'ok' }),
    });
    const node = makeNode({ url: 'https://api.test/{{id}}', method: 'GET' });
    const result = await executeApiNode(node, { id: '42' });

    expect(mockFetch).toHaveBeenCalledWith('https://api.test/42', expect.objectContaining({ method: 'GET' }));
    expect(result.response).toEqual({ data: 'ok' });
    expect(result.status).toBe(200);
  });

  it('parses JSON headers', async () => {
    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({}),
    });
    const node = makeNode({ url: 'https://api.test', method: 'GET', headers: '{"Authorization": "Bearer x"}' });
    await executeApiNode(node, {});

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer x' }),
      })
    );
  });

  it('throws on invalid headers JSON', async () => {
    const node = makeNode({ url: 'https://api.test', headers: '{invalid}' });
    await expect(executeApiNode(node, {})).rejects.toThrow('valid JSON');
  });

  it('throws when headers is array', async () => {
    const node = makeNode({ url: 'https://api.test', headers: '[]' });
    await expect(executeApiNode(node, {})).rejects.toThrow('Headers must be a JSON object');
  });

  it('sends body for POST', async () => {
    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({}),
    });
    const node = makeNode({ url: 'https://api.test', method: 'POST', body: '{"q":"{{val}}"}' });
    await executeApiNode(node, { val: 'x' });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.test',
      expect.objectContaining({ method: 'POST', body: '{"q":"x"}' })
    );
  });

  it('does not send body for GET', async () => {
    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({}),
    });
    const node = makeNode({ url: 'https://api.test', method: 'GET', body: 'ignored' });
    await executeApiNode(node, {});

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.test',
      expect.not.objectContaining({ body: expect.anything() })
    );
  });

  it('adds Content-Type header for non-GET with body', async () => {
    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({}),
    });
    const node = makeNode({ url: 'https://api.test', method: 'POST', body: '{"a":1}' });
    await executeApiNode(node, {});

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.test',
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
  });

  it('throws on non-2xx response', async () => {
    mockFetch.mockResolvedValue({
      ok: false, status: 500,
      headers: new Headers({ 'content-type': 'text/plain' }),
      text: () => Promise.resolve('error'),
    });
    const node = makeNode({ url: 'https://api.test' });
    await expect(executeApiNode(node, {})).rejects.toThrow('API request failed with 500');
  });

  it('parses text response', async () => {
    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      headers: new Headers({ 'content-type': 'text/plain' }),
      text: () => Promise.resolve('hello'),
    });
    const node = makeNode({ url: 'https://api.test' });
    const result = await executeApiNode(node, {});
    expect(result.response).toBe('hello');
  });
});

describe('executeApiNode — extra coverage', () => {
  it('stringifies object body', async () => {
    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({}),
    });
    const node = makeNode({ url: 'https://api.test', method: 'POST', body: { a: 1, b: 'x' } });
    await executeApiNode(node, {});

    const call = mockFetch.mock.calls[0][1];
    expect(JSON.parse(call.body)).toEqual({ a: 1, b: 'x' });
  });

  it('does not override existing content-type header', async () => {
    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({}),
    });
    const node = makeNode({
      url: 'https://api.test',
      method: 'POST',
      headers: '{"Content-Type": "text/xml"}',
      body: 'data',
    });
    await executeApiNode(node, {});

    const call = mockFetch.mock.calls[0][1];
    expect(call.headers['Content-Type']).toBe('text/xml');
  });

  it('respects lowercase content-type (case-insensitive)', async () => {
    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({}),
    });
    const node = makeNode({
      url: 'https://api.test',
      method: 'POST',
      headers: '{"content-type": "text/plain"}',
      body: 'data',
    });
    await executeApiNode(node, {});

    const call = mockFetch.mock.calls[0][1];
    expect(call.headers['Content-Type']).toBeUndefined();
    expect(call.headers['content-type']).toBe('text/plain');
  });

  it('uses input.body when data.body missing', async () => {
    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({}),
    });
    const node = makeNode({ url: 'https://api.test', method: 'POST' });
    await executeApiNode(node, { body: 'incoming' });

    expect(mockFetch.mock.calls[0][1].body).toBe('incoming');
  });
});
