"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type FilterOption = { value: string; label: string }

/**
 * Radix Select rejects an empty item value, so "no filter" travels through the
 * component as this sentinel and is mapped back to "" before it leaves the field.
 */
const ANY = "__any__"

/**
 * One filter control used by the hero search bar and the properties browser, so
 * both read as the same piece of furniture: icon, eyebrow label, current value
 * and a real, keyboard-navigable menu instead of a transparent native select.
 */
export function FilterField({
  icon: Icon,
  label,
  value,
  options,
  onChange,
  displayLabel,
  className,
}: {
  icon: LucideIcon
  label: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
  /** Overrides the value text while keeping `value` as the actual selection. */
  displayLabel?: string
  className?: string
}) {
  const current = options.find((option) => option.value === value) ?? options[0]
  const isActive = Boolean(value || displayLabel)

  return (
    <SelectPrimitive.Root
      value={value || ANY}
      onValueChange={(next) => onChange(next === ANY ? "" : next)}
    >
      <SelectPrimitive.Trigger
        aria-label={label}
        className={cn(
          "group flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition-colors duration-200 sm:py-3",
          "hover:bg-cream-deep/50 data-[state=open]:bg-cream-deep/70",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/35",
          className,
        )}
      >
        <span
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-200",
            isActive
              ? "border-brand/15 bg-brand-tint text-brand"
              : "border-ink/[0.07] bg-cream-deep/60 text-ink/40 group-hover:border-ink/10 group-hover:text-ink/55",
          )}
        >
          <Icon className="h-[17px] w-[17px]" strokeWidth={1.6} aria-hidden="true" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[9.5px] font-medium uppercase tracking-[0.18em] text-ink/45">{label}</span>
          <span
            className={cn(
              "mt-0.5 block truncate text-[13.5px] font-semibold leading-tight transition-colors",
              isActive ? "text-brand" : "text-ink",
            )}
          >
            {displayLabel ?? current.label}
          </span>
        </span>

        <ChevronDown
          className="h-3.5 w-3.5 shrink-0 text-ink/25 transition-transform duration-300 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          align="start"
          sideOffset={8}
          className={cn(
            "z-50 w-[var(--radix-select-trigger-width)] min-w-[13rem] overflow-hidden rounded-2xl border border-ink/[0.08] bg-cream-card p-1.5 shadow-[0_24px_50px_-24px_rgba(21,21,15,0.35)]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
          )}
        >
          <SelectPrimitive.Viewport>
            <SelectPrimitive.Group>
              <SelectPrimitive.Label className="px-3 pb-1 pt-2 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-ink/35">
                {label}
              </SelectPrimitive.Label>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value || ANY}
                  value={option.value || ANY}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[13px] text-ink-soft outline-none transition-colors",
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
            </SelectPrimitive.Group>
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
