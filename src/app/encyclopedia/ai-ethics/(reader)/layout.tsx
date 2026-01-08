import EncyclopediaSidebar from "@/components/encyclopedia/EncyclopediaSidebar";
import { AI_ETHICS_DATA } from "@/data/aiEthicsContent";

export default function AIEthicsReaderLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
            <EncyclopediaSidebar sectionTitle="AI ეთიკა" sectionSlug="ai-ethics" categories={AI_ETHICS_DATA.categories} gradientFrom="red-500" gradientTo="orange-500" />
            <main className="flex-1 lg:ml-80 min-h-screen w-full transition-all duration-300">{children}</main>
        </div>
    );
}
