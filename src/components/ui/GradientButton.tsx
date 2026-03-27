import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"

const gradientButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-linear-to-br from-primary to-primary-container text-white shadow-sm hover:shadow-primary/20 hover:shadow-lg",
        glass:
          "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

interface GradientButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {}

export function GradientButton({
  variant,
  className,
  children,
  ...props
}: GradientButtonProps) {
  return (
    <button
      className={cn(gradientButtonVariants({ variant }), className)}
      {...props}
    >
      {children}
    </button>
  )
}
