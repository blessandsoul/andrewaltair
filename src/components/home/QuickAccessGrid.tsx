import Link from "next/link"
import {
  TbBrain,
  TbSparkles,
  TbBook,
  TbSettings,
  TbGift,
  TbPencil,
} from "react-icons/tb"
import { PerspectiveTag } from "@/components/ui/PerspectiveTag"
import { cn } from "@/lib/utils"

const quickLinks = [
  {
    href: "/quiz",
    title: "AI ქვიზი",
    label: "შეამოწმე თავი",
    icon: TbBrain,
    featured: true,
    tag: "ახალი",
    iconColor: "text-primary",
  },
  {
    href: "/mystic",
    title: "მისტიკური AI",
    label: "ტაროტი და ნუმეროლოგია",
    icon: TbSparkles,
    iconColor: "text-secondary-accent",
  },
  {
    href: "/encyclopedia",
    title: "ენციკლოპედია",
    label: "AI ცოდნა",
    icon: TbBook,
    iconColor: "text-amber-700",
  },
  {
    href: "/tools",
    title: "AI ხელსაწყოები",
    label: "რეიტინგები",
    icon: TbSettings,
    iconColor: "text-slate-500",
  },
  {
    href: "/prompt-builder",
    title: "Prompt Builder",
    label: "შექმნა და ტესტი",
    icon: TbPencil,
    iconColor: "text-primary",
  },
  {
    href: "/mystery-box",
    title: "საჩუქრის ყუთი",
    label: "სიურპრიზი",
    icon: TbGift,
    iconColor: "text-orange-500",
  },
]

export function QuickAccessGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {quickLinks.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "group relative bg-surface-container-low dark:bg-slate-800/60 rounded-xl p-5 flex flex-col justify-between min-h-20 hover:bg-white dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-outline-variant/20 shadow-sm",
            item.featured && "col-span-2"
          )}
        >
          <div className="flex items-start justify-between">
            <item.icon
              className={cn(
                item.featured ? "w-8 h-8" : "w-6 h-6",
                item.iconColor
              )}
            />
            {item.tag && <PerspectiveTag>{item.tag}</PerspectiveTag>}
          </div>
          <div>
            <div className={cn("font-bold text-on-surface", item.featured ? "text-lg" : "text-sm")}>
              {item.title}
            </div>
            <div className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">
              {item.label}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
