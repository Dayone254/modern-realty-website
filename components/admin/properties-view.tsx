"use client"

import { useMemo, useState } from "react"
import { BedDouble, Bath, MapPin, Pencil, Plus, Ruler, Search, Trash2, X } from "lucide-react"
import { AdminSelect, TypeBadge } from "@/components/admin/admin-ui"
import { cn } from "@/lib/utils"
import { priceValue } from "@/lib/listings"
import type { Listing } from "@/data/listings"

type SortKey = "newest" | "price-desc" | "price-asc" | "beds"

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "beds", label: "Most bedrooms" },
]

const typeFilters = [
  { value: "", label: "All" },
  { value: "Sale", label: "For sale" },
  { value: "Rent", label: "For rent" },
]

export function PropertiesView({
  items,
  onAdd,
  onEdit,
  onDelete,
}: {
  items: Listing[]
  onAdd: () => void
  onEdit: (listing: Listing) => void
  onDelete: (id: number) => void
}) {
  const [query, setQuery] = useState("")
  const [type, setType] = useState("")
  const [sort, setSort] = useState<SortKey>("newest")
  const [pendingDelete, setPendingDelete] = useState<number | null>(null)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const matches = items.filter((listing) => {
      if (type && listing.type !== type) return false
      if (!needle) return true
      return [listing.title, listing.location, listing.price, listing.description]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    })

    const sorted = [...matches]
    if (sort === "price-desc") sorted.sort((a, b) => priceValue(b.price) - priceValue(a.price))
    if (sort === "price-asc") sorted.sort((a, b) => priceValue(a.price) - priceValue(b.price))
    if (sort === "beds") sorted.sort((a, b) => b.beds - a.beds)
    if (sort === "newest") sorted.sort((a, b) => b.id - a.id)
    return sorted
  }, [items, query, sort, type])

  const deleteButton = (listing: Listing, compact?: boolean) => {
    const confirming = pendingDelete === listing.id
    return confirming ? (
      <span className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            onDelete(listing.id)
            setPendingDelete(null)
          }}
          className="rounded-lg bg-red-600/90 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-red-700"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={() => setPendingDelete(null)}
          aria-label="Cancel delete"
          className="grid h-7 w-7 place-items-center rounded-lg border border-ink/10 text-ink/45 transition-colors hover:text-ink"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </span>
    ) : (
      <button
        type="button"
        onClick={() => setPendingDelete(listing.id)}
        aria-label={`Delete ${listing.title}`}
        className={cn(
          "grid h-8 w-8 place-items-center rounded-lg text-ink/35 transition-colors hover:bg-red-50 hover:text-red-600",
          compact && "h-7 w-7",
        )}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow-brand flex items-center gap-3">
            Inventory
            <span className="eyebrow-rule" aria-hidden="true" />
          </p>
          <h1 className="mt-4 font-serif text-[2rem] leading-[1.05] tracking-[-0.02em] text-ink sm:text-[2.5rem]">
            All listings
          </h1>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
            {items.length} records in the collection. Edit pricing, photography and copy — then publish.
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

      <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:max-w-xs lg:flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, area or price…"
            aria-label="Search listings"
            className="h-10 w-full rounded-full border border-ink/10 bg-cream-card pl-10 pr-4 text-[12.5px] text-ink placeholder:text-ink/30 transition-colors hover:border-ink/20 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
          />
        </div>

        <div className="inline-flex w-fit items-center gap-1 rounded-full border border-ink/10 bg-cream-card p-1" role="group" aria-label="Filter by listing type">
          {typeFilters.map((filter) => (
            <button
              key={filter.label}
              type="button"
              aria-pressed={type === filter.value}
              onClick={() => setType(filter.value)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors",
                type === filter.value ? "bg-brand text-white" : "text-ink-soft hover:text-ink",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="lg:ml-auto lg:w-48">
          <AdminSelect label="Sort listings" value={sort} options={sortOptions} onChange={(value) => setSort(value as SortKey)} />
        </div>
      </div>

      {/* Desktop table */}
      <div className="mt-4 hidden overflow-hidden rounded-2xl border border-ink/[0.07] bg-cream-card md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ink/[0.06] bg-cream-deep/30 text-[9.5px] uppercase tracking-[0.16em] text-ink/40">
              <th scope="col" className="px-5 py-3 font-semibold">Listing</th>
              <th scope="col" className="px-4 py-3 font-semibold">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold">Price</th>
              <th scope="col" className="hidden px-4 py-3 font-semibold xl:table-cell">Layout</th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/[0.06]">
            {visible.map((listing) => (
              <tr key={listing.id} className="transition-colors hover:bg-cream-deep/25">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={listing.image} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-semibold text-ink">{listing.title}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-soft">
                        <MapPin className="h-3 w-3 shrink-0 text-ink/25" aria-hidden="true" />
                        <span className="truncate">{listing.location}</span>
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <TypeBadge type={listing.type} />
                </td>
                <td className="px-4 py-3 text-[12.5px] font-semibold tabular-nums text-ink">{listing.price}</td>
                <td className="hidden px-4 py-3 xl:table-cell">
                  <span className="flex items-center gap-3 text-[11.5px] text-ink-soft">
                    <span className="inline-flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5 text-ink/25" aria-hidden="true" />
                      {listing.beds}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Bath className="h-3.5 w-3.5 text-ink/25" aria-hidden="true" />
                      {listing.baths}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Ruler className="h-3.5 w-3.5 text-ink/25" aria-hidden="true" />
                      {listing.sqft} sqft
                    </span>
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(listing)}
                      aria-label={`Edit ${listing.title}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-ink/35 transition-colors hover:bg-brand-tint hover:text-brand"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    {deleteButton(listing)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visible.length === 0 && (
          <p className="px-5 py-10 text-center text-[12.5px] text-ink-soft">No listings match that search.</p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="mt-4 space-y-2 md:hidden">
        {visible.map((listing) => (
          <div key={listing.id} className="rounded-2xl border border-ink/[0.07] bg-cream-card p-3">
            <div className="flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={listing.image} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-semibold text-ink">{listing.title}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-soft">
                  <MapPin className="h-3 w-3 shrink-0 text-ink/25" aria-hidden="true" />
                  <span className="truncate">{listing.location}</span>
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <TypeBadge type={listing.type} />
                  <span className="text-[12px] font-semibold tabular-nums text-ink">{listing.price}</span>
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-ink/[0.06] pt-2">
              <span className="text-[11px] text-ink-soft">
                {listing.beds} beds · {listing.baths} baths · {listing.sqft} sqft
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(listing)}
                  className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-brand transition-colors hover:bg-brand-tint"
                >
                  Edit
                </button>
                {deleteButton(listing, true)}
              </div>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="rounded-2xl border border-dashed border-ink/15 px-5 py-10 text-center text-[12.5px] text-ink-soft">
            No listings match that search.
          </p>
        )}
      </div>
    </div>
  )
}
