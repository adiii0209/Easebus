import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Users, ChevronRight, ChevronDown, Settings, LogOut, Truck, IndianRupee, Play, Square, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import busData from '../../buses.js';
import busService from '../services/BusService';
import driverimage from '../assets/driver.jpg'
import { PageHeader, Sheet, Segmented, Pill, BusBadge, EmptyState, Spinner, Reveal } from '../components/ui'

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
  const [tab, setTab] = useState('assigned')
  const [expandedId, setExpandedId] = useState(null)

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
  const [startingId, setStartingId] = useState(null)
  const [showFareModal, setShowFareModal] = useState(false)
  const [currentFare, setCurrentFare] = useState('')
  const [routeToEnd, setRouteToEnd] = useState(null) // To store route info for modal

  const handleStartRoute = (route) => {
    setIsStartingRoute(true)
    setStartingId(route.id)

    // Simulate starting a route
    setTimeout(() => {
      setActiveRoute(route)
      setIsStartingRoute(false)
      setStartingId(null)
      toast.success(`Route ${route.routeNumber} started`)
    }, 1500)
  }

  const handleEndRoute = (route) => {
    setRouteToEnd(route); // Store the route that is being ended
    setShowFareModal(true); // Show fare input modal
  }

  const closeFareModal = () => {
    if (isStartingRoute) return
    setShowFareModal(false);
    setCurrentFare('');
    setRouteToEnd(null);
  }

  const submitFareAndEndRoute = () => {
    if (!currentFare || isNaN(parseFloat(currentFare)) || parseFloat(currentFare) < 0) {
      toast.error('Please enter a valid fare amount.');
      return;
    }
    setIsStartingRoute(true) // Use existing loading state for simplicity

    // Record revenue using BusService
    const today = new Date().toISOString().split('T')[0];
    // Ensure routeToEnd and its properties are defined before calling recordTripRevenue
    if (routeToEnd && routeToEnd.busId && routeToEnd.id) {
      busService.recordTripRevenue(routeToEnd.busId, routeToEnd.id.toString(), today, currentFare);
      console.log(`Fare collected for route ${routeToEnd.routeNumber} (Bus ID: ${routeToEnd.busId}): ₹${currentFare} on ${today}`);
    } else {
      console.error('Route data is incomplete for recording revenue:', routeToEnd);
      toast.error('Could not record revenue: incomplete route data.');
      setIsStartingRoute(false);
      return;
    }
    // In a real app, this data would ideally be persisted on a backend

    // Simulate API call and ending route
    setTimeout(() => {
      const endedRoute = { ...routeToEnd, status: 'Completed', fareCollected: parseFloat(currentFare) };
      setCompletedRoutes(prev => [...prev, endedRoute]);
      toast.success(`₹${currentFare} recorded for route ${routeToEnd.routeNumber}`);
      setActiveRoute(null);
      setShowFareModal(false);
      setCurrentFare('');
      setRouteToEnd(null);
      setIsStartingRoute(false);
      setTab('completed')
    }, 1500);
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <>
      <PageHeader title="Driver" subtitle="Your routes for today" back backTo="/" />

      <div className="mx-auto max-w-2xl space-y-5 px-4 pb-10">
        {/* Profile strip */}
        <div className="card flex items-center gap-3.5 p-4">
          <img src={driver.profileImage} alt={`${driver.firstName} ${driver.lastName}`} className="h-14 w-14 rounded-full object-cover shadow-ios ring-2 ring-white" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[17px] font-semibold text-gray-900">{driver.firstName} {driver.lastName}</h2>
            <p className="truncate text-[13px] text-gray-500">{driver.employeeId}</p>
            <p className="truncate text-xs text-gray-400">License {driver.licenseNumber}</p>
          </div>
          <Link to="/settings" className="icon-btn" aria-label="Settings"><Settings className="h-5 w-5 text-gray-500" /></Link>
          <Link to="/" className="icon-btn" aria-label="Log out"><LogOut className="h-5 w-5 text-red-500" /></Link>
        </div>

        {/* Active route */}
        <AnimatePresence>
          {activeRoute && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="relative overflow-hidden rounded-3xl bg-primary-700 p-5 text-white shadow-ios-lg"
            >
              <div className="relative flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                  </span>
                  In progress
                </span>
                <span className="flex items-center gap-1 text-[13px] text-white/80"><Users className="h-4 w-4" /> {activeRoute.passengers}</span>
              </div>

              <h2 className="relative mt-3 text-xl font-bold">{activeRoute.routeNumber} · {activeRoute.routeName}</h2>
              <p className="relative mt-1 flex items-center gap-1.5 text-[13px] text-white/75">
                <Clock className="h-3.5 w-3.5" /> {activeRoute.startTime} – {activeRoute.endTime}
                <span>·</span>
                <Truck className="h-3.5 w-3.5" /> {activeRoute.busId}
              </p>

              <div className="relative mt-4 flex items-center gap-2 text-[14px] font-medium">
                <span className="truncate">{activeRoute.startLocation}</span>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/60" />
                <span className="truncate">{activeRoute.endLocation}</span>
              </div>

              <div className="relative mt-4 max-h-36 space-y-2 overflow-y-auto rounded-2xl bg-black/10 p-3.5 no-scrollbar">
                {activeRoute.stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-2.5 text-[13px]">
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-white/70" />
                    <span className="flex-1 truncate">{stop}</span>
                    {index < activeRoute.timings.length && <span className="tabular text-white/60">{activeRoute.timings[index]}</span>}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleEndRoute(activeRoute)}
                disabled={isStartingRoute}
                className="btn btn-lg btn-block relative mt-4 bg-white text-red-600 hover:bg-red-50"
              >
                <Square className="h-4 w-4 fill-current" /> End route
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <Segmented
          id="driver-tabs"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'assigned', label: 'Assigned', badge: assignedRoutes.length },
            { value: 'completed', label: 'Completed', badge: completedRoutes.length },
          ]}
        />

        {/* Assigned Routes */}
        {tab === 'assigned' && (
          assignedRoutes.length > 0 ? (
            <div className="space-y-3">
              {assignedRoutes.map((route, i) => {
                const open = expandedId === route.id
                return (
                  <Reveal key={route.id} index={i}>
                    <div className="card overflow-hidden">
                      <div className="flex items-center gap-3 p-4">
                        <BusBadge id={route.routeNumber} />
                        <button className="min-w-0 flex-1 text-left" onClick={() => setExpandedId(open ? null : route.id)} aria-expanded={open}>
                          <h3 className="truncate text-[15px] font-semibold text-gray-900">{route.routeName}</h3>
                          <p className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-[13px] text-gray-500">
                            <Clock className="h-3 w-3" /> {route.startTime} – {route.endTime}
                            <ChevronDown className={`ml-1 h-3.5 w-3.5 transition-transform duration-300 ease-ios ${open ? 'rotate-180' : ''}`} />
                          </p>
                        </button>
                        {!activeRoute && (
                          <button onClick={() => handleStartRoute(route)} disabled={isStartingRoute} className="btn btn-primary btn-sm min-w-[84px]">
                            {startingId === route.id ? <Spinner /> : <><Play className="h-3.5 w-3.5 fill-current" /> Start</>}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 border-t border-dashed border-gray-200 bg-gray-50/60 px-4 py-2.5 text-[13px]">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                        <span className="truncate font-medium text-gray-700">{route.startLocation}</span>
                        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                        <span className="truncate font-medium text-gray-700">{route.endLocation}</span>
                        <span className="ml-auto flex flex-shrink-0 items-center gap-1 text-xs text-gray-400"><Users className="h-3 w-3" /> {route.passengers}</span>
                      </div>

                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-2 border-t border-gray-100 px-4 py-3">
                              {route.stops.map((stop, index) => (
                                <div key={index} className="flex items-center gap-3 text-[13px] text-gray-600">
                                  <span className="w-5 text-right text-xs tabular text-gray-400">{index + 1}</span>
                                  <span className="flex-1">{stop}</span>
                                  {index < route.timings.length && <span className="tabular text-gray-400">{route.timings[index]}</span>}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          ) : (
            <div className="card"><EmptyState icon={Calendar} title="No upcoming routes" message="You don’t have any upcoming routes assigned." /></div>
          )
        )}

        {/* Completed Routes */}
        {tab === 'completed' && (
          completedRoutes.length > 0 ? (
            <div className="space-y-3">
              {completedRoutes.map((route, i) => (
                <Reveal key={`${route.id}-${i}`} index={i}>
                  <div className="card overflow-hidden">
                    <div className="flex items-center gap-3 p-4">
                      <BusBadge id={route.routeNumber} />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[15px] font-semibold text-gray-900">{route.routeName}</h3>
                        <p className="mt-0.5 text-[13px] text-gray-500">{formatDate(route.date)} · {route.startTime} – {route.endTime}</p>
                      </div>
                      <Pill tone="green"><CheckCircle2 className="h-3 w-3" /> {route.status}</Pill>
                    </div>
                    <div className="flex items-center justify-between border-t border-dashed border-gray-200 bg-gray-50/60 px-4 py-2.5 text-[13px]">
                      <span className="flex items-center gap-1 text-gray-500"><Users className="h-3.5 w-3.5" /> {route.passengers} passengers</span>
                      <span className="flex items-center font-bold tabular text-emerald-600"><IndianRupee className="h-3.5 w-3.5" />{route.fareCollected?.toLocaleString()}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="card"><EmptyState icon={Clock} title="No completed routes" message="Routes you finish will show up here." /></div>
          )
        )}
      </div>

      {/* Fare sheet */}
      <Sheet
        isOpen={showFareModal && !!routeToEnd}
        onClose={closeFareModal}
        title="Fare collected"
        footer={
          <div className="flex gap-2.5">
            <button onClick={closeFareModal} disabled={isStartingRoute} className="btn btn-outline btn-lg flex-1">Cancel</button>
            <button onClick={submitFareAndEndRoute} disabled={isStartingRoute || !currentFare} className="btn btn-primary btn-lg flex-[2]">
              {isStartingRoute ? (<><Spinner className="h-5 w-5" /> Submitting…</>) : 'Submit & end route'}
            </button>
          </div>
        }
      >
        <p className="text-[14px] text-gray-500">
          {routeToEnd?.routeNumber} · {routeToEnd?.routeName}
        </p>
        <p className="text-xs text-gray-400">Bus {routeToEnd?.busId}</p>

        <label htmlFor="fareAmount" className="mt-5 block text-center text-[13px] font-semibold text-gray-500">Total fare (₹)</label>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-3xl font-semibold text-gray-300">₹</span>
          <input
            type="number"
            inputMode="decimal"
            id="fareAmount"
            name="fareAmount"
            value={currentFare}
            onChange={(e) => setCurrentFare(e.target.value)}
            className="input h-16 rounded-2xl pl-12 text-center text-3xl font-bold tabular"
            placeholder="0.00"
            min="0"
            step="0.01"
            autoFocus
          />
        </div>
      </Sheet>
    </>
  )
}

export default DriverDashboard
