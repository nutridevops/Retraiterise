import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "Tableau de Bord Organisateur | Rise & Retreat",
  description: "Gérez vos clients, événements et ressources dans votre espace organisateur Rise & Retreat",
}

export default function OrganizerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
