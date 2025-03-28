"use client"

export function ReservationSection() {
  return (
    <section id="reservation" className="bg-[#0A291C] py-24 relative">
      <div className="container mx-auto px-4">
        <h2 className="font-alta text-4xl sm:text-5xl md:text-6xl text-[#D4AF37] text-center mb-16">RÉSERVATION</h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h3 className="font-alta text-2xl text-[#D4AF37] mb-8">DÉTAILS DE LA RETRAITE</h3>
            <div className="space-y-6 text-white">
              <div className="flex justify-between border-b border-[#D4AF37]/10 pb-3">
                <span className="font-light">Dates:</span>
                <span>24 & 25 Mai 2025</span>
              </div>
              <div className="flex justify-between border-b border-[#D4AF37]/10 pb-3">
                <span className="font-light">Lieu:</span>
                <span>Domaine de Luxe, près de Bruxelles</span>
              </div>
              <div className="flex justify-between border-b border-[#D4AF37]/10 pb-3">
                <span className="font-light">Tarif:</span>
                <span>769€ par personne</span>
              </div>
              <div className="flex justify-between border-b border-[#D4AF37]/10 pb-3">
                <span className="font-light">Inclus:</span>
                <span>Ateliers, repas, matériel</span>
              </div>
              <div className="flex justify-between border-b border-[#D4AF37]/10 pb-3">
                <span className="font-light">Places:</span>
                <span>Limitées à 15 participants</span>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-[#F5F5DC]/70 text-sm font-light">
                <span className="text-[#D4AF37]">Note:</span> Un acompte de 30% est requis pour confirmer votre
                réservation. Le solde devra être réglé au plus tard 30 jours avant le début de la retraite.
              </p>
            </div>

            <div className="mt-12 text-center">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfM_TnGhjP_-dgKSrkyFTgULULbTeF08F0THHSQbCqrntC1oQ/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-transparent border border-[#D4AF37] text-[#D4AF37] px-8 py-4 text-lg tracking-wide hover:bg-[#D4AF37]/10 transition-all duration-300"
              >
                REMPLIR LE FORMULAIRE DE RÉSERVATION
              </a>
            </div>
          </div>

          <div className="bg-[#0A291C]/50 p-8 rounded-lg">
            <h3 className="font-alta text-2xl text-[#D4AF37] mb-8 text-center">POURQUOI RÉSERVER MAINTENANT ?</h3>

            <div className="space-y-6 text-white">
              <div className="flex items-start">
                <div className="text-[#D4AF37] text-2xl mr-4">•</div>
                <p>Places limitées à 15 participants pour garantir une expérience personnalisée</p>
              </div>

              <div className="flex items-start">
                <div className="text-[#D4AF37] text-2xl mr-4">•</div>
                <p>Tarif préférentiel de 769€ au lieu de 985€ pour les inscriptions anticipées</p>
              </div>

              <div className="flex items-start">
                <div className="text-[#D4AF37] text-2xl mr-4">•</div>
                <p>Bonus exclusif : guide post-retraite avec exercices et ressources</p>
              </div>

              <div className="flex items-start">
                <div className="text-[#D4AF37] text-2xl mr-4">•</div>
                <p>Possibilité de paiement en plusieurs fois pour faciliter votre inscription</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfM_TnGhjP_-dgKSrkyFTgULULbTeF08F0THHSQbCqrntC1oQ/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#D4AF37] text-[#0A291C] font-bold px-8 py-4 rounded-full text-lg tracking-wide hover:bg-[#d4af37] transition-all duration-300"
              >
                JE RÉSERVE MAINTENANT
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
