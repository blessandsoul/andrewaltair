'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TbCheck, TbX, TbLoader, TbCrown, TbBolt, TbBuildingSkyscraper } from "react-icons/tb";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Plan {
    _id: string;
    name: string;
    slug: string;
    price: number;
    interval: string;
    features: string[];
}

export default function PricingPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubscribing, setIsSubscribing] = useState<string | null>(null); // Plan ID
    const router = useRouter();

    useEffect(() => {
        fetch('/api/bots/subscriptions/plans')
            .then(res => res.json())
            .then(data => {
                setPlans(data.plans || []);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    const handleSubscribe = async (planId: string) => {
        setIsSubscribing(planId);

        try {
            const res = await fetch('/api/bots/subscriptions/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId })
            });
            const data = await res.json();

            if (res.ok) {
                // Success!
                alert("Subscription successful!");
                router.push('/dashboard'); // or profile
            } else {
                alert(data.error || "Subscription failed");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubscribing(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <TbLoader className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-20 px-4">
            <div className="max-w-6xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-600">
                    აირჩიე შენი გეგმა
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    გაზარდე შენი შესაძლებლობები პრემიუმ წვდომით. მიიღე მეტი რესურსი და პრიორიტეტული მხარდაჭერა.
                </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, index) => {
                    const isPopular = plan.slug === 'pro';
                    return (
                        <motion.div
                            key={plan._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative p-8 rounded-3xl border ${isPopular
                                ? 'border-violet-500/50 bg-violet-500/5 shadow-2xl shadow-violet-500/20'
                                : 'border-border bg-card'
                                }`}
                        >
                            {isPopular && (
                                <div className="absolute top-0 right-0 bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                                    POPULAR
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${plan.slug === 'pro' ? 'bg-violet-500/20 text-violet-500' :
                                    plan.slug === 'enterprise' ? 'bg-amber-500/20 text-amber-500' :
                                        'bg-secondary text-muted-foreground'
                                    }`}>
                                    {plan.slug === 'pro' ? <TbCrown className="w-6 h-6" /> :
                                        plan.slug === 'enterprise' ? <TbBuildingSkyscraper className="w-6 h-6" /> :
                                            <TbBolt className="w-6 h-6" />}
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black">₾{plan.price}</span>
                                    <span className="text-muted-foreground text-sm">/ {plan.interval}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm text-left">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                                            <TbCheck className="w-3 h-3 text-emerald-500" />
                                        </div>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={() => handleSubscribe(plan._id)}
                                disabled={!!isSubscribing}
                                className={`w-full py-6 font-bold text-lg rounded-xl shadow-lg transition-transform hover:scale-[1.02] ${isPopular
                                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white'
                                    : 'bg-secondary hover:bg-secondary/80 text-foreground'
                                    }`}
                            >
                                {isSubscribing === plan._id ? (
                                    <TbLoader className="w-6 h-6 animate-spin" />
                                ) : (
                                    plan.price === 0 ? "დაწყება უფასოდ" : "გამოწერა"
                                )}
                            </Button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
