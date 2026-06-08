import { C, bg, txt, title, panel, footer, line } from "./common.mjs";

export async function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, "Les composants et animations rendent le site cohérent et vivant", "Ils aident à garder une identité visuelle et à rendre la page plus expressive.", "04 · INTERACTION");
  panel(slide, ctx, 84, 236, 250, 108, { fill: "#EAF4EF", stroke: "#BFD8CE" });
  txt(slide, ctx, "Composant", 112, 260, 196, 28, { size: 23, bold: true, color: C.green });
  txt(slide, ctx, "Un bloc réutilisable", 112, 294, 190, 22, { size: 14, color: C.muted });
  [430, 650, 870].forEach((x, i) => {
    panel(slide, ctx, x, 222, 178, 136, { fill: C.white });
    txt(slide, ctx, ["Bouton", "Menu", "Carte produit"][i], x + 24, 252, 130, 26, { size: 20, bold: true });
    txt(slide, ctx, ["Bouton", "Menu", "Carte produit"][i], x + 24, 284, 130, 20, { size: 14, color: C.muted });
  });
  line(slide, ctx, 350, 288, 60, 3, C.line);
  txt(slide, ctx, "→", 374, 270, 30, 28, { size: 24, color: C.muted });
  line(slide, ctx, 608, 288, 28, 3, C.line);
  line(slide, ctx, 828, 288, 28, 3, C.line);
  panel(slide, ctx, 120, 470, 980, 104, { fill: C.dark, stroke: C.dark });
  txt(slide, ctx, "Comme une classe HTML/CSS :", 158, 490, 520, 24, { size: 19, bold: true, color: C.white });
  txt(slide, ctx, "définir une fois, réutiliser partout.", 158, 518, 520, 24, { size: 19, bold: true, color: C.white });
  txt(slide, ctx, "Un même style peut rester cohérent sur plusieurs pages.", 158, 548, 520, 20, { size: 14, color: "#D7D0C4" });
  txt(slide, ctx, "Animations : hover · scroll · transition", 730, 506, 300, 26, { size: 16, color: "#F4B66A", bold: true });
  footer(slide, ctx, 5);
  return slide;
}
