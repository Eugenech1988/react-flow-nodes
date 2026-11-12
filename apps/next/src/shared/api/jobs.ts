'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { trpcFetch } from './trpc';

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

const rawTranslationSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  locale: z.string(),
  title: z.string(),
  description: z.string(),
  responsibilities: z.array(z.string()).nullish().transform((v) => v ?? []),
  requirements: z.array(z.string()).nullish().transform((v) => v ?? []),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
});

const rawJobSchema = z.object({
  id: z.string(),
  slug: z.string(),
  status: z.string(),
  department: z.string(),
  level: z.string(),
  type: z.string(),
  location: z.string(),
  icon: z.string().nullable(),
  authorId: z.string().nullable(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  translations: z.array(rawTranslationSchema),
  views: z.union([z.number(), z.string()]).catch(0),
  applications: z.union([z.number(), z.string()]).catch(0),
});

type TRawTranslation = z.infer<typeof rawTranslationSchema>;
type TRawJob = z.infer<typeof rawJobSchema>;

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
    responsibilities: translation.responsibilities,
    requirements: translation.requirements,
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

export const getPublishedJobs = async (locale: string): Promise<TPublicJob[]> => {
  const result = await trpcFetch('jobs.list', {}, {
    schema: z.array(z.unknown()),
    next: { revalidate: 60, tags: ['jobs'] },
  });

  if (!result.ok) return [];

  const jobs: TPublicJob[] = [];

  for (const item of result.data) {
    const parsed = rawJobSchema.safeParse(item);
    if (!parsed.success) {
      console.warn('[careers] skipping malformed job', parsed.error);
      continue;
    }
    if (parsed.data.status !== 'PUBLISHED') continue;

    const localized = localizeJob(parsed.data, locale);
    if (localized) jobs.push(localized);
  }

  return jobs;
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
  const result = await trpcFetch('jobs.incrementViews', { id }, { method: 'POST' });
  if (!result.ok) return false;

  revalidateTag('jobs', 'max');
  revalidatePath(`/${locale}/careers/${slug}`);
  return true;
};