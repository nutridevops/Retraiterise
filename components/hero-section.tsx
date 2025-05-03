export function HeroSection() {
  return (
    <section
      id="accueil"
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage:
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/yoga%20img-MvJgKKOJmoaEwFke9Yc33tfSl91OPy.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[#0A291C]/80"></div>
      <div className="container mx-auto px-4 text-center relative z-10 py-20">
        <h1
          className="font-alta text-7xl sm:text-9xl md:text-[10rem] text-white tracking-widest mb-8"
          style={{ letterSpacing: "0.5em" }}
        >
          RISE
        </h1>

        <div className="mt-10 max-w-3xl mx-auto">
          <p className="text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-wide leading-relaxed">
            UNE <span className="font-bold">RETRAITE DE 2 JOURS</span> POUR EXCELLER DANS VOTRE CARRIÈRE{" "}
            <span className="font-bold">SANS SACRIFIER VOTRE BIEN-ÊTRE PERSONNEL</span>
          </p>
          <p className="text-lg sm:text-xl text-[#D4AF37] mt-4 italic">
            Mise à jour: Mai 2025 - Nouvelles dates confirmées
          </p>
        </div>

        <div className="mt-16 text-3xl sm:text-4xl text-white font-light font-alta">LES 24 & 25 MAI 2025</div>

        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfM_TnGhjP_-dgKSrkyFTgULULbTeF08F0THHSQbCqrntC1oQ/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-16 inline-block bg-transparent border border-[#D4AF37] text-[#D4AF37] px-10 py-4 text-xl tracking-wide hover:bg-[#D4AF37]/10 transition-all duration-300"
        >
          JE RÉSERVE MA PLACE
        </a>
      </div>
    </section>
  )
}
