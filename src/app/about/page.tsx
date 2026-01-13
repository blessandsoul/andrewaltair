import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TbSparkles,
  TbMail,
  TbSend,
  TbBrandYoutube,
  TbBrandInstagram,
  TbBriefcase,
  TbSchool,
  TbFileText,
  TbBulb,
  TbRocket,
  TbCalendar,
  TbTarget,
  TbTimeline
} from "react-icons/tb"
import { brand } from "@/lib/brand"
import { AboutManifest } from "@/components/about/AboutManifest"
import { AboutInspiration } from "@/components/about/AboutInspiration"
import { AboutStartPath } from "@/components/about/AboutStartPath"
import { AboutContactWidget } from "@/components/about/AboutContactWidget"
import { AboutOnlineStatus } from "@/components/about/AboutOnlineStatus"

const expertise = [
  {
    icon: TbBulb,
    title: "ChatGPT & Prompt Engineering",
    description: "პრომპტების ოპტიმიზაცია და AI-სთან ეფექტური კომუნიკაცია",
    color: "#f59e0b"
  },
  {
    icon: TbRocket,
    title: "AI ავტომატიზაცია",
    description: "ბიზნეს პროცესების ავტომატიზაცია ხელოვნური ინტელექტით",
    color: "#6366f1"
  },
  {
    icon: TbBriefcase,
    title: "AI კონსულტაცია",
    description: "კომპანიებისთვის AI სტრატეგიის შემუშავება და დანერგვა",
    color: "#22d3ee"
  },
  {
    icon: TbSchool,
    title: "AI განათლება",
    description: "ტრეინინგები და ვორქშოპები AI-ს შესახებ",
    color: "#10b981"
  }
]

const timeline = [
  {
    year: "2025",
    title: "AI ლექტორი და სპიკერი",
    company: "Tech Park & Universities",
    description: "AI მასტერკლასები, კორპორატიული ტრეინინგები და საჯარო გამოსვლები"
  },
  {
    year: "2024",
    title: "AI კონტენტ კრეატორი",
    company: "AndrewAltair.GE",
    description: "საქართველოში პირველი მასშტაბური AI საგანმანათლებლო პლატფორმის შექმნა"
  },
  {
    year: "2023",
    title: "Chief AI Officer",
    company: "Future Tech Solutions",
    description: "კომპანიის ტრანსფორმაცია და AI აგენტური სისტემების დანერგვა"
  },
  {
    year: "2020",
    title: "Senior Tech Consultant",
    company: "Global Innovation Hub",
    description: "ციფრული პროდუქტების სტრატეგია და ტექნოლოგიური განვითარება"
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="absolute inset-0 noise-overlay"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left: Photo & Quick Info */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl blur-2xl opacity-50"></div>
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10">
                  <Image
                    src="/i.png"
                    alt="Andrew Altair"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Online Status */}
              <div className="mb-6">
                <AboutOnlineStatus />
              </div>

              <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
                <Link href={brand.social.youtube}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <TbBrandYoutube className="w-4 h-4 text-red-500" />
                    YouTube
                  </Button>
                </Link>
                <Link href={brand.social.instagram}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <TbBrandInstagram className="w-4 h-4 text-pink-500" />
                    Instagram
                  </Button>
                </Link>
                <Link href={brand.social.telegram}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <TbSend className="w-4 h-4 text-sky-500" />
                    Telegram
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Bio */}
            <div className="space-y-6">
              <Badge variant="secondary" className="px-4 py-2">
                <div className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></div>
                AI არქიტექტორი & ფუტურისტი
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-gradient">Andrew Altair</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                ვარ AI არქიტექტორი და ტექნოლოგიური ევანგელისტი.
                {brand.stats.yearsExperience} წელზე მეტია ვქმნი ციფრულ მომავალს და
                ვეხმარები ადამიანებს, გამოიყენონ <strong>აგენტური სისტემები</strong> და <strong>მულტიმოდალური მოდელები</strong>.
              </p>

              <p className="text-lg text-muted-foreground/80 leading-relaxed">
                ჩემი მისიაა — გავხადო <strong>General Purpose AI</strong> და <strong>Reasoning Models</strong> (o1, Claude 3.5, Gemini 2) ხელმისაწვდომი და გასაგები.
                ვქმნი კონტენტს სუპერ-ინტელექტის, ავტონომიური აგენტებისა და ციფრული სინთეზის შესახებ.
              </p>

              <div className="flex gap-4">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-white glow-sm" asChild>
                  <Link href="#contact">
                    <TbMail className="w-4 h-4 mr-2" />
                    დაკავშირება
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/blog">
                    <TbFileText className="w-4 h-4 mr-2" />
                    ბლოგი
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient">{brand.stats.yearsExperience}</div>
              <div className="text-sm text-muted-foreground mt-1">წელი ტექნოლოგიებში</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient">{brand.stats.subscribers}</div>
              <div className="text-sm text-muted-foreground mt-1">კომუნიტის წევრი</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient">{brand.stats.articles}</div>
              <div className="text-sm text-muted-foreground mt-1">პუბლიკაცია</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient">{brand.stats.projects}</div>
              <div className="text-sm text-muted-foreground mt-1">დანერგილი სისტემა</div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifest - What I Believe */}
      <AboutManifest />

      {/* Expertise */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 text-primary">
              <TbTarget className="w-6 h-6" />
              <span className="text-sm font-bold uppercase tracking-widest">ექსპერტიზა</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">ჩემი ექსპერტიზა</h2>
            <p className="text-muted-foreground mt-2">მომავლის ტექნოლოგიები</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {expertise.map((item) => (
              <Card key={item.title} className="group hover-lift border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration - Movies */}
      <AboutInspiration />

      {/* Start Path - User Journey */}
      <AboutStartPath />

      {/* Timeline */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 text-primary">
              <TbTimeline className="w-6 h-6" />
              <span className="text-sm font-bold uppercase tracking-widest">გზა</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">ჩემი გზა</h2>
            <p className="text-muted-foreground mt-2">პროექტები და გამოცდილება</p>
          </div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.year.slice(2)}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2"></div>
                  )}
                </div>
                <Card className="flex-1 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <TbCalendar className="w-4 h-4" />
                      {item.year}
                    </div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-primary text-sm">{item.company}</p>
                    <p className="text-muted-foreground mt-2">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Widget */}
      <div id="contact">
        <AboutContactWidget />
      </div>
    </div>
  )
}
