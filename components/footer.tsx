import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-[#0A291C] py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and name on the left */}
          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <div className="w-14 h-14 flex items-center justify-center">
              <Image src="/images/rise-logo-new.png" alt="RISE Logo" width={56} height={56} className="w-full h-auto" />
            </div>
            <span className="font-alta text-[#D4AF37] text-3xl tracking-widest">RISE</span>
          </div>

          {/* Copyright and tagline in the center */}
          <div className="text-center mb-6 md:mb-0">
            <p className="text-[#F5F5DC]/80 text-lg font-light mb-1">
              &copy; {new Date().getFullYear()} R.I.S.E. Tous droits réservés.
            </p>
            <p className="text-[#F5F5DC]/60 text-lg font-light">Résilience · Intuition · Strength · Energy</p>
          </div>
          
          {/* Attribution on the right */}
          <div className="text-center md:text-right">
            <p className="text-[#F5F5DC]/60 text-base font-light">
              Powered and designed by <a href="https://www.codenutri.com" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">www.codenutri.com</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
