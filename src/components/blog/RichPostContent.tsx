"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    TbAlertTriangle, TbBulb, TbEye, TbEyeOff, TbMessage, TbArrowDown, TbTheater, TbQuote, TbCode, TbCopy, TbCheck,
    TbTrendingDown, TbTrendingUp, TbChartBar, TbBuildingFactory, TbRobot, TbSettings, TbTool, TbHammer, TbWorld, TbMap, TbAlertCircle, TbArrowUp, TbArrowRight, TbArrowLeft, TbMovie, TbVideo, TbBrain, TbPill, TbBuildingHospital, TbHeart, TbCoins, TbCurrencyDollar, TbDiamond, TbPackage, TbSpeakerphone, TbBell, TbChevronRight, TbDroplet, TbBolt, TbFlame, TbTarget, TbPin, TbSparkles, TbDna, TbFileText, TbTrophy, TbStethoscope, TbCpu, TbAtom, TbCircleCheck,
    TbSkull, TbHourglass, TbAlarm, TbMapPin, TbStar, TbLock, TbLockOpen, TbShield, TbGift, TbKey, TbDeviceGamepad2, TbClipboardList, TbPencil, TbFlask, TbLink, TbPaperclip, TbMedal, TbMouse, TbBrandTelegram, TbCircle, TbHelp
} from "react-icons/tb"
import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Section {
    icon?: string;  // lucide icon name
    title?: string;
    content: string;
    quote?: string; // Added for tutorial steps
    stepNumber?: number; // Added for tutorial steps
    type: 'intro' | 'section' | 'sarcasm' | 'warning' | 'tip' | 'fact' | 'opinion' | 'quote' | 'cta' | 'hashtags' | 'prompt' | 'author-comment' | 'image' | 'graph' | 'tutorial-step' | 'secret';
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
    EyeOff: TbEyeOff,
    MessageCircle: TbMessage,
    MessageSquare: TbMessage,
    ArrowDown: TbArrowDown,
    ArrowUp: TbArrowUp,
    ArrowRight: TbArrowRight,
    ArrowLeft: TbArrowLeft,
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
    MapPin: TbMapPin,
    AlertCircle: TbAlertCircle,
    Siren: TbAlertCircle,
    Clapperboard: TbMovie,
    Video: TbVideo,
    Brain: TbBrain,
    Pill: TbPill,
    Hospital: TbBuildingHospital,
    Heart: TbHeart,
    Coins: TbCoins,
    DollarSign: TbCurrencyDollar,
    Banknote: TbCurrencyDollar,
    BadgeDollarSign: TbCurrencyDollar,
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
    Flask: TbFlask,
    FileText: TbFileText,
    Trophy: TbTrophy,
    Medal: TbMedal,
    Stethoscope: TbStethoscope,
    Cpu: TbCpu,
    Atom: TbAtom,
    CheckCircle: TbCircleCheck,
    // New icons added
    Skull: TbSkull,
    Hourglass: TbHourglass,
    AlarmClock: TbAlarm,
    Clock: TbAlarm,
    Star: TbStar,
    Lock: TbLock,
    Unlock: TbLockOpen,
    Shield: TbShield,
    Gift: TbGift,
    Key: TbKey,
    Gamepad2: TbDeviceGamepad2,
    ClipboardList: TbClipboardList,
    PenLine: TbPencil,
    Link: TbLink,
    Paperclip: TbPaperclip,
    Dice1: TbDeviceGamepad2,
    MousePointer: TbMouse,
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
    quote: {
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
    graph: {
        bgClass: 'bg-cyan-500/10',
        borderClass: 'border-l-4 border-cyan-500/60',
        iconClass: 'text-cyan-500',
        defaultIcon: TbChartBar,
    },
    'tutorial-step': {
        bgClass: '',
        borderClass: '',
        iconClass: 'text-primary',
    },
    'secret': {
        bgClass: 'bg-black',
        borderClass: 'border border-white/10',
        iconClass: 'text-yellow-500',
    }
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

// Tutorial Step Renderer
function TutorialStepRenderer({ section }: { section: Section }) {
    const [isDone, setIsDone] = useState(false);

    // Initial state from local storage?
    // Simplified for now, just local state for the session

    return (
        <div
            id={`step-${section.stepNumber}`}
            className="group relative pl-12 md:pl-16 mb-16 tutorial-step selection:bg-purple-500/30"
            data-step={section.stepNumber}
        >
            {/* Vertical Line Connector (Absolute to be continuous looking) */}
            <div className="absolute left-4 md:left-0 top-0 bottom-[-4rem] w-0.5 bg-border/50 group-last:bottom-0" />

            {/* Number Marker */}
            <div className={cn(
                "absolute left-0 md:-left-4 top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ring-4 ring-background z-10 transition-colors duration-300",
                isDone ? "bg-green-500 text-white" : "bg-purple-600 text-white"
            )}>
                {isDone ? <TbCheck className="w-5 h-5" /> : section.stepNumber}
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold mt-0">{section.title}</h2>

                {/* Quote */}
                {section.quote && (
                    <div className="bg-muted/30 border-l-4 border-purple-500 p-6 rounded-r-xl my-6">
                        <div className="flex gap-4">
                            <TbQuote className="w-6 h-6 text-purple-500 shrink-0 opacity-50" />
                            <div className="font-mono text-sm md:text-base opacity-80 whitespace-pre-wrap">{section.quote}</div>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="flex gap-4 items-start">
                    <TbBulb className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
                    <div className="space-y-4 flex-1">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed text-foreground/90 m-0 whitespace-pre-wrap">
                                {section.content}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interaction Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-6 border-t border-border/40">
                    <button
                        onClick={() => setIsDone(!isDone)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300",
                            isDone
                                ? "bg-green-500/10 border-green-500 text-green-500 hover:bg-green-500/20"
                                : "bg-background border-border hover:border-primary hover:text-primary"
                        )}
                    >
                        {isDone ? <TbCircleCheck className="w-5 h-5 fill-current" /> : <TbCircle className="w-5 h-5" />}
                        <span className="font-medium">{isDone ? "შესრულებულია" : "მონიშნე დასრულებულად"}</span>
                    </button>

                    <a
                        href="https://t.me/andr3waltairchannel"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors text-sm font-medium"
                    >
                        <TbBrandTelegram className="w-5 h-5" />
                        დახმარება მჭირდება
                    </a>
                </div>
            </div>
        </div>
    );
}

function SectionRenderer({ section, index }: { section: Section; index: number }) {
    // Specialized Renderer for Tutorial Steps
    if (section.type === 'tutorial-step') {
        return <TutorialStepRenderer section={section} />
    }

    const style = SECTION_STYLES[section.type] || SECTION_STYLES['section'];
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

    // Render opinion or quote as quote block
    if (section.type === 'opinion' || section.type === 'quote') {
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

    // Render 'Secret' / Confidential Advice
    if (section.type === 'secret') {
        return (
            <div className="my-12 relative p-8 rounded-2xl bg-black border border-white/10 overflow-hidden group">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2 text-yellow-500">
                        <span className="text-2xl">🏴‍☠️</span>
                        <span className="font-black text-xs uppercase tracking-[0.2em] opacity-70 font-georgian">კონფიდენციალური რჩევა</span>
                    </div>
                    <p className="text-xl font-georgian italic text-white/90 leading-relaxed m-0">
                        "{section.content}"
                    </p>
                </div>
            </div>
        )
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
                {/* Render content with ReactMarkdown for formatting support */}
                <div className="text-muted-foreground leading-relaxed m-0">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                            a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-4" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-4" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                            code: ({ node, ...props }) => <code className="bg-muted px-1 py-0.5 rounded font-mono text-sm" {...props} />,
                        }}
                    >
                        {section.content}
                    </ReactMarkdown>
                </div>
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
            {/* Skip intro sections - they duplicate the excerpt shown in hero */}
            {sections
                .filter(section => section.type !== 'intro')
                .map((section, index) => (
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
