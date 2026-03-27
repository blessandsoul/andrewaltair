import Link from "next/link"
import {
  TbArrowRight,
  TbPencil,
  TbSparkles,
  TbMessage,
  TbBrain,
  TbCrown,
  TbBolt,
} from "react-icons/tb"
import { cn } from "@/lib/utils"

const botsShowcase = [
  {
    id: "CONTENT_MASTER",
    name: "კონტენტის მაგისტრი",
    category: "Content",
    tier: "free" as const,
    icon: TbPencil,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    id: "MYSTIC_ADVISOR",
    name: "მისტიკური მრჩეველი",
    category: "Mystic",
    tier: "premium" as const,
    icon: TbSparkles,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    id: "TRANSLATION_PRO",
    name: "თარგმნის ოსტატი",
    category: "Language",
    tier: "free" as const,
    icon: TbMessage,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "BOT_26",
    name: "კოდის გენერატორი",
    category: "Dev",
    tier: "premium" as const,
    icon: TbBrain,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
]

export function BotsSection() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-headline font-bold text-on-surface">AI ბოტები</h2>
        <Link
          href="/bots"
          className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          View All <TbArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="bg-surface-container-low dark:bg-[#1a2234] rounded-2xl p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {botsShowcase.map((bot) => (
            <Link
              key={bot.id}
              href={`/bots/${bot.id}`}
              className="group bg-white dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-3 text-center hover:shadow-xl hover:shadow-primary/5 transition-all"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform", bot.bg)}>
                <bot.icon className={cn("w-7 h-7", bot.color)} />
              </div>
              <div>
                <div className="text-sm font-semibold text-on-surface leading-tight">{bot.name}</div>
                <div className="text-xs text-on-surface-variant mt-0.5">{bot.category}</div>
              </div>
              <div className={cn(
                "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                bot.tier === "premium"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-green-500/10 text-green-600 dark:text-green-400"
              )}>
                {bot.tier === "premium" ? (
                  <span className="flex items-center gap-1"><TbCrown className="w-3 h-3" />Premium</span>
                ) : (
                  <span className="flex items-center gap-1"><TbBolt className="w-3 h-3" />Free</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
