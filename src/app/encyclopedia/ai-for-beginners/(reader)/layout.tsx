import AIForBeginnersSidebar from '@/components/courses/ai-for-beginners/AIForBeginnersSidebar';

export default function AIForBeginnersReaderLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white flex">
            <AIForBeginnersSidebar />
            <main className="flex-1 min-w-0">{children}</main>
        </div>
    );
}
