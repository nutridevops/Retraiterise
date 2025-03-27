import Image from "next/image"

export function ActivitiesSection() {
  const activities = [
    {
      title: "NEUROFITNESS",
      description:
        "Des exercices physiques et mentaux conçus pour renforcer la connexion corps-esprit, optimisant votre résilience et votre énergie au quotidien.",
      image: "/images/neuro-fitness-gold.png",
      alt: "Illustration dorée de neurofitness montrant la connexion corps-esprit",
    },
    {
      title: "NEUROPERFORMANCE",
      description:
        "Découvrez comment exploiter les capacités extraordinaires de votre cerveau pour améliorer votre concentration, votre prise de décision et votre créativité.",
      image: "/images/neuro-performance-gold.png",
      alt: "Illustration dorée de neuroperformance montrant l'activité cérébrale",
    },
    {
      title: "NEURO NUTRITION",
      description:
        "Apprenez à nourrir votre cerveau intestinal pour améliorer votre intuition, votre clarté mentale et votre bien-être général.",
      image: "/images/neuro-nutrition-gold.png",
      alt: "Illustration dorée de neuro nutrition montrant la connexion cerveau-intestin",
      isFullBody: true, // Flag to identify the full body illustration
    },
  ]

  return (
    <section id="activites" className="bg-[#0A291C] py-24 relative">
      <div className="container mx-auto px-4">
        <h2 className="font-alta text-4xl sm:text-5xl md:text-6xl text-[#c29c3d] text-center mb-16">ACTIVITÉS</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {activities.map((activity, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="border border-[#c29c3d] rounded-lg p-8 bg-[#0A291C] h-full w-full flex flex-col items-center group">
                <div className="w-full aspect-square flex items-center justify-center mb-6 overflow-hidden">
                  <Image
                    src={activity.image || "/placeholder.svg"}
                    alt={activity.alt}
                    width={350}
                    height={350}
                    className={`object-contain transition-transform duration-500 ease-in-out group-hover:scale-110 ${
                      activity.isFullBody
                        ? "max-h-[320px] w-auto" // Adjusted size for the full body illustration
                        : "max-h-[350px] w-[350px]"
                    }`}
                  />
                </div>

                <h3 className="font-alta text-xl text-[#c29c3d] tracking-wide text-center mt-2 mb-3 transition-colors duration-300 group-hover:text-white">
                  {activity.title}
                </h3>

                <p className="text-white/80 text-center text-sm font-light">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

