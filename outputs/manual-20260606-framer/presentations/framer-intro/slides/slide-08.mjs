import { C, bg, txt, title, panel, footer } from "./common.mjs";

export async function slide08(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, "Prix : choisir selon la taille du projet", "D'abord tester gratuitement, puis passer à une offre selon les besoins.", "07 · PRIX");
  const plans = [
    ["Free", "$0", "Tester l'outil", "Premiers essais", C.muted],
    ["Basic", "$10/mo", "Site personnel", "Portfolio ou petit projet", C.green],
    ["Pro", "$30/mo", "Projet d'équipe", "Plus de pages et de CMS", C.blue],
    ["Scale / Enterprise", "$100+/mo", "Grands projets", "Trafic et besoins élevés", C.orange],
  ];
  plans.forEach((p, i) => {
    const x = 80 + i * 282;
    const h = 168 + i * 28;
    const top = 390 - h + 150;
    panel(slide, ctx, x, top, 230, h, { fill: i === 0 ? C.white : "#FFFFFF", stroke: p[4] });
    const titleSize = i === 3 ? 19 : 24;
    txt(slide, ctx, p[0], x + 20, top + 28, 184, 42, { size: titleSize, bold: true, color: p[4] });
    txt(slide, ctx, p[1], x + 20, top + 78, 180, 34, { size: i === 3 ? 27 : 30, bold: true });
    txt(slide, ctx, p[2], x + 20, top + 126, 180, 24, { size: 19, bold: true });
    txt(slide, ctx, p[3], x + 20, top + 152, 180, 20, { size: 13, color: C.muted });
  });
  txt(slide, ctx, "Formule simple : Free pour apprendre, Basic pour un site personnel, Pro pour une équipe, Scale/Enterprise pour les grands projets.", 86, 606, 980, 30, { size: 19, bold: true });
  footer(slide, ctx, 8);
  return slide;
}
