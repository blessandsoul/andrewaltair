import EncyclopediaSidebar from "@/components/encyclopedia/EncyclopediaSidebar";
import { AI_CAREER_DATA } from "@/data/aiCareerContent";

export default function AICareerReaderLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
            <EncyclopediaSidebar sectionTitle="AI კარიერა" sectionSlug="ai-career" categories={AI_CAREER_DATA.categories} gradientFrom="pink-500" gradientTo="rose-500" />
            <main className="flex-1 lg:ml-80 min-h-screen w-full transition-all duration-300">{children}</main>
        </div>
    );
}
