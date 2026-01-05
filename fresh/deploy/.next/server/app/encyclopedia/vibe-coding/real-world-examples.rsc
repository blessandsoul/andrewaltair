2:I[18824,["231","static/chunks/231-d33f309be8e332f1.js","8478","static/chunks/app/encyclopedia/vibe-coding/%5Bslug%5D/page-96ea38fe7e03da37.js"],"default"]
4:I[18824,["231","static/chunks/231-d33f309be8e332f1.js","8478","static/chunks/app/encyclopedia/vibe-coding/%5Bslug%5D/page-96ea38fe7e03da37.js"],"BreadcrumbSchema"]
5:I[231,["231","static/chunks/231-d33f309be8e332f1.js","8478","static/chunks/app/encyclopedia/vibe-coding/%5Bslug%5D/page-96ea38fe7e03da37.js"],""]
6:I[39275,[],""]
8:I[61343,[],""]
9:I[71471,["6950","static/chunks/f8025e75-3056e1a2c2a8fbb6.js","8534","static/chunks/8534-54613ac0ba1d36bb.js","231","static/chunks/231-d33f309be8e332f1.js","7441","static/chunks/7441-847fde7bb992c760.js","4459","static/chunks/4459-e785fd5bbd692cef.js","4440","static/chunks/4440-17c558523ec44342.js","4965","static/chunks/4965-7a22803bb4be2cb9.js","7616","static/chunks/7616-d4eef2775488fe78.js","3185","static/chunks/app/layout-ae7495b055fbcd2d.js"],"AuthProvider"]
a:I[71885,["6950","static/chunks/f8025e75-3056e1a2c2a8fbb6.js","8534","static/chunks/8534-54613ac0ba1d36bb.js","231","static/chunks/231-d33f309be8e332f1.js","7441","static/chunks/7441-847fde7bb992c760.js","4459","static/chunks/4459-e785fd5bbd692cef.js","4440","static/chunks/4440-17c558523ec44342.js","4965","static/chunks/4965-7a22803bb4be2cb9.js","7616","static/chunks/7616-d4eef2775488fe78.js","3185","static/chunks/app/layout-ae7495b055fbcd2d.js"],"ToastProvider"]
b:I[28913,["6950","static/chunks/f8025e75-3056e1a2c2a8fbb6.js","8534","static/chunks/8534-54613ac0ba1d36bb.js","231","static/chunks/231-d33f309be8e332f1.js","7441","static/chunks/7441-847fde7bb992c760.js","4459","static/chunks/4459-e785fd5bbd692cef.js","4440","static/chunks/4440-17c558523ec44342.js","4965","static/chunks/4965-7a22803bb4be2cb9.js","7616","static/chunks/7616-d4eef2775488fe78.js","3185","static/chunks/app/layout-ae7495b055fbcd2d.js"],"ConfirmDialogProvider"]
c:I[66815,["6950","static/chunks/f8025e75-3056e1a2c2a8fbb6.js","8534","static/chunks/8534-54613ac0ba1d36bb.js","231","static/chunks/231-d33f309be8e332f1.js","7441","static/chunks/7441-847fde7bb992c760.js","4459","static/chunks/4459-e785fd5bbd692cef.js","4440","static/chunks/4440-17c558523ec44342.js","4965","static/chunks/4965-7a22803bb4be2cb9.js","7616","static/chunks/7616-d4eef2775488fe78.js","3185","static/chunks/app/layout-ae7495b055fbcd2d.js"],"LayoutWrapper"]
d:I[34845,["6950","static/chunks/f8025e75-3056e1a2c2a8fbb6.js","8534","static/chunks/8534-54613ac0ba1d36bb.js","231","static/chunks/231-d33f309be8e332f1.js","7601","static/chunks/app/error-495608e6e0b1519b.js"],"default"]
e:I[18709,["6950","static/chunks/f8025e75-3056e1a2c2a8fbb6.js","8534","static/chunks/8534-54613ac0ba1d36bb.js","231","static/chunks/231-d33f309be8e332f1.js","9160","static/chunks/app/not-found-96ee3f74e4ebb5df.js"],"default"]
f:I[6297,["6950","static/chunks/f8025e75-3056e1a2c2a8fbb6.js","8534","static/chunks/8534-54613ac0ba1d36bb.js","231","static/chunks/231-d33f309be8e332f1.js","7441","static/chunks/7441-847fde7bb992c760.js","4459","static/chunks/4459-e785fd5bbd692cef.js","4440","static/chunks/4440-17c558523ec44342.js","4965","static/chunks/4965-7a22803bb4be2cb9.js","7616","static/chunks/7616-d4eef2775488fe78.js","3185","static/chunks/app/layout-ae7495b055fbcd2d.js"],"CookieBanner"]
10:I[83482,["6950","static/chunks/f8025e75-3056e1a2c2a8fbb6.js","8534","static/chunks/8534-54613ac0ba1d36bb.js","231","static/chunks/231-d33f309be8e332f1.js","7441","static/chunks/7441-847fde7bb992c760.js","4459","static/chunks/4459-e785fd5bbd692cef.js","4440","static/chunks/4440-17c558523ec44342.js","4965","static/chunks/4965-7a22803bb4be2cb9.js","7616","static/chunks/7616-d4eef2775488fe78.js","3185","static/chunks/app/layout-ae7495b055fbcd2d.js"],"GoogleAnalytics"]
3:T18fd,# 🏗️ რეალური პროექტების მაგალითები

> როგორ ავაშენოთ production-ready აპლიკაციები Vibe Coding-ით

---

## 📱 პროექტი 1: SaaS Dashboard

### მიზანი
Analytics dashboard subscription-based SaaS-ისთვის

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS, shadcn/ui
- **Backend**: Supabase (Auth + DB)
- **Charts**: Recharts
- **Payments**: Stripe

### ეტაპები

#### 1. პროექტის ინიციალიზაცია (5 წთ)
```bash
npx create-next-app@latest saas-dashboard --typescript --tailwind --app
cd saas-dashboard
npx shadcn-ui@latest init
```

#### 2. Authentication Setup (15 წთ)
**პრომპტი Claude-ს**:
```
"შექმენი Supabase authentication setup:
1. Login page with email/password
2. Signup page with email verification
3. Protected routes middleware
4. User session management

გამოიყენე @supabase/ssr და Next.js 14 App Router.
დაამატე error handling და loading states."
```

#### 3. Dashboard Layout (20 წთ)
```
"შექმენი dashboard layout:
- Sidebar navigation
- Top header with user menu
- Main content area
- Responsive design (mobile drawer)

გამოიყენე shadcn/ui კომპონენტები.
მაგალითი: https://ui.shadcn.com/examples/dashboard"
```

#### 4. Analytics Components (30 წთ)
```
"შექმენი analytics კომპონენტები:
1. Stats cards (Revenue, Users, Growth)
2. Line chart (Monthly revenue)
3. Bar chart (User acquisition)
4. Table (Recent transactions)

გამოიყენე Recharts ბიბლიოთეკა.
დაამატე loading skeletons."
```

#### 5. Subscription Management (45 წთ)
```
"დააინტეგრირე Stripe:
1. Pricing page with plans
2. Checkout session creation
3. Webhook handling
4. Subscription status check
5. Cancel/upgrade flows

გამოიყენე @stripe/stripe-js.
დაამატე error handling."
```

### სრული დრო: **~2 საათი**

---

## 🛒 პროექტი 2: E-Commerce Store

### მიზანი
სრული ფუნქციური online მაღაზია

### Tech Stack
- **Frontend**: Next.js 14, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Supabase
- **Payments**: Stripe
- **Images**: Cloudinary

### ეტაპები

#### 1. Products Catalog (30 წთ)
```
"შექმენი products catalog:
- Grid layout (responsive)
- Product card component
- Filters (category, price, rating)
- Search functionality
- Pagination

მონაცემები Supabase-დან."
```

#### 2. Product Details (25 წთ)
```
"შექმენი product details page:
- Image gallery with zoom
- Product info (title, price, description)
- Variants selector (size, color)
- Add to cart button
- Related products

გამოიყენე dynamic routes [slug]."
```

#### 3. Shopping Cart (40 წთ)
```
"შექმენი shopping cart:
- Cart sidebar/drawer
- Add/remove/update items
- Quantity controls
- Price calculation
- Persist in localStorage
- Cart badge in header"
```

#### 4. Checkout Flow (60 წთ)
```
"შექმენი checkout process:
1. Shipping information form
2. Payment method selection
3. Order summary
4. Stripe payment integration
5. Order confirmation page
6. Email notification

დაამატე form validation (Zod)."
```

#### 5. Admin Panel (90 წთ)
```
"შექმენი admin panel:
- Products CRUD
- Orders management
- Inventory tracking
- Analytics dashboard
- Image upload (Cloudinary)

დაამატე role-based access control."
```

### სრული დრო: **~4 საათი**

---

## 📝 პროექტი 3: Blog Platform

### მიზანი
Modern blog platform MDX support-ით

### Tech Stack
- **Framework**: Next.js 14
- **Content**: MDX, Contentlayer
- **Styling**: TailwindCSS
- **Comments**: Giscus
- **Analytics**: Vercel Analytics

### ეტაპები

#### 1. MDX Setup (20 წთ)
```
"დააკონფიგურირე Contentlayer:
- MDX files in /content/posts
- Frontmatter schema (title, date, tags)
- Auto-generated slugs
- Reading time calculation
- Syntax highlighting (shiki)"
```

#### 2. Blog Homepage (25 წთ)
```
"შექმენი blog homepage:
- Hero section
- Featured posts (3 cards)
- All posts grid
- Search bar
- Tags filter
- Newsletter signup"
```

#### 3. Post Page (30 წთ)
```
"შექმენი blog post page:
- MDX content rendering
- Table of contents
- Author info
- Share buttons
- Related posts
- Comments (Giscus)
- Reading progress bar"
```

#### 4. Advanced Features (45 წთ)
```
"დაამატე:
- Full-text search (Algolia/Fuse.js)
- RSS feed generation
- Sitemap
- SEO optimization
- Open Graph images
- Dark mode toggle"
```

### სრული დრო: **~2 საათი**

---

## 💡 საერთო რჩევები

### 1. დაიწყეთ MVP-თი
პირველ დღეს შექმენით ძირითადი ფუნქციონალი, მერე დაამატეთ დანარჩენი.

### 2. გამოიყენეთ არსებული UI ბიბლიოთეკები
- shadcn/ui
- Headless UI
- Radix UI
- DaisyUI

### 3. არ გამოიგონოთ ბორბალი
გამოიყენეთ დადასტურებული ბიბლიოთეკები:
- Authentication: NextAuth.js, Supabase Auth
- Forms: React Hook Form + Zod
- State: Zustand, Jotai
- Data fetching: TanStack Query

### 4. Deploy ადრე და ხშირად
- Vercel (Next.js)
- Netlify (Static sites)
- Railway (Full-stack)

---

## 🎯 დასკვნა

Vibe Coding-ით შეგიძლიათ production-ready აპლიკაციის შექმნა **საათებში**, არა კვირებში!

გასაღები: **სწორი პრომპტები + სწორი ინსტრუმენტები + სწორი სტრატეგია**7:["slug","real-world-examples","d"]
0:["_GdnXl9j6HwnqD_on-vpJ",[[["",{"children":["encyclopedia",{"children":["vibe-coding",{"children":[["slug","real-world-examples","d"],{"children":["__PAGE__?{\"slug\":\"real-world-examples\"}",{}]}]}]}]},"$undefined","$undefined",true],["",{"children":["encyclopedia",{"children":["vibe-coding",{"children":[["slug","real-world-examples","d"],{"children":["__PAGE__",{},[["$L1",["$","div",null,{"className":"min-h-screen bg-background text-foreground pb-20","children":[["$","$L2",null,{"title":"რეალური პროექტების მაგალითები","description":" 🏗️ რეალური პროექტების მაგალითები\n\n> როგორ ავაშენოთ production-ready აპლიკაციები Vibe Coding-ით\n\n---\n\n 📱 პროექტი 1: SaaS Dashboard\n\n მიზანი\nAnalytics da...","author":{"name":"Andrew Altair"},"datePublished":"2026-01-05T12:22:57.789Z","url":"https://andrewaltair.ge/encyclopedia/vibe-coding/real-world-examples","articleBody":"$3","headline":"რეალური პროექტების მაგალითები","image":"https://andrewaltair.ge/encyclopedia/vibe-coding/real-world-examples/opengraph-image"}],["$","$L4",null,{"items":[{"name":"Encyclopedia","url":"https://andrewaltair.ge/encyclopedia"},{"name":"Vibe Coding","url":"https://andrewaltair.ge/encyclopedia/vibe-coding"},{"name":"რეალური პროექტების მაგალითები","url":"https://andrewaltair.ge/encyclopedia/vibe-coding/real-world-examples"}]}],["$","div",null,{"className":"sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border","children":["$","div",null,{"className":"container max-w-4xl mx-auto px-4 h-16 flex items-center","children":["$","$L5",null,{"href":"/encyclopedia/vibe-coding","className":"flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","width":20,"height":20,"fill":"currentColor","viewBox":"0 0 256 256","transform":"$undefined","children":[false,"$undefined",["$","path",null,{"d":"M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"}]]}],["$","span",null,{"children":"უკან ბიბლიოთეკაში"}]]}]}]}],["$","main",null,{"className":"container max-w-4xl mx-auto px-4 py-12","children":["$","article",null,{"className":"prose prose-lg dark:prose-invert max-w-none","children":[["$","h1",null,{"children":"რეალური პროექტების მაგალითები"}],[["$","h1","h1-0",{"children":"🏗️ რეალური პროექტების მაგალითები"}],"\n",["$","blockquote","blockquote-0",{"children":["\n",["$","p","p-0",{"children":"როგორ ავაშენოთ production-ready აპლიკაციები Vibe Coding-ით"}],"\n"]}],"\n",["$","hr","hr-0",{}],"\n",["$","h2","h2-0",{"children":"📱 პროექტი 1: SaaS Dashboard"}],"\n",["$","h3","h3-0",{"children":"მიზანი"}],"\n",["$","p","p-0",{"children":"Analytics dashboard subscription-based SaaS-ისთვის"}],"\n",["$","h3","h3-1",{"children":"Tech Stack"}],"\n",["$","ul","ul-0",{"children":["\n",["$","li","li-0",{"children":[["$","strong","strong-0",{"children":"Frontend"}],": Next.js 14, React 18, TypeScript"]}],"\n",["$","li","li-1",{"children":[["$","strong","strong-0",{"children":"Styling"}],": TailwindCSS, shadcn/ui"]}],"\n",["$","li","li-2",{"children":[["$","strong","strong-0",{"children":"Backend"}],": Supabase (Auth + DB)"]}],"\n",["$","li","li-3",{"children":[["$","strong","strong-0",{"children":"Charts"}],": Recharts"]}],"\n",["$","li","li-4",{"children":[["$","strong","strong-0",{"children":"Payments"}],": Stripe"]}],"\n"]}],"\n",["$","h3","h3-2",{"children":"ეტაპები"}],"\n",["$","h4","h4-0",{"children":"1. პროექტის ინიციალიზაცია (5 წთ)"}],"\n",["$","pre","pre-0",{"children":["$","div",null,{"style":{"color":"#d4d4d4","fontSize":"13px","textShadow":"none","fontFamily":"Menlo, Monaco, Consolas, \"Andale Mono\", \"Ubuntu Mono\", \"Courier New\", monospace","direction":"ltr","textAlign":"left","whiteSpace":"pre","wordSpacing":"normal","wordBreak":"normal","lineHeight":"1.5","MozTabSize":"4","OTabSize":"4","tabSize":"4","WebkitHyphens":"none","MozHyphens":"none","msHyphens":"none","hyphens":"none","padding":"1em","margin":".5em 0","overflow":"auto","background":"#1e1e1e"},"children":["$","code",null,{"className":"language-bash","style":{"whiteSpace":"pre","color":"#d4d4d4","fontSize":"13px","textShadow":"none","fontFamily":"Menlo, Monaco, Consolas, \"Andale Mono\", \"Ubuntu Mono\", \"Courier New\", monospace","direction":"ltr","textAlign":"left","wordSpacing":"normal","wordBreak":"normal","lineHeight":"1.5","MozTabSize":"4","OTabSize":"4","tabSize":"4","WebkitHyphens":"none","MozHyphens":"none","msHyphens":"none","hyphens":"none"},"children":[false,[["$","span","code-segment-0",{"className":"$undefined","style":{},"children":["npx create-next-app@latest saas-dashboard "]}],["$","span","code-segment-1",{"className":"token","style":{"color":"#9cdcfe"},"children":["--typescript"]}],["$","span","code-segment-2",{"className":"$undefined","style":{},"children":[" "]}],["$","span","code-segment-3",{"className":"token","style":{"color":"#9cdcfe"},"children":["--tailwind"]}],["$","span","code-segment-4",{"className":"$undefined","style":{},"children":[" "]}],["$","span","code-segment-5",{"className":"token","style":{"color":"#9cdcfe"},"children":["--app"]}],["$","span","code-segment-6",{"className":"$undefined","style":{},"children":["\n"]}],["$","span","code-segment-7",{"className":"$undefined","style":{},"children":[""]}],["$","span","code-segment-8",{"className":"token","style":{"color":"#4ec9b0"},"children":["cd"]}],["$","span","code-segment-9",{"className":"$undefined","style":{},"children":[" saas-dashboard\n"]}],"npx shadcn-ui@latest init"]]}]}]}],"\n",["$","h4","h4-1",{"children":"2. Authentication Setup (15 წთ)"}],"\n",["$","p","p-1",{"children":[["$","strong","strong-0",{"children":"პრომპტი Claude-ს"}],":"]}],"\n",["$","pre","pre-1",{"children":["$","code",null,{"className":"$undefined","children":"\"შექმენი Supabase authentication setup:\n1. Login page with email/password\n2. Signup page with email verification\n3. Protected routes middleware\n4. User session management\n\nგამოიყენე @supabase/ssr და Next.js 14 App Router.\nდაამატე error handling და loading states.\"\n"}]}],"\n",["$","h4","h4-2",{"children":"3. Dashboard Layout (20 წთ)"}],"\n",["$","pre","pre-2",{"children":["$","code",null,{"className":"$undefined","children":"\"შექმენი dashboard layout:\n- Sidebar navigation\n- Top header with user menu\n- Main content area\n- Responsive design (mobile drawer)\n\nგამოიყენე shadcn/ui კომპონენტები.\nმაგალითი: https://ui.shadcn.com/examples/dashboard\"\n"}]}],"\n",["$","h4","h4-3",{"children":"4. Analytics Components (30 წთ)"}],"\n",["$","pre","pre-3",{"children":["$","code",null,{"className":"$undefined","children":"\"შექმენი analytics კომპონენტები:\n1. Stats cards (Revenue, Users, Growth)\n2. Line chart (Monthly revenue)\n3. Bar chart (User acquisition)\n4. Table (Recent transactions)\n\nგამოიყენე Recharts ბიბლიოთეკა.\nდაამატე loading skeletons.\"\n"}]}],"\n",["$","h4","h4-4",{"children":"5. Subscription Management (45 წთ)"}],"\n",["$","pre","pre-4",{"children":["$","code",null,{"className":"$undefined","children":"\"დააინტეგრირე Stripe:\n1. Pricing page with plans\n2. Checkout session creation\n3. Webhook handling\n4. Subscription status check\n5. Cancel/upgrade flows\n\nგამოიყენე @stripe/stripe-js.\nდაამატე error handling.\"\n"}]}],"\n",["$","h3","h3-3",{"children":["სრული დრო: ",["$","strong","strong-0",{"children":"~2 საათი"}]]}],"\n",["$","hr","hr-1",{}],"\n",["$","h2","h2-1",{"children":"🛒 პროექტი 2: E-Commerce Store"}],"\n",["$","h3","h3-4",{"children":"მიზანი"}],"\n",["$","p","p-2",{"children":"სრული ფუნქციური online მაღაზია"}],"\n",["$","h3","h3-5",{"children":"Tech Stack"}],"\n",["$","ul","ul-1",{"children":["\n",["$","li","li-0",{"children":[["$","strong","strong-0",{"children":"Frontend"}],": Next.js 14, TypeScript"]}],"\n",["$","li","li-1",{"children":[["$","strong","strong-0",{"children":"Styling"}],": TailwindCSS"]}],"\n",["$","li","li-2",{"children":[["$","strong","strong-0",{"children":"Backend"}],": Supabase"]}],"\n",["$","li","li-3",{"children":[["$","strong","strong-0",{"children":"Payments"}],": Stripe"]}],"\n",["$","li","li-4",{"children":[["$","strong","strong-0",{"children":"Images"}],": Cloudinary"]}],"\n"]}],"\n",["$","h3","h3-6",{"children":"ეტაპები"}],"\n",["$","h4","h4-5",{"children":"1. Products Catalog (30 წთ)"}],"\n",["$","pre","pre-5",{"children":["$","code",null,{"className":"$undefined","children":"\"შექმენი products catalog:\n- Grid layout (responsive)\n- Product card component\n- Filters (category, price, rating)\n- Search functionality\n- Pagination\n\nმონაცემები Supabase-დან.\"\n"}]}],"\n",["$","h4","h4-6",{"children":"2. Product Details (25 წთ)"}],"\n",["$","pre","pre-6",{"children":["$","code",null,{"className":"$undefined","children":"\"შექმენი product details page:\n- Image gallery with zoom\n- Product info (title, price, description)\n- Variants selector (size, color)\n- Add to cart button\n- Related products\n\nგამოიყენე dynamic routes [slug].\"\n"}]}],"\n",["$","h4","h4-7",{"children":"3. Shopping Cart (40 წთ)"}],"\n",["$","pre","pre-7",{"children":["$","code",null,{"className":"$undefined","children":"\"შექმენი shopping cart:\n- Cart sidebar/drawer\n- Add/remove/update items\n- Quantity controls\n- Price calculation\n- Persist in localStorage\n- Cart badge in header\"\n"}]}],"\n",["$","h4","h4-8",{"children":"4. Checkout Flow (60 წთ)"}],"\n",["$","pre","pre-8",{"children":["$","code",null,{"className":"$undefined","children":"\"შექმენი checkout process:\n1. Shipping information form\n2. Payment method selection\n3. Order summary\n4. Stripe payment integration\n5. Order confirmation page\n6. Email notification\n\nდაამატე form validation (Zod).\"\n"}]}],"\n",["$","h4","h4-9",{"children":"5. Admin Panel (90 წთ)"}],"\n",["$","pre","pre-9",{"children":["$","code",null,{"className":"$undefined","children":"\"შექმენი admin panel:\n- Products CRUD\n- Orders management\n- Inventory tracking\n- Analytics dashboard\n- Image upload (Cloudinary)\n\nდაამატე role-based access control.\"\n"}]}],"\n",["$","h3","h3-7",{"children":["სრული დრო: ",["$","strong","strong-0",{"children":"~4 საათი"}]]}],"\n",["$","hr","hr-2",{}],"\n",["$","h2","h2-2",{"children":"📝 პროექტი 3: Blog Platform"}],"\n",["$","h3","h3-8",{"children":"მიზანი"}],"\n",["$","p","p-3",{"children":"Modern blog platform MDX support-ით"}],"\n",["$","h3","h3-9",{"children":"Tech Stack"}],"\n",["$","ul","ul-2",{"children":["\n",["$","li","li-0",{"children":[["$","strong","strong-0",{"children":"Framework"}],": Next.js 14"]}],"\n",["$","li","li-1",{"children":[["$","strong","strong-0",{"children":"Content"}],": MDX, Contentlayer"]}],"\n",["$","li","li-2",{"children":[["$","strong","strong-0",{"children":"Styling"}],": TailwindCSS"]}],"\n",["$","li","li-3",{"children":[["$","strong","strong-0",{"children":"Comments"}],": Giscus"]}],"\n",["$","li","li-4",{"children":[["$","strong","strong-0",{"children":"Analytics"}],": Vercel Analytics"]}],"\n"]}],"\n",["$","h3","h3-10",{"children":"ეტაპები"}],"\n",["$","h4","h4-10",{"children":"1. MDX Setup (20 წთ)"}],"\n",["$","pre","pre-10",{"children":["$","code",null,{"className":"$undefined","children":"\"დააკონფიგურირე Contentlayer:\n- MDX files in /content/posts\n- Frontmatter schema (title, date, tags)\n- Auto-generated slugs\n- Reading time calculation\n- Syntax highlighting (shiki)\"\n"}]}],"\n",["$","h4","h4-11",{"children":"2. Blog Homepage (25 წთ)"}],"\n",["$","pre","pre-11",{"children":["$","code",null,{"className":"$undefined","children":"\"შექმენი blog homepage:\n- Hero section\n- Featured posts (3 cards)\n- All posts grid\n- Search bar\n- Tags filter\n- Newsletter signup\"\n"}]}],"\n",["$","h4","h4-12",{"children":"3. Post Page (30 წთ)"}],"\n",["$","pre","pre-12",{"children":["$","code",null,{"className":"$undefined","children":"\"შექმენი blog post page:\n- MDX content rendering\n- Table of contents\n- Author info\n- Share buttons\n- Related posts\n- Comments (Giscus)\n- Reading progress bar\"\n"}]}],"\n",["$","h4","h4-13",{"children":"4. Advanced Features (45 წთ)"}],"\n",["$","pre","pre-13",{"children":["$","code",null,{"className":"$undefined","children":"\"დაამატე:\n- Full-text search (Algolia/Fuse.js)\n- RSS feed generation\n- Sitemap\n- SEO optimization\n- Open Graph images\n- Dark mode toggle\"\n"}]}],"\n",["$","h3","h3-11",{"children":["სრული დრო: ",["$","strong","strong-0",{"children":"~2 საათი"}]]}],"\n",["$","hr","hr-3",{}],"\n",["$","h2","h2-3",{"children":"💡 საერთო რჩევები"}],"\n",["$","h3","h3-12",{"children":"1. დაიწყეთ MVP-თი"}],"\n",["$","p","p-4",{"children":"პირველ დღეს შექმენით ძირითადი ფუნქციონალი, მერე დაამატეთ დანარჩენი."}],"\n",["$","h3","h3-13",{"children":"2. გამოიყენეთ არსებული UI ბიბლიოთეკები"}],"\n",["$","ul","ul-3",{"children":["\n",["$","li","li-0",{"children":"shadcn/ui"}],"\n",["$","li","li-1",{"children":"Headless UI"}],"\n",["$","li","li-2",{"children":"Radix UI"}],"\n",["$","li","li-3",{"children":"DaisyUI"}],"\n"]}],"\n",["$","h3","h3-14",{"children":"3. არ გამოიგონოთ ბორბალი"}],"\n",["$","p","p-5",{"children":"გამოიყენეთ დადასტურებული ბიბლიოთეკები:"}],"\n",["$","ul","ul-4",{"children":["\n",["$","li","li-0",{"children":"Authentication: NextAuth.js, Supabase Auth"}],"\n",["$","li","li-1",{"children":"Forms: React Hook Form + Zod"}],"\n",["$","li","li-2",{"children":"State: Zustand, Jotai"}],"\n",["$","li","li-3",{"children":"Data fetching: TanStack Query"}],"\n"]}],"\n",["$","h3","h3-15",{"children":"4. Deploy ადრე და ხშირად"}],"\n",["$","ul","ul-5",{"children":["\n",["$","li","li-0",{"children":"Vercel (Next.js)"}],"\n",["$","li","li-1",{"children":"Netlify (Static sites)"}],"\n",["$","li","li-2",{"children":"Railway (Full-stack)"}],"\n"]}],"\n",["$","hr","hr-4",{}],"\n",["$","h2","h2-4",{"children":"🎯 დასკვნა"}],"\n",["$","p","p-6",{"children":["Vibe Coding-ით შეგიძლიათ production-ready აპლიკაციის შექმნა ",["$","strong","strong-0",{"children":"საათებში"}],", არა კვირებში!"]}],"\n",["$","p","p-7",{"children":["გასაღები: ",["$","strong","strong-0",{"children":"სწორი პრომპტები + სწორი ინსტრუმენტები + სწორი სტრატეგია"}]]}]]]}]}]]}]],null],null]},["$","$L6",null,{"parallelRouterKey":"children","segmentPath":["children","encyclopedia","children","vibe-coding","children","$7","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L8",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined","styles":null}],null]},["$","$L6",null,{"parallelRouterKey":"children","segmentPath":["children","encyclopedia","children","vibe-coding","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L8",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined","styles":null}],null]},["$","$L6",null,{"parallelRouterKey":"children","segmentPath":["children","encyclopedia","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L8",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined","styles":null}],null]},[["$","html",null,{"lang":"ka","suppressHydrationWarning":true,"children":[["$","head",null,{"children":[["$","script",null,{"dangerouslySetInnerHTML":{"__html":"\n              (function() {\n                try {\n                  var theme = localStorage.getItem('theme');\n                  if (theme === 'dark') {\n                    document.documentElement.classList.add('dark');\n                  }\n                  // Light theme is default, no action needed\n                } catch (e) {}\n              })();\n            "}}],["$","script",null,{"type":"application/ld+json","dangerouslySetInnerHTML":{"__html":"{\"@context\":\"https://schema.org\",\"@type\":\"Person\",\"name\":\"Andrew Altair\",\"url\":\"https://andrewaltair.ge\",\"jobTitle\":\"AI Expert & Tech Consultant\",\"nationality\":{\"@type\":\"Country\",\"name\":\"Georgia\"},\"homeLocation\":{\"@type\":\"Place\",\"name\":\"Tbilisi, Georgia\"},\"areaServed\":{\"@type\":\"Country\",\"name\":\"Georgia\"},\"sameAs\":[\"https://www.youtube.com/@AndrewAltair\",\"https://www.instagram.com/andr3waltair/\",\"https://www.tiktok.com/@andrewaltair\",\"https://t.me/andr3waltairchannel\",\"https://www.facebook.com/andr3waltair\",\"https://www.threads.net/@andr3waltair\",\"https://x.com/andr3waltair\",\"https://www.linkedin.com/in/andrewaltair\"],\"worksFor\":{\"@type\":\"Organization\",\"name\":\"Andrew Altair AI\",\"location\":\"Tbilisi, Georgia\"}}"}}]]}],["$","body",null,{"className":"__variable_f367f3 __variable_3c557b __variable_af1a1c antialiased font-georgian","suppressHydrationWarning":true,"children":[["$","$L9",null,{"children":["$","$La",null,{"children":["$","$Lb",null,{"children":[["$","$Lc",null,{"children":["$","$L6",null,{"parallelRouterKey":"children","segmentPath":["children"],"error":"$d","errorStyles":[],"errorScripts":[],"template":["$","$L8",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":["$","$Le",null,{}],"notFoundStyles":[],"styles":null}]}],["$","$Lf",null,{}]]}]}]}],["$","$L10",null,{"GA_MEASUREMENT_ID":""}]]}]]}],null],[["$","div",null,{"className":"min-h-screen flex items-center justify-center bg-background","children":["$","div",null,{"className":"text-center space-y-4","children":[["$","div",null,{"className":"relative inline-block","children":[["$","div",null,{"className":"absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-xl opacity-50 animate-pulse"}],["$","div",null,{"className":"relative w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center animate-pulse","children":["$","svg",null,{"stroke":"currentColor","fill":"none","strokeWidth":"2","viewBox":"0 0 24 24","strokeLinecap":"round","strokeLinejoin":"round","className":"w-8 h-8 text-white","children":["$undefined",[["$","path","0",{"d":"M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z","children":[]}]]],"style":{"color":"$undefined"},"height":"1em","width":"1em","xmlns":"http://www.w3.org/2000/svg"}]}]]}],["$","div",null,{"className":"space-y-2","children":[["$","p",null,{"className":"text-lg font-medium text-foreground","children":"იტვირთება..."}],["$","div",null,{"className":"w-48 h-1 bg-secondary rounded-full overflow-hidden mx-auto","children":["$","div",null,{"className":"h-full bg-gradient-to-r from-primary to-accent rounded-full animate-loading-bar"}]}]]}]]}]}],[],[]]],[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/18b3adca04a426f2.css","precedence":"next","crossOrigin":"$undefined"}],["$","link","1",{"rel":"stylesheet","href":"/_next/static/css/0a3698005d644b6e.css","precedence":"next","crossOrigin":"$undefined"}]],"$L11"]]]]
11:[["$","meta","0",{"name":"viewport","content":"width=device-width, initial-scale=1"}],["$","meta","1",{"charSet":"utf-8"}],["$","title","2",{"children":"რეალური პროექტების მაგალითები | Vibe Coding"}],["$","meta","3",{"name":"description","content":" 🏗️ რეალური პროექტების მაგალითები\n\n> როგორ ავაშენოთ production-ready აპლიკაციები Vibe Coding-ით\n\n---\n\n 📱 პროექტი 1: SaaS Dashboard\n\n მიზანი\nAnalytics da..."}],["$","meta","4",{"name":"author","content":"Andrew Altair"}],["$","link","5",{"rel":"manifest","href":"/manifest.webmanifest","crossOrigin":"use-credentials"}],["$","meta","6",{"name":"keywords","content":"AI Expert Georgia,Andrew Altair,Tech News Tbilisi,Artificial Intelligence Georgia,ხელოვნური ინტელექტი,ტექნოლოგიები,Vibe Coding,AI,ChatGPT,მანქანური სწავლება,ნეირონული ქსელები,საქართველო"}],["$","meta","7",{"name":"creator","content":"Andrew Altair"}],["$","meta","8",{"name":"robots","content":"index, follow"}],["$","meta","9",{"property":"og:title","content":"რეალური პროექტების მაგალითები"}],["$","meta","10",{"property":"og:description","content":" 🏗️ რეალური პროექტების მაგალითები\n\n> როგორ ავაშენოთ production-ready აპლიკაციები Vibe Coding-ით\n\n---\n\n 📱 პროექტი 1: SaaS Dashboard\n\n მიზანი\nAnalytics da..."}],["$","meta","11",{"property":"og:image:alt","content":"Vibe Coding Article"}],["$","meta","12",{"property":"og:image:type","content":"image/png"}],["$","meta","13",{"property":"og:image","content":"http://localhost:3000/encyclopedia/vibe-coding/real-world-examples/opengraph-image?d5b1cc30cf04bf3d"}],["$","meta","14",{"property":"og:image:width","content":"1200"}],["$","meta","15",{"property":"og:image:height","content":"630"}],["$","meta","16",{"property":"og:type","content":"article"}],["$","meta","17",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","18",{"name":"twitter:creator","content":"@andrewaltair"}],["$","meta","19",{"name":"twitter:title","content":"რეალური პროექტების მაგალითები"}],["$","meta","20",{"name":"twitter:description","content":" 🏗️ რეალური პროექტების მაგალითები\n\n> როგორ ავაშენოთ production-ready აპლიკაციები Vibe Coding-ით\n\n---\n\n 📱 პროექტი 1: SaaS Dashboard\n\n მიზანი\nAnalytics da..."}],["$","meta","21",{"name":"twitter:image:alt","content":"Vibe Coding Article"}],["$","meta","22",{"name":"twitter:image:type","content":"image/png"}],["$","meta","23",{"name":"twitter:image","content":"http://localhost:3000/encyclopedia/vibe-coding/real-world-examples/opengraph-image?d5b1cc30cf04bf3d"}],["$","meta","24",{"name":"twitter:image:width","content":"1200"}],["$","meta","25",{"name":"twitter:image:height","content":"630"}],["$","link","26",{"rel":"icon","href":"/favicon.ico","type":"image/x-icon","sizes":"16x16"}]]
1:null
