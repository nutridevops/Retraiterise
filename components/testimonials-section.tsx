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
      name: "Mélissa M.",
      role: "Business Analyst",
      image: "/images/testimonials/melissa-m.png",
      testimonial:
        "La méthode R.I.S.E. m'a permis de découvrir comment mon corps et mon cerveau fonctionnent ensemble. J'ai appris à gérer mon stress professionnel tout en restant centrée et productive. Les techniques de respiration et de pleine conscience ont transformé ma façon d'aborder les défis quotidiens.",
    },
    {
      name: "Gracia M.",
      role: "Marketing & Business Developper",
      image: "/images/testimonials/gracia-m.png",
      testimonial:
        "En tant que multipotentielle, j'avais du mal à canaliser mon énergie et mes idées. La retraite m'a offert des outils concrets pour équilibrer mes trois cerveaux. J'ai développé une intuition plus fine pour mes décisions professionnelles et une meilleure gestion de mon énergie créative.",
    },
    {
      name: "Steven S.",
      role: "Marketing & Business Developper",
      image: "/images/testimonials/steven-s.png",
      testimonial:
        "Avant la retraite, je vivais dans un état constant de surmenage mental. L'approche holistique de R.I.S.E. m'a appris à reconnaître les signaux de mon corps et à cultiver ma résilience. Aujourd'hui, je prends des décisions plus alignées et je ressens une véritable harmonie entre ma vie professionnelle et personnelle.",
    },
    {
      name: "Gisele V.",
      role: "Business Analyst",
      image: "/images/testimonials/gisele-v.png",
      testimonial:
        "Les exercices de connexion corps-esprit m'ont révélé l'importance de l'intelligence intestinale dans mes prises de décision. J'ai découvert comment mon alimentation influençait ma clarté mentale. Grâce à cette retraite, j'ai développé une confiance profonde en mon intuition qui guide maintenant mes analyses professionnelles.",
    },
    {
      name: "Jeremy D.",
      role: "Marketing & Business Developper",
      image: "/images/testimonials/jeremy-d.png",
      testimonial:
        "La méthode R.I.S.E. a transformé ma relation au stress et à la performance. J'ai appris à puiser dans mes ressources intérieures pour maintenir mon énergie tout au long de la journée. Les techniques d'ancrage émotionnel m'ont permis de rester centré même dans les situations professionnelles les plus exigeantes.",
    },
    {
      name: "Natacha N.",
      role: "Marketing & Business Developper",
      image: "/images/testimonials/natacha-n.png",
      testimonial:
        "Cette retraite a été une révélation sur la connexion entre mon cerveau cardiaque et mes décisions professionnelles. J'ai découvert comment l'équilibre de mes trois cerveaux pouvait influencer positivement ma créativité et ma capacité à diriger. Aujourd'hui, je ressens une cohérence profonde entre mes valeurs et mes actions.",
    },
  ]

  // Custom image positioning for each testimonial to ensure perfect centering
  const imagePositions = {
    "Mélissa M.": "object-[50%_30%]", // Adjust to center face
    "Gracia M.": "object-[50%_35%]", // Slight adjustment to center face
    "Steven S.": "object-[50%_25%]", // Move up slightly to center face
    "Gisele V.": "object-[50%_30%]", // Adjust to center face
    "Jeremy D.": "object-[50%_30%]", // Adjust to center face
    "Natacha N.": "object-[50%_30%]", // Adjust to center face
  }

  return (
    <section id="temoignages" ref={sectionRef} className="relative py-24 overflow-hidden bg-[#f5f5f0]">
      <div className="container mx-auto px-4 relative z-10">
        <h2
          className={`font-alta text-4xl sm:text-5xl md:text-6xl text-[#c29c3d] text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          ILS TÉMOIGNENT DE LEUR EXPÉRIENCE
        </h2>

        {/* Desktop layout - Grid */}
        <div className="hidden xl:grid grid-cols-2 gap-x-16 gap-y-12 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`flex items-start gap-6 transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex-shrink-0">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[#0A291C]">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className={`object-cover ${imagePositions[testimonial.name] || "object-center"}`}
                    sizes="112px"
                    priority={index < 2}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#c29c3d] text-[#c29c3d]" />
                  ))}
                </div>
                <h3 className="text-[#0A291C] font-medium text-lg">{testimonial.role}</h3>
                <p className="text-[#0A291C]/80 text-sm mt-3 leading-relaxed">{testimonial.testimonial}</p>
                <p className="text-[#c29c3d] font-alta text-lg mt-3">{testimonial.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile and Tablet layout - Carousel */}
        <div className="xl:hidden">
          <div className="relative max-w-lg mx-auto" style={{ minHeight: "500px" }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`flex flex-col items-center text-center transition-opacity duration-500 ${
                  activeIndex === index ? "opacity-100 z-10 relative" : "opacity-0 z-0 absolute inset-0"
                }`}
              >
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-[#0A291C] mb-4 sm:mb-6">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className={`object-cover ${imagePositions[testimonial.name] || "object-center"}`}
                    sizes="(max-width: 640px) 96px, 128px"
                    priority={index === 0}
                  />
                </div>
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-[#c29c3d] text-[#c29c3d]" />
                  ))}
                </div>
                <h3 className="text-[#0A291C] font-medium text-base sm:text-lg">{testimonial.role}</h3>
                <p className="text-[#0A291C]/80 text-sm mt-3 sm:mt-4 leading-relaxed px-4 sm:px-8">{testimonial.testimonial}</p>
                <p className="text-[#c29c3d] font-alta text-base sm:text-lg mt-3 sm:mt-4">{testimonial.name}</p>
              </div>
            ))}
          </div>

          {/* Carousel navigation buttons for better tablet experience */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button 
              onClick={() => setActiveIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0A291C] text-[#D4AF37] hover:bg-[#0A291C]/80 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index ? "bg-[#c29c3d] w-6" : "bg-[#0A291C]/20"
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={() => setActiveIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0A291C] text-[#D4AF37] hover:bg-[#0A291C]/80 transition-colors"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
