export function ObjectiveSection() {
  const brainTypes = [
    {
      title: "Cerveau tête",
      icon: "/icons/brain-stress.png",
      alt: "Cerveau tête",
    },
    {
      title: "Cerveau coeur",
      icon: "/icons/heart-brain.png",
      alt: "Cerveau coeur",
    },
    {
      title: "Cerveau intestin",
      icon: "/icons/brain-gut.png",
      alt: "Cerveau intestin",
    },
  ]

  return (
    <section id="objectif" className="bg-[#0A291C] py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto rounded-3xl bg-[#0A291C]/90 p-12 shadow-lg">
          <h2 className="font-alta text-5xl md:text-6xl text-[#D4AF37] text-center mb-12">OBJECTIF</h2>

          <div className="bg-[#F0D080] py-6 px-8 rounded-lg mb-16">
            <p className="text-[#0A291C] text-xl text-center font-medium">
              Avec la méthode R.I.S.E. renforcez votre résilience, affinez votre intuition et optimisez votre énergie au
              travers des 3 cerveaux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {brainTypes.map((brain, index) => (
              <div key={index} className="flex flex-col items-center text-center relative">
                {/* Vertical divider lines between items */}
                {index < 2 && <div className="hidden md:block absolute right-0 top-1/4 bottom-1/4 w-px bg-white"></div>}

                {/* Circular icon container with hover effect */}
                <div className="mb-8 group">
                  <div className="w-48 h-48 rounded-full border-2 border-white flex items-center justify-center p-4 transition-all duration-300 group-hover:border-[#c29c3d] group-hover:shadow-[0_0_20px_rgba(194,156,61,0.3)]">
                    <div className="relative w-32 h-32">
                      {/* Default icon (white) */}
                      <img
                        src={brain.icon || "/placeholder.svg"}
                        alt={brain.alt}
                        className="absolute inset-0 w-full h-full object-contain invert opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                      />
                      {/* Hover icon (gold) */}
                      <img
                        src={brain.icon || "/placeholder.svg"}
                        alt={brain.alt}
                        className="absolute inset-0 w-full h-full object-contain gold-filter opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="font-alta text-white text-2xl group-hover:text-[#c29c3d] transition-colors duration-300">
                  {brain.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

