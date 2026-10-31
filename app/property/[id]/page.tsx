"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bath, Bed, Calendar, CheckCircle, Mail, MapPin, Phone, Square } from "lucide-react"
import { getListing, listings } from "@/data/listings"

export default function PropertyDetails() {
  const params = useParams<{ id: string }>()
  const property = getListing(params?.id)

  if (!property) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
          <p className="mt-3 text-gray-600">The listing you are looking for may have been taken down.</p>
          <Button asChild className="mt-6 rounded-full bg-blue-600 hover:bg-blue-700">
            <Link href="/#properties">Browse all properties</Link>
          </Button>
        </div>
      </main>
    )
  }

  const highlights = [
    { icon: Bed, label: "Bedrooms", value: property.beds },
    { icon: Bath, label: "Bathrooms", value: property.baths },
    { icon: Square, label: "Area", value: `${property.sqft} sq ft` },
  ]

  const similar = listings.filter((listing) => listing.id !== property.id).slice(0, 3)
  const amenities = Array.from(new Set([...property.features, ...property.amenities]))

  return (
    <main className="min-h-screen bg-gray-50 pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Link
          href="/#properties"
          className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-white hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to properties
        </Link>

        {/* Hero */}
        <section className="listing-hero relative overflow-hidden rounded-3xl">
          <Image
            src={property.image}
            alt={property.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-10">
            <Badge className="mb-3 bg-blue-600 text-[0.7rem] uppercase tracking-wider">{property.type}</Badge>
            <h1 className="text-2xl font-bold leading-tight sm:text-4xl lg:text-5xl">{property.title}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-white/90 sm:text-base">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              {property.location}
            </p>
            <p className="mt-3 text-2xl font-bold sm:text-3xl">{property.price}</p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="w-full rounded-full bg-blue-600 px-6 hover:bg-blue-700 sm:w-auto">
                <Calendar className="mr-2 h-5 w-5" aria-hidden="true" />
                Schedule Viewing
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full border-white/70 bg-transparent px-6 text-white hover:bg-white/15 hover:text-white sm:w-auto"
              >
                <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
                Contact Agent
              </Button>
            </div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <section aria-labelledby="overview-heading" className="rounded-3xl bg-white p-5 shadow-sm sm:p-8">
              <h2 id="overview-heading" className="text-xl font-bold text-gray-900 sm:text-2xl">
                Overview
              </h2>

              <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                {highlights.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3 sm:bg-transparent sm:px-0 sm:py-0"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50">
                      <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                    </span>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
                      <dd className="text-lg font-semibold text-gray-900">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <p className="mt-6 leading-relaxed text-gray-600">{property.fullDescription}</p>
            </section>

            <section aria-labelledby="features-heading" className="rounded-3xl bg-white p-5 shadow-sm sm:p-8">
              <h2 id="features-heading" className="text-xl font-bold text-gray-900 sm:text-2xl">
                Features &amp; Amenities
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {amenities.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="location-heading" className="rounded-3xl bg-white p-5 shadow-sm sm:p-8">
              <h2 id="location-heading" className="text-xl font-bold text-gray-900 sm:text-2xl">
                Location
              </h2>
              <p className="mt-4 flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                {property.location}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-blue-700 underline-offset-4 hover:underline"
              >
                Open in Google Maps
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="min-w-0 space-y-6">
            <section aria-labelledby="agent-heading" className="rounded-3xl bg-white p-5 shadow-sm sm:p-8">
              <h2 id="agent-heading" className="text-xl font-bold text-gray-900 sm:text-2xl">
                Contact Agent
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Talk to a local specialist about {property.title} in {property.location}.
              </p>
              <div className="mt-5 space-y-3">
                <Button asChild size="lg" className="w-full rounded-full bg-blue-600 hover:bg-blue-700">
                  <a href="tel:+254700123456">
                    <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
                    Call Agent
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full rounded-full">
                  <a href={`mailto:info@ardhi.co.ke?subject=${encodeURIComponent(property.title)}`}>
                    <Mail className="mr-2 h-5 w-5" aria-hidden="true" />
                    Email Agent
                  </a>
                </Button>
              </div>
            </section>

            <section aria-labelledby="similar-heading" className="rounded-3xl bg-white p-5 shadow-sm sm:p-8">
              <h2 id="similar-heading" className="text-xl font-bold text-gray-900 sm:text-2xl">
                Similar Properties
              </h2>
              <ul className="mt-5 space-y-4">
                {similar.map((listing) => (
                  <li key={listing.id}>
                    <Link
                      href={`/property/${listing.id}`}
                      className="group flex gap-4 rounded-2xl p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={listing.image}
                          alt={listing.title}
                          fill
                          sizes="80px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-gray-900 group-hover:text-blue-700">
                          {listing.title}
                        </h3>
                        <p className="truncate text-sm text-gray-600">{listing.location}</p>
                        <p className="mt-1 font-semibold text-blue-700">{listing.price}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}
