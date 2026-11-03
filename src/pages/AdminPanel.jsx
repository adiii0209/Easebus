import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Bus, MapPin, Calendar, Users, ChevronRight, Settings, LogOut, Plus, Edit, Search, Clock, DollarSign, BarChart2, Clipboard, UserCheck, Route, Star } from 'lucide-react'
import busData from '../../buses.js'
import adminProfileImage from '../assets/Easee.jpg'
import busService from '../services/BusService' // Import BusService for revenue data
import { PageHeader, Sheet, Segmented, Pill, BusBadge, Avatar, EmptyState, Reveal } from '../components/ui'

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBus, setSelectedBus] = useState(null)
  const [showRevenueModal, setShowRevenueModal] = useState(false)
  const [showDailyTasksModal, setShowDailyTasksModal] = useState(false)
  const [revenueByDate, setRevenueByDate] = useState([])

  // Admin data for Kolkata transport system
  const [admin] = useState({
    firstName: 'Transport',
    lastName: 'Administrator',
    email: 'admin@kolkatabus.gov.in',
    role: 'Transport Administrator',
    memberSince: 'January 2022',
    profileImage: adminProfileImage
  })

  // Kolkata transport statistics
  const [stats, setStats] = useState({  // Changed to setStats to update with revenue
    totalBuses: busData.length,
    activeBuses: busData.length - 2, // Assuming 2 buses in maintenance
    totalDrivers: busData.length + 5, // Extra drivers for rotation
    activeDrivers: busData.length,
    totalRoutes: busData.length,
    activeRoutes: busData.length - 1,
    totalPassengers: 15000,
    dailyBookings: 450,
    dailyRevenue: 0,
    monthlyRevenue: 0
  });

  // Kolkata revenue data (will be updated in useEffect)
  const [revenueData] = useState({
    daily: Math.floor(Math.random() * 8000) + 3000, // Higher daily revenue for Kolkata routes
    monthly: Math.floor(Math.random() * 200000) + 80000, // Higher monthly revenue
  });

  // Initialize stats with revenue data and fetch real revenue data
  useEffect(() => {
    // Initialize with mock data first
    setStats(prevStats => ({
      ...prevStats,
      dailyRevenue: revenueData.daily,
      monthlyRevenue: revenueData.monthly
    }));

    // Get current date for daily revenue
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth() + 1; // 1-indexed month
    const currentYear = new Date().getFullYear();

    // Try to get real revenue data if available
    try {
      const dailyRev = busService.getDailyRevenue(today);
      const monthlyRev = busService.getMonthlyRevenue(currentYear, currentMonth);

      if (dailyRev > 0 || monthlyRev > 0) {
        setStats(prevStats => ({
          ...prevStats,
          dailyRevenue: dailyRev || prevStats.dailyRevenue,
          monthlyRevenue: monthlyRev || prevStats.monthlyRevenue
        }));
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  }, [revenueData]);

  // Kolkata bus fleet
  const [buses, setBuses] = useState(busData.map((bus, index) => ({
    id: index + 1,
    busNumber: bus.busId,
    model: bus.busId.startsWith('AC-') ? 'Volvo AC' : 'Ashok Leyland',
    capacity: bus.busId.startsWith('AC-') ? 45 : 50,
    status: Math.random() > 0.1 ? 'Active' : 'Maintenance',
    currentRoute: bus.route,
    driver: `Driver ${index + 1}`,
    lastMaintenance: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalRevenue: bus.busId.startsWith('AC-') ?
      Math.floor(Math.random() * 15000) + 8000 : // Higher revenue for AC buses
      Math.floor(Math.random() * 8000) + 4000 // Regular bus revenue
  })))

  // Mock drivers for Kolkata
  const [drivers] = useState([
    {
      id: 1,
      name: 'Raajesh Kumar',
      employeeId: 'DRV-2023-1045',
      licenseNumber: 'WB20230045789',
      status: 'On Duty',
      currentRoute: 'Howrah - Salt Lake via Sealdah',
      phone: '+91 98765 43210',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Amit Banerjee',
      employeeId: 'DRV-2023-1046',
      licenseNumber: 'WB20230045790',
      status: 'On Duty',
      currentRoute: 'Garia - Dunlop via Shyambazar',
      phone: '+91 98765 43211',
      rating: 4.7
    },
    {
      id: 3,
      name: 'Priya Chatterjee',
      employeeId: 'DRV-2023-1047',
      licenseNumber: 'WB20230045791',
      status: 'On Duty',
      currentRoute: 'Airport - Jadavpur via EM Bypass',
      phone: '+91 98765 43212',
      rating: 4.9
    },
    {
      id: 4,
      name: 'Sunil Das',
      employeeId: 'DRV-2023-1048',
      licenseNumber: 'WB20230045792',
      status: 'Off Duty',
      currentRoute: 'N/A',
      phone: '+91 98765 43213',
      rating: 4.6
    },
  ])

  // Initialize routes from busData
  const [routes] = useState(busData.map((bus, index) => ({
    id: index + 1,
    routeNumber: bus.busId,
    routeName: bus.route,
    startLocation: bus.stops[0],
    endLocation: bus.stops[bus.stops.length - 1],
    stops: bus.stops,
    timings: bus.timings,
    status: 'Active'
  })))

  // Filter function for search
  const filterItems = (items, query) => {
    if (!query) return items

    return items.filter(item => {
      // Different filtering logic based on item type
      if ('busNumber' in item) { // Bus
        return (
          item.busNumber.toLowerCase().includes(query.toLowerCase()) ||
          item.model.toLowerCase().includes(query.toLowerCase()) ||
          item.currentRoute.toLowerCase().includes(query.toLowerCase())
        )
      } else if ('employeeId' in item) { // Driver
        return (
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.employeeId.toLowerCase().includes(query.toLowerCase()) ||
          item.currentRoute.toLowerCase().includes(query.toLowerCase())
        )
      } else if ('routeNumber' in item) { // Route
        return (
          item.routeNumber.toLowerCase().includes(query.toLowerCase()) ||
          item.routeName.toLowerCase().includes(query.toLowerCase()) ||
          item.startLocation.toLowerCase().includes(query.toLowerCase()) ||
          item.endLocation.toLowerCase().includes(query.toLowerCase())
        )
      }
      return false
    })
  }

  // Get filtered items based on active tab and search query
  const getFilteredItems = () => {
    switch (activeTab) {
      case 'buses':
        return filterItems(buses, searchQuery)
      case 'drivers':
        return filterItems(drivers, searchQuery)
      case 'routes':
        return filterItems(routes, searchQuery)
      default:
        return []
    }
  }

  const filteredItems = getFilteredItems()

  // Function to view revenue details for a specific bus with mock data
  const viewBusRevenue = (bus) => {
    setSelectedBus(bus);

    // Generate mock revenue data for the last 7 days
    const mockRevenueData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Generate higher revenue for AC buses and peak days (Mon-Fri)
      const isAC = bus.model.includes('AC');
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      const isPeakDay = dayOfWeek > 0 && dayOfWeek < 6;

      const baseAmount = isAC ? 12000 : 8000;
      const peakMultiplier = isPeakDay ? 1.3 : 1;
      const randomVariation = 0.8 + Math.random() * 0.4; // 80-120% of base

      const amount = Math.floor(baseAmount * peakMultiplier * randomVariation);

      mockRevenueData.push({
        date: dateStr,
        amount: amount
      });
    }

    setRevenueByDate(mockRevenueData);
    setShowRevenueModal(true);
  };

  const maxRevenue = Math.max(1, ...revenueByDate.map((r) => r.amount))

  const dailyTasks = [
    { icon: UserCheck, title: 'Assign driver & conductor', text: 'Randomly or manually assign staff to buses', tint: 'bg-primary-500', to: '/assignment' },
    { icon: Route, title: 'Manage buses & routes', text: 'Update bus assignments and route schedules', tint: 'bg-secondary-500', to: '/management' },
    { icon: Clock, title: 'Schedule maintenance', text: 'Plan and track bus maintenance tasks', tint: 'bg-amber-500' },
    { icon: DollarSign, title: 'Finance management', text: 'Track payments, revenues, and expenses', tint: 'bg-emerald-500', to: '/finance' },
  ]

  const activity = [
    { icon: Bus, tint: 'bg-primary-500', title: 'AC-2 Bus maintenance completed at Howrah Depot', time: '2 hours ago' },
    { icon: User, tint: 'bg-emerald-500', title: 'New driver Rajesh Kumar assigned to Salt Lake route', time: '5 hours ago' },
    { icon: MapPin, tint: 'bg-amber-500', title: 'E-1 Route schedule updated for Sealdah Station', time: 'Yesterday' },
  ]

  const systemAlerts = [
    { icon: Bus, tint: 'bg-red-500', title: 'S-2 Bus requires immediate maintenance at Gariahat Depot', time: 'High priority' },
    { icon: MapPin, tint: 'bg-amber-500', title: 'AC-1 Route experiencing delays near Park Street', time: 'Medium priority' },
    { icon: Users, tint: 'bg-primary-500', title: 'High passenger volume on E-1 Route at Esplanade', time: 'Low priority' },
  ]

  const StatCard = ({ title, value, icon: Icon, tint }) => (
    <div className="card p-4">
      <span className={`icon-tile h-9 w-9 rounded-xl ${tint}`}><Icon className="h-[18px] w-[18px]" /></span>
      <p className="mt-3 text-2xl font-bold tabular tracking-tight text-gray-900">{value}</p>
      <p className="text-[13px] text-gray-500">{title}</p>
    </div>
  )

  const FeedList = ({ items }) => (
    <div className="list-group">
      {items.map(({ icon: Icon, tint, title, time }) => (
        <div key={title} className="list-row items-start py-3.5">
          <span className={`icon-tile ${tint}`}><Icon className="h-4 w-4" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium leading-snug text-gray-900">{title}</p>
            <p className="mt-0.5 text-xs text-gray-500">{time}</p>
          </div>
        </div>
      ))}
    </div>
  )

  const addLabel = activeTab === 'buses' ? 'Bus' : activeTab === 'drivers' ? 'Driver' : 'Route'

  return (
    <>
      <PageHeader
        title="Admin"
        subtitle="Kolkata Transport"
        back
        backTo="/"
        action={
          <button onClick={() => setShowDailyTasksModal(true)} className="flex h-9 items-center gap-1.5 rounded-full bg-primary-600 px-3.5 text-sm font-semibold text-white transition active:scale-95">
            <Clipboard className="h-4 w-4" /> Tasks
          </button>
        }
      />

      <div className="mx-auto max-w-5xl space-y-5 px-4 pb-10">
        {/* Profile strip */}
        <div className="card flex items-center gap-3 p-3.5">
          <img src={admin.profileImage} alt={`${admin.firstName} ${admin.lastName}`} className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-ios" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[16px] font-semibold text-gray-900">{admin.firstName} {admin.lastName}</h2>
            <p className="truncate text-[13px] text-gray-500">{admin.role}</p>
          </div>
          <Link to="/settings" className="icon-btn" aria-label="Settings"><Settings className="h-5 w-5 text-gray-500" /></Link>
          <Link to="/" className="icon-btn" aria-label="Log out"><LogOut className="h-5 w-5 text-red-500" /></Link>
        </div>

        <Segmented
          id="admin-tabs"
          value={activeTab}
          onChange={(v) => { setActiveTab(v); setSearchQuery('') }}
          options={[
            { value: 'dashboard', label: 'Overview' },
            { value: 'buses', label: 'Buses' },
            { value: 'drivers', label: 'Drivers' },
            { value: 'routes', label: 'Routes' },
          ]}
        />

        <div key={activeTab} className="animate-slide-up space-y-5">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-emerald-600 p-5 text-white shadow-ios">
                  <p className="text-[13px] font-medium text-white/75">Today’s revenue</p>
                  <p className="mt-1 text-4xl font-bold tabular tracking-tight">₹{stats.dailyRevenue.toLocaleString()}</p>
                </div>
                <div className="rounded-3xl bg-amber-500 p-5 text-white shadow-ios">
                  <p className="text-[13px] font-medium text-white/80">Monthly revenue</p>
                  <p className="mt-1 text-4xl font-bold tabular tracking-tight">₹{stats.monthlyRevenue.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard title="Total buses" value={stats.totalBuses} icon={Bus} tint="bg-primary-500" />
                <StatCard title="Active buses" value={stats.activeBuses} icon={Bus} tint="bg-emerald-500" />
                <StatCard title="Total drivers" value={stats.totalDrivers} icon={User} tint="bg-secondary-500" />
                <StatCard title="Active drivers" value={stats.activeDrivers} icon={User} tint="bg-emerald-500" />
                <StatCard title="Total routes" value={stats.totalRoutes} icon={MapPin} tint="bg-primary-500" />
                <StatCard title="Active routes" value={stats.activeRoutes} icon={MapPin} tint="bg-emerald-500" />
                <StatCard title="Passengers" value={stats.totalPassengers.toLocaleString()} icon={Users} tint="bg-amber-500" />
                <StatCard title="Daily bookings" value={stats.dailyBookings} icon={Calendar} tint="bg-rose-500" />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="section-label">Recent activity</p>
                  <FeedList items={activity} />
                </div>
                <div>
                  <p className="section-label">System alerts</p>
                  <FeedList items={systemAlerts} />
                </div>
              </div>
            </>
          )}

          {/* Buses, Drivers, Routes Tabs */}
          {(activeTab === 'buses' || activeTab === 'drivers' || activeTab === 'routes') && (
            <>
              <div className="flex gap-2.5">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="input bg-white pl-10 shadow-ios ring-1 ring-black/[0.03]"
                    placeholder={`Search ${activeTab}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button onClick={() => navigate('/management')} className="btn btn-primary" aria-label={`Add ${addLabel}`}>
                  <Plus className="h-5 w-5" strokeWidth={2.5} />
                  <span className="hidden sm:inline">Add {addLabel}</span>
                </button>
              </div>

              {filteredItems.length === 0 ? (
                <div className="card"><EmptyState icon={Search} title="No matches" message="Try a different search term." /></div>
              ) : (
                <div className="list-group">
                  {activeTab === 'buses' && filteredItems.map((bus, i) => (
                    <Reveal key={bus.id} index={i}>
                      <div className="list-row py-3.5">
                        <BusBadge id={bus.busNumber} />
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-[15px] font-semibold text-gray-900">{bus.currentRoute}</h3>
                          <p className="mt-0.5 text-[13px] text-gray-500">{bus.model} · {bus.capacity} seats</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Pill tone={bus.status === 'Active' ? 'green' : 'amber'}>{bus.status}</Pill>
                            <span className="truncate text-xs text-gray-400">{bus.driver} · <span className="font-semibold text-emerald-600">₹{bus.totalRevenue?.toLocaleString() || 'N/A'}</span></span>
                          </div>
                        </div>
                        <button onClick={() => viewBusRevenue(bus)} className="icon-btn text-emerald-600" title="View revenue details" aria-label="View revenue details"><BarChart2 className="h-5 w-5" /></button>
                        <button onClick={() => navigate('/management')} className="icon-btn text-primary-600" aria-label="Edit bus"><Edit className="h-5 w-5" /></button>
                      </div>
                    </Reveal>
                  ))}

                  {activeTab === 'drivers' && filteredItems.map((driver, i) => (
                    <Reveal key={driver.id} index={i}>
                      <div className="list-row py-3.5">
                        <Avatar name={driver.name} size="h-11 w-11" />
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-[15px] font-semibold text-gray-900">{driver.name}</h3>
                          <p className="mt-0.5 truncate text-[13px] text-gray-500">{driver.currentRoute}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Pill tone={driver.status === 'On Duty' ? 'green' : 'gray'}>{driver.status}</Pill>
                            <span className="flex items-center gap-1 truncate text-xs text-gray-400">
                              {driver.employeeId} · <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {driver.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}

                  {activeTab === 'routes' && filteredItems.map((route, i) => (
                    <Reveal key={route.id} index={i}>
                      <div className="list-row py-3.5">
                        <BusBadge id={route.routeNumber} />
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-[15px] font-semibold text-gray-900">{route.routeName}</h3>
                          <p className="mt-0.5 truncate text-[13px] text-gray-500">{route.startLocation} → {route.endLocation}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Pill tone={route.status === 'Active' ? 'green' : 'red'}>{route.status}</Pill>
                            <span className="truncate text-xs text-gray-400">{route.stops.length} stops · {route.timings.length} trips/day</span>
                          </div>
                        </div>
                        <button onClick={() => navigate('/management')} className="icon-btn text-primary-600" aria-label="Edit route"><Edit className="h-5 w-5" /></button>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Daily Tasks */}
      <Sheet isOpen={showDailyTasksModal} onClose={() => setShowDailyTasksModal(false)} title="Daily tasks">
        <div className="list-group">
          {dailyTasks.map(({ icon: Icon, title, text, tint, to }) => (
            <button
              key={title}
              className="list-row py-3.5"
              onClick={() => {
                setShowDailyTasksModal(false)
                if (to) navigate(to)
              }}
            >
              <span className={`icon-tile h-10 w-10 rounded-xl ${tint}`}><Icon className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-gray-900">{title}</span>
                <span className="block text-[13px] text-gray-500">{text}</span>
              </span>
              <ChevronRight className="h-5 w-5 text-gray-300" />
            </button>
          ))}
        </div>
      </Sheet>

      {/* Revenue */}
      <Sheet isOpen={showRevenueModal && !!selectedBus} onClose={() => setShowRevenueModal(false)} title={selectedBus ? `Revenue · ${selectedBus.busNumber}` : 'Revenue'} size="lg">
        {selectedBus && (
          <>
            <div className="card mb-5 p-4">
              <p className="text-[13px] text-gray-500">{selectedBus.model} · {selectedBus.currentRoute}</p>
              <p className="mt-1 text-3xl font-bold tabular tracking-tight text-emerald-600">₹{selectedBus.totalRevenue?.toLocaleString() || '0'}</p>
              <p className="text-xs text-gray-400">Total revenue</p>
            </div>

            <p className="section-label">Last 7 days</p>
            {revenueByDate.length > 0 ? (
              <div className="list-group">
                {revenueByDate.map((entry, index) => (
                  <div key={index} className="list-row flex-col items-stretch gap-2 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-gray-700">
                        {new Date(entry.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-[14px] font-semibold tabular text-emerald-600">₹{entry.amount.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-ios" style={{ width: `${(entry.amount / maxRevenue) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={BarChart2} title="No revenue yet" message="Revenue will appear once trips are completed and fares are collected." />
            )}
          </>
        )}
      </Sheet>
    </>
  )
}

export default AdminPanel
