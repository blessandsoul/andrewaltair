
import AI2026Sidebar from '@/components/ai-2026/AI2026Sidebar';

export default function AI2026ReaderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
            <AI2026Sidebar />

            {/* Main Content */}
            <main className="flex-1 lg:ml-0">
                {children}
            </main>
        </div>
    );
}
