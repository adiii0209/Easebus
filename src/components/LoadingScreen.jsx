import { useEffect, useState } from 'react'
import { Bus } from 'lucide-react'
import '../styles/animations.css'

const LoadingScreen = ({ isLoading }) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      // Add a small delay before hiding to ensure smooth transition
      const timer = setTimeout(() => setShow(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (!show) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center">
        <div className="relative mb-4">
          <Bus className="h-16 w-16 text-primary-600 animate-spin-slow" />
          <div className="absolute inset-0 animate-pulse-ring rounded-full border-4 border-primary-600"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-fade-in">EaseBus</h2>
        <p className="text-gray-600 animate-fade-in delay-200">
          Your journey begins here
        </p>
        <div className="mt-4 flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-primary-600 animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen