"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export function BenefitsSection() {
  // Refs for scroll animation
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  // Parallax effect for background
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      // Animate cards on scroll
      if (sectionRef.current) {
        const sectionTop = sectionRef.current.getBoundingClientRect().top
        const windowHeight = window.innerHeight

        // When section is in view
        if (sectionTop < windowHeight * 0.75) {
          cardsRef.current.forEach((card, index) => {
            if (card) {
              // Staggered animation delay
              setTimeout(() => {
                card.classList.add("card-visible")
              }, 150 * index)
            }
          })
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const benefits = [
    {
      title: "AUGMENTEZ VOTRE RÉSILIENCE FACE AUX DÉFIS",
      items: [
        "Une capacité accrue à gérer les situations de haute pression.",
        "Une méthode pour rester concentré sur vos objectifs sans vous épuiser mentalement.",
      ],
      icon: "/images/fistUp.png",
      alt: "Résilience",
    },
    {
      title: "DÉVELOPPEZ VOTRE INTUITION POUR DES DÉCISIONS PLUS RAPIDES ET PLUS JUSTES",
      items: [
        "Des outils concrets pour améliorer votre santé intestinale et renforcer votre intuition.",
        "Une plus grande clarté dans vos choix, tant personnels que professionnels.",
      ],
      icon: "/images/brain-network.png",
      alt: "Intuition",
    },
    {
      title: "RENFORCEZ VOTRE FORCE MENTALE ET PHYSIQUE",
      items: [
        "Des techniques pour développer votre force intérieure et votre endurance.",
        "Une approche pour transformer les défis en opportunités de croissance.",
      ],
      icon: "/images/brain-muscle.png",
      alt: "Force Mentale et Physique",
    },
    {
      title: "OPTIMISEZ VOTRE ÉNERGIE AU QUOTIDIEN",
      items: [
        "Des stratégies pour maintenir un niveau d'énergie optimal tout au long de la journée.",
        "Des méthodes pour recharger rapidement vos batteries lors des moments de fatigue.",
      ],
      icon: "/images/energy-person.png",
      alt: "Énergie Quotidienne",
    },
  ]

  return (
    <section id="benefices" className="relative min-h-screen py-24" ref={sectionRef}>
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <div
          className="absolute inset-0 w-full h-[120%]"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <Image
            src="/images/benefits-background-new.png"
            alt="Femme participant à une retraite"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-[#0A291C]/70 backdrop-blur-sm"></div>
      </div>

      {/* Content with proper z-index */}
      <div className="relative z-10">
        {/* Section Title with Scroll Animation */}
        <div
          className="container mx-auto px-4 py-16 text-center opacity-0 translate-y-10"
          style={{
            animation: "fadeInUp 0.8s ease forwards",
            animationDelay: "0.2s",
          }}
        >
          <h2 className="font-alta text-4xl sm:text-5xl md:text-6xl text-[#D4AF37] mb-8">BÉNÉFICES</h2>
          <p className="text-white text-xl font-light mb-6 max-w-3xl mx-auto">
            Transformez votre quotidien avec la méthode R.I.S.E.
          </p>
          <p className="text-white leading-relaxed mb-12 max-w-3xl mx-auto font-light">
            Que ce soit pour renforcer votre résilience, affiner votre intuition, ou optimiser votre énergie, chaque
            apprentissage vous aidera à{" "}
            <span className="font-normal">élever votre performance tout en préservant votre bien-être.</span>
          </p>
        </div>

        {/* Benefits Grid with Scroll Animation */}
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="bg-white p-8 rounded-lg shadow-lg relative opacity-0 translate-y-10 card-animation"
            >
              {/* Circular icon in top left corner with hover effect */}
              <div className="absolute -top-6 -left-6 group">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center p-2 shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(194,156,61,0.7)]">
                  <div className="relative w-full h-full">
                    {/* Default icon (black) */}
                    <img
                      src={benefit.icon || "/placeholder.svg"}
                      alt={benefit.alt}
                      className="absolute inset-0 w-full h-full object-contain brightness-0 group-hover:opacity-0 transition-opacity duration-300"
                    />
                    {/* Hover icon (gold) */}
                    <img
                      src={benefit.icon || "/placeholder.svg"}
                      alt={benefit.alt}
                      className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        filter: "invert(70%) sepia(38%) saturate(1151%) hue-rotate(5deg) brightness(89%) contrast(86%)",
                      }}
                    />
                  </div>
                </div>
              </div>

              <h3 className="font-alta text-2xl sm:text-3xl text-[#0A291C] mb-8">{benefit.title}</h3>

              <p className="font-normal text-lg mb-4 text-[#0A291C]/80">Vous repartirez avec :</p>
              <ul className="space-y-4 text-[#0A291C]/80">
                {benefit.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-[#D4AF37] mr-3 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

