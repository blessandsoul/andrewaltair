import Link from "next/link"
import Script from "next/script"
import {
  TbRobot,
  TbMail,
  TbBrandGithub,
  TbBrandLinkedin,
  TbBrandInstagram,
  TbBrandYoutube,
  TbSend,
} from "react-icons/tb"
import { brand } from "@/lib/brand"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-surface-container-low dark:bg-[#0f1729]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">

            {/* Brand — span 2 */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-container rounded-xl flex items-center justify-center text-white shadow-sm">
                  <TbRobot className="w-6 h-6" />
                </div>
                <span className="font-headline font-bold text-xl text-on-surface">Altair AI</span>
              </Link>
              <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs">
                {brand.bio.short}
              </p>
              <div className="flex gap-2">
                <a
                  href={brand.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-colors"
                >
                  <TbBrandYoutube className="w-4 h-4" />
                </a>
                <a
                  href={brand.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-colors"
                >
                  <TbBrandInstagram className="w-4 h-4" />
                </a>
                <a
                  href={brand.social.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-colors"
                >
                  <TbSend className="w-4 h-4" />
                </a>
                <a
                  href={brand.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-colors"
                >
                  <TbBrandGithub className="w-4 h-4" />
                </a>
                <a
                  href={brand.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-colors"
                >
                  <TbBrandLinkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Product</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "/blog", label: "ბლოგი" },
                  { href: "/prompts", label: "Prompts" },
                  { href: "/bots", label: "Bots" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-on-surface-variant hover:text-on-surface transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Resources</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "/tools", label: "AI Tools" },
                  { href: "/encyclopedia", label: "Encyclopedia" },
                  { href: "/videos", label: "Tutorials" },
                  { href: "/lessons", label: "Lessons" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-on-surface-variant hover:text-on-surface transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Company</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "/about", label: "Andrew Altair" },
                  { href: "/services", label: "Services" },
                  { href: `mailto:andrewaltair@icloud.com`, label: "Contact" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1.5">
                      {item.href.startsWith("mailto:") && <TbMail className="w-3.5 h-3.5" />}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Legal</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: "/terms", label: "Terms" },
                  { href: "/privacy", label: "Privacy" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-on-surface-variant hover:text-on-surface transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-border/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-on-surface-variant">
            <p>© {currentYear} Andrew Altair. ყველა უფლება დაცულია.</p>
            <div className="flex items-center gap-4">
              {/* TOP.GE & OXO.GE */}
              <div id="top-ge-counter-container" data-site-id="117786" />
              <div id="oxo-ge-counter-container" data-site-id="7" data-counter-style="5" data-counter-color="#ffffff" />
            </div>
          </div>
        </div>
      </div>

      {/* TOP.GE Counter Script */}
      <Script src="//counter.top.ge/counter.js" strategy="lazyOnload" />

      {/* OXO.GE Counter Script */}
      <Script id="oxo-counter-script" strategy="lazyOnload">
        {`(function () {
            var container = document.getElementById('oxo-ge-counter-container');
            if (!container) return;

            var siteId = container.getAttribute('data-site-id');
            if (!siteId) return;

            var style = container.getAttribute('data-counter-style')
                     || container.getAttribute('data-counter-type')
                     || '';
            var color = container.getAttribute('data-counter-color') || '';

            var host = '//oxo.ge';

            var hitUrl = host + '/api/counter_hit?site_id=' + siteId;
            hitUrl += '&r=' + Math.random();
            try {
                if (document.referrer) hitUrl += '&ref=' + encodeURIComponent(document.referrer);
                hitUrl += '&page=' + encodeURIComponent(location.href);
                hitUrl += '&sw=' + (screen.width || 0);
                hitUrl += '&sh=' + (screen.height || 0);
                hitUrl += '&lang=' + encodeURIComponent((navigator.language || navigator.userLanguage || '').substring(0, 10));
            } catch(e) {}

            var pixel = new Image();
            pixel.src = hitUrl;

            var imgUrl = host + '/api/counter_image?site_id=' + siteId;
            if (style) imgUrl += '&style=' + encodeURIComponent(style);
            if (color) imgUrl += '&color=' + encodeURIComponent(color);

            var link = document.createElement('a');
            link.href = host + '/stat?id=' + siteId;
            link.target = '_blank';
            link.title = 'OXO.GE';

            var img = document.createElement('img');
            img.src = imgUrl;
            img.alt = 'OXO.GE Counter';
            img.style.border = 'none';

            link.appendChild(img);
            container.appendChild(link);
        })();`}
      </Script>
    </footer>
  )
}
