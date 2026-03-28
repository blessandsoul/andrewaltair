# Admin Dashboard Real Stats — Design Spec
Date: 2026-03-28

## Problem
The admin dashboard shows fake/hardcoded data: random multipliers for date filtering, hardcoded chart data, mock activity feed, mock traffic sources, and simulated live stats via Math.random().

## Goal
Replace all fake data with real MongoDB aggregations. One API endpoint, one fetch, all widgets use real data.

## Architecture

```
AnalyticsService.getDashboardStats()  ← extended
        ↓
GET /api/analytics                    ← already exists
        ↓
AdminDashboard useEffect              ← single fetch on mount
        ↓
All widgets read from analyticsData state
```

## Changes

### 1. `src/services/analytics.service.ts`

**Fix weeklyData** — remove Math.random(), add real reactions per day:
- `$dayOfWeek` group now includes `reactions: { $sum: { $add: [...all reaction fields] } }`
- Missing days return `{ views: 0, reactions: 0 }`

**Add `referrerSources`** — aggregate Visitor.referrerSource:
```ts
Visitor.aggregate([
  { $group: { _id: '$referrerSource', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```
Returns: `[{ source: 'direct', visitors: N }, ...]`

**Add `contentDistribution`** — real post/video type counts:
- Posts count (already have postsCount)
- Videos by type: `Video.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }])`
- Returns: `[{ name: 'პოსტები', value: N }, { name: 'ვიდეოები (Long)', value: N }, { name: 'შორტები', value: N }]`

**Add `recentActivity`** — from Activity model (already exists):
```ts
Activity.find({ isPublic: true })
  .sort({ createdAt: -1 }).limit(5)
  .select('type targetTitle createdAt')
```

### 2. `src/app/api/analytics/route.ts`
No changes needed — already returns `getDashboardStats()` result.

### 3. `src/app/admin/page.tsx`

**Remove:**
- Hardcoded constants: `viewsData`, `contentDistribution`, `trafficSources`, `recentActivity`
- Fake multiplier in `getStats()` date filtering
- `liveStats` state + `setInterval` with Math.random()
- `systemHealth` widget from `defaultWidgets`

**Add:**
- `analyticsData` state with type matching API response
- `fetch('/api/analytics')` in existing useEffect alongside posts/videos fetch
- Pass `analyticsData.weeklyData` to charts
- Pass `analyticsData.referrerSources` to traffic widget
- Pass `analyticsData.contentDistribution` to pie chart
- Pass `analyticsData.recentActivity` to activity widget

**Keep:**
- posts/videos fetch (used for top content widget and search)
- `getStats()` but without the multiplier — just real counts from loaded data

## API Response Shape

```ts
interface DashboardStatsResponse {
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
  recentActivity: Array<{ type: string; targetTitle: string; createdAt: Date }>
  contentDistribution: Array<{ name: string; value: number }>
  referrerSources: Array<{ source: string; visitors: number }>
}
```

## Out of Scope
- Date range filtering for charts (requires separate API params — future work)
- Real-time live stats (requires WebSocket — future work)
- systemHealth widget (no server metrics available)
