import type { ReactNode } from "react";
import Link from "next/link";
import { TbBrandGithub, TbArrowUpRight, TbChevronLeft } from "react-icons/tb";
import styles from "./andrezi.module.css";

const LAYERS = [
  { name: "მყარი ტიპიზებული მეხსიერება", desc: "MEMORY.md-ის შეზღუდული ინდექსი ტიპიზებული მეხსიერების ფაილების თავზე. მეხსიერებაში შენახული წესები, რომლებითაც აგენტი ხელმძღვანელობს." },
  { name: "ძებნის ბაზა", desc: "სტანდარტული ბიბლიოთეკის FTS5, პლუს არასავალდებულო ლოკალური ვექტორული დონე. პოულობს იმას, რასაც შეზღუდული ინდექსი ვერ იტევს." },
  { name: "მუშაობის ტელემეტრია", desc: "თითოეული ხელსაწყოს გამოძახება იწერება SQLite-ში, რათა მხოლოდ რეაგირება კი არ მოახდინოთ, არამედ გააანალიზოთ განმეორებადი შეცდომები." },
  { name: "ნულოვანი ტოკენების რეზიუმე", desc: "git-ისა და მუშაობის ჟურნალის დეტერმინირებული გაერთიანება ქმნის ბოლო სესიის რეზიუმეს; შემდეგი სესია მას უფასოდ, ტოკენების გარეშე იყენებს." },
  { name: "წაკითხვის ფილტრი", desc: "იწერს, თუ რომელი ავტორიტეტული სპეციფიკაცია წაიკითხა აგენტმა ამ სესიაზე, რათა ჩაწერის წინა შემოწმებამ დაბლოკოს კოდის გენერირება უბრალო რეზიუმეზე დაყრდნობით." },
  { name: "ერთპროცესიანი დისპეტჩერიზაცია", desc: "უშვებს მთელ ეტაპს ერთ პროცესში და ინარჩუნებს ბლოკირების ლოგიკას." },
];

const BRIDGE: { word: string; role: string; sys: string; bold?: string[] }[] = [
  { word: "ანდრეზი", role: "მეხსიერებაში შენახული კანონი", sys: "თქვენი მყარი, ტიპიზებული მეხსიერება და მისგან მიღებული წესები" },
  { word: "ხევისბერი", role: "ხევისბერი, მცველი და მსაჯული", sys: "ფუნქციები და ჰიგიენა, რომლებიც შლის დუბლიკატებს, აწესებს ლიმიტებს და უზრუნველყოფს შესრულებას" },
  { word: "საუნჯე", role: "დაცული საცავი", sys: "შეზღუდული ინდექსი, რომელიც ვერ გადაიტვირთება" },
  { word: "ფასკუნჯი", role: "ფასკუნჯი, რომელსაც გმირი ქვესკნელიდან ამოჰყავს", sys: "ძებნა და ამოღება, ინფორმაციის ამოტანა სიღრმეებიდან" },
  { word: "რიტუალი", role: "რომლის საშუალებითაც კანონი შეიძლება შეიცვალოს", sys: "გაყინული მომენტის წესი: მეხსიერება ძალაში შედის მომდევნო სესიაზე და არა შუა საუბრისას", bold: ["გაყინული მომენტის წესი"] },
];

const FAILS = [
  { label: "გადახრა", text: "აგენტი ყოველ სესიაზე რეზიუმედან ხელახლა აყალიბებს წესს და ნელ-ნელა შორდება პირვანდელ აზრს." },
  { label: "გადატვირთვა", text: "მუდმივად ჩატვირთული მეხსიერება იზრდება იქამდე, სანამ ძირითად სამუშაო სივრცეს არ შეავიწროებს." },
  { label: "ცივი სტარტი", text: "ყოველი ახალი სესია პროექტის არსის ნულიდან ახსნას მოითხოვს." },
  { label: "გადაუმოწმებელი წესები", text: "გამოტანილი დასკვნა უბრალო ფრაზად იქცევა, რომლის შესრულებასაც არავინ აკონტროლებს." },
];

const CLAUSES: { text: string; bold: string[] }[] = [
  { text: "ახალ კომპიუტერზე თქვენ იღებთ ცარიელ, კარგად აწყობილ საფუძველს. ის კარგი ხდება ისე, როგორც ანდრეზი: რეალურ პრაქტიკაში ცხოვრებით, იმ წესების დამკვიდრებით, რომლებიც მუდმივად მეორდება.", bold: [] },
  { text: "სისტემა გადადის. გამოცდილება არ გადადის. შინაარსს და თანმიმდევრულობას თქვენ უზრუნველყოფთ.", bold: ["სისტემა გადადის", "გამოცდილება არ გადადის"] },
  { text: "მხოლოდ ზოგადი ბირთვია ღია. პირადი მეხსიერება, წესები და სპეციფიკაციები დახურული რჩება.", bold: ["ზოგადი ბირთვია ღია"] },
  { text: "თუ ეძებთ მარტივ ღილაკს, რომლითაც აგენტს ყველაფერი დაამახსოვრდება, ეს პროექტი ამისთვის არ არის და, რეალურად, ასეთი რამ არც არსებობს.", bold: [] },
];

// gentle highland elevation contours for the hero backdrop
const CONTOURS = [
  "M-40,150 C220,110 380,200 620,160 S980,120 1240,180",
  "M-40,230 C200,190 420,270 640,232 S1010,196 1240,250",
  "M-40,312 C240,276 400,350 620,312 S1000,280 1240,330",
  "M-40,398 C180,360 440,432 660,398 S1020,366 1240,412",
  "M-40,486 C260,452 380,520 640,486 S1000,456 1240,500",
];

function withBold(text: string, phrases: string[]): ReactNode {
  if (!phrases.length) return text;
  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "g"));
  return parts.map((part, i) => (phrases.includes(part) ? <strong key={i}>{part}</strong> : part));
}

export default function AndreziLanding() {
  return (
    <div className={styles.page}>
      {/* HERO */}
      <header className={styles.hero}>
        <svg className={styles.contour} viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {CONTOURS.map((d, i) => (
            <path key={i} d={d} className={`${i === 0 ? styles.peak : ""} ${styles.drawPath}`} />
          ))}
        </svg>

        <div className={`${styles.shell} ${styles.heroEnter}`}>
          <Link href="/projects" className={styles.backLink}>
            <TbChevronLeft size={14} /> პროექტები
          </Link>
          <h1 className={styles.heroWord}>ანდრეზი</h1>
          <p className={styles.heroLatin}>a n d r e z i</p>
          <p className={styles.heroTagline}>მეხსიერება, რომელიც მართავს</p>
          <div className={styles.heroMeta}>
            <span><span className={styles.dot} /> Andrew Altair</span>
            <span>პროექტი 01</span>
            <span>2026</span>
            <span>MIT, ღია კოდი</span>
          </div>
        </div>
      </header>

      {/* THE ANDREZI */}
      <section className={styles.section}>
        <div className={styles.shell}>
          <span className={styles.eyebrow}>ანდრეზი</span>
          <p className={styles.lead}>
            საქართველოს მთიანეთში <span className={styles.amber}>ანდრეზი</span> არის დაუწერელი, მეხსიერებაში შენახული სამართალი, რომელსაც თემი ატარებს და რომლითაც ცხოვრობს.
          </p>
          <p className={`${styles.body} ${styles.kicker}`}>
            ქაღალდზე არაფერია დაწერილი. კანონს ხალხი ინახავს, ხევისბერი წარმოთქვამს, სალოცავი იცავს და ის განსაზღვრავს, თუ როგორ მოქმედებს თემი. ახალი წესი მასში მხოლოდ სათანადო რიტუალით შედის და არა ვინმეს ახირებით, შუა დავის დროს. <strong>Andrezi სწორედ ეს არის პროგრამული აგენტისთვის:</strong> მეხსიერებაში შენახული კანონი, რომელიც მას სესიიდან სესიაში გადააქვს. მას ჰყავს თავისი მცველი, რომელიც ფილტრავს მას, საცავი, რომელიც ინახავს და რიტუალი, რომელიც მას ცვლის.
          </p>

          <div className={styles.bridge}>
            {BRIDGE.map((b) => (
              <div className={styles.bridgeRow} key={b.word}>
                <div className={styles.folk}>
                  <div className={styles.folkWord}>{b.word}</div>
                  <div className={styles.folkRole}>{b.role}</div>
                </div>
                <div className={styles.node} />
                <div className={styles.sys}>{withBold(b.sys, b.bold ?? [])}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY GOVERNANCE */}
      <section className={styles.section}>
        <div className={styles.shell}>
          <span className={styles.eyebrow}>რატომ მართვა და არა შენახვა</span>
          <p className={styles.lead}>მეხსიერების ხელსაწყოების უმეტესობა შენახვასა და ძებნას აუმჯობესებს. თუმცა, რეალური პრობლემები სრულიად სხვა რამეში ვლინდება.</p>
          <div className={styles.fails}>
            {FAILS.map((f) => (
              <div className={styles.failItem} key={f.label}>
                <div className={styles.failLabel}>{f.label}</div>
                <div className={styles.failText}>{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIX LAYERS */}
      <section className={styles.section}>
        <div className={styles.shell}>
          <span className={styles.eyebrow}>ექვსი დონე</span>
          <p className={styles.lead}>შეზღუდული ინდექსი უსასრულო ბაზის თავზე, სადაც თითოეული დონე დამოუკიდებლადაც სასარგებლოა.</p>
          <div className={styles.strata}>
            {LAYERS.map((l, i) => (
              <div className={styles.stratum} key={l.name}>
                <div className={styles.stratumNo}>{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className={styles.stratumName}>{l.name}</div>
                  <div className={styles.stratumDesc}>{l.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HONEST FRAMING */}
      <section className={styles.section}>
        <div className={styles.shell}>
          <span className={styles.eyebrow}>რა არის ეს და რა არ არის</span>
          <p className={styles.lead}>ეს არის პლატფორმა, რომელსაც თავად ავითარებთ და არა ჯადოსნური მეხსიერება, რომელსაც უბრალოდ აინსტალირებთ.</p>
          <div className={styles.inscription}>
            {CLAUSES.map((c, i) => (
              <div className={styles.clause} key={i}>
                <span className={styles.clauseTick}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.clauseText}>{withBold(c.text, c.bold)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.shell}>
          <span className={styles.eyebrow}>კოდის ნახვა</span>
          <p className={styles.lead}>იყენებს მხოლოდ სტანდარტულ ბიბლიოთეკებს, შეცდომისას ინარჩუნებს ხელმისაწვდომობას, ყველაფერი ლოკალურია. MIT.</p>
          <div className={styles.ctaRow}>
            <a className={`${styles.btn} ${styles.btnPrimary}`} href="https://github.com/andrewaltair/andrezi" target="_blank" rel="noopener noreferrer">
              <TbBrandGithub size={18} /> ნახვა GitHub-ზე
            </a>
            <Link className={`${styles.btn} ${styles.btnGhost}`} href="/projects">
              სხვა პროექტები <TbArrowUpRight size={16} />
            </Link>
          </div>
          <p className={styles.footnote}>
            github.com/andrewaltair/andrezi · MIT · შექმნილია <a href="/">Andrew Altair</a>-ის მიერ
          </p>
        </div>
      </section>
    </div>
  );
}
