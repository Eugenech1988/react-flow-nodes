'use server';

import { revalidatePath } from 'next/cache';
import { getApiUrl } from './trpc';

export const submitJobApplication = async (
  formData: FormData,
  slug: string,
  locale: string,
): Promise<boolean> => {
  const apiUrl = getApiUrl();
  if (!apiUrl) return false;

  try {
    const res = await fetch(`${apiUrl}/applications`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[applications] Submit failed:', errorText);
      return false;
    }

    revalidatePath(`/${locale}/careers/${slug}`);
    return true;
  } catch (error) {
    console.error('[applications] Network error:', error);
    return false;
  }
};
