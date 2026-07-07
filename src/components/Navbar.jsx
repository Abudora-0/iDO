const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function Navbar() {
  const now = new Date()
  const dateLine = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`

  return (
    <header className="border-b-2 border-[#1f2a44]/15">
      <div className="max-w-2xl mx-auto px-5 pt-10 pb-6 flex items-end justify-between">
        <div>
          <p className="font-display italic text-[#5d6b8a] text-sm mb-1">{dateLine}</p>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-[#1f2a44]">
            iDO<span className="text-[#d9534f]">.</span>
          </h1>
          <p className="text-[#98a3ba] text-xs mt-1.5 tracking-wide">write it down · cross it off</p>
        </div>

        <a
          href="https://github.com/Abudora-0/iDO"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#5d6b8a] hover:text-[#1f2a44] border-b border-dashed border-[#98a3ba] hover:border-[#1f2a44] pb-0.5 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          source
        </a>
      </div>
    </header>
  )
}
