"use client"

import { BedDouble, Home, MapPin, Search, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { budgetRanges, withinBudget } from "@/lib/listings"
import { FilterField, type FilterOption } from "@/components/filter-field"
import type { Listing } from "@/data/listings"

export type SearchFilters = {
  location: string
  type: string
  budget: string
  beds: string
}

export const emptyFilters: SearchFilters = { location: "", type: "", budget: "", beds: "" }

const LOCATIONS: FilterOption[] = [
  { value: "", label: "Nairobi" },
  { value: "Karen", label: "Karen" },
  { value: "Westlands", label: "Westlands" },
  { value: "Kilimani", label: "Kilimani" },
  { value: "Kileleshwa", label: "Kileleshwa" },
  { value: "Runda", label: "Runda" },
  { value: "Upperhill", label: "Upperhill" },
]

const TYPES: FilterOption[] = [
  { value: "", label: "All Types" },
  { value: "Sale", label: "For Sale" },
  { value: "Rent", label: "For Rent" },
]

const BUDGETS: FilterOption[] = budgetRanges

const BEDROOMS: FilterOption[] = [
  { value: "", label: "Any" },
  { value: "1", label: "1+ Beds" },
  { value: "2", label: "2+ Beds" },
  { value: "3", label: "3+ Beds" },
  { value: "4", label: "4+ Beds" },
]

export function filterLabels(filters: SearchFilters) {
  const labelOf = (options: FilterOption[], value: string) =>
    options.find((option) => option.value === value)?.label

  return [
    filters.location || null,
    filters.type ? labelOf(TYPES, filters.type) : null,
    filters.budget ? labelOf(BUDGETS, filters.budget) : null,
    filters.beds ? `${filters.beds}+ beds` : null,
  ].filter((label): label is string => Boolean(label))
}

export function matchesFilters(listing: Listing, filters: SearchFilters) {
  if (filters.location && !listing.location.toLowerCase().includes(filters.location.toLowerCase())) return false
  if (filters.type && listing.type !== filters.type) return false

  if (filters.beds && listing.beds < Number(filters.beds)) return false

  if (!withinBudget(listing, filters.budget)) return false

  return true
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  className,
}: {
  value: SearchFilters
  onChange: (filters: SearchFilters) => void
  onSearch: (filters: SearchFilters) => void
  className?: string
}) {
  const update = (key: keyof SearchFilters) => (next: string) => onChange({ ...value, [key]: next })
  const activeCount = Object.values(value).filter(Boolean).length

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        onSearch(value)
      }}
      className={cn("page-x relative z-30", className)}
    >
      <div className="mx-auto w-full max-w-[1040px] rounded-[22px] border border-ink/[0.06] bg-cream-card p-2 shadow-[0_30px_60px_-32px_rgba(21,21,15,0.4),0_2px_10px_-6px_rgba(21,21,15,0.15)]">
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
          <FilterField icon={MapPin} label="Location" value={value.location} options={LOCATIONS} onChange={update("location")} />
          <FilterField icon={Home} label="Property Type" value={value.type} options={TYPES} onChange={update("type")} />
          <FilterField icon={Wallet} label="Price Range" value={value.budget} options={BUDGETS} onChange={update("budget")} />
          <FilterField icon={BedDouble} label="Bedrooms" value={value.beds} options={BEDROOMS} onChange={update("beds")} />
          <div className="sm:col-span-2 lg:col-span-1">
            <button
              type="submit"
              className="flex h-full min-h-[56px] w-full items-center justify-center gap-2.5 rounded-[14px] bg-brand px-7 text-[13px] font-semibold text-white shadow-[0_10px_22px_-12px_rgba(33,90,237,0.85)] transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-card active:bg-brand-dark"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Search
              {activeCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white/20 px-1 text-[10.5px] font-bold tabular-nums">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
