import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-[#0A291C] py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Logo and name at the top */}
          <div className="mb-8 flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <Image src="/images/rise-logo-new.png" alt="RISE Logo" width={48} height={48} className="w-full h-auto" />
            </div>
            <span className="font-alta text-[#D4AF37] text-2xl tracking-widest">RISE</span>
          </div>

          {/* Copyright and tagline centered */}
          <div className="text-center mb-6">
            <p className="text-[#F5F5DC]/80 text-base font-light mb-2">
              &copy; {new Date().getFullYear()} R.I.S.E. Tous droits réservés.
            </p>
            <p className="text-[#F5F5DC]/60 text-base font-light">Résilience · Intuition · Strength · Energy</p>
          </div>
          
          {/* Attribution at the bottom */}
          <div className="text-center">
            <p className="text-[#F5F5DC]/60 text-sm font-light">
              Powered and designed by <a href="https://www.codenutri.com" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">www.codenutri.com</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
