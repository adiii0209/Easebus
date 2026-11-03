import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Users, CreditCard, Wallet, Banknote, Clock, Search, Minus, Plus, Info, Check, ChevronRight, Home } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TimePickerModal from '../components/TimePickerModal'
import { PageHeader, PickerSheet, BusBadge, Spinner } from '../components/ui'
import busData from '../../buses.js'

const paymentMethods = [
  { id: 'card', label: 'Credit / Debit card', hint: 'Visa, Mastercard, RuPay', icon: CreditCard, tint: 'bg-primary-500' },
  { id: 'upi', label: 'UPI', hint: 'Google Pay, PhonePe, Paytm', icon: Wallet, tint: 'bg-secondary-500' },
  { id: 'cash', label: 'Cash', hint: 'Pay at the bus', icon: Banknote, tint: 'bg-emerald-500' },
]

const StepBar = ({ step }) => (
  <div className="mb-5 flex items-center gap-2 px-1">
    {['Journey', 'Payment', 'Ticket'].map((label, i) => (
      <div key={label} className="flex flex-1 flex-col gap-1.5">
        <div className="h-1 overflow-hidden rounded-full bg-gray-200">
          <div className={`h-full rounded-full bg-primary-600 transition-all duration-500 ease-ios ${i <= step ? 'w-full' : 'w-0'}`} />
        </div>
        <span className={`text-[11px] font-semibold transition-colors ${i <= step ? 'text-primary-700' : 'text-gray-400'}`}>{label}</span>
      </div>
    ))}
  </div>
)

const TicketBooking = () => {
  const [selectedBus, setSelectedBus] = useState('')
  const [busQuery, setBusQuery] = useState('')
  const [selectedPickup, setSelectedPickup] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [passengerCount, setPassengerCount] = useState(1)
  const [availableBuses, setAvailableBuses] = useState([])
  const [availableStops, setAvailableStops] = useState([])
  const [showFareDetails, setShowFareDetails] = useState(false)
  const [calculatedFare, setCalculatedFare] = useState(0)
  const [totalFare, setTotalFare] = useState(0)
  const [selectedTiming, setSelectedTiming] = useState('')
  const [availableTimings, setAvailableTimings] = useState([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [picker, setPicker] = useState(null) // 'pickup' | 'destination' | null
  const [showTimeModal, setShowTimeModal] = useState(false)

  // Get URL parameters
  const location = useLocation()
  const [searchResults, setSearchResults] = useState([])
  const [searchError, setSearchError] = useState('')

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Load available buses on component mount
  useEffect(() => {
    setAvailableBuses(busData)
  }, [])

  // Handle URL parameters with auto-selecting
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const busId = params.get('busId')

    if (busId) {
      const bus = busData.find(b => b.busId === busId)
      if (bus) {
        setSelectedBus(busId)
        setAvailableStops(bus.stops)
        setAvailableTimings(bus.timings)

        const from = params.get('from')
        const to = params.get('to')
        if (from && bus.stops.includes(from)) setSelectedPickup(from)
        if (to && bus.stops.includes(to)) setSelectedDestination(to)
      }
    }
  }, [location.search])

  // Handle bus search and selection
  const handleBusSearch = (query) => {
    setBusQuery(query)
    if (!query) {
      setSearchResults([])
      setSearchError('')
      return
    }

    const results = busData.filter(bus =>
      bus.busId.toLowerCase().includes(query.toLowerCase()) ||
      bus.route.toLowerCase().includes(query.toLowerCase())
    )

    if (results.length === 0) {
      setSearchError('No buses found matching your search')
    } else {
      setSearchError('')
    }

    setSearchResults(results)
  }

  // Update available stops when bus is selected
  useEffect(() => {
    if (selectedBus) {
      const bus = busData.find(b => b.busId === selectedBus)
      if (bus) {
        setAvailableStops(bus.stops)
        setAvailableTimings(bus.timings)

        // Only reset if no URL parameters are present
        const params = new URLSearchParams(location.search)
        if (!params.get('from') && !params.get('to')) {
          setSelectedPickup('')
          setSelectedDestination('')
          setSelectedTiming('')
        }
      }
    }
  }, [selectedBus, location.search])

  // Reset destination when pickup is selected, but only if destination is invalid
  useEffect(() => {
    if (selectedPickup && selectedDestination) {
      // Check if the destination comes after the pickup in the route
      const bus = busData.find(b => b.busId === selectedBus)
      if (bus) {
        const pickupIndex = bus.stops.indexOf(selectedPickup)
        const destinationIndex = bus.stops.indexOf(selectedDestination)

        // If destination comes before pickup or is the same stop, reset it
        if (destinationIndex <= pickupIndex) {
          setSelectedDestination('')
          setShowFareDetails(false)
        }
      }
    } else if (selectedPickup) {
      setShowFareDetails(false)
    }
  }, [selectedPickup, selectedDestination, selectedBus])

  // Calculate fare when all required fields are filled
  useEffect(() => {
    if (selectedBus && selectedPickup && selectedDestination) {
      calculateFare()
    }
  }, [selectedBus, selectedPickup, selectedDestination, passengerCount])

  // Function to calculate fare based on distance and passenger count
  const calculateFare = () => {
    const bus = busData.find(b => b.busId === selectedBus)
    if (!bus) return

    const pickupIndex = bus.stops.indexOf(selectedPickup)
    const destinationIndex = bus.stops.indexOf(selectedDestination)

    if (pickupIndex === -1 || destinationIndex === -1) return

    // Calculate distance (number of stops between pickup and destination)
    const stopsCount = destinationIndex - pickupIndex

    // Base fare calculation
    let baseFare = 0

    // Different fare calculation based on bus type
    if (selectedBus.startsWith('AC')) {
      // AC buses have higher fare
      baseFare = 20 + (stopsCount * 5)
    } else {
      // Regular buses
      baseFare = 10 + (stopsCount * 3)
    }

    setCalculatedFare(baseFare)
    setTotalFare(baseFare * passengerCount)
  }

  // Handle form submission
  const handleContinueBooking = (e) => {
    e.preventDefault()
    setShowFareDetails(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method)
  }

  // Process payment
  const processPayment = (e) => {
    e.preventDefault()
    setPaymentProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setBookingRef(`EB${Math.floor(100000 + Math.random() * 900000)}`)
      setPaymentProcessing(false)
      setPaymentSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 2000)
  }

  // Go back to booking form
  const goBackToBooking = () => {
    setShowFareDetails(false)
    setSelectedPaymentMethod('')
    setPaymentSuccess(false)
  }

  // Clear the chosen bus so a new one can be searched
  const changeBus = () => {
    setSelectedBus('')
    setBusQuery('')
    setSelectedPickup('')
    setSelectedDestination('')
    setSelectedTiming('')
    setAvailableStops([])
    setSearchResults([])
    setShowFareDetails(false)
  }

  const step = paymentSuccess ? 2 : showFareDetails ? 1 : 0
  const chosenBus = busData.find(b => b.busId === selectedBus)
  const destinationStops = availableStops.filter((_, index) => index > availableStops.indexOf(selectedPickup))
  const canContinue = selectedBus && selectedPickup && selectedDestination && selectedTiming
  const cameFromDetails = location.state?.from === 'bus-details'

  const summaryRows = [
    ['Bus', chosenBus ? `${selectedBus} · ${chosenBus.route}` : selectedBus],
    ['Departure', selectedTiming],
    ['From', selectedPickup],
    ['To', selectedDestination],
    ['Passengers', passengerCount],
  ]

  return (
    <>
      <PageHeader
        title={paymentSuccess ? 'Ticket' : showFareDetails ? 'Payment' : 'Tickets'}
        subtitle={paymentSuccess ? 'Your trip is booked' : showFareDetails ? 'Review fare and pay' : 'Book a seat in seconds'}
        back={cameFromDetails && step === 0}
      />

      <div className="mx-auto max-w-xl px-4">
        <StepBar step={step} />

        <AnimatePresence mode="wait" initial={false}>
          {paymentSuccess ? (
            /* ---------- Step 3: Confirmation ---------- */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="flex flex-col items-center pb-6 text-center"
            >
              <div className="relative mb-5 mt-2 flex h-20 w-20 animate-scale-in items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-green-400/50" />
                <svg className="relative h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" strokeDasharray="30" className="animate-check-draw" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Booking confirmed</h2>
              <p className="mb-6 mt-1 text-[15px] text-gray-500">Show this ticket to the conductor.</p>

              {/* Ticket */}
              <div className="relative w-full overflow-hidden rounded-3xl bg-white text-left shadow-ios-lg ring-1 ring-black/5">
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <BusBadge id={selectedBus} className="bg-white/20 text-white" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/70">{selectedTiming}</span>
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] uppercase tracking-wide text-white/60">From</p>
                      <p className="truncate text-lg font-bold">{selectedPickup}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 flex-shrink-0 text-white/60" />
                    <div className="min-w-0 flex-1 text-right">
                      <p className="text-[11px] uppercase tracking-wide text-white/60">To</p>
                      <p className="truncate text-lg font-bold">{selectedDestination}</p>
                    </div>
                  </div>
                </div>

                {/* perforation */}
                <div className="relative">
                  <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-surface" />
                  <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-surface" />
                  <div className="mx-5 border-t-2 border-dashed border-gray-200" />
                </div>

                <div className="grid grid-cols-3 gap-4 p-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">Passengers</p>
                    <p className="mt-0.5 text-[17px] font-bold text-gray-900">{passengerCount}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">Paid</p>
                    <p className="mt-0.5 text-[17px] font-bold text-primary-600">₹{totalFare.toFixed(0)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">Booking ref</p>
                    <p className="mt-0.5 text-[17px] font-bold tabular text-gray-900">{bookingRef}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex w-full flex-col gap-2.5">
                <Link to="/passenger-dashboard" className="btn btn-primary btn-lg btn-block">View my bookings</Link>
                <Link to="/" className="btn btn-tinted btn-lg btn-block"><Home className="h-5 w-5" /> Back to home</Link>
              </div>
            </motion.div>
          ) : !showFareDetails ? (
            /* ---------- Step 1: Journey ---------- */
            <motion.form
              key="journey"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              onSubmit={handleContinueBooking}
              className="space-y-5 pb-28"
            >
              {/* Bus */}
              <div>
                <p className="section-label">Bus</p>
                {chosenBus ? (
                  <div className="card flex items-center gap-3 p-3.5 animate-scale-in">
                    <BusBadge id={chosenBus.busId} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-gray-900">{chosenBus.route}</p>
                      <p className="text-[13px] text-gray-500">{chosenBus.stops.length} stops</p>
                    </div>
                    <button type="button" onClick={changeBus} className="btn btn-tinted btn-sm">Change</button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      className="input h-12 bg-white pl-10 shadow-ios ring-1 ring-black/[0.03]"
                      placeholder="Search by bus number or route"
                      value={busQuery}
                      onChange={(e) => handleBusSearch(e.target.value)}
                    />
                    {searchError && <p className="mt-2 px-1 text-[13px] text-red-500">{searchError}</p>}
                    {searchResults.length > 0 && busQuery && (
                      <div className="list-group mt-2 max-h-64 animate-scale-in overflow-y-auto">
                        {searchResults.map((bus) => (
                          <button
                            key={bus.busId}
                            type="button"
                            className="list-row"
                            onClick={() => {
                              setSelectedBus(bus.busId)
                              setSearchResults([])
                            }}
                          >
                            <BusBadge id={bus.busId} className="h-9 min-w-[40px] text-xs" />
                            <span className="min-w-0 flex-1 truncate text-[14px] text-gray-800">{bus.route}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Stops */}
              <div className={`transition-opacity duration-300 ${chosenBus ? 'opacity-100' : 'pointer-events-none opacity-40'}`}>
                <p className="section-label">Journey</p>
                <div className="card relative p-1.5">
                  <span className="absolute bottom-[2.6rem] left-[1.75rem] top-[2.6rem] -translate-x-1/2 border-l-2 border-dotted border-gray-300" />
                  <button type="button" onClick={() => setPicker('pickup')} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors active:bg-gray-50">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100"><span className="h-2.5 w-2.5 rounded-full bg-green-500" /></span>
                    <span className={`flex-1 truncate text-[16px] ${selectedPickup ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>{selectedPickup || 'Select pickup point'}</span>
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </button>
                  <div className="mx-3 h-px bg-gray-100" />
                  <button type="button" disabled={!selectedPickup} onClick={() => setPicker('destination')} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors active:bg-gray-50 disabled:opacity-50">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /></span>
                    <span className={`flex-1 truncate text-[16px] ${selectedDestination ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>{selectedDestination || 'Select destination'}</span>
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </button>
                </div>

                {/* Timing Selection - Only show after stops are selected */}
                <AnimatePresence initial={false}>
                  {selectedPickup && selectedDestination && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                      className="overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setShowTimeModal(true)}
                        className="card mt-3 flex w-full items-center gap-3 p-3.5 text-left transition active:scale-[0.99]"
                      >
                        <span className="icon-tile bg-amber-500"><Clock className="h-[18px] w-[18px]" /></span>
                        <span className="flex-1">
                          <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400">Departure</span>
                          <span className={`block text-[16px] ${selectedTiming ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>{selectedTiming || 'Select departure time'}</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-300" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <TimePickerModal
                  isOpen={showTimeModal}
                  onClose={() => setShowTimeModal(false)}
                  availableTimings={availableTimings}
                  selectedTiming={selectedTiming}
                  onSelect={setSelectedTiming}
                />
              </div>

              {/* Passenger Count - Always show */}
              <div>
                <p className="section-label">Passengers</p>
                <div className="card flex items-center gap-3 p-3.5">
                  <span className="icon-tile bg-secondary-500"><Users className="h-[18px] w-[18px]" /></span>
                  <span className="flex-1 text-[16px] font-medium text-gray-900">{passengerCount} passenger{passengerCount > 1 ? 's' : ''}</span>
                  <div className="flex items-center rounded-full bg-gray-100 p-1">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition active:scale-90 disabled:opacity-30"
                      onClick={() => setPassengerCount(prev => Math.max(prev - 1, 1))}
                      disabled={passengerCount <= 1}
                      aria-label="Fewer passengers"
                    >
                      <Minus className="h-4 w-4" strokeWidth={3} />
                    </button>
                    <span className="w-8 text-center text-[15px] font-bold tabular">{passengerCount}</span>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition active:scale-90 disabled:opacity-30"
                      onClick={() => setPassengerCount(prev => Math.min(prev + 1, 10))}
                      disabled={passengerCount >= 10}
                      aria-label="More passengers"
                    >
                      <Plus className="h-4 w-4" strokeWidth={3} />
                    </button>
                  </div>
                </div>
                <p className="mt-2 px-1 text-xs text-gray-500">Maximum 10 tickets are allowed per user.</p>
              </div>

              <div className="flex gap-3 rounded-2xl bg-primary-50/70 p-4 ring-1 ring-primary-100">
                <Info className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-primary-600" />
                <ul className="space-y-1.5 text-[13px] leading-snug text-primary-900/80">
                  <li>Cancellation of tickets is not applicable</li>
                  <li>The ticket is valid for only 30 minutes from the time of booking</li>
                  <li>Fare is commission-free and determined by the WBTC</li>
                </ul>
              </div>

            </motion.form>
          ) : (
            /* ---------- Step 2: Fare + payment ---------- */
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="space-y-5 pb-28"
            >
              <div>
                <button onClick={goBackToBooking} className="mb-4 flex items-center text-[15px] font-medium text-primary-600 transition active:opacity-50">
                  ← Edit journey
                </button>
                <p className="section-label">Fare details</p>
                <div className="list-group">
                  {summaryRows.map(([label, value]) => (
                    <div key={label} className="list-row justify-between py-2.5">
                      <span className="text-[14px] text-gray-500">{label}</span>
                      <span className="max-w-[65%] truncate text-right text-[14px] font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                  <div className="list-row justify-between bg-gray-50/70 py-2.5">
                    <span className="text-[14px] text-gray-500">Base fare</span>
                    <span className="text-[14px] font-semibold tabular text-gray-900">₹{calculatedFare.toFixed(2)} × {passengerCount}</span>
                  </div>
                  <div className="list-row justify-between py-3.5">
                    <span className="text-[16px] font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold tabular text-primary-600">₹{totalFare.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="section-label">Payment method</p>
                <div className="list-group" role="radiogroup">
                  {paymentMethods.map(({ id, label, hint, icon: Icon, tint }) => {
                    const active = selectedPaymentMethod === id
                    return (
                      <button key={id} type="button" role="radio" aria-checked={active} className="list-row py-3.5" onClick={() => handlePaymentMethodSelect(id)}>
                        <span className={`icon-tile h-10 w-10 rounded-xl ${tint}`}><Icon className="h-5 w-5" /></span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] font-semibold text-gray-900">{label}</span>
                          <span className="block text-[13px] text-gray-500">{hint}</span>
                        </span>
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200 ease-ios ${active ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                          <Check className={`h-3.5 w-3.5 text-white transition-transform duration-200 ${active ? 'scale-100' : 'scale-0'}`} strokeWidth={3.5} />
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky action bar lives outside the animated step containers so `fixed` stays viewport-relative */}
      {!paymentSuccess && (
        <div className="pointer-events-none fixed inset-x-0 bottom-tabbar z-40 px-4">
          <div className="pointer-events-auto mx-auto max-w-xl">
            {!showFareDetails ? (
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block shadow-lg shadow-primary-600/30"
                onClick={handleContinueBooking}
                disabled={!canContinue}
              >
                {canContinue ? `Get fare · ₹${totalFare}` : 'Get fare'}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block shadow-lg shadow-primary-600/30"
                onClick={processPayment}
                disabled={!selectedPaymentMethod || paymentProcessing}
              >
                {paymentProcessing ? (<><Spinner className="h-5 w-5" /> Processing…</>) : `Pay ₹${totalFare.toFixed(2)}`}
              </button>
            )}
          </div>
        </div>
      )}

      <PickerSheet
        isOpen={picker === 'pickup'}
        onClose={() => setPicker(null)}
        title="Pickup point"
        options={availableStops}
        value={selectedPickup}
        onSelect={(stop) => { setSelectedPickup(stop); setSelectedDestination('') }}
        placeholder="Search stops"
      />
      <PickerSheet
        isOpen={picker === 'destination'}
        onClose={() => setPicker(null)}
        title="Destination"
        options={destinationStops}
        value={selectedDestination}
        onSelect={setSelectedDestination}
        placeholder="Search stops"
      />
    </>
  )
}

export default TicketBooking
