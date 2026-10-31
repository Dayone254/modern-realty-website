import type { Metadata } from "next"
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PropertiesBrowser } from "@/components/properties-browser"

export const metadata: Metadata = {
  title: "All Properties",
  description:
    "Browse every verified home, apartment and investment property in the Ardhi & Co. collection, filtered by neighborhood, budget and layout.",
}

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-cream">
      <SiteHeader />
      <main>
        <Suspense fallback={null}>
          <PropertiesBrowser />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}
