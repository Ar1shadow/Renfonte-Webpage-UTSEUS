import { ui, defaultLang, type Lang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  if (seg === 'en' || seg === 'fr' || seg === 'zh') return seg;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui[typeof defaultLang]): string {
    return (ui[lang] as any)[key] ?? ui[defaultLang][key] ?? String(key);
  };
}

export function switchLangUrl(pathWithHashQuery: string, target: Lang): string {
  return pathWithHashQuery.replace(/^\/(en|fr|zh)(\/|$)/, `/${target}$2`);
}
