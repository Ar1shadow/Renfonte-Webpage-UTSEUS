import { describe, it, expect } from 'vitest';
import { isExternal, isFragment } from '../scripts/audit-links.mjs';

describe('audit helpers', () => {
  it('isExternal true for http(s)', () => {
    expect(isExternal('https://x.com')).toBe(true);
    expect(isExternal('http://x.com')).toBe(true);
  });
  it('isExternal false for relative', () => {
    expect(isExternal('/fr/')).toBe(false);
    expect(isExternal('./foo')).toBe(false);
  });
  it('isFragment true for #x', () => {
    expect(isFragment('#about')).toBe(true);
  });
});
