"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { BedDouble, ChevronDown, Home, MapPin, Search, SlidersHorizontal, Wallet, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { listings, type Listing } from "@/data/listings"
import { areaOf, budgetRanges, priceValue, withinBudget } from "@/lib/listings"
import { FilterField, type FilterOption } from "@/components/filter-field"
import { PropertyCard } from "@/components/property-card"
import { PropertyDialog } from "@/components/property-dialog"

type Filters = {
  q: string
  type: string
  areas: string[]
  budget: string
  beds: string
}

type SortKey = "featured" | "price-asc" | "price-desc" | "beds" | "size"

const emptyFilters: Filters = { q: "", type: "", areas: [], budget: "", beds: "" }

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "beds", label: "Most bedrooms" },
  { value: "size", label: "Largest area" },
]

const typeOptions: FilterOption[] = [
  { value: "", label: "All Types" },
  { value: "Sale", label: "For Sale" },
  { value: "Rent", label: "For Rent" },
]

const bedroomOptions: FilterOption[] = [
  { value: "", label: "Any" },
  { value: "2", label: "2+ Beds" },
  { value: "3", label: "3+ Beds" },
  { value: "4", label: "4+ Beds" },
  { value: "5", label: "5+ Beds" },
]

export function PropertiesBrowser() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [sort, setSort] = useState<SortKey>("featured")
  const [showFilters, setShowFilters] = useState(false)
  const [saved, setSaved] = useState<number[]>([])
  const [selected, setSelected] = useState<Listing | null>(null)

  const areas = useMemo(() => {
    const counts = new Map<string, number>()
    listings.forEach((listing) => {
      const area = areaOf(listing.location)
      counts.set(area, (counts.get(area) ?? 0) + 1)
    })
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [])

  useEffect(() => {
    const type = searchParams.get("type")
    const area = searchParams.get("area")
    if (!type && !area) return
    setFilters((current) => ({
      ...current,
      type: type === "Sale" || type === "Rent" ? type : current.type,
      areas: area && areas.some(([name]) => name === area) ? [area] : current.areas,
    }))
  }, [searchParams, areas])

  const update = (patch: Partial<Filters>) => setFilters((current) => ({ ...current, ...patch }))
  const toggleArea = (area: string) =>
    setFilters((current) => ({
      ...current,
      areas: current.areas.includes(area)
        ? current.areas.filter((item) => item !== area)
        : [...current.areas, area],
    }))

  const results = useMemo(() => {
    const query = filters.q.trim().toLowerCase()
    const matches = listings.filter((listing) => {
      if (filters.type && listing.type !== filters.type) return false
      if (filters.areas.length && !filters.areas.includes(areaOf(listing.location))) return false
      if (!withinBudget(listing, filters.budget)) return false
      if (filters.beds && listing.beds < Number(filters.beds)) return false
      if (query) {
        const haystack = [listing.title, listing.location, listing.type, ...listing.features, ...listing.amenities]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
    const sorted = [...matches]
    if (sort === "price-asc") sorted.sort((a, b) => priceValue(a.price) - priceValue(b.price))
    if (sort === "price-desc") sorted.sort((a, b) => priceValue(b.price) - priceValue(a.price))
    if (sort === "beds") sorted.sort((a, b) => b.beds - a.beds)
    if (sort === "size") sorted.sort((a, b) => priceValue(b.sqft) - priceValue(a.sqft))
    return sorted
  }, [filters, sort])

  const activeChips = [
    filters.q ? { key: "q", label: `"${filters.q}"`, clear: () => update({ q: "" }) } : null,
    filters.type ? { key: "type", label: filters.type === "Sale" ? "For sale" : "For rent", clear: () => update({ type: "" }) } : null,
    ...filters.areas.map((area) => ({ key: `area-${area}`, label: area, clear: () => toggleArea(area) })),
    filters.budget ? { key: "budget", label: budgetRanges.find((range) => range.value === filters.budget)?.label ?? "Budget", clear: () => update({ budget: "" }) } : null,
    filters.beds ? { key: "beds", label: `${filters.beds}+ bedrooms`, clear: () => update({ beds: "" }) } : null,
  ].filter((chip): chip is { key: string; label: string; clear: () => void } => chip !== null)

  const hasFilters = activeChips.length > 0
  const forSale = listings.filter((listing) => listing.type === "Sale").length
  const forRent = listings.length - forSale

  const areaOptions: FilterOption[] = [
    { value: "", label: "All Areas" },
    ...areas.map(([name]) => ({ value: name, label: name })),
  ]
  const areaValue = filters.areas.length === 1 ? filters.areas[0] : ""
  const areaDisplay = filters.areas.length > 1 ? `${filters.areas.length} areas` : undefined

  const toggleSaved = (id: number) =>
    setSaved((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))

  return (
    <div className="bg-cream">
      {/* Page intro */}
      <section className="page-x pt-[92px] lg:pt-[118px]">
        <div className="mx-auto w-full max-w-[1410px]">
          <p className="eyebrow-brand flex items-center gap-3">
            The Collection
            <span className="eyebrow-rule" aria-hidden="true" />
          </p>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-serif text-[2.1rem] leading-[1.05] tracking-[-0.02em] text-ink sm:text-[2.9rem]">
                All Properties
              </h1>
              <p className="mt-4 text-[13.5px] leading-relaxed text-ink-soft">
                Every verified home, apartment and investment property in the Ardhi &amp; Co. collection,
                filtered by neighborhood, budget and layout.
              </p>
            </div>

            <dl className="flex items-center gap-6 sm:gap-8">
              <div>
                <dt className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-ink/40">For sale</dt>
                <dd className="mt-1.5 font-serif text-[1.6rem] leading-none text-ink tabular-nums">{forSale}</dd>
              </div>
              <span className="h-9 w-px bg-ink/10" aria-hidden="true" />
              <div>
                <dt className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-ink/40">For rent</dt>
                <dd className="mt-1.5 font-serif text-[1.6rem] leading-none text-ink tabular-nums">{forRent}</dd>
              </div>
              <span className="h-9 w-px bg-ink/10" aria-hidden="true" />
              <div>
                <dt className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-ink/40">Available</dt>
                <dd className="mt-1.5 font-serif text-[1.6rem] leading-none text-ink tabular-nums">{listings.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Filter card */}
      <section className="page-x mt-8 sm:mt-10">
        <div className="mx-auto w-full max-w-[1410px]">
          <div className="rounded-[22px] border border-ink/[0.06] bg-cream-card p-2 shadow-[0_30px_60px_-32px_rgba(21,21,15,0.4),0_2px_10px_-6px_rgba(21,21,15,0.15)]">
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
              <FilterField
                icon={MapPin}
                label="Location"
                value={areaValue}
                displayLabel={areaDisplay}
                options={areaOptions}
                onChange={(next) => update({ areas: next ? [next] : [] })}
              />
              <FilterField
                icon={Home}
                label="Property Type"
                value={filters.type}
                options={typeOptions}
                onChange={(next) => update({ type: next })}
              />
              <FilterField
                icon={Wallet}
                label="Price Range"
                value={filters.budget}
                options={budgetRanges}
                onChange={(next) => update({ budget: next })}
              />
              <FilterField
                icon={BedDouble}
                label="Bedrooms"
                value={filters.beds}
                options={bedroomOptions}
                onChange={(next) => update({ beds: next })}
              />

              <div className="sm:col-span-2 lg:col-span-1">
                <button
                  type="button"
                  onClick={() => setShowFilters((open) => !open)}
                  aria-expanded={showFilters}
                  aria-controls="property-filters"
                  className={cn(
                    "flex h-full min-h-[56px] w-full items-center justify-center gap-2.5 rounded-[14px] px-6 text-[13px] font-semibold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-card",
                    showFilters || hasFilters
                      ? "bg-brand text-white shadow-[0_10px_22px_-12px_rgba(33,90,237,0.85)] hover:bg-brand-dark"
                      : "border border-ink/10 bg-cream-deep/50 text-ink hover:border-ink/20 hover:bg-cream-deep",
                  )}
                >
                  {showFilters ? <X className="h-4 w-4" aria-hidden="true" /> : <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />}
                  {showFilters ? "Close" : "Filters"}
                  {!showFilters && hasFilters && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white/20 px-1 text-[10.5px] font-bold tabular-nums">
                      {activeChips.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Refine panel */}
            <div
              id="property-filters"
              aria-hidden={!showFilters}
              inert={!showFilters}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                showFilters ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="mt-2 rounded-[16px] bg-cream-deep/40 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ink/45">Refine</p>
                    {hasFilters && (
                      <button
                        type="button"
                        onClick={() => setFilters(emptyFilters)}
                        className="text-[11.5px] font-semibold text-brand transition-colors hover:text-brand-dark"
                      >
                        Reset all
                      </button>
                    )}
                  </div>

                  <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-8">
                    <div>
                      <label htmlFor="property-search" className="text-[9.5px] font-medium uppercase tracking-[0.18em] text-ink/45">
                        Search
                      </label>
                      <div className="relative mt-2">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-ink/30" aria-hidden="true" />
                        <input
                          id="property-search"
                          type="search"
                          value={filters.q}
                          onChange={(event) => update({ q: event.target.value })}
                          placeholder="Villa, Karen, pool…"
                          className="h-11 w-full rounded-xl border border-ink/10 bg-cream-card pl-10 pr-3 text-[12.5px] text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
                        />
                      </div>
                    </div>

                    <fieldset>
                      <legend className="text-[9.5px] font-medium uppercase tracking-[0.18em] text-ink/45">Neighborhood</legend>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {areas.map(([area, count]) => {
                          const checked = filters.areas.includes(area)
                          return (
                            <label
                              key={area}
                              className={cn(
                                "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
                                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/40 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-cream-deep/40",
                                checked
                                  ? "border-brand/25 bg-brand-tint text-brand"
                                  : "border-ink/10 bg-cream-card text-ink-soft hover:border-ink/20 hover:text-ink",
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleArea(area)}
                                className="sr-only"
                              />
                              {area}
                              <span className={cn("text-[10.5px] tabular-nums", checked ? "text-brand/60" : "text-ink/30")}>
                                {count}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="page-x pb-20 pt-10 sm:pt-12">
        <div className="mx-auto w-full max-w-[1410px]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
            <p className="text-[12.5px] text-ink-soft" aria-live="polite">
              <span className="font-semibold text-ink tabular-nums">{results.length}</span>{" "}
              {results.length === 1 ? "property" : "properties"}
              {hasFilters && " matching your filters"}
            </p>

            <label className="relative block">
              <span className="sr-only">Sort properties</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="h-9 appearance-none rounded-full border border-ink/15 bg-cream-card pl-3.5 pr-8 text-[11.5px] font-semibold text-ink transition-colors hover:border-ink/25 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" aria-hidden="true" />
            </label>
          </div>

          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.clear}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-cream-deep/60 py-1 pl-2.5 pr-2 text-[10.5px] font-medium text-ink-soft transition-colors hover:border-ink/25 hover:text-ink"
                >
                  {chip.label}
                  <X className="h-3 w-3 text-ink/35 group-hover:text-ink" aria-hidden="true" />
                  <span className="sr-only">Remove filter</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setFilters(emptyFilters)}
                className="text-[10.5px] font-semibold text-brand underline-offset-2 transition-colors hover:text-brand-dark hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {results.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((property) => (
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
            <div className="mt-6 flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 px-6 text-center">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-cream-deep/70 text-ink/40">
                <Search className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-4 font-serif text-[1.4rem] text-ink">No properties match those filters</p>
              <p className="mt-2 max-w-xs text-[12.5px] leading-relaxed text-ink-soft">
                Try widening the budget, removing a neighborhood, or searching a different feature.
              </p>
              <button
                type="button"
                onClick={() => setFilters(emptyFilters)}
                className="mt-6 rounded-full bg-brand px-5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-brand-dark"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      <PropertyDialog property={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
