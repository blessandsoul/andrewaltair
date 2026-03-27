import Link from "next/link"
import {
  TbPencil,
  TbSparkles,
  TbMessage,
  TbBrain,
  TbPlus,
} from "react-icons/tb"
import { cn } from "@/lib/utils"

const botsShowcase = [
  {
    id: "CONTENT_MASTER",
    name: "კონტენტის მაგისტრი",
    category: "Content",
    icon: TbPencil,
    color: "text-primary",
    bg: "bg-primary-fixed",
  },
  {
    id: "MYSTIC_ADVISOR",
    name: "მისტიკური მრჩეველი",
    category: "Mystic",
    icon: TbSparkles,
    color: "text-secondary-accent",
    bg: "bg-secondary-fixed",
  },
  {
    id: "TRANSLATION_PRO",
    name: "თარგმნის ოსტატი",
    category: "Language",
    icon: TbMessage,
    color: "text-amber-700",
    bg: "bg-tertiary-fixed",
  },
  {
    id: "BOT_26",
    name: "კოდის გენერატორი",
    category: "Dev",
    icon: TbBrain,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
]

export function BotsSection() {
  return (
    <section className="bg-surface-container-low dark:bg-[#1a2234] rounded-2xl p-10 space-y-10">
      <div className="max-w-xl">
        <h2 className="text-3xl font-black tracking-tight font-headline text-on-surface">AI ბოტები</h2>
        <p className="text-on-surface-variant mt-2">სპეციალიზებული ასისტენტები თქვენი ყოველდღიური ამოცანებისთვის</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {botsShowcase.map((bot) => (
          <Link
            key={bot.id}
            href={`/bots/${bot.id}`}
            className="group bg-white dark:bg-slate-800 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-xl hover:shadow-primary/5 transition-all"
          >
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform", bot.bg)}>
              <bot.icon className={cn("w-7 h-7", bot.color)} />
            </div>
            <div className="font-bold text-sm text-on-surface">{bot.name}</div>
            <div className="text-[10px] text-on-surface-variant mt-1 uppercase tracking-tighter">{bot.category}</div>
          </Link>
        ))}

        {/* Custom bot card */}
        <Link
          href="/bots"
          className="group bg-white dark:bg-slate-800 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-xl hover:shadow-primary/5 transition-all"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
            <TbPlus className="w-7 h-7 text-slate-500" />
          </div>
          <div className="font-bold text-sm text-on-surface">Custom</div>
          <div className="text-[10px] text-on-surface-variant mt-1 uppercase tracking-tighter">Create Own</div>
        </Link>
      </div>
    </section>
  )
}
