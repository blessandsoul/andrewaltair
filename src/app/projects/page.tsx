import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { TbArrowUpRight } from "react-icons/tb";
import { getAllProjects } from "@/data/projectsData";
import styles from "@/components/projects/projectsIndex.module.css";

export const metadata: Metadata = {
  title: "Projects | Andrew Altair",
  description:
    "Systems and tools built in the open: memory governance for AI agents and more. Each project with its own writeup, each one shipped.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Andrew Altair",
    description: "Systems and tools built in the open.",
    type: "website",
    url: "https://andrewaltair.ge/projects",
  },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.shell}>
          <span className={styles.eyebrow}>portfolio</span>
          <h1 className={styles.title}>Things I build, in the open.</h1>
          <p className={styles.sub}>
            Systems and tools I am proud of. Each one has its own writeup, and each one is shipped, not a slide.
          </p>
        </div>
      </header>

      <section className={styles.shell}>
        <div className={styles.list}>
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className={styles.card}
              style={{ "--accent": p.accent } as CSSProperties}
            >
              <span className={styles.cardMeta}>
                <span className={styles.dot} /> {p.status === "live" ? "live" : "in progress"} · {p.year}
              </span>
              <div className={styles.cardHead}>
                <h2 className={styles.cardTitle}>
                  {p.title}
                  {p.georgian && <span className={styles.geo}>{p.georgian}</span>}
                </h2>
                <span className={styles.arrow}>
                  <TbArrowUpRight size={22} />
                </span>
              </div>
              <p className={styles.cardTagline}>{p.tagline}</p>
              <p className={styles.cardSummary}>{p.summary}</p>
              <div className={styles.tags}>
                {p.tags.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
