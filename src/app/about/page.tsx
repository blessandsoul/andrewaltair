import type { Metadata } from "next"
import { AboutHero } from "@/components/about/AboutHero"
import { AboutStats } from "@/components/about/AboutStats"
import { AboutExpertise } from "@/components/about/AboutExpertise"
import { TechMarquee } from "@/components/about/TechMarquee"
import { Timeline } from "@/components/about/Timeline"
import { Testimonials } from "@/components/about/Testimonials"
import { ContactForm } from "@/components/about/ContactForm"
import { StickyCTA } from "@/components/about/StickyCTA"
import { AboutFAQ } from "@/components/about/AboutFAQ"

export const metadata: Metadata = {
  title: "Andrew Altair - AI ექსპერტი და ინოვატორი",
  description: "გაიგეთ მეტი ჩემს შესახებ - ხელოვნური ინტელექტი, პრომპტ ინჟინერია და ტექნოლოგიური განათლება.",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Andrew Altair",
  "url": "https://andrewaltair.ge/about",
  "jobTitle": "AI Innovator & Content Creator",
  "sameAs": [
    "https://www.youtube.com/@AndrewAltair",
    "https://www.instagram.com/andr3waltair/",
    "https://t.me/andr3waltairchannel"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "AndrewAltair.GE"
  }
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <StickyCTA />

      <main>
        <AboutHero />
        <TechMarquee />
        <AboutStats />
        <Timeline />
        <AboutExpertise />
        <Testimonials />
        <AboutFAQ />
        <ContactForm />
      </main>
    </div>
  )
}
