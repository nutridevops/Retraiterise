export function ConceptSection() {
  return (
    <section
      id="lieu"
      className="relative py-0 min-h-screen flex items-center"
      style={{
        backgroundImage:
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-sauIB5sEfahaF3murpl2tCYobyaxK4.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A291C]/90"></div>

      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 relative z-10">
        <div className="md:col-span-1"></div> {/* Empty column for spacing */}
        <div className="md:col-span-1 py-20 px-6 md:px-8 bg-[#0A291C]/80 backdrop-blur-sm">
          <div className="max-w-xl">
            <h2 className="font-alta text-3xl sm:text-4xl md:text-5xl text-[#D4AF37] mb-10 tracking-wide text-center md:text-left">
              UNE RETRAITE DE HAUT STANDING EN BELGIQUE DANS UN LIEU D&apos;EXCEPTION
            </h2>
            <p className="text-[#F5F5DC] text-lg leading-relaxed mb-8 font-light">
              A moins d&apos; 1 heure du centre de Bruxelles, plongez au cœur d&apos;une retraite exceptionnelle de deux jours, une expérience unique pour bénéficier
              d&apos;outils pour développer votre résilience, intuition, votre force, et votre énergie à travers
              l&apos;équilibre de vos trois cerveaux : tête, cœur et intestin.
            </p>
            <p className="text-[#F5F5DC] text-lg leading-relaxed font-light">
              Cette immersion de haut standing va bien au-delà de la simple détente : c&apos;est un moment pour
              reprogrammer votre mental, revitaliser votre corps, et optimiser votre bien-être. Vous repartirez aligné,
              énergisé, et prêt à performer à votre meilleur niveau, tout en restant en harmonie avec vous-même.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
