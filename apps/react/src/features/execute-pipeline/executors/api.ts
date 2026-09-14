import type { TNodeExecutor } from '../model/types';
import { resolveTemplate } from '../model/utils';

export const executeApiNode: TNodeExecutor = async (node, input) => {
  const data = node.data;
  const url = resolveTemplate(String(data.url || ''), input);

  if (!url) {
    throw new Error('Endpoint URL is required.');
  }

  const response = await fetch(url, {
    method: String(data.method || 'GET'),
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
  };
};