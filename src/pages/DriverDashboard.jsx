import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Calendar, Clock, MapPin, Users, ChevronRight, Settings, LogOut, Truck, RotateCw } from 'lucide-react'
import busData from '../../buses.js'
import driverimage from '../assets/driver.jpg'

const DriverDashboard = () => {
  // Mock driver data
  const [driver] = useState({
    firstName: 'Raju',
    lastName: 'Da',
    email: 'rajudarocks@gmail.com',
    phone: '9073328173',
    employeeId: 'DRV-2023-1045',
    licenseNumber: 'CDL-123456789',
    memberSince: 'March 2022',
    profileImage: driverimage
  })

  // Assigned routes from bus data
  const [assignedRoutes, setAssignedRoutes] = useState([])

  useEffect(() => {
    // Convert bus data to assigned routes format
    const routes = busData.map((bus, index) => ({
      id: index + 1,
      routeNumber: bus.busId,
      routeName: bus.route,
      busId: bus.busId,
      startLocation: bus.stops[0],
      endLocation: bus.stops[bus.stops.length - 1],
      startTime: bus.timings[0],
      endTime: bus.timings[bus.timings.length - 1],
      date: new Date().toISOString().split('T')[0],
      status: 'Upcoming',
      passengers: Math.floor(Math.random() * 30) + 20,
      stops: bus.stops,
      timings: bus.timings
    }))
    setAssignedRoutes(routes)
  }, [])

  // Completed routes
  const [completedRoutes, setCompletedRoutes] = useState([])

  // State for active route (if driver is currently on a route)
  const [activeRoute, setActiveRoute] = useState(null)
  const [isStartingRoute, setIsStartingRoute] = useState(false)

  const handleStartRoute = (route) => {
    setIsStartingRoute(true)
    
    // Simulate starting a route
    setTimeout(() => {
      setActiveRoute(route)
      setIsStartingRoute(false)
    }, 1500)
  }

  const handleEndRoute = () => {
    setIsStartingRoute(true)
    
    // Simulate ending a route
    setTimeout(() => {
      setActiveRoute(null)
      setIsStartingRoute(false)
      // In a real app, we would move the active route to completed routes
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
        <p className="mt-2 text-base text-gray-600">
          Manage your routes and view your schedule
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Driver Profile Card */}
        <div className="md:col-span-1">
          <div className="card p-6">
            <div className="flex flex-col items-center text-center">
              <img 
                src={driver.profileImage} 
                alt={`${driver.firstName} ${driver.lastName}`} 
                className="h-24 w-24 rounded-full object-cover"
              />
              <h2 className="mt-4 text-lg font-semibold text-gray-900">{driver.firstName} {driver.lastName}</h2>
              <p className="text-base text-gray-600">{driver.email}</p>
              <p className="text-sm text-gray-500">Employee ID: {driver.employeeId}</p>
              <p className="text-sm text-gray-500">License: {driver.licenseNumber}</p>
            </div>

            <div className="mt-6 divide-y divide-gray-200">
              <Link to="/profile" className="flex items-center justify-between py-3 hover:text-primary-600">
                <div className="flex items-center">
                  <User className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Edit Profile</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
              <Link to="/schedule" className="flex items-center justify-between py-3 hover:text-primary-600">
                <div className="flex items-center">
                  <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                  <span>View Schedule</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
              <Link to="/settings" className="flex items-center justify-between py-3 hover:text-primary-600">
                <div className="flex items-center">
                  <Settings className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Settings</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
              <Link to="/" className="flex items-center justify-between py-3 text-red-600 hover:text-red-700">
                <div className="flex items-center">
                  <LogOut className="mr-3 h-5 w-5" />
                  <span>Logout</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          {/* Active Route (if any) */}
          {activeRoute && (
            <div className="card mb-6 border-2 border-primary-500">
              <div className="border-b border-primary-200 bg-primary-50 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-primary-800">Active Route</h2>
                  <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                    In Progress
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{activeRoute.routeNumber} - {activeRoute.routeName}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>{new Date(activeRoute.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700">Stops:</h4>
                      <div className="mt-1 space-y-1">
                        {activeRoute.stops.map((stop, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                            <span>{stop}</span>
                            {index < activeRoute.timings.length && (
                              <span className="ml-2 text-gray-500">({activeRoute.timings[index]})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{activeRoute.startTime} - {activeRoute.endTime}</span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Truck className="mr-1 h-4 w-4" />
                      <span>Bus ID: {activeRoute.busId}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="mr-1 h-4 w-4" />
                      <span>{activeRoute.passengers} passengers</span>
                    </div>
                    <button 
                      onClick={handleEndRoute}
                      className="btn btn-primary mt-4"
                      disabled={isStartingRoute}
                    >
                      {isStartingRoute ? (
                        <>
                          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : 'End Route'}
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <MapPin className="mr-1 h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{activeRoute.startLocation}</span>
                  <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{activeRoute.endLocation}</span>
                </div>
              </div>
            </div>
          )}

          {/* Assigned Routes */}
          <div className="card">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Assigned Routes</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {assignedRoutes.map((route) => (
                <div key={route.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {route.routeNumber} - {route.routeName}
                      </h3>
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="mr-1 h-4 w-4" />
                          <span>From: {route.startLocation}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="mr-1 h-4 w-4" />
                          <span>To: {route.endLocation}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>First Trip: {route.startTime} - Last Trip: {route.endTime}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <details className="text-sm">
                          <summary className="cursor-pointer font-medium text-primary-600 hover:text-primary-700">
                            View All Stops ({route.stops.length} stops)
                          </summary>
                          <div className="mt-2 space-y-1 pl-4">
                            {route.stops.map((stop, index) => (
                              <div key={index} className="flex items-center text-gray-600">
                                <span className="mr-2 text-xs">{index + 1}.</span>
                                <span>{stop}</span>
                                {index < route.timings.length && (
                                  <span className="ml-2 text-gray-500">({route.timings[index]})</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    </div>
                    {!activeRoute && (
                      <button
                        onClick={() => handleStartRoute(route)}
                        disabled={isStartingRoute}
                        className="ml-4 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        {isStartingRoute ? (
                          <RotateCw className="h-5 w-5 animate-spin" />
                        ) : (
                          'Start Route'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {assignedRoutes.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {assignedRoutes.map((route) => (
                  <div key={route.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{route.routeNumber} - {route.routeName}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{new Date(route.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>{route.startTime} - {route.endTime}</span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Truck className="mr-1 h-4 w-4" />
                          <span>Bus ID: {route.busId}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {route.status}
                        </span>
                        <div className="mt-1 flex items-center justify-end text-sm text-gray-500">
                          <Users className="mr-1 h-4 w-4" />
                          <span>{route.passengers} passengers</span>
                        </div>
                        {!activeRoute && (
                          <button 
                            onClick={() => handleStartRoute(route)}
                            className="btn btn-primary mt-4"
                            disabled={isStartingRoute}
                          >
                            {isStartingRoute ? (
                              <>
                                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                Starting...
                              </>
                            ) : 'Start Route'}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center">
                      <MapPin className="mr-1 h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{route.startLocation}</span>
                      <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{route.endLocation}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <Calendar className="h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming routes</h3>
                <p className="mt-1 text-gray-500">You don't have any upcoming routes assigned.</p>
              </div>
            )}
          </div>

          {/* Completed Routes */}
          <div className="card">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Completed Routes</h2>
            </div>
            
            {completedRoutes.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {completedRoutes.map((route) => (
                  <div key={route.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{route.routeNumber} - {route.routeName}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{new Date(route.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>{route.startTime} - {route.endTime}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          {route.status}
                        </span>
                        <div className="mt-1 flex items-center justify-end text-sm text-gray-500">
                          <Users className="mr-1 h-4 w-4" />
                          <span>{route.passengers} passengers</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          Rating: {route.rating}/5
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center">
                      <MapPin className="mr-1 h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{route.startLocation}</span>
                      <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{route.endLocation}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <Clock className="h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No completed routes</h3>
                <p className="mt-1 text-gray-500">You haven't completed any routes yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverDashboard