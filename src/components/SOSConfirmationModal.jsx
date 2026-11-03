import { AlertTriangle } from 'lucide-react'
import { AlertDialog, AlertAction } from './ui'

const SOSConfirmationModal = ({ isOpen, onClose, onConfirm }) => (
  <AlertDialog
    isOpen={isOpen}
    onClose={onClose}
    tone="danger"
    icon={<AlertTriangle className="h-6 w-6" />}
    title="Send Emergency Alert?"
    message="This will send an SOS signal to emergency services and notify the nearest authorities. Only use this in case of a genuine emergency."
    actions={
      <>
        <AlertAction onClick={onClose} tone="muted">Cancel</AlertAction>
        <AlertAction onClick={onConfirm} tone="danger" strong>Send SOS</AlertAction>
      </>
    }
  />
)

export default SOSConfirmationModal
