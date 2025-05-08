import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    // Redirect to auth page if not logged in
    return <Navigate to="/auth" replace />
  }

  return children
}

export default ProtectedRoute