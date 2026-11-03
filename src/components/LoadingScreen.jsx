import { useEffect, useState } from 'react'
import { Bus } from 'lucide-react'

const LoadingScreen = ({ isLoading }) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShow(false), 600)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-primary-600 transition-all duration-500 ease-ios ${
        isLoading ? 'opacity-100' : 'pointer-events-none scale-105 opacity-0'
      }`}
    >
      <div className="relative animate-scale-in">
        <span className="absolute inset-0 animate-pulse-ring rounded-[28px] bg-white/30" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-white shadow-ios-float">
          <Bus className="h-12 w-12 text-primary-600" strokeWidth={2.25} />
        </div>
      </div>
      <h2 className="mt-6 animate-slide-up text-3xl font-bold tracking-tight text-white" style={{ animationDelay: '150ms' }}>
        EaseBus
      </h2>
      <p className="mt-1 animate-slide-up text-[15px] text-white/70" style={{ animationDelay: '250ms' }}>
        Your journey begins here
      </p>
    </div>
  )
}

export default LoadingScreen
