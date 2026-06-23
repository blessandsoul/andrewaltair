import type { ReactNode } from "react";
import Link from "next/link";
import { TbBrandGithub, TbArrowUpRight, TbChevronLeft } from "react-icons/tb";
import styles from "./andrezi.module.css";

const LAYERS = [
  { name: "Durable typed memory", desc: "A bounded MEMORY.md index over typed memory files. The remembered rulings the agent lives by." },
  { name: "Search floor", desc: "Stdlib FTS5, plus an optional local vector layer. Recall what the bounded index cannot hold." },
  { name: "Run telemetry", desc: "Every tool call logged to SQLite, so you can mine recurring failures instead of only reacting." },
  { name: "Zero-token recap", desc: "A deterministic git + run-log join writes the last session's recap; the next session re-injects it free." },
  { name: "Read-gate", desc: "Record which authoritative spec was read this session, so a pre-write check can block generating from a summary." },
  { name: "Single-spawn dispatch", desc: "Run a whole hook stage in one process and preserve blocking semantics." },
];

const BRIDGE: { word: string; role: string; sys: string; bold?: string[] }[] = [
  { word: "ანდრეზი", role: "the remembered law", sys: "your durable typed memory, and the rules promoted from it" },
  { word: "ხევისბერი", role: "the valley elder, keeper and judge", sys: "the hooks and hygiene that dedup, cap, and enforce" },
  { word: "საუნჯე", role: "the guarded treasury", sys: "the bounded index that cannot bloat" },
  { word: "ფასკუნჯი", role: "the bird that lifts the hero from the underworld", sys: "search and recall, retrieval from the depths" },
  { word: "the rite", role: "by which the law may change", sys: "the frozen-snapshot rule: a memory takes effect next session, never mid-conversation", bold: ["frozen-snapshot rule"] },
];

const FAILS = [
  { label: "drift", text: "the agent re-derives a rule from a summary every session and slowly diverges from it." },
  { label: "bloat", text: "the always-loaded memory grows until it crowds out the actual work." },
  { label: "cold start", text: "every new session re-explains the project from scratch." },
  { label: "unverified rules", text: "a lesson learned decays into a platitude nobody enforces." },
];

const CLAUSES: { text: string; bold: string[] }[] = [
  { text: "On a fresh machine you get an empty, well-engineered substrate. It becomes good the way an andrezi does: by living through real use, by promoting the rulings that keep recurring.", bold: [] },
  { text: "The engine transfers. The mileage does not. You supply the content and the consistency.", bold: ["engine transfers", "mileage does not"] },
  { text: "Only the generic core is open. The private memory, the rules and the specs, stay private.", bold: ["generic core is open"] },
  { text: "If you want a drop-in agent-remembers-everything button, this is not that, and nothing honestly is.", bold: [] },
];

// gentle highland elevation contours for the hero backdrop
const CONTOURS = [
  "M-40,150 C220,110 380,200 620,160 S980,120 1240,180",
  "M-40,230 C200,190 420,270 640,232 S1010,196 1240,250",
  "M-40,312 C240,276 400,350 620,312 S1000,280 1240,330",
  "M-40,398 C180,360 440,432 660,398 S1020,366 1240,412",
  "M-40,486 C260,452 380,520 640,486 S1000,456 1240,500",
];

function withBold(text: string, phrases: string[]): ReactNode {
  if (!phrases.length) return text;
  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "g"));
  return parts.map((part, i) => (phrases.includes(part) ? <strong key={i}>{part}</strong> : part));
}

export default function AndreziLanding() {
  return (
    <div className={styles.page}>
      {/* HERO */}
      <header className={styles.hero}>
        <svg className={styles.contour} viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {CONTOURS.map((d, i) => (
            <path key={i} d={d} className={`${i === 0 ? styles.peak : ""} ${styles.drawPath}`} />
          ))}
        </svg>

        <div className={`${styles.shell} ${styles.heroEnter}`}>
          <Link href="/projects" className={styles.backLink}>
            <TbChevronLeft size={14} /> projects
          </Link>
          <h1 className={styles.heroWord}>ანდრეზი</h1>
          <p className={styles.heroLatin}>a n d r e z i</p>
          <p className={styles.heroTagline}>the memory that governs</p>
          <div className={styles.heroMeta}>
            <span><span className={styles.dot} /> Andrew Altair</span>
            <span>project 01</span>
            <span>2026</span>
            <span>MIT, open source</span>
          </div>
        </div>
      </header>

      {/* THE ANDREZI */}
      <section className={styles.section}>
        <div className={styles.shell}>
          <span className={styles.eyebrow}>the andrezi</span>
          <p className={styles.lead}>
            In the high Georgian mountains, the <span className={styles.amber}>andrezi</span> is the unwritten remembered law a community carries and lives by.
          </p>
          <p className={`${styles.body} ${styles.kicker}`}>
            Nothing is on paper. The law is kept by the people, recited by the valley elder, guarded at the shrine, and it governs how the community acts. A new ruling enters it only through the proper rite, never on a whim in the middle of a quarrel. <strong>Andrezi is that, for a software agent:</strong> a remembered law it carries across sessions, with a keeper that prunes it, a treasury that holds it, and a rite that changes it.
          </p>

          <div className={styles.bridge}>
            {BRIDGE.map((b) => (
              <div className={styles.bridgeRow} key={b.word}>
                <div className={styles.folk}>
                  <div className={styles.folkWord}>{b.word}</div>
                  <div className={styles.folkRole}>{b.role}</div>
                </div>
                <div className={styles.node} />
                <div className={styles.sys}>{withBold(b.sys, b.bold ?? [])}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY GOVERNANCE */}
      <section className={styles.section}>
        <div className={styles.shell}>
          <span className={styles.eyebrow}>why governance, not storage</span>
          <p className={styles.lead}>Most memory tools optimize storage and retrieval. The failures that actually bite are different.</p>
          <div className={styles.fails}>
            {FAILS.map((f) => (
              <div className={styles.failItem} key={f.label}>
                <div className={styles.failLabel}>{f.label}</div>
                <div className={styles.failText}>{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIX LAYERS */}
      <section className={styles.section}>
        <div className={styles.shell}>
          <span className={styles.eyebrow}>six layers</span>
          <p className={styles.lead}>A bounded index over an unbounded floor, each layer useful on its own.</p>
          <div className={styles.strata}>
            {LAYERS.map((l, i) => (
              <div className={styles.stratum} key={l.name}>
                <div className={styles.stratumNo}>{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className={styles.stratumName}>{l.name}</div>
                  <div className={styles.stratumDesc}>{l.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HONEST FRAMING */}
      <section className={styles.section}>
        <div className={styles.shell}>
          <span className={styles.eyebrow}>what it is, and is not</span>
          <p className={styles.lead}>A framework you cultivate, not a magic memory you install.</p>
          <div className={styles.inscription}>
            {CLAUSES.map((c, i) => (
              <div className={styles.clause} key={i}>
                <span className={styles.clauseTick}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.clauseText}>{withBold(c.text, c.bold)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.shell}>
          <span className={styles.eyebrow}>read the code</span>
          <p className={styles.lead}>Stdlib-only, fail-open, everything local. MIT.</p>
          <div className={styles.ctaRow}>
            <a className={`${styles.btn} ${styles.btnPrimary}`} href="https://github.com/andrewaltair/andrezi" target="_blank" rel="noopener noreferrer">
              <TbBrandGithub size={18} /> View on GitHub
            </a>
            <Link className={`${styles.btn} ${styles.btnGhost}`} href="/projects">
              more projects <TbArrowUpRight size={16} />
            </Link>
          </div>
          <p className={styles.footnote}>
            github.com/andrewaltair/andrezi · MIT · built by <a href="/">Andrew Altair</a>
          </p>
        </div>
      </section>
    </div>
  );
}
