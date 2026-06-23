// Portfolio projects registry. Each project gets a rich landing at /projects/<slug>.
// getAllProjects() feeds the index page + the sitemap / feed / llms registration.

export interface Project {
  slug: string;
  title: string;
  georgian?: string; // optional Georgian wordmark
  tagline: string;
  summary: string;
  year: string;
  status: "live" | "wip";
  tags: string[];
  repoUrl?: string;
  accent: string; // hex, used by the index card
}

export const PROJECTS: Project[] = [
  {
    slug: "andrezi",
    title: "Andrezi",
    georgian: "ანდრეზი",
    tagline: "the memory that governs",
    summary:
      "A local-first memory governance layer for Claude Code agents, named after the Georgian highland word for the unwritten remembered law a community carries and lives by.",
    year: "2026",
    status: "live",
    tags: ["AI agents", "memory", "open source", "Python"],
    repoUrl: "https://github.com/andrewaltair/andrezi",
    accent: "#d98a4b",
  },
];

export function getAllProjects(): Project[] {
  return PROJECTS;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getProjectCount(): number {
  return PROJECTS.length;
}
