# Admin Dashboard Real Stats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all fake/hardcoded data in the admin dashboard with real MongoDB aggregations served from `/api/analytics`.

**Architecture:** Extend `AnalyticsService.getDashboardStats()` to return real weekly chart data, traffic sources from Visitor model, content distribution from Video/Post counts, and recent activity from Activity model. The admin dashboard fetches `/api/analytics` once on mount and replaces all hardcoded constants.

**Tech Stack:** Next.js 14 App Router, TypeScript, Mongoose (MongoDB), Recharts

---

### Task 1: Fix `AnalyticsService.getDashboardStats()` — remove Math.random(), add real reactions

**Files:**
- Modify: `src/services/analytics.service.ts:95-116`

- [ ] **Step 1: Update the `$group` aggregation for daily stats to include reactions**

In `getDashboardStats()`, find the `dailyStats` aggregation (currently lines 95-105). Replace the `$group` stage so it also sums all reaction fields:

```ts
Post.aggregate([
    { $match: { status: 'published' } },
    {
        $group: {
            _id: { $dayOfWeek: '$createdAt' },
            count: { $sum: 1 },
            views: { $sum: '$views' },
            reactions: {
                $sum: {
                    $add: [
                        { $ifNull: ['$reactions.fire', 0] },
                        { $ifNull: ['$reactions.love', 0] },
                        { $ifNull: ['$reactions.mindblown', 0] },
                        { $ifNull: ['$reactions.applause', 0] },
                        { $ifNull: ['$reactions.insightful', 0] },
                    ]
                }
            }
        }
    },
    { $sort: { _id: 1 } }
]),
```

- [ ] **Step 2: Remove Math.random() from weeklyData mapping**

Find the `weeklyData` mapping (lines 109-116). Replace with:

```ts
const weeklyData = dayNames.map((day, i) => {
    const stat = dailyStats.find((s: { _id: number; count: number; views: number; reactions: number }) => s._id === i + 1);
    return {
        day,
        views: stat?.views || 0,
        reactions: stat?.reactions || 0,
    };
});
```

- [ ] **Step 3: Verify the file compiles — run TypeScript check**

```bash
cd "c:/Users/User/Desktop/GITHUB/andrewaltair" && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors related to `analytics.service.ts`

- [ ] **Step 4: Commit**

```bash
cd "c:/Users/User/Desktop/GITHUB/andrewaltair" && git add src/services/analytics.service.ts && git commit -m "fix(analytics): remove Math.random() from weeklyData, use real reactions"
```

---

### Task 2: Add `referrerSources` and `contentDistribution` to `getDashboardStats()`

**Files:**
- Modify: `src/services/analytics.service.ts`

- [ ] **Step 1: Add `Activity` import at top of file (if not already imported)**

Check current imports in `analytics.service.ts` — `Activity` is already imported on line 9. No change needed.

- [ ] **Step 2: Add `referrerSources` and `contentDistribution` aggregations to the `Promise.all` call**

In `getDashboardStats()`, find the large `Promise.all` call (line 69). Add two more parallel queries:

```ts
const [postsViews, videosViews, postsReactions, topPosts, topVideos, recentPosts, dailyStats, referrerAgg, videoTypeAgg] = await Promise.all([
    // ... existing 7 queries unchanged ...
    Visitor.aggregate([
        { $group: { _id: '$referrerSource', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]),
    Video.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
    ]),
]);
```

- [ ] **Step 3: Build `referrerSources` and `contentDistribution` from aggregation results**

After the `weeklyData` mapping, add:

```ts
const totalVisitors = referrerAgg.reduce((sum: number, r: { _id: string; count: number }) => sum + r.count, 0) || 1;
const referrerSources = referrerAgg.map((r: { _id: string; count: number }) => ({
    source: r._id || 'direct',
    visitors: r.count,
    percentage: Math.round((r.count / totalVisitors) * 100),
}));

const videoLong = videoTypeAgg.find((v: { _id: string; count: number }) => v._id === 'long')?.count || 0;
const videoShort = videoTypeAgg.find((v: { _id: string; count: number }) => v._id === 'short')?.count || 0;
const contentDistribution = [
    { name: 'პოსტები', value: postsCount },
    { name: 'ვიდეოები', value: videoLong },
    { name: 'შორტები', value: videoShort },
];
```

- [ ] **Step 4: Add `recentActivity` from Activity model (replace current `recentPosts` usage)**

The current return uses `recentPosts` for `recentActivity`. Replace `recentPosts` query in the `Promise.all` with Activity:

Find the line:
```ts
Post.find({ createdAt: { $gte: weekAgo } })
    .sort({ createdAt: -1 }).limit(10).select('title createdAt views').lean(),
```

Replace it with:
```ts
Activity.find({ isPublic: true })
    .sort({ createdAt: -1 }).limit(5)
    .select('type targetTitle createdAt')
    .lean(),
```

Update the destructuring accordingly (rename `recentPosts` → `recentActivities`).

- [ ] **Step 5: Update the `return` statement to include new fields and fix `recentActivity` mapping**

```ts
return {
    stats: {
        posts: postsCount,
        videos: videosCount,
        users: usersCount,
        comments: commentsCount,
        totalViews,
        totalReactions,
    },
    weeklyData,
    topPosts: topPosts.map((p: { title: string; slug: string; views?: number }) => ({
        title: p.title, slug: p.slug, views: p.views || 0,
    })),
    topVideos: topVideos.map((v: { title: string; youtubeId: string; views?: number }) => ({
        title: v.title, youtubeId: v.youtubeId, views: v.views || 0,
    })),
    recentActivity: recentActivities.map((a: { type: string; targetTitle?: string; createdAt: Date }) => ({
        type: a.type,
        targetTitle: a.targetTitle || '',
        createdAt: a.createdAt,
    })),
    contentDistribution,
    referrerSources,
};
```

- [ ] **Step 6: TypeScript check**

```bash
cd "c:/Users/User/Desktop/GITHUB/andrewaltair" && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors

- [ ] **Step 7: Commit**

```bash
cd "c:/Users/User/Desktop/GITHUB/andrewaltair" && git add src/services/analytics.service.ts && git commit -m "feat(analytics): add referrerSources, contentDistribution, real recentActivity to getDashboardStats"
```

---

### Task 3: Update admin dashboard — add `analyticsData` state and fetch

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: Add `AnalyticsData` interface after the existing interfaces (after line ~52)**

After the `VideoData` interface, add:

```ts
interface ActivityItem {
    type: string
    targetTitle: string
    createdAt: string
}

interface ReferrerSource {
    source: string
    visitors: number
    percentage: number
}

interface ContentDistributionItem {
    name: string
    value: number
}

interface AnalyticsData {
    stats: {
        posts: number
        videos: number
        users: number
        comments: number
        totalViews: number
        totalReactions: number
    }
    weeklyData: Array<{ day: string; views: number; reactions: number }>
    topPosts: Array<{ title: string; slug: string; views: number }>
    topVideos: Array<{ title: string; youtubeId: string; views: number }>
    recentActivity: ActivityItem[]
    contentDistribution: ContentDistributionItem[]
    referrerSources: ReferrerSource[]
}
```

- [ ] **Step 2: Add `analyticsData` state in the component (after `isLoading` state, around line 187)**

```ts
const [analyticsData, setAnalyticsData] = React.useState<AnalyticsData | null>(null)
```

- [ ] **Step 3: Add `/api/analytics` fetch to the existing `fetchData` useEffect**

Find the existing `fetchData` function (lines 190-214). Add the analytics fetch inside the same `Promise.all`:

```ts
const [postsRes, videosRes, analyticsRes] = await Promise.all([
    fetch('/api/posts?limit=1000'),
    fetch('/api/videos?limit=1000'),
    fetch('/api/analytics'),
])

if (postsRes.ok) {
    const postsJson = await postsRes.json()
    setPostsData(postsJson.posts || [])
}

if (videosRes.ok) {
    const videosJson = await videosRes.json()
    setVideosData(videosJson.videos || [])
}

if (analyticsRes.ok) {
    const analyticsJson = await analyticsRes.json()
    setAnalyticsData(analyticsJson.data || null)
}
```

- [ ] **Step 4: TypeScript check**

```bash
cd "c:/Users/User/Desktop/GITHUB/andrewaltair" && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
cd "c:/Users/User/Desktop/GITHUB/andrewaltair" && git add src/app/admin/page.tsx && git commit -m "feat(dashboard): add analyticsData state and fetch /api/analytics"
```

---

### Task 4: Remove fake hardcoded constants from dashboard

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: Remove the hardcoded `recentActivity` constant (lines 151-156)**

Delete the entire block:
```ts
// Mock activity data
const recentActivity = [
    { type: "comment", message: "ახალი კომენტარი პოსტზე", time: "5 წთ წინ", icon: TbMessage },
    { type: "view", message: "+500 ნახვა ბოლო საათში", time: "1 სთ წინ", icon: TbEye },
    { type: "trending", message: "პოსტი გახდა trending", time: "2 სთ წინ", icon: TbFlame },
    { type: "reaction", message: "+50 ახალი რეაქცია", time: "3 სთ წინ", icon: TbHeart },
]
```

- [ ] **Step 2: Remove the hardcoded `viewsData` constant (lines 159-167)**

Delete:
```ts
// Chart data
const viewsData = [
    { name: "ორშ", views: 4000, reactions: 2400 },
    { name: "სამ", views: 3000, reactions: 1398 },
    { name: "ოთხ", views: 2000, reactions: 9800 },
    { name: "ხუთ", views: 2780, reactions: 3908 },
    { name: "პარ", views: 1890, reactions: 4800 },
    { name: "შაბ", views: 2390, reactions: 3800 },
    { name: "კვი", views: 3490, reactions: 4300 },
]
```

- [ ] **Step 3: Remove the hardcoded `contentDistribution` constant (lines 169-174)**

Delete:
```ts
const contentDistribution = [
    { name: "პოსტები", value: 45, color: "#6366f1" },
    { name: "ვიდეოები", value: 30, color: "#ef4444" },
    { name: "შორტები", value: 15, color: "#22c55e" },
    { name: "სხვა", value: 10, color: "#f59e0b" },
]
```

- [ ] **Step 4: Remove the hardcoded `trafficSources` constant (lines 176-181)**

Delete:
```ts
const trafficSources = [
    { source: "Google", visitors: 4500, percentage: 45 },
    { source: "Direct", visitors: 2800, percentage: 28 },
    { source: "Social", visitors: 1500, percentage: 15 },
    { source: "Referral", visitors: 1200, percentage: 12 },
]
```

- [ ] **Step 5: Remove `liveStats` state and its `setInterval` useEffect**

Remove state declaration:
```ts
const [liveStats, setLiveStats] = React.useState({ views: 0, reactions: 0 })
```

Remove the entire `useEffect` block:
```ts
// Real-time updates simulation
React.useEffect(() => {
    if (!isLive) return
    const interval = setInterval(() => {
        setLiveStats(prev => ({
            views: prev.views + Math.floor(Math.random() * 10),
            reactions: prev.reactions + Math.floor(Math.random() * 3)
        }))
    }, 3000)
    return () => clearInterval(interval)
}, [isLive])
```

- [ ] **Step 6: Remove `systemHealth` state and the `systemHealth` widget from `defaultWidgets`**

Remove state:
```ts
const [systemHealth] = React.useState({
    serverStatus: "online" as "online" | "offline" | "warning",
    responseTime: 45,
    memoryUsage: 68,
    diskSpace: 42,
    lastBackup: "2024-12-28 15:30",
    activeSessions: 24
})
```

In `defaultWidgets` array, remove the entry:
```ts
{ id: "systemHealth", type: "systemHealth", title: "სისტემის სტატუსი", visible: true, order: 6, size: "medium" },
```

Also remove `"systemHealth"` from the `WidgetType` union type.

- [ ] **Step 7: Fix `getStats()` — remove the fake multiplier**

Find `getStats()` (lines 55-81). Replace with:

```ts
function getStats(postsData: Post[], videosData: VideoData[]) {
    const totalPosts = postsData.length
    const totalVideos = videosData.length
    const featuredPosts = postsData.filter(p => p.featured).length
    const trendingPosts = postsData.filter(p => p.trending).length

    return {
        totalPosts,
        totalVideos,
        featuredPosts,
        trendingPosts,
    }
}
```

(totalViews and totalReactions now come from `analyticsData.stats`)

- [ ] **Step 8: Update `getStats` call — remove `dateRange` argument**

Find the line:
```ts
const stats = getStats(postsData, videosData, dateRange)
```
Change to:
```ts
const stats = getStats(postsData, videosData)
```

- [ ] **Step 9: TypeScript check**

```bash
cd "c:/Users/User/Desktop/GITHUB/andrewaltair" && npx tsc --noEmit 2>&1 | head -30
```

Expected: errors about removed variables being referenced in `statCards` and widgets — these will be fixed in Task 5.

- [ ] **Step 10: Commit**

```bash
cd "c:/Users/User/Desktop/GITHUB/andrewaltair" && git add src/app/admin/page.tsx && git commit -m "refactor(dashboard): remove all hardcoded fake data constants"
```

---

### Task 5: Wire real data into stat cards and charts widgets

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: Update `statCards` to use `analyticsData.stats` for views and reactions**

Find the `statCards` array (around line 469). Update the views and reactions cards:

```ts
const statCards = [
    {
        title: "პოსტები",
        value: stats.totalPosts,
        icon: <TbFileText className="w-5 h-5" />,
        color: "from-blue-500 to-indigo-500",
        bgColor: "bg-blue-500",
        badge: `${stats.featuredPosts} featured`,
        href: "/admin/posts"
    },
    {
        title: "ვიდეოები",
        value: stats.totalVideos,
        icon: <TbVideo className="w-5 h-5" />,
        color: "from-red-500 to-pink-500",
        bgColor: "bg-red-500",
        badge: `${videosData.filter(v => v.type === "short").length} shorts`,
        href: "/admin/videos"
    },
    {
        title: "ნახვები",
        value: formatNumber(analyticsData?.stats.totalViews || 0),
        icon: <TbEye className="w-5 h-5" />,
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-500",
        badge: "ჯამური",
        href: "/admin/analytics"
    },
    {
        title: "რეაქციები",
        value: formatNumber(analyticsData?.stats.totalReactions || 0),
        icon: <TbHeart className="w-5 h-5" />,
        color: "from-orange-500 to-amber-500",
        bgColor: "bg-orange-500",
        badge: `${stats.trendingPosts} trending`,
        href: "/admin/analytics"
    }
]
```

- [ ] **Step 2: Update the line chart to use `analyticsData.weeklyData`**

In `renderWidget`, find the `charts` case. Replace `data={viewsData}` with:

```ts
<RechartsLineChart data={analyticsData?.weeklyData || []}>
    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
    <Tooltip
        contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px"
        }}
    />
    <Legend />
    <Line type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} name="ნახვები" />
    <Line type="monotone" dataKey="reactions" stroke="#22c55e" strokeWidth={2} name="რეაქციები" />
</RechartsLineChart>
```

Note: `dataKey` changes from `"name"` to `"day"` since `weeklyData` uses `day` not `name`.

- [ ] **Step 3: Update the pie chart to use `analyticsData.contentDistribution`**

Define colors inline since they're no longer on the data object. Replace the pie chart section:

```ts
const PIE_COLORS = ["#6366f1", "#ef4444", "#22c55e", "#f59e0b"]

// Inside renderWidget charts case, replace the Pie section:
const pieData = analyticsData?.contentDistribution || []
```

Then in JSX:
```tsx
<RechartsPieChart>
    <Pie
        data={pieData}
        cx="50%"
        cy="50%"
        innerRadius={40}
        outerRadius={70}
        paddingAngle={2}
        dataKey="value"
    >
        {pieData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
        ))}
    </Pie>
    <Tooltip />
    <Legend />
</RechartsPieChart>
```

- [ ] **Step 4: TypeScript check**

```bash
cd "c:/Users/User/Desktop/GITHUB/andrewaltair" && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors in the charts section

- [ ] **Step 5: Commit**

```bash
cd "c:/Users/User/Desktop/GITHUB/andrewaltair" && git add src/app/admin/page.tsx && git commit -m "feat(dashboard): wire real weeklyData and contentDistribution into charts"
```

---

### Task 6: Wire real data into activity, traffic sources, and remove systemHealth widget render

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: Add activity type → icon/message mapping before `renderWidget`**

Add this constant before the `renderWidget` function:

```ts
const ACTIVITY_ICON_MAP: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
    page_view: { icon: TbEye, label: "გვერდი ნახეს" },
    comment: { icon: TbMessage, label: "ახალი კომენტარი" },
    reaction: { icon: TbHeart, label: "ახალი რეაქცია" },
    share: { icon: TbShare, label: "გაზიარება" },
    subscribe: { icon: TbStar, label: "გამოწერა" },
    signup: { icon: TbUsers, label: "რეგისტრაცია" },
    purchase: { icon: TbBolt, label: "შეძენა" },
    achievement: { icon: TbSparkles, label: "მიღწევა" },
    download: { icon: TbDownload, label: "ჩამოტვირთვა" },
    search: { icon: TbSearch, label: "ძებნა" },
}
const DEFAULT_ACTIVITY = { icon: TbActivity, label: "აქტივობა" }
```

- [ ] **Step 2: Update the `activity` widget case to use `analyticsData.recentActivity`**

Replace the entire `case "activity":` block with:

```tsx
case "activity":
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    <TbTrendingUp className="w-4 h-4 text-green-500" />
                    აქტივობა
                </CardTitle>
            </CardHeader>
            <CardContent className={`${compactView ? "p-3" : "p-6"} space-y-4`}>
                {(analyticsData?.recentActivity || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">აქტივობა არ არის</p>
                ) : (analyticsData?.recentActivity || []).slice(0, 4).map((activity, i) => {
                    const mapping = ACTIVITY_ICON_MAP[activity.type] || DEFAULT_ACTIVITY
                    const IconComponent = mapping.icon
                    const timeAgo = new Date(activity.createdAt).toLocaleDateString('ka-GE', { month: 'short', day: 'numeric' })
                    return (
                        <div key={i} className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <IconComponent className="w-3 h-3" />
                            </div>
                            <div>
                                <p className="text-sm">{mapping.label}{activity.targetTitle ? `: ${activity.targetTitle}` : ''}</p>
                                <p className="text-xs text-muted-foreground">{timeAgo}</p>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
```

- [ ] **Step 3: Update the `topContent` widget — replace `trafficSources` with `analyticsData.referrerSources`**

In `case "topContent":`, find the "Traffic Sources" section. Replace:

```tsx
{trafficSources.map((source, i) => (
```

With:

```tsx
{(analyticsData?.referrerSources || []).map((source, i) => (
    <div key={i} className="space-y-1">
        <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
                <TbMapPin className="w-3 h-3" />
                {source.source}
            </span>
            <span>{source.percentage}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                style={{ width: `${source.percentage}%` }}
            />
        </div>
    </div>
))}
```

- [ ] **Step 4: Remove the entire `systemHealth` widget render case**

Delete the entire `case "systemHealth":` block (lines 817-901) from `renderWidget`.

- [ ] **Step 5: Remove `isLive` state and the Live button from the `dateFilter` widget**

Remove state: `const [isLive, setIsLive] = React.useState(true)`

In `case "dateFilter":`, remove the Live/Paused button:
```tsx
<button
    onClick={() => setIsLive(!isLive)}
    className={...}
>
    ...
</button>
```

- [ ] **Step 6: Remove unused imports**

Remove from the imports line: `TbServer`, `TbDeviceSdCard`, `TbWifi`, `TbWifiOff`, `TbCircleCheck`, `TbAlertTriangle`, `TbCircleX` (only if not used elsewhere in the file).

Check with grep:
```bash
cd "c:/Users/User/Desktop/GITHUB/andrewaltair" && grep -n "TbServer\|TbDeviceSdCard\|TbWifi\|TbWifiOff\|TbCircleCheck\|TbAlertTriangle\|TbCircleX" src/app/admin/page.tsx
```

Remove from the import statement any that no longer appear in the file.

- [ ] **Step 7: Final TypeScript check**

```bash
cd "c:/Users/User/Desktop/GITHUB/andrewaltair" && npx tsc --noEmit 2>&1 | head -50
```

Expected: no errors

- [ ] **Step 8: Final commit**

```bash
cd "c:/Users/User/Desktop/GITHUB/andrewaltair" && git add src/app/admin/page.tsx && git commit -m "feat(dashboard): wire real activity, traffic sources; remove systemHealth widget"
```
