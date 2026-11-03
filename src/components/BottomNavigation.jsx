import { NavLink, useLocation } from 'react-router-dom'
import { Home, Bus, Ticket, User, Route } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { spring } from './ui'

const BottomNavigation = () => {
  const { user } = useAuth()
  const { pathname } = useLocation()

  const navItems = [
    { icon: Home, label: 'Home', path: '/', match: ['/'], exact: true },
    { icon: Bus, label: 'Track', path: '/bus-tracking', match: ['/bus-tracking'] },
    { icon: Route, label: 'Plan', path: '/route-planner', match: ['/route-planner'] },
    { icon: Ticket, label: 'Tickets', path: '/ticket-booking', match: ['/ticket-booking'] },
    {
      icon: User,
      label: 'Profile',
      path: user ? '/passenger-dashboard' : '/auth',
      match: ['/passenger-dashboard', '/auth', '/login', '/register'],
    },
  ]

  const isActive = (item) =>
    item.exact ? pathname === '/' : item.match.some((m) => pathname.startsWith(m))

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-safe pointer-events-none">
      <div className="pointer-events-auto mx-auto mb-3 flex max-w-md items-center justify-between rounded-[28px] bg-white/80 p-1.5 shadow-ios-float ring-1 ring-black/5 backdrop-blur-2xl backdrop-saturate-150 animate-slide-up">
        {navItems.map((item) => {
          const active = isActive(item)
          const { icon: Icon, label, path } = item
          return (
            <NavLink
              key={label}
              to={path}
              aria-label={label}
              className="relative flex h-[54px] flex-1 flex-col items-center justify-center gap-0.5 rounded-[22px] transition-transform duration-200 ease-ios active:scale-90"
            >
              {active && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-[22px] bg-primary-50"
                  transition={spring}
                />
              )}
              <span className={`relative z-10 transition-colors duration-200 ${active ? 'text-primary-600' : 'text-gray-400'}`}>
                {label === 'Profile' && user ? (
                  <img
                    src={user.profileImage || '/src/assets/passenger.jpeg'}
                    alt=""
                    className={`h-6 w-6 rounded-full object-cover ring-2 transition ${active ? 'ring-primary-500' : 'ring-transparent'}`}
                  />
                ) : (
                  <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.5 : 2} />
                )}
              </span>
              <span
                className={`relative z-10 text-[10.5px] font-semibold leading-none transition-colors duration-200 ${
                  active ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation
