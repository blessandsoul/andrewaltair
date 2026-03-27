import { cn } from "@/lib/utils"

interface PerspectiveTagProps {
  children: React.ReactNode
  className?: string
}

export function PerspectiveTag({ children, className }: PerspectiveTagProps) {
  return (
    <span
      className={cn(
        "inline-block bg-accent text-accent-foreground px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-[0.05em]",
        className
      )}
    >
      {children}
    </span>
  )
}
