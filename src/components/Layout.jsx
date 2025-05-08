import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import BottomNavigation from './BottomNavigation'
import LoadingScreen from './LoadingScreen'

const Layout = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Scroll to top whenever location changes
    window.scrollTo(0, 0)
  }, [location])

  return (
    <div className="flex min-h-screen flex-col pb-16">
      <LoadingScreen isLoading={isLoading} />
      {location.pathname === '/' && <Navbar />}
      <main className="flex-1 page-transition">
        <Outlet />
      </main>
      {/* Global styles moved to CSS file */}
      <BottomNavigation />
    </div>
  )
}

export default Layout