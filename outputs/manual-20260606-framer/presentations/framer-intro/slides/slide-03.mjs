import { C, bg, txt, title, panel, footer } from "./common.mjs";

export async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, "Le positionnement de Framer : trois outils en un", "Framer combine design, gestion de contenu et publication.", "02 · BASES");
  const items = [
    ["Outil de design web", "Créer les pages", "Ajouter texte, images, boutons, menus et sections."],
    ["Gestion de contenu", "CMS", "Gérer blog, projets, produits et contenus répétés."],
    ["Publication", "Hébergement", "Publier le site et connecter un nom de domaine."],
  ];
  items.forEach((it, i) => {
    const x = 72 + i * 380;
    const color = [C.green, C.blue, C.orange][i];
    panel(slide, ctx, x, 226, 316, 292, { fill: C.white });
    ctx.addShape(slide, { x: x + 26, y: 254, w: 58, h: 58, fill: color, line: ctx.line("#00000000", 0) });
    txt(slide, ctx, `${i + 1}`, x + 43, 263, 26, 32, { size: 25, bold: true, color: C.white, align: "center" });
    txt(slide, ctx, it[0], x + 26, 342, 250, 30, { size: 25, bold: true });
    txt(slide, ctx, it[1], x + 26, 376, 250, 24, { size: 15, color: C.muted });
    txt(slide, ctx, it[2], x + 26, 430, 252, 62, { size: 17, color: C.ink });
  });
  txt(slide, ctx, "Différence clé : le résultat n'est pas seulement une maquette, mais un site publié.", 82, 580, 880, 30, { size: 22, bold: true });
  txt(slide, ctx, "C'est ce qui distingue Framer d'un outil de design classique.", 84, 614, 820, 22, { size: 16, color: C.muted });
  footer(slide, ctx, 3);
  return slide;
}
