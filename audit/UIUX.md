# andrewaltair.ge UI/UX Catalog (100 enhancements)

Scope: whole app UI. Goal: raise the wow factor while staying cognitively LIGHT (the user's explicit constraint). So this is polish + restrained delight, NOT 100 new widgets. Every item cross-references the governing house engine and carries a one-line cognitive-load justification.
Engines: VISUAL_TASTE (VT: layout/type/color/motion anti-slop, this app leans DESIGN_VARIANCE 7-8) and INTERFACE_POLISH (IP: exact micro-interaction values). Rules: user > brand-guide > engine; sentence-case Georgian-first; existing indigo Digital-Curator tokens (globals.css); Manrope/Noto fonts; Tabler/Phosphor icons; zero em-dash; every :hover paired with :focus-visible; reduced-motion wrapped; press scale 0.96 never below 0.95.
Biggest leverage: the shared primitives (button.tsx, card.tsx) cascade app-wide, so a handful of primitive fixes clear dozens of surfaces at once.
Impact = High / Med / Low. Effort = S / M / L. WIP note: GradientButton.tsx and admin/workshop files are under active edit by the user, coordinate before touching.

---

## Primitive polish (cascades app-wide) (30)

**U001 [High] Button: replace transition-all with named properties** · primitive-polish · src/components/ui/button.tsx:8 · S · IP P1
Now: transition-all animates every property. Proposed: transition-[transform,background-color,color,box-shadow]. CogLoad: pure perf/craft, invisible to the user, no new motion.

**U002 [High] Button: add press scale** · primitive-polish · src/components/ui/button.tsx:8 · S · IP A5
Now: no active state. Proposed: active:scale-[0.96] motion-reduce:active:scale-100. CogLoad: tactile confirmation the user already expects, one property, reduced-motion safe.

**U003 [Med] Button gradient variant: name the hover transition** · primitive-polish · src/components/ui/button.tsx:23 · S · IP P1
Now: hover:opacity-90 under transition-all. Proposed: scope to transition-[opacity,box-shadow]. CogLoad: no visual change, just correctness.

**U004 [High] Card: shadow-over-border for depth** · primitive-polish · src/components/ui/card.tsx:10 · M · IP S3
Now: border shadow-sm (hard border). Proposed: a layered transparent box-shadow stack (light 3-layer, dark single 0 0 0 1px rgba(255,255,255,.08)), keep dividers as borders. CogLoad: softer depth reads as higher quality without adding elements.

**U005 [High] Card: optional hover-lift and press variant** · primitive-polish · src/components/ui/card.tsx:5 · M · IP A5
Now: no hover/press, every consumer re-implements (durations drift 300 vs 500). Proposed: an interactive variant (hover -translate-y-0.5, active:scale-[0.98], named transition). CogLoad: one consistent affordance replaces ad hoc ones, less visual noise overall.

**U006 [Med] Card: concentric radius** · primitive-polish · src/components/ui/card.tsx:10,68 · S · IP S1
Now: rounded-xl outer, inner content radius unrelated. Proposed: outer = inner + padding (scripts/polish_radius.py). CogLoad: geometry only, subconscious rightness.

**U007 [Med] CardTitle: text-balance** · primitive-polish · src/components/ui/card.tsx:35 · S · IP T1
Now: default wrapping. Proposed: text-balance. CogLoad: even title line-lengths, zero interaction cost.

**U008 [Med] CardDescription: text-pretty** · primitive-polish · src/components/ui/card.tsx:45 · S · IP T1
Now: default wrapping. Proposed: text-pretty (no orphans). CogLoad: readability, invisible mechanism.

**U009 [Low] Input: stronger hover border with focus parity** · primitive-polish · src/components/ui/input.tsx:11 · S · IP A1/X4
Now: transition-[color,box-shadow] (already good), no hover cue. Proposed: hover:border-ring/40 with the existing focus-visible ring. CogLoad: subtle affordance, matches focus, no motion.

**U010 [Low] Badge: press feedback only when interactive** · primitive-polish · src/components/ui/badge.tsx:8 · S · IP A5
Now: asChild link badges have no press. Proposed: [a&]:active:scale-[0.97]. CogLoad: only when clickable, so no false affordance.

**U011 [Med] Root: font-smoothing antialiased** · primitive-polish · src/app/globals.css (body) · S · IP T2
Now: default smoothing. Proposed: antialiased on root once. CogLoad: crisper type everywhere, one line.

**U012 [Med] AnimatedCounter: tabular-nums** · primitive-polish · src/components/ui/AnimatedCounter.tsx · S · IP T3
Now: proportional digits jitter width while counting. Proposed: tabular-nums. CogLoad: removes distracting layout shift.

**U013 [Med] LiveVisitorCounter: tabular-nums** · primitive-polish · src/components/interactive/LiveVisitorCounter.tsx · S · IP T3
Now: live digits shift width. Proposed: tabular-nums. CogLoad: steadier number, less flicker.

**U014 [Med] PostCard stat counts: tabular-nums** · primitive-polish · src/components/blog/PostCard.tsx:250 · S · IP T3
Now: view/like/comment counts proportional. Proposed: tabular-nums on the stat pills. CogLoad: stable card layout on update.

**U015 [Med] Icon button: 40x40 hit area** · primitive-polish · src/components/ui/button.tsx:29 · S · IP S5/X3
Now: size icon = 36px (below 40). Proposed: a pseudo-element expanding the hit area to 40x40. CogLoad: easier taps, no visual change.

**U016 [High] ThemeToggle: animated icon cross-fade** · micro-interaction · src/components/layout/ThemeToggle.tsx:53 · S · IP A4
Now: hard ternary icon swap. Proposed: scale 0.25 to 1, blur 4 to 0, opacity 0 to 1, spring {duration:0.3, bounce:0}. CogLoad: a single 300ms moment on an intentional click, delightful not noisy.

**U017 [Low] ThemeToggle: skip load animation** · micro-interaction · src/components/layout/ThemeToggle.tsx · S · IP A6
Now: could animate on mount. Proposed: initial={false}. CogLoad: no animation on first paint, calmer load.

**U018 [Low] BackToTop: Tabler icon and named transition** · primitive-polish · src/components/ui/scroll-progress.tsx · S · VT icons/IP P1
Now: hand-rolled SVG, transition-all. Proposed: TbArrowUp + transition-[transform,opacity]. CogLoad: consistent icon set, no behavior change.

**U019 [Low] ScrollProgress: GPU-only will-change** · primitive-polish · src/components/ui/scroll-progress.tsx · S · IP P2
Now: transforms without will-change hint. Proposed: will-change:transform on the bar only. CogLoad: smoother scroll bar, no visual change.

**U020 [Med] MobileNav: named transition** · primitive-polish · src/components/layout/MobileNav.tsx:32 · S · IP P1
Now: transition-all duration-200. Proposed: transition-[color,background-color]. CogLoad: perf only.

**U021 [Med] Cover images: subtle outline** · primitive-polish · src/components/blog/PostCard.tsx:209 · S · IP S4
Now: images sit flush on card. Proposed: outline 1px rgba(0,0,0,.1) with -1px offset (pure black/white, never tinted). CogLoad: crisp edge, no color shift.

**U022 [Med] Dialog and Popover: concentric radius and shadow stack** · primitive-polish · src/components/ui/dialog.tsx, popover.tsx · M · IP S1/S3
Now: single border/shadow. Proposed: layered shadow, radius math, A2 entrance. CogLoad: overlays feel grounded, one motion language.

**U023 [Med] Tabs and Accordion: interruptible transitions and focus parity** · primitive-polish · src/components/ui/tabs.tsx, accordion.tsx · M · IP A1/X4
Now: some keyframe/hover only. Proposed: interruptible CSS transitions, focus-visible on every hover. CogLoad: smoother, keyboard-equal, no new elements.

**U024 [Med] Ghost and link variants: guarantee focus-visible pair** · a11y · src/components/ui/button.tsx:19 · S · IP X4
Now: hover states present, focus parity unverified on ghost/link. Proposed: matching focus-visible ring on all variants. CogLoad: keyboard users get the same cue, no visual cost for mouse.

**U025 [Low] Switch and Checkbox: press and reduced-motion** · primitive-polish · src/components/ui/switch.tsx, checkbox.tsx · S · IP A5/X1
Now: state toggle only. Proposed: subtle press scale, reduced-motion wrap. CogLoad: tactile, respects motion pref.

**U026 [Low] Select and Command: optical padding on options** · primitive-polish · src/components/ui/select.tsx, command.tsx · S · IP S2
Now: geometric padding. Proposed: icon-side padding minus 2px optical. CogLoad: alignment feels right, invisible mechanism.

**U027 [Low] Avatar: hover ring with focus pair** · primitive-polish · src/components/ui/avatar.tsx · S · IP S4/X4
Now: static. Proposed: outline on hover plus focus-visible when interactive. CogLoad: only when clickable.

**U028 [Med] GradientButton: press and named transitions (coordinate with WIP)** · primitive-polish · src/components/ui/GradientButton.tsx · S · IP A5
Now: under active edit. Proposed: after WIP lands, add active:scale-[0.96] and named transitions. CogLoad: consistency with Button, no new motion.

**U029 [Low] Separator: keep as border (S3 exception), verify token** · primitive-polish · src/components/ui/separator.tsx · S · IP S3
Now: border. Proposed: confirm it uses --border token, not a shadow. CogLoad: dividers stay crisp per the engine exception.

**U030 [Med] Global transition-all sweep in top interactive components** · primitive-polish · Header.tsx, MobileNav.tsx, PostCard.tsx · M · IP P1
Now: 369 transition-all across 170 files. Proposed: name properties in the highest-traffic components first. CogLoad: perf, invisible. (Quality twin: Q019.)

---

## Palette, brand, typography (22)

**U031 [High] Unify the two palettes** · palette · src/lib/brand.ts:38 · M · VT one-theme
Now: brand.ts cyber cyan/indigo competes with globals.css indigo tokens. Proposed: delete brand.colors, drive all color from CSS tokens. CogLoad: one coherent color story, less visual dissonance. (Quality twin: Q005.)

**U032 [Med] 404 snake colors to tokens** · palette · src/app/not-found.tsx:142 · S · VT
Now: hardcoded hex. Proposed: token vars. CogLoad: the easter egg matches the brand, no jarring palette.

**U033 [Med] Category colors: single token source** · palette · src/lib/blog-utils.ts:44 · S · VT
Now: three disconnected definitions. Proposed: getCategoryInfo returns token classes. CogLoad: consistent category cues site-wide.

**U034 [High] Gradient discipline: reserve the AI-purple gradient for the hero** · gradient-discipline · src/app/globals.css (--gradient-primary) · M · VT s4
Now: --gradient-primary (indigo to purple, the #1 AI tell) used broadly. Proposed: hero only, solid --primary elsewhere. CogLoad: less gradient fatigue, the hero stays special.

**U035 [Med] Cap .text-gradient usage** · gradient-discipline · src/app/globals.css · M · VT s4
Now: text-gradient on many headings. Proposed: H1/hero only, solid tokens for section heads. CogLoad: gradient becomes a signal not wallpaper.

**U036 [High] Real brand mark** · brand · src/components/layout/Header.tsx, footer.tsx · M · VT brand
Now: a generic TbRobot icon stands in, logo.png unused. Proposed: use the designed mark (crimson A star per brand memory) or commit logo.png in the chrome. CogLoad: a memorable mark aids recognition, replaces a generic one (net neutral load).

**U037 [Med] Sentence-case headings, not Title Case** · typography · home/about/services headings · M · VT s5
Now: some Title Case headers. Proposed: sentence case throughout. CogLoad: reads as editorial and human, not templated.

**U038 [Med] Hero H1: line cap and text-balance** · typography · src/components/home/HeroIntro.tsx · S · IP T1/VT
Now: H1 can run long. Proposed: max 2-3 lines with text-balance. CogLoad: a tight hero is easier to parse.

**U039 [Med] Eyebrow audit** · layout · home sections · S · VT s5
Now: eyebrow labels risk overuse. Proposed: at most ceil(sections/3), never SECTION 01 numbering. CogLoad: fewer redundant labels, cleaner scan.

**U040 [Med] Avoid three-equal-card rows** · layout · src/components/home/QuickAccessGrid.tsx, sections · M · VT s4
Now: grid-cols-3 equal cards risk the AI-grid tell. Proposed: a varied bento with a lead cell. CogLoad: visual hierarchy guides the eye rather than flattening it.

**U041 [Med] Ship light and dark pair for every new shadow** · palette · src/app/globals.css (.dark) · S · IP X2
Now: shadows tuned for light. Proposed: a dark variant for each. CogLoad: dark mode looks intentional, not an afterthought.

**U042 [Low] Perspective tag color consistency** · palette · src/app/globals.css:106 · S · VT
Now: --accent peach applied ad hoc. Proposed: reserve for the defined Perspective Tag role. CogLoad: the accent keeps a clear meaning.

**U043 [Med] Focus-ring contrast on tinted surfaces** · a11y · src/app/globals.css:124 (--ring) · S · IP X5/VT
Now: indigo ring on secondary tint may miss 4.5:1. Proposed: verify and bump ring contrast. CogLoad: visible focus for everyone, no clutter.

**U044 [Low] Chart palette aligns to brand tokens** · palette · src/app/globals.css:128 · S · VT
Now: chart-1..5 partly ad hoc. Proposed: derive from brand tokens. CogLoad: charts feel part of the system.

**U045 [Low] Selection color contrast** · palette · src/app/globals.css (::selection) · S · VT
Now: selection uses primary. Proposed: verify text contrast on selection. CogLoad: readable highlight, no change otherwise.

**U046 [Low] Document workshop and mystic scoped themes as intentional** · palette · src/app/globals.css (.workshop-theme) · S · VT note
Now: two extra themes read as palette drift. Proposed: a comment marking them intentional per-surface exceptions. CogLoad: keeps the one-theme rule honest without flattening those experiences.

**U047 [Med] Standardize primary CTA to solid, gradient for hero CTA only** · gradient-discipline · src/components/ui/button.tsx:22 · S · VT
Now: gradient variant used for many CTAs. Proposed: solid --primary default, gradient reserved. CogLoad: the gradient CTA becomes the single strongest signal.

**U048 [Low] Use the radius scale, not arbitrary rounded values** · typography · src/app/globals.css:72 · M · IP S1
Now: some rounded-[..] literals. Proposed: radius-sm..4xl tokens. CogLoad: consistent corners, subconscious order.

**U049 [Low] Footer: light divider and token surface** · layout · src/components/layout/footer.tsx · S · VT
Now: compact single row. Proposed: a subtle token divider and surface bg. CogLoad: gentle separation, no added content.

**U050 [Low] Header: backdrop-blur and border-b token consistency** · layout · src/components/layout/Header.tsx · S · VT
Now: blur present. Proposed: confirm border-b uses --border token, consistent blur strength. CogLoad: cohesive chrome.

**U051 [Med] Sentence-case sweep on section headings** · typography · home/about/services · M · VT s5
Now: mixed casing. Proposed: one casing rule. CogLoad: uniform voice.

**U052 [Low] Remove pure black/white in favor of tokens** · palette · grep #000/#fff · M · VT s4
Now: occasional pure hex. Proposed: foreground/background tokens. CogLoad: softer, on-brand neutrals.

---

## State coverage and accessibility (26)

**U053 [Med] Root loading is a spinner, not a skeleton** · loading-state · src/app/loading.tsx · S · rule06/IP
Now: generic branded spinner. Proposed: content-shaped skeleton. CogLoad: preview of structure reduces perceived wait.

**U054 [Med] Reuse PostCardSkeleton in blog loading** · loading-state · src/app/blog/loading.tsx · S · rule06
Now: not reusing the existing skeleton. Proposed: render the PostCard grid skeleton. CogLoad: layout stability, less flash.

**U055 [Med] Add insights loading skeleton** · loading-state · src/app/insights (missing loading.tsx) · S · rule06
Now: no loader, blank flash. Proposed: skeleton matching the insights list. CogLoad: calmer transition. (Quality twin: Q083.)

**U056 [Med] Add forum loading skeleton** · loading-state · src/app/forum (missing) · S · rule06
Now: none. Proposed: forum list skeleton. CogLoad: steadier navigation.

**U057 [Med] Add prompts loading skeleton** · loading-state · src/app/prompts (missing) · S · rule06
Now: none. Proposed: prompt grid skeleton. CogLoad: no blank flash.

**U058 [Low] Add services loading skeleton** · loading-state · src/app/services (missing) · S · rule06
Now: none. Proposed: services skeleton. CogLoad: smoother load.

**U059 [Low] Add repositories/lessons/quiz loaders** · loading-state · src/app/{repositories,lessons,quiz} (missing) · S · rule06
Now: none. Proposed: light skeletons. CogLoad: consistency across list routes.

**U060 [Med] Blog zero-result empty state** · empty-state · src/app/blog/page.tsx · S · UX
Now: no explicit empty UI. Proposed: a friendly empty state with a clear next action. CogLoad: guides rather than confuses on no results.

**U061 [Med] Insights/prompts/tools/videos empty states** · empty-state · list pages · M · UX
Now: none systematized. Proposed: one shared EmptyState component per list. CogLoad: predictable, reassuring.

**U062 [Med] Forum and search no-results states** · empty-state · src/app/forum, search · S · UX
Now: none. Proposed: no-results UI with a suggestion to broaden. CogLoad: reduces dead-end frustration.

**U063 [Low] Profile first-visit empty state** · empty-state · src/app/profile · S · UX
Now: sparse when no activity. Proposed: a welcoming empty state with first-step prompts. CogLoad: onboards gently.

**U064 [Med] Add insights error boundary** · error-state · src/app/insights (missing error.tsx) · S · rule05
Now: falls back to root error. Proposed: route-scoped error.tsx with retry. CogLoad: keeps context, offers recovery. (Quality twin: Q082.)

**U065 [Med] Add forum error boundary** · error-state · src/app/forum (missing) · S · rule05
Now: none. Proposed: forum error.tsx. CogLoad: graceful failure.

**U066 [Med] Add error boundaries: services/about/mystic/profile/prompt-builder/workshop/search** · error-state · those routes (missing) · M · rule05
Now: none. Proposed: route-scoped error.tsx each. CogLoad: local recovery instead of a blank app.

**U067 [Low] error.tsx retry action and reduced-motion** · error-state · all error.tsx · S · IP X1
Now: static error copy. Proposed: a retry button and reduced-motion wrap. CogLoad: clear path forward, no anxious motion.

**U068 [High] MobileNav: aria-label per icon link** · a11y · src/components/layout/MobileNav.tsx:28 · S · IP X3/a11y
Now: icon-only Links, no label. Proposed: aria-label from the existing item.label. CogLoad: screen-reader parity, zero visual change.

**U069 [Med] MobileNav: visible micro-label under each icon** · a11y · src/components/layout/MobileNav.tsx:38 · S · a11y/UX
Now: icon only, discoverability gap. Proposed: a tiny text label under the icon. CogLoad: clearer destinations, still compact.

**U070 [Low] MobileNav: named active-indicator transition** · micro-interaction · src/components/layout/MobileNav.tsx:32 · S · IP A1
Now: transition-all on active swap. Proposed: named transition on the active pill. CogLoad: smoother active cue, no new element.

**U071 [Med] ThemeToggle: respect prefers-color-scheme on first paint** · a11y · src/components/layout/ThemeToggle.tsx:19 · S · UX
Now: defaults to light, ignores the OS setting. Proposed: read prefers-color-scheme when no saved theme. CogLoad: matches user expectation immediately.

**U072 [Med] Icon-only action buttons: aria-label not title** · a11y · src/components/blog/PostCard.tsx · S · IP X4/a11y
Now: some rely on title only. Proposed: aria-label on every icon-only control. CogLoad: assistive parity, no visual cost.

**U073 [Med] Skip-to-content link** · a11y · src/app/layout.tsx · S · a11y
Now: none. Proposed: a visually-hidden skip link before the header. CogLoad: keyboard users jump the nav, invisible to others.

**U074 [Low] Focus-visible on custom interactive divs** · a11y · various · M · IP X4
Now: some clickable divs lack a focus ring. Proposed: focus-visible ring or convert to button. CogLoad: keyboard reachability.

**U075 [Low] Heading-order audit** · a11y · pages · M · a11y
Now: possible h1 to h3 jumps. Proposed: sequential heading levels. CogLoad: coherent document outline for AT.

**U076 [Low] Alt-text completeness on next/image** · a11y · cards/avatars · M · a11y
Now: some decorative/empty alts. Proposed: meaningful alt or alt="" for decorative. CogLoad: correct semantics, no visual change.

**U077 [Low] Reduced-motion wrap on framer entrances above intensity 3** · a11y · home/about sections · M · IP X1
Now: some entrances always animate. Proposed: gate behind prefers-reduced-motion. CogLoad: respects the motion preference (the global neutralizer exists, verify per-component).

**U078 [Low] Tap targets at least 40px on mobile chips** · responsive · blog tags, pills · S · IP X3
Now: some tag chips under 40px. Proposed: min hit area 40px. CogLoad: easier mobile taps.

---

## Restrained delight (26)

**U079 [Med] Scroll-reveal stagger on home sections** · scroll-reveal · src/app/page.tsx sections · M · IP A2/VT
Now: sections pop in flat. Proposed: the existing .stagger-container (100ms group, 12px translate, reduced-motion off). CogLoad: one gentle reveal per section, reuses an existing util, not a new widget.

**U080 [Med] About timeline scroll-reveal** · scroll-reveal · src/components/about/Timeline · M · IP A2
Now: timeline appears static. Proposed: stagger each milestone on scroll. CogLoad: guides reading order, subtle, reduced-motion safe.

**U081 [Med] Blog grid staggered entrance** · scroll-reveal · src/app/blog list · S · IP A2
Now: grid appears at once. Proposed: 80ms per-card stagger. CogLoad: draws the eye across the grid, one motion language.

**U082 [High] Reward: confetti on quest complete** · reward-moment · src/components/conversion/AIQuestJourney · S · reuse canvas-confetti
Now: quest completion is quiet. Proposed: a one-shot confetti burst (existing dep). CogLoad: a single celebratory moment on a real achievement, then gone.

**U083 [Med] Reward: badge-earned micro-celebration** · reward-moment · src/app/profile badges · S · confetti/scale
Now: badges appear without fanfare. Proposed: a scale-in plus soft glow when newly earned. CogLoad: fires once per badge, not persistent.

**U084 [Med] Reward: streak-milestone glow** · reward-moment · src/app/profile streak · S · pulse-glow (existing)
Now: streak counter is plain. Proposed: the existing .pulse-glow at milestones (7, 30). CogLoad: only at milestones, reuses a class.

**U085 [Med] Reward: workshop diploma reveal** · reward-moment · src/app/workshop DiplomaView · M · IP A2
Now: the diploma renders flat. Proposed: a staged reveal (name, rank, seal) on completion. CogLoad: a memorable finish to the class, one-time.

**U086 [Low] Reward: comment-posted success** · reward-moment · src/components/interactive/Comments · S · toast + scale
Now: comment submit is silent. Proposed: a sonner success plus a subtle scale on the new comment. CogLoad: confirms the action, then settles.

**U087 [Med] Hover-delight: extend PostCard shine/tilt to Bots and Prompts cards** · hover-delight · src/components/{bots,prompts} cards · M · IP A1
Now: only PostCard has the shine. Proposed: reuse the same tasteful hover on sibling cards. CogLoad: consistency rewards exploration without new patterns.

**U088 [Low] Hover-delight: QuickAccessGrid tile lift and icon nudge** · hover-delight · src/components/home/QuickAccessGrid · S · IP S2/A1
Now: static tiles. Proposed: a small lift and a 2px icon nudge on hover. CogLoad: playful but tiny, invites clicks.

**U089 [Med] Reading UX: reading-progress on insights** · reading-ux · src/components/interactive/ReadingProgress · S · reuse
Now: progress exists on blog, check insights. Proposed: mount ReadingProgress on the insight reader. CogLoad: orientation aid, one thin bar.

**U090 [Low] Reading UX: smoother TOC active-section highlight** · reading-ux · src/components/interactive/TableOfContents · S · IP A1
Now: active item may jump. Proposed: an interruptible transition on the active marker. CogLoad: smoother orientation, no new element.

**U091 [Low] Reading UX: estimated read-time chip on cards** · reading-ux · src/components/blog/PostCard · S · tabular-nums
Now: read time not always surfaced. Proposed: a small read-time chip (tabular-nums). CogLoad: a helpful signal, tiny footprint.

**U092 [Low] Highlight-to-share micro-animation polish** · hover-delight · src/components/interactive/HighlightShare · S · IP A1
Now: the popover appears abruptly. Proposed: a soft A2 entrance. CogLoad: refined, only on text selection.

**U093 [Med] Keyboard: Ctrl+K palette gains recent and quick actions** · keyboard · src/components/interactive/SearchDialog · M · keyboard
Now: search only. Proposed: recent items and a few quick actions (new comment, toggle theme). CogLoad: power-user shortcut, hidden until invoked, zero default clutter.

**U094 [Low] Keyboard: focus-trap and arrow-nav polish in command** · keyboard · src/components/ui/command.tsx · S · a11y/keyboard
Now: basic nav. Proposed: full focus-trap and arrow/enter parity. CogLoad: keyboard-first users move faster.

**U095 [Low] Loading personality: consistent skeleton shimmer** · loading-personality · skeleton components · S · IP
Now: shimmer applied unevenly. Proposed: the existing .animate-shimmer on all skeletons. CogLoad: coherent loading feel, reuses a util.

**U096 [Low] Page transition: exit shorter than enter** · micro-interaction · src/components/layout/PageTransition · S · IP A3
Now: symmetric transition. Proposed: exit -12px and shorter than enter. CogLoad: snappier navigation, subtle.

**U097 [Low] BackToTop: subtle appear and disappear** · micro-interaction · src/components/ui/scroll-progress.tsx · S · IP A3
Now: hard show/hide at 500px. Proposed: a scale plus fade, reduced-motion safe. CogLoad: gentle, only when scrolled.

**U098 [Low] LiveVisitorCounter: count-up with tabular-nums** · loading-personality · src/components/interactive/LiveVisitorCounter · S · IP T3
Now: number appears static. Proposed: a short count-up (existing AnimatedCounter) with tabular-nums. CogLoad: a small liveliness cue, stable width.

**U099 [Low] SocialProofToast: cadence cap** · reward-moment · src/components/layout/FloatingWidgets · S · cog-load guard
Now: proof toasts can stack. Proposed: a minimum interval so at most one shows at a time. CogLoad: this REDUCES load, prevents notification noise competing with content.

**U100 [Low] CursorTrail: gate on pointer:fine and reduced-motion** · micro-interaction · src/components/effects/CursorTrail · S · IP X1/cog-load
Now: may run on touch or with reduced-motion. Proposed: only on fine pointers with motion allowed. CogLoad: this REMOVES load where it does not belong (mobile, motion-sensitive), keeps the delight only where it lands.

---

## Cognitive-load guard (how this stays light)

- No new persistent chrome: every delight item is either a one-shot moment (confetti, reveal), a reuse of an existing util (.stagger-container, canvas-confetti, AnimatedCounter, pulse-glow), or a removal of noise (U099, U100).
- Motion budget: one motion language per surface, reduced-motion wrapped, exit shorter than enter. The global reduced-motion neutralizer already exists.
- The heaviest wins are invisible: primitive polish (press feel, tabular-nums, text-balance, named transitions) raises perceived quality with zero added elements.
- Two items actively CUT load (U099 toast cadence, U100 cursor-trail gating), balancing the additions.

## Suggested build order (feeds Phase B UI batch)

1. Primitives first (U001-U015): Button/Card/Input/Badge press, transitions, text-balance, tabular-nums. One PR cascades everywhere.
2. ThemeToggle and MobileNav (U016, U017, U068-U071): visible, high-traffic, a11y wins.
3. Palette unify and gradient discipline (U031-U035, U047): coherence without redesign.
4. State coverage (U053-U067): skeletons and error/empty states across routes.
5. Restrained delight (U079-U098) plus the two load-cutters (U099, U100), last, each behind reduced-motion.
