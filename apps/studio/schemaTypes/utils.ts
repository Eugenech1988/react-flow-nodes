import type { SlugValidationContext } from 'sanity';

export const isUniqueOtherThanLanguage = async (
  slug: string,
  context: SlugValidationContext,
) => {
  const { document, getClient } = context;
  if (!document?.language) {
    return true;
  }

  const client = getClient({ apiVersion: '2024-01-01' });
  const id = document._id.replace(/^drafts\./, '');

  const params = {
    draft: `drafts.${id}`,
    published: id,
    language: document.language,
    slug,
  };

  const query = `!defined(*[
    !(_id in [$draft, $published]) &&
    language == $language &&
    slug.current == $slug
  ][0]._id)`;

  return await client.fetch<boolean>(query, params);
};