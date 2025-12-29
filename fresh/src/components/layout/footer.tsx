import Link from "next/link"
import { Mail, Github, Twitter, Linkedin, Instagram, Youtube, Send, ExternalLink, Sparkles } from "lucide-react"
import { brand } from "@/lib/brand"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {/* Brand */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gradient">Andrew Altair</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                ხელოვნური ინტელექტის ექსპერტი. AI-ს შესახებ ვიზიარებ ცოდნას, ტუტორიალებს და პრაქტიკულ რჩევებს.
              </p>
              <div className="flex gap-2">
                <Link href={brand.social.youtube} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Youtube className="w-4 h-4" />
                </Link>
                <Link href={brand.social.instagram} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </Link>
                <Link href={brand.social.telegram} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Send className="w-4 h-4" />
                </Link>
                <Link href={brand.social.github} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Github className="w-4 h-4" />
                </Link>
                <Link href={brand.social.linkedin} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">ნავიგაცია</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    მთავარი
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                    ბლოგი
                  </Link>
                </li>
                <li>
                  <Link href="/videos" className="text-muted-foreground hover:text-foreground transition-colors">
                    ვიდეოები
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
                    ინსტრუმენტები
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    ჩემ შესახებ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">კატეგორიები</h4>
              <ul className="space-y-3 text-sm">
                {brand.categories.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/blog?category=${cat.id}`}
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">კონტაქტი</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  andrew@andrewaltair.ge
                </li>
                <li className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <Link href={brand.social.telegram} className="hover:text-foreground transition-colors">
                    @andrewaltair
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <Youtube className="w-4 h-4" />
                  <Link href={brand.social.youtube} className="hover:text-foreground transition-colors">
                    YouTube არხი
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} Andrew Altair. ყველა უფლება დაცულია.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                კონფიდენციალურობა
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                პირობები
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
