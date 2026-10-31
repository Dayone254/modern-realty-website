import { cn } from "@/lib/utils"

/**
 * The Ardhi & Co. lockup: a surveyor's A inside a plot boundary, set against a
 * Playfair wordmark. Everything inherits its colour, so the same component works
 * on paper and on ink without a second variant.
 */
export function Logo({
  className,
  tagline = true,
  markClassName,
  wordmarkClassName,
}: {
  className?: string
  tagline?: boolean
  markClassName?: string
  wordmarkClassName?: string
}) {
  return (
    <span className={cn("flex items-center gap-2.5 sm:gap-3", className)}>
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
        className={cn("h-9 w-9 shrink-0 text-brand sm:h-10 sm:w-10", markClassName)}
      >
        <rect
          x="4"
          y="4"
          width="32"
          height="32"
          rx="1.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          opacity="0.32"
        />
        <path
          d="M11.4 30 20 10.2 28.6 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M15.6 22.4h8.8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>

      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "whitespace-nowrap font-serif text-[19px] font-semibold leading-none tracking-[-0.01em] text-ink sm:text-[21px]",
            wordmarkClassName,
          )}
        >
          Ardhi <span className="font-normal">&amp; Co.</span>
        </span>
        {tagline && (
          <span className="mt-1.5 hidden text-[8px] font-semibold uppercase leading-none tracking-[0.26em] text-ink/40 sm:block">
            Land &amp; Homes
          </span>
        )}
      </span>
    </span>
  )
}
