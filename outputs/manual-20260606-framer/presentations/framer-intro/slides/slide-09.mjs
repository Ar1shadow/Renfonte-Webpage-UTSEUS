import { C, bg, txt, title, panel, bullet, footer } from "./common.mjs";

export async function slide09(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  title(slide, ctx, "Framer a des avantages clairs, mais ce n'est pas magique", "Il faut choisir l'outil selon le projet.", "08 · LIMITES");
  panel(slide, ctx, 82, 210, 510, 350, { fill: "#EAF4EF", stroke: "#BFD8CE" });
  txt(slide, ctx, "Avantages", 118, 244, 160, 36, { size: 30, bold: true, color: C.green });
  bullet(slide, ctx, "Publication rapide", "Passer vite du design au site", 124, 340, 380, C.green);
  bullet(slide, ctx, "Bon rendu visuel et animations", "Un site plus vivant", 124, 408, 380, C.green);
  bullet(slide, ctx, "Pratique pour petites équipes", "Moins de configuration technique", 124, 476, 380, C.green);
  panel(slide, ctx, 688, 210, 510, 350, { fill: "#FFF1EE", stroke: "#E8B9B0" });
  txt(slide, ctx, "Limites", 724, 244, 160, 36, { size: 30, bold: true, color: C.red });
  bullet(slide, ctx, "Pas idéal seul pour une app complexe", "Comptes, paiement, données temps réel", 730, 340, 390, C.red);
  bullet(slide, ctx, "L'abonnement peut coûter plus cher", "Plus de pages, équipe, options", 730, 408, 390, C.red);
  bullet(slide, ctx, "Dépendance à la plateforme", "Migration parfois plus difficile", 730, 476, 390, C.red);
  footer(slide, ctx, 9);
  return slide;
}
