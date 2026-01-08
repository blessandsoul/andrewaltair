import EncyclopediaSidebar from "@/components/encyclopedia/EncyclopediaSidebar";
import { AI_TOOLS_DATA } from "@/data/aiToolsContent";

export default function AIToolsReaderLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
            <EncyclopediaSidebar sectionTitle="AI ინსტრუმენტები" sectionSlug="ai-tools" categories={AI_TOOLS_DATA.categories} gradientFrom="orange-500" gradientTo="amber-500" />
            <main className="flex-1 lg:ml-80 min-h-screen w-full transition-all duration-300">{children}</main>
        </div>
    );
}
