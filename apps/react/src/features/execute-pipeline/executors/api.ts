import type { TNodeExecutor } from '../model/types';
import { resolveTemplate } from '../model/utils';

export const executeApiNode: TNodeExecutor = async (node, input) => {
  const data = node.data;
  const url = resolveTemplate(String(data.url || ''), input);

  if (!url) {
    throw new Error('Endpoint URL is required.');
  }

  const method = String(data.method || 'GET').toUpperCase();
  let headers: Record<string, string> = {};
  const rawHeaders = String(data.headers || '{}').trim();
  if (rawHeaders) {
    try {
      const parsedHeaders: unknown = JSON.parse(rawHeaders);
      if (!parsedHeaders || typeof parsedHeaders !== 'object' || Array.isArray(parsedHeaders)) {
        throw new Error('Headers must be a JSON object.');
      }
      headers = Object.fromEntries(
        Object.entries(parsedHeaders).map(([key, value]) => [key, String(value)]),
      );
    } catch (error) {
      throw new Error(
        error instanceof Error && error.message === 'Headers must be a JSON object.'
          ? error.message
          : 'Headers must contain valid JSON.',
      );
    }
  }

  const configuredBody = data.body || input.body;
  const rawBody =
    typeof configuredBody === 'string'
      ? configuredBody
      : (JSON.stringify(configuredBody ?? '') ?? '');
  const requestBody = rawBody ? resolveTemplate(rawBody, input) : undefined;
  if (requestBody && !Object.keys(headers).some((key) => key.toLowerCase() === 'content-type')) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    method,
    headers,
    ...(!['GET', 'HEAD'].includes(method) && requestBody ? { body: requestBody } : {}),
  });

  const contentType = response.headers.get('content-type') || '';

  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(`API request failed with ${response.status}.`);
  }

  return {
    ...input,
    response: body,
    status: response.status,
    value: body,
  };
};
