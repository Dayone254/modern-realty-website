export type Listing = {
  id: number
  title: string
  location: string
  price: string
  image: string
  beds: number
  baths: number
  sqft: string
  type: "Sale" | "Rent"
  description: string
  features: string[]
  fullDescription: string
  amenities: string[]
}

export const listings: Listing[] = [
  {
    id: 1,
    title: "Luxury Penthouse Apartment",
    location: "Westlands, Nairobi",
    price: "KSh 45,000,000",
    image: "/images/nairobi-penthouse.jpg",
    beds: 3,
    baths: 2,
    sqft: "2,400",
    type: "Sale",
    description:
      "Stunning penthouse with panoramic city views, modern finishes, and premium amenities including a rooftop terrace.",
    features: ["Rooftop Terrace", "City Views", "Modern Kitchen", "Parking", "Security", "Gym Access"],
    fullDescription:
      "This exceptional penthouse apartment offers the pinnacle of luxury living in Westlands. Featuring floor-to-ceiling windows that showcase breathtaking panoramic views of Nairobi's skyline, this residence combines contemporary design with premium finishes throughout. The open-plan living area flows seamlessly onto a private rooftop terrace, perfect for entertaining. The gourmet kitchen features top-of-the-line appliances and custom cabinetry.",
    amenities: [
      "24/7 Concierge",
      "Rooftop Pool",
      "Private Elevator",
      "Wine Cellar",
      "Smart Home System",
      "Panoramic Views",
    ],
  },
  {
    id: 2,
    title: "Modern Villa with Pool",
    location: "Karen, Nairobi",
    price: "KSh 85,000,000",
    image: "/images/karen-villa.jpg",
    beds: 5,
    baths: 4,
    sqft: "4,800",
    type: "Sale",
    description:
      "Exquisite villa in prestigious Karen area featuring a swimming pool, landscaped gardens, and spacious living areas.",
    features: ["Swimming Pool", "Garden", "Staff Quarters", "Double Garage", "Solar Power", "Borehole"],
    fullDescription:
      "Set on a sprawling 1-acre plot in the heart of Karen, this magnificent villa represents the epitome of luxury family living. The property features meticulously landscaped gardens, a resort-style swimming pool, and multiple entertainment areas. The main house boasts soaring ceilings, premium finishes, and seamless indoor-outdoor living spaces that take full advantage of Kenya's beautiful climate.",
    amenities: [
      "Swimming Pool",
      "Landscaped Gardens",
      "Staff Quarters",
      "Solar Power System",
      "Borehole Water",
      "Entertainment Areas",
    ],
  },
  {
    id: 3,
    title: "Elegant Townhouse",
    location: "Kilimani, Nairobi",
    price: "KSh 32,000,000",
    image: "/images/kilimani-townhouse.jpg",
    beds: 4,
    baths: 3,
    sqft: "3,200",
    type: "Sale",
    description:
      "Beautiful townhouse in the heart of Kilimani with modern amenities and excellent connectivity to the city center.",
    features: ["Modern Design", "Balcony", "Fitted Kitchen", "Parking", "24/7 Security", "Backup Generator"],
    fullDescription:
      "This sophisticated townhouse in Kilimani offers the perfect blend of urban convenience and residential comfort. Located in one of Nairobi's most sought-after neighborhoods, the property features contemporary architecture, high-end finishes, and thoughtful design throughout. The open-plan living areas are complemented by private outdoor spaces and modern amenities.",
    amenities: [
      "Gated Community",
      "Backup Generator",
      "Modern Kitchen",
      "Private Balcony",
      "Secure Parking",
      "Fiber Internet",
    ],
  },
  {
    id: 4,
    title: "Contemporary Apartment",
    location: "Kileleshwa, Nairobi",
    price: "KSh 120,000/month",
    image: "/images/kileleshwa-apartment.jpg",
    beds: 2,
    baths: 2,
    sqft: "1,800",
    type: "Rent",
    description: "Stylish apartment in quiet Kileleshwa neighborhood with modern fittings and excellent amenities.",
    features: ["Furnished", "Balcony", "Parking", "Swimming Pool", "Gym", "Backup Power"],
    fullDescription:
      "This beautifully furnished apartment in the serene Kileleshwa area offers modern living at its finest. The unit features contemporary design, premium finishes, and a private balcony with garden views. Located in a well-maintained complex with excellent amenities, it's perfect for professionals seeking comfort and convenience.",
    amenities: ["Fully Furnished", "Swimming Pool", "Fitness Center", "Backup Power", "Secure Parking", "Garden Views"],
  },
  {
    id: 5,
    title: "Family Home with Garden",
    location: "Runda, Nairobi",
    price: "KSh 65,000,000",
    image: "/images/runda-family-home.jpg",
    beds: 4,
    baths: 3,
    sqft: "2,800",
    type: "Sale",
    description: "Spacious family home in exclusive Runda estate with mature gardens and excellent security.",
    features: ["Large Garden", "Staff Quarters", "Double Garage", "Study Room", "Fireplace", "Solar Heating"],
    fullDescription:
      "Nestled in the prestigious Runda estate, this charming family home offers tranquil living in one of Nairobi's most exclusive neighborhoods. The property features mature gardens, spacious living areas, and a warm, welcoming atmosphere perfect for family life. The home combines traditional charm with modern conveniences.",
    amenities: ["Mature Gardens", "Staff Quarters", "Study Room", "Fireplace", "Solar Water Heating", "Double Garage"],
  },
  {
    id: 6,
    title: "Luxury Serviced Apartment",
    location: "Upperhill, Nairobi",
    price: "KSh 180,000/month",
    image: "/images/upperhill-luxury.jpg",
    beds: 3,
    baths: 2,
    sqft: "2,100",
    type: "Rent",
    description: "Premium serviced apartment in Upperhill's business district with world-class amenities and services.",
    features: ["Fully Serviced", "City Views", "Concierge", "Gym & Spa", "Business Center", "Rooftop Pool"],
    fullDescription:
      "Experience luxury living in the heart of Nairobi's business district. This premium serviced apartment offers hotel-style amenities with the comfort of home. Located in Upperhill, you'll enjoy stunning city views, world-class facilities, and professional concierge services that cater to your every need.",
    amenities: [
      "Concierge Service",
      "Rooftop Pool",
      "Spa & Wellness",
      "Business Center",
      "Valet Parking",
      "City Views",
    ],
  },
]

export function getListing(id: string | number): Listing | undefined {
  return listings.find((listing) => String(listing.id) === String(id))
}
