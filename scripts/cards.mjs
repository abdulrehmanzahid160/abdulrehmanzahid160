import { SANS, MONO, esc, human, frame, cardTitle } from "./theme.mjs";

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" ` +
  `viewBox="0 0 ${w} ${h}" role="img" fill="none">${body}\n</svg>\n`;

const PAD = 32;

/* ------------------------------------------------------------------ hero */

const ROLES = ["Full-stack developer", "Flutter developer", "AI / ML engineer"];

/**
 * Weekly contribution sparkline. Real data, drawn plainly — it says more about
 * the person than a decorative graphic does.
 */
function sparkline(t, days, x, y, w, h) {
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7).reduce((a, d) => a + d.contributionCount, 0));
  }
  const max = Math.max(...weeks, 1);
  const step = w / Math.max(weeks.length - 1, 1);

  const pts = weeks.map((v, i) => [x + i * step, y + h - (v / max) * h]);
  const line = pts
    .map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ");
  const area = `${line} L${(x + w).toFixed(1)} ${y + h} L${x} ${y + h} Z`;
  const last = pts[pts.length - 1];

  return `
  <g>
    <path d="${area}" fill="${t.accentSoft}"/>
    <path d="${line}" fill="none" stroke="${t.accent}" stroke-width="1.6"
          stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3" fill="${t.accent}"/>
    <line x1="${x}" y1="${y + h + 0.5}" x2="${x + w}" y2="${y + h + 0.5}" stroke="${t.line}"/>
    <text x="${x}" y="${y + h + 20}" font-family="${MONO}" font-size="10"
          fill="${t.faint}">52 WEEKS</text>
    <text x="${x + w}" y="${y + h + 20}" text-anchor="end" font-family="${MONO}"
          font-size="10" fill="${t.faint}">CONTRIBUTIONS / WEEK</text>
  </g>`;
}

export function hero(t, d) {
  const w = 1000;
  const h = 220;
  const id = `h${t.name}`;

  const roles = ROLES.map(
    (r, i) =>
      `<text x="${PAD + 4}" y="152" font-family="${SANS}" font-size="17" ` +
      `fill="${t.accent}" class="role r${i}">${r}</text>`
  ).join("");

  return svg(
    w,
    h,
    `${frame(t, w, h, id)}
  <text x="${PAD + 4}" y="52" font-family="${MONO}" font-size="10.5" letter-spacing="2.6"
        fill="${t.faint}">NUTECH ISLAMABAD &#183; BS ARTIFICIAL INTELLIGENCE &#183; YEAR 2</text>

  <text x="${PAD + 2}" y="112" font-family="${SANS}" font-size="46" font-weight="700"
        fill="${t.ink}" letter-spacing="-1">${esc(d.name)}</text>

  <g class="roles">${roles}</g>

  <text x="${PAD + 4}" y="190" font-family="${SANS}" font-size="14" fill="${t.muted}">
    I build systems where being approximately right is the same as being wrong.
  </text>

  ${sparkline(t, d.calendar, 640, 62, 320, 92)}
  <style>
    .role { opacity: 0; animation: cycle-${id} 12s linear infinite; }
    .r0 { animation-delay: 0s; } .r1 { animation-delay: 4s; } .r2 { animation-delay: 8s; }
    @keyframes cycle-${id} {
      0%   { opacity: 0; }
      4%   { opacity: 1; }
      29%  { opacity: 1; }
      33%  { opacity: 0; }
      100% { opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .role { animation: none; opacity: 0; } .r0 { opacity: 1; }
    }
  </style>`
  );
}

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
