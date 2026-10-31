"use client"

import { ArrowRight, Building2, Check, Home, MapPin, Plus, Tag, Wallet } from "lucide-react"
import { Panel, StatCard, TypeBadge } from "@/components/admin/admin-ui"
import { areaOf, priceValue } from "@/lib/listings"
import { cn } from "@/lib/utils"
import type { Listing } from "@/data/listings"

function formatTotal(value: number) {
  if (value >= 1_000_000_000) return `KSh ${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `KSh ${Math.round(value / 1_000_000)}M`
  return `KSh ${value.toLocaleString("en-KE")}`
}

function completeness(listing: Listing) {
  const checks = [
    listing.title.trim(),
    listing.location.trim(),
    listing.price.trim(),
    listing.image.trim(),
    listing.description.trim(),
    listing.fullDescription.trim(),
    listing.features.length >= 3 ? "y" : "",
    listing.amenities.length >= 3 ? "y" : "",
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function OverviewView({
  items,
  onAdd,
  onEdit,
  onViewAll,
}: {
  items: Listing[]
  onAdd: () => void
  onEdit: (listing: Listing) => void
  onViewAll: () => void
}) {
  const forSale = items.filter((listing) => listing.type === "Sale").length
  const forRent = items.length - forSale
  const salesValue = items
    .filter((listing) => listing.type === "Sale")
    .reduce((sum, listing) => sum + priceValue(listing.price), 0)

  const byArea = [...items.reduce((map, listing) => {
    const area = areaOf(listing.location)
    map.set(area, (map.get(area) ?? 0) + 1)
    return map
  }, new Map<string, number>())]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  const recent = [...items].slice(-4).reverse()
  const averageReadiness = items.length
    ? Math.round(items.reduce((sum, listing) => sum + completeness(listing), 0) / items.length)
    : 0

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow-brand flex items-center gap-3">
            Portfolio
            <span className="eyebrow-rule" aria-hidden="true" />
          </p>
          <h1 className="mt-4 font-serif text-[2rem] leading-[1.05] tracking-[-0.02em] text-ink sm:text-[2.5rem]">
            Everything at a glance
          </h1>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
            A live read on the collection — what is listed, where it sits, and which records still need attention.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-[12.5px] font-semibold text-white shadow-[0_12px_26px_-14px_rgba(33,90,237,0.9)] transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add listing
        </button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Live listings"
          value={String(items.length).padStart(2, "0")}
          hint="Published across the collection"
          icon={Building2}
          accent
        />
        <StatCard label="For sale" value={String(forSale).padStart(2, "0")} hint="Freehold & leasehold homes" icon={Home} />
        <StatCard label="For rent" value={String(forRent).padStart(2, "0")} hint="Managed rental inventory" icon={Tag} />
        <StatCard label="Sales value" value={formatTotal(salesValue)} hint="For-sale asking price" icon={Wallet} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <Panel
          title="Inventory by neighborhood"
          description="Where the collection is concentrated"
          action={<span className="text-[10.5px] tabular-nums text-ink/35">{byArea.length} areas</span>}
          bodyClassName="px-5 pb-3 pt-2"
        >
          <ul className="divide-y divide-ink/[0.05]">
            {byArea.map(([area, count]) => {
              const share = items.length ? Math.round((count / items.length) * 100) : 0
              return (
                <li key={area} className="flex items-center gap-4 py-3">
                  <span className="w-24 shrink-0 truncate text-[12.5px] font-medium text-ink">{area}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
                    <span
                      className="block h-full rounded-full bg-brand/80"
                      style={{ width: `${Math.max(share, 2)}%` }}
                    />
                  </span>
                  <span className="w-14 shrink-0 text-right text-[11px] tabular-nums text-ink/40">
                    {count} · {share}%
                  </span>
                </li>
              )
            })}
            {byArea.length === 0 && <li className="py-6 text-[12.5px] text-ink-soft">No listings yet.</li>}
          </ul>
        </Panel>

        <Panel
          title="Recently added"
          action={
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand transition-colors hover:text-brand-dark"
            >
              View all
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </button>
          }
          bodyClassName="p-2"
        >
          <ul>
            {recent.map((listing) => (
              <li key={listing.id}>
                <button
                  type="button"
                  onClick={() => onEdit(listing)}
                  className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-cream-deep/50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={listing.image} alt="" className="h-11 w-14 shrink-0 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-semibold text-ink">{listing.title}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-soft">
                      <MapPin className="h-3 w-3 shrink-0 text-ink/30" aria-hidden="true" />
                      <span className="truncate">{listing.location}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-[11.5px] font-semibold tabular-nums text-ink/70">{listing.price}</span>
                </button>
              </li>
            ))}
            {recent.length === 0 && <li className="px-3 py-6 text-[12.5px] text-ink-soft">Nothing here yet.</li>}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.25fr]">
        <Panel title="Record health" description="How complete the average listing is">
          <div className="flex items-end justify-between gap-4">
            <p className="font-serif text-[2.2rem] leading-none text-ink tabular-nums">{averageReadiness}%</p>
            <p className="max-w-[15rem] text-right text-[11.5px] leading-relaxed text-ink-soft">
              Listings with photos, pricing and full descriptions convert far better.
            </p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-cream-deep">
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-700",
                averageReadiness >= 80 ? "bg-brand" : averageReadiness >= 50 ? "bg-brand/70" : "bg-ink/30",
              )}
              style={{ width: `${averageReadiness}%` }}
            />
          </div>
        </Panel>

        <Panel title="Needs attention" description="Draft-quality records worth a second pass" bodyClassName="p-2">
          <ul className="divide-y divide-ink/[0.05]">
            {items
              .filter((listing) => completeness(listing) < 100)
              .slice(0, 3)
              .map((listing) => (
                <li key={listing.id} className="flex items-center gap-3 px-3 py-2.5">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-medium text-ink">{listing.title}</span>
                    <span className="text-[10.5px] text-ink/40">Missing {100 - completeness(listing)}% of details</span>
                  </span>
                  <TypeBadge type={listing.type} />
                  <button
                    type="button"
                    onClick={() => onEdit(listing)}
                    className="shrink-0 text-[11px] font-semibold text-brand transition-colors hover:text-brand-dark"
                  >
                    Fix
                  </button>
                </li>
              ))}
            {items.every((listing) => completeness(listing) === 100) && (
              <li className="flex items-start gap-3 px-3 py-5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[12.5px] font-semibold text-ink">Every record is complete</span>
                  <span className="mt-0.5 block text-[11px] text-ink-soft">
                    Photography, pricing and copy are all in place.
                  </span>
                </span>
              </li>
            )}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
