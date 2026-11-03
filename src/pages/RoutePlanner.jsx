import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowUpDown, Clock, ChevronDown, Ticket, Route as RouteIcon, Zap, Wallet, Shuffle, SearchX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import busService from '../services/BusService'
import RouteGraph from '../services/RouteGraph'
import { PageHeader, PickerSheet, Segmented, Pill, BusBadge, EmptyState, Spinner } from '../components/ui'

const getDurationMinutes = (duration) => {
  const hourMatch = duration.match(/(\d+)h/)
  const minuteMatch = duration.match(/(\d+)m/)
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0
  const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0
  return hours * 60 + minutes
}

const RoutePlanner = () => {
  const [routeParams, setRouteParams] = useState({
    from: '',
    to: '',
    preferences: 'fastest' // fastest, cheapest, fewest_transfers
  })
  const [searchResults, setSearchResults] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [allStops, setAllStops] = useState([])
  const [routeGraph, setRouteGraph] = useState(null)
  const [picker, setPicker] = useState(null) // 'from' | 'to' | null
  const resultsRef = useRef(null)

  // Initialize route graph and load stops
  useEffect(() => {
    setAllStops(busService.getAllStops())
    setRouteGraph(RouteGraph.fromBusService(busService))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setHasSearched(true)
    setSelectedRoute(null)

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
      sortedRoutes.sort((a, b) => getDurationMinutes(a.duration) - getDurationMinutes(b.duration))
    } else if (routeParams.preferences === 'cheapest') {
      sortedRoutes.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    } else if (routeParams.preferences === 'fewest_transfers') {
      sortedRoutes.sort((a, b) => a.transfers - b.transfers)
    }

    // Simulate API call with timeout
    setTimeout(() => {
      setSearchResults(sortedRoutes)
      setIsLoading(false)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
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

  const swapStops = () => {
    setRouteParams((p) => ({ ...p, from: p.to, to: p.from }))
  }

  const handleRouteSelect = (route) => {
    setSelectedRoute((current) => (current?.id === route.id ? null : route))
  }

  const getRouteLabel = (route) => {
    if (route.transfers === 0) return 'Direct'
    if (route.transfers === 1) return '1 transfer'
    return `${route.transfers} transfers`
  }

  const getRouteTagTone = (route) => {
    if (route.transfers === 0) return 'green'
    if (route.transfers === 1) return 'blue'
    return 'amber'
  }

  const minPrice = Math.min(...searchResults.map((r) => r.price))
  const minDuration = Math.min(...searchResults.map((r) => getDurationMinutes(r.duration)))
  const canSearch = routeParams.from && routeParams.to && routeParams.from !== routeParams.to

  return (
    <>
      <PageHeader title="Plan" subtitle="Find the best way across the city" />

      <div className="mx-auto max-w-2xl space-y-5 px-4">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="card relative p-1.5">
            {/* connector line */}
            <span className="absolute bottom-[3.1rem] left-[1.55rem] top-[3.1rem] w-px border-l-2 border-dotted border-gray-300" />
            <button type="button" onClick={() => setPicker('from')} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors active:bg-gray-50">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400">From</span>
                <span className={`block truncate text-[16px] ${routeParams.from ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>
                  {routeParams.from || 'Choose starting stop'}
                </span>
              </span>
            </button>
            <div className="mx-3 h-px bg-gray-100" />
            <button type="button" onClick={() => setPicker('to')} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors active:bg-gray-50">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400">To</span>
                <span className={`block truncate text-[16px] ${routeParams.to ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>
                  {routeParams.to || 'Choose destination'}
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={swapStops}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary-600 shadow-ios-float ring-1 ring-black/5 transition-transform duration-300 ease-ios active:rotate-180 active:scale-90"
              aria-label="Swap origin and destination"
            >
              <ArrowUpDown className="h-[18px] w-[18px]" />
            </button>
          </div>

          <Segmented
            id="pref"
            value={routeParams.preferences}
            onChange={(v) => setRouteParams({ ...routeParams, preferences: v })}
            options={[
              { value: 'fastest', label: 'Fastest', icon: <Zap className="h-3.5 w-3.5" /> },
              { value: 'cheapest', label: 'Cheapest', icon: <Wallet className="h-3.5 w-3.5" /> },
              { value: 'fewest_transfers', label: 'Fewer stops', icon: <Shuffle className="h-3.5 w-3.5" /> },
            ]}
          />

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={!canSearch || isLoading}>
            {isLoading ? <Spinner className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            {isLoading ? 'Finding routes…' : 'Find routes'}
          </button>
        </form>

        {/* Results */}
        <div ref={resultsRef} className="scroll-mt-16">
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div key={i} className="card space-y-3 p-4">
                  <div className="skeleton h-5 w-24" />
                  <div className="skeleton h-10 w-full" />
                  <div className="skeleton h-5 w-1/2" />
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <p className="section-label">{searchResults.length} route{searchResults.length > 1 ? 's' : ''} found</p>
              <div className="space-y-3">
                {searchResults.map((route, i) => {
                  const expanded = selectedRoute?.id === route.id
                  return (
                    <motion.div
                      key={route.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.07, ease: [0.32, 0.72, 0, 1] }}
                      className={`card overflow-hidden transition-shadow duration-300 ${expanded ? 'shadow-ios-lg ring-2 ring-primary-500/40' : ''}`}
                    >
                      <button className="block w-full p-4 text-left" onClick={() => handleRouteSelect(route)} aria-expanded={expanded}>
                        <div className="flex items-start justify-between">
                          <div className="flex flex-wrap gap-1.5">
                            <Pill tone={getRouteTagTone(route)}>{getRouteLabel(route)}</Pill>
                            {searchResults.length > 1 && route.price === minPrice && <Pill tone="green">Cheapest</Pill>}
                            {searchResults.length > 1 && getDurationMinutes(route.duration) === minDuration && <Pill tone="violet">Fastest</Pill>}
                          </div>
                          <span className="text-2xl font-bold tabular text-gray-900">₹{route.price}</span>
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                          <div>
                            <p className="text-lg font-bold tabular text-gray-900">{route.departureTime}</p>
                          </div>
                          <div className="flex flex-1 flex-col items-center">
                            <span className="text-xs font-semibold text-gray-500">{route.duration}</span>
                            <div className="relative my-1 h-0.5 w-full rounded-full bg-gray-200">
                              {route.buses.slice(1).map((_, idx) => (
                                <span
                                  key={idx}
                                  className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border-2 border-amber-400 bg-white"
                                  style={{ left: `${((idx + 1) / route.buses.length) * 100}%` }}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">{route.distance}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold tabular text-gray-900">{route.arrivalTime}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                            {route.buses.map((b, idx) => (
                              <BusBadge key={idx} id={b.routeNumber} className="h-7 min-w-0 rounded-lg px-2 text-xs" />
                            ))}
                          </div>
                          <ChevronDown className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ease-ios ${expanded ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-gray-100 bg-gray-50/60 p-4">
                              <p className="section-label flex items-center gap-1.5"><RouteIcon className="h-3.5 w-3.5" /> Journey</p>
                              <div>
                                {route.buses.map((bus, index) => (
                                  <div key={index} className="relative flex gap-3.5">
                                    {index < route.buses.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-0.5 rounded-full bg-primary-200" />}
                                    <span className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                                      {index + 1}
                                    </span>
                                    <div className="flex-1 pb-5">
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-[15px] font-semibold text-gray-900">Bus {bus.routeNumber}</h4>
                                        <span className="flex items-center gap-1 text-xs tabular text-gray-500">
                                          <Clock className="h-3 w-3" /> {bus.departureTime} → {bus.arrivalTime}
                                        </span>
                                      </div>
                                      <p className="mt-1 text-[13px] text-gray-500">
                                        <span className="font-medium text-gray-800">{bus.from}</span> to <span className="font-medium text-gray-800">{bus.to}</span>
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <Link
                                to={`/ticket-booking?busId=${encodeURIComponent(route.buses[0].routeNumber)}&from=${encodeURIComponent(route.buses[0].from)}&to=${encodeURIComponent(route.buses[0].to)}`}
                                className="btn btn-primary btn-block mt-1"
                              >
                                <Ticket className="h-[18px] w-[18px]" /> Book this route · ₹{route.price}
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ) : hasSearched ? (
            <div className="card">
              <EmptyState icon={SearchX} title="No routes found" message="We couldn’t connect those two stops. Try a nearby stop instead." />
            </div>
          ) : null}
        </div>
      </div>

      <PickerSheet
        isOpen={picker === 'from'}
        onClose={() => setPicker(null)}
        title="Starting stop"
        options={allStops}
        value={routeParams.from}
        onSelect={(stop) => setRouteParams((p) => ({ ...p, from: stop }))}
        placeholder="Search stops"
      />
      <PickerSheet
        isOpen={picker === 'to'}
        onClose={() => setPicker(null)}
        title="Destination"
        options={allStops}
        value={routeParams.to}
        onSelect={(stop) => setRouteParams((p) => ({ ...p, to: stop }))}
        placeholder="Search stops"
      />
    </>
  )
}

export default RoutePlanner
