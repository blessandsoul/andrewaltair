"use client";

import { ResourcesSection as ResourcesSectionType } from '@/types/article';
import { TbExternalLink, TbBook, TbTool } from 'react-icons/tb';

interface ResourcesSectionProps {
    section: ResourcesSectionType;
}

export default function ResourcesSection({ section }: ResourcesSectionProps) {
    const getIcon = (name: string) => {
        if (name.includes('წიგნები')) return <TbBook className="w-6 h-6" />;
        return <TbTool className="w-6 h-6" />;
    };

    return (
        <section className="py-12 md:py-20 px-4 md:px-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">რესურსები & ინსტრუმენტები</h2>

            <div className="grid md:grid-cols-2 gap-8">
                {section.categories.map((category, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                {getIcon(category.name)}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                        </div>

                        <div className="space-y-4">
                            {category.items.map((item, itemIdx) => (
                                <a
                                    key={itemIdx}
                                    href={item.link || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block group"
                                >
                                    <div className="flex items-start justify-between gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                                                {item.title}
                                                {item.link && <TbExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                            </h4>
                                            {item.desc && (
                                                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                                            )}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
