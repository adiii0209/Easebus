import { Link } from 'react-router-dom'
import { Bell, Bus } from 'lucide-react'
import '../styles/animations.css'

const Navbar = () => {

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm animate-slide-down transition-all">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Bus className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-bold text-primary-600">EaseBus</span>
          </Link>

          {/* Notification Button */}
          <Link 
            to="/notifications" 
            className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <Bell className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar