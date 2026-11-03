import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, Polyline } from 'react-leaflet'
import { divIcon, DomEvent } from 'leaflet'
import { Plus, Minus, LocateFixed } from 'lucide-react'
import './Map.css'

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

// Zoom / recenter controls styled to match the app
const MapControls = ({ center, zoom }) => {
  const map = useMap()
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) DomEvent.disableClickPropagation(ref.current)
  }, [])

  return (
    <div ref={ref} className="map-controls">
      <button type="button" onClick={() => map.zoomIn()} aria-label="Zoom in"><Plus className="h-5 w-5" /></button>
      <button type="button" onClick={() => map.zoomOut()} aria-label="Zoom out"><Minus className="h-5 w-5" /></button>
      <button type="button" onClick={() => map.flyTo(center, zoom)} aria-label="Recenter"><LocateFixed className="h-[18px] w-[18px] text-primary-600" /></button>
    </div>
  )
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
          <div class="marker-pulse"></div>
          <div class="marker-dot"></div>
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
    const isSelected = selectedBus?.id === bus.id
    const isAC = String(bus.routeNumber).startsWith('AC')

    return divIcon({
      className: '',
      html: `<div class="bus-pin ${isAC ? 'ac' : ''} ${isSelected ? 'selected' : ''}">${bus.routeNumber}</div>`,
      iconSize: [44, 34],
      iconAnchor: [22, 34],
      popupAnchor: [0, -34]
    })
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={selectedBus?.coordinates ? [selectedBus.coordinates.lat, selectedBus.coordinates.lng] : mapCenter}
        zoom={selectedBus ? 14 : mapZoom}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dynamic location updater */}
        <LocationUpdater center={mapCenter} zoom={mapZoom} />
        <MapControls center={mapCenter} zoom={mapZoom} />

        {/* User location marker and radius */}
        {userLocation && (
          <>
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={divIcon({
                className: '',
                html: '<div class="user-marker"></div>',
                iconSize: [18, 18],
                iconAnchor: [9, 9]
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
              color="#0284c7"
              weight={5}
              opacity={0.85}
              lineCap="round"
              lineJoin="round"
            />
            {/* Pickup marker (first stop) */}
            {selectedBus.stops && selectedBus.stops.length > 0 && (
              <Marker
                position={createRouteCoordinates(selectedBus)[0]}
                icon={createStopIcon(true)}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold text-green-600">Pickup point</p>
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
                    <p className="font-semibold text-red-600">Destination</p>
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
                <p className="font-semibold">{bus.routeNumber} · {bus.routeName}</p>
                <p className="text-gray-500">Now at {bus.currentLocation}</p>
                <p className="text-gray-500">Next: {bus.nextStop}</p>
                <p className="mt-1 font-medium text-primary-600">ETA {bus.estimatedArrival}</p>
                {userLocation && bus.distanceFromUser && (
                  <p className="text-gray-500">{bus.distanceFromUser.toFixed(1)} km away</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default BusMap
