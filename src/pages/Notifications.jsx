import { useState } from 'react'
import { Bell, CheckCircle, AlertTriangle, Info, Clock, X, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Notifications = () => {
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

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'alert':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      case 'info':
      default:
        return <Info className="h-6 w-6 text-blue-500" />
    }
  }

  const getNotificationBgColor = (type, isRead) => {
    if (isRead) return 'bg-white'
    
    switch (type) {
      case 'success':
        return 'bg-green-50'
      case 'alert':
        return 'bg-yellow-50'
      case 'info':
      default:
        return 'bg-blue-50'
    }
  }

  const unreadCount = notifications.filter(notification => !notification.isRead).length

  const navigate = useNavigate()

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-3 md:px-6 transition-all duration-300 ease-in-out">
        <div className="mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
              <p className="text-xs text-gray-600">
                Stay updated with important information about your bus services.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-primary-600" />
            <h2 className="text-base font-semibold text-gray-900">Your Notifications</h2>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-800">
                {unreadCount} new
              </span>
            )}
          </div>
          
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`flex items-start p-3 transform transition-all duration-300 ease-in-out hover:bg-gray-50 ${getNotificationBgColor(notification.type, notification.isRead)}`}
              >
                <div className="mr-4 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                      <p className="mt-0.5 text-xs text-gray-600 line-clamp-2">{notification.message}</p>
                      <div className="mt-1.5 flex items-center text-xs text-gray-500">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{notification.time}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      {!notification.isRead && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                          aria-label="Mark as read"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                        aria-label="Delete notification"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Bell className="h-10 w-10 text-gray-300" />
            <h3 className="mt-3 text-base font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">You're all caught up! Check back later for updates.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications