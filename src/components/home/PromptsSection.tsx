import Image from "next/image"
import Link from "next/link"
import { TbArrowRight, TbRobot, TbAtom, TbBook, TbNews, TbCpu, TbTrendingUp, TbBuildingBank, TbBriefcase, TbUsers, TbSchool, TbWorld, TbSparkles } from "react-icons/tb"

interface Prompt {
  id: string
  slug: string
  title: string
  category?: string
  coverImage?: string
  downloads?: number
  price?: number
  isFree?: boolean
}

interface PromptsSectionProps {
  prompts: Prompt[]
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Marketing: TbTrendingUp,
  Coding: TbCpu,
  Creative: TbSparkles,
  Finance: TbBriefcase,
  Design: TbAtom,
  AI: TbRobot,
  Business: TbBuildingBank,
  Education: TbSchool,
  Science: TbAtom,
  News: TbNews,
  Social: TbUsers,
  World: TbWorld,
  Book: TbBook,
}

export function PromptsSection({ prompts }: PromptsSectionProps) {
  if (!prompts.length) return null

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-headline font-bold text-on-surface">პოპულარული პრომტები</h2>
        <Link
          href="/prompts"
          className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          ყველა <TbArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {prompts.slice(0, 3).map((prompt) => {
          const cat = prompt.category ?? ""
          const IconComponent = CATEGORY_ICONS[cat] ?? TbSparkles

          return (
            <Link key={prompt.id} href={`/prompts/${prompt.slug}`} className="group">
              <article className="flex flex-col gap-4">
                {/* Image */}
                <div className="aspect-video overflow-hidden rounded-xl bg-muted relative">
                  {prompt.coverImage ? (
                    <Image
                      src={prompt.coverImage}
                      alt={prompt.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20" />
                  )}

                  {/* Top-right: category icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10">
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>

                  {/* Bottom: price + downloads overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-linear-to-t from-black/70 to-transparent flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${prompt.isFree ? "text-green-400" : "text-white/80"}`}>
                      {prompt.isFree ? "უფასო" : prompt.price ? `₾${prompt.price}` : ""}
                    </span>
                    {prompt.downloads !== undefined && (
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                        {prompt.downloads.toLocaleString()} გამოყენება
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold leading-tight text-on-surface group-hover:text-primary transition-colors">
                    &ldquo;{prompt.title}&rdquo;
                  </h3>
                </div>
              </article>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
