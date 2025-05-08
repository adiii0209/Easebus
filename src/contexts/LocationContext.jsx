import { createContext, useContext, useState, useCallback } from 'react'

const LocationContext = createContext(null)

export function LocationProvider({ children }) {
  const [userLocation, setUserLocation] = useState(null)
  const [locationPermission, setLocationPermission] = useState('prompt')
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState(null)

  const requestLocationPermission = useCallback(async () => {
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
  }, [])

  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation || locationPermission !== 'granted') return

    const watchId = navigator.geolocation.watchPosition(
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

    return watchId
  }, [locationPermission])

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        locationPermission,
        isLoadingLocation,
        locationError,
        requestLocationPermission,
        startLocationTracking
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}