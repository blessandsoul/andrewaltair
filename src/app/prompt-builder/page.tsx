'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TbSparkles, TbCopy, TbCheck, TbBulb, TbWand, TbFileText, TbBolt, TbBrain, TbCode, TbBriefcase, TbHeart, TbLoader2, TbStars, TbRefresh, TbHistory, TbBook, TbWorld, TbDownload, TbShare, TbLanguage, TbStack2, TbTestPipe, TbTool, TbLibrary, TbPencil, TbRobot } from "react-icons/tb"
import { PromptHistory, PromptTemplates, PromptGallery, PromptChat, TokenCounter, PromptQuality, PromptShare, PromptABTest, ModelSelector, ModelSettings, PromptAnalyticsDashboard, PromptVersions, OnboardingTour, promptBuilderTourSteps } from "@/components/prompt-builder"
import { useToast } from "@/components/ui/toast"

// Role options
const roles = {
    business: {
        label: "ბიზნესი და მარკეტინგი",
        items: [
            { value: "marketing strategist", label: "მარკეტინგის სტრატეგი" },
            { value: "sales consultant", label: "გაყიდვების კონსულტანტი" },
            { value: "business coach", label: "ბიზნეს ქოუჩი" },
            { value: "copywriter", label: "კოპირაიტერი" },
            { value: "SEO specialist", label: "SEO სპეციალისტი" },
            { value: "growth hacker", label: "Growth Hacker" },
            { value: "product manager", label: "პროდუქტ მენეჯერი" },
            { value: "financial advisor", label: "ფინანსური მრჩეველი" },
        ]
    },
    tech: {
        label: "ტექნოლოგიები და დეველოპმენტი",
        items: [
            { value: "senior software engineer", label: "წამყვანი პროგრამისტი" },
            { value: "UX/UI designer", label: "UX/UI დიზაინერი" },
            { value: "data scientist", label: "მონაცემთა მეცნიერი" },
            { value: "DevOps engineer", label: "DevOps ინჟინერი" },
            { value: "automation specialist", label: "ავტომატიზაციის სპეციალისტი" },
            { value: "cybersecurity expert", label: "კიბერუსაფრთხოების ექსპერტი" },
        ]
    },
    personal: {
        label: "პირადი განვითარება",
        items: [
            { value: "career coach", label: "კარიერის ქოუჩი" },
            { value: "executive coach", label: "ლიდერობის ქოუჩი" },
            { value: "fitness trainer", label: "ფიტნეს ტრენერი" },
            { value: "nutritionist", label: "დიეტოლოგი" },
            { value: "psychologist", label: "ფსიქოლოგი" },
            { value: "productivity consultant", label: "პროდუქტიულობის კონსულტანტი" },
        ]
    },
    creative: {
        label: "კრეატივი და კონტენტი",
        items: [
            { value: "creative director", label: "კრეატიული დირექტორი" },
            { value: "content strategist", label: "კონტენტ სტრატეგი" },
            { value: "brand strategist", label: "ბრენდ სტრატეგი" },
            { value: "storyteller", label: "სთორითელერი" },
            { value: "journalist", label: "ჟურნალისტი" },
        ]
    },
    research: {
        label: "კვლევა და ანალიზი",
        items: [
            { value: "research analyst", label: "კვლევის ანალიტიკოსი" },
            { value: "market researcher", label: "ბაზრის მკვლევარი" },
            { value: "competitive intelligence analyst", label: "კონკურენტული დაზვერვის ანალიტიკოსი" },
        ]
    }
}

// Tone options
const tones = [
    { value: "direct and concise, no fluff", label: "პირდაპირი და ლაკონური" },
    { value: "detailed and thorough, explain your reasoning", label: "დეტალური და სრული" },
    { value: "casual and friendly, like talking to a colleague", label: "მეგობრული და არაფორმალური" },
    { value: "formal and professional, suitable for business", label: "ფორმალური და პროფესიონალური" },
    { value: "supportive and encouraging, like a mentor", label: "მხარდამჭერი და წამახალისებელი" },
    { value: "challenging and critical, push me to think harder", label: "გამომწვევი და კრიტიკული" },
    { value: "creative and playful, think outside the box", label: "კრეატიული და მხიარული" },
    { value: "technical and precise, assume I have expertise", label: "ტექნიკური და ზუსტი" },
    { value: "simple and clear, explain like I'm a beginner", label: "მარტივი და გასაგები (დამწყებთათვის)" },
]

// Context options
const contexts = {
    business: {
        label: "ბიზნეს კონტექსტი",
        items: [
            { value: "I run a small B2B SaaS company with 5 employees", label: "მცირე B2B SaaS (5 თანამშრომელი)" },
            { value: "I'm a solopreneur building my first online business", label: "სოლოპრენერი / პირველი ბიზნესი" },
            { value: "I work in a corporate marketing team at a Fortune 500 company", label: "კორპორატიული მარკეტინგის გუნდი" },
            { value: "I'm launching a new e-commerce store selling physical products", label: "E-commerce სტარტაპი" },
            { value: "I run a service-based consulting business", label: "საკონსულტაციო ბიზნესი" },
            { value: "I'm a freelancer trying to scale my client work", label: "ფრილანსერი, რომელიც იზრდება" },
            { value: "I'm building a startup and need to move fast", label: "სტარტაპი (ადრეული ეტაპი)" },
        ]
    },
    personal: {
        label: "პერსონალური კონტექსტი",
        items: [
            { value: "I'm a mid-career professional looking to make a career change", label: "კარიერის შემცვლელი" },
            { value: "I'm a recent graduate entering the job market", label: "ახალი კურსდამთავრებული" },
            { value: "I'm a busy parent with limited time for self-improvement", label: "დაკავებული მშობელი" },
            { value: "I'm an executive with high stress and demanding schedule", label: "გადატვირთული ხელმძღვანელი" },
            { value: "I'm learning to code and building my first projects", label: "დამწყები დეველოპერი" },
        ]
    }
}

// Output format options
const outputFormats = [
    { value: "Provide a step-by-step action plan with numbered steps", label: "ნაბიჯ-ნაბიჯ სამოქმედო გეგმა" },
    { value: "Format your response as a bullet-point list", label: "ჩამონათვალი (Bullet points)" },
    { value: "Create a table comparing options", label: "შედარების ცხრილი" },
    { value: "Write in a conversational, easy-to-understand style", label: "სასაუბრო სტილი" },
    { value: "Provide a detailed analysis with pros and cons", label: "დეტალური ანალიზი (+ და -)" },
    { value: "Give me a template I can fill in", label: "შაბლონი შესავსებად" },
    { value: "Write ready-to-use copy I can paste directly", label: "მზა ტექსტი (copy-paste)" },
    { value: "Provide 3-5 options with your recommendation and reasoning", label: "რამდენიმე ვარიანტი რეკომენდაციით" },
    { value: "Create a framework or system I can reuse", label: "ჩარჩო ან სისტემა (Framework)" },
    { value: "Give me a checklist I can follow", label: "ჩეკლისტი" },
]

// Example prompts
const examples = [
    {
        title: "მარკეტინგის სტრატეგია",
        params: "როლი: მარკეტინგის სტრატეგი | სტილი: პირდაპირი | კონტექსტი: B2B SaaS",
        result: "12-კვირიანი კამპანიის გეგმა ელ.ფოსტის სერიებით, LinkedIn სტრატეგიით და KPI-ებით",
        icon: TbBriefcase
    },
    {
        title: "კარიერის ცვლილება",
        params: "როლი: კარიერის ქოუჩი | სტილი: მხარდამჭერი | კონტექსტი: კარიერის შემცვლელი",
        result: "90-დღიანი გადასვლის გეგმა უნარების დეფიციტის შევსებით, სწავლის რესურსებით და ნეთვორქინგის სტრატეგიით",
        icon: TbHeart
    },
    {
        title: "კოდ რევიუ",
        params: "როლი: სენიორ პროგრამისტი | სტილი: ტექნიკური | კონტექსტი: სტარტაპი",
        result: "დეტალური კოდის მიმოხილვა უსაფრთხოების ხარვეზების იდენტიფიცირებით, პერფორმანსის ოპტიმიზაციით და რეფაქტორინგის წინადადებებით",
        icon: TbCode
    }
]

export default function PromptBuilderPage() {
    const [role, setRole] = useState('')
    const [customRole, setCustomRole] = useState('')
    const [tone, setTone] = useState('')
    const [context, setContext] = useState('')
    const [customContext, setCustomContext] = useState('')
    const [task, setTask] = useState('')
    const [outputFormat, setOutputFormat] = useState('')
    const [constraints, setConstraints] = useState('')
    const [generatedPrompt, setGeneratedPrompt] = useState('')
    const [copied, setCopied] = useState(false)

    // AI states
    const [isEnhancing, setIsEnhancing] = useState(false)
    const [isImprovingTask, setIsImprovingTask] = useState(false)
    const [isSuggestingTasks, setIsSuggestingTasks] = useState(false)
    const [taskSuggestions, setTaskSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [modelSettings, setModelSettings] = useState<ModelSettings>({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        maxTokens: 1500
    })

    // New feature states
    const [currentPromptId, setCurrentPromptId] = useState<string | null>(null)
    const [shareToken, setShareToken] = useState<string | null>(null)
    const [isPublic, setIsPublic] = useState(false)
    const [isTranslating, setIsTranslating] = useState(false)
    const [isGeneratingVariations, setIsGeneratingVariations] = useState(false)
    const [variations, setVariations] = useState<string[]>([])
    const [activeTab, setActiveTab] = useState('builder')
    const [promptHistory, setPromptHistory] = useState<Array<{ id: string, formData: { task: string } }>>([])
    const toast = useToast()

    // Fetch prompt history for A/B testing
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/prompts?type=history&limit=20')
                const data = await res.json()
                setPromptHistory(data.prompts || [])
            } catch (error) {
                console.error('Failed to fetch history:', error)
            }
        }
        fetchHistory()
    }, [currentPromptId]) // Refresh when new prompt is created

    // Save prompt to database
    const savePromptToDB = async (prompt: string, formData: any) => {
        try {
            const res = await fetch('/api/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: prompt, formData })
            })
            const data = await res.json()
            setCurrentPromptId(data.id)
            setShareToken(data.shareToken)
            return data
        } catch (error) {
            console.error('Failed to save prompt:', error)
        }
    }

    const generatePrompt = () => {
        const finalRole = role === 'custom' ? customRole : role
        const finalContext = context === 'custom' ? customContext : context

        if (!finalRole) {
            toast.warning('აირჩიეთ როლი', 'გთხოვთ აირჩიეთ ან შეიყვანეთ როლი')
            return
        }
        if (!task) {
            toast.warning('დავალება არ არის', 'გთხოვთ აღწერეთ თქვენი დავალება')
            return
        }

        let prompt = `შენ ხარ ექსპერტი ${finalRole}.`

        if (tone) {
            prompt += ` კომუნიკაცია გააკეთე ${tone} სტილით.`
        }

        if (finalContext) {
            prompt += `\n\n**კონტექსტი:**\n${finalContext}`
        }

        prompt += `\n\n**დავალება:**\n${task}`

        if (outputFormat) {
            prompt += `\n\n**პასუხის ფორმატი:**\n${outputFormat}`
        }

        if (constraints) {
            prompt += `\n\n**დამატებითი მოთხოვნები:**\n${constraints}`
        }

        prompt += `\n\n**მნიშვნელოვანი:**
- იყავი კონკრეტული და პრაქტიკული
- ჩართე მაგალითები სადაც საჭიროა
- თუ გჭირდება დაზუსტება, იკითხე შეკითხვა დაწყებამდე`

        setGeneratedPrompt(prompt)

        // Auto-save to database
        const formData = {
            role: finalRole,
            customRole: role === 'custom' ? customRole : undefined,
            tone,
            context: finalContext,
            customContext: context === 'custom' ? customContext : undefined,
            task,
            outputFormat,
            constraints
        }
        savePromptToDB(prompt, formData)
        trackEvent('generate')
    }

    // Analytics: Track events
    const trackEvent = async (event: string, extra: Record<string, unknown> = {}) => {
        try {
            const finalRole = role === 'custom' ? customRole : role
            await fetch('/api/prompts/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event,
                    role: finalRole,
                    model: modelSettings.model,
                    ...extra
                })
            })
        } catch (error) {
            console.error('Analytics tracking failed:', error)
        }
    }

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(generatedPrompt)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        trackEvent('copy')
    }

    const clearForm = () => {
        setRole('')
        setCustomRole('')
        setTone('')
        setContext('')
        setCustomContext('')
        setTask('')
        setOutputFormat('')
        setConstraints('')
        setGeneratedPrompt('')
        setTaskSuggestions([])
        setShowSuggestions(false)
    }

    // AI: Enhance the generated prompt
    const enhancePrompt = async () => {
        if (!generatedPrompt) return

        setIsEnhancing(true)
        try {
            const response = await fetch('/api/prompt-builder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'enhance', prompt: generatedPrompt, modelSettings })
            })

            const data = await response.json()
            if (data.result) {
                setGeneratedPrompt(data.result)
                trackEvent('enhance')

                // Save the enhanced version to database (creates new version)
                if (currentPromptId) {
                    const finalRole = role === 'custom' ? customRole : role
                    const finalContext = context === 'custom' ? customContext : context
                    await fetch(`/api/prompts/${currentPromptId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            content: data.result,
                            formData: {
                                role: finalRole,
                                task,
                                tone,
                                context: finalContext,
                                outputFormat,
                                constraints
                            }
                        })
                    })
                }
            }
        } catch (error) {
            console.error('Enhancement failed:', error)
        } finally {
            setIsEnhancing(false)
        }
    }

    // AI: Improve task description
    const improveTask = async () => {
        if (!task) return

        setIsImprovingTask(true)
        try {
            const response = await fetch('/api/prompt-builder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'improve-task', task, modelSettings })
            })

            const data = await response.json()
            if (data.result) {
                setTask(data.result)
            }
        } catch (error) {
            console.error('Task improvement failed:', error)
        } finally {
            setIsImprovingTask(false)
        }
    }

    // AI: Get task suggestions based on role
    const getSuggestions = async () => {
        const finalRole = role === 'custom' ? customRole : role
        const finalContext = context === 'custom' ? customContext : context

        if (!finalRole) {
            toast.warning('აირჩიეთ როლი', 'ჯერ აირჩიე როლი რომ AI იდეები მიიღო!')
            return
        }

        setIsSuggestingTasks(true)
        setShowSuggestions(true)
        try {
            const response = await fetch('/api/prompt-builder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'suggest-task',
                    role: finalRole,
                    context: finalContext,
                    modelSettings
                })
            })

            const data = await response.json()
            if (data.result) {
                // Parse suggestions from numbered list
                const lines = data.result.split('\n').filter((line: string) => line.trim())
                setTaskSuggestions(lines)
            }
        } catch (error) {
            console.error('Suggestion failed:', error)
        } finally {
            setIsSuggestingTasks(false)
        }
    }

    const useSuggestion = (suggestion: string) => {
        // Remove numbering (1. 2. 3.) from start
        const cleanSuggestion = suggestion.replace(/^\d+\.\s*/, '')
        setTask(cleanSuggestion)
        setShowSuggestions(false)
    }

    return (
        <>
            <div className="min-h-screen">
                {/* Hero Header */}
                <section className="relative py-16 lg:py-24">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
                        <div className="absolute inset-0 noise-overlay"></div>
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>

                    <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="text-center max-w-3xl mx-auto">
                            {/* User Counter Badge */}
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 animate-pulse">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                    12,847+ მომხმარებელი
                                </Badge>
                                <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/20 hover:bg-primary/20">
                                    <TbSparkles className="w-3 h-3 mr-1 animate-pulse" />
                                    AI-Powered ინსტრუმენტი
                                </Badge>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                                AI <span className="text-gradient">Prompt Builder</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                შექმენი სრულყოფილი პრომპტები AI-ის დახმარებით. აირჩიე როლი, დაამატე კონტექსტი,
                                და მიეცი AI-ს შანსი გააუმჯობესოს შენი პრომპტი!
                            </p>

                            {/* Quick Start CTA */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                                <Button
                                    size="lg"
                                    onClick={() => {
                                        setRole('marketing strategist')
                                        setTone('direct and concise, no fluff')
                                        setTask('შექმენი 30-დღიანი სოციალური მედიის კონტენტ კალენდარი ჩემი ბიზნესისთვის')
                                        setOutputFormat('Provide a step-by-step action plan with numbered steps')
                                        document.getElementById('builder-section')?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                    className="btn-shine animate-cta-glow bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white text-lg px-8 py-6 shadow-2xl"
                                >
                                    <TbBolt className="w-6 h-6 mr-2" />
                                    დაიწყე ახლავე — უფასოა!
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-6 text-lg hover-spring"
                                >
                                    <TbStars className="w-5 h-5 mr-2" />
                                    ნახე Pro ფუნქციები
                                </Button>
                            </div>

                            {/* Stats Row */}
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <TbCheck className="w-4 h-4 text-green-500" />
                                    <span>50,000+ პრომპტი შექმნილია</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TbCheck className="w-4 h-4 text-green-500" />
                                    <span>98% კმაყოფილების რეიტინგი</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TbCheck className="w-4 h-4 text-green-500" />
                                    <span>7 AI მოდელთან თავსებადი</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <section id="builder-section" className="py-12 lg:py-20 scroll-mt-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="grid lg:grid-cols-2 gap-8">

                            {/* Form Side */}
                            <div className="space-y-6">
                                <Tabs defaultValue="builder" className="w-full">
                                    <div data-tour-step="tabs-list">
                                        <TabsList className="grid w-full grid-cols-4 mb-4">
                                            <TabsTrigger value="builder" className="gap-1"><TbTool className="w-4 h-4" /> Builder</TabsTrigger>
                                            <TabsTrigger value="history" className="gap-1"><TbHistory className="w-4 h-4" /> ისტორია</TabsTrigger>
                                            <TabsTrigger value="templates" className="gap-1"><TbLibrary className="w-4 h-4" /> შაბლონები</TabsTrigger>
                                            <TabsTrigger value="gallery" className="gap-1"><TbWorld className="w-4 h-4" /> გალერეა</TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <TabsContent value="builder">
                                        <Card className="border shadow-lg overflow-visible">
                                            <CardContent className="p-6 space-y-6 overflow-visible">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                                        <TbBrain className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <h2 className="text-xl font-bold">პრომპტის შექმნა</h2>
                                                </div>

                                                {/* Step 1: Role */}
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-medium">
                                                        <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary font-bold">1</span>
                                                        ექსპერტის როლი *
                                                    </label>
                                                    <p className="text-xs text-muted-foreground ml-8">ვინ უნდა გახდეს AI?</p>
                                                    <div data-tour-step="role-selector">
                                                        <Select value={role} onValueChange={setRole}>
                                                            <SelectTrigger className="ml-8 w-[calc(100%-2rem)]">
                                                                <SelectValue placeholder="აირჩიე როლი..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Object.entries(roles).map(([key, group]) => (
                                                                    <SelectGroup key={key}>
                                                                        <SelectLabel>{group.label}</SelectLabel>
                                                                        {group.items.map(item => (
                                                                            <SelectItem key={item.value} value={item.value}>
                                                                                {item.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectGroup>
                                                                ))}
                                                                <SelectItem value="custom"><span className="flex items-center gap-1"><TbPencil className="w-3 h-3" /> სხვა როლი (ჩაწერე ქვემოთ)</span></SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    {role === 'custom' && (
                                                        <Input
                                                            className="ml-8 mt-2 w-[calc(100%-2rem)]"
                                                            placeholder="ჩაწერე შენი როლი..."
                                                            value={customRole}
                                                            onChange={(e) => setCustomRole(e.target.value)}
                                                        />
                                                    )}
                                                </div>

                                                {/* Step 2: Tone */}
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-medium">
                                                        <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary font-bold">2</span>
                                                        კომუნიკაციის სტილი
                                                    </label>
                                                    <p className="text-xs text-muted-foreground ml-8">როგორ უნდა ისაუბროს AI-მ?</p>
                                                    <Select value={tone} onValueChange={setTone}>
                                                        <SelectTrigger className="ml-8 w-[calc(100%-2rem)]">
                                                            <SelectValue placeholder="სტანდარტული (პროფესიონალური)" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {tones.map(item => (
                                                                <SelectItem key={item.value} value={item.value}>
                                                                    {item.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Step 3: Context */}
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-medium">
                                                        <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary font-bold">3</span>
                                                        კონტექსტი / ფონი
                                                    </label>
                                                    <p className="text-xs text-muted-foreground ml-8">რა სიტუაციაში ხარ? აირჩიე ან ჩაწერე.</p>
                                                    <Select value={context} onValueChange={setContext}>
                                                        <SelectTrigger className="ml-8 w-[calc(100%-2rem)]">
                                                            <SelectValue placeholder="აირჩიე კონტექსტი (არასავალდებულო)..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.entries(contexts).map(([key, group]) => (
                                                                <SelectGroup key={key}>
                                                                    <SelectLabel>{group.label}</SelectLabel>
                                                                    {group.items.map(item => (
                                                                        <SelectItem key={item.value} value={item.value}>
                                                                            {item.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            ))}
                                                            <SelectItem value="custom"><span className="flex items-center gap-1"><TbPencil className="w-3 h-3" /> სხვა კონტექსტი (ჩაწერე ქვემოთ)</span></SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {context === 'custom' && (
                                                        <Textarea
                                                            className="ml-8 mt-2 w-[calc(100%-2rem)]"
                                                            placeholder="აღწერე შენი სიტუაცია, კომპანია ან ფონი..."
                                                            value={customContext}
                                                            onChange={(e) => setCustomContext(e.target.value)}
                                                        />
                                                    )}
                                                </div>

                                                {/* Step 4: Task with AI Features */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="flex items-center gap-2 text-sm font-medium">
                                                            <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary font-bold">4</span>
                                                            დავალება / კითხვა *
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <div data-tour-step="ai-ideas-btn">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={getSuggestions}
                                                                    disabled={isSuggestingTasks || !role}
                                                                    className="text-xs h-7 px-2 hover:bg-accent/20"
                                                                >
                                                                    {isSuggestingTasks ? (
                                                                        <TbLoader2 className="w-3 h-3 mr-1 animate-spin" />
                                                                    ) : (
                                                                        <TbBulb className="w-3 h-3 mr-1" />
                                                                    )}
                                                                    AI იდეები
                                                                </Button>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={improveTask}
                                                                disabled={isImprovingTask || !task}
                                                                className="text-xs h-7 px-2 hover:bg-primary/20"
                                                            >
                                                                {isImprovingTask ? (
                                                                    <TbLoader2 className="w-3 h-3 mr-1 animate-spin" />
                                                                ) : (
                                                                    <TbWand className="w-3 h-3 mr-1" />
                                                                )}
                                                                გააუმჯობესე
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground ml-8">რაში გჭირდება დახმარება? იყავი კონკრეტული შედეგის შესახებ.</p>

                                                    {/* AI Task Suggestions */}
                                                    {showSuggestions && (
                                                        <div className="ml-8 p-3 bg-accent/10 border border-accent/20 rounded-lg space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-medium text-accent flex items-center gap-1">
                                                                    <TbStars className="w-3 h-3" />
                                                                    AI შემოთავაზებები
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-5 w-5 p-0"
                                                                    onClick={() => setShowSuggestions(false)}
                                                                >
                                                                    ✕
                                                                </Button>
                                                            </div>
                                                            {isSuggestingTasks ? (
                                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                    <TbLoader2 className="w-4 h-4 animate-spin" />
                                                                    AI ფიქრობს...
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-1">
                                                                    {taskSuggestions.map((suggestion, index) => (
                                                                        <button
                                                                            key={index}
                                                                            onClick={() => useSuggestion(suggestion)}
                                                                            className="w-full text-left text-sm p-2 rounded-md hover:bg-accent/20 transition-colors"
                                                                        >
                                                                            {suggestion}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div data-tour-step="task-input">
                                                        <Textarea
                                                            className="ml-8 min-h-[120px] w-[calc(100%-2rem)]"
                                                            placeholder="მაგალითი: შექმენი 30-დღიანი კონტენტ კალენდარი LinkedIn-ისთვის, რომელიც დამამკვიდრებს AI ავტომატიზაციის ექსპერტად. ჩართე პოსტების თემები, ჰუკები და საუკეთესო დროები."
                                                            value={task}
                                                            onChange={(e) => setTask(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Step 5: Output Format */}
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-medium">
                                                        <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary font-bold">5</span>
                                                        პასუხის ფორმატი
                                                    </label>
                                                    <p className="text-xs text-muted-foreground ml-8">როგორ უნდა იყოს სტრუქტურირებული პასუხი?</p>
                                                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                                                        <SelectTrigger className="ml-8 w-[calc(100%-2rem)]">
                                                            <SelectValue placeholder="სტანდარტული (AI გადაწყვეტს)" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {outputFormats.map(item => (
                                                                <SelectItem key={item.value} value={item.value}>
                                                                    {item.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Step 6: Constraints */}
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-medium">
                                                        <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary font-bold">6</span>
                                                        დამატებითი ინსტრუქციები (არასავალდებულო)
                                                    </label>
                                                    <p className="text-xs text-muted-foreground ml-8">სიგრძის ლიმიტი, რა ჩავრთოთ/გამოვტოვოთ, სპეციფიკური მოთხოვნები?</p>
                                                    <Textarea
                                                        className="ml-8 w-[calc(100%-2rem)]"
                                                        placeholder="მაგალითი: მოაქციე 500 სიტყვის ფარგლებში. ჩართე კონკრეტული მეტრიკები. მოერიდე ზოგად რჩევებს."
                                                        value={constraints}
                                                        onChange={(e) => setConstraints(e.target.value)}
                                                    />
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-3 pt-4">
                                                    <div data-tour-step="generate-btn" className="flex-1">
                                                        <Button
                                                            onClick={generatePrompt}
                                                            className="w-full btn-shine animate-cta-pulse bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                                                            size="lg"
                                                        >
                                                            <TbBolt className="w-5 h-5 mr-2" />
                                                            შექმენი პრომპტი
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        onClick={clearForm}
                                                        variant="outline"
                                                        size="lg"
                                                    >
                                                        გასუფთავება
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="history">
                                        <Card className="border shadow-lg">
                                            <CardContent className="p-6">
                                                <PromptHistory
                                                    onSelect={(p) => {
                                                        setGeneratedPrompt(p.content)
                                                        setRole(p.formData.role)
                                                        setTask(p.formData.task)
                                                    }}
                                                    onCopy={async (content) => {
                                                        await navigator.clipboard.writeText(content)
                                                        setCopied(true)
                                                        setTimeout(() => setCopied(false), 2000)
                                                    }}
                                                />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="templates">
                                        <Card className="border shadow-lg">
                                            <CardContent className="p-6">
                                                <PromptTemplates
                                                    onSelect={(t) => {
                                                        setGeneratedPrompt(t.content)
                                                    }}
                                                />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="gallery">
                                        <Card className="border shadow-lg">
                                            <CardContent className="p-6">
                                                <PromptGallery
                                                    onSelect={(p) => {
                                                        setGeneratedPrompt(p.content)
                                                    }}
                                                    onCopy={async (content) => {
                                                        await navigator.clipboard.writeText(content)
                                                        setCopied(true)
                                                        setTimeout(() => setCopied(false), 2000)
                                                    }}
                                                />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            {/* Output Side */}
                            <div className="space-y-6">
                                {/* Generated Prompt */}
                                <div data-tour-step="output-section">
                                    <Card className="border shadow-lg">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                                                        <TbFileText className="w-4 h-4 text-accent" />
                                                    </div>
                                                    <h3 className="text-lg font-bold">შენი პრომპტი</h3>
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <ModelSelector
                                                        settings={modelSettings}
                                                        onSettingsChange={setModelSettings}
                                                        data-tour-step="model-selector"
                                                    />
                                                    {generatedPrompt && (
                                                        <>
                                                            <Button
                                                                onClick={enhancePrompt}
                                                                variant="outline"
                                                                size="sm"
                                                                disabled={isEnhancing}
                                                                className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-500/50"
                                                                data-tour-step="enhance-btn"
                                                            >
                                                                {isEnhancing ? (
                                                                    <>
                                                                        <TbLoader2 className="w-4 h-4 mr-1 animate-spin" />
                                                                        მუშაობს...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <TbSparkles className="w-4 h-4 mr-1 text-purple-500" />
                                                                        AI გაუმჯობესება
                                                                    </>
                                                                )}
                                                            </Button>
                                                            <Button
                                                                onClick={copyToClipboard}
                                                                variant="outline"
                                                                size="sm"
                                                                className={copied ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' : ''}
                                                            >
                                                                {copied ? (
                                                                    <>
                                                                        <TbCheck className="w-4 h-4 mr-1" />
                                                                        დაკოპირდა!
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <TbCopy className="w-4 h-4 mr-1" />
                                                                        კოპირება
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="bg-secondary/50 rounded-xl p-4 min-h-[300px] text-sm whitespace-pre-wrap relative" style={{ fontFamily: "'Noto Sans Georgian', sans-serif" }}>
                                                {isEnhancing && (
                                                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="relative">
                                                                <TbSparkles className="w-8 h-8 text-purple-500 animate-pulse" />
                                                                <div className="absolute inset-0 animate-ping">
                                                                    <TbSparkles className="w-8 h-8 text-purple-500/50" />
                                                                </div>
                                                            </div>
                                                            <span className="text-sm text-muted-foreground">AI აუმჯობესებს პრომპტს...</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {generatedPrompt || (
                                                    <span className="text-muted-foreground">
                                                        შენი გენერირებული პრომპტი გამოჩნდება აქ...
                                                        {'\n\n'}
                                                        შეავსე ფორმა და დააჭირე "შექმენი პრომპტი" ღილაკს სრულყოფილი პრომპტის შესაქმნელად.
                                                        {'\n\n'}
                                                        <span className="text-primary flex items-center gap-1">
                                                            <TbSparkles className="w-4 h-4 inline" /> შემდეგ გამოიყენე "AI გაუმჯობესება" რომ AI-მ კიდევ უფრო დახვეწოს!
                                                        </span>
                                                    </span>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* AI Tools Section - Only show when prompt is generated */}
                                {generatedPrompt && (
                                    <div className="grid gap-4">
                                        {/* Token Counter & Actions Row */}
                                        <div className="flex items-center justify-between">
                                            <TokenCounter text={generatedPrompt} />
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const blob = new Blob([generatedPrompt], { type: 'text/plain' })
                                                        const url = URL.createObjectURL(blob)
                                                        const a = document.createElement('a')
                                                        a.href = url
                                                        a.download = 'prompt.txt'
                                                        a.click()
                                                    }}
                                                >
                                                    <TbDownload className="w-4 h-4 mr-1" />
                                                    Export
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Version TbHistory */}
                                        <Card className="border">
                                            <CardContent className="p-4">
                                                <PromptVersions
                                                    promptId={currentPromptId}
                                                    currentContent={generatedPrompt}
                                                    onRestore={(content) => setGeneratedPrompt(content)}
                                                />
                                            </CardContent>
                                        </Card>

                                        {/* Quality Score */}
                                        <Card className="border">
                                            <CardContent className="p-4">
                                                <PromptQuality
                                                    prompt={generatedPrompt}
                                                    onScoreReceived={async (score, feedback) => {
                                                        if (currentPromptId) {
                                                            await fetch(`/api/prompts/${currentPromptId}`, {
                                                                method: 'PUT',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ qualityScore: score, qualityFeedback: feedback })
                                                            })
                                                        }
                                                    }}
                                                />
                                            </CardContent>
                                        </Card>

                                        {/* Test Prompt */}
                                        <Card className="border">
                                            <CardContent className="p-4">
                                                <PromptChat prompt={generatedPrompt} />
                                            </CardContent>
                                        </Card>

                                        {/* Share */}
                                        {shareToken && (
                                            <Card className="border">
                                                <CardContent className="p-4">
                                                    <PromptShare
                                                        promptId={currentPromptId || ''}
                                                        shareToken={shareToken}
                                                        isPublic={isPublic}
                                                        onTogglePublic={async (newValue) => {
                                                            setIsPublic(newValue)
                                                            if (currentPromptId) {
                                                                await fetch(`/api/prompts/${currentPromptId}`, {
                                                                    method: 'PUT',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ isPublic: newValue })
                                                                })
                                                            }
                                                        }}
                                                    />
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                )}

                                {/* A/B Testing */}
                                <Card className="border">
                                    <CardContent className="p-4">
                                        <PromptABTest
                                            currentPromptId={currentPromptId || undefined}
                                            promptHistory={promptHistory}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Analytics Dashboard */}
                                <Card className="border">
                                    <CardContent className="p-4">
                                        <PromptAnalyticsDashboard />
                                    </CardContent>
                                </Card>

                                {/* Pro Tips */}
                                <Card className="border bg-gradient-to-br from-primary/5 to-accent/5">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <TbBulb className="w-5 h-5 text-yellow-500" />
                                            <h4 className="font-bold">AI პრო რჩევები</h4>
                                        </div>
                                        <ul className="space-y-3 text-sm text-muted-foreground">
                                            <li className="flex gap-2">
                                                <TbSparkles className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                                                <span><strong className="text-foreground">AI იდეები</strong> — როლის არჩევის შემდეგ დააჭირე "AI იდეები" და მიიღე შემოთავაზებები</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <TbWand className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                                <span><strong className="text-foreground">გააუმჯობესე დავალება</strong> — ჩაწერე ბუნდოვანი დავალება და AI გახდის კონკრეტულს</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <TbStars className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                                                <span><strong className="text-foreground">AI გაუმჯობესება</strong> — პრომპტის გენერაციის შემდეგ AI კიდევ უფრო დახვეწავს</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <TbRefresh className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                                <span><strong className="text-foreground">იტერაცია</strong> — რამდენჯერმე გააუმჯობესე სანამ სრულყოფილი არ იქნება</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Examples Section */}
                        <section className="mt-20">
                            <div className="text-center mb-10">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-3 flex items-center justify-center gap-2"><TbLibrary className="w-6 h-6" /> პრომპტების ნიმუშები</h2>
                                <p className="text-muted-foreground">დაათვალიერეთ შედეგების მაგალითები</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {examples.map((example, index) => (
                                    <Card key={index} className="hover-lift">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                                    <example.icon className="w-5 h-5 text-primary" />
                                                </div>
                                                <h4 className="font-bold">{example.title}</h4>
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-3">{example.params}</p>
                                            <div className="bg-secondary/50 rounded-lg p-3 text-sm">
                                                {example.result}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* Compatible AI Models */}
                        <section className="mt-20">
                            <Card className="border bg-gradient-to-br from-primary/5 to-accent/5">
                                <CardContent className="p-8 text-center">
                                    <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2"><TbRobot className="w-5 h-5" /> თავსებადი AI მოდელები</h3>
                                    <p className="text-muted-foreground mb-6">ეს პრომპტები მუშაობს ყველა პოპულარულ AI მოდელთან</p>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {['ChatGPT', 'Claude', 'Gemini', 'Groq', 'Mistral', 'LLaMA', 'Copilot'].map((model) => (
                                            <Badge key={model} variant="outline" className="px-4 py-2 text-sm">
                                                {model}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Before/After Section */}
                        <section className="mt-20">
                            <div className="text-center mb-10">
                                <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
                                    <TbSparkles className="w-3 h-3 mr-1" />
                                    ტრანსფორმაცია
                                </Badge>
                                <h2 className="text-2xl sm:text-3xl font-bold mb-3">სანამ და შემდეგ</h2>
                                <p className="text-muted-foreground">ნახე როგორ გარდაიქმნება ჩვეულებრივი პრომპტი სრულყოფილად</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Before */}
                                <Card className="border-destructive/30 hover-lift">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Badge variant="destructive" className="text-xs">სანამ</Badge>
                                            <span className="text-sm text-muted-foreground">ჩვეულებრივი პრომპტი</span>
                                        </div>
                                        <div className="bg-destructive/5 rounded-lg p-4 text-sm font-mono border border-destructive/20">
                                            დამიწერე მარკეტინგის გეგმა
                                        </div>
                                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <span className="text-destructive">✗</span>
                                                <span>არ აქვს კონტექსტი</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-destructive">✗</span>
                                                <span>ბუნდოვანი მოლოდინები</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-destructive">✗</span>
                                                <span>ზოგადი პასუხი კარგია</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* After */}
                                <Card className="border-green-500/30 hover-lift glow-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Badge className="bg-green-500 text-white text-xs">შემდეგ</Badge>
                                            <span className="text-sm text-muted-foreground">AI Builder-ით</span>
                                        </div>
                                        <div className="bg-green-500/5 rounded-lg p-4 text-sm font-mono border border-green-500/20 max-h-40 overflow-y-auto">
                                            შენ ხარ ექსპერტი მარკეტინგის სტრატეგი. კომუნიკაცია გააკეთე პირდაპირი და ლაკონური სტილით.

                                            **კონტექსტი:**
                                            მცირე B2B SaaS კომპანია ვმართავ 5 თანამშრომლით

                                            **დავალება:**
                                            შექმენი 12-კვირიანი მარკეტინგის კამპანიის გეგმა...
                                        </div>
                                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-500">✓</span>
                                                <span>მკაფიო როლი და ექსპერტიზა</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-500">✓</span>
                                                <span>კონკრეტული კონტექსტი</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-500">✓</span>
                                                <span>სტრუქტურირებული პასუხი</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* Pricing Section */}
                        <section id="pricing-section" className="mt-20 scroll-mt-20">
                            <div className="text-center mb-10">
                                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                                    <TbStars className="w-3 h-3 mr-1" />
                                    გეგმები
                                </Badge>
                                <h2 className="text-2xl sm:text-3xl font-bold mb-3">აირჩიე შენთვის სასურველი გეგმა</h2>
                                <p className="text-muted-foreground">დაიწყე უფასოდ, გააფართოე საჭიროებისამებრ</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                {/* Free Plan */}
                                <Card className="border hover-lift">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-6">
                                            <h3 className="text-2xl font-bold mb-2">უფასო</h3>
                                            <div className="text-4xl font-bold text-primary">$0</div>
                                            <p className="text-sm text-muted-foreground mt-1">სამუდამოდ უფასო</p>
                                        </div>
                                        <ul className="space-y-3 mb-8">
                                            <li className="flex items-center gap-2">
                                                <TbCheck className="w-5 h-5 text-green-500" />
                                                <span>5 პრომპტი დღეში</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <TbCheck className="w-5 h-5 text-green-500" />
                                                <span>ბაზისური შაბლონები</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <TbCheck className="w-5 h-5 text-green-500" />
                                                <span>ისტორიის შენახვა (7 დღე)</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <TbCheck className="w-5 h-5 text-green-500" />
                                                <span>1 AI გაუმჯობესება დღეში</span>
                                            </li>
                                        </ul>
                                        <Button className="w-full" variant="outline" size="lg">
                                            დაწყება უფასოდ
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Pro Plan */}
                                <Card className="border-2 border-primary relative hover-lift animate-rainbow-glow">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-primary text-primary-foreground animate-pulse">
                                            <TbSparkles className="w-3 h-3 mr-1" />
                                            პოპულარული
                                        </Badge>
                                    </div>
                                    <CardContent className="p-8">
                                        <div className="text-center mb-6">
                                            <h3 className="text-2xl font-bold mb-2">Pro</h3>
                                            <div className="text-4xl font-bold text-gradient">$9.99</div>
                                            <p className="text-sm text-muted-foreground mt-1">თვეში</p>
                                        </div>
                                        <ul className="space-y-3 mb-8">
                                            <li className="flex items-center gap-2">
                                                <TbCheck className="w-5 h-5 text-green-500" />
                                                <span className="font-medium">უსაზღვრო პრომპტები</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <TbCheck className="w-5 h-5 text-green-500" />
                                                <span>ყველა შაბლონი</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <TbCheck className="w-5 h-5 text-green-500" />
                                                <span>უსაზღვრო AI გაუმჯობესება</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <TbCheck className="w-5 h-5 text-green-500" />
                                                <span>იმპორტი/ექსპორტი</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <TbCheck className="w-5 h-5 text-green-500" />
                                                <span>A/B ტესტირება</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <TbCheck className="w-5 h-5 text-green-500" />
                                                <span>პრიორიტეტული მხარდაჭერა</span>
                                            </li>
                                        </ul>
                                        <Button className="w-full btn-shine animate-cta-glow bg-gradient-to-r from-primary to-accent text-white" size="lg">
                                            <TbBolt className="w-5 h-5 mr-2" />
                                            გახდი Pro
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section className="mt-20">
                            <div className="text-center mb-10">
                                <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
                                    FAQ
                                </Badge>
                                <h2 className="text-2xl sm:text-3xl font-bold mb-3">ხშირად დასმული კითხვები</h2>
                            </div>

                            <div className="max-w-3xl mx-auto space-y-4">
                                {[
                                    {
                                        q: "რა არის Prompt Builder?",
                                        a: "Prompt Builder არის AI ინსტრუმენტი, რომელიც გეხმარება შექმნა სრულყოფილი პრომპტები ChatGPT, Claude და სხვა AI მოდელებისთვის. ის აავტომატიზებს საუკეთესო პრაქტიკებს და გეხმარება მიიღო უკეთესი პასუხები AI-სგან."
                                    },
                                    {
                                        q: "რა AI მოდელებთან მუშაობს?",
                                        a: "Prompt Builder-ით შექმნილი პრომპტები მუშაობს ყველა პოპულარულ AI მოდელთან: ChatGPT (GPT-4, GPT-3.5), Claude, Gemini, Groq, Mistral, LLaMA და Microsoft Copilot."
                                    },
                                    {
                                        q: "რამდენი პრომპტი შემიძლია შევქმნა უფასოდ?",
                                        a: "უფასო გეგმით შეგიძლია შექმნა 5 პრომპტი დღეში, გამოიყენო 1 AI გაუმჯობესება და შეინახო ისტორია 7 დღის განმავლობაში. Pro გეგმით ყველაფერი უსაზღვროა."
                                    },
                                    {
                                        q: "როგორ მუშაობს AI გაუმჯობესება?",
                                        a: "როცა შექმნი პრომპტს, შეგიძლია დააჭირო 'AI გაუმჯობესება' ღილაკს. AI გააანალიზებს შენს პრომპტს და დაამატებს დამატებით დეტალებს, გახდის უფრო კონკრეტულს და ეფექტურს."
                                    },
                                    {
                                        q: "შემიძლია გავაზიარო პრომპტები?",
                                        a: "დიახ! ყველა პრომპტს აქვს უნიკალური ლინკი გაზიარებისთვის. ასევე შეგიძლია გააქვეყნო პრომპტი საჯარო გალერეაში სხვების დასახმარებლად."
                                    }
                                ].map((faq, index) => (
                                    <Card key={index} className="hover-lift">
                                        <CardContent className="p-6">
                                            <details className="group">
                                                <summary className="flex items-center justify-between cursor-pointer list-none">
                                                    <h4 className="font-medium">{faq.q}</h4>
                                                    <span className="text-primary transition-transform group-open:rotate-180">
                                                        ▼
                                                    </span>
                                                </summary>
                                                <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                                                    {faq.a}
                                                </p>
                                            </details>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* ROI Calculator / Time Saved */}
                        <section className="mt-20">
                            <Card className="border bg-gradient-to-br from-green-500/5 to-accent/5 overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="grid md:grid-cols-2 gap-8 items-center">
                                        <div>
                                            <Badge className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
                                                ROI
                                            </Badge>
                                            <h3 className="text-2xl font-bold mb-4">რამდენ დროს დაზოგავ?</h3>
                                            <p className="text-muted-foreground mb-6">
                                                საშუალო მომხმარებელი ზოგავს 15-20 წუთს ყოველ პრომპტზე.
                                                თვეში 50 პრომპტით ეს არის 12+ საათი დაზოგილი დრო.
                                            </p>
                                            <div className="grid grid-cols-3 gap-4 text-center">
                                                <div className="bg-background/50 rounded-lg p-4">
                                                    <div className="text-3xl font-bold text-primary">15</div>
                                                    <div className="text-xs text-muted-foreground">წუთი / პრომპტი</div>
                                                </div>
                                                <div className="bg-background/50 rounded-lg p-4">
                                                    <div className="text-3xl font-bold text-accent">12+</div>
                                                    <div className="text-xs text-muted-foreground">საათი / თვე</div>
                                                </div>
                                                <div className="bg-background/50 rounded-lg p-4">
                                                    <div className="text-3xl font-bold text-green-500">3x</div>
                                                    <div className="text-xs text-muted-foreground">უკეთესი პასუხები</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="inline-block p-8 bg-background/80 rounded-2xl">
                                                <div className="text-6xl font-bold text-gradient mb-2">144</div>
                                                <div className="text-lg text-muted-foreground">საათი წელიწადში</div>
                                                <p className="text-sm text-muted-foreground mt-2">≈ 6 სამუშაო დღე</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Final CTA */}
                        <section className="mt-20 mb-10">
                            <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
                                <CardContent className="p-8 text-center">
                                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">მზად ხარ დაიწყო?</h3>
                                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                                        შეუერთდი 12,847+ მომხმარებელს, რომლებიც უკვე ქმნიან უკეთეს პრომპტებს AI Builder-ით.
                                    </p>
                                    <Button
                                        size="lg"
                                        onClick={() => document.getElementById('builder-section')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="btn-shine animate-cta-glow bg-gradient-to-r from-primary to-accent text-white text-lg px-10 py-6"
                                    >
                                        <TbBolt className="w-6 h-6 mr-2" />
                                        შექმენი პირველი პრომპტი
                                    </Button>
                                </CardContent>
                            </Card>
                        </section>
                    </div>
                </section>
            </div>

            {/* Onboarding Tour */}
            <OnboardingTour steps={promptBuilderTourSteps} />
        </>
    )
}
