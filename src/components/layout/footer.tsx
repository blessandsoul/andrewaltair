import Link from "next/link"
import Script from "next/script"
import {
  TbRobot,
  TbMail,
  TbBrandGithub,
  TbBrandTwitter,
  TbBrandLinkedin,
  TbBrandInstagram,
  TbBrandYoutube,
  TbSend,
  TbExternalLink
} from "react-icons/tb"
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
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white">
                  <TbRobot className="w-6 h-6" />
                </div>
                <span className="font-bold text-xl text-gradient">Andrew Altair</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                ხელოვნური ინტელექტის ექსპერტი. AI-ს შესახებ ვიზიარებ ცოდნას, ტუტორიალებს და პრაქტიკულ რჩევებს.
              </p>
              <div className="flex gap-2">
                <Link href={brand.social.youtube} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <TbBrandYoutube className="w-4 h-4" />
                </Link>
                <Link href={brand.social.instagram} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <TbBrandInstagram className="w-4 h-4" />
                </Link>
                <Link href={brand.social.telegram} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <TbSend className="w-4 h-4" />
                </Link>
                <Link href={brand.social.github} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <TbBrandGithub className="w-4 h-4" />
                </Link>
                <Link href={brand.social.linkedin} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <TbBrandLinkedin className="w-4 h-4" />
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
                    ჩემს შესახებ
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
                  <TbMail className="w-4 h-4" />
                  <div className="flex flex-col">
                    <span>andrewaltair@icloud.com</span>
                    <span>andr3waltair@gmail.com</span>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <TbSend className="w-4 h-4" />
                  <Link href={brand.social.telegram} className="hover:text-foreground transition-colors">
                    @andr3waltairchannel
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <TbBrandYoutube className="w-4 h-4" />
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

      {/* TOP.GE Counter */}
      <div id="top-ge-counter-container" data-site-id="117786" />
      <Script src="//counter.top.ge/counter.js" strategy="lazyOnload" />
    </footer>
  )
}
