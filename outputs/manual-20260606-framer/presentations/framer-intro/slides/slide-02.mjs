import { C, bg, txt, title, panel, footer, line } from "./common.mjs";

export async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, "Le processus classique est long ; Framer le raccourcit", "Créer un site demande souvent design, développement et publication.", "01 · POURQUOI");
  const steps = [
    ["Maquette", "Design", "Figma / outil de design"],
    ["Code", "Développement", "HTML · CSS · JS"],
    ["Publication", "Mise en ligne", "Serveur · domaine · performance"],
  ];
  steps.forEach((s, i) => {
    const x = 70 + i * 275;
    panel(slide, ctx, x, 248, 210, 128, { fill: C.white });
    txt(slide, ctx, s[0], x + 24, 270, 164, 30, { size: 26, bold: true });
    txt(slide, ctx, s[1], x + 24, 306, 164, 22, { size: 15, color: C.muted });
    txt(slide, ctx, s[2], x + 24, 338, 164, 20, { size: 14, color: C.green, bold: true });
    if (i < 2) {
      line(slide, ctx, x + 230, 310, 38, 3, C.line);
      txt(slide, ctx, "→", x + 246, 292, 40, 28, { size: 24, color: C.muted });
    }
  });
  panel(slide, ctx, 890, 226, 300, 172, { fill: "#EAF4EF", stroke: "#BFD8CE" });
  txt(slide, ctx, "Framer", 928, 256, 230, 34, { size: 31, bold: true, color: C.green, title: true });
  txt(slide, ctx, "Design + interaction + publication", 928, 310, 220, 54, { size: 22, bold: true });
  txt(slide, ctx, "En une phrase : ce n'est pas seulement une maquette,", 92, 502, 760, 30, { size: 23, bold: true });
  txt(slide, ctx, "c'est un vrai site.", 92, 534, 760, 30, { size: 23, bold: true });
  txt(slide, ctx, "Le résultat peut être publié et visité en ligne.", 94, 572, 720, 24, { size: 16, color: C.muted });
  footer(slide, ctx, 2);
  return slide;
}
