import LoopsReaderSidebar from '@/components/loops/LoopsReaderSidebar';

export default function LoopsReaderLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white flex">
            <LoopsReaderSidebar />
            <main className="flex-1 lg:ml-0">{children}</main>
        </div>
    );
}
