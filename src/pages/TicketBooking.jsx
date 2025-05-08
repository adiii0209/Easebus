import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Users, CreditCard, Wallet, DollarSign, ChevronLeft, Bus, MapPin, Clock } from 'lucide-react'
import busData from '../../buses.js'

const TicketBooking = () => {
  const [selectedBus, setSelectedBus] = useState('')
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
  const [showPickupDropdown, setShowPickupDropdown] = useState(false)
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false)

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
      }
    }
  }, [location.search])

  // Handle bus search and selection
  const handleBusSearch = (query) => {
    setSelectedBus(query)
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
      setPaymentProcessing(false)
      setPaymentSuccess(true)
    }, 2000)
  }
  
  // Go back to booking form
  const goBackToBooking = () => {
    setShowFareDetails(false)
    setSelectedPaymentMethod('')
    setPaymentSuccess(false)
  }

  return (
    <div className="container mx-auto px-3 py-3 page-transition">
      <div className="flex items-center mb-6">
        {location.state?.from === 'bus-details' && (
          <Link to={-1} className="mr-3">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </Link>
        )}
        <h1 className="text-lg font-semibold text-gray-900">Buy Bus Tickets</h1>
      </div>

      <div className="space-y-6">
        {paymentSuccess ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-8">Your ticket has been booked successfully</p>
          
          <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Bus Number</p>
                <p className="font-medium">{selectedBus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">{selectedTiming}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">{selectedPickup}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium">{selectedDestination}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Passengers</p>
                <p className="font-medium">{passengerCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium text-primary-600">₹{totalFare.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Booking Reference</p>
              <p className="text-lg font-semibold text-gray-900">EB{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          </div>
          
          <div className="space-x-4">
            <Link to="/passenger-dashboard" className="btn btn-primary">
              View My Bookings
            </Link>
            <Link to="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      ) : !showFareDetails ? (
          <form className="flex flex-col min-h-[calc(100vh-8rem)]">
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Route/Bus No</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Search by bus number or route"
                    value={selectedBus}
                    onChange={(e) => handleBusSearch(e.target.value)}
                  />
                  {searchResults.length > 0 && selectedBus && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                      {searchResults.map((bus) => (
                        <button
                          key={bus.busId}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                          onClick={() => {
                            setSelectedBus(bus.busId)
                            setSearchResults([])
                          }}
                        >
                          <div className="text-sm font-medium">{bus.busId}</div>
                          <div className="text-xs text-gray-500">{bus.route}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchError && (
                    <p className="mt-1 text-xs text-red-600">{searchError}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Pickup and Destination Stop</label>
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="relative">
                    {/* Pickup Stop */}
                    <div className="flex items-center mb-3">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          className="w-full ml-2 pl-2 pr-6 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 cursor-pointer"
                          placeholder="Select pickup point"
                          value={selectedPickup}
                          readOnly
                          onClick={() => setShowPickupDropdown(!showPickupDropdown)}
                        />
                        {showPickupDropdown && (
                          <div className="absolute z-20 w-full left-2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {availableStops.map((stop, index) => (
                              <button
                                key={index}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 text-sm"
                                onClick={() => {
                                  setSelectedPickup(stop);
                                  setShowPickupDropdown(false);
                                  setSelectedDestination('');
                                }}
                              >
                                {stop}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vertical Line */}
                    <div className="absolute left-2.5 top-8 bottom-8 w-[1px] bg-gray-300" />

                    {/* Destination Stop */}
                    <div className="flex items-center">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          className="w-full ml-2 pl-2 pr-6 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Select destination"
                          value={selectedDestination}
                          readOnly
                          disabled={!selectedPickup}
                          onClick={() => selectedPickup && setShowDestinationDropdown(!showDestinationDropdown)}
                        />
                        {showDestinationDropdown && selectedPickup && (
                          <div className="absolute z-20 w-full left-2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {availableStops
                              .filter((stop, index) => index > availableStops.indexOf(selectedPickup))
                              .map((stop, index) => (
                                <button
                                  key={index}
                                  className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 text-sm"
                                  onClick={() => {
                                    setSelectedDestination(stop);
                                    setShowDestinationDropdown(false);
                                  }}
                                >
                                  {stop}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timing Selection - Only show after stops are selected */}
                {selectedPickup && selectedDestination && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Departure Time</label>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                      <select
                        className="w-full pl-3 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-primary-500 focus:ring-primary-500 transition-colors"
                        value={selectedTiming}
                        onChange={(e) => setSelectedTiming(e.target.value)}
                      >
                        <option value="">Select departure time</option>
                        {availableTimings.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Passenger Count - Always show */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">No of Passengers</label>
                <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-base text-gray-900">{passengerCount} Passenger{passengerCount > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      type="button"
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors text-lg font-medium"
                      onClick={() => setPassengerCount(prev => Math.max(prev - 1, 1))}
                      disabled={passengerCount <= 1}
                    >
                      −
                    </button>
                    <button 
                      type="button"
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors text-lg font-medium"
                      onClick={() => setPassengerCount(prev => Math.min(prev + 1, 10))}
                      disabled={passengerCount >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">Maximum 10 tickets are allowed per user.</p>
              </div>

              <div className="bg-gray-150 p-3 rounded-lg space-y-1.5 border border-gray-200">
                <div className="flex items-start space-x-2">
                  <span className="text-gray-400">•</span>
                  <p className="text-xs text-gray-600">Cancellation of tickets is not applicable</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-gray-400">•</span>
                  <p className="text-xs text-gray-600">The ticket is valid for only 30 minutes from the time of booking</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-gray-400">•</span>
                  <p className="text-xs text-gray-600">Fare is commission-free and determined by the WBTC</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-6 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleContinueBooking}
                disabled={!selectedBus || !selectedPickup || !selectedDestination || !selectedTiming}
              >
                Get Fare
              </button>
            </div>
          </form>
        ) : (
          <div>
            {!paymentSuccess ? (
              <>
                <div className="flex items-center mb-4">
                  <button 
                    onClick={goBackToBooking}
                    className="flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    <span className="text-sm">Back to booking</span>
                  </button>
                </div>
                
                <h2 className="text-base font-semibold text-gray-900 mb-3">Fare Details</h2>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Bus</p>
                      <p className="text-sm font-medium">{selectedBus} - {busData.find(b => b.busId === selectedBus)?.route}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date & Time</p>
                      <p className="text-sm font-medium">{selectedTiming}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">From</p>
                      <p className="text-sm font-medium">{selectedPickup}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">To</p>
                      <p className="text-sm font-medium">{selectedDestination}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Passengers</p>
                      <p className="text-sm font-medium">{passengerCount}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">Base Fare</p>
                      <p className="text-sm font-medium">₹{calculatedFare.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center mt-1.5">
                      <p className="text-sm text-gray-600">Passengers</p>
                      <p className="text-sm font-medium">x {passengerCount}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
                      <p className="text-base font-semibold">Total Amount</p>
                      <p className="text-base font-semibold text-primary-600">₹{totalFare.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-base font-semibold text-gray-900 mb-3">Select Payment Method</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div 
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedPaymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}
                    onClick={() => handlePaymentMethodSelect('card')}
                  >
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-primary-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Credit/Debit Card</p>
                        <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedPaymentMethod === 'upi' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}
                    onClick={() => handlePaymentMethodSelect('upi')}
                  >
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5 text-primary-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium">UPI</p>
                        <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedPaymentMethod === 'cash' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}
                    onClick={() => handlePaymentMethodSelect('cash')}
                  >
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-primary-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Cash</p>
                        <p className="text-xs text-gray-500">Pay at the bus</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-3 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={processPayment}
                  disabled={!selectedPaymentMethod || paymentProcessing}
                >
                  {paymentProcessing ? 'Processing...' : 'Pay Now'}
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Ticket className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Booking Successful!</h2>
                <p className="text-sm text-gray-600 mb-6">Your ticket has been booked successfully.</p>
                <Link
                  to="/passenger-dashboard"
                  className="inline-block py-2 px-4 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View My Bookings
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TicketBooking
