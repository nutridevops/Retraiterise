import Image from "next/image"

export function BalanceSection() {
  return (
    <section className="relative">
      {/* Top section with beige background and title */}
      <div className="bg-[#f5f2ea] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left side - Title */}
              <div>
                <h2 className="font-alta text-4xl sm:text-5xl md:text-6xl text-[#c29c3d] leading-tight">
                  R.I.S.E LA CLÉ D&apos;UN ÉQUILIBRE DURABLE
                </h2>
              </div>

              {/* Right side - Text */}
              <div>
                <p className="text-[#0A291C] text-xl font-medium mb-4">
                  Après ces 2 jours, vous ne serez plus la même personne.
                </p>
                <p className="text-[#0A291C] mb-4">
                  Vous repartirez avec une <span className="font-bold">clarté mentale, une énergie</span> et une{" "}
                  <span className="font-bold">sérénité</span> qui changeront votre façon d&apos;affronter les défis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Images section - Full width with no gaps and gradient overlays */}
      <div className="bg-[#0A291C] w-full">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row">
          {/* Image 1 */}
          <div className="w-full md:w-1/3 h-64 md:h-80 relative group overflow-hidden">
            <Image
              src="/images/retreat-healthy-meal.jpeg"
              alt="Groupe partageant un repas sain"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A291C]/70 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-40"></div>

            {/* Optional text overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
              <p className="text-sm font-light">Nourrissez votre corps et votre esprit</p>
            </div>
          </div>

          {/* Image 2 */}
          <div className="w-full md:w-1/3 h-64 md:h-80 relative group overflow-hidden">
            <Image
              src="/images/retreat-relaxation.jpeg"
              alt="Séance de relaxation"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A291C]/70 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-40"></div>

            {/* Optional text overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
              <p className="text-sm font-light">Reconnectez-vous à votre essence</p>
            </div>
          </div>

          {/* Image 3 */}
          <div className="w-full md:w-1/3 h-64 md:h-80 relative group overflow-hidden">
            <Image
              src="/images/retreat-group-discussion.jpeg"
              alt="Discussion de groupe"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A291C]/70 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-40"></div>

            {/* Optional text overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
              <p className="text-sm font-light">Partagez et grandissez ensemble</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section with leaf background and bullet points */}
      <div className="relative py-16 bg-[#0A291C]">
        {/* Leaf texture background */}
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/leaf-texture-bg.jpeg" alt="Texture de feuilles" fill className="object-cover" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto space-y-8">
            <ul className="space-y-6 text-white">
              <li className="flex items-start">
                <span className="text-[#c29c3d] text-2xl mr-4">•</span>
                <p className="text-lg">
                  Ce n&apos;est pas une dépense,{" "}
                  <span className="font-bold">
                    c&apos;est un investissement sur votre performance et votre sérénité durable.
                  </span>
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-[#c29c3d] text-2xl mr-4">•</span>
                <p className="text-lg">
                  En appliquant cette méthode,{" "}
                  <span className="font-bold">vous gagnerez en clarté mentale et en productivité</span>, ce qui vous
                  permettra de <span className="font-bold">mieux gérer votre carrière et votre vie personnelle.</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

