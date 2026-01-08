import EncyclopediaSidebar from "@/components/encyclopedia/EncyclopediaSidebar";
import { AI_MONETIZATION_DATA } from "@/data/aiMonetizationContent";

export default function AIMonetizationReaderLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
            <EncyclopediaSidebar
                sectionTitle="AI მონეტიზაცია"
                sectionSlug="ai-monetization"
                categories={AI_MONETIZATION_DATA.categories}
                gradientFrom="green-500"
                gradientTo="emerald-500"
            />
            <main className="flex-1 lg:ml-80 min-h-screen w-full transition-all duration-300">{children}</main>
        </div>
    );
}
