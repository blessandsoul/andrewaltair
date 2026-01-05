'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TbCalculator, TbCurrencyDollar, TbTrendingUp, TbClock, TbUsers, TbSparkles } from "react-icons/tb";
import { cn } from '@/lib/utils';

export default function SavingsCalculator() {
    const [employees, setEmployees] = useState(10);
    const [hoursPerWeek, setHoursPerWeek] = useState(5);
    const [hourlyRate, setHourlyRate] = useState(25);

    // Calculate savings
    const weeklyHours = employees * hoursPerWeek;
    const monthlyHours = weeklyHours * 4;
    const yearlyHours = weeklyHours * 52;

    // AI typically saves 50-70% of time on repetitive tasks
    const savingsPercent = 0.6;
    const savedHoursYearly = yearlyHours * savingsPercent;
    const savedMoneyYearly = savedHoursYearly * hourlyRate;

    // ROI calculation (assuming $500/month AI tools cost)
    const aiToolCost = 500 * 12;
    const roi = ((savedMoneyYearly - aiToolCost) / aiToolCost * 100).toFixed(0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                    <TbCalculator className="w-6 h-6 text-green-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">დანაზოგის კალკულატორი</h2>
                    <p className="text-gray-400 text-sm">გაიგე რამდენს დაზოგავ AI-ით</p>
                </div>
            </div>

            {/* Inputs */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Employees */}
                <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <TbUsers className="w-4 h-4" />
                        თანამშრომლები
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={employees}
                        onChange={(e) => setEmployees(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="text-2xl font-bold text-white mt-2">{employees}</div>
                </div>

                {/* Hours per week */}
                <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <TbClock className="w-4 h-4" />
                        საათი/კვირა ამოცანებზე
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="40"
                        value={hoursPerWeek}
                        onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="text-2xl font-bold text-white mt-2">{hoursPerWeek} სთ</div>
                </div>

                {/* Hourly rate */}
                <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <TbCurrencyDollar className="w-4 h-4" />
                        საათობრივი ტარიფი
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="text-2xl font-bold text-white mt-2">${hourlyRate}/სთ</div>
                </div>
            </div>

            {/* Results */}
            <div className="grid gap-4 md:grid-cols-3">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 text-center"
                >
                    <TbClock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white mb-1">
                        {savedHoursYearly.toLocaleString()}
                    </div>
                    <div className="text-green-300 text-sm">დაზოგილი საათი/წელი</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 text-center"
                >
                    <TbCurrencyDollar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white mb-1">
                        ${savedMoneyYearly.toLocaleString()}
                    </div>
                    <div className="text-purple-300 text-sm">დანაზოგი/წელი</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 text-center"
                >
                    <TbTrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white mb-1">
                        {roi}%
                    </div>
                    <div className="text-yellow-300 text-sm">ROI</div>
                </motion.div>
            </div>

            {/* CTA */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <TbSparkles className="w-6 h-6 text-purple-400" />
                    <div>
                        <div className="font-semibold text-white">მზად ხარ AI-სთვის?</div>
                        <div className="text-gray-400 text-sm">დაიწყე დღესვე უფასო კონსულტაციით</div>
                    </div>
                </div>
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                    კონსულტაცია
                </button>
            </div>
        </div>
    );
}
