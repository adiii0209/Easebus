import { X, User, Settings, LogOut, Bell, CreditCard, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProfileSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      path: '/passenger-dashboard'
    },
    {
      icon: MapPin,
      label: 'My Routes',
      path: '/route-planner'
    },
    {
      icon: CreditCard,
      label: 'My Tickets',
      path: '/ticket-booking'
    },
    {
      icon: Bell,
      label: 'Notifications',
      path: '/notifications'
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings'
    },
    {
      icon: LogOut,
      label: 'Logout',
      path: '#',
      onClick: () => {
        logout()
        onClose()
      },
      className: 'text-red-700 hover:bg-red-50'
    }
  ]

  return (
    <div
      className={`fixed right-0 top-0 z-50 h-full w-80 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* User Info */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-2xl text-primary-600">
            {user?.avatar || '👤'}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{user?.xav || 'Xavier'}</h3>
            <p className="text-sm text-gray-500">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 ${item.className || 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={onClose}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>


    </div>
  )
}

export default ProfileSidebar