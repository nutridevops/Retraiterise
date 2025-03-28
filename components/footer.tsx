import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-[#0A291C] py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image src="/images/rise-logo-new.png" alt="RISE Logo" width={40} height={40} className="w-full h-auto" />
            </div>
            <span className="font-alta text-[#D4AF37] text-xl tracking-widest">RISE</span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-[#F5F5DC]/70 text-sm font-light mb-2">
              &copy; {new Date().getFullYear()} R.I.S.E. Tous droits réservés.
            </p>
            <p className="text-[#F5F5DC]/40 text-xs font-light mb-2">Résilience · Intuition · Strength · Energy</p>
            <p className="text-[#F5F5DC]/40 text-xs font-light">
              Powered and designed by <a href="https://codenutri.com" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">codenutri.com</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
