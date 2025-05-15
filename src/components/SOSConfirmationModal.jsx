import { AlertTriangle, X } from 'lucide-react'

const SOSConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal with glassmorphism effect */}
      <div 
        className="relative w-11/12 max-w-md rounded-2xl
        bg-white/80 backdrop-blur-md
        border border-white/20
        shadow-xl
        p-6
        transform transition-all duration-300 ease-out
        animate-in fade-in slide-in-from-bottom-4"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Confirm Emergency Alert
          </h3>
          
          <p className="text-gray-600 mb-6">
            This will send an SOS signal to emergency services and notify the nearest authorities. Only use this in case of a genuine emergency.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Send SOS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SOSConfirmationModal