import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Cinzel } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

// Load Montserrat for body text
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

// Load Cinzel as a fallback for Alta
// This is a similar elegant serif font that can be used until Alta is installed
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
})

export const metadata: Metadata = {
  title: "R.I.S.E Retreat | Résilience · Intuition · Strength · Energy",
  description: "Une retraite de 2 jours pour exceller dans votre carrière sans sacrifier votre bien-être personnel",
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${montserrat.variable} ${cinzel.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'