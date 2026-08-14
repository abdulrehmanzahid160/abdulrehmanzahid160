import { SANS, MONO, esc, human, frame, topSweep } from "./theme.mjs";

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" ` +
  `viewBox="0 0 ${w} ${h}" role="img" fill="none">${body}\n</svg>\n`;

/* ------------------------------------------------------------------ hero */

const ROLES = [
  "AI / ML Engineer",
  "Full-Stack Developer",
  "Flutter Developer",
  "Agentic AI &amp; MCP",
];

/** Small neural graph, signal pulsing left to right. */
function neuralGraph(t, x, y) {
  const layers = [
    [0, 1, 2, 3],
    [0, 1, 2, 3, 4],
    [0, 1, 2],
  ];
  const colX = [0, 92, 184];
  const spread = 34;
  const pos = layers.map((nodes, li) =>
    nodes.map((_, ni) => ({
      x: x + colX[li],
      y: y + (ni - (nodes.length - 1) / 2) * spread,
    }))
  );

  let edges = "";
  let e = 0;
  for (let li = 0; li < pos.length - 1; li++) {
    for (const a of pos[li]) {
      for (const b of pos[li + 1]) {
        const delay = ((e * 137) % 400) / 100;
        const geom = `x1="${a.x}" y1="${a.y.toFixed(1)}" x2="${b.x}" y2="${b.y.toFixed(1)}"`;
        edges +=
          `<line ${geom} stroke="${t.stroke}" stroke-width="1"/>` +
          `<line ${geom} stroke="${t.brandA}" stroke-width="1.4" class="edge" ` +
          `style="animation-delay:${delay.toFixed(2)}s"/>`;
        e++;
      }
    }
  }

  let nodes = "";
  pos.flat().forEach((p, i) => {
    nodes +=
      `<circle cx="${p.x}" cy="${p.y.toFixed(1)}" r="4.5" fill="${t.bg}" ` +
      `stroke="${i % 3 === 0 ? t.brandB : t.brandA}" stroke-width="1.6" ` +
      `class="node" style="animation-delay:${((i * 211) % 300) / 100}s"/>`;
  });

  return `<g opacity="0.95">${edges}${nodes}</g>`;
}

export function hero(t, d) {
  const w = 1000;
  const h = 280;
  const id = `h${t.name}`;
  const roles = ROLES.map(
    (r, i) =>
      `<text x="46" y="196" font-family="${MONO}" font-size="19" ` +
      `fill="${t.brandB}" class="role r${i}">${r}</text>`
  ).join("");

  return svg(
    w,
    h,
    `${frame(t, w, h, id)}
  <g>
    <text x="46" y="62" font-family="${MONO}" font-size="12.5" letter-spacing="3.4"
          fill="${t.muted}">NUTECH ISLAMABAD &#183; BS ARTIFICIAL INTELLIGENCE</text>

    <text x="44" y="140" font-family="${SANS}" font-size="62" font-weight="700"
          fill="url(#brand-${id})" letter-spacing="-1.5">${esc(d.name)}</text>

    <g class="roles">${roles}</g>

    <text x="46" y="240" font-family="${SANS}" font-size="15" fill="${t.muted}">
      I build systems that have to be right &#8212; regulated data, offline-first apps, agent tooling.
    </text>
  </g>
  ${neuralGraph(t, 720, 140)}
  ${topSweep(w, id)}
  <style>
    .role { opacity: 0; animation: cycle-${id} 14s linear infinite; }
    .r0 { animation-delay: 0s; }  .r1 { animation-delay: 3.5s; }
    .r2 { animation-delay: 7s; }  .r3 { animation-delay: 10.5s; }
    @keyframes cycle-${id} {
      0%    { opacity: 0; transform: translateY(6px); }
      3%    { opacity: 1; transform: translateY(0); }
      22%   { opacity: 1; transform: translateY(0); }
      25%   { opacity: 0; transform: translateY(-6px); }
      100%  { opacity: 0; transform: translateY(-6px); }
    }
    .edge { stroke-dasharray: 10 46; stroke-dashoffset: 56; opacity: .38;
            animation: flow-${id} 3.4s linear infinite; }
    @keyframes flow-${id} { to { stroke-dashoffset: 0; } }
    .node { animation: pulse-${id} 3.4s ease-in-out infinite; }
    @keyframes pulse-${id} {
      0%, 100% { opacity: .55; }
      50%      { opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      .role { animation: none; } .r0 { opacity: 1; }
      .edge, .node { animation: none; opacity: .7; }
    }
  </style>`
  );
}

/* ----------------------------------------------------------------- stats */

export function stats(t, d) {
  const w = 1000;
  const h = 214;
  const id = `s${t.name}`;

  const tiles = [
    ["Contributions", human(d.contributionsYear), "past 12 months"],
    ["Commits", human(d.commitsYear), "past 12 months"],
    ["Repositories", human(d.totalRepos), `${d.publicRepos} public`],
    ["Pull requests", human(d.pullRequests), "opened"],
    ["Languages", human(d.languages.length), "shipped in"],
    ["Longest streak", `${d.longestStreak}d`, `${d.activeDays} active days`],
  ];

  const padX = 34;
  const gap = 14;
  const tw = (w - padX * 2 - gap * (tiles.length - 1)) / tiles.length;

  const body = tiles
    .map(([label, value, sub], i) => {
      const x = padX + i * (tw + gap);
      return `
    <g class="tile">
      <rect x="${x}" y="62" width="${tw}" height="112" rx="12"
            fill="${t.tile}" stroke="${t.tileStroke}"/>
      <rect x="${x}" y="62" width="${tw}" height="2.5" rx="1.2" fill="url(#brand-${id})" opacity=".85"/>
      <text x="${x + 18}" y="96" font-family="${MONO}" font-size="11" letter-spacing="1.5"
            fill="${t.muted}">${label.toUpperCase()}</text>
      <text x="${x + 18}" y="136" font-family="${SANS}" font-size="32" font-weight="700"
            fill="${t.text}">${value}</text>
      <text x="${x + 18}" y="158" font-family="${SANS}" font-size="11.5"
            fill="${t.faint}">${sub}</text>
    </g>`;
    })
    .join("");

  return svg(
    w,
    h,
    `${frame(t, w, h, id)}
  <text x="${padX}" y="40" font-family="${SANS}" font-size="17" font-weight="600"
        fill="${t.text}">Activity</text>
  <text x="${w - padX}" y="40" text-anchor="end" font-family="${MONO}" font-size="11"
        fill="${t.faint}">self-hosted &#183; regenerated daily</text>
  ${body}
  ${topSweep(w, id, "9s")}
  <style>
    .tile rect:first-of-type { transition: none; }
  </style>`
  );
}

/* ------------------------------------------------------------- languages */

export function languages(t, d, count = 8) {
  const w = 1000;
  const h = 232;
  const id = `l${t.name}`;
  const padX = 34;
  const barW = w - padX * 2;

  const top = d.languages.slice(0, count);
  const shown = top.reduce((a, l) => a + l.pct, 0);
  const other = Math.max(0, 100 - shown);
  const segs = other > 0.4 ? [...top, { name: "Other", pct: other, color: t.faint }] : top;

  let x = padX;
  const bar = segs
    .map((l, i) => {
      const segW = (l.pct / 100) * barW;
      const r = `<rect x="${x.toFixed(1)}" y="70" width="${Math.max(segW - 2, 1).toFixed(1)}" height="18"
             rx="4" fill="${l.color}"/>`;
      x += segW;
      return r;
    })
    .join("");

  const cols = 3;
  const colW = barW / cols;
  const legend = segs
    .map((l, i) => {
      const cx = padX + (i % cols) * colW;
      const cy = 126 + Math.floor(i / cols) * 30;
      return `
    <g>
      <rect x="${cx}" y="${cy - 10}" width="11" height="11" rx="3" fill="${l.color}"/>
      <text x="${cx + 20}" y="${cy}" font-family="${SANS}" font-size="13.5"
            fill="${t.text}">${esc(l.name)}</text>
      <text x="${cx + colW - 26}" y="${cy}" text-anchor="end" font-family="${MONO}"
            font-size="12.5" fill="${t.muted}">${l.pct.toFixed(1)}%</text>
    </g>`;
    })
    .join("");

  return svg(
    w,
    h,
    `${frame(t, w, h, id)}
  <text x="${padX}" y="40" font-family="${SANS}" font-size="17" font-weight="600"
        fill="${t.text}">Languages</text>
  <text x="${w - padX}" y="40" text-anchor="end" font-family="${MONO}" font-size="11"
        fill="${t.faint}">by bytes across ${d.repos.length} repositories</text>
  <rect x="${padX}" y="70" width="${barW}" height="18" rx="4" fill="${t.tile}"/>
  ${bar}
  ${legend}
  ${topSweep(w, id, "11s")}
`
  );
}

/* --------------------------------------------------------------- heatmap */

export function heatmap(t, d) {
  const w = 1000;
  const h = 248;
  const id = `c${t.name}`;
  const cell = 13;
  const gap = 3;
  const padX = 34;
  const top = 76;

  const days = d.calendar;
  const max = days.reduce((m, x) => Math.max(m, x.contributionCount), 0) || 1;
  const ramp = [t.tile, `${t.brandA}44`, `${t.brandA}80`, `${t.brandA}BB`, t.brandA];
  const level = (n) => {
    if (n <= 0) return 0;
    const q = n / max;
    if (q > 0.66) return 4;
    if (q > 0.4) return 3;
    if (q > 0.15) return 2;
    return 1;
  };

  // Align to weeks: index 0 is the first day present, laid out column by column.
  const first = new Date(days[0].date + "T00:00:00Z").getUTCDay();
  let cells = "";
  days.forEach((day, i) => {
    const idx = i + first;
    const col = Math.floor(idx / 7);
    const row = idx % 7;
    const lv = level(day.contributionCount);
    cells +=
      `<rect x="${padX + col * (cell + gap)}" y="${top + row * (cell + gap)}" ` +
      `width="${cell}" height="${cell}" rx="3" fill="${ramp[lv]}" ` +
      `/>`;
  });

  const legendY = top + 7 * (cell + gap) + 26;
  const legendX = w - padX - 150;
  const legend = ramp
    .map(
      (c, i) =>
        `<rect x="${legendX + 34 + i * (cell + 4)}" y="${legendY - 11}" width="${cell}" height="${cell}" rx="3" fill="${c}"/>`
    )
    .join("");

  return svg(
    w,
    h,
    `${frame(t, w, h, id)}
  <text x="${padX}" y="40" font-family="${SANS}" font-size="17" font-weight="600"
        fill="${t.text}">${human(d.contributionsYear)} contributions in the last year</text>
  <text x="${w - padX}" y="40" text-anchor="end" font-family="${MONO}" font-size="11"
        fill="${t.faint}">${d.activeDays} active days &#183; longest streak ${d.longestStreak}d</text>
  ${cells}
  <text x="${legendX}" y="${legendY}" font-family="${SANS}" font-size="11.5" fill="${t.faint}">Less</text>
  ${legend}
  <text x="${w - padX}" y="${legendY}" text-anchor="end" font-family="${SANS}" font-size="11.5"
        fill="${t.faint}">More</text>
  ${topSweep(w, id, "13s")}
`
  );
}
