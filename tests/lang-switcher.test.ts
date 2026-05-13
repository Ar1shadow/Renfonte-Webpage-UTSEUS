import { describe, it, expect } from 'vitest';
import { buildSwitcherTargets } from '../src/i18n/utils';

describe('buildSwitcherTargets', () => {
  it('builds 3 targets from /fr/#about', () => {
    expect(buildSwitcherTargets('/fr/#about')).toEqual([
      { lang: 'fr', url: '/fr/#about' },
      { lang: 'en', url: '/en/#about' },
      { lang: 'zh', url: '/zh/#about' },
    ]);
  });
});
