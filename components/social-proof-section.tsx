"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

export function SocialProofSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  // Logos organized as in the first image with their respective URLs
  const logos = [
    { 
      src: "/images/logos/elle-active-gold.png", 
      alt: "ELLE Active", 
      width: 200, 
      url: "https://www.elle.be/fr/elle-active",
      gridArea: "1 / 1 / 2 / 2"
    },
    { 
      src: "/images/logos/the-nine-gold.png", 
      alt: "The Nine", 
      width: 200, 
      url: "https://thenine.be",
      gridArea: "1 / 2 / 2 / 3"
    },
    { 
      src: "/images/logos/brussels-airlines-gold.png", 
      alt: "Brussels Airlines", 
      width: 300, 
      url: "https://www.brusselsairlines.com/be",
      gridArea: "1 / 3 / 2 / 4"
    },
    { 
      src: "/images/logos/ngalizia-gold.png", 
      alt: "Ngalizia", 
      width: 200, 
      url: "#",
      gridArea: "2 / 1 / 3 / 2"
    },
    { 
      src: "/images/logos/team4job-gold.png", 
      alt: "Team4Job", 
      width: 200, 
      url: "https://team4job.be/",
      gridArea: "2 / 2 / 3 / 3"
    },
    { 
      src: "/images/logos/ancy-gold.png", 
      alt: "Ancy", 
      width: 200, 
      url: "https://ancystudio.com/",
      gridArea: "2 / 3 / 3 / 4"
    },
    { 
      src: "/images/logos/bondekom-gold.png", 
      alt: "Bondekom", 
      width: 250, 
      url: "#",
      gridArea: "3 / 1 / 4 / 2"
    },
    { 
      src: "/images/logos/baob-brussels-gold.png", 
      alt: "BAOB Brussels", 
      width: 250, 
      url: "https://baob-asbl.be/",
      gridArea: "3 / 2 / 4 / 4"
    },
  ]

  return (
    <section ref={sectionRef} className="py-32 bg-[#f5f2ea]">
      <div className="container mx-auto px-4">
        <h2
          className={`font-alta text-4xl sm:text-5xl text-[#0A291C] text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          ILS NOUS ONT FAIT CONFIANCE
        </h2>

        <div className="max-w-5xl mx-auto">
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ gridTemplateRows: "repeat(3, auto)" }}
          >
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center"
                style={{
                  transitionDelay: `${index * 100}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                  gridArea: logo.gridArea
                }}
              >
                <Link 
                  href={logo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative h-40 w-full flex items-center justify-center p-4 bg-transparent group"
                >
                  <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/10 transition-all duration-300 rounded-lg"></div>
                  <Image
                    src={logo.src || "/placeholder.svg"}
                    alt={logo.alt}
                    width={logo.width}
                    height={100}
                    className="object-contain max-h-32 transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <p
            className={`text-[#0A291C]/70 text-lg font-light max-w-2xl mx-auto transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Des entreprises de renom nous ont fait confiance pour accompagner leurs équipes vers l'excellence et le
            bien-être.
          </p>
        </div>
      </div>
    </section>
  )
}
