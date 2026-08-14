// Shared design tokens. One palette per scheme, so a card never defines a
// colour twice and dark/light stay in lockstep.

export const THEMES = {
  dark: {
    name: "dark",
    bg: "#0D1117",
    panel: "#0F1520",
    grid: "#8B5CF6",
    gridOpacity: 0.07,
    stroke: "#1F2732",
    text: "#E6EDF3",
    muted: "#8B949E",
    faint: "#6E7681",
    brandA: "#A855F7",
    brandB: "#22D3EE",
    accent: "#F472B6",
    glow: 0.13,
    tile: "#131A26",
    tileStroke: "#222B38",
  },
  light: {
    name: "light",
    bg: "#FFFFFF",
    panel: "#F6F8FA",
    grid: "#7C3AED",
    gridOpacity: 0.09,
    stroke: "#D1D9E0",
    text: "#1F2328",
    muted: "#59636E",
    faint: "#818B98",
    brandA: "#7C3AED",
    brandB: "#0891B2",
    accent: "#DB2777",
    glow: 0.07,
    tile: "#F6F8FA",
    tileStroke: "#D8DEE4",
  },
};

export const SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Ubuntu,Helvetica,Arial,sans-serif";
export const MONO =
  "ui-monospace,SFMono-Regular,'SF Mono',Consolas,'Liberation Mono',Menlo,monospace";

/** XML-escape text that came from the API. */
export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** 1234567 -> "1.2M", 12345 -> "12.3k" */
export function human(n) {
  if (n === null || n === undefined) return "0";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e4) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

/**
 * The shared chrome every card sits on: background, violet dot-matrix, a soft
 * corner glow and a hairline border.
 */
export function frame(t, w, h, id) {
  return `
  <defs>
    <linearGradient id="brand-${id}" x1="0" y1="0" x2="1" y2="0.6">
      <stop offset="0%" stop-color="${t.brandA}"/>
      <stop offset="55%" stop-color="${t.accent}"/>
      <stop offset="100%" stop-color="${t.brandB}"/>
    </linearGradient>
    <linearGradient id="sweep-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${t.brandA}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${t.brandA}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${t.brandB}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="glow-${id}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${t.brandA}" stop-opacity="${t.glow}"/>
      <stop offset="100%" stop-color="${t.brandA}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2-${id}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${t.brandB}" stop-opacity="${t.glow * 0.8}"/>
      <stop offset="100%" stop-color="${t.brandB}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots-${id}" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="1.5" fill="${t.grid}" opacity="${t.gridOpacity}"/>
    </pattern>
    <clipPath id="clip-${id}">
      <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="16"/>
    </clipPath>
  </defs>
  <g clip-path="url(#clip-${id})">
    <rect width="${w}" height="${h}" fill="${t.bg}"/>
    <rect width="${w}" height="${h}" fill="url(#dots-${id})"/>
    <ellipse cx="${w * 0.08}" cy="${-h * 0.05}" rx="${w * 0.30}" ry="${h * 0.62}" fill="url(#glow-${id})"/>
    <ellipse cx="${w * 0.97}" cy="${h * 1.05}" rx="${w * 0.24}" ry="${h * 0.6}" fill="url(#glow2-${id})"/>
  </g>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="16"
        fill="none" stroke="${t.stroke}"/>`;
}

/** The animated hairline that runs along the top edge of every card. */
export function topSweep(w, id, dur = "7s") {
  return `
  <g clip-path="url(#clip-${id})">
    <rect class="sweep" x="0" y="0" width="${w * 0.45}" height="2" fill="url(#sweep-${id})"/>
  </g>
  <style>
    .sweep { animation: sweep-${id} ${dur} cubic-bezier(.45,0,.25,1) infinite; }
    @keyframes sweep-${id} {
      0%   { transform: translateX(${-w * 0.45}px); }
      100% { transform: translateX(${w}px); }
    }
    @media (prefers-reduced-motion: reduce) { .sweep { animation: none; opacity: .5; } }
  </style>`;
}
