import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { TbArrowUpRight } from "react-icons/tb";
import { getAllProjects } from "@/data/projectsData";
import styles from "@/components/projects/projectsIndex.module.css";

export const metadata: Metadata = {
  title: "პროექტები | Andrew Altair",
  description:
    "ღიად შექმნილი სისტემები და ხელსაწყოები: AI აგენტების მეხსიერების მართვა და სხვა. თითოეულ პროექტს საკუთარი აღწერა აქვს და თითოეული მათგანი დანერგილია.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "პროექტები | Andrew Altair",
    description: "ღიად შექმნილი სისტემები და ხელსაწყოები.",
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
          <span className={styles.eyebrow}>პორტფოლიო</span>
          <h1 className={styles.title}>რასაც ვქმნი, ღიად ვქმნი.</h1>
          <p className={styles.sub}>
            სისტემები და ხელსაწყოები, რომლებითაც ვამაყობ. თითოეულს საკუთარი აღწერა აქვს და თითოეული მათგანი რეალურად მუშაობს და არა მხოლოდ სლაიდებზე.
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
                <span className={styles.dot} /> {p.status === "live" ? "აქტიური" : "პროცესშია"} · {p.year}
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
