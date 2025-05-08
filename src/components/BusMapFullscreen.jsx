import { ArrowLeft } from 'lucide-react'
import BusMap from './BusMap'

const BusMapFullscreen = ({ onClose, userLocation, buses, selectedBus, onBusSelect, nearbyRadius }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button 
          onClick={onClose}
          className="flex items-center text-gray-700 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        <h1 className="text-xl font-bold text-gray-900">Live Map</h1>
        <div className="w-10"></div> {/* Empty div for flex spacing */}
      </div>
      
      <div className="flex-1">
        <BusMap
          userLocation={userLocation}
          buses={buses}
          selectedBus={selectedBus}
          onBusSelect={onBusSelect}
          nearbyRadius={nearbyRadius}
        />
      </div>
    </div>
  )
}

export default BusMapFullscreen