import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ConceptSection } from "@/components/concept-section"
import { MethodSection } from "@/components/method-section"
import { ObjectiveSection } from "@/components/objective-section"
import { BenefitsSection } from "@/components/benefits-section"
import { ProgramSection } from "@/components/program-section"
import { ActivitiesSection } from "@/components/activities-section"
import { TeamSection } from "@/components/team-section"
import { BalanceSection } from "@/components/balance-section"
import { SocialProofSection } from "@/components/social-proof-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { SecretLocationSection } from "@/components/secret-location-section"
import { CallToActionSection } from "@/components/call-to-action-section"
import { ReservationSection } from "@/components/reservation-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <ConceptSection />
      <MethodSection />
      <ObjectiveSection />
      <BenefitsSection />
      <ProgramSection />
      <ActivitiesSection />
      <TeamSection />
      <BalanceSection />
      <SocialProofSection />
      <TestimonialsSection />
      <SecretLocationSection />
      <CallToActionSection />
      <ReservationSection />
      <Footer />
    </main>
  )
}

