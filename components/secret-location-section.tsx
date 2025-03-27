"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { Star } from "lucide-react"

export function SecretLocationSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setShowLeftArrow(scrollLeft > 20)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20)
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll)
      // Initial check
      checkScroll()

      // Check on window resize
      window.addEventListener("resize", checkScroll)

      return () => {
        scrollContainer.removeEventListener("scroll", checkScroll)
        window.removeEventListener("resize", checkScroll)
      }
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 300
    const currentScroll = scrollContainerRef.current.scrollLeft

    scrollContainerRef.current.scrollTo({
      left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: "smooth",
    })
  }

  const locationImages = [
    {
      src: "/images/location-terrace.png",
      alt: "Terrasse privée avec vue sur le jardin",
    },
    {
      src: "/images/location-bathroom.png",
      alt: "Salle de bain luxueuse avec baignoire",
    },
    {
      src: "/images/location-bedroom.png",
      alt: "Chambre élégante et lumineuse",
    },
    {
      src: "/images/location-bamboo-bed.png",
      alt: "Lit à baldaquin en bambou",
    },
  ]

  return (
    <section className="relative min-h-[500px]">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/dark-green-leaves-bg.png" alt="Feuilles vertes" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-[#0A291C]/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-alta text-4xl sm:text-5xl md:text-6xl text-[#c29c3d] mb-10 leading-tight">
              VOTRE SÉJOUR
              <br />
              DANS UN LIEU TENU SECRET
            </h2>

            {/* Stars */}
            <div className="flex justify-center space-x-4 mb-10">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="w-10 h-10 fill-[#c29c3d] text-[#c29c3d]" />
              ))}
            </div>

            {/* Description */}
            <p className="text-white text-xl sm:text-2xl font-light leading-relaxed mb-16 max-w-3xl mx-auto">
              Un cadre d&apos;exception, dévoilé uniquement aux participantes confirmées. Un endroit qui favorise une
              transformation profonde.
            </p>
          </div>

          {/* Circular images with captions below */}
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-10 md:gap-12">
              {locationImages.map((image, index) => (
                <div key={index} className="flex flex-col items-center w-56 md:w-64">
                  {/* Circular image container */}
                  <div className="group relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-[#c29c3d] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(194,156,61,0.4)]">
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 224px, 256px"
                    />
                  </div>
                  {/* Caption below the image */}
                  <p className="text-white text-sm font-light mt-4 text-center">{image.alt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative line */}
          <div className="w-32 h-1 bg-[#c29c3d] mx-auto mt-12"></div>
        </div>
      </div>
    </section>
  )
}

