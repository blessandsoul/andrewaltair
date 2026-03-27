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
    label: "Test Yourself",
    icon: TbBrain,
    featured: true,
    tag: "New",
  },
  {
    href: "/mystic",
    title: "Mystic AI",
    label: "Tarot & Numerology",
    icon: TbSparkles,
    featured: false,
  },
  {
    href: "/encyclopedia",
    title: "Encyclopedia",
    label: "AI Knowledge",
    icon: TbBook,
    featured: false,
  },
  {
    href: "/tools",
    title: "AI Tools",
    label: "Ratings",
    icon: TbSettings,
    featured: false,
  },
  {
    href: "/prompt-builder",
    title: "Prompt Builder",
    label: "Build & Test",
    icon: TbPencil,
    featured: false,
  },
  {
    href: "/mystery-box",
    title: "Gift Box",
    label: "Surprise",
    icon: TbGift,
    featured: false,
  },
]

export function QuickAccessGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      {quickLinks.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "group relative bg-surface-container-low dark:bg-slate-800/60 rounded-xl p-4 flex flex-col gap-2 hover:bg-white dark:hover:bg-slate-800 transition-colors",
            item.featured && "col-span-2"
          )}
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <item.icon className="w-5 h-5" />
            </div>
            {item.tag && <PerspectiveTag>{item.tag}</PerspectiveTag>}
          </div>
          <div>
            <div className="font-semibold text-sm text-on-surface">{item.title}</div>
            <div className="text-xs text-on-surface-variant">{item.label}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
