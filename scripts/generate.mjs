// Entry point. Fetches the stats once and writes a dark and a light variant of
// every card into assets/.
//
//   GITHUB_TOKEN=... node scripts/generate.mjs
//
// The README pairs the two variants with <picture media="(prefers-color-scheme: dark)">,
// so the profile follows the visitor's GitHub theme.

import { mkdir, writeFile } from "node:fs/promises";
import { collect } from "./fetch-stats.mjs";
import { THEMES } from "./theme.mjs";
import { banner, mascot, stats, languages, heatmap } from "./cards.mjs";

const LOGIN = process.env.PROFILE_LOGIN || "abdulrehmanzahid160";
const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.error("GITHUB_TOKEN is required (needs read access to your repos).");
  process.exit(1);
}

// Theme-dependent cards: one dark + one light variant, switched in the
// README via <picture prefers-color-scheme>.
const THEMED_CARDS = { stats, languages, heatmap };

const data = await collect(LOGIN, TOKEN);
await mkdir("assets", { recursive: true });

const written = [];
for (const [name, render] of Object.entries(THEMED_CARDS)) {
  for (const theme of Object.values(THEMES)) {
    const file = `assets/${name}-${theme.name}.svg`;
    await writeFile(file, render(theme, data), "utf8");
    written.push(file);
  }
}

// The banner and mascot carry their own fixed gradient palette (a deliberate
// choice distinct from the data cards above) and render once, not per theme.
await writeFile("assets/banner.svg", banner(data), "utf8");
await writeFile("assets/mascot.svg", mascot(), "utf8");
written.push("assets/banner.svg", "assets/mascot.svg");

await writeFile(
  "assets/stats.json",
  JSON.stringify(
    {
      generatedAt: data.generatedAt,
      commitsYear: data.commitsYear,
      contributionsYear: data.contributionsYear,
      totalRepos: data.totalRepos,
      publicRepos: data.publicRepos,
      stars: data.stars,
      followers: data.followers,
      pullRequests: data.pullRequests,
      longestStreak: data.longestStreak,
      currentStreak: data.currentStreak,
      topLanguages: data.languages.slice(0, 8).map((l) => ({
        name: l.name,
        pct: Number(l.pct.toFixed(2)),
      })),
    },
    null,
    2
  ) + "\n",
  "utf8"
);

console.log(`${data.name} (@${data.login})`);
console.log(
  `  ${data.contributionsYear} contributions - ${data.totalRepos} repos - ` +
    `${data.stars} stars - streak ${data.currentStreak}d (longest ${data.longestStreak}d)`
);
console.log(
  "  languages: " +
    data.languages
      .slice(0, 6)
      .map((l) => `${l.name} ${l.pct.toFixed(1)}%`)
      .join(", ")
);
console.log(`  wrote ${written.length} cards + assets/stats.json`);
