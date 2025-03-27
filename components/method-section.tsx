export function MethodSection() {
  const methods = [
    {
      letter: "R",
      title: "Resiliance",
      description:
        "Apprenez à rebondir face aux défis et à maintenir votre calme et votre concentration, même dans les moments de forte pression.",
    },
    {
      letter: "I",
      title: "Intuition",
      description:
        "Développez votre faculté à prendre des décisions éclairées et rapides en écoutant les signaux de l'intestin et en développant une meilleure connexion avec vos instincts.",
    },
    {
      letter: "S",
      title: "Strength",
      description:
        "Renforcez votre force mentale et physique, pour mieux gérer le stress et maintenir une endurance optimale dans la performance.",
    },
    {
      letter: "E",
      title: "Energy",
      description:
        "Apprenez à optimiser votre énergie mentale et physique en alignant le cerveau, le cœur et l'intestin, permettant de rester performant et équilibré tout au long de la journée.",
    },
  ]

  return (
    <section id="methode" className="bg-[#0A291C] py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-alta text-4xl sm:text-5xl md:text-6xl text-[#D4AF37] mb-6">LA MÉTHODE R.I.S.E</h2>
          <p className="text-[#D4AF37] text-xl max-w-2xl mx-auto">
            Renforcer votre résilience, affiner votre intuition et optimiser votre énergie
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-16">
            {methods.map((method, index) => (
              <div key={index} className="flex items-start">
                <div className="w-16 h-16 mr-6 flex justify-center items-center">
                  <span className="font-alta text-[#D4AF37] text-5xl">{method.letter}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-alta text-white text-xl mb-3">{method.title}</h3>
                  <p className="text-[#F5F5DC]/80 font-light">{method.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.png-HtbFwDoO1WlLZ96aMTUVNsUxHdPUEu.jpeg"
              alt="Femme en méditation"
              className="rounded-none max-h-[600px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

