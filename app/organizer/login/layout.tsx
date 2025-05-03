import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "Connexion Organisateur | Rise & Retreat",
  description: "Connectez-vous à votre espace organisateur Rise & Retreat",
}

export default function OrganizerLoginLayout({
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
