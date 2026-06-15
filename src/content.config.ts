import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const sectionId = z.enum([
  'hero',
  'about',
  'courses',
  'campuslife',
  'partners',
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

const partners = defineCollection({
  loader: file('src/data/partners.json'),
  schema: z.object({
    slug: z.string(),
    name: langTriad,
    description: langTriad.optional(),
    website: z.url().optional(),
    logo: z.string(),
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

const clubs = defineCollection({
  loader: file('src/data/clubs.json'),
  schema: z.object({
    slug: z.string(),
    name: langTriad,
    description: langTriad,
    image: z.string(),
    foundedYear: z.number().int(),
  }),
});

const innovationContest = defineCollection({
  loader: file('src/data/innovation-contest.json'),
  schema: z.object({
    order: z.number().int(),
    image: z.string(),
    alt: langTriad,
    paragraph: langTriad,
  }),
});

export const collections = { sections, partners, testimonials, programs, clubs, innovationContest };
