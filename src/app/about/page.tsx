import { Metadata } from 'next'
import { AboutHero } from "@/components/about/AboutHero"
import { AboutManifest } from "@/components/about/AboutManifest"
import { AboutInspiration } from "@/components/about/AboutInspiration"
import { AboutStartPath } from "@/components/about/AboutStartPath"
import { AboutContactWidget } from "@/components/about/AboutContactWidget"
import { AboutCertificates } from "@/components/about/AboutCertificates"
import { AboutOnlineStatus } from "@/components/about/AboutOnlineStatus"
import { AboutBioDetail } from "@/components/about/AboutBioDetail"
import { TbCode, TbCpu, TbAnalyze, TbBrain } from "react-icons/tb"
import { Card, CardContent } from "@/components/ui/card"
import { brand } from "@/lib/brand"

export const metadata: Metadata = {
  title: "Andrew Altair — AI ექსპერტი საქართველოში | ფუტურისტი",
  description: "AI არქიტექტორი, ლექტორი, კონტენტის შემქმნელი — 8+ წლის გამოცდილება, 50+ კლიენტი. გაეცანით ჩემს გზას აგენტური AI სისტემების, LLM-ების (GPT-5, Gemini 3, Claude) და ნეირო-ესთეტიკური დიზაინის სამყაროში.",
  keywords: ["Andrew Altair", "AI ექსპერტი", "AI კონსულტანტი საქართველოში", "ხელოვნური ინტელექტი", "AI არქიტექტორი", "Georgian AI", "Next.js", "Neuro-Aesthetic"],
  openGraph: {
    type: "profile",
    firstName: "Andrew",
    lastName: "Altair",
    username: "andr3waltair",
    gender: "male",
    title: "Andrew Altair — AI ექსპერტი საქართველოში",
    description: "AI არქიტექტორი, ლექტორი, კონტენტის შემქმნელი — 8+ წლის გამოცდილება, 50+ კლიენტი.",
    images: [{ url: "/i.png", width: 1200, height: 630, alt: "Andrew Altair — AI ექსპერტი" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrew Altair — AI ექსპერტი საქართველოში",
    description: "AI არქიტექტორი, ლექტორი — 8+ წლის გამოცდილება, 50+ კლიენტი.",
    images: ["/i.png"],
  },
  alternates: {
    canonical: 'https://andrewaltair.ge/about',
  },
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
// Unified Expertise Data (Translated to Georgian)
const expertise = [
  { icon: TbBrain, title: "ნეიროარქიტექტურა", desc: "LLM ინტეგრაცია და Reasoning მოდელები" },
  { icon: TbCode, title: "თანამედროვე Fullstack", desc: "Next.js 15, Node.js, AI აგენტების ინტეგრაცია" },
  { icon: TbAnalyze, title: "ბიზნესის ავტომატიზაცია", desc: "AI workflow-ების დანერგვა და ოპტიმიზაცია" },
  { icon: TbCpu, title: "AI ტრენინგი", desc: "გუნდების გადამზადება და მენტორინგი" },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary font-georgian">

      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'მთავარი', item: `https://${brand.domain}` },
            { '@type': 'ListItem', position: 2, name: 'Andrew Altair-ის შესახებ', item: `https://${brand.domain}/about` },
          ],
        }) }}
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
                ჩემი მიზანია ბიზნესისა და ადამიანების გაძლიერება ხელოვნური ინტელექტის (AI) მეშვეობით.
                როგორც <span className="text-foreground font-medium">AI არქიტექტორი</span>, ვქმნი სისტემებს, რომლებიც აერთიანებს ბიოლოგიურ კრეატიულობასა და სინთეზურ გონებას,
                რათა მაქსიმალური შედეგი მივიღოთ ისეთი მოდელებისგან, როგორიცაა GPT-5.2 და Gemini 3.
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

      {/* 3. Certificates */}
      <AboutCertificates />

      {/* 4. Deep Content (SEO/GEO) */}
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
