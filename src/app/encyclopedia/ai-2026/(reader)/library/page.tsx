import type { Metadata } from 'next';
import { TbRocket } from 'react-icons/tb';

export const metadata: Metadata = {
    title: 'AI 2026 სტატიები - მომავლის გზამკვლევი | Andrew Altair',
    description: 'AI 2026: კაცობრიობის დიდი ფილტრი და სხვა ფუტურისტული სტატიები.',
    keywords: ['AI 2026', 'Future', 'Human 2.0', 'სტატიები'],
    openGraph: {
        title: 'AI 2026 სტატიები - მომავლის გზამკვლევი',
        description: 'AI 2026: კაცობრიობის დიდი ფილტრი და სხვა ფუტურისტული სტატიები.',
        type: 'website',
    }
};

export default function AI2026LibraryPage() {
    return (
        <div className="flex items-center justify-center p-6 lg:p-12 min-h-[50vh] mt-20 lg:mt-0">
            <div className="text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                    <TbRocket size={48} className="text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold mb-3 tracking-tight">აირჩიეთ სტატია</h2>
                <p className="text-muted-foreground max-w-sm mx-auto text-lg">
                    აირჩიეთ სასურველი თემა მარცხენა მენიუდან კითხვის დასაწყებად
                </p>
            </div>
        </div>
    );
}
