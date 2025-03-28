"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function CallToActionSection() {
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

  const benefits = [
    "2 jours et 1 nuit dans un lieu prestigieux",
    "Séances personnalisées avec Laetitia",
    "Séances personnalisées avec Sandra",
    "Séances personnalisées avec Chris",
    "Repas nutritionnels conçus par un expert",
    "Accès exclusif à des techniques avancées de biohaking",
  ]

  return (
    <section id="offre-speciale" ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Left side - Invest in yourself */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-[500px] lg:h-auto overflow-hidden bg-[#0A291C]">
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 p-8">
            <div className="w-32 h-32 flex items-center justify-center mb-8">
              <Image
                src="/images/rise-logo-new.png"
                alt="RISE Logo"
                width={120}
                height={120}
                className="w-full h-auto"
              />
            </div>
            <h2 className="font-alta text-5xl md:text-7xl text-white mb-6">INVESTISSEZ</h2>
            <h2 className="font-alta text-5xl md:text-7xl text-white mb-12">EN VOUS</h2>
            <div className="mt-8">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfM_TnGhjP_-dgKSrkyFTgULULbTeF08F0THHSQbCqrntC1oQ/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#c29c3d] text-[#0A291C] font-bold px-8 py-4 rounded-full text-lg tracking-wide hover:bg-[#d4af37] transition-all duration-300"
              >
                JE RÉSERVE MAINTENANT
              </a>
            </div>
          </div>
        </div>

        {/* Right side - What you get */}
        <div className="bg-[#f5f2ea] p-8 lg:p-16 relative">
          <div className="max-w-xl mx-auto">
            <h2 className="font-alta text-4xl md:text-5xl text-[#c29c3d] mb-10 text-center lg:text-left">
              CE QUE VOUS OBTENEZ POUR 769 €
            </h2>

            <div className="space-y-6 mb-12">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`flex items-center transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <ArrowRight className="h-6 w-6 text-[#c29c3d] mr-4 flex-shrink-0" />
                  <p className="text-[#0A291C] text-lg">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#c29c3d]/20 p-6 rounded-lg mb-8">
              <div className="flex items-center mb-2">
                <div className="bg-[#c29c3d] text-white px-4 py-1 rounded-full text-sm font-bold mr-4">BONUS</div>
                <p className="text-[#0A291C] font-medium">Un guide post-retraite avec exercices et ressources</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mt-12">
              <div className="mb-6 md:mb-0">
                <p className="text-[#0A291C]/60 text-lg line-through mb-1">VALEUR RÉELLE 985 €</p>
                <p className="text-[#c29c3d] font-alta text-4xl">769 €</p>
                <p className="text-[#0A291C]/70 text-sm">Possibilité de payer en 2 ou 3 fois</p>
              </div>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfM_TnGhjP_-dgKSrkyFTgULULbTeF08F0THHSQbCqrntC1oQ/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#0A291C] text-white px-8 py-4 rounded-full text-lg tracking-wide hover:bg-[#0A291C]/80 transition-all duration-300 w-full md:w-auto text-center"
              >
                JE RÉSERVE MA PLACE
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Image gallery */}
      <div className="grid grid-cols-2 md:grid-cols-4 h-80 md:h-96">
        <div className="relative overflow-hidden">
          <Image
            src="/images/cta/woman-tree-nature.jpeg"
            alt="Femme pratiquant le yoga dans la nature"
            fill
            className="object-cover object-center hover:scale-110 transition-transform duration-700"
          />
        </div>
        <div className="relative overflow-hidden">
          <Image
            src="/images/cta/woman-nature.png"
            alt="Femme dans la nature"
            fill
            className="object-cover object-center hover:scale-110 transition-transform duration-700"
          />
        </div>
        <div className="relative overflow-hidden">
          <Image
            src="/images/cta/yoga-park.png"
            alt="Yoga dans le parc"
            fill
            className="object-cover object-center hover:scale-110 transition-transform duration-700"
          />
        </div>
        <div className="relative overflow-hidden">
          <Image
            src="/images/cta/woman-child-headphones.jpeg"
            alt="Connexion et bien-être familial"
            fill
            className="object-cover object-center hover:scale-110 transition-transform duration-700"
          />
        </div>
      </div>

      {/* Special offer banner */}
      <div className="bg-[#0A291C] text-white py-8 text-center">
        <p className="text-xl md:text-2xl font-light">
          Réservez avant le 31 mars et bénéficiez d&apos;un bonus exclusif !
        </p>
      </div>
    </section>
  )
}
