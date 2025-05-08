import { useState, useEffect } from 'react'
import { Search, MapPin, Clock, Bus, Route, Ticket, Navigation, AlertCircle, Maximize, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import busService from '../services/BusService'
import BusMap from '../components/BusMap'
import SearchModal from '../components/SearchModal'
import '../styles/animations.css'

const BusTracking = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBus, setSelectedBus] = useState(null)
  const [buses, setBuses] = useState([])
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isMapFullscreen, setIsMapFullscreen] = useState(false)
  
  // Location tracking states
  const [userLocation, setUserLocation] = useState(null)
  const [locationPermission, setLocationPermission] = useState('prompt') // 'prompt', 'granted', 'denied'
  const [nearbyRadius, setNearbyRadius] = useState(5) // Default 5km radius
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState(null)
  
  // Function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c // Distance in km
  }
  
  // Load buses from service
  useEffect(() => {
    setBuses(busService.getAllBuses())
  }, [])
  
  // Function to request location permission and get user location
  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      setLocationPermission('unsupported')
      setLocationError('Geolocation is not supported by your browser')
      return
    }
    
    setIsLoadingLocation(true)
    setLocationError(null)
    
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })
      
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
      setLocationPermission('granted')
    } catch (error) {
      console.error('Error getting location:', error)
      if (error.code === 1) { // Permission denied
        setLocationPermission('denied')
        setLocationError('Location access was denied. Please enable location services to see nearby buses.')
      } else if (error.code === 2) { // Position unavailable
        setLocationPermission('error')
        setLocationError('Unable to determine your location. Please check your device settings.')
      } else { // Timeout
        setLocationPermission('error')
        setLocationError('Location request timed out. Please try again.')
      }
    } finally {
      setIsLoadingLocation(false)
    }
  }
  
  // Request location permission when component mounts
  useEffect(() => {
    requestLocationPermission()
    
    // Set up location tracking with watchPosition
    let watchId
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error tracking location:', error)
        },
        { enableHighAccuracy: true }
      )
    }
    
    // Clean up the watch when component unmounts
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [])

  // Add simulated real-time data to each bus with coordinates closer to user location
  const enhancedBuses = buses.map(bus => {
    // Generate coordinates closer to user location if available, otherwise use Kolkata center
    let busLat, busLng;
    
    if (userLocation) {
      // Generate coordinates within 0.5-2km of user's location
      const randomDistance = 0.5 + Math.random() * 1.5; // Between 0.5 and 2km
      const randomAngle = Math.random() * 2 * Math.PI; // Random angle in radians
      
      // Convert distance to latitude/longitude offsets (approximate)
      // 0.01 degrees is roughly 1.11km at the equator
      const latOffset = (randomDistance / 111) * Math.cos(randomAngle);
      const lngOffset = (randomDistance / (111 * Math.cos(userLocation.lat * Math.PI / 180))) * Math.sin(randomAngle);
      
      busLat = userLocation.lat + latOffset;
      busLng = userLocation.lng + lngOffset;
    } else {
      // Fallback to Kolkata center with smaller range if no user location
      busLat = 22.5726 + (Math.random() * 0.02 - 0.01) // +/- 0.01 degrees (roughly 1km)
      busLng = 88.3639 + (Math.random() * 0.02 - 0.01)
    }
    
    // Calculate distance from user if location is available
    let distanceFromUser = null
    if (userLocation) {
      distanceFromUser = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        busLat, 
        busLng
      )
    }
    
    return {
      ...bus,
      id: bus.busId, // Map busId to id for compatibility
      routeNumber: bus.busId,
      routeName: bus.route,
      currentLocation: bus.stops[Math.floor(Math.random() * (bus.stops.length - 1))],
      nextStop: bus.stops[Math.floor(Math.random() * (bus.stops.length - 1)) + 1],
      estimatedArrival: Math.floor(Math.random() * 15) + ' mins',
      status: Math.random() > 0.2 ? 'On Time' : 'Slight Delay',
      capacity: Math.floor(Math.random() * 80) + '%',
      coordinates: { lat: busLat, lng: busLng },
      distanceFromUser: distanceFromUser
    }
  })

  // Filter buses based on search query only for the list view
  const filteredBuses = enhancedBuses
    .filter(bus => {
      // Only apply search filter if query exists
      return !searchQuery || 
        busService.searchBusesByRoute(searchQuery)
          .some(searchedBus => searchedBus.busId === bus.busId)
    })
    // Sort by distance if user location is available
    .sort((a, b) => {
      if (userLocation) {
        return a.distanceFromUser - b.distanceFromUser
      }
      return 0
    })
    
  // Filter buses for map view - only show nearby buses
  const nearbyBuses = userLocation 
    ? enhancedBuses.filter(bus => bus.distanceFromUser <= nearbyRadius)
    : enhancedBuses.slice(0, 5) // If no location, just show first 5 buses

  const navigate = useNavigate()

  const handleBusSelect = (bus) => {
    // Navigate to the bus details page
    navigate(`/bus-details/${bus.busId}`)
  }

  return (
    <>
      {isMapFullscreen ? (
        <div className="fixed inset-0 z-50 bg-white">
          <button
            onClick={() => setIsMapFullscreen(false)}
            className="absolute top-4 left-4 z-10 bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors flex items-center space-x-2"
            aria-label="Exit fullscreen"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">Exit Fullscreen</span>
          </button>
          {userLocation ? (
            <>
              <BusMap 
                userLocation={userLocation}
                buses={nearbyBuses}
                selectedBus={selectedBus}
                onBusSelect={handleBusSelect}
                nearbyRadius={nearbyRadius}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-3 text-center">
                <p className="text-gray-600">Showing {nearbyBuses.length} buses within {nearbyRadius} km</p>
                {selectedBus && (
                  <p className="font-medium text-primary-600">
                    Bus {selectedBus.routeNumber} selected
                    {selectedBus.distanceFromUser && (
                      <span className="ml-2 text-sm text-gray-500">
                        ({selectedBus.distanceFromUser.toFixed(1)} km away)
                      </span>
                    )}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-200">
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-600">Enable location access to see nearby buses</p>
                {locationPermission === 'prompt' && (
                  <button 
                    className="mt-4 btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent fullscreen toggle
                      if (navigator.geolocation) {
                        setIsLoadingLocation(true)
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            setUserLocation({
                              lat: position.coords.latitude,
                              lng: position.coords.longitude
                            })
                            setLocationPermission('granted')
                            setIsLoadingLocation(false)
                          },
                          (error) => {
                            console.error('Error getting location:', error)
                            setLocationPermission(error.code === 1 ? 'denied' : 'error')
                            setIsLoadingLocation(false)
                          }
                        )
                      }
                    }}
                  >
                    Allow Location Access
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 md:px-6 animate-fade-in">
          <div className="mb-8 animate-slide-up">
            <h1 className="text-3xl font-bold text-gray-900">Bus Tracking</h1>
            <p className="mt-2 text-lg text-gray-600">
              Track your bus in real-time and get accurate arrival times.
            </p>
          
            {/* Location Status Banner */}
            {(locationPermission === 'denied' || locationPermission === 'error') && (
              <div className="mt-4 flex items-center rounded-lg bg-yellow-50 p-4 text-yellow-800 border border-yellow-200 animate-slide-up transition-all hover-lift">
                <AlertCircle className="h-5 w-5 mr-2" />
                <div className="flex-1">
                  <p className="font-medium">{locationPermission === 'denied' ? 'Location access denied' : 'Location error'}</p>
                  <p className="text-sm">{locationError}</p>
                  <button
                    onClick={requestLocationPermission}
                    disabled={isLoadingLocation}
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-yellow-600 text-xs font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingLocation ? (
                      <>
                        <Navigation className="h-4 w-4 mr-1.5 animate-spin" />
                        Requesting Location...
                      </>
                    ) : (
                      <>
                        <Navigation className="h-4 w-4 mr-1.5" />
                        Try Again
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {isLoadingLocation && (
              <div className="mt-4 flex items-center rounded-lg bg-blue-50 p-4 text-blue-800 border border-blue-200 animate-slide-up transition-all hover-lift">
                <div className="animate-spin mr-2 h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <p>Getting your location...</p>
              </div>
            )}
          </div>

          {/* Search and Radius Controls */}
          <div className="mb-6 space-y-4 animate-slide-up">
            {/* Search Bar */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full rounded-full border border-gray-200 bg-white py-3.5 pl-10 pr-4 text-gray-900 shadow-sm transition-all duration-300 ease-in-out hover:border-primary-400 hover:shadow-md focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                placeholder="Find and track your bus"
                value={searchQuery}
                readOnly
                onClick={() => setIsSearchModalOpen(true)}
              />
            </div>
            
            {/* Radius Selector - Only show when location is available */}
            {userLocation && (
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-primary-600" />
                  <span className="text-gray-700">Nearby radius:</span>
                </div>
                <select
                  className="rounded-lg border border-gray-300 py-1 px-2 text-gray-700 focus:border-primary-500 focus:ring-primary-500"
                  value={nearbyRadius}
                  onChange={(e) => setNearbyRadius(Number(e.target.value))}
                >
                  <option value="1">1 km</option>
                  <option value="2">2 km</option>
                  <option value="5">5 km</option>
                  <option value="10">10 km</option>
                  <option value="20">20 km</option>
                </select>
                <span className="text-gray-500">
                  {filteredBuses.length} buses found ({nearbyBuses.length} nearby)
                </span>
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Bus List */}
            <div className="lg:col-span-1 animate-slide-left">
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-4">
                  <h2 className="text-lg font-semibold text-gray-900">Available Buses</h2>
                </div>
                <div className="divide-y divide-gray-200" style={{ maxHeight: '300px', overflowY: 'auto', overflowX: 'hidden' }}>
                  {filteredBuses.length > 0 ? (
                    filteredBuses.map((bus) => (
                      <div 
                        key={bus.id} 
                        className="cursor-pointer p-4 transition-all hover:bg-gray-50 hover-lift"
                        onClick={() => handleBusSelect(bus)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                              <Bus className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{bus.routeNumber} - {bus.routeName}</h3>
                              <p className="text-sm text-gray-500">{bus.currentLocation}</p>
                              {userLocation && bus.distanceFromUser && (
                                <p className="text-xs text-primary-600 flex items-center mt-1">
                                  <Navigation className="h-3 w-3 mr-1" />
                                  {bus.distanceFromUser.toFixed(1)} km away
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              bus.status === 'On Time' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {bus.status}
                            </span>
                            <p className="mt-1 text-sm text-gray-500">{bus.estimatedArrival}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No buses found matching your search.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="lg:col-span-2 animate-slide-right">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Buses Around You</h2>
                <button 
                  onClick={() => setIsMapFullscreen(true)}
                  className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <Maximize className="h-4 w-4 mr-1" />
                  Fullscreen
                </button>
              </div>
              <div className="h-[400px] md:h-[500px] relative rounded-lg overflow-hidden shadow-lg">
                <button
                  onClick={() => setIsMapFullscreen(true)}
                  className="absolute top-4 right-4 z-10 bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                  aria-label="Maximize map"
                >
                  <Maximize className="h-5 w-5 text-gray-700" />
                </button>
                <BusMap
                  userLocation={userLocation}
                  buses={nearbyBuses}
                  selectedBus={selectedBus}
                  onBusSelect={handleBusSelect}
                  nearbyRadius={nearbyRadius}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-2 text-center">
                  <p className="text-gray-600">Showing {nearbyBuses.length} buses within {nearbyRadius} km</p>
                  {selectedBus && (
                    <p className="font-medium text-primary-600">
                      Bus {selectedBus.routeNumber} selected
                      {selectedBus.distanceFromUser && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({selectedBus.distanceFromUser.toFixed(1)} km away)
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={(query) => {
          setSearchQuery(query)
          setIsSearchModalOpen(false)
        }}
        buses={buses}
      />
    </>
  )
}

export default BusTracking