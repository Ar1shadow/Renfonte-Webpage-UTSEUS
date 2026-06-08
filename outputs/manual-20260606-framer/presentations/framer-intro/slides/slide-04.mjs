import { C, bg, txt, title, panel, chip, bullet, footer } from "./common.mjs";

export async function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, "No-code est plus visuel, mais il faut comprendre la mise en page", "Framer facilite le travail, mais il garde une logique de design web.", "03 · DESIGN");
  panel(slide, ctx, 72, 212, 486, 330, { fill: C.white });
  txt(slide, ctx, "Ce qui est simple", 106, 244, 300, 28, { size: 26, bold: true });
  bullet(slide, ctx, "Ajouter des blocs directement", "Sans commencer par écrire du code", 112, 332, 360, C.green);
  bullet(slide, ctx, "Modifier texte, couleurs, images", "Tout se règle dans l'interface", 112, 400, 360, C.green);
  bullet(slide, ctx, "Créer une première page rapidement", "Utile pour tester une idée", 112, 468, 360, C.green);
  panel(slide, ctx, 640, 212, 486, 330, { fill: "#FFF5EA", stroke: "#E6C8A8" });
  txt(slide, ctx, "Ce qu'il faut apprendre", 674, 244, 300, 28, { size: 26, bold: true });
  chip(slide, ctx, "padding / margin", 690, 340, 180, C.orange);
  chip(slide, ctx, "alignment", 894, 340, 132, C.orange);
  chip(slide, ctx, "stack / gap", 690, 402, 146, C.orange);
  chip(slide, ctx, "responsive", 860, 402, 164, C.orange);
  txt(slide, ctx, "Conclusion : Framer réduit la difficulté du code,", 674, 472, 390, 24, { size: 17, bold: true });
  txt(slide, ctx, "mais pas la logique du design web.", 674, 500, 390, 24, { size: 17, bold: true });
  footer(slide, ctx, 4);
  return slide;
}
