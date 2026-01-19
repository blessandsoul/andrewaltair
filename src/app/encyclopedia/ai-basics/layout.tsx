import EncyclopediaSidebar from '@/components/encyclopedia/EncyclopediaSidebar';
import { AI_BASICS_DATA } from '@/data/aiBasicsContent';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white">
            <EncyclopediaSidebar
                sectionTitle="AI საფუძვლები"
                sectionSlug="ai-basics"
                categories={AI_BASICS_DATA.categories}
                gradientFrom="blue-600"
                gradientTo="purple-600"
            />
            <main className="lg:pl-80 min-h-screen transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
