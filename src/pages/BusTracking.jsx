import { useState, useEffect, useMemo } from 'react'
import { Search, MapPin, Navigation, Maximize2, X, ChevronRight, LocateFixed, AlertCircle, Bus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import busService from '../services/BusService'
import BusMap from '../components/BusMap'
import SearchModal from '../components/SearchModal'
import { PageHeader, BusBadge, Pill, EmptyState, Spinner, Reveal } from '../components/ui'

const RADIUS_OPTIONS = [1, 2, 5, 10, 20]

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

  // Add simulated real-time data to each bus with coordinates closer to user location.
  // Memoised so markers don't jump around on every unrelated re-render.
  const enhancedBuses = useMemo(() => buses.map(bus => {
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
  }), [buses, userLocation])

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

  const hasLocationProblem = locationPermission === 'denied' || locationPermission === 'error' || locationPermission === 'unsupported'

  const mapSummary = (
    <div className="flex items-center gap-2 rounded-full bg-white/85 px-3.5 py-2 text-[13px] font-semibold text-gray-800 shadow-ios-float backdrop-blur-xl">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      {nearbyBuses.length} bus{nearbyBuses.length === 1 ? '' : 'es'} {userLocation ? `within ${nearbyRadius} km` : 'on the map'}
    </div>
  )

  return (
    <>
      <PageHeader title="Track" subtitle="Live buses around you" />

      <div className="mx-auto max-w-5xl px-4">
        {/* Search */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex h-12 w-full items-center gap-2.5 rounded-2xl bg-white px-3.5 text-left shadow-ios ring-1 ring-black/[0.03] transition active:scale-[0.99]"
        >
          <Search className="h-5 w-5 text-gray-400" />
          <span className={`flex-1 truncate text-[16px] ${searchQuery ? 'text-gray-900' : 'text-gray-400'}`}>
            {searchQuery || 'Search bus, route or stop'}
          </span>
          {searchQuery && (
            <span
              role="button"
              aria-label="Clear search"
              onClick={(e) => { e.stopPropagation(); setSearchQuery('') }}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-white"
            >
              <X className="h-3 w-3" strokeWidth={3.5} />
            </span>
          )}
        </button>

        {/* Location status */}
        <AnimatePresence initial={false}>
          {hasLocationProblem && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex items-start gap-3 rounded-2xl bg-amber-50 p-3.5 ring-1 ring-amber-200/70">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-amber-900">
                    {locationPermission === 'denied' ? 'Location access denied' : 'Location unavailable'}
                  </p>
                  <p className="mt-0.5 text-[13px] text-amber-800/80">{locationError}</p>
                  <button
                    onClick={requestLocationPermission}
                    disabled={isLoadingLocation}
                    className="btn btn-sm mt-2.5 bg-amber-500 text-white hover:bg-amber-600"
                  >
                    {isLoadingLocation ? <Spinner /> : <Navigation className="h-4 w-4" />}
                    {isLoadingLocation ? 'Locating…' : 'Try again'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          {isLoadingLocation && !hasLocationProblem && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex items-center gap-3 rounded-2xl bg-primary-50 p-3.5 text-[14px] font-medium text-primary-800">
                <Spinner className="h-5 w-5 text-primary-600" /> Finding your location…
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Radius chips */}
        <AnimatePresence initial={false}>
          {userLocation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="no-scrollbar -mx-4 mt-3 flex items-center gap-2 overflow-x-auto px-4 py-1">
                <span className="flex flex-shrink-0 items-center gap-1 pr-1 text-[13px] font-semibold text-gray-500">
                  <Navigation className="h-3.5 w-3.5" /> Radius
                </span>
                {RADIUS_OPTIONS.map((r) => (
                  <button key={r} onClick={() => setNearbyRadius(r)} className={`chip h-8 px-3.5 text-[13px] ${nearbyRadius === r ? 'chip-active' : ''}`}>
                    {r} km
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 grid gap-5 pb-4 lg:grid-cols-5">
          {/* Map */}
          <div className="lg:order-2 lg:col-span-3">
            <div className="relative h-[320px] overflow-hidden rounded-[28px] shadow-ios-lg ring-1 ring-black/5 md:h-[420px] lg:sticky lg:top-16 lg:h-[560px]">
              {!isMapFullscreen && (
                <BusMap
                  userLocation={userLocation}
                  buses={nearbyBuses}
                  selectedBus={selectedBus}
                  onBusSelect={handleBusSelect}
                  nearbyRadius={nearbyRadius}
                />
              )}
              <button
                onClick={() => setIsMapFullscreen(true)}
                className="icon-btn-glass absolute left-3 top-3 z-[800]"
                aria-label="Open fullscreen map"
              >
                <Maximize2 className="h-[18px] w-[18px]" />
              </button>
              <div className="pointer-events-none absolute inset-x-0 bottom-3 z-[800] flex justify-center">{mapSummary}</div>
            </div>
          </div>

          {/* Bus List */}
          <div className="lg:order-1 lg:col-span-2">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="section-label !mb-0">{userLocation ? 'Nearby buses' : 'Available buses'}</p>
              <span className="text-xs font-medium text-gray-400">{filteredBuses.length}</span>
            </div>
            {filteredBuses.length > 0 ? (
              <div className="list-group">
                {filteredBuses.map((bus, i) => (
                  <Reveal key={bus.id} index={i}>
                    <button className="list-row" onClick={() => handleBusSelect(bus)}>
                      <BusBadge id={bus.routeNumber} />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[15px] font-semibold text-gray-900">{bus.routeName}</h3>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-[13px] text-gray-500">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{bus.currentLocation}</span>
                          {userLocation && bus.distanceFromUser != null && (
                            <span className="flex-shrink-0 font-medium text-primary-600">· {bus.distanceFromUser.toFixed(1)} km</span>
                          )}
                        </p>
                      </div>
                      <div className="flex flex-shrink-0 flex-col items-end gap-1">
                        <span className="text-[15px] font-bold tabular text-gray-900">{bus.estimatedArrival}</span>
                        <Pill tone={bus.status === 'On Time' ? 'green' : 'amber'}>{bus.status}</Pill>
                      </div>
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-300" />
                    </button>
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="card">
                <EmptyState icon={Bus} title="No buses found" message="Nothing matches your search. Try a different bus number or stop." />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen map */}
      <AnimatePresence>
        {isMapFullscreen && (
          <motion.div
            className="fixed inset-0 z-[55] bg-surface"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <BusMap
              userLocation={userLocation}
              buses={nearbyBuses}
              selectedBus={selectedBus}
              onBusSelect={handleBusSelect}
              nearbyRadius={nearbyRadius}
            />
            <button
              onClick={() => setIsMapFullscreen(false)}
              className="absolute left-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-[800] flex h-10 items-center gap-1.5 rounded-full bg-white/85 pl-3 pr-4 text-sm font-semibold text-gray-800 shadow-ios-float backdrop-blur-xl transition active:scale-95"
              aria-label="Exit fullscreen"
            >
              <X className="h-4 w-4" strokeWidth={3} /> Done
            </button>
            <div className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] z-[800] flex flex-col items-center gap-2">
              {!userLocation && (
                <button onClick={requestLocationPermission} className="btn btn-primary btn-sm shadow-ios-float">
                  <LocateFixed className="h-4 w-4" /> Enable location
                </button>
              )}
              {mapSummary}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
