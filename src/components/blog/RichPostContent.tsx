"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
    TbAlertTriangle, TbBulb, TbEye, TbMessage, TbArrowDown, TbTheater, TbQuote, TbCode, TbCopy, TbCheck, // Additional icons for thematic content
    TbTrendingDown, TbTrendingUp, TbChartBar, TbBuildingFactory, TbRobot, TbSettings, TbTool, TbHammer, TbWorld, TbMap, TbAlertCircle, TbArrowUp, TbArrowRight, TbMovie, TbVideo, TbBrain, TbPill, TbBuildingHospital, TbHeart, TbCoins, TbCurrencyDollar, TbDiamond, TbPackage, TbSpeakerphone, TbBell, TbChevronRight, TbDroplet, TbBolt, TbFlame, TbTarget, TbPin, TbSparkles, TbDna, TbFileText, TbTrophy, TbStethoscope, TbCpu, TbAtom, TbCircleCheck
} from "react-icons/tb"
import { useState } from "react"

interface Section {
    icon?: string;  // lucide icon name
    title?: string;
    content: string;
    type: 'intro' | 'section' | 'sarcasm' | 'warning' | 'tip' | 'fact' | 'opinion' | 'cta' | 'hashtags' | 'prompt' | 'author-comment' | 'image';
}

interface RichPostContentProps {
    sections: Section[];
    className?: string;
}

// Icon type alias for Tabler icons
type IconType = React.ComponentType<{ className?: string }>;

// Icon name to component mapping - maps Lucide names from AI parser to Tabler icons
const ICON_COMPONENTS: Record<string, IconType> = {
    // Core mapped icons
    AlertTriangle: TbAlertTriangle,
    Lightbulb: TbBulb,
    Eye: TbEye,
    MessageCircle: TbMessage,
    ArrowDown: TbArrowDown,
    Theater: TbTheater,
    Quote: TbQuote,
    Code: TbCode,
    TrendingDown: TbTrendingDown,
    TrendingUp: TbTrendingUp,
    BarChart3: TbChartBar,
    Factory: TbBuildingFactory,
    Bot: TbRobot,
    Cog: TbSettings,
    Wrench: TbTool,
    Hammer: TbHammer,
    Globe: TbWorld,
    Globe2: TbWorld,
    Map: TbMap,
    AlertCircle: TbAlertCircle,
    ArrowUp: TbArrowUp,
    ArrowRight: TbArrowRight,
    Clapperboard: TbMovie,
    Video: TbVideo,
    Brain: TbBrain,
    Pill: TbPill,
    Hospital: TbBuildingHospital,
    Heart: TbHeart,
    Coins: TbCoins,
    DollarSign: TbCurrencyDollar,
    Gem: TbDiamond,
    Package: TbPackage,
    Megaphone: TbSpeakerphone,
    Bell: TbBell,
    ChevronRight: TbChevronRight,
    Droplet: TbDroplet,
    Zap: TbBolt,
    Flame: TbFlame,
    Target: TbTarget,
    Pin: TbPin,
    Sparkles: TbSparkles,
    Dna: TbDna,
    FileText: TbFileText,
    Trophy: TbTrophy,
    Stethoscope: TbStethoscope,
    Cpu: TbCpu,
    Atom: TbAtom,
    CheckCircle: TbCircleCheck,
}

// Get icon component by name
function getIconComponent(iconName?: string): IconType | null {
    if (!iconName) return null
    return ICON_COMPONENTS[iconName] || null
}

// Section type to styling map
const SECTION_STYLES: Record<Section['type'], {
    bgClass: string;
    borderClass: string;
    iconClass: string;
    defaultIcon?: IconType;
}> = {
    intro: {
        bgClass: 'bg-transparent',
        borderClass: 'border-transparent',
        iconClass: '',
    },
    section: {
        bgClass: 'bg-card/50',
        borderClass: 'border-l-4 border-primary/40',
        iconClass: 'text-primary',
        defaultIcon: TbChevronRight,
    },
    sarcasm: {
        bgClass: 'bg-purple-500/10',
        borderClass: 'border-l-4 border-purple-500/60',
        iconClass: 'text-purple-500',
        defaultIcon: TbTheater,
    },
    warning: {
        bgClass: 'bg-red-500/10',
        borderClass: 'border-l-4 border-red-500/60',
        iconClass: 'text-red-500',
        defaultIcon: TbAlertTriangle,
    },
    tip: {
        bgClass: 'bg-green-500/10',
        borderClass: 'border-l-4 border-green-500/60',
        iconClass: 'text-green-500',
        defaultIcon: TbBulb,
    },
    fact: {
        bgClass: 'bg-blue-500/10',
        borderClass: 'border-l-4 border-blue-500/60',
        iconClass: 'text-blue-500',
        defaultIcon: TbEye,
    },
    opinion: {
        bgClass: 'bg-gradient-to-r from-primary/5 to-accent/5',
        borderClass: 'border-l-4 border-primary',
        iconClass: 'text-primary',
        defaultIcon: TbQuote,
    },
    cta: {
        bgClass: 'bg-gradient-to-r from-primary/20 to-accent/20',
        borderClass: 'border border-primary/30 rounded-xl',
        iconClass: 'text-primary',
        defaultIcon: TbArrowDown,
    },
    hashtags: {
        bgClass: 'bg-transparent',
        borderClass: 'border-transparent',
        iconClass: '',
    },
    prompt: {
        bgClass: 'bg-zinc-900/90',
        borderClass: 'border border-zinc-700 rounded-lg',
        iconClass: 'text-cyan-400',
        defaultIcon: TbCode,
    },
    'author-comment': {
        bgClass: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10',
        borderClass: 'border-l-4 border-amber-500/60',
        iconClass: 'text-amber-500',
        defaultIcon: TbMessage,
    },
    image: {
        bgClass: '',
        borderClass: '',
        iconClass: '',
    },
};

// Get section accent color based on icon
function getSectionAccentColor(iconName?: string): string {
    if (!iconName) return '';

    const colorMap: Record<string, string> = {
        'Droplet': 'border-cyan-500/60',
        'Coins': 'border-yellow-500/60',
        'DollarSign': 'border-yellow-500/60',
        'ChevronRight': 'border-blue-400/60',
        'Gem': 'border-violet-500/60',
        'Zap': 'border-amber-500/60',
        'Flame': 'border-orange-500/60',
        'Lightbulb': 'border-yellow-400/60',
        'Target': 'border-red-400/60',
        'Pin': 'border-rose-500/60',
        'Sparkles': 'border-pink-400/60',
        'Brain': 'border-purple-500/60',
        'Factory': 'border-slate-500/60',
        'Globe': 'border-emerald-500/60',
        'TrendingDown': 'border-red-400/60',
        'TrendingUp': 'border-green-400/60',
        'Bot': 'border-blue-500/60',
        'Cpu': 'border-cyan-500/60',
        'Eye': 'border-indigo-500/60',
    };

    return colorMap[iconName] || '';
}

// Prompt/TbCode block component with copy functionality
function PromptBlockSection({ section }: { section: Section }) {
    const [copied, setCopied] = useState(false);
    const style = SECTION_STYLES['prompt'];
    const IconComponent = style.defaultIcon;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(section.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn(
            "my-6 overflow-hidden",
            style.bgClass,
            style.borderClass
        )}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/50 border-b border-zinc-700">
                <div className="flex items-center gap-2">
                    {IconComponent && (
                        <span className={style.iconClass}>
                            <IconComponent className="w-5 h-5" />
                        </span>
                    )}
                    <span className="text-sm font-medium text-zinc-300">
                        {section.title || 'AI პრომპტი'}
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 rounded-md transition-colors text-zinc-300"
                >
                    {copied ? (
                        <><TbCheck className="w-3.5 h-3.5 text-green-400" /> დაკოპირდა</>
                    ) : (
                        <><TbCopy className="w-3.5 h-3.5" /> კოპირება</>
                    )}
                </button>
            </div>
            {/* TbCode content */}
            <pre className="p-4 overflow-x-auto">
                <code className="text-sm font-mono text-zinc-100 whitespace-pre-wrap break-words">
                    {section.content}
                </code>
            </pre>
        </div>
    );
}

function SectionRenderer({ section, index }: { section: Section; index: number }) {
    const style = SECTION_STYLES[section.type];
    const customBorder = getSectionAccentColor(section.icon);

    // Get icon component - prefer section.icon, fallback to style.defaultIcon
    const IconComponent = getIconComponent(section.icon) || style.defaultIcon;

    // Render hashtags as badges
    if (section.type === 'hashtags') {
        const hashtags = section.content.match(/#[\u10A0-\u10FFa-zA-Z0-9_]+/g) || [];
        return (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border/50">
                {hashtags.map((tag, i) => (
                    <Badge
                        key={i}
                        variant="secondary"
                        className="bg-primary/10 hover:bg-primary/20 cursor-pointer transition-colors"
                    >
                        {tag}
                    </Badge>
                ))}
            </div>
        );
    }

    // Render intro as plain text
    if (section.type === 'intro') {
        return (
            <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
                <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-line">
                    {section.content}
                </p>
            </div>
        );
    }

    // Render prompt/code block with copy functionality
    if (section.type === 'prompt') {
        return <PromptBlockSection section={section} />;
    }

    // Render CTA as special card
    if (section.type === 'cta') {
        return (
            <Card className={cn(
                "mt-8 overflow-hidden",
                style.bgClass,
                style.borderClass
            )}>
                <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        {IconComponent && (
                            <span className={cn(style.iconClass, "animate-bounce")}>
                                <IconComponent className="w-6 h-6" />
                            </span>
                        )}
                    </div>
                    <p className="text-lg font-medium whitespace-pre-line">
                        {section.content}
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Render opinion as quote block
    if (section.type === 'opinion') {
        return (
            <blockquote className={cn(
                "my-8 p-6 rounded-r-lg italic",
                style.bgClass,
                style.borderClass
            )}>
                <div className="flex items-start gap-3">
                    {IconComponent && (
                        <span className={cn("flex-shrink-0 mt-1", style.iconClass)}>
                            <IconComponent className="w-5 h-5" />
                        </span>
                    )}
                    <p className="text-lg leading-relaxed whitespace-pre-line">
                        {section.content}
                    </p>
                </div>
            </blockquote>
        );
    }

    // Render author comment as special styled block
    if (section.type === 'author-comment') {
        return (
            <div className={cn(
                "my-8 p-5 rounded-lg",
                style.bgClass,
                style.borderClass
            )}>
                <div className="flex items-center gap-2 mb-3">
                    {IconComponent && (
                        <span className={style.iconClass}>
                            <IconComponent className="w-5 h-5" />
                        </span>
                    )}
                    <h4 className="font-semibold text-amber-600 dark:text-amber-400">
                        {section.title || 'ავტორის კომენტარი'}
                    </h4>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line m-0 text-sm">
                        {section.content}
                    </p>
                </div>
            </div>
        );
    }

    // Render Image section
    if (section.type === 'image') {
        return (
            <div className="my-8 rounded-xl overflow-hidden shadow-lg border border-border/50">
                <img
                    src={section.content}
                    alt={section.title || 'Post image'}
                    className="w-full h-auto object-cover"
                />
                {section.title && (
                    <p className="text-sm text-center text-muted-foreground mt-2 italic pb-2">
                        {section.title}
                    </p>
                )}
            </div>
        );
    }

    // Render regular sections
    // If no title, make icon + text inline
    const hasTitle = Boolean(section.title);

    return (
        <div className={cn(
            "my-6 p-5 rounded-r-lg transition-all",
            style.bgClass,
            customBorder || style.borderClass
        )}>
            {/* If section has title - show icon + title in header */}
            {hasTitle && (
                <div className="flex items-center gap-2 mb-3">
                    {IconComponent && (
                        <span className={style.iconClass}>
                            <IconComponent className="w-5 h-5" aria-hidden="true" />
                        </span>
                    )}
                    <h3 className="font-bold text-lg">
                        {section.title}
                    </h3>
                </div>
            )}

            {/* Section content - inline with icon if no title */}
            <div className={cn(
                "prose prose-lg dark:prose-invert max-w-none",
                !hasTitle && "flex items-start gap-3"
            )}>
                {/* Icon inline with content if no title */}
                {!hasTitle && IconComponent && (
                    <span className={cn(style.iconClass, "flex-shrink-0 mt-1")}>
                        <IconComponent className="w-5 h-5" aria-hidden="true" />
                    </span>
                )}
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line m-0">
                    {section.content}
                </p>
            </div>
        </div>
    );
}

export function RichPostContent({ sections, className }: RichPostContentProps) {
    if (!sections || sections.length === 0) {
        return null;
    }

    return (
        <div className={cn("rich-post-content", className)}>
            {sections.map((section, index) => (
                <SectionRenderer
                    key={index}
                    section={section}
                    index={index}
                />
            ))}
        </div>
    );
}

export default RichPostContent;
