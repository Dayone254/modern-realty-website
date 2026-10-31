"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Bath, BedDouble, Calendar, Check, MapPin, Phone, Ruler, X } from "lucide-react"
import type { Listing } from "@/data/listings"

export function PropertyDialog({
  property,
  onClose,
}: {
  property: Listing | null
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!property) return

    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [property, onClose])

  return (
    <AnimatePresence>
      {property && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="property-dialog-title"
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-cream-card sm:rounded-3xl"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close property details"
              className="tap-target absolute right-3 top-3 z-20 inline-flex items-center justify-center rounded-full bg-ink/40 text-white backdrop-blur-sm transition hover:bg-ink/60"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="relative h-56 overflow-hidden sm:h-64">
              <Image
                src={property.image}
                alt={property.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
              <div className="absolute inset-x-6 bottom-5 text-white">
                <span className="inline-block rounded-md bg-brand px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em]">
                  {property.type === "Sale" ? "For Sale" : "For Rent"}
                </span>
                <h2 id="property-dialog-title" className="mt-2.5 font-serif text-[26px] leading-tight sm:text-3xl">
                  {property.title}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-white/80">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {property.location}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/[0.08] pb-5">
                <p className="text-[22px] font-semibold tracking-[-0.02em] text-ink">{property.price}</p>
                <ul className="flex items-center gap-4 text-[12px] text-ink-soft">
                  <li className="flex items-center gap-1.5">
                    <BedDouble className="h-4 w-4 text-ink/40" strokeWidth={1.6} aria-hidden="true" />
                    {property.beds} beds
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Bath className="h-4 w-4 text-ink/40" strokeWidth={1.6} aria-hidden="true" />
                    {property.baths} baths
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Ruler className="h-4 w-4 text-ink/40" strokeWidth={1.6} aria-hidden="true" />
                    {property.sqft} sqft
                  </li>
                </ul>
              </div>

              <p className="mt-5 text-[13.5px] leading-relaxed text-ink-soft">{property.fullDescription}</p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="eyebrow text-ink/45">Key Features</h3>
                  <ul className="mt-3 space-y-2">
                    {property.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-[13px] text-ink-soft">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="eyebrow text-ink/45">Amenities</h3>
                  <ul className="mt-3 space-y-2">
                    {property.amenities.map((amenity) => (
                      <li key={amenity} className="flex items-start gap-2 text-[13px] text-ink-soft">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                <a
                  href="/#contact"
                  onClick={onClose}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand text-[13px] font-semibold text-white transition hover:bg-brand-dark"
                >
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  Schedule a Viewing
                </a>
                <a
                  href="tel:+254700123456"
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-ink/15 text-[13px] font-semibold text-ink transition hover:border-ink/30 hover:bg-cream-deep/60"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call an Agent
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
