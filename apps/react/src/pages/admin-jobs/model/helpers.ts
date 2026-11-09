import type { IJob } from './types';
import type { TJobFormOutput } from './form-schema';

export const splitLines = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean);

export const fillTranslation = (t?: IJob['translations'][number]) => ({
  title: t?.title ?? '',
  description: t?.description ?? '',
  responsibilities: t?.responsibilities.join('\n') ?? '',
  requirements: t?.requirements.join('\n') ?? '',
  metaTitle: t?.metaTitle ?? '',
  metaDescription: t?.metaDescription ?? '',
});

type TTranslationData = Pick<
  TJobFormOutput['en'],
  'title' | 'description' | 'responsibilities' | 'requirements' | 'metaTitle' | 'metaDescription'
>;

export const buildTranslationPayload = (locale: string, t: TTranslationData) => ({
  locale,
  title: t.title.trim(),
  description: t.description.trim(),
  responsibilities: splitLines(t.responsibilities),
  requirements: splitLines(t.requirements),
  metaTitle: t.metaTitle?.trim() || undefined,
  metaDescription: t.metaDescription?.trim() || undefined,
});