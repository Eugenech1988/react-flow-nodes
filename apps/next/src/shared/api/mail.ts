'use server';

import type { TSendInquiryInputData } from '@pipeline/contracts';

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export const sendInquiry = async (data: TSendInquiryInputData) => {
  if (!API_URL) {
    return false;
  }

  try {
    const res = await fetch(`${API_URL}/trpc/mail.sendInquiry?batch=1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 0: data }),
      cache: 'no-store',
    });

    const json = await res.json();

    if (json?.[0]?.error) {
      console.error('[mail] sendInquiry tRPC error:', json[0].error);
      return false;
    }

    return res.ok;

  } catch (err) {
    console.error('[mail] sendInquiry fetch failed:', err);
    return false;
  }
};