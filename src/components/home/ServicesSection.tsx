import Link from "next/link"
import { TbBulb, TbSchool, TbArrowRight } from "react-icons/tb"

const services = [
  {
    id: "consultation",
    title: "AI კონსულტაცია ბიზნესისთვის",
    description: "ჩვენ დაგეხმარებით AI ინსტრუმენტების დანერგვაში თქვენს სამუშაო პროცესებში ეფექტურობის გასაზრდელად.",
    cta: "დაჯავშნე შეხვედრა",
    ctaColor: "text-primary",
    bg: "bg-primary",
    icon: TbBulb,
  },
  {
    id: "training",
    title: "AI ტრენინგები და კურსები",
    description: "ისწავლეთ ხელოვნური ინტელექტის მართვა პროფესიონალურ დონეზე ჩვენი ექსპერტების დახმარებით.",
    cta: "იხილე კურსები",
    ctaColor: "text-secondary-accent",
    bg: "bg-secondary-accent",
    icon: TbSchool,
  },
]

export function ServicesSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {services.map((service) => (
        <Link
          key={service.id}
          href="/services"
          className={`group relative overflow-hidden rounded-2xl ${service.bg} p-10 text-white`}
        >
          {/* Decorative blur */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <service.icon className="w-10 h-10" />
            <h2 className="text-3xl font-black tracking-tight font-headline">{service.title}</h2>
            <p className="text-white/80 max-w-sm leading-relaxed">{service.description}</p>
            <span className={`inline-block bg-white ${service.ctaColor} px-6 py-2 rounded-lg font-bold hover:bg-primary-fixed transition-colors`}>
              {service.cta}
            </span>
          </div>
        </Link>
      ))}
    </section>
  )
}
