import VibeReaderSidebar from "@/components/vibe-coding/VibeReaderSidebar";

export default function ReaderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#050510] text-white flex flex-col lg:flex-row">
            {/* Sidebar - Persistent Navigation */}
            <VibeReaderSidebar />

            {/* Main Content Area */}
            {/* lg:ml-80 creates space for the fixed sidebar on desktop */}
            <main className="flex-1 lg:ml-80 min-h-screen w-full transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
