'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TbCoin, TbClick, TbChartBar, TbCopy, TbPlus, TbLink, TbLoader, TbAlertCircle } from "react-icons/tb";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AffiliateLink {
    _id: string;
    code: string;
    campaign?: string;
    clicks: number;
    conversions: number;
    totalRevenue: number;
    createdAt: string;
}

interface AffiliateStats {
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
    activeLinks: number;
}

export default function AffiliateDashboard() {
    const [stats, setStats] = useState<AffiliateStats | null>(null);
    const [links, setLinks] = useState<AffiliateLink[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [campaign, setCampaign] = useState('');
    const [customCode, setCustomCode] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, linksRes] = await Promise.all([
                fetch('/api/bots/affiliates/stats'),
                fetch('/api/bots/affiliates/links')
            ]);

            const statsData = await statsRes.json();
            const linksData = await linksRes.json();

            setStats(statsData.stats);
            setLinks(linksData.links || []);
        } catch (error) {
            console.error("Failed to load affiliate data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateLink = async () => {
        if (isCreating) return;
        setIsCreating(true);


        try {
            const res = await fetch('/api/bots/affiliates/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaign: campaign || undefined,
                    customCode: customCode || undefined
                })
            });

            if (res.ok) {
                setCampaign('');
                setCustomCode('');
                fetchData(); // Refresh list
            } else {
                alert("Failed to create link. Code might be taken.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsCreating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Show toast or feedback here if desired
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <TbLoader className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pt-20 pb-12 px-4">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500">
                            პარტნიორული პროგრამა
                        </h1>
                        <p className="text-muted-foreground mt-1">მართე შენი ბმულები და გამოიმუშავე საკომისიო</p>
                    </div>
                    <Button onClick={fetchData} variant="outline" size="sm">
                        განახლება
                    </Button>
                </div>

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard
                            title="სულ შემოსავალი"
                            value={`₾${stats.totalRevenue.toFixed(2)}`}
                            icon={<TbCoin className="w-6 h-6 text-amber-500" />}
                            gradient="from-amber-500/10 to-orange-500/10"
                            borderColor="border-amber-500/20"
                        />
                        <StatsCard
                            title="კონვერსია"
                            value={stats.totalConversions.toString()}
                            icon={<TbChartBar className="w-6 h-6 text-emerald-500" />}
                            gradient="from-emerald-500/10 to-green-500/10"
                            borderColor="border-emerald-500/20"
                        />
                        <StatsCard
                            title="კლიკები"
                            value={stats.totalClicks.toString()}
                            icon={<TbClick className="w-6 h-6 text-blue-500" />}
                            gradient="from-blue-500/10 to-cyan-500/10"
                            borderColor="border-blue-500/20"
                        />
                        <StatsCard
                            title="აქტიური ბმულები"
                            value={stats.activeLinks.toString()}
                            icon={<TbLink className="w-6 h-6 text-violet-500" />}
                            gradient="from-violet-500/10 to-purple-500/10"
                            borderColor="border-violet-500/20"
                        />
                    </div>
                )}

                {/* Create Link Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border p-6 rounded-2xl shadow-sm"
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <TbPlus className="w-5 h-5 text-primary" />
                        ახალი ბმულის შექმნა
                    </h2>
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">კამპანიის სახელი (არასავალდებულო)</label>
                            <Input
                                placeholder="მაგ: Instagram Bio"
                                value={campaign}
                                onChange={(e) => setCampaign(e.target.value)}
                                className="bg-background"
                            />
                        </div>
                        <div className="flex-1 w-full space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">უნიკალური კოდი (არასავალდებულო)</label>
                            <Input
                                placeholder="მაგ: SUPER_PROMO"
                                value={customCode}
                                onChange={(e) => setCustomCode(e.target.value)}
                                className="bg-background"
                            />
                        </div>
                        <Button
                            onClick={handleCreateLink}
                            disabled={isCreating}
                            className="w-full md:w-auto min-w-[140px] bg-primary text-primary-foreground font-bold"
                        >
                            {isCreating ? <TbLoader className="w-4 h-4 animate-spin" /> : "შექმნა"}
                        </Button>
                    </div>
                </motion.div>

                {/* Links List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">შენი ბმულები</h2>
                    {links.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl bg-muted/20">
                            <TbLink className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                            <p className="text-muted-foreground">ჯერ არ გაქვს შექმნილი ბმულები</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {links.map((link) => (
                                <motion.div
                                    key={link._id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-card border border-border p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-primary/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-mono font-bold text-lg text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                {link.code}
                                            </span>
                                            {link.campaign && (
                                                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                                                    {link.campaign}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            შეიქმნა: {new Date(link.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-center">
                                            <div className="font-bold">{link.clicks}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase">კლიკები</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-emerald-500">{link.conversions}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase">გაყიდვები</div>
                                        </div>
                                        <div className="text-center w-24">
                                            <div className="font-bold text-amber-500">₾{link.totalRevenue.toFixed(2)}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase">შემოსავალი</div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(`${window.location.origin}?ref=${link.code}`)}
                                        className="w-full md:w-auto"
                                    >
                                        <TbCopy className="w-4 h-4 mr-2" />
                                        Copy Link
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, gradient, borderColor }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    gradient: string;
    borderColor: string;
}) {
    return (
        <div className={`p-6 rounded-2xl border ${borderColor} bg-gradient-to-br ${gradient} backdrop-blur-sm`}>
            <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-background/50 rounded-lg">{icon}</div>
            </div>
            <div>
                <h3 className="text-2xl font-bold mb-1">{value}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{title}</p>
            </div>
        </div>
    );
}
