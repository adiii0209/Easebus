import { useState } from 'react'
import { Bell, CheckCircle, AlertTriangle, Info, Trash2, BellOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader, Segmented, EmptyState } from '../components/ui'

const toneFor = (type) => {
  switch (type) {
    case 'success':
      return { icon: CheckCircle, tint: 'bg-emerald-500' }
    case 'alert':
      return { icon: AlertTriangle, tint: 'bg-amber-500' }
    case 'info':
    default:
      return { icon: Info, tint: 'bg-primary-500' }
  }
}

// One notification row: tap to mark read, swipe left (or tap the bin) to delete
const NotificationRow = ({ notification, onRead, onDelete }) => {
  const { icon: Icon, tint } = toneFor(notification.type)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0, transition: { duration: 0.25 } }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Revealed delete action */}
      <div className="absolute inset-0 flex items-center justify-end bg-red-500 pr-6 text-white">
        <Trash2 className="h-5 w-5" />
      </div>
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.5, right: 0 }}
        onDragEnd={(_, info) => (info.offset.x < -90 || info.velocity.x < -500) && onDelete(notification.id)}
        className="relative flex cursor-pointer items-start gap-3 bg-white p-4 shadow-ios ring-1 ring-black/[0.03]"
        onClick={() => !notification.isRead && onRead(notification.id)}
      >
        <span className={`icon-tile h-10 w-10 rounded-xl ${tint}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-[15px] leading-snug ${notification.isRead ? 'font-medium text-gray-700' : 'font-semibold text-gray-900'}`}>
              {notification.title}
            </h3>
            {!notification.isRead && <span className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary-500" />}
          </div>
          <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-gray-500">{notification.message}</p>
          <p className="mt-1.5 text-xs text-gray-400">{notification.time}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(notification.id) }}
          onPointerDownCapture={(e) => e.stopPropagation()}
          className="icon-btn -mr-2 -mt-1 hidden h-8 w-8 text-gray-300 hover:text-red-500 sm:inline-flex"
          aria-label="Delete notification"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </motion.div>
    </motion.div>
  )
}

const Notifications = () => {
  const [filter, setFilter] = useState('all')
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      title: 'Heavy Rain Alert',
      message: 'Due to monsoon rainfall in Kolkata, expect delays on routes through Salt Lake and Sector V.',
      time: '10 minutes ago',
      isRead: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Durga Puja Route Updates',
      message: 'Special bus services available from Sealdah to Kalighat. Frequency increased during evening hours.',
      time: '1 hour ago',
      isRead: false
    },
    {
      id: 3,
      type: 'alert',
      title: 'Traffic Diversion',
      message: 'Due to Metro construction at E.M. Bypass, buses diverted via Eastern Metropolitan Bypass. Expect 20-minute delays.',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: 4,
      type: 'success',
      title: 'New AC Route',
      message: 'New AC bus service launched from Howrah Station to Salt Lake Sector V via Park Street.',
      time: '1 day ago',
      isRead: true
    },
    {
      id: 5,
      type: 'info',
      title: 'Schedule Change',
      message: 'First bus timing from Garia to Esplanade changed to 5:30 AM starting tomorrow.',
      time: '2 days ago',
      isRead: true
    },
  ])

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    ))
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })))
  }

  const unreadCount = notifications.filter(notification => !notification.isRead).length
  const visible = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications

  return (
    <>
      <PageHeader
        title="Alerts"
        subtitle="Updates about your buses and routes"
        action={
          unreadCount > 0 && (
            <button onClick={markAllAsRead} className="px-2 text-[15px] font-medium text-primary-600 transition active:opacity-50">
              Read all
            </button>
          )
        }
      />

      <div className="mx-auto max-w-2xl px-4">
        <Segmented
          id="notif-filter"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'unread', label: 'Unread', badge: unreadCount },
          ]}
          className="mb-4"
        />

        {visible.length > 0 ? (
          <div className="space-y-2.5">
            <AnimatePresence initial={false}>
              {visible.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </AnimatePresence>
            <p className="pt-2 text-center text-xs text-gray-400 sm:hidden">Swipe left to delete</p>
          </div>
        ) : (
          <div className="card">
            <EmptyState
              icon={filter === 'unread' ? Bell : BellOff}
              title={filter === 'unread' ? 'All caught up' : 'No notifications'}
              message="You’re all caught up! Check back later for updates."
            />
          </div>
        )}
      </div>
    </>
  )
}

export default Notifications
