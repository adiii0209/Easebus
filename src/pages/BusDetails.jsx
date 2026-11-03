import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Clock, Bus, Navigation, ChevronLeft, Bell, BellRing, Star, AlertTriangle, Ticket, Users, Route } from 'lucide-react'
import toast from 'react-hot-toast'
import busService from '../services/BusService'
import BusMap from '../components/BusMap'
import SOSConfirmationModal from '../components/SOSConfirmationModal'
import { BusBadge, Pill, EmptyState } from '../components/ui'

const BusDetails = () => {
  const { busId } = useParams()
  const navigate = useNavigate()
  const [bus, setBus] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [alertSet, setAlertSet] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showSOSModal, setShowSOSModal] = useState(false)

  useEffect(() => {
    // Get the complete bus data from the service
    const fullBusData = busService.getBusById(busId)
    if (!fullBusData) return

    // Generate simulated real-time data with bus closer to user
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

    // Enhance bus data with real-time information
    setBus({
      ...fullBusData,
      id: fullBusData.busId,
      routeNumber: fullBusData.busId,
      routeName: fullBusData.route,
      currentLocation: fullBusData.stops[Math.floor(Math.random() * (fullBusData.stops.length - 1))],
      nextStop: fullBusData.stops[Math.floor(Math.random() * (fullBusData.stops.length - 1)) + 1],
      estimatedArrival: Math.floor(Math.random() * 15) + ' mins',
      status: Math.random() > 0.2 ? 'On Time' : 'Slight Delay',
      capacity: Math.floor(Math.random() * 80) + '%',
      coordinates: { lat: busLat, lng: busLng },
      distanceFromUser: distanceFromUser,
      allStops: fullBusData.stops
    })
  }, [busId, userLocation])

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

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => console.error('Error getting location:', error)
      )
    }
  }, [])

  const toggleAlert = () => {
    if (!alertSet) {
      setAlertSet(true)
      toast.success(`We’ll notify you when ${bus.routeNumber} nears ${bus.nextStop}`)
      // Here you would typically dispatch this to your notification system
      console.log('New alert notification:', {
        id: Date.now(),
        type: 'info',
        title: `Bus ${bus.routeNumber} Alert Set`,
        message: `You will be notified when bus ${bus.routeNumber} is approaching ${bus.nextStop}.`,
        time: 'Just now',
        isRead: false
      })
    } else {
      setAlertSet(false)
      toast('Arrival alert cancelled')
    }
  }

  if (!busService.getBusById(busId)) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <EmptyState
          icon={Bus}
          title="Bus not found"
          message={`We couldn’t find a bus called “${busId}”.`}
          action={<Link to="/bus-tracking" className="btn btn-primary">Browse buses</Link>}
        />
      </div>
    )
  }

  if (!bus) {
    return (
      <div className="flex min-h-[100dvh] flex-col">
        <div className="skeleton h-[42dvh] rounded-none" />
        <div className="-mt-6 flex-1 space-y-3 rounded-t-[28px] bg-surface p-5">
          <div className="skeleton h-8 w-1/2" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-40 w-full" />
        </div>
      </div>
    )
  }

  const currentIndex = bus.allStops.indexOf(bus.currentLocation)
  const capacityPct = parseInt(bus.capacity, 10) || 0
  const capacityTone = capacityPct > 75 ? 'bg-red-500' : capacityPct > 50 ? 'bg-amber-500' : 'bg-green-500'

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      {/* Map */}
      <div className="relative h-[42dvh] min-h-[260px] w-full flex-none">
        <BusMap
          userLocation={userLocation}
          buses={[bus]}
          selectedBus={bus}
          nearbyRadius={3}
          onBusSelect={() => {}} // Add empty handler to ensure map centers on bus
        />
        <button
          onClick={() => navigate(-1)}
          className="icon-btn-glass absolute left-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-[800]"
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
        </button>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="icon-btn-glass absolute left-14 top-[calc(env(safe-area-inset-top)+0.75rem)] z-[800] ml-1"
          aria-label={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Star className={`h-5 w-5 transition-all duration-300 ease-ios ${isFavorite ? 'scale-110 fill-yellow-400 text-yellow-400' : ''}`} />
        </button>
      </div>

      {/* Details sheet */}
      <div className="relative z-10 -mt-6 flex-1 overflow-y-auto rounded-t-[28px] bg-surface shadow-[0_-8px_32px_rgba(16,24,40,0.12)]">
        <div className="mx-auto max-w-2xl px-4 pb-32 pt-3 animate-slide-up">
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-gray-300" />

          {/* Title */}
          <div className="flex items-center gap-3">
            <BusBadge id={bus.routeNumber} className="h-12 min-w-[52px] text-sm" />
            <div className="min-w-0 flex-1">
              <h1 className="line-clamp-2 text-xl font-bold leading-tight text-gray-900">{bus.routeName}</h1>
              <p className="mt-0.5 flex items-center gap-1 truncate text-[13px] text-gray-500">
                <MapPin className="h-3 w-3 flex-shrink-0" /> Now at {bus.currentLocation}
              </p>
            </div>
            <Pill tone={bus.status === 'On Time' ? 'green' : 'amber'} dot>{bus.status}</Pill>
          </div>

          {/* Key stats */}
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <div className="card p-3.5">
              <Clock className="h-[18px] w-[18px] text-primary-600" />
              <p className="mt-2 text-xl font-bold tabular text-gray-900">{bus.estimatedArrival}</p>
              <p className="text-xs text-gray-500">Arrival</p>
            </div>
            <div className="card p-3.5">
              <Users className="h-[18px] w-[18px] text-secondary-600" />
              <p className="mt-2 text-xl font-bold tabular text-gray-900">{bus.capacity}</p>
              <p className="text-xs text-gray-500">Full</p>
            </div>
            <div className="card p-3.5">
              <Navigation className="h-[18px] w-[18px] text-emerald-600" />
              <p className="mt-2 text-xl font-bold tabular text-gray-900">
                {userLocation && bus.distanceFromUser != null ? bus.distanceFromUser.toFixed(1) : '—'}
                <span className="ml-0.5 text-xs font-semibold text-gray-400">km</span>
              </p>
              <p className="text-xs text-gray-500">From you</p>
            </div>
          </div>

          {/* Occupancy bar */}
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-gray-200">
            <div className={`h-full rounded-full transition-all duration-700 ease-ios ${capacityTone}`} style={{ width: `${capacityPct}%` }} />
          </div>

          {/* Next stop */}
          <div className="card mt-4 flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <MapPin className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Next stop</p>
              <p className="truncate text-[16px] font-semibold text-gray-900">{bus.nextStop}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <button onClick={toggleAlert} className={`btn btn-lg ${alertSet ? 'btn-primary' : 'btn-tinted'}`}>
              {alertSet ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
              {alertSet ? 'Alert on' : 'Arrival alert'}
            </button>
            <button onClick={() => setShowSOSModal(true)} className="btn btn-lg bg-red-50 text-red-600 hover:bg-red-100">
              <AlertTriangle className="h-5 w-5" /> SOS
            </button>
          </div>

          {/* Route timeline */}
          <div className="mt-7">
            <p className="section-label flex items-center gap-1.5">
              <Route className="h-3.5 w-3.5" /> Full route · {bus.allStops.length} stops
            </p>
            <div className="card p-4">
              {bus.allStops.map((stop, index) => {
                const isCurrent = index === currentIndex
                const isPassed = index < currentIndex
                const isLast = index === bus.allStops.length - 1
                return (
                  <div key={index} className="relative flex gap-3.5">
                    {!isLast && (
                      <span className={`absolute left-[9px] top-5 h-[calc(100%-0.25rem)] w-0.5 rounded-full ${isPassed ? 'bg-primary-500' : 'bg-gray-200'}`} />
                    )}
                    <span className="relative z-10 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center">
                      {isCurrent ? (
                        <>
                          <span className="absolute h-5 w-5 animate-pulse-ring rounded-full bg-primary-400/60" />
                          <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 ring-4 ring-primary-100">
                            <Bus className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                          </span>
                        </>
                      ) : (
                        <span className={`h-3 w-3 rounded-full border-2 ${isPassed ? 'border-primary-500 bg-primary-500' : 'border-gray-300 bg-white'}`} />
                      )}
                    </span>
                    <div className={`flex-1 pb-5 text-[15px] ${isCurrent ? 'font-semibold text-primary-700' : isPassed ? 'text-gray-400' : 'text-gray-800'}`}>
                      {stop}
                      {isCurrent && <Pill tone="blue" className="ml-2 align-middle">Here now</Pill>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sticky booking bar */}
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-surface via-surface/95 to-transparent px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-8">
          <div className="pointer-events-auto mx-auto max-w-2xl">
            <Link
              to={`/ticket-booking?from=${encodeURIComponent(bus.currentLocation)}&to=${encodeURIComponent(bus.nextStop)}&busId=${encodeURIComponent(bus.busId)}`}
              state={{ from: 'bus-details' }}
              className="btn btn-primary btn-lg btn-block shadow-lg shadow-primary-600/30"
            >
              <Ticket className="h-5 w-5" /> Book tickets
            </Link>
          </div>
        </div>
      </div>

      <SOSConfirmationModal
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        onConfirm={() => {
          // In a real app, this would trigger an emergency response system
          setShowSOSModal(false)
          toast.success('SOS sent. Emergency services have been notified.', { duration: 5000 })
        }}
      />
    </div>
  )
}

export default BusDetails
