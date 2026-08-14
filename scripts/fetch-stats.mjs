// Pulls everything the cards need from the GitHub GraphQL API in two requests.
// No third-party service is involved, which is the whole point: nothing here
// can start returning 402 or 503 because someone else's free quota ran out.

const API = "https://api.github.com/graphql";

async function gql(query, variables, token) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "profile-cards",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error("GraphQL: " + JSON.stringify(json.errors));
  }
  return json.data;
}

const PROFILE = `
query ($login: String!) {
  user(login: $login) {
    name
    login
    followers { totalCount }
    following { totalCount }
    repositories(ownerAffiliations: OWNER, privacy: PUBLIC) { totalCount }
    allRepos: repositories(ownerAffiliations: OWNER) { totalCount }
    pullRequests { totalCount }
    issues { totalCount }
    contributionsCollection {
      totalCommitContributions
      restrictedContributionsCount
      totalPullRequestContributions
      totalPullRequestReviewContributions
      totalIssueContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { date contributionCount }
        }
      }
    }
  }
}`;

const REPOS = `
query ($login: String!, $cursor: String) {
  user(login: $login) {
    repositories(first: 100, after: $cursor, ownerAffiliations: OWNER,
                 isFork: false, orderBy: {field: PUSHED_AT, direction: DESC}) {
      pageInfo { hasNextPage endCursor }
      nodes {
        name
        isPrivate
        stargazerCount
        forkCount
        pushedAt
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name color } }
        }
      }
    }
  }
}`;

/** Longest run of consecutive days with at least one contribution, ending today. */
function streaks(weeks) {
  const days = weeks
    .flatMap((w) => w.contributionDays)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  let longest = 0;
  let run = 0;
  for (const d of days) {
    if (d.contributionCount > 0) {
      run += 1;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
  }
  // Current streak walks backwards; today counts as neutral if still empty.
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) current += 1;
    else if (i === days.length - 1) continue;
    else break;
  }
  const active = days.filter((d) => d.contributionCount > 0).length;
  return { longest, current, activeDays: active, days };
}

export async function collect(login, token) {
  const prof = (await gql(PROFILE, { login }, token)).user;

  let cursor = null;
  const repos = [];
  for (;;) {
    const page = (await gql(REPOS, { login, cursor }, token)).user.repositories;
    repos.push(...page.nodes);
    if (!page.pageInfo.hasNextPage) break;
    cursor = page.pageInfo.endCursor;
  }

  const stars = repos.reduce((a, r) => a + r.stargazerCount, 0);
  const forks = repos.reduce((a, r) => a + r.forkCount, 0);

  // Language totals weighted by bytes, across public and private alike.
  const byLang = new Map();
  for (const r of repos) {
    for (const e of r.languages.edges) {
      const cur = byLang.get(e.node.name) || { size: 0, color: e.node.color };
      cur.size += e.size;
      byLang.set(e.node.name, cur);
    }
  }
  const totalBytes = [...byLang.values()].reduce((a, v) => a + v.size, 0) || 1;
  const languages = [...byLang.entries()]
    .map(([name, v]) => ({
      name,
      size: v.size,
      color: v.color || "#8B5CF6",
      pct: (v.size / totalBytes) * 100,
    }))
    .sort((a, b) => b.size - a.size);

  const c = prof.contributionsCollection;
  const s = streaks(c.contributionCalendar.weeks);

  return {
    name: prof.name || prof.login,
    login: prof.login,
    followers: prof.followers.totalCount,
    publicRepos: prof.repositories.totalCount,
    totalRepos: prof.allRepos.totalCount,
    stars,
    forks,
    pullRequests: prof.pullRequests.totalCount,
    issues: prof.issues.totalCount,
    commitsYear: c.totalCommitContributions + c.restrictedContributionsCount,
    contributionsYear: c.contributionCalendar.totalContributions,
    prsYear: c.totalPullRequestContributions,
    reviewsYear: c.totalPullRequestReviewContributions,
    longestStreak: s.longest,
    currentStreak: s.current,
    activeDays: s.activeDays,
    calendar: s.days,
    languages,
    repos,
    generatedAt: new Date().toISOString(),
  };
}
