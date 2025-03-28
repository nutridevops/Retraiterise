"use client"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#accueil", label: "Accueil" },
    { href: "#methode", label: "La Méthode" },
    { href: "#benefices", label: "Bénéfices" },
    { href: "#programme", label: "Programme" },
    { href: "#activites", label: "Activités" },
    { href: "#equipe", label: "L'Équipe" },
    { href: "#reservation", label: "Réservation" },
    { href: "#contact", label: "Contact" },
  ]

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0A291C]/80 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 flex items-center justify-center">
              <Image src="/images/rise-logo-new.png" alt="RISE Logo" width={64} height={64} className="w-full h-auto" />
            </div>
            <span className="font-alta text-[#D4AF37] text-3xl tracking-widest">RISE</span>
          </div>
        </div>

        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors text-base uppercase tracking-wider"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-[#D4AF37]">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#0A291C] border-none">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-16 h-16 flex items-center justify-center">
                <Image
                  src="/images/rise-logo-new.png"
                  alt="RISE Logo"
                  width={64}
                  height={64}
                  className="w-full h-auto"
                />
              </div>
              <span className="font-alta text-[#D4AF37] text-3xl tracking-widest">RISE</span>
            </div>
            <nav className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors text-lg uppercase tracking-wider"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
