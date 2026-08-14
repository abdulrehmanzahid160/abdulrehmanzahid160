import { SANS, MONO, BRAND, esc, human, frame, cardTitle } from "./theme.mjs";

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" ` +
  `viewBox="0 0 ${w} ${h}" role="img" fill="none">${body}\n</svg>\n`;

const PAD = 32;

/* ----------------------------------------------------------------- stats */

export function stats(t, d) {
  const w = 1000;
  const h = 176;
  const id = `s${t.name}`;

  const tiles = [
    ["Contributions", human(d.contributionsYear), "past 12 months"],
    ["Commits", human(d.commitsYear), "past 12 months"],
    ["Repositories", human(d.totalRepos), `${d.publicRepos} public`],
    ["Pull requests", human(d.pullRequests), "opened"],
    ["Languages", human(d.languages.length), "shipped in"],
    ["Longest streak", `${d.longestStreak}d`, `${d.activeDays} active days`],
  ];

  const gap = 1;
  const tw = (w - PAD * 2 - gap * (tiles.length - 1)) / tiles.length;

  const body = tiles
    .map(([label, value, sub], i) => {
      const x = PAD + i * (tw + gap);
      const divider =
        i > 0
          ? `<line x1="${x - 0.5}" y1="66" x2="${x - 0.5}" y2="146" stroke="${t.line}"/>`
          : "";
      return `${divider}
    <g>
      <text x="${x + 14}" y="84" font-family="${MONO}" font-size="9.5" letter-spacing="1.2"
            fill="${t.faint}">${label.toUpperCase()}</text>
      <text x="${x + 13}" y="120" font-family="${SANS}" font-size="29" font-weight="700"
            fill="${t.ink}">${value}</text>
      <text x="${x + 14}" y="140" font-family="${SANS}" font-size="11"
            fill="${t.muted}">${sub}</text>
    </g>`;
    })
    .join("");

  return svg(
    w,
    h,
    `${frame(t, w, h, id)}
  ${cardTitle(t, PAD + 4, 42, "Activity", {
    x: w - PAD,
    text: "SELF-HOSTED &#183; REGENERATED DAILY",
  })}
  <line x1="${PAD}" y1="56" x2="${w - PAD}" y2="56" stroke="${t.line}"/>
  ${body}`
  );
}

/* ------------------------------------------------------------- languages */

export function languages(t, d, count = 8) {
  const w = 1000;
  const h = 206;
  const id = `l${t.name}`;
  const barX = PAD + 4;
  const barW = w - PAD * 2 - 8;

  const top = d.languages.slice(0, count);
  const other = Math.max(0, 100 - top.reduce((a, l) => a + l.pct, 0));
  const segs =
    other > 0.4 ? [...top, { name: "Other", pct: other, color: t.faint }] : top;

  let x = barX;
  const bar = segs
    .map((l) => {
      const segW = (l.pct / 100) * barW;
      const r = `<rect x="${x.toFixed(1)}" y="66" width="${Math.max(segW - 1.5, 1).toFixed(1)}" height="10" rx="2" fill="${l.color}"/>`;
      x += segW;
      return r;
    })
    .join("");

  const cols = 3;
  const colW = barW / cols;
  const legend = segs
    .map((l, i) => {
      const cx = barX + (i % cols) * colW;
      const cy = 116 + Math.floor(i / cols) * 28;
      return `
    <g>
      <rect x="${cx}" y="${cy - 9}" width="9" height="9" rx="2" fill="${l.color}"/>
      <text x="${cx + 17}" y="${cy}" font-family="${SANS}" font-size="12.5"
            fill="${t.ink}">${esc(l.name)}</text>
      <text x="${cx + colW - 30}" y="${cy}" text-anchor="end" font-family="${MONO}"
            font-size="11.5" fill="${t.muted}">${l.pct.toFixed(1)}%</text>
    </g>`;
    })
    .join("");

  return svg(
    w,
    h,
    `${frame(t, w, h, id)}
  ${cardTitle(t, PAD + 4, 42, "Languages", {
    x: w - PAD,
    text: `BY BYTES &#183; ${d.repos.length} REPOSITORIES`,
  })}
  <line x1="${PAD}" y1="56" x2="${w - PAD}" y2="56" stroke="${t.line}"/>
  <rect x="${barX}" y="66" width="${barW}" height="10" rx="2" fill="${t.panel}"/>
  ${bar}
  ${legend}`
  );
}

/* --------------------------------------------------------------- heatmap */

export function heatmap(t, d) {
  const w = 1000;
  const h = 216;
  const id = `c${t.name}`;
  const cell = 12;
  const gap = 3;
  const top = 72;

  const days = d.calendar;
  const max = days.reduce((m, x) => Math.max(m, x.contributionCount), 0) || 1;
  const level = (n) => {
    if (n <= 0) return 0;
    const q = n / max;
    if (q > 0.66) return 4;
    if (q > 0.4) return 3;
    if (q > 0.15) return 2;
    return 1;
  };

  const first = new Date(days[0].date + "T00:00:00Z").getUTCDay();
  let cells = "";
  days.forEach((day, i) => {
    const idx = i + first;
    const col = Math.floor(idx / 7);
    const row = idx % 7;
    cells +=
      `<rect x="${PAD + 4 + col * (cell + gap)}" y="${top + row * (cell + gap)}" ` +
      `width="${cell}" height="${cell}" rx="2" fill="${t.ramp[level(day.contributionCount)]}"/>`;
  });

  const legendY = top + 7 * (cell + gap) + 26;
  const legendX = w - PAD - 132;
  const legend = t.ramp
    .map(
      (c, i) =>
        `<rect x="${legendX + 32 + i * (cell + 3)}" y="${legendY - 10}" width="${cell}" height="${cell}" rx="2" fill="${c}" stroke="${t.line}"/>`
    )
    .join("");

  return svg(
    w,
    h,
    `${frame(t, w, h, id)}
  ${cardTitle(t, PAD + 4, 42, `${human(d.contributionsYear)} contributions in the last year`, {
    x: w - PAD,
    text: `${d.activeDays} ACTIVE DAYS &#183; LONGEST ${d.longestStreak}D`,
  })}
  <line x1="${PAD}" y1="56" x2="${w - PAD}" y2="56" stroke="${t.line}"/>
  ${cells}
  <text x="${legendX}" y="${legendY}" font-family="${SANS}" font-size="11" fill="${t.faint}">Less</text>
  ${legend}
  <text x="${w - PAD}" y="${legendY}" text-anchor="end" font-family="${SANS}" font-size="11"
        fill="${t.faint}">More</text>`
  );
}

/* ---------------------------------------------------------------- banner */

// Rough average glyph width for a proportional sans at a given size — good
// enough to size a pill without a real text-measurement API. Emoji count as
// roughly one extra-wide character regardless of their UTF-16 length.
const estWidth = (label, size) => [...label].length * size * 0.56;

function pillWidth(icon, text) {
  return estWidth(`${icon}  ${text}`, 12.5) + 28;
}

function pill(icon, text, x, y) {
  const label = `${icon}  ${text}`;
  const w = pillWidth(icon, text);
  return `
  <g>
    <rect x="${x.toFixed(0)}" y="${y}" width="${w.toFixed(0)}" height="28" rx="14" fill="#FFFFFF" opacity="0.16"/>
    <text x="${(x + 14).toFixed(0)}" y="${y + 18.5}" font-family="${SANS}" font-size="12.5" fill="#FFFFFF">${esc(label)}</text>
  </g>`;
}

export function banner(d) {
  const w = 1000;
  const h = 260;
  const id = "banner";
  const cx = w / 2;

  return svg(
    w,
    h,
    `
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BRAND.g1}"/>
      <stop offset="55%" stop-color="${BRAND.g2}"/>
      <stop offset="100%" stop-color="${BRAND.g3}"/>
    </linearGradient>
    <clipPath id="avatar-${id}"><circle cx="${cx}" cy="70" r="44"/></clipPath>
    <clipPath id="frame-${id}"><rect width="${w}" height="${h}" rx="14"/></clipPath>
  </defs>
  <g clip-path="url(#frame-${id})">
    <rect width="${w}" height="${h}" fill="url(#bg-${id})"/>
    <path d="M0,208 C160,182 340,234 500,208 C660,182 840,234 1000,208 L1000,${h} L0,${h} Z"
          fill="#000000" opacity="0.10"/>
    <path d="M0,222 C180,200 330,246 520,222 C700,200 860,244 1000,222 L1000,${h} L0,${h} Z"
          fill="#FFFFFF" opacity="0.06"/>

    ${pill("\u{1F517}", "rehmandev.online", 34, 32)}
    ${pill("✉", "abdulrehman.zahid160@gmail.com", w - 34 - pillWidth("✉", "abdulrehman.zahid160@gmail.com"), 32)}

    <circle cx="${cx}" cy="70" r="47" fill="#FFFFFF" opacity="0.9"/>
    <image href="${d.avatarDataUri}" x="${cx - 44}" y="26" width="88" height="88"
           clip-path="url(#avatar-${id})"/>
    <circle cx="${cx}" cy="70" r="44" fill="none" stroke="#FFFFFF" stroke-width="2.5" opacity="0.85"/>

    <text x="${cx}" y="163" text-anchor="middle" font-family="${SANS}" font-size="34"
          font-weight="700" fill="#FFFFFF">Hi, I'm Abdul Rehman \u{1F44B}</text>
    <text x="${cx}" y="193" text-anchor="middle" font-family="${SANS}" font-size="15"
          fill="#FFFFFF" opacity="0.92">Full-Stack Developer &#183; Flutter Developer &#183; AI / ML Engineer</text>
  </g>`
  );
}

/* ------------------------------------------------------------- mascot */

/**
 * An original flat-design owl-at-a-laptop illustration — no text, transparent
 * background, thin ink outlines so it reads on both a light and a dark page.
 * Built from primitive shapes rather than a traced or generated asset.
 */
export function mascot() {
  const w = 360;
  const h = 300;
  const ink = "#1E1B4B";

  return svg(
    w,
    h,
    `
  <defs>
    <linearGradient id="owl-body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BRAND.g2}"/>
      <stop offset="100%" stop-color="${BRAND.g1}"/>
    </linearGradient>
  </defs>

  <ellipse cx="180" cy="272" rx="94" ry="12" fill="${ink}" opacity="0.08"/>

  <!-- sparkles -->
  <g fill="${BRAND.g3}" opacity="0.85">
    <path d="M60,74 l5,13 13,5 -13,5 -5,13 -5,-13 -13,-5 13,-5 Z"/>
    <path d="M300,150 l4,10 10,4 -10,4 -4,10 -4,-10 -10,-4 10,-4 Z"/>
    <circle cx="284" cy="66" r="4"/>
    <circle cx="70" cy="182" r="3.5"/>
  </g>

  <!-- laptop -->
  <g>
    <rect x="118" y="214" width="128" height="10" rx="4" fill="${ink}" opacity="0.85"/>
    <path d="M130,214 L138,160 A6,6 0 0 1 144,155 L220,155 A6,6 0 0 1 226,160 L234,214 Z"
          fill="#F4F4F7" stroke="${ink}" stroke-width="2.5"/>
    <rect x="146" y="167" width="62" height="5" rx="2.5" fill="${BRAND.g1}" opacity="0.55"/>
    <rect x="146" y="178" width="44" height="5" rx="2.5" fill="${BRAND.g2}" opacity="0.45"/>
    <rect x="146" y="189" width="52" height="5" rx="2.5" fill="${BRAND.g3}" opacity="0.4"/>
  </g>

  <!-- owl -->
  <g>
    <path d="M180,80
             C240,80 258,132 254,176
             C251,206 228,228 180,228
             C132,228 109,206 106,176
             C102,132 120,80 180,80 Z"
          fill="url(#owl-body)" stroke="${ink}" stroke-width="2.5"/>

    <!-- wings -->
    <path d="M112,140 C96,160 94,192 112,214 C120,200 122,166 126,146 Z"
          fill="${BRAND.g1}" stroke="${ink}" stroke-width="2"/>
    <path d="M248,140 C264,160 266,192 248,214 C240,200 238,166 234,146 Z"
          fill="${BRAND.g1}" stroke="${ink}" stroke-width="2"/>

    <!-- belly -->
    <path d="M180,124 C210,124 222,156 219,182 C217,202 202,214 180,214
             C158,214 143,202 141,182 C138,156 150,124 180,124 Z"
          fill="#FBF7FF" opacity="0.9"/>
    <path d="M164,168 q16,10 32,0" fill="none" stroke="${BRAND.g2}" stroke-width="2" opacity="0.5"/>
    <path d="M162,186 q18,11 36,0" fill="none" stroke="${BRAND.g2}" stroke-width="2" opacity="0.5"/>

    <!-- ear tufts -->
    <path d="M132,86 L120,58 L146,74 Z" fill="url(#owl-body)" stroke="${ink}" stroke-width="2.5"/>
    <path d="M228,86 L240,58 L214,74 Z" fill="url(#owl-body)" stroke="${ink}" stroke-width="2.5"/>

    <!-- eyes -->
    <circle cx="156" cy="132" r="19" fill="#FFFFFF" stroke="${ink}" stroke-width="2.5"/>
    <circle cx="204" cy="132" r="19" fill="#FFFFFF" stroke="${ink}" stroke-width="2.5"/>
    <circle cx="159" cy="134" r="8" fill="${ink}"/>
    <circle cx="207" cy="134" r="8" fill="${ink}"/>
    <circle cx="162" cy="131" r="2.4" fill="#FFFFFF"/>
    <circle cx="210" cy="131" r="2.4" fill="#FFFFFF"/>

    <!-- beak -->
    <path d="M172,148 L188,148 L180,162 Z" fill="#F59E0B" stroke="${ink}" stroke-width="2"/>

    <!-- feet -->
    <path d="M158,226 l-3,14 M164,226 l0,15 M170,226 l3,14"
          stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <path d="M190,226 l-3,14 M196,226 l0,15 M202,226 l3,14"
          stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  </g>

  <!-- coffee cup -->
  <g transform="translate(258,208)">
    <path d="M0,10 h34 l-3,26 a3,3 0 0 1 -3,3 h-22 a3,3 0 0 1 -3,-3 Z"
          fill="#FFFFFF" stroke="${ink}" stroke-width="2"/>
    <path d="M34,16 q12,0 8,14 q-3,9 -13,7" fill="none" stroke="${ink}" stroke-width="2"/>
    <path d="M4,10 C4,2 30,2 30,10" fill="none" stroke="${BRAND.g3}" stroke-width="3"/>
  </g>`
  );
}
