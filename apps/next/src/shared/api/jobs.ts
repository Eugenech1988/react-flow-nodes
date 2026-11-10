'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export type TPublicJob = {
  id: string;
  slug: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  department: string;
  level: string;
  type: string;
  location: string;
  icon: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  views: number;
  applications: number;
};

type TRawTranslation = {
  id: string;
  jobId: string;
  locale: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  metaTitle: string | null;
  metaDescription: string | null;
};

type TRawJob = {
  id: string;
  slug: string;
  status: string;
  department: string;
  level: string;
  type: string;
  location: string;
  icon: string | null;
  authorId: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  translations: TRawTranslation[];
  views: number | string;
  applications: number | string;
};

const extractData = <T>(payload: unknown): T | null => {
  if (!Array.isArray(payload) || payload.length === 0) return null;

  const first = payload[0];
  if (!first || typeof first !== 'object' || !('result' in first)) return null;

  const data = (first as { result?: { data?: unknown } }).result?.data;

  if (data && typeof data === 'object' && 'json' in data) {
    return (data as { json: T }).json ?? null;
  }

  return (data as T) ?? null;
};

const localeCandidates = (locale: string): string[] => {
  if (locale === 'ua' || locale === 'uk') return ['ua', 'uk'];
  return [locale];
};

const localizeJob = (raw: TRawJob, locale: string): TPublicJob | null => {
  const candidates = localeCandidates(locale);

  let translation: TRawTranslation | undefined;
  for (const candidate of candidates) {
    translation = raw.translations.find((t) => t.locale === candidate);
    if (translation) break;
  }

  translation ??= raw.translations.find((t) => t.locale === 'en');
  if (!translation) return null;

  return {
    id: raw.id,
    slug: raw.slug,
    title: translation.title,
    description: translation.description,
    responsibilities: translation.responsibilities ?? [],
    requirements: translation.requirements ?? [],
    department: raw.department,
    level: raw.level,
    type: raw.type,
    location: raw.location,
    icon: raw.icon,
    metaTitle: translation.metaTitle,
    metaDescription: translation.metaDescription,
    views: Number(raw.views) || 0,
    applications: Number(raw.applications) || 0,
  };
};

const buildTrpcUrl = (path: string, input: unknown): string => {
  const encoded = encodeURIComponent(JSON.stringify({ 0: input }));
  return `${API_URL}/trpc/${path}?batch=1&input=${encoded}`;
};

const assertApiUrl = (): string | null => {
  if (!API_URL) {
    console.error('[careers] API_URL is not set (expected API_URL or NEXT_PUBLIC_API_URL)');
    return null;
  }
  return API_URL;
};

export const getPublishedJobs = async (locale: string): Promise<TPublicJob[]> => {
  if (!assertApiUrl()) return [];

  const url = buildTrpcUrl('jobs.list', {});

  try {
    const res = await fetch(url, {
      next: { revalidate: 60, tags: ['jobs'] },
    });

    if (!res.ok) {
      console.error('[careers] jobs.list: bad status', res.status, url);
      return [];
    }

    const payload = await res.json();
    const raw = extractData<TRawJob[]>(payload) ?? [];

    return raw
      .filter((j) => j.status === 'PUBLISHED')
      .map((j) => localizeJob(j, locale))
      .filter((j): j is TPublicJob => j !== null);
  } catch (err) {
    console.error('[careers] jobs.list: fetch failed:', err);
    return [];
  }
};

export const getJobBySlug = async (locale: string, slug: string): Promise<TPublicJob | null> => {
  const jobs = await getPublishedJobs(locale);
  return jobs.find((j) => j.slug === slug) ?? null;
};

export const incrementJobViews = async (
  id: string,
  slug: string,
  locale: string,
): Promise<boolean> => {
  const baseUrl = assertApiUrl();
  if (!baseUrl) return false;

  try {
    const res = await fetch(`${baseUrl}/trpc/jobs.incrementViews?batch=1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 0: { id } }),
      cache: 'no-store',
    });

    const data = await res.json();

    if (data?.[0]?.error) {
      console.error('[careers] incrementViews tRPC error:', data[0].error);
      return false;
    }

    if (!res.ok) {
      console.error('[careers] jobs.incrementViews: bad status', res.status);
      return false;
    }

    revalidateTag('jobs', 'max');
    revalidatePath(`/${locale}/careers/${slug}`);
    return true;
  } catch (err) {
    console.error('[careers] jobs.incrementViews: fetch failed:', err);
    return false;
  }
};

export const incrementJobApplications = async (id: string): Promise<boolean> => {
  const baseUrl = assertApiUrl();
  if (!baseUrl) return false;

  try {
    const res = await fetch(`${baseUrl}/trpc/jobs.incrementApplications?batch=1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 0: { id } }),
      cache: 'no-store',
    });

    const data = await res.json();
    if (data?.[0]?.error) {
      console.error('[careers] incrementApplications tRPC error:', data[0].error);
      return false;
    }

    if (!res.ok) {
      console.error('[careers] jobs.incrementApplications: bad status', res.status);
      return false;
    }

    revalidateTag('jobs', 'max');
    return true;
  } catch (err) {
    console.error('[careers] jobs.incrementApplications: fetch failed:', err);
    return false;
  }
};