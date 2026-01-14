import { Metadata } from 'next'
import { AboutHero } from "@/components/about/AboutHero"
import { AboutManifest } from "@/components/about/AboutManifest"
import { AboutInspiration } from "@/components/about/AboutInspiration"
import { AboutStartPath } from "@/components/about/AboutStartPath"
import { AboutContactWidget } from "@/components/about/AboutContactWidget"
import { AboutOnlineStatus } from "@/components/about/AboutOnlineStatus"
import { AboutBioDetail } from "@/components/about/AboutBioDetail"
import { TbCode, TbCpu, TbAnalyze, TbBrain } from "react-icons/tb"
import { Card, CardContent } from "@/components/ui/card"
import { brand } from "@/lib/brand"

export const metadata: Metadata = {
  title: "Andrew Altair - AI ინოვატორი და ფუტურისტი",
  description: "Andrew Altair არის AI არქიტექტორი და კონტენტ კრეატორი. გაიგეთ მეტი აგენტური სისტემების, LLM მოდელების (GPT-5, Gemini 3) და Neuro-Aesthetic დიზაინის შესახებ.",
  keywords: ["Andrew Altair", "AI Innovator", "Georgian AI", "Artificial Intelligence", "Frontend Architect", "Next.js", "Neuro-Aesthetic", "Future Tech"],
  openGraph: {
    type: "profile",
    firstName: "Andrew",
    lastName: "Altair",
    username: "andr3waltair",
    gender: "male",
    images: ["/i.png"],
  }
}

// JSON-LD Structured Data for Google/LLMs
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Andrew Altair",
  "jobTitle": "AI Innovator & Frontend Architect",
  "url": `https://${brand.domain}`,
  "image": `https://${brand.domain}/i.png`,
  "sameAs": [
    brand.social.youtube,
    brand.social.linkedin,
    brand.social.github,
    brand.social.instagram,
    brand.social.twitter
  ],
  "knowsAbout": ["Artificial Intelligence", "Software Engineering", "Neuro-Aesthetics", "React", "Next.js", "Large Language Models"],
  "description": "Andrew Altair is an AI Innovator and Tech Content Creator specializing in Agentic Systems and Neuro-Aesthetic Interfaces."
}

// Unified Expertise Data (Translated to Georgian)
const expertise = [
  { icon: TbBrain, title: "ნეირო-არქიტექტურა", desc: "LLM ინტეგრაცია & Reasoning მოდელები" },
  { icon: TbCode, title: "თანამედროვე Frontend", desc: "Next.js 15, React Server Components" },
  { icon: TbAnalyze, title: "წარმადობა", desc: "Core Web Vitals & Neuro-UX ოპტიმიზაცია" },
  { icon: TbCpu, title: "AI აგენტები", desc: "ავტონომიური სისტემები & Multi-agent workflows" },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">

      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section (High Impact) */}
      <AboutHero />

      {/* 2. Core Stats & Philosophy (Grouped) */}
      <section className="py-24 border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-12 max-w-[90rem]">
          <div className="grid lg:grid-cols-2 gap-16">

            {/* Left: Philosophy */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight"><span className="text-primary">ფილოსოფია</span></h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                ჩვენ შევდივართ <span className="text-foreground font-medium">ჰიბრიდული ინტელექტის</span> ეპოქაში.
                ჩემი საქმიანობა აკავშირებს ბიოლოგიურ აზროვნებასა და სინთეზურ გონებას.
                ვქმნი ინტერფეისებს, რომლებიც პატივს სცემენ ადამიანის კოგნიტურ რესურსს და ამავდროულად მაქსიმალურად იყენებენ ისეთი მოდელების ძალას, როგორიცაა GPT-5.2 და Gemini 3.
              </p>
              <AboutOnlineStatus />
            </div>

            {/* Right: Technical Stacks (Grid) */}
            <div className="grid sm:grid-cols-2 gap-4">
              {expertise.map((item, i) => (
                <Card key={i} className="bg-muted/30 border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-colors duration-300">
                  <CardContent className="p-6">
                    <item.icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 3. Deep Content (SEO/GEO) */}
      <AboutBioDetail />

      {/* 4. Deep Dive (Manifest & Inspiration) */}
      <AboutManifest />
      <AboutInspiration />

      {/* 5. Action Pathways */}
      <AboutStartPath />

      {/* 6. Contact (Footer Anchor) */}
      <div id="contact">
        <AboutContactWidget />
      </div>

    </main>
  )
}
