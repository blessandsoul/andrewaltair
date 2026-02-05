# Components & Styling

## Component Structure Order
1. Imports (grouped per 01-project-structure)
2. Types (component-specific interfaces)
3. Component (with hooks → derived state → handlers → early returns → render)

## Component Types

| Type | Location | Purpose |
|------|----------|---------|
| UI Primitives | `components/ui/` | Radix UI + CVA variants, `forwardRef` pattern |
| Domain | `components/[domain]/` | Feature-specific (blog/, admin/, home/) |
| Layout | `components/layout/` | Header, Footer, Navigation — render `children` |
| Universal | `components/universal/` | Shared across features |

## Component Rules
- Named exports always (default export only for Next.js pages/layouts)
- `displayName` on `React.memo` and `forwardRef` components
- Max 250 lines — split if larger
- Max 5 props — group related props into objects if more
- Max 3 levels JSX nesting — extract sub-components
- Max 3 `useState` hooks — use `useReducer` if more
- `useCallback` for handlers passed to children; `useMemo` for expensive computations
- Early returns for loading/error/empty states before main render

## Styling: Tailwind + CVA

**Use semantic color variables, NEVER hardcoded colors:**
```tsx
// CORRECT
<div className="bg-background text-foreground">
<Button className="bg-primary text-primary-foreground">

// FORBIDDEN
<div className="bg-blue-500">        // Tailwind palette
<div className="bg-[#3b82f6]">       // Hex code
<div style={{ color: 'red' }}>       // Inline style
```

**CVA for component variants:**
```tsx
const buttonVariants = cva("base-classes", {
  variants: { variant: { default: "...", destructive: "..." }, size: { sm: "...", md: "..." } },
  defaultVariants: { variant: "default", size: "md" },
})
```

**`cn()` for conditional classes:**
```tsx
<div className={cn("base", condition && "conditional", className)} />
```

## Color System
All colors via CSS variables in `globals.css`. Key tokens:
`background`, `foreground`, `primary`, `secondary`, `destructive`, `muted`, `accent`, `card`, `border`, `input`, `ring`, `success`, `warning`, `info`

Each has a `-foreground` pair. Use opacity variants: `bg-primary/10`.

## Accessibility
- `aria-label` on icon-only buttons
- `aria-invalid` + `aria-describedby` on form fields with errors
- `htmlFor` on all labels
- Semantic HTML: `article`, `nav`, `main`, `header`, `footer`
- `rel="noopener noreferrer"` on external links with `target="_blank"`

## Conditional Rendering
- Early returns for states (preferred)
- `&&` for optional elements
- Ternary for binary choice
- Object lookup for multiple states (status badges, etc.)
- No nested ternaries
