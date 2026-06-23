import type { Metadata } from "next";
import AndreziLanding from "@/components/projects/AndreziLanding";

const URL = "https://andrewaltair.ge/projects/andrezi";

export const metadata: Metadata = {
  title: "Andrezi, the memory that governs | Andrew Altair",
  description:
    "A local-first memory governance layer for Claude Code agents, named after the Georgian highland word for the unwritten remembered law. Open source, MIT, stdlib-only.",
  keywords: [
    "Andrezi",
    "Claude Code",
    "agent memory",
    "memory governance",
    "local-first",
    "open source",
    "Andrew Altair",
  ],
  alternates: { canonical: "/projects/andrezi" },
  openGraph: {
    title: "Andrezi, the memory that governs",
    description:
      "A local-first memory governance layer for Claude Code agents. Open source, MIT.",
    url: URL,
    type: "article",
    images: [{ url: `${URL}/opengraph-image`, width: 1200, height: 630, alt: "Andrezi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrezi, the memory that governs",
    description: "A local-first memory governance layer for Claude Code agents.",
    images: [`${URL}/opengraph-image`],
  },
};

export default function AndreziProjectPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Andrezi",
    description: "A local-first memory governance layer for Claude Code agents.",
    codeRepository: "https://github.com/andrewaltair/andrezi",
    programmingLanguage: "Python",
    license: "https://opensource.org/licenses/MIT",
    author: { "@type": "Person", "@id": "https://andrewaltair.ge/#person", name: "Andrew Altair" },
    url: URL,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <AndreziLanding />
    </>
  );
}
