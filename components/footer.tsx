export function Footer() {
  return (
    <footer className="bg-[#0A291C] py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <span className="font-alta text-[#D4AF37] text-xl tracking-widest">RISE</span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-[#F5F5DC]/70 text-sm font-light mb-2">
              &copy; {new Date().getFullYear()} R.I.S.E. Tous droits réservés.
            </p>
            <p className="text-[#F5F5DC]/40 text-xs font-light">Résilience · Intuition · Strength · Energy</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

