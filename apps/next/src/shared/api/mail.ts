'use server';

import type { TSendInquiryInputData } from '@pipeline/contracts';
import { trpcFetch } from './trpc';

export const sendInquiry = async (data: TSendInquiryInputData): Promise<boolean> => {
  const result = await trpcFetch('mail.sendInquiry', data, { method: 'POST' });
  return result.ok;
};