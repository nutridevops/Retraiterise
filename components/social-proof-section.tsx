"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

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

  // Rearranged logos from small to big based on visual size
  const logos = [
    { src: "/images/logos/ancy-gold.png", alt: "Ancy", width: 320 },
    { src: "/images/logos/team4job-gold.png", alt: "Team4Job", width: 360 },
    { src: "/images/logos/bondekom-gold.png", alt: "Bondekom", width: 400 },
    { src: "/images/logos/brussels-airlines-gold.png", alt: "Brussels Airlines", width: 440 },
    { src: "/images/logos/ngalizia-gold.png", alt: "Ngalizia", width: 480 },
    { src: "/images/logos/the-nine-gold.png", alt: "The Nine", width: 520 },
    { src: "/images/logos/elle-active-gold.png", alt: "ELLE Active", width: 540 },
  ]

  return (
    <section ref={sectionRef} className="py-32 bg-[#0A291C]">
      <div className="container mx-auto px-4">
        <h2
          className={`font-alta text-4xl sm:text-5xl text-[#c29c3d] text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          ILS NOUS ONT FAIT CONFIANCE
        </h2>

        <div className="max-w-6xl mx-auto">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
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
                }}
              >
                <div className="relative h-72 w-full flex items-center justify-center p-6 bg-transparent">
                  <Image
                    src={logo.src || "/placeholder.svg"}
                    alt={logo.alt}
                    width={logo.width}
                    height={240}
                    className="object-contain max-h-60"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <p
            className={`text-white/70 text-lg font-light max-w-2xl mx-auto transition-all duration-1000 delay-500 ${
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

