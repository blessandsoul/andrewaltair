'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Check, Circle, ChevronRight, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoadmapPhase {
    id: string;
    title: string;
    duration: string;
    tasks: string[];
    status: 'completed' | 'current' | 'upcoming';
}

const ROADMAP_PHASES: RoadmapPhase[] = [
    {
        id: '1',
        title: 'აღმოჩენა და შეფასება',
        duration: '1-2 კვირა',
        tasks: ['AI მზადყოფნის ტესტი', 'პროცესების აუდიტი', 'გუნდის უნარების შეფასება'],
        status: 'completed'
    },
    {
        id: '2',
        title: 'პილოტური პროექტი',
        duration: '2-4 კვირა',
        tasks: ['ერთი გამოყენების შემთხვევის არჩევა', 'AI ხელსაწყოს ინტეგრაცია', 'გუნდის ტრენინგი'],
        status: 'current'
    },
    {
        id: '3',
        title: 'მასშტაბირება',
        duration: '1-2 თვე',
        tasks: ['წარმატებული პატერნების გავრცელება', 'ახალი გამოყენებების დამატება', 'ROI გაზომვა'],
        status: 'upcoming'
    },
    {
        id: '4',
        title: 'ოპტიმიზაცია',
        duration: 'მიმდინარე',
        tasks: ['უწყვეტი გაუმჯობესება', 'ახალი AI ფუნქციების ინტეგრაცია', 'ავტომატიზაციის გაფართოება'],
        status: 'upcoming'
    },
];

export default function ImplementationRoadmap() {
    const [expandedPhase, setExpandedPhase] = useState<string | null>('2');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Map className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">AI როდმეპი</h2>
                        <p className="text-gray-400 text-sm">შენი AI დანერგვის გეგმა</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                    <Download className="w-4 h-4" />
                    PDF
                </button>
            </div>

            {/* Timeline */}
            <div className="relative pl-8">
                {/* Line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-700" />

                {ROADMAP_PHASES.map((phase, index) => (
                    <motion.div
                        key={phase.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative mb-6 last:mb-0"
                    >
                        {/* Dot */}
                        <div className={cn(
                            "absolute -left-5 w-6 h-6 rounded-full border-2 flex items-center justify-center",
                            phase.status === 'completed'
                                ? "bg-green-600 border-green-600"
                                : phase.status === 'current'
                                    ? "bg-indigo-600 border-indigo-600 animate-pulse"
                                    : "bg-gray-800 border-gray-600"
                        )}>
                            {phase.status === 'completed' ? (
                                <Check className="w-3 h-3 text-white" />
                            ) : phase.status === 'current' ? (
                                <Circle className="w-2 h-2 text-white fill-white" />
                            ) : (
                                <Circle className="w-2 h-2 text-gray-500" />
                            )}
                        </div>

                        {/* Card */}
                        <div
                            className={cn(
                                "p-4 rounded-xl border transition-all cursor-pointer",
                                phase.status === 'current'
                                    ? "border-indigo-500/50 bg-indigo-950/30"
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                            )}
                            onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-white">{phase.title}</h3>
                                        {phase.status === 'current' && (
                                            <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-300 text-xs rounded-full">
                                                მიმდინარე
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm">{phase.duration}</p>
                                </div>
                                <ChevronRight className={cn(
                                    "w-5 h-5 text-gray-500 transition-transform",
                                    expandedPhase === phase.id && "rotate-90"
                                )} />
                            </div>

                            {expandedPhase === phase.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-4 pt-4 border-t border-white/10"
                                >
                                    <ul className="space-y-2">
                                        {phase.tasks.map((task, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    phase.status === 'completed' ? "bg-green-400" : "bg-gray-500"
                                                )} />
                                                {task}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
