export function ProgramSection() {
  const day1Schedule = [
    { time: "8h45", activity: "Accueil et installation" },
    { time: "9h00", activity: "Introduction à la méthode R.I.S.E." },
    { time: "10h30", activity: "Pause" },
    { time: "10h45", activity: "Atelier Résilience" },
    { time: "12h30", activity: "Déjeuner" },
    { time: "14h00", activity: "Atelier Intuition" },
    { time: "16h00", activity: "Pause" },
    { time: "16h15", activity: "Méditation guidée" },
    { time: "17h30", activity: "Fin de la journée" },
  ]

  const day2Schedule = [
    { time: "8h30", activity: "Accueil" },
    { time: "9h00", activity: "Atelier Strength" },
    { time: "10h30", activity: "Pause" },
    { time: "10h45", activity: "Atelier Energy" },
    { time: "12h30", activity: "Déjeuner" },
    { time: "14h00", activity: "Intégration des pratiques" },
    { time: "16h00", activity: "Pause" },
    { time: "16h15", activity: "Session de clôture" },
    { time: "17h30", activity: "Fin de la retraite" },
  ]

  return (
    <section id="programme" className="bg-[#0A291C] py-24 relative">
      <div className="container mx-auto px-4">
        <h2 className="font-alta text-4xl sm:text-5xl md:text-6xl text-[#D4AF37] text-center mb-16">PROGRAMME</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Day 1 */}
          <div className="space-y-8">
            <h3 className="font-alta text-2xl text-[#D4AF37] mb-6 text-center">JOUR 1 – ACCUEIL / PRÉSENTATION</h3>

            <div className="space-y-4">
              {day1Schedule.map((item, index) => (
                <div key={index} className="flex items-start border-b border-[#D4AF37]/10 pb-3">
                  <p className="text-white font-light">
                    <span className="text-[#D4AF37] font-normal mr-4">{item.time}</span>
                    {item.activity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Day 2 */}
          <div className="space-y-8">
            <h3 className="font-alta text-2xl text-[#D4AF37] mb-6 text-center">JOUR 2 – ÉNERGIE ET TRANSFORMATION</h3>

            <div className="space-y-4">
              {day2Schedule.map((item, index) => (
                <div key={index} className="flex items-start border-b border-[#D4AF37]/10 pb-3">
                  <p className="text-white font-light">
                    <span className="text-[#D4AF37] font-normal mr-4">{item.time}</span>
                    {item.activity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

