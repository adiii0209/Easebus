import { Link } from 'react-router-dom'
import { Bell, Bus } from 'lucide-react'

const Navbar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-40 animate-slide-down">
      <div className="pt-safe">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 rounded-full bg-white/15 py-1.5 pl-1.5 pr-3.5 text-white ring-1 ring-white/25 backdrop-blur-xl transition active:scale-95">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary-600">
              <Bus className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-[15px] font-bold tracking-tight">EaseBus</span>
          </Link>

          {/* Notification Button */}
          <Link
            to="/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-xl transition active:scale-90"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-yellow-400 ring-2 ring-primary-600" />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
