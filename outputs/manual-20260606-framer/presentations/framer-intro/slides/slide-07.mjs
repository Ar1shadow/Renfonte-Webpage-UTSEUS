import { C, bg, txt, title, panel, footer, line } from "./common.mjs";

export async function slide07(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, "Comparer Framer avec les méthodes courantes", "Chaque outil a ses forces selon le type de projet.", "06 · COMPARAISON");
  const x0 = 70, y0 = 188;
  const cols = [190, 170, 170, 170, 170, 230];
  const headers = ["Outil", "Prise en main", "Liberté", "Publication", "Collaboration", "Le plus adapté à"];
  let x = x0;
  headers.forEach((h, i) => {
    panel(slide, ctx, x, y0, cols[i], 46, { fill: C.dark, stroke: C.dark });
    txt(slide, ctx, h, x + 12, y0 + 13, cols[i] - 24, 20, { size: 15, color: C.white, bold: true, align: "center" });
    x += cols[i];
  });
  const rows = [
    ["Framer", "Rapide", "Moyenne", "Rapide", "Bonne", "Portfolio, site produit, landing page"],
    ["HTML/CSS/JS", "Difficile", "Très haute", "Plus lente", "Selon l'équipe", "Web App complexe"],
    ["Webflow", "Moyenne", "Haute", "Assez rapide", "Bonne", "Site professionnel et CMS"],
    ["Figma", "Rapide", "Design libre", "Non direct", "Très forte", "Interface et prototype"],
  ];
  rows.forEach((r, ri) => {
    x = x0;
    const y = y0 + 46 + ri * 72;
    r.forEach((cell, ci) => {
      panel(slide, ctx, x, y, cols[ci], 72, { fill: ri === 0 ? "#EAF4EF" : C.white, stroke: C.line });
      txt(slide, ctx, cell, x + 10, y + 18, cols[ci] - 20, 34, { size: ci === 0 ? 18 : 14, bold: ci === 0 || ri === 0, align: ci > 0 && ci < 5 ? "center" : "left", color: ri === 0 ? C.green : C.ink });
      x += cols[ci];
    });
  });
  line(slide, ctx, 70, 570, 1110, 2, C.line);
  txt(slide, ctx, "Résumé : Framer est le plus direct quand l'objectif est de publier vite un vrai site visuel.", 80, 604, 930, 28, { size: 20, bold: true });
  footer(slide, ctx, 7);
  return slide;
}
