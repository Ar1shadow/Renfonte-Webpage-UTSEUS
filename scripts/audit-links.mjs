import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';

export const isExternal = (href) => /^https?:\/\//.test(href);
export const isFragment = (href) => href.startsWith('#');

async function main() {
  const files = await glob('dist/**/*.html');
  const links = new Set();
  for (const f of files) {
    const html = await readFile(f, 'utf8');
    for (const m of html.matchAll(/href="([^"]+)"/g)) {
      if (isExternal(m[1])) links.add(m[1]);
    }
  }
  const results = [];
  for (const url of links) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      results.push({ url, status: res.status });
    } catch (e) {
      results.push({ url, status: 'ERR', error: String(e) });
    }
  }
  await writeFile('data/links-report.json', JSON.stringify(results, null, 2));
  const broken = results.filter(r => r.status === 'ERR' || (typeof r.status === 'number' && r.status >= 400));
  console.log(`${results.length} external links checked, ${broken.length} broken`);
  process.exit(broken.length ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
