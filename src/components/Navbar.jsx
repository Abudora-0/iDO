export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-orange-500 to-amber-400 shadow-lg shadow-orange-200">
      <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <div>
            <span className="font-black text-white text-2xl tracking-tight leading-none">iDO</span>
            <p className="text-white/70 text-[11px] leading-none mt-0.5">The tasks you will do</p>
          </div>
        </div>

        {/* Right badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-yellow-200 animate-pulse" />
          <span className="text-white text-xs font-semibold">Stay productive</span>
        </div>

      </div>
    </nav>
  )
}
