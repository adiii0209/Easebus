import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import BusTracking from './pages/BusTracking'
import BusDetails from './pages/BusDetails'
import RoutePlanner from './pages/RoutePlanner'
import TicketBooking from './pages/TicketBooking'
import Notifications from './pages/Notifications'
import PassengerDashboard from './pages/PassengerDashboard'
import AuthPage from './pages/auth/AuthPage'
import NotFound from './pages/NotFound'
import { AuthProvider } from './contexts/AuthContext'
import { LocationProvider } from './contexts/LocationContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminPanel from './pages/AdminPanel'
import DriverDashboard from './pages/DriverDashboard'
import AssignmentPage from './pages/AssignmentPage'
import ManagementPage from './pages/ManagementPage'
import FinanceManagement from './pages/FinanceManagement'

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/bus-tracking" element={<BusTracking />} />
          <Route path="/bus-details/:busId" element={<BusDetails />} />
          <Route path="/route-planner" element={<RoutePlanner />} />
          <Route path="/ticket-booking" element={<TicketBooking />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/passenger-dashboard" element={
            <ProtectedRoute>
              <PassengerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/assignment" element={<AssignmentPage />} />
          <Route path="/management" element={<ManagementPage />} />
          <Route path="/finance" element={<FinanceManagement />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        </Routes>
      </LocationProvider>
    </AuthProvider>
  )
}

export default App