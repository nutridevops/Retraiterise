import Image from "next/image"
import { Instagram } from "lucide-react"

export function TeamSection() {
  const team = [
    {
      number: 1,
      name: "LAETITIA LUSAKIVANA",
      role: "Experte en neuroperformance & neurosciences appliquées",
      description:
        "Fondatrice de la méthode SWING et experte en neuroperformance et neurosciences appliquées, Laetitia vous guidera dans un voyage intérieur pour mieux comprendre et exploiter les capacités extraordinaires de votre cerveau-tête.",
      image: "/images/team-letitia.png",
      instagram: "@laetitia.neuroperformance",
      instagramUrl: "https://www.instagram.com/laetitia.neuroperformance/"
    },
    {
      number: 2,
      name: "SANDRA LEGUEDE",
      role: "Coach en neurofitness & bien-être",
      description:
        "Spécialiste du neurofitness et du bien-être, Sandra vous accompagnera dans des exercices physiques et mentaux conçus pour renforcer la connexion entre votre corps et votre esprit, optimisant ainsi votre résilience et votre énergie.",
      image: "/images/team-sandra.png",
      instagram: "@sandrafitabla",
      instagramUrl: "https://www.instagram.com/sandrafitabla/"
    },
    {
      number: 3,
      name: "CHRIS MASSAMBA",
      role: "Expert en neuro-nutrition",
      description:
        "Nutritionniste spécialisé dans l'approche neuro-nutritionnelle, Chris vous enseignera comment nourrir votre cerveau intestinal pour améliorer votre intuition, votre clarté mentale et votre bien-être général.",
      image: "/images/team-chris.png",
      instagram: "@epinutri",
      instagramUrl: "https://www.instagram.com/epinutri/"
    },
  ]

  return (
    <section id="equipe" className="bg-[#0A291C] py-24 relative">
      <div className="container mx-auto px-4">
        <h2 className="font-alta text-4xl sm:text-5xl md:text-6xl text-[#D4AF37] text-center mb-16">L&apos;ÉQUIPE</h2>

        <p className="text-white text-center max-w-3xl mx-auto mb-16 font-light">
          Nous avons réuni une équipe d&apos;experts passionnés et complémentaires, chacun dédié à équilibrer les trois
          cerveaux qui vous gouvernent : votre tête, votre cœur et votre intestin.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <div key={index} className="group">
              <div className="relative mb-6 overflow-hidden rounded-full">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={400}
                  height={400}
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-0 left-0 w-10 h-10 bg-[#D4AF37] flex items-center justify-center text-[#0A291C] text-xl font-light">
                  {member.number}
                </div>
              </div>

              <h3 className="font-alta text-lg text-[#D4AF37] mb-1">{member.name}</h3>
              <p className="text-white/70 text-sm mb-4">{member.role}</p>
              <p className="text-[#F5F5DC]/70 text-sm font-light">{member.description}</p>
              
              <a 
                href={member.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 inline-flex items-center text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors duration-300"
              >
                <Instagram size={16} className="mr-2" />
                <span className="text-sm">{member.instagram}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
