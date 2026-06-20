import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import contestRows from '../src/data/innovation-contest.json';
import clubs from '../src/data/clubs.json';
import partners from '../src/data/partners.json';

const root = process.cwd();

describe('layout content contracts', () => {
  it('keeps the innovation contest facts needed by the overview cards', () => {
    const frText = contestRows.map((row) => row.paragraph.fr).join(' ');

    expect(frText).toContain('2020');
    expect(frText).toContain('1 200');
    expect(frText).toContain('300');
    expect(frText).toContain('décembre à avril');
  });

  it('keeps three contest rows with images for the visual cards', () => {
    expect(contestRows).toHaveLength(3);
    expect(contestRows.map((row) => row.image)).toEqual([
      "/images/vie d'etudient/10.jpg",
      "/images/vie d'etudient/11.jpg",
      "/images/vie d'etudient/12.jpg",
    ]);
  });

  it('keeps campus clubs with years and images', () => {
    expect(clubs.map((club) => club.foundedYear)).toEqual([2007, 2005]);
    expect(clubs.every((club) => club.image.length > 0)).toBe(true);
  });

  it('keeps corrected partner links and localized names', () => {
    const akila = partners.find((partner) => partner.slug === 'akila');
    const sChuang = partners.find((partner) => partner.slug === 's-chuang-china');

    expect(akila?.website).toBe('https://www.akila3d.com');
    expect(sChuang?.name.fr).toBe('S-Chuang Chine');
  });

  it('normalizes partner carousel offset after animated nudges instead of before them', () => {
    const source = readFileSync(join(root, 'src', 'components', 'PartnersCarousel.astro'), 'utf8');

    expect(source).toContain('offset += halfWidth;');
    expect(source).toContain('secondSetFirst.offsetLeft - first.offsetLeft');
    expect(source).not.toContain('halfWidth = track.scrollWidth / 2;');
    expect(source).toContain('window.cancelAnimationFrame(nudgeFrame);');
    expect(source).toContain('const easeOutCubic');
    expect(source).toContain('nudgeFrame = window.requestAnimationFrame(animate);');
    expect(source).toContain('offset = wrap(to);');
    expect(source).toContain('paused = prefersReduced;');
    expect(source).toContain('transition: none;');
    expect(source).not.toContain('RESUME_DELAY_MS = 1200');
    expect(source).not.toContain('offset = wrap(offset + direction * stepPx);');
    expect(source).not.toContain("track.classList.add('is-animating')");
  });

  it('renders campus club cards with the shared soft-card and fading image treatment', () => {
    const source = readFileSync(join(root, 'src', 'components', 'ClubCard.astro'), 'utf8');

    expect(source).toContain('box-shadow: var(--shadow-card);');
    expect(source).toContain('border-radius: var(--radius-md);');
    expect(source).toContain('mask-image: linear-gradient(90deg');
    expect(source).toContain('mix-blend-mode: color;');
    expect(source).toContain('filter: grayscale(1)');
    expect(source).toContain('filter: grayscale(0)');
    expect(source).toContain('.club-card__name::after');
    expect(source).toContain('color: var(--color-heading);');
  });

  it('renders the innovation semester copy inside the shared soft-card style', () => {
    const source = readFileSync(join(root, 'src', 'components', 'InnovationSemesterWall.astro'), 'utf8');

    expect(source).toContain('class="semester-card"');
    expect(source).toContain('/images/innovation-semester-illustration.png');
    expect(source).toContain('box-shadow: var(--shadow-card);');
    expect(source).toContain('border-radius: var(--radius-md);');
    expect(source).toContain('background-size: auto, auto, 58% 100%;');
    expect(source).toContain("c.paragraphs.join(' ')");
  });

  it('scrolls the campus photo wall with the same continuous loop model as partner logos', () => {
    const source = readFileSync(join(root, 'src', 'components', 'CampusPhotoWall.astro'), 'utf8');

    expect(source).toContain('PX_PER_SECOND');
    expect(source).toContain('requestAnimationFrame(stepFn)');
    expect(source).toContain('secondSetFirst.offsetLeft - first.offsetLeft');
    expect(source).toContain('offset = wrap(offset + PX_PER_SECOND * dt);');
    expect(source).toContain('track.style.transform');
    expect(source).not.toContain('viewport.scrollBy');
  });

  it('loads every image from the student life photo folder for the campus photo wall', () => {
    const source = readFileSync(join(root, 'src', 'components', 'CampusPhotoWall.astro'), 'utf8');
    const folderImages = readdirSync(join(root, 'public', 'images', "vie d'etudient")).filter((file) => file.endsWith('.jpg'));

    expect(folderImages).toHaveLength(13);
    expect(source).toContain('readdirSync(photoDir)');
    expect(source).toContain('supportedPhotoExtensions');
    expect(source).not.toContain("/images/vie d'etudient/2.jpg");
  });

  it('renders the innovation contest as stats plus feature cards', () => {
    const source = readFileSync(join(root, 'src', 'components', 'InnovationContest.astro'), 'utf8');

    expect(source).toContain('contest__stats');
    expect(source).toContain('contest__visual');
    expect(source).toContain('/images/innovation-contest-process-transparent.png');
    expect(source).toContain('mask-image: linear-gradient');
    expect(source).toContain('rotate(90deg)');
    expect(source).toContain('contest-card');
    expect(source).toContain('scale(1.012)');
    expect(source).toContain('.contest-card:hover');
    expect(source).toContain('{row.paragraph[lang]}');
    expect(source).not.toContain('summarize(row.paragraph[lang])');
    expect(source).not.toContain('contest__graphic');
    expect(source).not.toContain('contest-row__text');
  });

  it('keeps testimonial cards draggable while adding a custom visual block and stronger identity styling', () => {
    const source = readFileSync(join(root, 'src', 'components', 'TestimonialCarousel.astro'), 'utf8');

    expect(source).toContain('overflow-x-auto snap-x snap-mandatory');
    expect(source).toContain('testimonial-card__initials');
    expect(source).toContain('{initials(t.data.name)}');
    expect(source).toContain('testimonial-card__visual');
    expect(source).not.toContain('src={t.data.photo}');
    expect(source).toContain('box-shadow: none;');
    expect(source).toContain('testimonial-card__name');
    expect(source).toContain('testimonial-card__meta');
    expect(source).toContain('testimonial-card__quote-mark');
  });
});
