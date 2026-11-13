import { groq } from 'next-sanity';

const PREVIEW_FIELDS = groq`
  "id": coalesce(id, _id),
  "slug": slug.current,
  "date": array::join(
    string::split(
      coalesce(
        string::split(publishedAt, "T")[0],
        string::split(_createdAt, "T")[0]
      ),
      "-"
    ),
    "."
  ),
  title,
  excerpt,
  category,
  author,
  readTime,
  featured
`;

const DETAIL_FIELDS = groq`
  ${PREVIEW_FIELDS},
  mainImage,
  body
`;

const POSTS_QUERY = groq`
  *[_type == "post" && (language == $locale || ($locale == "uk" && language == "ua"))]
    | order(coalesce(publishedAt, _createdAt) desc) {
    ${PREVIEW_FIELDS}
  }
`;

const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && language == $locale && slug.current == $slug][0] {
    ${DETAIL_FIELDS}
  }
`;

const ALL_SLUGS_QUERY = groq`
  *[_type == "post" && language == $locale]{ "slug": slug.current }
`;

export { POSTS_QUERY, POST_BY_SLUG_QUERY, ALL_SLUGS_QUERY };
