import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import BottomNavigation from './BottomNavigation'
import LoadingScreen from './LoadingScreen'

// Screens that own the whole viewport and bring their own navigation
const immersiveRoutes = ['/bus-details', '/admin', '/driver', '/assignment', '/management', '/finance']

const Layout = () => {
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const immersive = immersiveRoutes.some((r) => location.pathname.startsWith(r))

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <LoadingScreen isLoading={isLoading} />
      {location.pathname === '/' && <Navbar />}
      <motion.main
        key={location.pathname}
        className={`flex-1 ${immersive ? '' : 'pb-tabbar'}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
      >
        <Outlet />
      </motion.main>
      {!immersive && <BottomNavigation />}
    </div>
  )
}

export default Layout
