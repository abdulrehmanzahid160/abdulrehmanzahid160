<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/abdulrehmanzahid160/abdulrehmanzahid160/main/assets/hero-dark.svg?v=2">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/abdulrehmanzahid160/abdulrehmanzahid160/main/assets/hero-light.svg?v=2">
  <img alt="Abdul Rehman — AI/ML engineer, full-stack and Flutter developer" src="https://raw.githubusercontent.com/abdulrehmanzahid160/abdulrehmanzahid160/main/assets/hero-light.svg?v=2" width="100%">
</picture>

<div align="center">
  <a href="https://abdulrehman160.vercel.app/"><img alt="Portfolio" src="https://img.shields.io/badge/Portfolio-abdulrehman160.vercel.app-8B5CF6?style=for-the-badge&logo=vercel&logoColor=white"></a>
  <a href="https://www.linkedin.com/in/abdul-rehman-5845373a4"><img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-Abdul%20Rehman-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"></a>
  <a href="mailto:abdulrehman.zahid160@gmail.com"><img alt="Email" src="https://img.shields.io/badge/Email-abdulrehman.zahid160%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white"></a>
</div>

---

## What I'm working on

Second-year BS Artificial Intelligence at **NUTECH, Islamabad**. Most of my time goes to
**SignalWatch** — regulatory intelligence for independent medical-device consultants — and to
agent tooling around the Model Context Protocol.

The thread through all of it: I like problems where being *approximately* right is the same as
being wrong. Regulatory data, financial ledgers, medical records. Systems where you have to be
able to show your working.

**Open to** internships and graduate software roles &nbsp;·&nbsp; **Reach me at**
[abdulrehman.zahid160@gmail.com](mailto:abdulrehman.zahid160@gmail.com)

---

## Selected work

### SignalWatch &nbsp;<img alt="private" src="https://img.shields.io/badge/private-6E7681?style=flat-square"> <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"> <img alt="NestJS" src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white"> <img alt="PostgreSQL" src="https://img.shields.io/badge/Postgres-4169E1?style=flat-square&logo=postgresql&logoColor=white">

Monitors public FDA device data — 510(k) clearances, adverse-event reports, enforcement actions —
and turns it into briefs a consultant can forward to their own client under their own name.

The hard part isn't the ingestion, it's **provenance**. Every derived claim has to trace back to the
FDA record it came from, and the product has to be honest about what it *can't* claim: openFDA lags
FDA's own databases, adverse-event reports have no denominator so no rate is computable, and
completeness is unclaimable because FDA never updates the original applicant on a cleared record.
Those constraints are written into the data model, not the marketing copy.

Three rounds of structured research went in before the current design, and they killed the original
thesis twice. The handoff document that came out of it is more useful than the code. Happy to walk
through it — the repo is private, the reasoning isn't.

### LinkedIn MCP Server &nbsp;<img alt="Python" src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white"> <img alt="MCP" src="https://img.shields.io/badge/MCP-A855F7?style=flat-square">

**[linkedin_mcp](https://github.com/abdulrehmanzahid160/linkedin_mcp)** — a Model Context Protocol
server that exposes the LinkedIn API as tools any MCP client can call: Claude Desktop, Cursor,
VS Code, or a custom agent.

Profile lookup, publishing posts, image uploads, deleting posts, and organization page feeds where
partner permissions allow. The point of it is that OAuth token storage, callback handling and retry
logic are boilerplate everyone rewrites — so this packages them once and gets out of the way.

### Charagia Electronics &nbsp;<img alt="Flutter" src="https://img.shields.io/badge/Flutter-02569B?style=flat-square&logo=flutter&logoColor=white"> <img alt="Hive" src="https://img.shields.io/badge/Hive-FFC107?style=flat-square"> <img alt="Riverpod" src="https://img.shields.io/badge/Riverpod-40C4FF?style=flat-square">

**[ElectronicsInventerySystem](https://github.com/abdulrehmanzahid160/ElectronicsInventerySystem)** —
offline-first ledger for electronics retailers: dealer balances, price book, daily cash.

Built offline-first on **Hive** rather than a hosted database, because the shops it targets lose
connectivity constantly and a ledger that stops working during a sale is worse than no ledger.
State management is Riverpod; every transaction carries a running balance so the books reconcile
without a server round-trip.

### LandTrackPK &nbsp;<img alt="Flutter" src="https://img.shields.io/badge/Flutter-02569B?style=flat-square&logo=flutter&logoColor=white"> <img alt="Flask" src="https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white"> <img alt="SQL Server" src="https://img.shields.io/badge/SQL%20Server-CC2927?style=flat-square&logo=microsoftsqlserver&logoColor=white">

**[LandTrackPK](https://github.com/abdulrehmanzahid160/LandTrackPK)** — land record management for
citizens and land officers, with role-separated access over a Microsoft SQL Server schema.

Property transfer is the interesting case: it's a multi-party state change that must not half-apply,
so transfers move through explicit request states rather than a single mutable owner field.

### Skolvo &nbsp;<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"> <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white">

**[skolvo](https://github.com/abdulrehmanzahid160/skolvo)** — the studio site for the two products
I'm taking to early access: FDA Regulatory Watchdog, and CampusNova (on-device biometric attendance,
parent messaging and fee automation for coaching centres).

### Also

| Project | Stack | What it is |
| :-- | :-- | :-- |
| [SehatConnectPK](https://github.com/abdulrehmanzahid160/SehatConnectPK) | Spring Boot · Flutter | REST layer mapping patients, doctors and clinics |
| [PortFolio](https://github.com/abdulrehmanzahid160/PortFolio) | Next.js · GSAP · Lenis | [abdulrehman160.vercel.app](https://abdulrehman160.vercel.app/) — SSG, smooth scroll, scramble text |
| [healix](https://github.com/abdulrehmanzahid160/healix) | FastAPI · PostgreSQL | Async backend for an AI medical assistant — JWT auth, health metrics |
| [my-ml-internship](https://github.com/abdulrehmanzahid160/my-ml-internship) | Jupyter · scikit-learn | FlyRank internship — search ranking and discoverability on anonymised data |
| [Healix-updated](https://github.com/abdulrehmanzahid160/Healix-updated) | Flutter | Flutter client for the Healix backend |
| [TeeropAppDevelopementInternship](https://github.com/abdulrehmanzahid160/TeeropAppDevelopementInternship) | Flutter | App development internship at Teerop |
| [perfect-science-academy](https://github.com/abdulrehmanzahid160/perfect-science-academy) | HTML · CSS | Academy site — later rebuilt as a management system *(private)* |
| [linkedin-mcp-privacy](https://github.com/abdulrehmanzahid160/linkedin-mcp-privacy) | HTML | Privacy policy host required for LinkedIn API partner review |
| [mini-backend](https://github.com/abdulrehmanzahid160/mini-backend) | Flask | Two endpoints. Deliberately the smallest thing that runs. |
| edumaster *(private)* | Flutter | Education platform, in progress |
| Leetcode-Practise *(private)* | Java | Data structures and algorithms practice |

---

## Stats

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/abdulrehmanzahid160/abdulrehmanzahid160/main/assets/stats-dark.svg?v=2">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/abdulrehmanzahid160/abdulrehmanzahid160/main/assets/stats-light.svg?v=2">
  <img alt="Activity" src="https://raw.githubusercontent.com/abdulrehmanzahid160/abdulrehmanzahid160/main/assets/stats-light.svg?v=2" width="100%">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/abdulrehmanzahid160/abdulrehmanzahid160/main/assets/languages-dark.svg?v=2">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/abdulrehmanzahid160/abdulrehmanzahid160/main/assets/languages-light.svg?v=2">
  <img alt="Languages" src="https://raw.githubusercontent.com/abdulrehmanzahid160/abdulrehmanzahid160/main/assets/languages-light.svg?v=2" width="100%">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/abdulrehmanzahid160/abdulrehmanzahid160/main/assets/heatmap-dark.svg?v=2">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/abdulrehmanzahid160/abdulrehmanzahid160/main/assets/heatmap-light.svg?v=2">
  <img alt="Contribution heatmap" src="https://raw.githubusercontent.com/abdulrehmanzahid160/abdulrehmanzahid160/main/assets/heatmap-light.svg?v=2" width="100%">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/abdulrehmanzahid160/abdulrehmanzahid160/output/github-contribution-grid-snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/abdulrehmanzahid160/abdulrehmanzahid160/output/github-contribution-grid-snake.svg">
  <img alt="Contribution snake" src="https://raw.githubusercontent.com/abdulrehmanzahid160/abdulrehmanzahid160/output/github-contribution-grid-snake.svg" width="100%">
</picture>

> Those cards are rendered by [a script in this repo](scripts/) and committed by
> [a scheduled Action](.github/workflows/profile-cards.yml) — no third-party service, so nothing
> here can quietly start returning `402` or `503` when someone else's free tier runs out.

---

## Stack

**Languages** &nbsp; Python · TypeScript · Dart · Java · C++ · SQL

**Frontend** &nbsp; Flutter · Next.js · React · Tailwind · GSAP

**Backend** &nbsp; FastAPI · NestJS · Spring Boot · Flask · PostgreSQL · SQL Server · Hive · Firebase

**ML / AI** &nbsp; scikit-learn · TensorFlow · Pandas · NumPy · LLM APIs · Model Context Protocol

**Tooling** &nbsp; Git · GitHub Actions · Docker · Vercel · Supabase

---

## Recognition

| | |
| :-- | :-- |
| **3rd place — Android App Development** | 3rd International Student Expo, Islamabad · Cyber-Sec Society, PAF-IAST |
| **Participant — Google AI Seeehlo Hackathon** | Google AI Hackathon Pakistan |

---

<div align="center">
  <sub>Engineering systems that can show their working.</sub>
</div>
