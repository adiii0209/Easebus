import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Clock, Bus, Route, Ticket, Navigation, ArrowLeft, Bell } from 'lucide-react'
import busService from '../services/BusService'
import BusMap from '../components/BusMap'

const BusDetails = () => {
  const { busId } = useParams()
  const [bus, setBus] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [alertSet, setAlertSet] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

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

  if (!bus) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="text-center">
          <Bus className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Loading bus details...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in h-screen overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Map - Takes all available space above details */}
        <div className="relative h-[50vh] w-full">
          <BusMap
            userLocation={userLocation}
            buses={[bus]}
            selectedBus={bus}
            nearbyRadius={3}
            onBusSelect={() => {}} // Add empty handler to ensure map centers on bus
          />
        </div>

        {/* Bus Details */}
        <div className="flex-1 overflow-y-auto">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">  
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <button 
                  onClick={() => {
                    if (!alertSet) {
                      setAlertSet(true);
                      setAlertMessage('Alert set! You will be notified when the bus is approaching.');
                      // Add notification to the notifications list
                      const newNotification = {
                        id: Date.now(),
                        type: 'info',
                        title: `Bus ${bus.routeNumber} Alert Set`,
                        message: `You will be notified when bus ${bus.routeNumber} is approaching ${bus.nextStop}.`,
                        time: 'Just now',
                        isRead: false
                      };
                      // Here you would typically dispatch this to your notification system
                      console.log('New alert notification:', newNotification);
                    } else {
                      setAlertSet(false);
                      setAlertMessage('');
                    }
                  }}
                  className={`btn ${alertSet ? 'btn-primary' : 'btn-secondary'} px-4 py-2 text-xs w-full sm:w-auto whitespace-nowrap hover:bg-gray-200 transition-colors flex items-center justify-center`}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  {alertSet ? 'Cancel Alert' : 'Set Arrival Alert'}
                </button>
                <Link
                  to={`/ticket-booking?from=${encodeURIComponent(bus.currentLocation)}&to=${encodeURIComponent(bus.nextStop)}&busId=${encodeURIComponent(bus.busId)}`}
                  state={{ from: 'bus-details' }}
                  className="btn btn-primary px-4 py-2 text-xs flex items-center justify-center w-full sm:w-auto whitespace-nowrap hover:bg-primary-700 transition-colors"
                >
                  <Ticket className="mr-2 h-4 w-4" />
                  Book Tickets
                </Link>
              </div>
              {alertMessage && (
                <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  {alertMessage}
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Current Status</h3>
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    bus.status === 'On Time'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bus.status}
                  </span>
                  <span className="text-gray-900">{bus.capacity} Full</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Current Location</h3>
                <p className="mt-2 flex items-center text-gray-900">
                  <MapPin className="mr-1 h-4 w-4 text-gray-500" />
                  {bus.currentLocation}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Next Stop</h3>
                <p className="mt-2 flex items-center text-gray-900">
                  <MapPin className="mr-1 h-4 w-4 text-gray-500" />
                  {bus.nextStop}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Estimated Arrival</h3>
                <p className="mt-2 flex items-center text-gray-900">
                  <Clock className="mr-1 h-4 w-4 text-gray-500" />
                  {bus.estimatedArrival}
                </p>
              </div>

              {userLocation && bus.distanceFromUser && (
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Distance from You</h3>
                  <p className="mt-2 flex items-center text-gray-900">
                    <Navigation className="mr-1 h-4 w-4 text-gray-500" />
                    {bus.distanceFromUser.toFixed(1)} kilometers away
                  </p>
                </div>
              )}
            </div>

            {/* Complete Route */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Route className="mr-2 h-5 w-5 text-primary-600" />
                Complete Route
              </h3>
              <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-inner">
                <div className="space-y-3">
                  {bus.allStops.map((stop, index) => (
                    <div key={index} className="flex items-start hover:bg-white p-2 rounded-md transition-colors">
                      <div className="flex flex-col items-center mr-3">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center shadow-sm ${
                          stop === bus.currentLocation ? 'bg-primary-600 text-white' : 'bg-gray-200'
                        }`}>
                          {index + 1}
                        </div>
                        {index < bus.allStops.length - 1 && (
                          <div className="h-6 border-l border-gray-300 mx-auto"></div>
                        )}
                      </div>
                      <div className={`flex-1 pb-2 ${stop === bus.currentLocation ? 'font-medium text-primary-600' : 'text-gray-700'}`}>
                        {stop}
                        {stop === bus.currentLocation && (
                          <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full">
                            Current Location
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {alertMessage && (
                <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  {alertMessage}
                </div>
              )}
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}

export default BusDetails