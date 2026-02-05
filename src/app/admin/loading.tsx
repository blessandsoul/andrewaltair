export default function AdminLoading() {
    return (
        <div className="min-h-screen flex">
            {/* Sidebar Skeleton */}
            <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card p-4 space-y-6">
                {/* Logo Area */}
                <div className="flex items-center gap-3 px-2 py-4">
                    <div className="w-10 h-10 bg-muted rounded-xl animate-pulse" />
                    <div className="h-5 w-28 bg-muted rounded animate-pulse" />
                </div>

                {/* Navigation Items */}
                <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                            <div className="w-5 h-5 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="mt-auto space-y-2">
                    <div className="h-px bg-border" />
                    <div className="flex items-center gap-3 px-3 py-2.5">
                        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                        <div className="space-y-1">
                            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-8 space-y-8">
                {/* Top Bar */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="h-7 w-40 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-56 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="flex gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
                        <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
                            </div>
                            <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                            <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                        <div className="h-5 w-36 bg-muted rounded animate-pulse" />
                        <div className="h-64 bg-muted rounded-lg animate-pulse" />
                    </div>
                    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                        <div className="h-64 bg-muted rounded-lg animate-pulse" />
                    </div>
                </div>

                {/* Recent Content Table */}
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="h-5 w-40 bg-muted rounded animate-pulse" />
                        <div className="h-9 w-24 bg-muted rounded-lg animate-pulse" />
                    </div>
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                                <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
                                <div className="flex-1 space-y-1">
                                    <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                                    <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                                </div>
                                <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                                <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
