"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

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

  // Auto-rotate testimonials on larger screens
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: "Tanja",
      role: "",
      image: "/images/testimonials/tanja.png",
      testimonial:
        "Laetitia possède une capacité d'écoute exceptionnelle, alliée à un talent pour trouver les mots justes et nous pousser à dépasser nos propres limites. Sa bienveillance, son expertise en neuro-performance, et son approche innovante font d'elle une coach incomparable.",
    },
    {
      name: "Elodie",
      role: "",
      image: "/images/testimonials/elodie.png",
      testimonial:
        "Ma première expérience avec Laetitia a été vraiment remarquable. J'ai eu l'impression d'être plongée dans une bulle de transformation où chaque partie de mon être se connectait pour réveiller ma conscience de tout mon potentiel.",
    },
    {
      name: "Camille",
      role: "",
      image: "/images/testimonials/camille.png",
      testimonial:
        "Avec Sandra, j'ai découvert une autre façon de faire du sport. Au fil des semaines, je sentais que mon corps devenait de plus en plus fort. Et son plan alimentaire sans chichi a été super simple à suivre. Elle écoute ses besoins physiques, elle est à l'écoute et ajuste les exercices.",
    },
    {
      name: "Daniela",
      role: "",
      image: "/images/testimonials/daniela.png",
      testimonial:
        "Sandra a su m'encourager à dépasser mes limites à chaque séance, tout en rendant l'entraînement à la fois fun et motivant. Malgré mon emploi du temps chargé, elle a réussi à me motiver à maintenir le rythme. Elle était aussi présente que moi dans l'atteinte de mes objectifs.",
    },
  ]

  // Custom image positioning for each testimonial to ensure perfect centering
  const imagePositions: { [key: string]: string } = {
    "Tanja": "object-[50%_30%]", // Adjust to center face
    "Elodie": "object-[50%_30%]", // Adjust to center face
    "Camille": "object-[50%_35%]", // Slight adjustment to center face
    "Daniela": "object-[50%_30%]", // Adjust to center face
  }

  return (
    <section id="temoignages" ref={sectionRef} className="relative py-24 overflow-hidden bg-[#0A291C]">
      <div className="container mx-auto px-4 relative z-10">
        <h2
          className={`font-alta text-4xl sm:text-5xl md:text-6xl text-[#D4AF37] text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          ELLES TÉMOIGNENT DE LEUR EXPÉRIENCE
        </h2>

        {/* Desktop layout - Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white rounded-3xl overflow-hidden transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex flex-col md:flex-row items-start">
                <div className="relative w-full md:w-28 h-28 md:h-28 overflow-hidden">
                  <div className="absolute inset-0 bg-[#0A291C] rounded-full md:rounded-none md:rounded-l-3xl overflow-hidden flex items-center justify-center">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={112}
                      height={112}
                      className={`object-cover rounded-full w-24 h-24 ${imagePositions[testimonial.name] || "object-center"}`}
                      sizes="112px"
                      priority={index < 2}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 text-center md:hidden pb-1">
                    <p className="text-[#D4AF37] font-medium">{testimonial.name}</p>
                  </div>
                </div>
                <div className="p-4 md:p-6 flex-1">
                  <div className="flex items-center mb-2 justify-between">
                    <p className="text-[#0A291C] font-medium hidden md:block">{testimonial.name}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#0A291C]/80 text-sm leading-relaxed">{testimonial.testimonial}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile layout - Carousel */}
        <div className="md:hidden">
          <div className="relative max-w-lg mx-auto" style={{ minHeight: "400px" }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl overflow-hidden transition-opacity duration-500 ${
                  activeIndex === index ? "opacity-100 z-10 relative" : "opacity-0 z-0 absolute inset-0"
                }`}
              >
                <div className="flex flex-col items-center text-center p-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#0A291C] mb-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className={`object-cover ${imagePositions[testimonial.name] || "object-center"}`}
                      sizes="96px"
                      priority={index === 0}
                    />
                  </div>
                  <p className="text-[#D4AF37] font-medium mb-2">{testimonial.name}</p>
                  <div className="flex items-center justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <p className="text-[#0A291C]/80 text-sm leading-relaxed">{testimonial.testimonial}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel navigation */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button 
              onClick={() => setActiveIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A291C] text-[#D4AF37] hover:bg-[#0A291C]/80 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index ? "bg-[#D4AF37] w-6" : "bg-[#0A291C]/20"
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={() => setActiveIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A291C] text-[#D4AF37] hover:bg-[#0A291C]/80 transition-colors"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
