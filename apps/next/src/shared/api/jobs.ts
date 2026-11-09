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
};

// type TTRPCEnvelope<T> =
//   | { result: { data: T } }
//   | { result: { data: { json: T } } };

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
  };
};

const buildTrpcUrl = (path: string, input: unknown): string => {
  const encoded = encodeURIComponent(JSON.stringify({ 0: { json: input } }));
  return `${API_URL}/trpc/${path}?batch=1&input=${encoded}`;
};

const assertApiUrl = (): string | null => {
  if (!API_URL) {
    console.error('[careers] API_URL is not set (expected API_URL or NEXT_PUBLIC_API_URL)');
    return null;
  }
  return API_URL;
};

export async function getPublishedJobs(locale: string): Promise<TPublicJob[]> {
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
}

export async function getJobBySlug(locale: string, slug: string): Promise<TPublicJob | null> {
  const jobs = await getPublishedJobs(locale);
  return jobs.find((j) => j.slug === slug) ?? null;
}
