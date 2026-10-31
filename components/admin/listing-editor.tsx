"use client"

import { useRef, useState } from "react"
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  Image as ImageIcon,
  MapPin,
  Plus,
  Ruler,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import { AdminSelect, Field, Panel, TypeBadge, inputClass, textareaClass } from "@/components/admin/admin-ui"
import { cn } from "@/lib/utils"
import type { Listing } from "@/data/listings"

function ChipEditor({
  label,
  hint,
  values,
  placeholder,
  onAdd,
  onRemove,
}: {
  label: string
  hint: string
  values: string[]
  placeholder: string
  onAdd: (value: string) => void
  onRemove: (index: number) => void
}) {
  const [draft, setDraft] = useState("")

  const commit = () => {
    const value = draft.trim()
    if (!value) return
    if (!values.some((item) => item.toLowerCase() === value.toLowerCase())) onAdd(value)
    setDraft("")
  }

  return (
    <Field label={label} hint={hint}>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              commit()
            }
          }}
          placeholder={placeholder}
          className={inputClass}
        />
        <button
          type="button"
          onClick={commit}
          aria-label={`Add ${label.toLowerCase()}`}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-ink/10 bg-cream-card text-ink/45 transition-colors hover:border-brand/30 hover:bg-brand-tint hover:text-brand"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {values.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {values.map((value, index) => (
            <span
              key={`${value}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-cream-deep/50 py-1 pl-2.5 pr-1.5 text-[11.5px] font-medium text-ink-soft"
            >
              {value}
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Remove ${value}`}
                className="grid h-4 w-4 place-items-center rounded-full text-ink/35 transition-colors hover:bg-ink/10 hover:text-ink"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="pt-1 text-[11px] text-ink/35">Nothing added yet.</p>
      )}
    </Field>
  )
}

function readiness(listing: Listing) {
  const checks = [
    { label: "Title", done: Boolean(listing.title.trim()) },
    { label: "Location", done: Boolean(listing.location.trim()) },
    { label: "Price", done: Boolean(listing.price.trim()) },
    { label: "Cover image", done: Boolean(listing.image.trim()) },
    { label: "Short description", done: Boolean(listing.description.trim()) },
    { label: "Full description", done: Boolean(listing.fullDescription.trim()) },
    { label: "3+ features", done: listing.features.length >= 3 },
    { label: "3+ amenities", done: listing.amenities.length >= 3 },
  ]
  return { checks, percent: Math.round((checks.filter((check) => check.done).length / checks.length) * 100) }
}

export function ListingEditor({
  draft,
  isNew,
  onChange,
  onSave,
  onCancel,
  onDelete,
}: {
  draft: Listing
  isNew: boolean
  onChange: (patch: Partial<Listing>) => void
  onSave: () => void
  onCancel: () => void
  onDelete: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const { checks, percent } = readiness(draft)
  const canSave = Boolean(draft.title.trim() && draft.location.trim() && draft.price.trim())

  const addFeature = (value: string) => onChange({ features: [...draft.features, value] })
  const removeFeature = (index: number) => onChange({ features: draft.features.filter((_, i) => i !== index) })
  const addAmenity = (value: string) => onChange({ amenities: [...draft.amenities, value] })
  const removeAmenity = (index: number) => onChange({ amenities: draft.amenities.filter((_, i) => i !== index) })

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    onChange({ image: URL.createObjectURL(file) })
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-[11.5px] font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          All listings
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-ink/10 px-4 py-2.5 text-[12px] font-semibold text-ink-soft transition-colors hover:border-ink/25 hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!canSave}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-semibold text-white transition-colors",
              canSave
                ? "bg-brand shadow-[0_12px_26px_-14px_rgba(33,90,237,0.9)] hover:bg-brand-dark"
                : "cursor-not-allowed bg-ink/20",
            )}
          >
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            {isNew ? "Publish listing" : "Save changes"}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h1 className="font-serif text-[2rem] leading-[1.05] tracking-[-0.02em] text-ink sm:text-[2.5rem]">
          {isNew ? "New listing" : "Edit listing"}
        </h1>
        <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-ink-soft">
          {isNew
            ? "Add a home to the collection. The preview updates as you fill it in."
            : "Refine the details below — the public card and detail page use exactly these fields."}
        </p>
      </div>

      <div className="mt-7 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <Panel title="Basics" description="How the listing is titled, priced and filed">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" required className="sm:col-span-2">
                <input
                  value={draft.title}
                  onChange={(event) => onChange({ title: event.target.value })}
                  placeholder="e.g. Modern Villa with Pool"
                  className={inputClass}
                />
              </Field>

              <Field label="Location" required>
                <input
                  value={draft.location}
                  onChange={(event) => onChange({ location: event.target.value })}
                  placeholder="Karen, Nairobi"
                  className={inputClass}
                />
              </Field>

              <Field label="Price" required hint="Displayed as written">
                <input
                  value={draft.price}
                  onChange={(event) => onChange({ price: event.target.value })}
                  placeholder="KSh 85,000,000"
                  className={inputClass}
                />
              </Field>

              <Field label="Listing type">
                <AdminSelect
                  label="Listing type"
                  value={draft.type}
                  options={[
                    { value: "Sale", label: "For sale" },
                    { value: "Rent", label: "For rent" },
                  ]}
                  onChange={(value) => onChange({ type: value === "Rent" ? "Rent" : "Sale" })}
                />
              </Field>

              <Field label="Area (sqft)">
                <input
                  value={draft.sqft}
                  onChange={(event) => onChange({ sqft: event.target.value })}
                  placeholder="4,800"
                  inputMode="numeric"
                  className={inputClass}
                />
              </Field>

              <Field label="Bedrooms">
                <input
                  type="number"
                  min={0}
                  value={draft.beds}
                  onChange={(event) => onChange({ beds: Number(event.target.value) || 0 })}
                  className={inputClass}
                />
              </Field>

              <Field label="Bathrooms">
                <input
                  type="number"
                  min={0}
                  value={draft.baths}
                  onChange={(event) => onChange({ baths: Number(event.target.value) || 0 })}
                  className={inputClass}
                />
              </Field>
            </div>
          </Panel>

          <Panel title="Story" description="The short hook and the long-form detail page copy">
            <div className="space-y-4">
              <Field label="Short description" hint={`${draft.description.length} chars`}>
                <textarea
                  value={draft.description}
                  onChange={(event) => onChange({ description: event.target.value })}
                  rows={3}
                  placeholder="One or two lines for the property card."
                  className={textareaClass}
                />
              </Field>

              <Field label="Full description" hint={`${draft.fullDescription.length} chars`}>
                <textarea
                  value={draft.fullDescription}
                  onChange={(event) => onChange({ fullDescription: event.target.value })}
                  rows={6}
                  placeholder="The story of the home — light, layout, materials, the neighborhood."
                  className={textareaClass}
                />
              </Field>
            </div>
          </Panel>

          <Panel title="Features & amenities">
            <div className="space-y-4">
              <ChipEditor
                label="Features"
                hint={`${draft.features.length} added`}
                values={draft.features}
                placeholder="Rooftop terrace"
                onAdd={addFeature}
                onRemove={removeFeature}
              />
              <ChipEditor
                label="Amenities"
                hint={`${draft.amenities.length} added`}
                values={draft.amenities}
                placeholder="24/7 security"
                onAdd={addAmenity}
                onRemove={removeAmenity}
              />
            </div>
          </Panel>

          <Panel title="Media" description="The cover photo used on cards and the detail hero">
            <div className="space-y-4">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-ink/[0.07] bg-cream-deep/50">
                {draft.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={draft.image} alt="Listing preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-ink/30">
                    <ImageIcon className="h-6 w-6" aria-hidden="true" />
                    <p className="text-[11.5px]">No cover image yet</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={draft.image}
                  onChange={(event) => onChange({ image: event.target.value })}
                  placeholder="/images/karen-villa.jpg or https://…"
                  aria-label="Image URL"
                  className={inputClass}
                />
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-ink/10 px-4 text-[12px] font-semibold text-ink-soft transition-colors hover:border-ink/25 hover:text-ink"
                >
                  <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                  Upload
                </button>
              </div>
            </div>
          </Panel>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <Panel title="Public preview" description="The card as visitors see it" bodyClassName="p-3">
            <div className="overflow-hidden rounded-xl border border-ink/[0.07] bg-cream-card">
              <div className="relative aspect-[4/3] bg-cream-deep">
                {draft.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={draft.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink/25">
                    <ImageIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                )}
                <span className="absolute left-3 top-3">
                  <TypeBadge type={draft.type} />
                </span>
              </div>
              <div className="p-3.5">
                <p className="line-clamp-2 font-serif text-[15px] leading-snug text-ink">
                  {draft.title || "Untitled listing"}
                </p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-soft">
                  <MapPin className="h-3 w-3 shrink-0 text-ink/30" aria-hidden="true" />
                  <span className="truncate">{draft.location || "Location"}</span>
                </p>
                <p className="mt-2 text-[13px] font-semibold tabular-nums text-ink">{draft.price || "Price on request"}</p>
                <div className="mt-2 flex items-center gap-3 border-t border-ink/[0.06] pt-2 text-[10.5px] text-ink-soft">
                  <span className="inline-flex items-center gap-1">
                    <BedDouble className="h-3 w-3 text-ink/25" aria-hidden="true" />
                    {draft.beds}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Bath className="h-3 w-3 text-ink/25" aria-hidden="true" />
                    {draft.baths}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Ruler className="h-3 w-3 text-ink/25" aria-hidden="true" />
                    {draft.sqft || "0"} sqft
                  </span>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Readiness" description={`${percent}% complete`}>
            <div className="h-1.5 overflow-hidden rounded-full bg-cream-deep">
              <div
                className={cn("h-full rounded-full transition-[width] duration-500", percent === 100 ? "bg-brand" : "bg-brand/70")}
                style={{ width: `${percent}%` }}
              />
            </div>
            <ul className="mt-4 space-y-2">
              {checks.map((check) => (
                <li key={check.label} className="flex items-center gap-2 text-[11.5px]">
                  <span
                    className={cn(
                      "grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                      check.done ? "border-brand/20 bg-brand-tint text-brand" : "border-ink/15 text-transparent",
                    )}
                  >
                    <Check className="h-2.5 w-2.5" aria-hidden="true" />
                  </span>
                  <span className={check.done ? "text-ink-soft" : "text-ink/40"}>{check.label}</span>
                </li>
              ))}
            </ul>
          </Panel>

          {!isNew && (
            <Panel title="Remove listing" bodyClassName="p-4">
              <p className="text-[11.5px] leading-relaxed text-ink-soft">
                This removes the record from the workspace. It cannot be undone.
              </p>
              <button
                type="button"
                onClick={onDelete}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-[11.5px] font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Delete listing
              </button>
            </Panel>
          )}
        </aside>
      </div>
    </div>
  )
}
