import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react"
import { Logo } from "@/components/logo"

const columns = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/#about" },
      { label: "All Properties", href: "/properties" },
      { label: "Testimonials", href: "/#testimonials" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Portfolio",
    links: [
      { label: "For Sale", href: "/properties?type=Sale" },
      { label: "For Rent", href: "/properties?type=Rent" },
      { label: "Villas & Homes", href: "/properties?area=Karen" },
      { label: "Apartments", href: "/properties?area=Westlands" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/[0.08] bg-cream">
      <div className="page-x py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[19rem] text-[13px] leading-relaxed text-ink-soft">
              A Nairobi land and property house — acquiring, selling and managing homes and plots since 2015.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="eyebrow text-ink/40">{column.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-[13px] text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                      <ArrowUpRight
                        className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="eyebrow text-ink/40">Visit</h2>
            <ul className="mt-4 space-y-3 text-[13px] text-ink-soft">
              <li>
                <a href="tel:+254700123456" className="flex items-start gap-2.5 transition-colors hover:text-ink">
                  <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                  +254 700 123 456
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@ardhi.co.ke"
                  className="flex items-start gap-2.5 transition-colors hover:text-ink"
                >
                  <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                  <span className="break-all">info@ardhi.co.ke</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                Westlands Square, Nairobi
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink/[0.08] pt-6 text-[11.5px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ardhi &amp; Co. All rights reserved.</p>
          <p>Designed to hold value.</p>
        </div>
      </div>
    </footer>
  )
}
