import { useEffect } from 'react'
import { X, Clock } from 'lucide-react'

const TimePickerModal = ({ isOpen, onClose, availableTimings, selectedTiming, onSelect }) => {
  // Handle click outside modal to close
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content with glassmorphism effect */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-500" />
            Select Departure Time
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {availableTimings.map((time) => (
            <button
              key={time}
              onClick={() => {
                onSelect(time)
                onClose()
              }}
              className={`
                py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200
                ${selectedTiming === time
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-105'
                  : 'bg-white/50 hover:bg-white/90 text-gray-700 hover:shadow-md'
                }
              `}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TimePickerModal