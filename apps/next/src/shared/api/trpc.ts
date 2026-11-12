import type { ZodType } from 'zod';

export type TTrpcResult<TOutput> = { ok: true; data: TOutput } | { ok: false };

const DEFAULT_METHOD = 'GET' as const;

export const getApiUrl = (): string | null => {
  const url = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    console.error('[api] API_URL is not set (expected API_URL or NEXT_PUBLIC_API_URL)');
    return null;
  }
  return url;
};

const unwrapBatchResponse = (payload: unknown): unknown => {
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error('Invalid batch response: expected non-empty array');
  }

  const first = payload[0] as { result?: { data?: unknown } } | undefined;
  if (!first?.result) {
    throw new Error('Invalid batch response: missing result');
  }

  const data = first.result.data;

  if (data && typeof data === 'object' && 'json' in data) {
    return (data as { json: unknown }).json;
  }

  return data;
};

type TFetchInit = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

interface ITrpcFetchOptions<TOutput> {
  method?: 'GET' | 'POST';
  schema?: ZodType<TOutput>;
  next?: { revalidate?: number | false; tags?: string[] };
}

export const trpcFetch = async <TInput, TOutput = unknown>(
  path: string,
  input: TInput,
  opts?: ITrpcFetchOptions<TOutput>,
): Promise<TTrpcResult<TOutput>> => {
  const apiUrl = getApiUrl();
  if (!apiUrl) return { ok: false };

  const method = opts?.method ?? DEFAULT_METHOD;
  const url =
    method === 'GET'
      ? `${apiUrl}/trpc/${path}?batch=1&input=${encodeURIComponent(JSON.stringify({ 0: input }))}`
      : `${apiUrl}/trpc/${path}?batch=1`;

  const fetchInit: TFetchInit = {
    method,
    headers: method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
    body: method === 'POST' ? JSON.stringify({ 0: input }) : undefined,
  };

  if (opts?.next) {
    fetchInit.next = opts.next;
  } else if (method === 'GET') {
    fetchInit.cache = 'no-store';
  }

  try {
    const res = await fetch(url, fetchInit);

    if (!res.ok) {
      console.error(`[trpc] ${path}: bad status`, res.status);
      return { ok: false };
    }

    const json = await res.json();
    const first = Array.isArray(json) ? json[0] : null;
    if (first?.error) {
      console.error(`[trpc] ${path} error:`, first.error);
      return { ok: false };
    }

    const data = unwrapBatchResponse(json);

    if (!opts?.schema) {
      return { ok: true, data: data as TOutput };
    }

    const parsed = opts.schema.safeParse(data);
    if (!parsed.success) {
      console.error(`[trpc] ${path}: response schema validation failed`, parsed.error);
      return { ok: false };
    }

    return { ok: true, data: parsed.data };
  } catch (err) {
    console.error(`[trpc] ${path}: fetch failed`, err);
    return { ok: false };
  }
};
