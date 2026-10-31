"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { MotionConfig, motion, useReducedMotion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Play,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { listings, type Listing } from "@/data/listings"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SearchBar, emptyFilters, filterLabels, matchesFilters, type SearchFilters } from "@/components/search-bar"
import { PropertyCard } from "@/components/property-card"
import { PropertyDialog } from "@/components/property-dialog"

const heroSlides = [
  { src: "/images/karen-villa.jpg", alt: "Contemporary villa with an infinity pool in Karen, Nairobi" },
  { src: "/images/muthaiga-mansion.jpg", alt: "Modern mansion with timber cladding in Muthaiga" },
  { src: "/images/westlands-modern.jpg", alt: "Modern timber and glass home in Westlands" },
  { src: "/images/lavington-estate.jpg", alt: "Elegant estate residence in Lavington" },
]

const benefits = [
  {
    icon: ShieldCheck,
    title: "Trusted Expertise",
    description: "Years of experience in the Kenyan market.",
  },
  {
    icon: MapPin,
    title: "Prime Locations",
    description: "The best neighborhoods in Nairobi and beyond.",
  },
  {
    icon: Users,
    title: "Client Focused",
    description: "Your goals are our priority.",
  },
  {
    icon: TrendingUp,
    title: "Real Results",
    description: "Happy clients. Lasting relationships.",
  },
]

const testimonials = [
  {
    name: "Grace Wanjiku",
    location: "Karen, Nairobi",
    text: "Exceptional service! They helped us find our dream home in Karen within just three weeks. Professional, knowledgeable, and truly understanding of our needs.",
  },
  {
    name: "David Kimani",
    location: "Westlands, Nairobi",
    text: "Outstanding experience from start to finish. Their knowledge of Nairobi's property market and negotiation skills saved us over KSh 2 million.",
  },
  {
    name: "Amina Hassan",
    location: "Kilimani, Nairobi",
    text: "They made buying our first home stress-free. Always available, always honest, and truly professional. Highly recommend Ardhi & Co.",
  },
  {
    name: "Peter Mwangi",
    location: "Runda, Nairobi",
    text: "Sold our property in Runda faster than expected and at a great price. Their marketing strategy and client network is impressive.",
  },
  {
    name: "Sarah Achieng",
    location: "Kileleshwa, Nairobi",
    text: "Found the perfect rental apartment in Kileleshwa. Their understanding of different neighborhoods in Nairobi is unmatched.",
  },
]

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[number] }) {
  return (
    <article className="mr-5 w-[19rem] shrink-0 rounded-2xl border border-ink/[0.07] bg-cream-card p-6 sm:w-[21rem]">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
        ))}
        <span className="sr-only">Rated 5 out of 5</span>
      </div>
      <p className="mt-4 text-[13.5px] leading-relaxed text-ink-soft">&ldquo;{testimonial.text}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3 border-t border-ink/[0.07] pt-4">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-tint text-[11px] font-semibold text-brand">
          {testimonial.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </span>
        <div>
          <p className="text-[12.5px] font-semibold text-ink">{testimonial.name}</p>
          <p className="text-[11px] text-ink/45">{testimonial.location}</p>
        </div>
      </div>
    </article>
  )
}

export default function HomePage() {
  const [filters, setFilters] = useState<SearchFilters>(emptyFilters)
  const [draftFilters, setDraftFilters] = useState<SearchFilters>(emptyFilters)
  const [saved, setSaved] = useState<number[]>([])
  const [selected, setSelected] = useState<Listing | null>(null)
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(3)
  const [slide, setSlide] = useState(0)
  const [heroPaused, setHeroPaused] = useState(false)
  const [sent, setSent] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // One card on phones, two on tablets, three once the grid has room
  useEffect(() => {
    const sync = () => {
      const width = window.innerWidth
      setPerPage(width >= 1280 ? 3 : width >= 640 ? 2 : 1)
    }

    sync()
    window.addEventListener("resize", sync)
    return () => window.removeEventListener("resize", sync)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion || heroPaused) return
    const timer = setInterval(() => setSlide((current) => (current + 1) % heroSlides.length), 6000)
    return () => clearInterval(timer)
  }, [prefersReducedMotion, heroPaused])

  const filtered = useMemo(() => listings.filter((listing) => matchesFilters(listing, filters)), [filters])
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage))
  const currentPage = Math.min(page, pageCount - 1)
  const visible = filtered.slice(currentPage * perPage, currentPage * perPage + perPage)
  const activeLabels = filterLabels(filters)
  const hasFilters = activeLabels.length > 0

  const toggleSaved = (id: number) =>
    setSaved((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))

  const goToSlide = (direction: number) =>
    setSlide((current) => (current + direction + heroSlides.length) % heroSlides.length)

  const applyFilters = (next: SearchFilters) => {
    setFilters(next)
    setDraftFilters(next)
    setPage(0)
    document.getElementById("properties")?.scrollIntoView({ block: "start" })
  }

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen overflow-x-hidden bg-cream">
      <SiteHeader />

      {/* Hero */}
      <section id="home" className="relative pt-[92px] lg:pt-[118px]">
        <div className="hero-gutter grid items-center gap-9 lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] lg:gap-0">
          <div className="pr-6 lg:pr-10">
            <div className="max-w-[540px]">
              <p className="eyebrow">
                Premium Properties
                <span className="mx-2.5 text-ink/25">/</span>
                Nairobi &amp; Beyond
              </p>

              <h1 className="mt-6 font-serif text-[clamp(2.35rem,3.8vw,3.65rem)] font-normal leading-[1.04] tracking-[-0.02em] text-ink">
                Exceptional Homes.
                <span className="mt-1 block text-brand">Greater Living.</span>
              </h1>

              <p className="mt-6 max-w-[25rem] text-[14.5px] leading-[1.75] text-ink-soft">
                Discover stunning houses, modern apartments and investment-ready properties across Nairobi&rsquo;s most
                desirable neighborhoods and Kenya&rsquo;s prime locations.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <a href="#about" className="group flex items-center gap-3 rounded-full">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 text-ink transition duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    <Play className="ml-0.5 h-3 w-3 fill-current" aria-hidden="true" />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">
                    Watch Our Story
                  </span>
                </a>
                <span className="h-px w-8 bg-ink/20" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div
            className="pr-6 lg:pr-0 lg:-mt-12"
            onMouseEnter={() => setHeroPaused(true)}
            onMouseLeave={() => setHeroPaused(false)}
          >
            <div className="relative flex overflow-hidden rounded-2xl lg:h-[430px] lg:rounded-l-[1.75rem] lg:rounded-r-none">
              <div className="relative h-[250px] flex-1 overflow-hidden sm:h-[330px] lg:h-full">
                {heroSlides.map((item, index) => (
                  <div
                    key={item.src}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-1000",
                      index === slide ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden={index !== slide}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 56vw"
                      className={cn(
                        "object-cover transition-transform [transition-duration:6000ms] ease-out",
                        index === slide ? "scale-[1.04]" : "scale-100",
                      )}
                    />
                  </div>
                ))}

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/70 to-transparent px-4 pb-3 pt-10 lg:hidden">
                  <span className="text-[10px] tracking-[0.2em] text-white/85">
                    0{slide + 1} / 0{heroSlides.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => goToSlide(-1)}
                      aria-label="Previous hero image"
                      className="tap-target inline-flex items-center justify-center rounded-full text-white"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => goToSlide(1)}
                      aria-label="Next hero image"
                      className="tap-target inline-flex items-center justify-center rounded-full text-white"
                    >
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </span>
                </div>
              </div>

              <div className="hidden w-[126px] shrink-0 flex-col items-end justify-between bg-[#1B1C18] px-5 py-7 lg:flex">
                <div className="flex flex-col items-end gap-4 text-right">
                  {["Luxury", "Comfort", "Investment"].map((word) => (
                    <span key={word} className="text-[8.5px] uppercase tracking-[0.3em] text-white/40">
                      {word}
                    </span>
                  ))}
                  <span className="mt-2 h-16 w-px bg-white/20" aria-hidden="true" />
                </div>

                <div className="flex w-full items-center justify-between text-white/55">
                  <span className="text-[9px] tracking-[0.18em] tabular-nums">
                    0{slide + 1} / 0{heroSlides.length}
                  </span>
                  <span className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => goToSlide(-1)}
                      aria-label="Previous hero image"
                      className="transition-colors hover:text-white"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => goToSlide(1)}
                      aria-label="Next hero image"
                      className="transition-colors hover:text-white"
                    >
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SearchBar
          value={draftFilters}
          onChange={setDraftFilters}
          onSearch={applyFilters}
          className="mt-6 lg:mt-2"
        />
      </section>

      {/* Handpicked properties */}
      <section id="properties" className="scroll-mt-24 bg-cream pb-16 pt-16 sm:pt-20 lg:pb-24">
        <div className="page-x">
          <div className="grid gap-9 lg:grid-cols-[255px_minmax(0,1fr)] lg:gap-10">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <p className="eyebrow-brand flex items-center gap-3">
                  Featured Properties
                  <span className="eyebrow-rule" aria-hidden="true" />
                </p>
                <h2 className="mt-5 font-serif text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
                  Handpicked
                  <br />
                  for You
                </h2>
                <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">
                  From elegant townhouses to contemporary apartments, explore our curated selection of the finest
                  properties across Nairobi and beyond.
                </p>
                <Link
                  href="/properties"
                  className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  View All Properties
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>

                <div className="mt-9 flex items-center gap-3">
                  <span className="text-[10.5px] font-medium tracking-[0.14em] text-ink/50 tabular-nums">
                    {String(currentPage + 1).padStart(2, "0")}
                  </span>
                  <span className="relative h-px w-14 overflow-hidden bg-ink/15">
                    <span
                      className="absolute inset-y-0 left-0 bg-ink/55 transition-all duration-500"
                      style={{ width: `${((currentPage + 1) / pageCount) * 100}%` }}
                    />
                  </span>
                  <span className="text-[10.5px] font-medium tracking-[0.14em] text-ink/30 tabular-nums">
                    {String(pageCount).padStart(2, "0")}
                  </span>
                  <span className="ml-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPage((current) => (current - 1 + pageCount) % pageCount)}
                      aria-label="Previous properties"
                      disabled={filtered.length === 0}
                      className="grid h-8 w-8 place-items-center rounded-full border border-ink/15 text-ink/60 transition hover:border-ink/40 hover:text-ink disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((current) => (current + 1) % pageCount)}
                      aria-label="Next properties"
                      disabled={filtered.length === 0}
                      className="grid h-8 w-8 place-items-center rounded-full border border-ink/15 text-ink/60 transition hover:border-ink/40 hover:text-ink disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </span>
                </div>
              </Reveal>
            </div>

            <div>
              <p className="sr-only" aria-live="polite">
                {filtered.length} {filtered.length === 1 ? "home" : "homes"}
                {hasFilters ? " matching your search" : " available"}
              </p>

              {hasFilters && (
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <p className="text-[12px] text-ink/50">
                    {filtered.length} {filtered.length === 1 ? "home" : "homes"} found
                  </p>
                  {activeLabels.map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-ink/10 bg-cream-deep/60 px-2.5 py-1 text-[10.5px] font-medium text-ink-soft"
                    >
                      {label}
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => applyFilters(emptyFilters)}
                    className="text-[10.5px] font-semibold text-brand underline-offset-2 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}

              {visible.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {visible.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      saved={saved.includes(property.id)}
                      onToggleSave={() => toggleSaved(property.id)}
                      onOpen={() => setSelected(property)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 px-6 text-center">
                  <p className="font-serif text-xl text-ink">No homes match those filters</p>
                  <p className="mt-2 max-w-xs text-[12.5px] text-ink-soft">
                    Try a wider budget or a different neighborhood.
                  </p>
                  <button
                    type="button"
                    onClick={() => applyFilters(emptyFilters)}
                    className="mt-5 rounded-full bg-brand px-5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-brand-dark"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="relative overflow-hidden bg-cream-deep py-16 sm:py-20 lg:h-[440px] lg:py-0">
        <div
          className="pointer-events-none absolute -left-[8rem] top-1/2 hidden h-[440px] w-[440px] -translate-y-1/2 overflow-hidden rounded-full lg:block"
          aria-hidden="true"
        >
          <Image
            src="/images/nairobi-penthouse.jpg"
            alt=""
            fill
            sizes="480px"
            className="object-cover object-[60%_40%] opacity-90"
          />
        </div>

        <div className="page-x relative lg:flex lg:h-full lg:items-center">
          <div className="grid w-full gap-10 lg:grid-cols-[215px_minmax(0,1fr)_minmax(0,1.35fr)] lg:items-center lg:gap-12">
            <div className="hidden lg:block" />

            <Reveal>
              <p className="eyebrow-brand flex items-center gap-3">
                Why Choose Us
                <span className="eyebrow-rule" aria-hidden="true" />
              </p>
              <h2 className="mt-5 font-serif text-[2rem] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
                More Than Just
                <br />
                Properties
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                {benefits.map((benefit) => (
                  <div key={benefit.title}>
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-brand/15 bg-white/60 text-brand">
                      <benefit.icon className="h-[19px] w-[19px]" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-[13px] font-semibold text-ink">{benefit.title}</h3>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-soft">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="scroll-mt-24 overflow-hidden bg-cream py-16 sm:py-20">
        <div className="page-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <p className="eyebrow-brand flex items-center gap-3">
                Client Stories
                <span className="eyebrow-rule" aria-hidden="true" />
              </p>
              <h2 className="mt-5 font-serif text-[2rem] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
                Words From Our Clients
              </h2>
            </Reveal>
            <p className="max-w-[22rem] text-[13px] leading-relaxed text-ink-soft">
              Real stories from the families and investors who found their next address with us.
            </p>
          </div>
        </div>

        <div className="relative mt-10">
          <div className="marquee-track marquee-left" style={{ animationDuration: "70s" }}>
            {[0, 1].map((copy) => (
              <div key={copy} className="flex" aria-hidden={copy === 1 || undefined}>
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.name} testimonial={testimonial} />
                ))}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream to-transparent sm:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cream to-transparent sm:w-28" />
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-24 bg-cream pb-16 sm:pb-20 lg:pb-24">
        <div className="page-x">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-[5/4]">
                <Image
                  src="/images/team-photo.jpg"
                  alt="The Ardhi & Co. team at work"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="eyebrow-brand flex items-center gap-3">
                About Us
                <span className="eyebrow-rule" aria-hidden="true" />
              </p>
              <h2 className="mt-5 font-serif text-[2rem] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[2.4rem]">
                Built on Nairobi,
                <br />
                Trusted Since 2015
              </h2>
              <p className="mt-5 text-[13.5px] leading-relaxed text-ink-soft">
                Ardhi &amp; Co. has been at the forefront of the country&rsquo;s luxury property market, helping
                families and investors find their perfect homes. Our team pairs deep local knowledge with
                on-the-ground market research, so every recommendation is grounded in fact.
              </p>
              <p className="mt-3.5 text-[13.5px] leading-relaxed text-ink-soft">
                We don&rsquo;t just sell properties — we build lasting relationships and help our clients grow their
                futures in Kenya.
              </p>

              <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-ink/[0.08] pt-7">
                {[
                  { value: "5,000+", label: "Properties sold" },
                  { value: "15+", label: "Years of experience" },
                  { value: "98%", label: "Client satisfaction" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse">
                    <dt className="mt-2 text-[10.5px] uppercase tracking-[0.14em] text-ink/45">{stat.label}</dt>
                    <dd className="font-serif text-[1.9rem] leading-none text-brand">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24 bg-ink py-16 text-cream sm:py-20">
        <div className="page-x">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-16">
            <div>
              <p className="flex items-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/40">
                Contact
                <span className="inline-block h-px w-8 bg-white/20" aria-hidden="true" />
              </p>
              <h2 className="mt-5 max-w-[22rem] font-serif text-[2.1rem] leading-[1.06] tracking-[-0.02em] text-cream sm:text-[2.7rem]">
                Let&rsquo;s find your next address.
              </h2>
              <p className="mt-5 max-w-[24rem] text-[13.5px] leading-relaxed text-cream/60">
                Tell us what you are looking for and a dedicated agent will call you back within one business day.
              </p>

              <ul className="mt-9 space-y-4 text-[13px] text-cream/75">
                <li>
                  <a href="tel:+254700123456" className="flex items-center gap-3 transition-colors hover:text-cream">
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-brand">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                    </span>
                    +254 700 123 456
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@ardhi.co.ke"
                    className="flex items-center gap-3 transition-colors hover:text-cream"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-brand">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    </span>
                    info@ardhi.co.ke
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-brand">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                  </span>
                  Westlands Square, Nairobi, Kenya
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-cream-card p-6 text-ink sm:p-7">
              {sent ? (
                <div className="flex min-h-[300px] flex-col items-start justify-center">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-tint text-brand">
                    <Check className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-serif text-[1.5rem] leading-snug">Message received</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                    Thank you — an agent will be in touch within one business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-6 text-[12.5px] font-semibold text-brand hover:text-brand-dark"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    setSent(true)
                  }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="eyebrow text-ink/45">
                        Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Jane Wanjiru"
                        className="mt-2 h-11 w-full rounded-xl border border-ink/10 bg-white/70 px-3.5 text-[13px] text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="eyebrow text-ink/45">
                        Phone
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+254 7.."
                        className="mt-2 h-11 w-full rounded-xl border border-ink/10 bg-white/70 px-3.5 text-[13px] text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="eyebrow text-ink/45">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@email.com"
                      className="mt-2 h-11 w-full rounded-xl border border-ink/10 bg-white/70 px-3.5 text-[13px] text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="eyebrow text-ink/45">
                      What are you looking for?
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={3}
                      placeholder="A 4-bedroom home in Karen under KSh 70M…"
                      className="mt-2 w-full resize-none rounded-xl border border-ink/10 bg-white/70 px-3.5 py-3 text-[13px] text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[13px] font-semibold text-white transition hover:bg-brand-dark"
                  >
                    Request a Call Back
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <p className="text-center text-[10.5px] text-ink/40">
                    We reply within one business day. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />

      <PropertyDialog property={selected} onClose={() => setSelected(null)} />
    </div>
    </MotionConfig>
  )
}
