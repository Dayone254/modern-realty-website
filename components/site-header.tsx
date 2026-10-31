"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ArrowRight, Mail, Phone, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Home", href: "#home", id: "home" },
  { label: "Properties", href: "#properties", id: "properties" },
  { label: "About Us", href: "#about", id: "about" },
  { label: "Testimonials", href: "#testimonials", id: "testimonials" },
  { label: "Contact", href: "#contact", id: "contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState("#home")

  // Sections only exist on the homepage, so every other route links back to it
  const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Highlight the nav item whose section is in the middle of the viewport
  useEffect(() => {
    if (!isHome) return

    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((section): section is HTMLElement => Boolean(section))

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(`#${visible.target.id}`)
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [isHome])

  // Escape closes the menu, and the page behind it should not scroll
  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [menuOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-colors duration-300",
          scrolled || menuOpen
            ? "bg-cream/95 shadow-[0_1px_0_rgba(21,21,15,0.07)] backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <div className="page-x">
          <div className="flex h-[70px] items-center justify-between gap-4 lg:h-[90px]">
            <a
              href={isHome ? "#home" : "/"}
              className="shrink-0 rounded-lg"
              aria-label="Ardhi & Co. — back to top"
            >
              <Logo />
            </a>

            <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
              {navLinks.map((link) => {
                const isActive = isHome ? active === link.href : link.id === "properties"
                return (
                  <a
                    key={link.href}
                    href={sectionHref(link.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative py-2 text-[13px] font-medium tracking-[-0.005em] transition-colors",
                      isActive ? "text-ink" : "text-ink/55 hover:text-ink",
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-[2px] w-full origin-left rounded-full bg-brand transition-transform duration-300",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </a>
                )
              })}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href={sectionHref("contact")}
                className="group hidden h-10 items-center gap-2 rounded-full bg-brand pl-5 pr-4 text-[12.5px] font-semibold text-white shadow-[0_10px_25px_-12px_rgba(33,90,237,0.9)] transition hover:bg-brand-dark sm:inline-flex"
              >
                Schedule Visit
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>

              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="tap-target inline-flex items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
              >
                {menuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <span className="flex w-[22px] flex-col gap-[5px]" aria-hidden="true">
                    <span className="h-[1.5px] w-full rounded-full bg-ink" />
                    <span className="h-[1.5px] w-full rounded-full bg-ink" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 top-[70px] z-40 cursor-default bg-ink/25 backdrop-blur-[2px] lg:top-[90px]"
          />
          <div
            id="site-menu"
            className="absolute inset-x-3 top-[78px] z-50 overflow-hidden rounded-2xl border border-ink/[0.06] bg-cream-card p-3 shadow-[0_30px_80px_-30px_rgba(21,21,15,0.45)] sm:left-auto sm:right-6 sm:w-[360px] lg:top-[98px]"
          >
            <nav aria-label="Menu" className="flex flex-col">
              {navLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={sectionHref(link.id)}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-baseline gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-cream-deep/70"
                >
                  <span className="text-[10px] font-semibold tabular-nums text-ink/30">
                    0{index + 1}
                  </span>
                  <span className="font-serif text-[19px] leading-none text-ink">{link.label}</span>
                </a>
              ))}
            </nav>

            <div className="mt-3 space-y-1 border-t border-ink/[0.07] px-3 pt-3 text-[12.5px] text-ink-soft">
              <a
                href="tel:+254700123456"
                className="flex min-h-[2.5rem] items-center gap-2.5 transition-colors hover:text-ink"
              >
                <Phone className="h-4 w-4 text-brand" aria-hidden="true" />
                +254 700 123 456
              </a>
              <a
                href="mailto:info@ardhi.co.ke"
                className="flex min-h-[2.5rem] items-center gap-2.5 transition-colors hover:text-ink"
              >
                <Mail className="h-4 w-4 text-brand" aria-hidden="true" />
                <span className="truncate">info@ardhi.co.ke</span>
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
