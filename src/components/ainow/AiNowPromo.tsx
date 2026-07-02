import { TbArrowRight } from "react-icons/tb"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// aiNOW sister-brand promo (B2B AI agency, ainow.ge). Server component: static
// content + CSS-only interactions, so it ships zero client JS. Andrew is the
// founder-bridge only (brand boundary: this sells aiNOW SERVICES, never courses).
// Product accent colors map to existing semantic tokens, never hardcoded hex:
// aiCONTENT=chart-5 (pink) / aiADS=success (green) / aiSTAFF=info (blue) / iAI=primary (indigo).

const AINOW_URL = "https://ainow.ge"

const products = [
  { name: "aiCONTENT", verb: "ქმნის", color: "text-chart-5" },
  { name: "aiADS", verb: "არეკლამებს", color: "text-success" },
  { name: "aiSTAFF", verb: "ყიდის", color: "text-info" },
  { name: "iAI", verb: "მართავს", color: "text-primary" },
] as const

type PromoVariant = "card" | "banner" | "inline"
type PromoContext = "home" | "about" | "blog" | "encyclopedia"

interface AiNowPromoProps {
  variant?: PromoVariant
  context?: PromoContext
  className?: string
}

// The signature aiNOW mark: a thin 4-hue strip built from semantic tokens.
function AccentBar() {
  return (
    <div
      aria-hidden
      className="h-1 w-full bg-[image:linear-gradient(to_right,var(--chart-5),var(--success),var(--info),var(--primary))]"
    />
  )
}

function FunnelLine({ className }: { className?: string }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      {products.map((product, index) => (
        <span key={product.name} className="inline-flex items-center gap-1.5">
          <span className={cn("font-semibold", product.color)}>{product.name}</span>
          <span className="text-muted-foreground">{product.verb}</span>
          {index < products.length - 1 && (
            <span className="text-muted-foreground/40" aria-hidden>·</span>
          )}
        </span>
      ))}
    </p>
  )
}

export function AiNowPromo({ variant = "card", context = "about", className }: AiNowPromoProps) {
  // Blog / encyclopedia lead with chatbots (aiNOW's validated paid demand);
  // home / about point at the brand root.
  const href =
    context === "blog" || context === "encyclopedia" ? `${AINOW_URL}/services/bots` : AINOW_URL

  const cta = (
    <Button asChild variant="gradient" size="lg" className="group">
      <a href={href}>
        AI სააგენტოს გაცნობა
        <TbArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </Button>
  )

  const heading = (
    <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-headline">
      <span className="text-primary">ai</span>NOW · AI რომელიც მუშაობს
    </h2>
  )

  const founder = (
    <p className="text-sm text-muted-foreground">
      Andrew Altair-ის დაფუძნებული AI მარკეტინგის სააგენტო ქართული ბიზნესისთვის.
    </p>
  )

  if (variant === "inline") {
    return (
      <aside
        className={cn(
          "not-prose my-8 flex flex-col gap-4 overflow-hidden rounded-xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between",
          className
        )}
      >
        <div className="space-y-2">
          {heading}
          <FunnelLine className="text-xs" />
        </div>
        {cta}
      </aside>
    )
  }

  const body = (
    <div className="space-y-5 p-8 sm:p-10">
      <div className="space-y-2">
        {heading}
        {founder}
      </div>
      <FunnelLine className="text-sm" />
      <div>{cta}</div>
    </div>
  )

  if (variant === "banner") {
    return (
      <section className={cn("overflow-hidden rounded-2xl border bg-card", className)}>
        <AccentBar />
        {body}
      </section>
    )
  }

  // variant === "card"
  return (
    <Card className={cn("overflow-hidden", className)}>
      <AccentBar />
      {body}
    </Card>
  )
}
