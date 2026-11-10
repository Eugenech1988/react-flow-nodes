import { defineQuery } from 'next-sanity';

export const POSTS_QUERY = defineQuery(`*[_type == "post"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  body
}`);
