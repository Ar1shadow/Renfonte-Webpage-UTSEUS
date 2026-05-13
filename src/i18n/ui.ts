export const languages = { en: 'English', fr: 'Français', zh: '中文' } as const;
export const defaultLang = 'fr' as const;
export type Lang = keyof typeof languages;

export const ui = {
  fr: {
    'nav.about': 'À propos',
    'nav.mobility': 'Mobilité',
    'nav.complexcity': 'Laboratoire',
    'nav.projects': 'Projets',
    'nav.testimonials': 'Témoignages',
    'nav.contact': 'Contact',
    'cta.brochure': 'Brochure',
  },
  en: {
    'nav.about': 'About',
    'nav.mobility': 'Mobility',
    'nav.complexcity': 'Lab',
    'nav.projects': 'Projects',
    'nav.testimonials': 'Voices',
    'nav.contact': 'Contact',
    'cta.brochure': 'Brochure',
  },
  zh: {
    'nav.about': '关于',
    'nav.mobility': '交流项目',
    'nav.complexcity': '实验室',
    'nav.projects': '项目',
    'nav.testimonials': '学生反馈',
    'nav.contact': '联系',
    'cta.brochure': '宣传册',
  },
} satisfies Record<Lang, Record<string, string>>;
