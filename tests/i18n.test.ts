import { describe, it, expect } from 'vitest';
import { getLangFromUrl, useTranslations, switchLangUrl } from '../src/i18n/utils';

describe('getLangFromUrl', () => {
  it('returns lang from /en/ path', () => {
    expect(getLangFromUrl(new URL('https://x/en/'))).toBe('en');
  });
  it('returns lang from /fr/ path', () => {
    expect(getLangFromUrl(new URL('https://x/fr/foo'))).toBe('fr');
  });
  it('returns lang from /zh/ path', () => {
    expect(getLangFromUrl(new URL('https://x/zh/'))).toBe('zh');
  });
  it('falls back to fr when no lang prefix', () => {
    expect(getLangFromUrl(new URL('https://x/'))).toBe('fr');
  });
});

describe('useTranslations', () => {
  it('returns key in chosen lang', () => {
    const t = useTranslations('fr');
    expect(t('nav.about')).toBe('À propos');
  });
  it('falls back to fr when key missing in lang', () => {
    const t = useTranslations('zh');
    expect(typeof t('nav.about')).toBe('string');
  });
});

describe('switchLangUrl', () => {
  it('replaces /fr/ with /en/', () => {
    expect(switchLangUrl('/fr/#about', 'en')).toBe('/en/#about');
  });
  it('preserves hash + query', () => {
    expect(switchLangUrl('/fr/?x=1#about', 'zh')).toBe('/zh/?x=1#about');
  });
});
