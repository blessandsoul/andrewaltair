import { brand } from "@/lib/brand"

const stats = [
  { value: brand.stats.subscribers, label: "გამომწერი" },
  { value: brand.stats.articles, label: "სტატია" },
  { value: brand.stats.yearsExperience, label: "წელი" },
  { value: brand.stats.projects, label: "პროექტი" },
]

export function SocialProof() {
  return (
    <section className="py-12 bg-surface-container-low dark:bg-slate-800/40 rounded-2xl">
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 px-8">
        {stats.map((stat, i) => (
          <div key={stat.label} className="text-center">
            <div
              className={`text-4xl md:text-5xl font-black tracking-tight ${
                i % 2 === 0 ? "text-primary" : "text-on-surface"
              }`}
            >
              {stat.value}
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
