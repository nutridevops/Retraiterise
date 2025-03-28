"use client"

import { Star } from "lucide-react"
import Image from "next/image"

export function SecretLocationSection() {
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

          {/* Decorative line */}
          <div className="w-32 h-1 bg-[#c29c3d] mx-auto mt-12"></div>
        </div>
      </div>
    </section>
  )
}
