import { useState, useEffect } from 'react'
import { Search, MapPin, Clock, ArrowRight, Calendar, Users, RotateCw } from 'lucide-react'
import busService from '../services/BusService'
import RouteGraph from '../services/RouteGraph'

const RoutePlanner = () => {
  const [routeParams, setRouteParams] = useState({
    from: '',
    to: '',
    preferences: 'fastest' // fastest, cheapest, fewest_transfers
  })
  const [searchResults, setSearchResults] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [allStops, setAllStops] = useState([])
  const [routeGraph, setRouteGraph] = useState(null)

  // Initialize route graph and load stops
  useEffect(() => {
    setAllStops(busService.getAllStops())
    setRouteGraph(RouteGraph.fromBusService(busService))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (!routeGraph) {
      setIsLoading(false)
      return
    }

    // Find optimal path using RouteGraph
    const optimalPath = routeGraph.findShortestPath(
      routeParams.from,
      routeParams.to,
      routeParams.preferences === 'fastest' ? 'duration' : 'distance'
    )

    if (!optimalPath) {
      setSearchResults([])
      setIsLoading(false)
      return
    }

    // Generate route options based on the optimal path
    const generatedRoutes = []

    // Convert path segments to route
    const route = {
      id: `route-${Date.now()}`,
      from: routeParams.from,
      to: routeParams.to,
      duration: `${Math.floor(optimalPath.totalDuration / 60)}h ${optimalPath.totalDuration % 60}m`,
      distance: `${optimalPath.totalDistance.toFixed(1)} km`,
      price: optimalPath.path.reduce((total, segment) => {
        const bus = busService.getBusById(segment.busId)
        // AC buses cost ₹45, non-AC buses cost ₹16 per segment
        const segmentPrice = bus.busId.startsWith('AC-') ? 45 : 16
        return total + segmentPrice
      }, 0), // Price is sum of segment prices
      transfers: optimalPath.path.length - 1,
      buses: []
    }

    // Process each segment of the path using current time
    let currentTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    optimalPath.path.forEach((segment, index) => {
      const bus = busService.getBusById(segment.busId)
      
      // Calculate arrival time based on duration
      const arrivalTime = calculateArrivalTime(currentTime, segment.duration)
      
      route.buses.push({
        routeNumber: segment.busId,
        from: segment.from,
        to: segment.to,
        departureTime: currentTime,
        arrivalTime,
        busDetails: bus
      })
      
      // Add transfer time for next segment
      if (index < optimalPath.path.length - 1) {
        currentTime = calculateArrivalTime(arrivalTime, 15) // 15 min transfer time
      }
    })

    route.departureTime = route.buses[0].departureTime
    route.arrivalTime = route.buses[route.buses.length - 1].arrivalTime

    generatedRoutes.push(route)

    // Find alternative routes by adjusting preferences
    const alternativePreferences = ['duration', 'distance']
    alternativePreferences.forEach(pref => {
      if (pref === (routeParams.preferences === 'fastest' ? 'duration' : 'distance')) return
      
      const altPath = routeGraph.findShortestPath(routeParams.from, routeParams.to, pref)
      if (altPath && JSON.stringify(altPath) !== JSON.stringify(optimalPath)) {
        const altRoute = {
          id: `route-${Date.now()}-${pref}`,
          from: routeParams.from,
          to: routeParams.to,
          duration: `${Math.floor(altPath.totalDuration / 60)}h ${altPath.totalDuration % 60}m`,
          distance: `${altPath.totalDistance.toFixed(1)} km`,
          price: altPath.path.reduce((total, segment) => {
            const bus = busService.getBusById(segment.busId)
            // AC buses cost ₹45, non-AC buses cost ₹16 per segment
            const segmentPrice = bus.busId.startsWith('AC-') ? 45 : 16
            return total + segmentPrice
          }, 0), // Price is sum of segment prices
          transfers: altPath.path.length - 1,
          buses: []
        }

        currentTime = routeParams.time || '08:00'
        altPath.path.forEach((segment, index) => {
          const bus = busService.getBusById(segment.busId)
          const arrivalTime = calculateArrivalTime(currentTime, segment.duration)
          
          altRoute.buses.push({
            routeNumber: segment.busId,
            from: segment.from,
            to: segment.to,
            departureTime: currentTime,
            arrivalTime,
            busDetails: bus
          })
          
          if (index < altPath.path.length - 1) {
            currentTime = calculateArrivalTime(arrivalTime, 15)
          }
        })

        altRoute.departureTime = altRoute.buses[0].departureTime
        altRoute.arrivalTime = altRoute.buses[altRoute.buses.length - 1].arrivalTime

        generatedRoutes.push(altRoute)
      }
    })

    // Sort routes based on user preferences
    let sortedRoutes = [...generatedRoutes]
    
    if (routeParams.preferences === 'fastest') {
      sortedRoutes.sort((a, b) => {
        const getDurationMinutes = (duration) => {
          const hourMatch = duration.match(/(\d+)h/)
          const minuteMatch = duration.match(/(\d+)m/)
          const hours = hourMatch ? parseInt(hourMatch[1]) : 0
          const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0
          return hours * 60 + minutes
        }
        return getDurationMinutes(a.duration) - getDurationMinutes(b.duration)
      })
    } else if (routeParams.preferences === 'cheapest') {
      sortedRoutes.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    } else if (routeParams.preferences === 'fewest_transfers') {
      sortedRoutes.sort((a, b) => a.transfers - b.transfers)
    }
    
    // Simulate API call with timeout
    setTimeout(() => {
      setSearchResults(sortedRoutes)
      setIsLoading(false)
    }, 1000)
  }
  
  // Helper function to calculate arrival time
  const calculateArrivalTime = (departureTime, durationMinutes) => {
    const [time, period] = departureTime.split(' ')
    const [hours, minutes] = time.split(':').map(Number)
    
    let totalMinutes = (hours % 12) * 60 + minutes + durationMinutes
    if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60
    if (period === 'AM' && hours === 12) totalMinutes -= 12 * 60
    
    const newHours = Math.floor(totalMinutes / 60) % 24
    const newMinutes = totalMinutes % 60
    
    const newPeriod = newHours >= 12 ? 'PM' : 'AM'
    const displayHours = newHours % 12 === 0 ? 12 : newHours % 12
    
    return `${displayHours}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setRouteParams({
      ...routeParams,
      [name]: value
    })
  }

  const handleRouteSelect = (route) => {
    setSelectedRoute(route)
  }

  const getRouteLabel = (route) => {
    if (route.transfers === 0) return 'Direct Route'
    if (route.transfers === 1) return 'One Transfer'
    return `${route.transfers} Transfers`
  }

  const getRouteTagColor = (route) => {
    if (route.transfers === 0) return 'bg-green-100 text-green-800'
    if (route.transfers === 1) return 'bg-blue-100 text-blue-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Route Planner</h1>
        <p className="mt-2 text-lg text-gray-600">
          Plan your journey with our comprehensive route planner.
        </p>
      </div>

      {/* Search Form */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Plan Your Route</h2>
        <form onSubmit={handleSearch}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <label htmlFor="from" className="block text-sm font-medium text-gray-700">From</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                  <MapPin className="h-4 w-4" />
                </span>
                <select
                  id="from"
                  name="from"
                  value={routeParams.from}
                  onChange={handleInputChange}
                  className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                >
                  <option value="">Select starting location</option>
                  {allStops.map(stop => (
                    <option key={stop} value={stop}>{stop}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <label htmlFor="to" className="block text-sm font-medium text-gray-700">To</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                  <MapPin className="h-4 w-4" />
                </span>
                <select
                  id="to"
                  name="to"
                  value={routeParams.to}
                  onChange={handleInputChange}
                  className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                >
                  <option value="">Select destination</option>
                  {allStops.map(stop => (
                    <option key={stop} value={stop}>{stop}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button type="submit" className="btn btn-primary w-full">
                <Search className="mr-2 h-4 w-4" />
                Find Routes
              </button>
            </div>
            

            
            <div className="lg:col-span-1">
              <label htmlFor="preferences" className="block text-sm font-medium text-gray-700">Preferences</label>
              <select
                id="preferences"
                name="preferences"
                value={routeParams.preferences}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="fastest">Fastest Route</option>
                <option value="cheapest">Cheapest Route</option>
                <option value="fewest_transfers">Fewest Transfers</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RotateCw className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-lg font-medium text-gray-600">Finding the best routes for you...</span>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-xl font-semibold text-gray-900">Available Routes</h2>
            <p className="mt-1 text-sm text-gray-600">
              From {routeParams.from || 'Downtown'} to {routeParams.to || 'Airport'} {routeParams.date ? `on ${routeParams.date}` : ''}
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {searchResults.map((route) => (
              <div 
                key={route.id} 
                className={`cursor-pointer p-4 transition-colors hover:bg-gray-50 ${selectedRoute?.id === route.id ? 'bg-primary-50' : ''}`}
                onClick={() => handleRouteSelect(route)}
              >
                <div className="flex flex-col justify-between md:flex-row md:items-center">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRouteTagColor(route)}`}>
                        {getRouteLabel(route)}
                      </span>
                      {route.price === Math.min(...searchResults.map(r => r.price)) && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Cheapest
                        </span>
                      )}
                      {route.duration === Math.min(...searchResults.map(r => r.duration.replace(/[^0-9]/g, ''))) && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          Fastest
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{route.departureTime} - {route.arrivalTime} ({route.duration})</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {route.distance} • {route.transfers === 0 ? 'Direct' : `${route.transfers} transfer${route.transfers > 1 ? 's' : ''}`}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">₹{route.price}</div>
                    <button 
                      className="btn btn-primary mt-3"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRouteSelect(route)
                      }}
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Selected Route Details */}
      {selectedRoute && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Route Details</h2>
          
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="text-lg font-medium text-gray-900">{selectedRoute.from}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
              <div className="text-right">
                <p className="text-sm text-gray-500">To</p>
                <p className="text-lg font-medium text-gray-900">{selectedRoute.to}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Departure</p>
                <p className="text-lg font-medium text-gray-900">{selectedRoute.departureTime}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="text-lg font-medium text-gray-900">{selectedRoute.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Arrival</p>
                <p className="text-lg font-medium text-gray-900">{selectedRoute.arrivalTime}</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">Journey Details</h3>
              
              <div className="mt-4 space-y-6">
                {selectedRoute.buses.map((bus, index) => (
                  <div key={index} className="relative">
                    {index > 0 && (
                      <div className="absolute left-4 top-0 h-full w-0.5 -translate-x-1/2 bg-gray-200"></div>
                    )}
                    <div className="relative flex">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary-500 bg-white text-sm font-medium text-primary-600">
                        {index + 1}
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-medium text-gray-900">Bus {bus.routeNumber}</h4>
                          <span className="text-sm text-gray-500">{bus.departureTime} - {bus.arrivalTime}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">From</p>
                            <p className="font-medium text-gray-900">{bus.from}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <div className="text-right">
                            <p className="text-sm text-gray-500">To</p>
                            <p className="font-medium text-gray-900">{bus.to}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 rounded-lg bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="text-2xl font-bold text-gray-900">₹{selectedRoute.price}</p>
                </div>
                <button className="btn btn-primary">
                  Book This Route
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoutePlanner