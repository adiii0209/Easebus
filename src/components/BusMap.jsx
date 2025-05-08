import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, Polyline } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './Map.css'
import busIcon from '../assets/bus-marker.svg'

// Component to automatically update map view when user location changes
const LocationUpdater = ({ center, zoom }) => {
  const map = useMap()
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        duration: 1,
        animate: true
      })
    }
  }, [center, zoom, map])
  
  return null
}

const BusMap = ({ 
  userLocation, 
  buses, 
  selectedBus, 
  onBusSelect,
  nearbyRadius = 5 // in km
}) => {
  // Function to create route coordinates from stops
  const createRouteCoordinates = (bus) => {
    if (!bus || !bus.stops) return [];
    
    // Generate coordinates for each stop (simulated for demo)
    // In a real app, these would come from your backend
    return bus.stops.map((stop, index) => {
      const baseCoords = bus.coordinates || { lat: 22.5726, lng: 88.3639 };
      // Create a path by slightly offsetting from the bus location
      return [
        baseCoords.lat + (index - bus.stops.length/2) * 0.005,
        baseCoords.lng + (index - bus.stops.length/2) * 0.005
      ];
    });
  };

  // Create custom icon for stops
  const createStopIcon = (isPickup) => {
    return divIcon({
      className: '',
      html: `
        <div class="${isPickup ? 'pickup-marker' : 'destination-marker'}">
          <div class="marker-dot"></div>
          <div class="marker-pulse"></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };
  const [mapCenter, setMapCenter] = useState([22.5726, 88.3639]) // Default center (Kolkata)
  const [mapZoom, setMapZoom] = useState(12)
  
  // Update map center based on user location or selected bus
  useEffect(() => {
    if (selectedBus?.coordinates) {
      setMapCenter([selectedBus.coordinates.lat, selectedBus.coordinates.lng])
      setMapZoom(14)
    } else if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng])
      setMapZoom(13)
    }
  }, [selectedBus, userLocation])
  
  // Create custom icon for buses
  const createBusIcon = (bus) => {
    // Use full bus number for display
    const busNumber = bus.routeNumber;
    
    return divIcon({
      className: '',
      html: `
        <div class="bus-icon-container ${selectedBus?.id === bus.id ? 'selected' : ''}">
          <img src="${busIcon}" class="bus-icon" alt="Bus" />
          <div class="bus-number">${busNumber}</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    })
  }

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* Back Button */}
      <Link to="/bus-tracking" className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors">
        <ArrowLeft className="h-5 w-5 text-gray-700" />
      </Link>
      <MapContainer 
        center={selectedBus?.coordinates ? [selectedBus.coordinates.lat, selectedBus.coordinates.lng] : mapCenter} 
        zoom={selectedBus ? 14 : mapZoom} 
        className="w-full h-full"
      >
        {/* Add custom styles for markers */}
        <style jsx>{`
          .pickup-marker, .destination-marker {
            position: relative;
            width: 20px;
            height: 20px;
          }
          .marker-dot {
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            top: 4px;
            left: 4px;
          }
          .pickup-marker .marker-dot {
            background: #22c55e;
          }
          .destination-marker .marker-dot {
            background: #ef4444;
          }
          .marker-pulse {
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
          .pickup-marker .marker-pulse {
            border: 2px solid #22c55e;
          }
          .destination-marker .marker-pulse {
            border: 2px solid #ef4444;
          }
          @keyframes pulse {
            0% { transform: scale(0.5); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
          }
        `}</style>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Dynamic location updater */}
        <LocationUpdater center={mapCenter} zoom={mapZoom} />
        
        {/* User location marker and radius */}
        {userLocation && (
          <>
            <Marker 
              position={[userLocation.lat, userLocation.lng]}
              icon={divIcon({
                className: '',
                html: '<div class="user-marker"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })}
            >
              <Popup>Your location</Popup>
            </Marker>
            
            <Circle 
              center={[userLocation.lat, userLocation.lng]}
              radius={nearbyRadius * 1000} // Convert km to meters
              className="user-radius"
            />
          </>
        )}
        
        {/* Route polylines and stop markers */}
        {selectedBus && (
          <>
            <Polyline
              positions={createRouteCoordinates(selectedBus)}
              color="#000000"
              weight={3}
              opacity={0.9}
            />
            {/* Pickup marker (first stop) */}
            {selectedBus.stops && selectedBus.stops.length > 0 && (
              <Marker
                position={createRouteCoordinates(selectedBus)[0]}
                icon={createStopIcon(true)}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-medium text-green-600">Pickup Point</p>
                    <p>{selectedBus.stops[0]}</p>
                  </div>
                </Popup>
              </Marker>
            )}
            {/* Destination marker (last stop) */}
            {selectedBus.stops && selectedBus.stops.length > 0 && (
              <Marker
                position={createRouteCoordinates(selectedBus)[selectedBus.stops.length - 1]}
                icon={createStopIcon(false)}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-medium text-red-600">Destination</p>
                    <p>{selectedBus.stops[selectedBus.stops.length - 1]}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </>
        )}

        {/* Bus markers */}
        {buses.map(bus => (
          <Marker 
            key={bus.id}
            position={[bus.coordinates.lat, bus.coordinates.lng]}
            icon={createBusIcon(bus)}
            eventHandlers={{
              click: () => onBusSelect(bus)
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-medium">{bus.routeNumber} - {bus.routeName}</p>
                <p>Current: {bus.currentLocation}</p>
                <p>Next: {bus.nextStop}</p>
                <p>ETA: {bus.estimatedArrival}</p>
                {userLocation && bus.distanceFromUser && (
                  <p className="text-primary-600 mt-1">{bus.distanceFromUser.toFixed(1)} km away</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {selectedBus && (
        <div className="text-center py-4 bg-white border-b border-gray-200">
          <h2 className="text-xl font-semibold">Bus No: {selectedBus.routeNumber}</h2>
          <p className="text-gray-600">Towards {selectedBus.stops[selectedBus.stops.length - 1]}</p>
        </div>
      )}
    </div>
  )
}

export default BusMap