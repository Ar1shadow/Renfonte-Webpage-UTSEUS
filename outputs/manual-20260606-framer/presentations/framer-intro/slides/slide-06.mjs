import { C, bg, txt, title, panel, footer, line } from "./common.mjs";

export async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, "Trois fonctions fortes : IA, CMS, publication en un clic", "Ces fonctions rendent Framer très pratique pour créer un site rapidement.", "05 · FONCTIONS");
  const flows = [
    ["L'IA crée une base", "Départ rapide", "Écrire une description et obtenir une première page modifiable.", C.blue],
    ["Le CMS gère le contenu", "Contenu vivant", "Mettre à jour blog, projets ou produits plus facilement.", C.green],
    ["Publier en un clic", "Mise en ligne", "Publier le site ou connecter un domaine personnalisé.", C.orange],
  ];
  flows.forEach((f, i) => {
    const x = 88 + i * 375;
    panel(slide, ctx, x, 228, 292, 242, { fill: C.white });
    ctx.addShape(slide, { x: x + 28, y: 256, w: 56, h: 56, fill: f[3], line: ctx.line("#00000000", 0) });
    txt(slide, ctx, `${i + 1}`, x + 46, 266, 24, 32, { size: 24, color: C.white, bold: true, align: "center" });
    txt(slide, ctx, f[0], x + 28, 338, 220, 30, { size: 25, bold: true });
    txt(slide, ctx, f[1], x + 28, 372, 220, 22, { size: 15, color: C.muted });
    txt(slide, ctx, f[2], x + 28, 418, 220, 38, { size: 16 });
    if (i < 2) {
      line(slide, ctx, x + 306, 346, 42, 3, C.line);
      txt(slide, ctx, "→", x + 324, 328, 34, 28, { size: 24, color: C.muted });
    }
  });
  txt(slide, ctx, "Différence avec Figma : Figma est très fort pour la maquette ; Framer transforme le design en site.", 96, 560, 920, 30, { size: 21, bold: true });
  footer(slide, ctx, 6);
  return slide;
}
