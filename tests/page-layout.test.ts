import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const pages = ['fr', 'en', 'zh'] as const;

describe('homepage shell layout', () => {
  it('keeps the sidebar rail from forcing horizontal overflow near the lg breakpoint', () => {
    for (const lang of pages) {
      const source = readFileSync(join(root, 'src', 'pages', lang, 'index.astro'), 'utf8');

      expect(source).toContain('xl:grid-cols-[240px_minmax(0,1fr)]');
      expect(source).toContain('<div class="min-w-0">');
      expect(source).not.toContain('lg:grid-cols-[260px_1fr]');
    }
  });

  it('shows the sticky sidebar only when the two-column shell is active', () => {
    const source = readFileSync(join(root, 'src', 'styles', 'global.css'), 'utf8');

    expect(source).toContain('@media (min-width: 1280px)');
    expect(source).toContain('.page-rail');
    expect(source).not.toContain('@media (min-width: 1024px)');
  });

  it('keeps the top text navigation visible on medium desktop widths', () => {
    const source = readFileSync(join(root, 'src', 'styles', 'global.css'), 'utf8');

    expect(source).toMatch(/@media \(max-width: 900px\) \{\s*\.site-header__nav \{ display: none; \}\s*\}/);
    expect(source).not.toMatch(/@media \(max-width: 1100px\) \{\s*\.site-header__nav \{ display: none; \}/);
  });
});
