import { createClient } from 'next-sanity'

export const client = createClient({
  // Эти значения можно найти в файле apps/studio/sanity.config.ts
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01', // Используйте актуальную версию API
  useCdn: true,
})