import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { documentInternationalization } from '@sanity/document-internationalization';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'Pipeline Studio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || '',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Blog Posts')
              .child(
                S.documentTypeList('translation.metadata')
                  .title('Blog Posts')
                  .child((documentId) =>
                    S.document()
                      .documentId(documentId)
                      .schemaType('translation.metadata')
                  )
              ),
            ...S.documentTypeListItems().filter(
              (listItem) => !['post', 'translation.metadata'].includes(listItem.getId() as string)
            ),
          ]),
    }),
    documentInternationalization({
      supportedLanguages: [
        { id: 'en', title: 'English' },
        { id: 'uk', title: 'Українська' },
      ],
      schemaTypes: ['post'],
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});