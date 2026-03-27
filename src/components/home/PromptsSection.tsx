import Link from "next/link"
import { TbArrowRight, TbDownload, TbShoppingBag } from "react-icons/tb"

interface Prompt {
  id: string
  title: string
  category?: string
  downloads?: number
  price?: number
  isFree?: boolean
}

interface PromptsSectionProps {
  prompts: Prompt[]
}

export function PromptsSection({ prompts }: PromptsSectionProps) {
  if (!prompts.length) return null

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-headline font-bold text-on-surface">Prompts</h2>
        <Link
          href="/prompts"
          className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          View All <TbArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
        <div className="flex gap-4" style={{ width: "max-content" }}>
          {prompts.map((prompt) => (
            <Link
              key={prompt.id}
              href={`/prompts/${prompt.id}`}
              className="group min-w-[280px] bg-card rounded-xl p-5 border border-border/30 hover:-translate-y-1 transition-transform"
            >
              <div className="flex items-center justify-between mb-3">
                {prompt.category && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70 bg-primary/8 px-2 py-0.5 rounded">
                    {prompt.category}
                  </span>
                )}
                <span className={`text-sm font-bold ml-auto ${prompt.isFree ? "text-green-500" : "text-on-surface"}`}>
                  {prompt.isFree ? "Free" : prompt.price ? `₾${prompt.price}` : ""}
                </span>
              </div>

              <h3 className="font-semibold text-sm text-on-surface leading-snug mb-4 line-clamp-3 group-hover:text-primary transition-colors">
                {prompt.title}
              </h3>

              {prompt.downloads !== undefined && (
                <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                  <TbDownload className="w-3.5 h-3.5" />
                  {prompt.downloads.toLocaleString()}
                </div>
              )}
            </Link>
          ))}

          {/* View all card */}
          <Link
            href="/prompts"
            className="min-w-[180px] bg-primary/5 rounded-xl p-5 border border-primary/20 flex flex-col items-center justify-center gap-3 hover:bg-primary/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TbShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary text-center">View all prompts</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
