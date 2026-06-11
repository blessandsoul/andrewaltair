import Image from "next/image"
import Link from "next/link"
import { TbArrowRight, TbSparkles } from "react-icons/tb"
import { brand } from "@/lib/brand"

const stats = [
  { value: brand.stats.subscribers, label: "გამომწერი" },
  { value: brand.stats.articles, label: "სტატია" },
  { value: brand.stats.yearsExperience, label: "წელი AI-ში" },
  { value: brand.stats.projects, label: "პროექტი" },
]

/**
 * First screen: who Andrew is + what the visitor gets + proof.
 * The homepage used to open with a carousel of random articles and a
 * widget grid — no positioning, H1 hidden in sr-only, trust metrics
 * buried in the footer. This is the visible H1 now.
 */
export function HeroIntro() {
  return (
    <section className="grid grid-cols-12 gap-8 items-center px-4 sm:px-6 lg:px-8 pt-10">
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold">
          <TbSparkles className="w-4 h-4" />
          {brand.bio.title}
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-headline text-on-surface">
          Andrew Altair —{" "}
          <span className="text-primary">საქართველოს AI ექსპერტი</span>
        </h1>

        <p className="text-lg text-on-surface-variant leading-relaxed max-w-2xl">
          {brand.bio.short}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            AI კონსულტაცია
            <TbArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 border border-outline-variant text-on-surface px-7 py-3 rounded-xl font-bold hover:bg-surface-container-low transition-colors"
          >
            ბლოგი და გზამკვლევები
          </Link>
        </div>

        {/* trust strip — the same numbers as SocialProof, but visible on screen one */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 pt-4 border-t border-outline-variant/40 mt-2">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-primary">{stat.value}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 flex justify-center lg:justify-end">
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
          <div className="absolute inset-0 bg-primary/15 rounded-3xl rotate-6" />
          <Image
            src="/andrewaltair.png"
            alt="Andrew Altair — AI ექსპერტი საქართველოში"
            fill
            sizes="(max-width: 1024px) 256px, 288px"
            className="object-cover rounded-3xl relative z-10"
            priority
          />
        </div>
      </div>
    </section>
  )
}
