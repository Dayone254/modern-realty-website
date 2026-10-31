"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Building2, Check, LayoutDashboard, Plus, RotateCcw } from "lucide-react"
import { Logo } from "@/components/logo"
import { OverviewView } from "@/components/admin/overview-view"
import { PropertiesView } from "@/components/admin/properties-view"
import { ListingEditor } from "@/components/admin/listing-editor"
import { listings as seedListings, type Listing } from "@/data/listings"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "ardhi.admin.listings.v1"

type View = "overview" | "listings" | "editor"

const cloneListings = (items: Listing[]): Listing[] =>
  items.map((listing) => ({ ...listing, features: [...listing.features], amenities: [...listing.amenities] }))

function blankListing(id: number): Listing {
  return {
    id,
    title: "",
    location: "Nairobi",
    price: "",
    image: "",
    beds: 0,
    baths: 0,
    sqft: "",
    type: "Sale",
    description: "",
    features: [],
    fullDescription: "",
    amenities: [],
  }
}

export function AdminWorkspace() {
  const [items, setItems] = useState<Listing[]>(() => cloneListings(seedListings))
  const [hydrated, setHydrated] = useState(false)
  const [view, setView] = useState<View>("overview")
  const [draft, setDraft] = useState<Listing | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Load any local edits after mount so the server and first client render match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.every((item) => typeof item?.id === "number" && typeof item?.title === "string")) {
          setItems(cloneListings(parsed as Listing[]))
        }
      }
    } catch {
      // corrupted storage falls back to the seed data
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage may be unavailable (private mode); the workspace still works in memory
    }
  }, [items, hydrated])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  const startNew = () => {
    const nextId = items.reduce((max, listing) => Math.max(max, listing.id), 0) + 1
    setDraft(blankListing(nextId))
    setIsNew(true)
    setView("editor")
  }

  const startEdit = (listing: Listing) => {
    setDraft(cloneListings([listing])[0])
    setIsNew(false)
    setView("editor")
  }

  const saveDraft = () => {
    if (!draft) return
    setItems((current) =>
      isNew ? [...current, draft] : current.map((listing) => (listing.id === draft.id ? draft : listing)),
    )
    setDraft(null)
    setView("listings")
    setToast(isNew ? "Listing published" : "Changes saved")
  }

  const deleteListing = (id: number) => {
    setItems((current) => current.filter((listing) => listing.id !== id))
    if (draft?.id === id) {
      setDraft(null)
      setView("listings")
    }
    setToast("Listing removed")
  }

  const resetWorkspace = () => {
    setItems(cloneListings(seedListings))
    setDraft(null)
    setView("overview")
    setToast("Sample data restored")
  }

  const nav = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
    { id: "listings" as const, label: "Listings", icon: Building2, count: items.length },
  ]

  const heading = view === "overview" ? "Overview" : view === "editor" ? "Listing editor" : "Listings"

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-ink/[0.08] bg-cream-card/60 px-5 py-6 lg:flex">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Ardhi & Co. — back to site">
            <Logo tagline={false} />
          </Link>
          <p className="mt-2 pl-[52px] text-[9px] font-semibold uppercase tracking-[0.22em] text-ink/35">
            Admin workspace
          </p>

          <nav aria-label="Admin" className="mt-10 space-y-1">
            {nav.map((item) => {
              const active = view === item.id || (view === "editor" && item.id === "listings")
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-medium transition-colors",
                    active ? "bg-brand-tint text-brand" : "text-ink-soft hover:bg-cream-deep/60 hover:text-ink",
                  )}
                >
                  <item.icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                  {item.label}
                  {"count" in item && item.count !== undefined && (
                    <span
                      className={cn(
                        "ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums",
                        active ? "bg-brand/10 text-brand" : "bg-ink/[0.06] text-ink/45",
                      )}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              )
            })}

            <button
              type="button"
              onClick={startNew}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-medium text-ink-soft transition-colors hover:bg-cream-deep/60 hover:text-ink"
            >
              <Plus className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              Add listing
            </button>
          </nav>

          <div className="mt-auto space-y-4">
            <div className="rounded-2xl border border-ink/[0.07] bg-cream-card p-4">
              <p className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-ink/40">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
                Local demo
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">
                Edits are saved in this browser only — the public site still reads the seed data.
              </p>
              <button
                type="button"
                onClick={resetWorkspace}
                className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand transition-colors hover:text-brand-dark"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Reset sample data
              </button>
            </div>

            <Link
              href="/"
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[12px] font-semibold text-ink-soft transition-colors hover:bg-cream-deep/60 hover:text-ink"
            >
              View live site
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <div className="flex items-center gap-3 border-t border-ink/[0.08] pt-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-tint text-[11px] font-bold text-brand">
                AK
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-ink">Amina Hassan</p>
                <p className="text-[10.5px] text-ink/45">Listing manager</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-ink/[0.08] bg-cream/85 backdrop-blur">
            <div className="flex h-[68px] items-center gap-3 px-4 sm:px-6 lg:px-10">
              <Link href="/" className="shrink-0 lg:hidden" aria-label="Ardhi & Co. — back to site">
                <Logo tagline={false} />
              </Link>

              <div className="hidden lg:block">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-ink/35">Admin workspace</p>
                <h2 className="mt-0.5 font-serif text-[17px] leading-none text-ink">{heading}</h2>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-2 text-[11.5px] font-semibold text-ink-soft transition-colors hover:border-ink/25 hover:text-ink"
                >
                  <span className="hidden sm:inline">View site</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Mobile nav */}
            <div className="flex gap-1 overflow-x-auto px-4 pb-3 lg:hidden">
              {nav.map((item) => {
                const active = view === item.id || (view === "editor" && item.id === "listings")
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setView(item.id)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors",
                      active ? "bg-brand text-white" : "border border-ink/10 text-ink-soft",
                    )}
                  >
                    <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {item.label}
                    {"count" in item && item.count !== undefined && (
                      <span className={cn("tabular-nums", active ? "text-white/70" : "text-ink/35")}>{item.count}</span>
                    )}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={resetWorkspace}
                className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-ink/40"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Reset
              </button>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            <div className="mx-auto w-full max-w-[1160px]">
              {view === "overview" && (
                <OverviewView
                  items={items}
                  onAdd={startNew}
                  onEdit={startEdit}
                  onViewAll={() => setView("listings")}
                />
              )}

              {view === "listings" && (
                <PropertiesView items={items} onAdd={startNew} onEdit={startEdit} onDelete={deleteListing} />
              )}

              {view === "editor" && draft && (
                <ListingEditor
                  draft={draft}
                  isNew={isNew}
                  onChange={(patch) => setDraft((current) => (current ? { ...current, ...patch } : current))}
                  onSave={saveDraft}
                  onCancel={() => {
                    setDraft(null)
                    setView("listings")
                  }}
                  onDelete={() => deleteListing(draft.id)}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
        >
          <div className="flex items-center gap-2.5 rounded-full bg-ink px-4 py-2.5 text-[12px] font-medium text-cream shadow-[0_18px_40px_-18px_rgba(21,21,15,0.7)]">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-brand/20 text-brand">
              <Check className="h-3 w-3" aria-hidden="true" />
            </span>
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
