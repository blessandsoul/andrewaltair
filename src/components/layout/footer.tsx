import Link from "next/link"
import Script from "next/script"
import {
  TbRobot,
  TbBrandGithub,
  TbBrandLinkedin,
  TbBrandInstagram,
  TbBrandYoutube,
  TbSend,
} from "react-icons/tb"
import { brand } from "@/lib/brand"

const socialLinks = [
  { href: brand.social.youtube, icon: TbBrandYoutube, label: "YouTube" },
  { href: brand.social.instagram, icon: TbBrandInstagram, label: "Instagram" },
  { href: brand.social.telegram, icon: TbSend, label: "Telegram" },
  { href: brand.social.github, icon: TbBrandGithub, label: "GitHub" },
  { href: brand.social.linkedin, icon: TbBrandLinkedin, label: "LinkedIn" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="h-16 flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-linear-to-br from-primary to-primary-container rounded-lg flex items-center justify-center text-white">
              <TbRobot className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-on-surface">Altair AI</span>
          </Link>

          {/* Copyright */}
          <p className="text-xs text-on-surface-variant order-last sm:order-0">
            © {currentYear} Andrew Altair
          </p>

          {/* Social + Counters */}
          <div className="flex items-center gap-1">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-muted transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
            <div className="ml-2 flex items-center gap-2">
              <div id="top-ge-counter-container" data-site-id="117786" />
              <div id="oxo-ge-counter-container" data-site-id="7" data-counter-style="5" data-counter-color="#ffffff" />
            </div>
          </div>

        </div>
      </div>

      <Script src="//counter.top.ge/counter.js" strategy="lazyOnload" />
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
