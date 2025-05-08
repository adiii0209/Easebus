import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Ticket, Clock, MapPin, Calendar, CreditCard, ChevronRight, Settings, LogOut } from 'lucide-react'
import busData from '../../buses.js'
import passengerImage from '../assets/passenger.jpeg'
import { useAuth } from '../contexts/AuthContext'

const PassengerDashboard = () => {
  const { user: authUser, logout } = useAuth()
  
  // User data
  const [user] = useState({
    firstName: 'Xavier',
    lastName: '',
    email: 'xaviernutz@gmail.com',
    phone: '905173480',
    memberSince: 'January 2023',
    profileImage: passengerImage
  })

  // Upcoming bookings based on bus data
  const [upcomingBookings] = useState(
    busData.slice(0, 2).map((bus, index) => ({
      id: index + 1,
      routeNumber: bus.busId,
      routeName: bus.route,
      from: bus.stops[0],
      to: bus.stops[bus.stops.length - 1],
      date: new Date().toISOString().split('T')[0],
      departureTime: bus.timings[0],
      bookingReference: `EB${100458 + index}`,
      status: 'Confirmed'
    }))
  )

  // Travel history based on bus data
  const [travelHistory] = useState(
    busData.slice(2, 5).map((bus, index) => ({
      id: index + 1,
      routeNumber: bus.busId,
      routeName: bus.route,
      from: bus.stops[0],
      to: bus.stops[bus.stops.length - 1],
      date: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      departureTime: bus.timings[0],
      bookingReference: `EB${100450 + index}`,
      status: 'Completed'
    }))
  )

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 page-transition">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Passenger Dashboard</h1>
        <p className="mt-2 text-base text-gray-600">
          Manage your bookings and view your travel history
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Profile Card */}
        <div className="md:col-span-1">
          <div className="card p-6 transition-all duration-300 ease-in-out transform hover:scale-[1.01]">
            <div className="flex flex-col items-center text-center">
              <img 
                src={user.profileImage} 
                alt={`${user.firstName} ${user.lastName}`} 
                className="h-24 w-24 rounded-full object-cover"
              />
              <h2 className="mt-4 text-lg font-semibold text-gray-900">{user.firstName} {user.lastName}</h2>
              <p className="text-base text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">Member since {user.memberSince}</p>
            </div>

            <div className="mt-6 divide-y divide-gray-200">
              <Link to="/profile" className="flex items-center justify-between py-3 hover:text-primary-600 transition-all duration-200 ease-in-out transform hover:translate-x-1">
                <div className="flex items-center">
                  <User className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Edit Profile</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
              <Link to="/payment-methods" className="flex items-center justify-between py-3 hover:text-primary-600 transition-all duration-200 ease-in-out transform hover:translate-x-1">
                <div className="flex items-center">
                  <CreditCard className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Payment Methods</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
              <Link to="/settings" className="flex items-center justify-between py-3 hover:text-primary-600 transition-all duration-200 ease-in-out transform hover:translate-x-1">
                <div className="flex items-center">
                  <Settings className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Settings</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center justify-between py-3 text-red-600 hover:text-red-700 transition-all duration-200 ease-in-out transform hover:translate-x-1"
              >
                <div className="flex items-center">
                  <LogOut className="mr-3 h-5 w-5" />
                  <span>Logout</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          {/* Upcoming Bookings */}
          <div className="card mb-6">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-base font-semibold text-gray-900">Upcoming Bookings</h2>
            </div>
            
            {upcomingBookings.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{booking.routeNumber} - {booking.routeName}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>Departure: {booking.departureTime}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          {booking.status}
                        </span>
                        <p className="mt-1 text-xs text-gray-500">Ref: {booking.bookingReference}</p>
                        <Link 
                          to={`/bookings/${booking.id}`}
                          className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center">
                      <MapPin className="mr-1 h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{booking.from}</span>
                      <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{booking.to}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <Ticket className="h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-base font-medium text-gray-900">No upcoming bookings</h3>
                <p className="mt-1 text-gray-500">You don't have any upcoming trips scheduled.</p>
                <Link to="/ticket-booking" className="btn btn-primary mt-4">
                  Book a Trip
                </Link>
              </div>
            )}
          </div>

          {/* Travel History */}
          <div className="card">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-base font-semibold text-gray-900">Travel History</h2>
            </div>
            
            {travelHistory.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {travelHistory.map((booking) => (
                  <div key={booking.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{booking.routeNumber} - {booking.routeName}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>Departure: {booking.departureTime}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          {booking.status}
                        </span>
                        <p className="mt-1 text-xs text-gray-500">Ref: {booking.bookingReference}</p>
                        <Link 
                          to={`/bookings/${booking.id}`}
                          className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center">
                      <MapPin className="mr-1 h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{booking.from}</span>
                      <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{booking.to}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <Clock className="h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No travel history</h3>
                <p className="mt-1 text-gray-500">You haven't taken any trips with us yet.</p>
                <Link to="/ticket-booking" className="btn btn-primary mt-4">
                  Book Your First Trip
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PassengerDashboard