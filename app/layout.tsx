import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Cinzel } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth"
import ClientOnly from "@/components/ClientOnly"

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
  generator: 'v0.dev',
  icons: [
    { rel: 'icon', url: '/favicon/favicon_io/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    { rel: 'icon', url: '/favicon/favicon_io/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    { rel: 'icon', url: '/favicon/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { rel: 'icon', url: '/favicon/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    { rel: 'apple-touch-icon', url: '/favicon/favicon_io/apple-touch-icon.png' },
    { rel: 'shortcut icon', url: '/favicon/favicon_io/favicon.ico' }
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Prioritize larger favicon sizes */}
        <link rel="icon" href="/favicon/favicon_io/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon/favicon_io/android-chrome-192x192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/favicon/favicon_io/android-chrome-512x512.png" type="image/png" sizes="512x512" />
        <link rel="icon" href="/favicon/favicon_io/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon/favicon_io/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon/favicon_io/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/favicon_io/site.webmanifest" />
      </head>
      <body className={`${montserrat.variable} ${cinzel.variable}`} suppressHydrationWarning>
        <ClientOnly>
          <AuthProvider>
            <ThemeProvider 
              attribute="class" 
              enableSystem={true} 
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </AuthProvider>
        </ClientOnly>
      </body>
    </html>
  )
}