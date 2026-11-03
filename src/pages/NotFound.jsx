import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Bus } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="mx-auto flex min-h-[80dvh] max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="relative animate-scale-in">
        <span className="absolute inset-0 animate-pulse-ring rounded-[28px] bg-primary-200" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-ios-lg">
          <Bus className="h-12 w-12" strokeWidth={2} />
        </div>
      </div>
      <p className="mt-8 animate-slide-up text-sm font-bold uppercase tracking-widest text-primary-600">Error 404</p>
      <h1 className="mt-2 animate-slide-up text-3xl font-bold tracking-tight text-gray-900" style={{ animationDelay: '60ms' }}>
        This stop doesn’t exist
      </h1>
      <p className="mt-3 animate-slide-up text-[15px] text-gray-500" style={{ animationDelay: '120ms' }}>
        The page you’re looking for was moved or never existed. Let’s get you back on route.
      </p>
      <div className="mt-8 flex w-full animate-slide-up flex-col gap-2.5 sm:flex-row sm:justify-center" style={{ animationDelay: '180ms' }}>
        <Link to="/" className="btn btn-primary btn-lg">
          <Home className="h-5 w-5" />
          Back to Home
        </Link>
        <button onClick={() => window.history.back()} className="btn btn-outline btn-lg">
          <ArrowLeft className="h-5 w-5" />
          Go Back
        </button>
      </div>
    </div>
  )
}

export default NotFound
