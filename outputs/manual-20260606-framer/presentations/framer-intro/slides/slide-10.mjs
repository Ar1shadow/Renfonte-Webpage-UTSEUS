import { C, bg, txt, panel, footer } from "./common.mjs";

export async function slide10(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, C.dark);
  txt(slide, ctx, "Conclusion", 72, 58, 180, 34, { size: 20, color: C.green, bold: true });
  txt(slide, ctx, "Framer rend le passage du design à la publication plus court, plus visuel et plus rapide.", 72, 150, 920, 126, { size: 42, bold: true, color: C.white, title: true });
  txt(slide, ctx, "Il convient surtout aux sites de présentation, aux portfolios et aux pages marketing.", 76, 310, 830, 52, { size: 23, color: "#D7D0C4" });
  panel(slide, ctx, 78, 430, 360, 96, { fill: "#262625", stroke: "#44413A" });
  txt(slide, ctx, "Adapté : portfolios, sites produit, landing pages.", 106, 454, 304, 38, { size: 18, color: C.white, bold: true });
  panel(slide, ctx, 490, 430, 460, 96, { fill: "#262625", stroke: "#44413A" });
  txt(slide, ctx, "Ne remplace pas : back-office, commande, Web App complexe.", 518, 454, 404, 38, { size: 18, color: C.white, bold: true });
  txt(slide, ctx, "Merci", 980, 602, 200, 38, { size: 30, color: C.white, bold: true, align: "right" });
  footer(slide, ctx, 10);
  return slide;
}
