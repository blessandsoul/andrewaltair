import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  Sparkles,
  Send,
  User,
  MessageCircle,
  Share2,
  Heart
} from "lucide-react"
import { ReactionBar } from "@/components/interactive/ReactionBar"
import { ShareButtons } from "@/components/interactive/ShareButtons"
import { Comments } from "@/components/interactive/Comments"
import postsData from "@/data/posts.json"
import { brand } from "@/lib/brand"

// Find post by slug
function getPost(slug: string) {
  return postsData.find(p => p.slug === slug)
}

// Get related posts
function getRelatedPosts(currentSlug: string, category: string) {
  return postsData
    .filter(p => p.slug !== currentSlug)
    .slice(0, 2)
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">სტატია ვერ მოიძებნა</h1>
          <p className="text-muted-foreground">
            სამწუხაროდ, მოთხოვნილი სტატია არ არსებობს.
          </p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ბლოგზე დაბრუნება
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const relatedPosts = getRelatedPosts(slug, post.category)
  const categoryInfo = brand.categories.find(c => c.id === post.category)

  // Sample content for demo (in real app, this would come from CMS/MDX)
  const sampleContent = `
    <h2>რა არის ${post.title.replace(/[🦆💻🔥🎨⚔️🤖📚🆓]/g, '').trim()}?</h2>
    <p>${post.excerpt}</p>
    
    <h3>რატომ არის ეს მნიშვნელოვანი?</h3>
    <p>ხელოვნური ინტელექტის სამყაროში ყოველდღიური ცვლილებები ხდება. ამ სტატიაში განვიხილავთ ყველაზე მნიშვნელოვან ასპექტებს და პრაქტიკულ რჩევებს.</p>
    
    <h3>ძირითადი პუნქტები</h3>
    <ul>
      <li>პირველი მნიშვნელოვანი პუნქტი</li>
      <li>მეორე საინტერესო აღმოჩენა</li>
      <li>მესამე პრაქტიკული რჩევა</li>
      <li>მეოთხე დასკვნა</li>
    </ul>
    
    <h3>დასკვნა</h3>
    <p>იმედი მაქვს ეს სტატია სასარგებლო იყო. გამოიწერე ჩემი არხი მეტი კონტენტისთვის!</p>
  `

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="absolute inset-0 noise-overlay"></div>
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            ბლოგზე დაბრუნება
          </Link>

          {/* Post Header */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge
                style={{
                  backgroundColor: `${categoryInfo?.color}20`,
                  color: categoryInfo?.color,
                  borderColor: `${categoryInfo?.color}40`
                }}
              >
                {categoryInfo?.name || post.category}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.publishedAt}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readingTime} წთ
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.views.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {post.comments}
              </span>
              <span className="text-sm text-red-500 flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {Object.values(post.reactions).reduce((a: number, b: number) => a + b, 0)}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Share2 className="w-4 h-4" />
                {post.shares}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold">{post.author.name}</div>
                <div className="text-sm text-muted-foreground">{post.author.role}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <article
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-card prose-pre:border prose-pre:border-border
              prose-ul:list-disc prose-li:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: sampleContent }}
          />

          {/* Reactions & Share */}
          <div className="mt-12 pt-8 border-t border-border space-y-8">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-4">რეაქციები</h4>
              <ReactionBar reactions={post.reactions} size="lg" />
            </div>

            <ShareButtons
              url={`https://andrewaltair.ge/blog/${post.slug}`}
              title={post.title}
            />

            {/* Comments */}
            <Comments postId={post.id} className="pt-8 border-t border-border" />
          </div>
        </div>
      </section>

      {/* Author Bio */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold">Andrew Altair</h3>
                    <p className="text-muted-foreground">AI ინოვატორი და კონტენტ კრეატორი</p>
                  </div>
                  <p className="text-muted-foreground">
                    {brand.stats.yearsExperience} წელზე მეტი გამოცდილება ხელოვნურ ინტელექტში. ვიზიარებ AI-ს საიდუმლოებებს, ხრიკებს და ტუტორიალებს ქართულად.
                  </p>
                  <div className="flex gap-3">
                    <Button size="sm" asChild>
                      <Link href="/about">
                        <User className="w-4 h-4 mr-2" />
                        ჩემ შესახებ
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={brand.social.telegram}>
                        <Send className="w-4 h-4 mr-2" />
                        Telegram
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">მსგავსი სტატიები</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                <Card className="h-full hover-lift card-shine border-0 shadow-lg group">
                  <CardContent className="p-6 space-y-3">
                    <Badge variant="secondary" className="text-xs">
                      {brand.categories.find(c => c.id === relatedPost.category)?.name || relatedPost.category}
                    </Badge>
                    <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {relatedPost.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {relatedPost.comments}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-red-500">
                          <Heart className="w-3.5 h-3.5" />
                          {Object.values(relatedPost.reactions).reduce((a: number, b: number) => a + b, 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-3.5 h-3.5" />
                          {relatedPost.shares}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-90"></div>
        <div className="absolute inset-0 noise-overlay"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center text-white">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">მოგეწონა სტატია?</h2>
            <p className="text-white/80">
              გამოიწერე და მიიღე ახალი AI სტატიები პირველმა
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              <Send className="w-4 h-4 mr-2" />
              გამოწერა
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
