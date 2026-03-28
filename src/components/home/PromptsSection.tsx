import Image from "next/image"
import Link from "next/link"
import { TbArrowRight } from "react-icons/tb"
import { PerspectiveTag } from "@/components/ui/PerspectiveTag"

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
        {prompts.slice(0, 3).map((prompt) => (
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
                {prompt.category && (
                  <div className="absolute top-3 right-3">
                    <PerspectiveTag>{prompt.category}</PerspectiveTag>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  {prompt.isFree ? (
                    <span className="text-success">უფასო</span>
                  ) : prompt.price ? (
                    <span>₾{prompt.price}</span>
                  ) : null}
                  {prompt.downloads !== undefined && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-outline-variant" />
                      <span>{prompt.downloads.toLocaleString()} გამოყენება</span>
                    </>
                  )}
                </div>

                <h3 className="text-xl font-bold leading-tight text-on-surface group-hover:text-primary transition-colors">
                  &ldquo;{prompt.title}&rdquo;
                </h3>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}
