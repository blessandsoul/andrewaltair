import type { Transition, Variants } from 'framer-motion'

// Shared framer-motion presets so workshop motion is consistent everywhere.
// (globals.css already guards prefers-reduced-motion for CSS animations.)

export const springSoft: Transition = { type: 'spring', stiffness: 220, damping: 22 }
export const springPop: Transition = { type: 'spring', stiffness: 300, damping: 18 }

export const fadeUp: Variants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
}

export const popIn: Variants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
}

// Parent + child for staggered lists (roster chips, result rows).
export const staggerParent: Variants = {
    animate: { transition: { staggerChildren: 0.05 } },
}
export const staggerChild: Variants = {
    initial: { opacity: 0, scale: 0.6, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0 },
}
