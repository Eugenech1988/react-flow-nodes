import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { demoRequestInputSchema } from '@pipeline/contracts'; // Или ваш локальный путь к схеме

export const server = {
  mail: {
    requestDemo: defineAction({
      accept: 'form',
      input: demoRequestInputSchema,
      handler: async (input) => {
        const adminEmail = process.env.ADMIN_EMAIL || 'sales@example.com';

        // await mailService.sendDemoRequestEmail(input);

        return { success: true };
      },
    }),
  },
};
