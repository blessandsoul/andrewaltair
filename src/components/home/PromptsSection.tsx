import Link from "next/link"
import { TbArrowRight, TbCopy, TbShoppingBag } from "react-icons/tb"

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

const DOT_COLORS: Record<string, { primary: string; secondary: string }> = {
  Marketing:  { primary: "bg-emerald-400", secondary: "bg-emerald-200" },
  Coding:     { primary: "bg-blue-400",    secondary: "bg-blue-200" },
  Creative:   { primary: "bg-purple-400",  secondary: "bg-purple-200" },
  Finance:    { primary: "bg-orange-400",  secondary: "bg-orange-200" },
  Design:     { primary: "bg-pink-400",    secondary: "bg-pink-200" },
}
const FALLBACK = { primary: "bg-primary/60", secondary: "bg-primary/20" }

export function PromptsSection({ prompts }: PromptsSectionProps) {
  if (!prompts.length) return null

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between px-1">
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface">პოპულარული პრომტები</h2>
          <p className="text-on-surface-variant text-sm mt-1">გამოიყენეთ მზა შაბლონები საუკეთესო შედეგისთვის</p>
        </div>
        <Link
          href="/prompts"
          className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all shrink-0"
        >
          ყველა <TbArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
        <div className="flex gap-4" style={{ width: "max-content" }}>
          {prompts.map((prompt) => {
            const cat = prompt.category ?? ""
            const dots = DOT_COLORS[cat] ?? FALLBACK
            return (
              <Link
                key={prompt.id}
                href={`/prompts/${prompt.id}`}
                className="group min-w-70 bg-card rounded-xl p-5 border border-outline-variant/10 shadow-sm hover:-translate-y-1 transition-transform flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 items-center">
                      <span className={`w-2 h-2 rounded-full ${dots.primary}`} />
                      <span className={`w-2 h-2 rounded-full ${dots.secondary}`} />
                    </div>
                    <TbCopy className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm font-medium leading-relaxed line-clamp-3 text-on-surface">
                    &ldquo;{prompt.title}&rdquo;
                  </p>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  <span>{cat || "პრომპტი"}</span>
                  {prompt.downloads !== undefined && (
                    <span>{prompt.downloads.toLocaleString()} გამოყენება</span>
                  )}
                  {prompt.price !== undefined && (
                    <span className={prompt.isFree ? "text-green-500" : "text-on-surface"}>
                      {prompt.isFree ? "უფასო" : `₾${prompt.price}`}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}

          {/* View all card */}
          <Link
            href="/prompts"
            className="min-w-45 bg-primary/5 rounded-xl p-5 border border-primary/20 flex flex-col items-center justify-center gap-3 hover:bg-primary/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TbShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary text-center">ყველა პრომპტი</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
