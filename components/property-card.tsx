"use client"

import Image from "next/image"
import { Bath, BedDouble, Heart, MapPin, Ruler } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Listing } from "@/data/listings"

export function PropertyCard({
  property,
  saved,
  onToggleSave,
  onOpen,
}: {
  property: Listing
  saved: boolean
  onToggleSave: () => void
  onOpen: () => void
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-ink/[0.07] bg-cream-card shadow-[0_20px_50px_-42px_rgba(21,21,15,0.6)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-36px_rgba(21,21,15,0.5)]">
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1280px) 45vw, 340px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />

        {/* Covers the photo so the whole image opens the details panel */}
        <button
          type="button"
          onClick={onOpen}
          aria-label={`View details for ${property.title}`}
          className="absolute inset-0 z-0 cursor-pointer focus-visible:outline-offset-[-3px]"
        />

        <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-md bg-ink/70 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
          {property.type === "Sale" ? "For Sale" : "For Rent"}
        </span>

        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${property.title} from saved` : `Save ${property.title}`}
          className="absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full text-white/90 transition hover:bg-white/15 hover:text-white"
        >
          <Heart
            className={cn("h-[18px] w-[18px] transition", saved ? "fill-white text-white" : "fill-none")}
            strokeWidth={1.6}
            aria-hidden="true"
          />
        </button>

        <div className="pointer-events-none absolute inset-x-4 bottom-3.5 z-10 text-white">
          <h3 className="text-[15px] font-semibold leading-tight tracking-[-0.01em]">{property.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-white/75">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {property.location}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <ul className="flex items-center gap-3 text-[11.5px] text-ink-soft">
          <li className="flex items-center gap-1">
            <BedDouble className="h-[14px] w-[14px] text-ink/40" strokeWidth={1.6} aria-hidden="true" />
            {property.beds}
            <span className="sr-only">bedrooms</span>
          </li>
          <li className="flex items-center gap-1">
            <Bath className="h-[14px] w-[14px] text-ink/40" strokeWidth={1.6} aria-hidden="true" />
            {property.baths}
            <span className="sr-only">bathrooms</span>
          </li>
          <li className="flex items-center gap-1">
            <Ruler className="h-[14px] w-[14px] text-ink/40" strokeWidth={1.6} aria-hidden="true" />
            {property.sqft} sqft
          </li>
        </ul>
        <p className="shrink-0 truncate text-[12.5px] font-semibold tracking-[-0.01em] text-ink">
          {property.price}
        </p>
      </div>
    </article>
  )
}
