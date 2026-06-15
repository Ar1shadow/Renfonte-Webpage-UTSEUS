import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const sectionId = z.enum([
  'hero',
  'about',
  'mobility',
  'courses',
  'complexcity',
  'projects',
  'testimonials',
  'contact',
]);

const langTriad = z.object({
  en: z.string(),
  fr: z.string(),
  zh: z.string(),
});

const sections = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/sections' }),
  schema: z.object({
    id: sectionId,
    order: z.number().int().min(1),
    title: z.string(),
    lang: z.enum(['en', 'fr', 'zh']),
    hero_image: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: file('src/data/projects.json'),
  schema: z.object({
    slug: z.string(),
    title: langTriad,
    description: langTriad,
    axis: z.enum(['modeling', 'safety', 'logistics', 'smart-buildings', 'culture']),
    image: z.string(),
    links: z
      .array(z.object({ label: z.string(), url: z.url() }))
      .optional(),
  }),
});

const testimonials = defineCollection({
  loader: file('src/data/testimonials.json'),
  schema: z.object({
    name: z.string(),
    promo: z.string(),
    program: z.string(),
    photo: z.string(),
    quote: langTriad,
    year: z.number().int(),
  }),
});

const programs = defineCollection({
  loader: file('src/data/programs.json'),
  schema: z.object({
    slug: z.string(),
    audience: z.enum(['chinese-students', 'incoming-students']),
    title: langTriad,
    description: langTriad,
    duration: z.string(),
    icon: z.string().optional(),
  }),
});

export const collections = { sections, projects, testimonials, programs };
