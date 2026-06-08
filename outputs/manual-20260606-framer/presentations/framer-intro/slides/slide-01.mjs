import { C, bg, txt, chip, footer, line } from "./common.mjs";

export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.dark);
  txt(slide, ctx, "FRAMER", 56, 52, 360, 52, { size: 42, bold: true, color: C.white, title: true });
  txt(slide, ctx, "Du design web à un vrai site publié", 56, 184, 760, 94, { size: 44, bold: true, color: C.white, title: true });
  txt(slide, ctx, "Idée clé : Framer réunit le design, l'interaction et la publication dans un seul outil.", 56, 382, 780, 62, { size: 25, color: C.white, bold: true });
  txt(slide, ctx, "Un outil no-code pour créer, animer et publier un site plus rapidement.", 58, 452, 760, 34, { size: 18, color: "#D7D0C4" });
  chip(slide, ctx, "No-code", 900, 124, 160, C.green);
  chip(slide, ctx, "CMS", 996, 230, 120, C.blue);
  chip(slide, ctx, "AI", 850, 332, 110, C.orange);
  chip(slide, ctx, "Publish", 1010, 438, 160, C.red);
  line(slide, ctx, 894, 162, 192, 2, "#4A4946", 2);
  line(slide, ctx, 1010, 268, 80, 2, "#4A4946", 2);
  line(slide, ctx, 924, 370, 132, 2, "#4A4946", 2);
  footer(slide, ctx, 1);
  return slide;
}
