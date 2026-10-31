import type { Listing } from "@/data/listings"

/** Price strings are display text ("KSh 45,000,000"), so comparisons need the number. */
export function priceValue(price: string) {
  const digits = price.replace(/[^\d]/g, "")
  return digits ? Number(digits) : 0
}

/** "Karen, Nairobi" -> "Karen" */
export function areaOf(location: string) {
  return location.split(",")[0]?.trim() ?? location
}

export const budgetRanges: { value: string; label: string }[] = [
  { value: "", label: "Any Budget" },
  { value: "under-1m", label: "Under KSh 1M" },
  { value: "1m-50m", label: "KSh 1M – 50M" },
  { value: "50m-plus", label: "KSh 50M+" },
]

export function withinBudget(listing: Listing, budget: string) {
  if (!budget) return true

  const value = priceValue(listing.price)

  if (budget === "under-1m") return value < 1_000_000
  if (budget === "1m-50m") return value >= 1_000_000 && value <= 50_000_000
  if (budget === "50m-plus") return value > 50_000_000
  return true
}
