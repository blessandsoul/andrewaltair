import EncyclopediaSidebar from "@/components/encyclopedia/EncyclopediaSidebar";
import { AI_AUTOMATION_DATA } from "@/data/aiAutomationContent";

export default function AIAutomationReaderLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
            <EncyclopediaSidebar sectionTitle="AI ავტომატიზაცია" sectionSlug="ai-automation" categories={AI_AUTOMATION_DATA.categories} gradientFrom="blue-500" gradientTo="cyan-500" />
            <main className="flex-1 lg:ml-80 min-h-screen w-full transition-all duration-300">{children}</main>
        </div>
    );
}
