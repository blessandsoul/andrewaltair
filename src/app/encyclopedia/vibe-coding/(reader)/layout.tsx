import VibeReaderSidebar from '@/components/vibe-coding/VibeReaderSidebar';

export default function VibeCodingReaderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
            <VibeReaderSidebar />

            {/* Main Content */}
            <main className="flex-1 lg:ml-0">
                {children}
            </main>
        </div>
    );
}
