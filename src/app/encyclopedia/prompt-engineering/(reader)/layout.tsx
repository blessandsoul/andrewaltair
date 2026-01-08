import EncyclopediaSidebar from "@/components/encyclopedia/EncyclopediaSidebar";
import { PROMPT_ENGINEERING_DATA } from "@/data/promptEngineeringContent";

export default function PromptEngineeringReaderLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
            <EncyclopediaSidebar
                sectionTitle="Prompt Engineering"
                sectionSlug="prompt-engineering"
                categories={PROMPT_ENGINEERING_DATA.categories}
                gradientFrom="violet-500"
                gradientTo="purple-500"
            />
            <main className="flex-1 lg:ml-80 min-h-screen w-full transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
