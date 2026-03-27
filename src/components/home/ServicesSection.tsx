import Link from "next/link"
import { TbBulb, TbSchool, TbArrowRight } from "react-icons/tb"

const services = [
  {
    id: "consultation",
    title: "AI კონსულტაცია",
    description: "1-on-1 სესიები AI სტრატეგიისა და ბიზნეს ავტომატიზაციისთვის. პირადი ზარი, გეგმა და follow-up მხარდაჭერა.",
    price: "150₾",
    unit: "საათში",
    gradient: "from-primary to-primary-container",
    icon: TbBulb,
  },
  {
    id: "training",
    title: "AI ტრენინგი",
    description: "გუნდის სწავლება AI ინსტრუმენტებზე. 4-საათიანი ინტენსიური სესია, პრაქტიკული სავარჯიშოებით და სასწავლო მასალებით.",
    price: "500₾",
    unit: "გუნდზე",
    gradient: "from-secondary to-secondary/70",
    icon: TbSchool,
  },
]

export function ServicesSection() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-headline font-bold text-on-surface">სერვისები</h2>
        <Link
          href="/services"
          className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          ყველა სერვისი <TbArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Link key={service.id} href="/services" className="group relative overflow-hidden rounded-2xl">
            <div className={`bg-gradient-to-br ${service.gradient} p-8 text-white h-full min-h-[200px] flex flex-col justify-between`}>
              {/* Decorative blur */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{service.description}</p>
              </div>

              <div className="relative z-10 flex items-end justify-between mt-6">
                <div>
                  <span className="text-3xl font-black">{service.price}</span>
                  <span className="text-white/70 text-sm ml-1">/ {service.unit}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <TbArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
