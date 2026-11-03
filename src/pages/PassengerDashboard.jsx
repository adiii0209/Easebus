import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Ticket, Clock, Calendar, CreditCard, ChevronRight, Settings, LogOut, User, ArrowRight, Bell, MapPin } from 'lucide-react'
import busData from '../../buses.js'
import passengerImage from '../assets/passenger.jpeg'
import { useAuth } from '../contexts/AuthContext'
import { PageHeader, Segmented, Pill, BusBadge, EmptyState, AlertDialog, AlertAction, Reveal } from '../components/ui'

const settingsItems = [
  { icon: User, label: 'Edit profile', to: '/profile', tint: 'bg-primary-500' },
  { icon: CreditCard, label: 'Payment methods', to: '/payment-methods', tint: 'bg-emerald-500' },
  { icon: Bell, label: 'Notifications', to: '/notifications', tint: 'bg-amber-500' },
  { icon: Settings, label: 'Settings', to: '/settings', tint: 'bg-gray-500' },
]

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

const TripCard = ({ booking, upcoming }) => (
  <div className="card overflow-hidden">
    <div className="flex items-center gap-3 p-4">
      <BusBadge id={booking.routeNumber} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold text-gray-900">{booking.routeName}</h3>
        <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-gray-500">
          <Calendar className="h-3 w-3" /> {formatDate(booking.date)}
          <span>·</span>
          <Clock className="h-3 w-3" /> {booking.departureTime}
        </p>
      </div>
      <Pill tone={upcoming ? 'green' : 'gray'} dot={upcoming}>{booking.status}</Pill>
    </div>
    <div className="flex items-center gap-2 border-t border-dashed border-gray-200 bg-gray-50/60 px-4 py-3 text-[13px]">
      <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
      <span className="truncate font-medium text-gray-700">{booking.from}</span>
      <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
      <span className="truncate font-medium text-gray-700">{booking.to}</span>
      <span className="ml-auto flex-shrink-0 text-xs tabular text-gray-400">{booking.bookingReference}</span>
    </div>
  </div>
)

const PassengerDashboard = () => {
  const { user: authUser, logout } = useAuth()
  const [tab, setTab] = useState('upcoming')
  const [confirmLogout, setConfirmLogout] = useState(false)

  // User data
  const [user] = useState({
    firstName: 'Xavier',
    lastName: '',
    email: 'xaviernutz@gmail.com',
    phone: '905173480',
    memberSince: 'January 2023',
    profileImage: passengerImage
  })

  // Upcoming bookings based on bus data
  const [upcomingBookings] = useState(
    busData.slice(0, 2).map((bus, index) => ({
      id: index + 1,
      routeNumber: bus.busId,
      routeName: bus.route,
      from: bus.stops[0],
      to: bus.stops[bus.stops.length - 1],
      date: new Date().toISOString().split('T')[0],
      departureTime: bus.timings[0],
      bookingReference: `EB${100458 + index}`,
      status: 'Confirmed'
    }))
  )

  // Travel history based on bus data
  const [travelHistory] = useState(
    busData.slice(2, 5).map((bus, index) => ({
      id: index + 1,
      routeNumber: bus.busId,
      routeName: bus.route,
      from: bus.stops[0],
      to: bus.stops[bus.stops.length - 1],
      date: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      departureTime: bus.timings[0],
      bookingReference: `EB${100450 + index}`,
      status: 'Completed'
    }))
  )

  const trips = tab === 'upcoming' ? upcomingBookings : travelHistory

  return (
    <>
      <PageHeader title="Profile" />

      <div className="mx-auto max-w-2xl space-y-6 px-4">
        {/* Identity */}
        <div className="card relative overflow-hidden p-5">
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-primary-600" />
          <div className="relative flex flex-col items-center pt-6 text-center">
            <img
              src={user.profileImage}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-24 w-24 rounded-full object-cover shadow-ios-lg ring-4 ring-white"
            />
            <h2 className="mt-3 text-xl font-bold text-gray-900">{authUser?.name || `${user.firstName} ${user.lastName}`.trim()}</h2>
            <p className="text-[14px] text-gray-500">{authUser?.email || user.email}</p>
            <p className="mt-1 text-xs text-gray-400">Member since {user.memberSince}</p>
          </div>

          <div className="mt-5 grid grid-cols-2 divide-x divide-gray-100 rounded-2xl bg-gray-50 py-3 text-center">
            {[
              ['Upcoming', upcomingBookings.length],
              ['Total trips', travelHistory.length + upcomingBookings.length],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xl font-bold tabular text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trips */}
        <section>
          <Segmented
            id="trips"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'upcoming', label: 'Upcoming', badge: upcomingBookings.length },
              { value: 'history', label: 'History' },
            ]}
            className="mb-3"
          />
          {trips.length > 0 ? (
            <div className="space-y-3" key={tab}>
              {trips.map((booking, i) => (
                <Reveal key={booking.id} index={i}>
                  <TripCard booking={booking} upcoming={tab === 'upcoming'} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="card">
              <EmptyState
                icon={tab === 'upcoming' ? Ticket : Clock}
                title={tab === 'upcoming' ? 'No upcoming bookings' : 'No travel history'}
                message={tab === 'upcoming' ? 'You don’t have any trips scheduled.' : 'You haven’t taken any trips with us yet.'}
                action={<Link to="/ticket-booking" className="btn btn-primary">Book a trip</Link>}
              />
            </div>
          )}
        </section>

        {/* Settings */}
        <section>
          <p className="section-label">Account</p>
          <div className="list-group">
            {settingsItems.map(({ icon: Icon, label, to, tint }) => (
              <Link key={label} to={to} className="list-row">
                <span className={`icon-tile ${tint}`}><Icon className="h-[18px] w-[18px]" /></span>
                <span className="flex-1 text-[16px] text-gray-900">{label}</span>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </Link>
            ))}
          </div>

          <div className="list-group mt-4">
            <button className="list-row" onClick={() => setConfirmLogout(true)}>
              <span className="icon-tile bg-red-500"><LogOut className="h-[18px] w-[18px]" /></span>
              <span className="flex-1 text-[16px] font-medium text-red-500">Log out</span>
            </button>
          </div>
        </section>
      </div>

      <AlertDialog
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        tone="danger"
        icon={<LogOut className="h-6 w-6" />}
        title="Log out?"
        message="You’ll need to sign in again to see your bookings."
        actions={
          <>
            <AlertAction onClick={() => setConfirmLogout(false)} tone="muted">Cancel</AlertAction>
            <AlertAction onClick={logout} tone="danger" strong>Log out</AlertAction>
          </>
        }
      />
    </>
  )
}

export default PassengerDashboard
