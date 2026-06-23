import type { Metadata } from "next";
import AndreziLanding from "@/components/projects/AndreziLanding";

const URL = "https://andrewaltair.ge/projects/andrezi";

export const metadata: Metadata = {
  title: "Andrezi: მეხსიერება, რომელიც მართავს | Andrew Altair",
  description:
    "ლოკალური მეხსიერების მართვის სისტემა Claude Code აგენტებისთვის. მას სახელი საქართველოს მთიანეთის იმ დაუწერელი, მეხსიერებაში შენახული სამართლის პატივსაცემად ჰქვია. პროექტი არის ღია კოდით, აქვს MIT ლიცენზია და იყენებს მხოლოდ სტანდარტულ ბიბლიოთეკებს.",
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
    title: "Andrezi: მეხსიერება, რომელიც მართავს",
    description:
      "ლოკალური მეხსიერების მართვის სისტემა Claude Code აგენტებისთვის. ღია კოდი, MIT.",
    url: URL,
    type: "article",
    images: [{ url: `${URL}/opengraph-image`, width: 1200, height: 630, alt: "Andrezi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrezi: მეხსიერება, რომელიც მართავს",
    description: "ლოკალური მეხსიერების მართვის სისტემა Claude Code აგენტებისთვის.",
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
