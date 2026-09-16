import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        tags: z.array(z.string()).optional(),
        workflow: z.array(z.enum(['gather', 'organize', 'reframe'])).optional(),
      }),
    }),
  }),
};
