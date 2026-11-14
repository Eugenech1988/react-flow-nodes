import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { executeImageNode } from './image';
import type { TPipelineNode } from '@/entities';

const makeNode = (data: Record<string, unknown>): TPipelineNode =>
  ({ id: 'n1', type: 'image', position: { x: 0, y: 0 }, data }) as unknown as TPipelineNode;

const mockFetch = vi.fn();
const originalFetch = global.fetch;
const originalCreateImageBitmap = global.createImageBitmap;

const mockContext = {
  filter: '',
  drawImage: vi.fn(),
};

const mockCanvas = {
  width: 0,
  height: 0,
  getContext: vi.fn(() => mockContext),
  toDataURL: vi.fn(() => 'data:image/png;base64,processed'),
};

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch as unknown as typeof fetch;
  global.createImageBitmap = vi.fn().mockResolvedValue({ width: 100, height: 100, close: vi.fn() });
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag === 'canvas') return mockCanvas as unknown as HTMLCanvasElement;
    return document.createElement.bind(document)(tag);
  });
});

afterEach(() => {
  global.fetch = originalFetch;
  global.createImageBitmap = originalCreateImageBitmap;
  vi.restoreAllMocks();
});

describe('executeImageNode', () => {
  it('throws when no image URL', async () => {
    const node = makeNode({});
    await expect(executeImageNode(node, {})).rejects.toThrow('Image URL or incoming image is required');
  });

  it('throws when data: URL is not an image', async () => {
    const node = makeNode({ imageUrl: 'data:text/plain;base64,abc' });
    await expect(executeImageNode(node, {})).rejects.toThrow('not an image');
  });

  it('throws when fetch fails', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });
    const node = makeNode({ imageUrl: 'https://img.test/x.png' });
    await expect(executeImageNode(node, {})).rejects.toThrow('Image request failed with 404');
  });

  it('processes image and returns processed URL', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob()),
    });
    const node = makeNode({ imageUrl: 'https://img.test/x.png', filter: 'grayscale' });
    const result = await executeImageNode(node, {});

    expect(result.imageUrl).toBe('data:image/png;base64,processed');
    expect(result.processed).toBe('data:image/png;base64,processed');
    expect(mockContext.filter).toBe('grayscale(1)');
  });

  it('uses connectedImageUrl over data.imageUrl', async () => {
    mockFetch.mockResolvedValue({ ok: true, blob: () => Promise.resolve(new Blob()) });
    const node = makeNode({ imageUrl: 'https://fallback.test/x.png' });
    await executeImageNode(node, { connectedImageUrl: 'https://connected.test/y.png' });

    expect(mockFetch).toHaveBeenCalledWith('https://connected.test/y.png');
  });

  it('applies default blur filter', async () => {
    mockFetch.mockResolvedValue({ ok: true, blob: () => Promise.resolve(new Blob()) });
    const node = makeNode({ imageUrl: 'https://img.test/x.png' });
    await executeImageNode(node, {});

    expect(mockContext.filter).toBe('blur(4px)');
  });

  it('handles unknown filter as none', async () => {
    mockFetch.mockResolvedValue({ ok: true, blob: () => Promise.resolve(new Blob()) });
    const node = makeNode({ imageUrl: 'https://img.test/x.png', filter: 'unknown' });
    await executeImageNode(node, {});

    expect(mockContext.filter).toBe('none');
  });
});

describe('executeImageNode — extra coverage', () => {
  it('applies invert filter', async () => {
    mockFetch.mockResolvedValue({ ok: true, blob: () => Promise.resolve(new Blob()) });
    const node = makeNode({ imageUrl: 'https://img.test/x.png', filter: 'invert' });
    await executeImageNode(node, {});
    expect(mockContext.filter).toBe('invert(1)');
  });

  it('applies sepia filter', async () => {
    mockFetch.mockResolvedValue({ ok: true, blob: () => Promise.resolve(new Blob()) });
    const node = makeNode({ imageUrl: 'https://img.test/x.png', filter: 'sepia' });
    await executeImageNode(node, {});
    expect(mockContext.filter).toBe('sepia(1)');
  });

  it('accepts valid data:image URL', async () => {
    mockFetch.mockResolvedValue({ ok: true, blob: () => Promise.resolve(new Blob()) });
    const node = makeNode({ imageUrl: 'data:image/png;base64,abc' });
    const result = await executeImageNode(node, {});
    expect(result.imageUrl).toBe('data:image/png;base64,processed');
  });

  it('wraps non-Error throws in error message', async () => {
    global.createImageBitmap = vi.fn().mockRejectedValue('string-error');
    mockFetch.mockResolvedValue({ ok: true, blob: () => Promise.resolve(new Blob()) });
    const node = makeNode({ imageUrl: 'https://img.test/x.png' });

    await expect(executeImageNode(node, {})).rejects.toThrow(
      'Image processing failed: string-error'
    );
  });

  it('uses input.imageUrl when data.imageUrl missing', async () => {
    mockFetch.mockResolvedValue({ ok: true, blob: () => Promise.resolve(new Blob()) });
    const node = makeNode({});
    await executeImageNode(node, { imageUrl: 'https://input.test/x.png' });

    expect(mockFetch).toHaveBeenCalledWith('https://input.test/x.png');
  });

  it('uses input.value as last resort', async () => {
    mockFetch.mockResolvedValue({ ok: true, blob: () => Promise.resolve(new Blob()) });
    const node = makeNode({});
    await executeImageNode(node, { value: 'https://value.test/x.png' });

    expect(mockFetch).toHaveBeenCalledWith('https://value.test/x.png');
  });
});
