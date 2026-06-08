export const C = {
  ink: "#161615",
  muted: "#5F615F",
  soft: "#F4F1EC",
  paper: "#FBFAF7",
  line: "#D8D2C7",
  green: "#1D7F66",
  blue: "#3157D5",
  orange: "#D97728",
  red: "#B4423A",
  dark: "#171717",
  white: "#FFFFFF",
};

export function bg(slide, ctx, fill = C.paper) {
  ctx.addShape(slide, { x: 0, y: 0, w: ctx.W, h: ctx.H, fill, line: ctx.line("#00000000", 0) });
}

export function txt(slide, ctx, text, x, y, w, h, opt = {}) {
  return ctx.addText(slide, {
    text,
    x, y, w, h,
    fontSize: opt.size ?? 28,
    color: opt.color ?? C.ink,
    bold: opt.bold ?? false,
    typeface: opt.face ?? (opt.title ? ctx.fonts.title : ctx.fonts.body),
    align: opt.align ?? "left",
    valign: opt.valign ?? "top",
    fill: opt.fill ?? "#00000000",
    line: opt.line ?? ctx.line("#00000000", 0),
    insets: opt.insets ?? { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function title(slide, ctx, zh, fr, section = "") {
  if (section) txt(slide, ctx, section, 56, 34, 260, 22, { size: 14, color: C.green, bold: true });
  const longTitle = zh.length > 52;
  txt(slide, ctx, zh, 56, 62, 900, longTitle ? 76 : 58, { size: longTitle ? 30 : 34, bold: true, title: true });
  txt(slide, ctx, fr, 58, longTitle ? 142 : 122, 880, 34, { size: 16, color: C.muted });
}

export function chip(slide, ctx, label, x, y, w, color = C.green) {
  ctx.addShape(slide, { x, y, w, h: 34, fill: color, line: ctx.line("#00000000", 0) });
  txt(slide, ctx, label, x + 12, y + 7, w - 24, 20, { size: 15, color: C.white, bold: true, align: "center" });
}

export function panel(slide, ctx, x, y, w, h, opt = {}) {
  return ctx.addShape(slide, {
    x, y, w, h,
    fill: opt.fill ?? C.white,
    line: ctx.line(opt.stroke ?? C.line, opt.width ?? 1),
  });
}

export function footer(slide, ctx, n) {
  txt(slide, ctx, `Introduction à Framer · ${String(n).padStart(2, "0")}`, 56, 680, 360, 18, { size: 12, color: "#8A8985" });
}

export function bullet(slide, ctx, zh, fr, x, y, w, color = C.green) {
  ctx.addShape(slide, { geometry: "ellipse", x, y: y + 6, w: 8, h: 8, fill: color, line: ctx.line("#00000000", 0) });
  txt(slide, ctx, zh, x + 18, y, w - 18, 26, { size: 20, bold: true });
  txt(slide, ctx, fr, x + 18, y + 29, w - 18, 24, { size: 14, color: C.muted });
}

export function line(slide, ctx, x, y, w, h, color = C.line, width = 2) {
  ctx.addShape(slide, { x, y, w, h, fill: color, line: ctx.line("#00000000", 0) });
}
