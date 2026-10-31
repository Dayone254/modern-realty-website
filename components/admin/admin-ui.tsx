"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/** Radix Select rejects an empty item value; "no filter" rides on this sentinel. */
const ANY = "__any__"

export const inputClass =
  "h-11 w-full rounded-xl border border-ink/10 bg-cream-card px-3.5 text-[13px] text-ink placeholder:text-ink/30 transition-colors hover:border-ink/20 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"

export const textareaClass =
  "w-full resize-y rounded-xl border border-ink/10 bg-cream-card px-3.5 py-3 text-[13px] leading-relaxed text-ink placeholder:text-ink/30 transition-colors hover:border-ink/20 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"

export function AdminSelect({
  id,
  label,
  value,
  options,
  onChange,
  className,
  placeholder = "Select",
}: {
  id?: string
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}) {
  return (
    <SelectPrimitive.Root value={value || ANY} onValueChange={(next) => onChange(next === ANY ? "" : next)}>
      <SelectPrimitive.Trigger
        id={id}
        aria-label={label}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-ink/10 bg-cream-card px-3.5 text-left text-[13px] font-medium text-ink transition-colors",
          "hover:border-ink/20 focus:outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/15",
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4 text-ink/35" aria-hidden="true" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          align="start"
          sideOffset={6}
          className={cn(
            "z-50 w-[var(--radix-select-trigger-width)] min-w-[11rem] overflow-hidden rounded-xl border border-ink/[0.08] bg-cream-card p-1.5 shadow-[0_24px_50px_-24px_rgba(21,21,15,0.35)]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          )}
        >
          <SelectPrimitive.Viewport>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value || ANY}
                value={option.value || ANY}
                className={cn(
                  "relative flex cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-3 py-2 text-[13px] text-ink-soft outline-none transition-colors",
                  "data-[highlighted]:bg-cream-deep/70 data-[highlighted]:text-ink",
                  "data-[state=checked]:font-semibold data-[state=checked]:text-brand",
                )}
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

export function Field({
  label,
  hint,
  required,
  htmlFor,
  children,
  className,
}: {
  label: string
  hint?: string
  required?: boolean
  htmlFor?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-ink/45">
          {label}
          {required && <span className="ml-1 text-brand">*</span>}
        </label>
        {hint && <span className="text-[10.5px] text-ink/35">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

export function Panel({
  title,
  description,
  action,
  children,
  bodyClassName,
  className,
}: {
  title?: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  bodyClassName?: string
  className?: string
}) {
  return (
    <section className={cn("rounded-2xl border border-ink/[0.07] bg-cream-card", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-ink/[0.06] px-5 py-4">
          <div>
            {title && <h2 className="text-[12.5px] font-semibold text-ink">{title}</h2>}
            {description && <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-soft">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string
  value: string
  hint: string
  icon: LucideIcon
  accent?: boolean
}) {
  return (
    <div className="group rounded-2xl border border-ink/[0.07] bg-cream-card p-4 transition-colors hover:border-ink/15 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-ink/40">{label}</span>
        <span
          className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors",
            accent ? "border-brand/15 bg-brand-tint text-brand" : "border-ink/[0.07] bg-cream-deep/60 text-ink/40",
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2.5 font-serif text-[1.55rem] leading-none text-ink tabular-nums max-[360px]:text-[1.35rem] sm:mt-3 sm:text-[1.9rem]">{value}</p>
      <p className="mt-1.5 text-[11px] leading-relaxed text-ink-soft sm:mt-2 sm:text-[11.5px]">{hint}</p>
    </div>
  )
}

export function TypeBadge({ type }: { type: "Sale" | "Rent" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em]",
        type === "Sale"
          ? "border-brand/15 bg-brand-tint text-brand"
          : "border-ink/10 bg-cream-deep/70 text-ink-soft",
      )}
    >
      {type === "Sale" ? "For sale" : "For rent"}
    </span>
  )
}
