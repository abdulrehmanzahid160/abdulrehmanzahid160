// Design tokens. Light is the primary scheme; the dark variant is a restrained
// mirror of it, not a neon repaint.
//
// Deliberately austere: one accent colour, hairline rules, no glow, no
// multi-stop gradients. Decoration is what makes a profile look generated.

export const THEMES = {
  light: {
    name: "light",
    bg: "#FFFFFF",
    panel: "#F8FAFC",
    ink: "#0F172A",
    muted: "#475569",
    faint: "#94A3B8",
    line: "#E2E8F0",
    rule: "#CBD5E1",
    accent: "#4F46E5",
    accentSoft: "#EEF2FF",
    ramp: ["#F1F5F9", "#C7D2FE", "#A5B4FC", "#818CF8", "#4F46E5"],
  },
  dark: {
    name: "dark",
    bg: "#0D1117",
    panel: "#151B23",
    ink: "#E6EDF3",
    muted: "#9198A1",
    faint: "#6E7681",
    line: "#21262D",
    rule: "#30363D",
    accent: "#818CF8",
    accentSoft: "#1D2333",
    ramp: ["#191F28", "#2E3555", "#454F86", "#5C68B5", "#818CF8"],
  },
};

// A separate, warmer palette for the banner and mascot — those are meant to
// read as a friendly greeting, not a data surface, so they get their own
// gradient rather than borrowing the austere card palette above.
export const BRAND = {
  g1: "#4F46E5", // indigo
  g2: "#7C3AED", // violet
  g3: "#DB2777", // pink
  ink: "#1E1B4B",
};

export const SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Ubuntu,Helvetica,Arial,sans-serif";
export const MONO =
  "ui-monospace,SFMono-Regular,'SF Mono',Consolas,'Liberation Mono',Menlo,monospace";

export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function human(n) {
  if (n === null || n === undefined) return "0";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e4) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

/** Card background: flat panel, hairline border, one accent rule down the left. */
export function frame(t, w, h, id, { accentRule = true } = {}) {
  return `
  <defs>
    <clipPath id="clip-${id}">
      <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="10"/>
    </clipPath>
  </defs>
  <g clip-path="url(#clip-${id})">
    <rect width="${w}" height="${h}" fill="${t.bg}"/>
    ${accentRule ? `<rect x="0" y="0" width="3" height="${h}" fill="${t.accent}"/>` : ""}
  </g>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="10"
        fill="none" stroke="${t.line}"/>`;
}

/** Section label used at the top-left of every card. */
export function cardTitle(t, x, y, text, right) {
  return `
  <text x="${x}" y="${y}" font-family="${SANS}" font-size="15" font-weight="600"
        fill="${t.ink}">${text}</text>
  ${
    right
      ? `<text x="${right.x}" y="${y}" text-anchor="end" font-family="${MONO}"
             font-size="10.5" fill="${t.faint}">${right.text}</text>`
      : ""
  }`;


}
