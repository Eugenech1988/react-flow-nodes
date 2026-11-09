const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL!;

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
  translations: TRawTranslation[];
};

type TTRPCEnvelope<T> = { result: { data: { json: T } } };

const localizeJob = (raw: TRawJob, locale: string): TPublicJob | null => {
  const t =
    raw.translations.find((x) => x.locale === locale) ??
    raw.translations.find((x) => x.locale === 'en');
  if (!t) return null;
  return {
    id: raw.id,
    slug: raw.slug,
    title: t.title,
    description: t.description,
    responsibilities: t.responsibilities ?? [],
    requirements: t.requirements ?? [],
    department: raw.department,
    level: raw.level,
    type: raw.type,
    location: raw.location,
    icon: raw.icon,
    metaTitle: t.metaTitle,
    metaDescription: t.metaDescription,
  };
};

export async function getPublishedJobs(locale: string): Promise<TPublicJob[]> {
  const input = encodeURIComponent(
    JSON.stringify({ 0: { json: { locale } } }),
  );
  const url = `${API_URL}/trpc/jobs.list?batch=1&input=${input}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60, tags: ['jobs'] },
    });

    if (!res.ok) {
      console.error('[careers] trpc.jobs.list: bad status', res.status, url);
      return [];
    }

    const payload = (await res.json()) as Array<
      TTRPCEnvelope<TRawJob[] | { items: TRawJob[] }>
    >;

    const data = payload[0]?.result?.data?.json;
    if (!data) return [];

    const raw = Array.isArray(data) ? data : (data.items ?? []);

    return raw
      .filter((j) => j.status === 'PUBLISHED')
      .map((j) => localizeJob(j, locale))
      .filter((j): j is TPublicJob => j !== null);
  } catch (err) {
    console.error('[careers] trpc.jobs.list: fetch failed:', err);
    return [];
  }
}