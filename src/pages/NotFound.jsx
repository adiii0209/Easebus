import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center md:px-6">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
      <p className="mt-4 max-w-md text-lg text-gray-600">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
        <Link to="/" className="btn btn-primary flex items-center justify-center">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <button 
          onClick={() => window.history.back()} 
          className="btn btn-outline flex items-center justify-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </button>
      </div>
    </div>
  )
}

export default NotFound