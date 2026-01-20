import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { AuthProvider } from "@/lib/auth";
import { ToastProvider } from "@/components/ui/toast";
import { ConfirmDialogProvider } from "@/components/ui/confirm-dialog";
import { CookieBanner } from "@/components/ui/CookieBanner";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-georgian",
  subsets: ["georgian", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://andrewaltair.ge'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  title: {
    default: "Andrew Altair | AI ექსპერტი საქართველოში",
    template: "%s | Andrew Altair"
  },
  description: "AI ექსპერტი საქართველოში. ვეხმარები ბიზნესს AI-ს დანერგვაში. ChatGPT 5.2, Claude 4.5, Grok 3, Gemini 3, Qwen, DeepSeek. ვიდეო: Kling, Veo, Higgsfield. გრაფიკა: Midjourney, Nano Banana. Vibe Coding: Cursor, VSCode, Windsurf. N8N ავტომატიზაცია.",
  keywords: [
    // ===== BRAND & CORE =====
    "AI Expert Georgia",
    "Andrew Altair",
    "ენდრიუ ალტეირი",
    "ხელოვნური ინტელექტი საქართველოში",
    "AI ექსპერტი თბილისში",
    "AI ექსპერტი საქართველოში",

    // ===== AI BUSINESS SERVICES (HIGH INTENT) =====
    "AI ინტეგრაცია ბიზნესში ფასი",
    "ChatGPT დანერგვა კომპანიაში",
    "AI chatbot შექმნა ქართულად",
    "ბიზნეს პროცესების ავტომატიზაცია AI",
    "AI კონსულტანტი საქართველოში",
    "AI ბიზნესისთვის თბილისში",
    "ხელოვნური ინტელექტის ტრენინგი თანამშრომლებისთვის",
    "AI სტრატეგია მცირე ბიზნესისთვის",
    "მარკეტინგის ავტომატიზაცია AI-თ",
    "AI კლიენტების მომსახურება",
    "ავტომატური email მარკეტინგი AI",
    "AI სოციალური მედიის მართვა",
    "AI კონტენტ გენერაცია ბიზნესისთვის",
    "AI CRM სისტემა",
    "AI გაყიდვების პროგნოზირება",
    "AI HR რეკრუტმენტი",
    "AI ფინანსური ანალიზი",
    "AI ინვენტარის მართვა",
    "AI ფასების ოპტიმიზაცია",
    "AI კლიენტების სეგმენტაცია",
    "AI რეკომენდაციის სისტემა",
    "ვებსაიტზე AI ასისტენტი",
    "AI საქმიანი ანალიტიკა",
    "AI დოკუმენტების დამუშავება",
    "AI ხმოვანი ბოტი ბიზნესისთვის",
    "AI პროდუქტიულობის ინსტრუმენტები",
    "თბილისში AI კონსულტაცია",
    "AI როგორ დაზოგავს ხარჯებს",
    "AI ROI კალკულატორი ბიზნესისთვის",
    "AI აუთსორსინგი საქართველოში",
    "AI პილოტ პროექტი ბიზნესისთვის",

    // ===== AI LEARNING (HIGH INTENT) =====
    "ChatGPT სწავლება თბილისში",
    "AI კურსები დამწყებთათვის ქართულად",
    "prompt engineering კურსი საქართველოში",
    "AI ტრენინგი ონლაინ ქართულად",
    "როგორ ვისწავლო AI უფასოდ",
    "AI სერტიფიკატი საქართველოში",
    "ChatGPT პრაქტიკული გაკვეთილები",
    "AI ბიზნეს ტრენინგი",
    "AI მარკეტერებისთვის კურსი",
    "AI აქაუნთერებისთვის",
    "AI იურისტებისთვის",
    "AI დიზაინერებისთვის",
    "AI გამყიდველებისთვის",
    "AI HR მენეჯერებისთვის",
    "AI სტარტაპერებისთვის",
    "ერთდღიანი AI ვორქშოფი",
    "AI კორპორატიული ტრენინგი",
    "AI უნარების განვითარება",
    "AI bootcamp საქართველოში",
    "AI მენტორინგი",
    "AI 1-ზე-1 სწავლება",
    "AI გუნდური ტრენინგი",
    "AI სასწავლო მასალები ქართულად",
    "AI პრაქტიკული პროექტები",
    "AI ონლაინ აკადემია",
    "AI უფასო ვებინარი",
    "AI სასწავლო ვიდეოები",
    "AI სწავლების პლატფორმა ქართულად",
    "AI თვითსწავლება გზამკვლევი",
    "AI ბიზნეს კეისები",

    // ===== PROBLEM-SOLUTION KEYWORDS =====
    "როგორ შევამცირო ხარჯები AI-თ",
    "AI დროის ეკონომია ბიზნესში",
    "კლიენტების მომსახურება 24/7 AI",
    "AI გაყიდვების გაზრდა",
    "AI თანამშრომლების დატვირთვის შემცირება",
    "AI რუტინული სამუშაოების ავტომატიზაცია",
    "AI ადამიანური შეცდომების თავიდან აცილება",
    "AI მასშტაბირება ბიზნესისთვის",
    "AI კონკურენტებზე წინ გასწრება",
    "AI პროდუქტიულობის გაორმაგება",
    "როგორ ავტომატიზდეს email პასუხები",
    "AI მონაცემთა ანალიზი სწრაფად",
    "AI მომხმარებელთა უკმაყოფილების შემცირება",
    "AI საშუალოდ რამდენს დაზოგავს",
    "AI ინვესტიციის დაბრუნება",
    "AI გადაწყვეტა პატარა გუნდისთვის",

    // ===== INDUSTRY SPECIFIC =====
    "AI რესტორნებისთვის თბილისში",
    "AI სასტუმროებისთვის",
    "AI ონლაინ მაღაზიებისთვის",
    "AI სამედიცინო კლინიკებისთვის",
    "AI იურიდიულ ფირმებისთვის",
    "AI საბუღალტრო კომპანიებისთვის",
    "AI უძრავი ქონების ბიზნესისთვის",
    "AI სააგენტოებისთვის",
    "AI დამწყებ მეწარმეებს",
    "AI ფრილანსერებისთვის",
    "AI სტუდენტებისთვის უფასო",
    "AI რესტორნის მენიუს ოპტიმიზაცია",
    "AI რეზერვაციის სისტემა",
    "AI სამშენებლო კომპანიებისთვის",
    "AI სამედიცინო ჩანაწერების მართვა",
    "AI პაციენტების შეხსენება",
    "AI ადვოკატების დოკუმენტაცია",
    "AI უძრავი ქონების განცხადებები",
    "AI სილამაზის სალონებისთვის",
    "AI ფიტნეს ცენტრებისთვის",
    "AI სასწავლო ცენტრებისთვის",
    "AI ავტოსერვისებისთვის",
    "AI ტურისტული სააგენტოებისთვის",
    "AI ფოტოგრაფებისთვის",
    "AI Event-ების ორგანიზებისთვის",

    // ===== TOOLS & TECHNOLOGIES =====
    "Vibe Coding",
    "Cursor IDE",
    "VSCode AI",
    "Windsurf",
    "Antigravity",
    "Claude Code",
    "ChatGPT 5",
    "Claude 4",
    "Grok 3",
    "Gemini 2",
    "Qwen",
    "DeepSeek",
    "N8N",
    "N8N ავტომატიზაცია",
    "AI აგენტები",
    "AI აგენტები ბიზნესისთვის",
    "ავტონომიური AI სისტემები",
    "ChatGPT ალტერნატივები ქართულად",
    "AI ავტომატიზაცია სამუშაოსთვის",
    "AI პრომპტ ინჟინერინგი",
    "AI კოდირების ასისტენტები",
    "AI ხმოვანი ასისტენტები",
    "Anthropic Claude vs OpenAI GPT",
    "LangChain პროექტები",
    "AutoGPT",
    "autonomous agents",

    // ===== VIDEO & GRAPHICS AI =====
    "Kling AI",
    "Veo 2",
    "Higgsfield",
    "Midjourney",
    "Nano Banana",
    "AI ვიდეო გენერატორი",
    "AI გრაფიკა",
    "AI დიზაინი",
    "AI სურათების გენერაცია",
    "AI logo generator",
    "AI background removal",
    "AI image upscaling",
    "DALL-E 3",
    "Stable Diffusion",

    // ===== GEORGIAN SPECIFIC =====
    "AI ქართულად",
    "ChatGPT ქართული ენით",
    "AI თარგმანი ქართულად",
    "ქართული AI chatbot",
    "AI სადღეგრძელო",
    "ხელოვნური ინტელექტი",
    "ტექნოლოგიები",
    "მანქანური სწავლება",
    "საქართველო",
    "AI სერვისები ბათუმში",
    "AI ტრენინგი თბილისი",
    "AI ვორქშოფი საქართველო",
    "AI მარკეტინგი ქართულ ბაზარზე",
    "AI e-commerce საქართველოში",

    // ===== MYSTIC AI TOOLS =====
    "AI ტაროს კითხვა",
    "AI მისნობა ქართულად",
    "AI ჰოროსკოპი",
    "AI სიზმრების ახსნა",
    "AI ნუმეროლოგია",
    "AI სიყვარულის კალკულატორი",
    "AI მთვარის ფაზები",
    "AI მისტიკოსი",

    // ===== COMPARATIVE KEYWORDS =====
    "AI vs ადამიანი ხარჯები",
    "ChatGPT vs Gemini ბიზნესისთვის",
    "AI vs ტრადიციული CRM",
    "AI chatbot vs live chat",
    "AI კონტენტი vs კოპირაიტერი",
    "საუკეთესო AI პლატფორმა საქართველოში",
    "AI სერვისების შედარება ფასები",
    "AI კონსულტანტების შედარება",
    "AI კურსების შედარება თბილისში",
    "უფასო AI ალტერნატივები",

    // ===== PRICE-ORIENTED KEYWORDS =====
    "AI სერვისები იაფად",
    "AI კონსულტაცია უფასოდ პირველი შეხვედრა",
    "AI დანერგვა ფასი საქართველო",
    "AI ტრენინგი ხელმისაწვდომი ფასი",
    "AI განვადება ბიზნესისთვის",
    "AI საწყისი პაკეტი",
    "AI სრული პაკეტი VIP",
    "AI ფასდაკლება სტარტაპებისთვის",
    "AI უფასო trial",

    // ===== MICRO-SPECIFIC CONTENT KEYWORDS =====
    "AI Instagram-ის პოსტების დაწერა",
    "AI Facebook-ის რეკლამების გენერაცია",
    "AI email-ების ავტომატური პასუხი",
    "AI ზარების ტრანსკრიფცია ქართულად",
    "AI შეხვედრების ჩანაწერები",
    "AI ხელშეკრულებების შედგენა",
    "AI კომერციული წინადადება generator",
    "AI LinkedIn პოსტების დაწერა",
    "AI Google Ads კამპანიის შექმნა",
    "AI landing page-ის copy",
    "AI product description-ები",
    "AI blog სტატიის დაწერა",
    "AI SEO ოპტიმიზაცია",
    "AI კონკურენტების ანალიზი",
    "AI SWOT ანალიზი generator",
    "AI business plan-ის დაწერა",
    "AI pitch deck-ის შექმნა",

    // ===== PLATFORM SPECIFIC =====
    "AI WhatsApp Business ავტომატიზაცია",
    "AI Telegram bot ბიზნესისთვის",
    "AI Instagram Stories generator",
    "AI TikTok video ideas",
    "AI YouTube thumbnail generator",
    "AI Shopify product optimizer",
    "AI WooCommerce automation",
    "AI WordPress plugin AI",
    "AI Excel formulas generator",
    "AI Google Sheets automation",

    // ===== FINANCIAL BENEFIT KEYWORDS =====
    "AI-თ შემოსავლის გაზრდა",
    "როგორ ვიშოვო მეტი AI-თ",
    "AI პასიური შემოსავალი",
    "AI-თ დაზოგვა საკადრო ხარჯებში",
    "AI მარკეტინგის ხარჯების შემცირება",
    "AI კონვერსიის გაზრდა",
    "AI წამყვანების გენერაცია",

    // ===== SPEED & SIMPLICITY =====
    "AI დანერგვა 1 დღეში",
    "AI სწრაფი setup 24 საათში",
    "AI მზა გამოსაყენებლად",
    "AI კოდის გარეშე",
    "AI ტექნიკური ცოდნის გარეშე",
    "AI 5 წუთში გამოყენება",
    "AI მარტივი როგორც WhatsApp",
    "AI ავტომატური კონფიგურაცია",
    "AI step-by-step გზამკვლევი",
    "AI ვიდეო ინსტრუქცია ქართულად",
    "AI 24/7 support ქართულად",

    // ===== GEORGIAN BUSINESS SPECIFIC =====
    "AI შპს რეგისტრაციის დოკუმენტების აღწერა",
    "AI საგადასახადო დეკლარაციის ახსნა",
    "AI სახელმწიფო ტენდერის განაცხადი",
    "AI მუნიციპალიტეტის წერილი ოფიციალური",
    "AI იურიდიული მოთხოვნა ქართულად",
    "AI ხელშეკრულება სამშენებლო სამუშაოებზე",
    "AI იჯარის ხელშეკრულება თბილისი",
    "AI სამუშაო ხელშეკრულება ქართული კანონმდებლობით",
    "AI შვებულების განაცხადი ქართული",
    "AI ბიზნეს გეგმა ქართული ბანკისთვის",
    "AI საგრანტო განაცხადი ქართული ფონდისთვის",
    "AI სტარტაპის pitch ქართულ ინვესტორებზე",
    "AI ბიზნეს შეთავაზება ქართულ პარტნიორებზე",
    "AI მემორანდუმი ქართული კომპანიებისთვის",
    "AI სპონსორობის მოთხოვნა ქართული ბიზნესისთვის",
    "AI B2B email ქართულ ბაზარზე",

    // ===== GEORGIAN EDUCATION =====
    "AI სკოლის დამრიგებლის მიმართვა მშობლებზე",
    "AI მასწავლებლის შეფასების კომენტარი",
    "AI მოსწავლის დახასიათება რეკომენდაციით",
    "AI სასწავლო გეგმა ქართული სკოლისთვის",
    "AI გაკვეთილის კონსპექტი ქართულად",
    "AI ტესტის შეკითხვები ქართულ ენაზე",
    "AI დიპლომის პროექტის თემის აღწერა",
    "AI სამაგისტრო ნაშრომის აბსტრაქტი ქართულად",
    "AI სამეცნიერო სტატიის რეზიუმე ქართულად",
    "AI ტრენინგის პროგრამა ქართული აუდიტორიისთვის",
    "AI რეკომენდაციის წერილი უნივერსიტეტისთვის",
    "AI მოტივაციური წერილი სტიპენდიაზე",

    // ===== URGENT SITUATION KEYWORDS =====
    "როგორ ვუპასუხო უფროსს გაბრაზებულ წერილს AI-თ",
    "AI დაგვიანების გამართლება დამაჯერებელი",
    "AI ვადის გაცდენის ახსნა",
    "AI კლიენტთან შეხვედრის გაუქმება ბოლო წამზე",
    "AI პრეზენტაციის ჩანაწერები რომ არ დავივიწყო",
    "AI სადღეგრძელო ქორწილში ბოლო წუთზე",
    "AI გამოსამშვიდობებელი სიტყვა კომპანიიდან წასვლისას",
    "AI მისასალმებელი სიტყვა ახალი თანამშრომლისთვის",
    "AI ბოდიშის სიტყვა საჯარო შეცდომაზე",
    "AI negative review პასუხის დაწერა",
    "AI angry customer პასუხის გენერატორი",
    "AI refund request პასუხი",
    "AI complaint response template",

    // ===== GEORGIAN CULTURAL =====
    "AI სუფრის სიტყვა ქართული ტრადიციით",
    "AI ქართული სადღეგრძელო ოჯახზე",
    "AI მამის დღის მილოცვა ქართულად",
    "AI დედის დღის სიტყვები გულწრფელი",
    "AI ქორწილის მოწვევა ქართული სტილით",
    "AI შობის მილოცვა ქრისტიანული",
    "AI ახალი წლის სადღეგრძელო ქართული",
    "AI აღდგომის მილოცვა ტრადიციული",

    // ===== COMPETITIVE ADVANTAGE =====
    "AI კონკურენტებზე წინ",
    "AI საიდუმლო იარაღი ბიზნესისთვის",
    "AI ექსკლუზიური სტრატეგია",
    "AI პირველი ინდუსტრიაში",
    "AI სწრაფი ზრდა startup-ისთვის",
    "AI სკალირება გუნდის გაზრდის გარეშე",
    "AI ადგილობრივი ბაზრის დომინირება",
    "AI ბრენდის დიფერენციაცია",
    "AI ინოვაციური გადაწყვეტა",
    "AI ექსპერტის სტატუსი",
    "AI ინდუსტრიის ლიდერობა",
    "AI სწრაფი შედეგები",
    "AI plug-and-play გადაწყვეტა",

    // ===== ROLE-TARGETED =====
    "AI CEO-სთვის გადაწყვეტილებისთვის",
    "AI CFO-სთვის ფინანსური ანალიზი",
    "AI CMO-სთვის მარკეტინგი",
    "AI HR დირექტორისთვის",
    "AI IT ხელმძღვანელისთვის",
    "AI გაყიდვების მენეჯერისთვის",
    "AI პროექტის მენეჯერისთვის",
    "AI SMM მენეჯერისთვის",
    "AI კონტენტ მენეჯერისთვის",
    "AI SEO სპეციალისტისთვის",
    "AI copywriter-ისთვის",
    "AI graphic designer-ისთვის",
    "AI video editor-ისთვის",

    // ===== FUTURE TECH TRENDS =====
    "AGI artificial general intelligence სიახლეები",
    "AI safety და ეთიკა",
    "AI რეგულაციები საქართველოში",
    "vector databases საქართველოში",
    "retrieval augmented generation RAG",
    "AI hallucination პრობლემის გადაჭრა",
    "federated learning სისტემები",
    "edge AI მოწყობილობები",

    // ===== OFFERS & PROMOTIONS =====
    "AI Black Friday ფასდაკლება",
    "AI სტუდენტური ფასდაკლება",
    "AI startup-ების პროგრამა",
    "AI NGO-სთვის უფასოდ",
    "AI რეფერალ ბონუსი",
    "AI money-back გარანტია",
    "AI lifetime deal საქართველოში",
    "AI ჯგუფური ფასდაკლება",
    "AI კორპორატიული ფასი",
    "AI VIP მომსახურება პრემიუმ",

    // ===== HEALTHCARE & MEDICAL =====
    "AI ექიმთან ვიზიტის აღწერა სადაზღვევოსთვის",
    "AI სამედიცინო ცნობის მოთხოვნა",
    "AI ანალიზების შედეგების ახსნა მარტივად",
    "AI პაციენტის ისტორია ქართულად",
    "AI ჯანმრთელობის დაზღვევის განაცხადი",
    "AI კლინიკის appointment-ის დადასტურება",
    "AI ექიმის რეკომენდაციის ახსნა",
    "AI დიაგნოზის ახსნა არასამედიცინო ენით",
    "AI მკურნალობის გეგმის აღწერა",
    "AI წამლის მიღების ინსტრუქცია ქართულად",

    // ===== GOVERNMENT SERVICES =====
    "AI საჯარო ინფორმაციის მოთხოვნა",
    "AI ადმინისტრაციულ ორგანოში საჩივარი",
    "AI მერიის წერილი პრობლემის შესახებ",
    "AI კომუნალური მომსახურების რეკლამაცია",
    "AI საკუთრების დამადასტურებელი დოკუმენტების მოთხოვნა",
    "AI მშენებლობის ნებართვის განაცხადი",
    "AI მოქალაქეობის განაცხადი ქართული",

    // ===== DATA & ANALYTICS =====
    "AI Excel pivot table interpreter",
    "AI Google Analytics insights ქართულად",
    "AI dashboard narrative generator",
    "AI data visualization description",
    "AI chart title generator",
    "AI survey results summarizer",
    "AI A/B test results interpreter",
    "AI conversion funnel bottleneck finder",
    "AI customer journey map creator",
    "AI user persona generator from data",
    "AI retention report writer",
    "AI churn analysis insights",
    "AI LTV calculation explainer",

    // ===== CREATIVE CONTENT =====
    "AI Instagram reel hook first 3 seconds",
    "AI TikTok viral opening line",
    "AI clickbait title ethical version",
    "AI curiosity gap headline",
    "AI listicle headline generator",
    "AI how-to title optimizer",
    "AI emotional trigger headline",
    "AI power words for CTA",
    "AI urgency phrases not salesy",
    "AI scarcity message generator",
    "AI FOMO trigger subtle",
    "AI social proof sentence",
    "AI benefit bullet points",
    "AI feature to benefit converter",
    "AI USP statement generator",
    "AI brand tagline ideas",
    "AI company slogan creator",

    // ===== TECHNICAL ASSISTANCE =====
    "AI error message user-friendly",
    "AI 404 page copy creative",
    "AI loading screen message",
    "AI success notification text",
    "AI confirmation message reassuring",
    "AI tooltip text helpful",
    "AI button copy action-oriented",
    "AI form field label clear",
    "AI validation error message kind",
    "AI empty state message encouraging",
    "AI onboarding tooltip sequence",
    "AI progress bar motivational text",
    "AI completion message celebratory",

    // ===== MEETING & COMMUNICATION =====
    "AI დილის briefing გუნდისთვის",
    "AI weekly standup update generator",
    "AI retrospective meeting summary",
    "AI brainstorming session notes",
    "AI action items extractor შეხვედრიდან",
    "AI followup tasks assignment",
    "AI deadline reminder diplomatic",
    "AI status update stakeholders",
    "AI executive summary 1 paragraph",
    "AI TL;DR generator long document",
    "AI key takeaways bullet points",
    "AI meeting decline politely",
    "AI reschedule meeting request",
    "AI out of office message creative",

    // ===== FINANCE & ACCOUNTING =====
    "AI invoice description generator",
    "AI payment reminder polite",
    "AI budget proposal narrative",
    "AI expense report summary",
    "AI financial forecast explanation",
    "AI revenue report highlights",
    "AI profit margin analysis text",
    "AI cash flow explanation simple",
    "AI tax optimization tips ქართული",
    "AI investment proposal summary",
    "AI funding request pitch",
    "AI investor update email",
    "AI board meeting financial summary",
    "AI quarterly report highlights",

    // ===== HR & RECRUITMENT =====
    "AI job description generator ქართულად",
    "AI candidate rejection letter kind",
    "AI interview feedback constructive",
    "AI offer letter template ქართული",
    "AI promotion announcement internal",
    "AI termination letter professional",
    "AI performance review comments",
    "AI salary negotiation response",
    "AI employee recognition message",
    "AI team milestone celebration",
    "AI new hire announcement",
    "AI exit interview questions",
    "AI succession planning memo",
    "AI diversity statement authentic",

    // ===== LEGAL & CONTRACTS =====
    "AI NDA summary plain language",
    "AI contract clause explanation",
    "AI terms of service readable",
    "AI privacy policy user-friendly",
    "AI refund policy fair",
    "AI warranty disclaimer clear",
    "AI liability waiver simple",
    "AI partnership agreement key points",
    "AI license agreement simplified",
    "AI cease and desist letter",
    "AI DMCA takedown notice",
    "AI trademark dispute response",
    "AI IP assignment clause",

    // ===== E-COMMERCE =====
    "AI product description SEO ქართულად",
    "AI category page copy",
    "AI collection description creative",
    "AI size guide explanation",
    "AI shipping policy customer-friendly",
    "AI return instructions clear",
    "AI order confirmation email warm",
    "AI shipping update notification",
    "AI delivery delay apology",
    "AI review request email",
    "AI cart abandonment recovery",
    "AI win-back email sequence",
    "AI loyalty program description",
    "AI VIP customer thank you",
    "AI flash sale announcement",

    // ===== REAL ESTATE =====
    "AI property listing description თბილისი",
    "AI open house invitation",
    "AI rental application follow-up",
    "AI lease renewal notice",
    "AI rent increase communication",
    "AI property maintenance request",
    "AI neighbor dispute letter",
    "AI HOA complaint formal",
    "AI tenant welcome letter",
    "AI move-out instructions",
    "AI security deposit return",

    // ===== PERSONAL DEVELOPMENT =====
    "AI CV summary ქართულად",
    "AI LinkedIn summary professional",
    "AI cover letter personalized",
    "AI portfolio description creative",
    "AI skill description resume",
    "AI achievement quantified",
    "AI career goal statement",
    "AI mentor request email",
    "AI networking follow-up",
    "AI coffee chat request",
    "AI informational interview questions",
    "AI thank you note after interview",
    "AI salary research summary",
    "AI career pivot explanation",
    "AI gap year explanation positive",
    "AI freelance rate justification",
    "AI consultation fee explanation",

    // ===== CONTENT FORMATS =====
    "AI podcast episode description",
    "AI YouTube video description SEO",
    "AI newsletter intro engaging",
    "AI press release headline",
    "AI media pitch email",
    "AI speaker bio short",
    "AI author bio professional",
    "AI course description compelling",
    "AI ebook chapter outline",
    "AI webinar registration page",
    "AI event invitation formal",
    "AI thank you speech short",
    "AI award acceptance speech",
    "AI conference abstract",
    "AI panel discussion questions",

    // ===== QUESTION FORMAT (Voice Search / Featured Snippets) =====
    "როგორ გამოვიყენო ChatGPT ბიზნესში?",
    "რა ღირს AI chatbot-ის შექმნა საქართველოში?",
    "რამდენ ხანში ისწავლება AI პროგრამირება?",
    "ვინ არის საუკეთესო AI კონსულტანტი საქართველოში?",
    "როგორ დავნერგო AI ჩემს კომპანიაში?",
    "რატომ სჭირდება ბიზნესს AI?",
    "რა განსხვავებაა ChatGPT და Claude-ს შორის?",
    "როგორ ვისწავლო prompt engineering?",
    "რა არის Vibe Coding და როგორ მუშაობს?",
    "როგორ შევამცირო ხარჯები AI-ით?",
    "რომელი AI ინსტრუმენტი გამოვიყენო მარკეტინგში?",
    "როგორ გავაკეთო AI chatbot უფასოდ?",
    "რა არის prompt და როგორ დავწერო სწორად?",
    "როგორ გამოვიყენო AI კონტენტის შესაქმნელად?",
    "რომელია საუკეთესო AI კურსი ქართულად?",
    "სად ვისწავლო AI თბილისში?",
    "რამდენი ღირს AI კონსულტაცია?",
    "როგორ მუშაობს AI ტაროს კითხვა?",
    "რა არის AI აგენტი და როგორ გამოვიყენო?",
    "როგორ დავაავტომატიზირო ჩემი ბიზნესი AI-ით?",

    // ===== GEORGIAN CITIES (Local SEO) =====
    "AI კონსულტანტი თბილისში",
    "AI სერვისები ბათუმში",
    "AI ტრენინგი ქუთაისში",
    "AI კურსები რუსთავში",
    "AI კომპანია თბილისი",
    "ChatGPT სწავლება ბათუმი",
    "AI ვორქშოფი ქუთაისი",
    "AI ბიზნეს კონსულტაცია რუსთავი",
    "AI დანერგვა თელავი",
    "AI სერვისები გორი",
    "AI პროფესიონალი ზუგდიდი",
    "AI ექსპერტი ფოთი",
    "AI კონსულტანტი საქართველო რეგიონები",

    // ===== 2025-2026 TRENDS =====
    "AI ტრენდები 2026",
    "ChatGPT 5 სიახლეები 2026",
    "Claude 4 ფუნქციები 2026",
    "Gemini 2.5 განახლებები",
    "AI სიახლეები 2026 საქართველო",
    "AI მომავალი 2025-2030",
    "GPT-5 როდის გამოვა",
    "AI აგენტების ერა 2026",
    "ავტონომიური AI 2026",
    "AI რეგულაციები საქართველოში 2026",
    "AI სამუშაოები 2026",
    "AI კარიერა 2026 საქართველო",
    "AI ხელფასები 2026",
    "AI უნარები 2026 საჭირო",
    "AI ბიზნეს ტრენდები 2026",

    // ===== NEGATIVE INTENT ("without") =====
    "AI პროგრამირების გარეშე",
    "AI კოდირების გარეშე სწავლა",
    "AI ფულის ინვესტიციის გარეშე",
    "AI ტექნიკური ცოდნის გარეშე",
    "AI უფასოდ რეგისტრაციის გარეშე",
    "AI ინგლისურის გარეშე",
    "AI Visa-ს გარეშე გადახდა",
    "AI ბარათის გარეშე",
    "AI სწავლა გამოცდილების გარეშე",
    "AI დაწყება ნულიდან",

    // ===== AI TOOLS & APPS NAMES =====
    "Perplexity vs ChatGPT ქართულად",
    "NotebookLM ქართულად გამოყენება",
    "Claude Artifacts როგორ მუშაობს",
    "ChatGPT Canvas ახსნა",
    "Suno AI მუსიკა ქართულად",
    "Udio AI სიმღერა",
    "Runway Gen-3 ვიდეო",
    "Pika Labs ანიმაცია",
    "Leonardo AI სურათები",
    "Ideogram AI ტექსტით",
    "Flux AI image generator",
    "Krea AI რეალისტური",
    "Magnific AI upscaler",
    "HeyGen AI avatar",
    "ElevenLabs ხმა ქართულად",
    "Descript podcasting AI",
    "Opus Clip AI short videos",
    "Gamma AI presentations",
    "Tome AI slides",
    "Beautiful AI პრეზენტაციები",
    "Canva AI Magic Studio",
    "Notion AI ქართულად",
    "Obsidian AI plugins",
    "Mem AI note-taking",
    "Otter AI transcription",
    "Fireflies AI meeting notes",
    "Fathom AI meeting recorder",
    "Loom AI video summaries",
    "Jasper AI copywriting",
    "Copy AI content",
    "Writesonic ბლოგი",
    "Rytr AI writer",
    "Grammarly AI grammar",
    "Hemingway Editor AI",
    "Quillbot paraphrase AI",
    "Wordtune AI rewriter",
    "Surfer SEO AI",
    "Clearscope AI content",
    "MarketMuse AI strategy",
    "Semrush AI features",
    "Ahrefs AI tools",
    "Zapier AI automation",
    "Make (Integromat) AI",
    "Bardeen AI automation",
    "Browse AI scraping",
    "Apify AI web scraper",
    "Octoparse AI data",
    "PhantomBuster AI lead gen",
    "Apollo AI sales",
    "Instantly AI cold email",
    "Lemlist AI outreach",
    "Lavender AI email coach",

    // ===== COMPARISON KEYWORDS =====
    "ChatGPT vs Claude vs Gemini",
    "Cursor vs Windsurf vs VSCode",
    "Midjourney vs DALL-E vs Stable Diffusion",
    "Kling vs Runway vs Pika",
    "Perplexity vs Google vs ChatGPT",
    "AI უფასო vs ფასიანი რომელი აჯობებს",
    "ChatGPT Plus ღირს თუ არა",
    "Claude Pro vs ChatGPT Plus",
    "AI image generator საუკეთესო 2026",
    "AI video generator შედარება",
    "AI transcription საუკეთესო ქართულისთვის"
  ],
  authors: [{ name: "Andrew Altair", url: "https://andrewaltair.ge" }],
  creator: "Andrew Altair",
  publisher: "Andrew Altair",
  alternates: {
    canonical: "./",
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    title: "Andrew Altair | AI ექსპერტი საქართველოში",
    description: "AI ბიზნესისთვის. ChatGPT, Claude, Grok, Gemini, Midjourney, Kling, N8N. Vibe Coding და AI აგენტები.",
    type: "website",
    locale: "ka_GE",
    siteName: "Andrew Altair",
    url: "https://andrewaltair.ge",
    images: [
      {
        url: "https://andrewaltair.ge/og.png",
        width: 1200,
        height: 630,
        alt: "Andrew Altair - AI ექსპერტი საქართველოში",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@andr3waltair",
    site: "@andr3waltair",
    title: "Andrew Altair | AI ექსპერტი საქართველოში",
    description: "AI ბიზნესისთვის. ChatGPT, Claude, Grok, Gemini, Midjourney, Kling, N8N. Vibe Coding და AI აგენტები.",
    images: ["https://andrewaltair.ge/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
  },
  category: 'technology',
};

// Extended JSON-LD Schemas
const jsonLdSchemas = [
  // Person Schema
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://andrewaltair.ge/#person',
    name: 'Andrew Altair',
    url: 'https://andrewaltair.ge',
    image: 'https://andrewaltair.ge/logo.png',
    jobTitle: 'AI Expert & Tech Consultant',
    description: 'AI ინოვატორი და კონტენტ კრეატორი საქართველოში',
    nationality: {
      '@type': 'Country',
      name: 'Georgia'
    },
    homeLocation: {
      '@type': 'Place',
      name: 'Tbilisi, Georgia'
    },
    areaServed: {
      '@type': 'Country',
      name: 'Georgia'
    },
    sameAs: [
      'https://www.youtube.com/@AndrewAltair',
      'https://www.instagram.com/andr3waltair/',
      'https://www.tiktok.com/@andrewaltair',
      'https://t.me/andr3waltairchannel',
      'https://www.facebook.com/andr3waltair',
      'https://www.threads.net/@andr3waltair',
      'https://x.com/andr3waltair',
      'https://www.linkedin.com/in/andr3waltair'
    ],
    worksFor: {
      '@type': 'Organization',
      '@id': 'https://andrewaltair.ge/#organization'
    }
  },
  // Organization Schema
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://andrewaltair.ge/#organization',
    name: 'Andrew Altair AI',
    url: 'https://andrewaltair.ge',
    logo: {
      '@type': 'ImageObject',
      url: 'https://andrewaltair.ge/logo.png',
      width: 512,
      height: 512
    },
    description: 'AI-ფოკუსირებული პლატფორმა განათლების, მისტიური ინსტრუმენტებისა და ტექნოლოგიური სიახლეებისთვის',
    founder: {
      '@type': 'Person',
      '@id': 'https://andrewaltair.ge/#person'
    },
    areaServed: 'Georgia',
    sameAs: [
      'https://www.youtube.com/@AndrewAltair',
      'https://www.instagram.com/andr3waltair/',
      'https://www.facebook.com/andr3waltair',
      'https://x.com/andr3waltair',
      'https://www.linkedin.com/in/andrewaltair'
    ]
  },
  // WebSite Schema with SearchAction
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://andrewaltair.ge/#website',
    name: 'Andrew Altair',
    url: 'https://andrewaltair.ge',
    description: 'AI ინოვატორი და კონტენტ კრეატორი - ხელოვნური ინტელექტის ექსპერტი',
    publisher: {
      '@type': 'Organization',
      '@id': 'https://andrewaltair.ge/#organization'
    },
    inLanguage: ['ka', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://andrewaltair.ge/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }
];


// Brand JSON-LD (Global Entity)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Andrew Altair - AI Innovator",
  "url": "https://andrewaltair.ge",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://andrewaltair.ge/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "author": {
    "@type": "Person",
    "name": "Andrew Altair",
    "url": "https://andrewaltair.ge"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                  // Light theme is default, no action needed
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchemas) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${notoGeorgian.variable} antialiased font-georgian`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ToastProvider>
            <ConfirmDialogProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
              <CookieBanner />
            </ConfirmDialogProvider>
          </ToastProvider>
        </AuthProvider>

        {/* Google Analytics (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-7YH89CPYF7" strategy="afterInteractive" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-7YH89CPYF7');
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P4T74Z4G');
          `}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P4T74Z4G"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      </body>
    </html>
  );
}

