import { Check } from 'lucide-react'
import { Sheet } from './ui'

const TimePickerModal = ({ isOpen, onClose, availableTimings, selectedTiming, onSelect }) => (
  <Sheet isOpen={isOpen} onClose={onClose} title="Departure time">
    <div className="grid grid-cols-3 gap-2.5">
      {availableTimings.map((time) => {
        const active = selectedTiming === time
        return (
          <button
            key={time}
            type="button"
            onClick={() => {
              onSelect(time)
              onClose()
            }}
            className={`relative rounded-xl py-3 text-sm font-semibold tabular transition-all duration-200 ease-ios active:scale-95 ${
              active
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                : 'bg-white text-gray-800 shadow-ios ring-1 ring-black/[0.03] hover:bg-primary-50'
            }`}
          >
            {time}
            {active && <Check className="absolute right-1.5 top-1.5 h-3 w-3" strokeWidth={3.5} />}
          </button>
        )
      })}
    </div>
  </Sheet>
)

export default TimePickerModal
