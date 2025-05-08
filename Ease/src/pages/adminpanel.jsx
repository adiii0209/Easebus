import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Bus, MapPin, Calendar, Users, ChevronRight, Settings, LogOut, Plus, Edit, Trash2, Search, Clock, DollarSign, BarChart2, X } from 'lucide-react'
import busData from '../../buses.js'
import adminProfileImage from '../assets/Easee.jpg'
import busService from '../services/BusService' // Import BusService for revenue data

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBus, setSelectedBus] = useState(null)
  const [showRevenueModal, setShowRevenueModal] = useState(false)
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

  // Render stat card
  const StatCard = ({ title, value, icon, className }) => (
    <div className={`card p-4 ${className || ''}`}>
      <div className="flex items-center">
        <div className={`mr-4 rounded-full p-3 ${title === 'Today\'s Revenue' ? 'bg-green-100 text-green-600' : 'bg-primary-100 text-primary-600'}`}>
          {icon}
        </div>
        <div>
          <p className={`text-sm font-medium ${title === 'Today\'s Revenue' ? 'text-green-600' : 'text-gray-500'}`}>{title}</p>
          <h3 className={`text-2xl font-bold ${title === 'Today\'s Revenue' ? 'text-green-800' : 'text-gray-900'}`}>{value}</h3>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kolkata Transport Admin</h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage Kolkata's public transport system, routes, and view statistics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Admin Profile Card */}
        <div className="md:col-span-1">
          <div className="card p-6">
            <div className="flex flex-col items-center text-center">
              <img 
                src={admin.profileImage} 
                alt={`${admin.firstName} ${admin.lastName}`} 
                className="h-24 w-24 rounded-full object-cover"
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">{admin.firstName} {admin.lastName}</h2>
              <p className="text-gray-600">{admin.email}</p>
              <p className="text-sm text-gray-500">{admin.role}</p>
            </div>

            <div className="mt-6 divide-y divide-gray-200">
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className={`flex w-full items-center justify-between py-3 text-left ${activeTab === 'dashboard' ? 'text-primary-600' : 'hover:text-primary-600'}`}
              >
                <div className="flex items-center">
                  <User className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Dashboard</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button 
                onClick={() => setActiveTab('buses')} 
                className={`flex w-full items-center justify-between py-3 text-left ${activeTab === 'buses' ? 'text-primary-600' : 'hover:text-primary-600'}`}
              >
                <div className="flex items-center">
                  <Bus className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Buses</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button 
                onClick={() => setActiveTab('drivers')} 
                className={`flex w-full items-center justify-between py-3 text-left ${activeTab === 'drivers' ? 'text-primary-600' : 'hover:text-primary-600'}`}
              >
                <div className="flex items-center">
                  <User className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Drivers</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button 
                onClick={() => setActiveTab('routes')} 
                className={`flex w-full items-center justify-between py-3 text-left ${activeTab === 'routes' ? 'text-primary-600' : 'hover:text-primary-600'}`}
              >
                <div className="flex items-center">
                  <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Routes</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <Link to="/settings" className="flex items-center justify-between py-3 hover:text-primary-600">
                <div className="flex items-center">
                  <Settings className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Settings</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
              <Link to="/" className="flex items-center justify-between py-3 text-red-600 hover:text-red-700">
                <div className="flex items-center">
                  <LogOut className="mr-3 h-5 w-5" />
                  <span>Logout</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">System Overview</h2>
              
              <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Buses" value={stats.totalBuses} icon={<Bus className="h-6 w-6" />} />
                <StatCard title="Active Buses" value={stats.activeBuses} icon={<Bus className="h-6 w-6" />} />
                <StatCard title="Total Drivers" value={stats.totalDrivers} icon={<User className="h-6 w-6" />} />
                <StatCard title="Active Drivers" value={stats.activeDrivers} icon={<User className="h-6 w-6" />} />
                <StatCard title="Total Routes" value={stats.totalRoutes} icon={<MapPin className="h-6 w-6" />} />
                <StatCard title="Active Routes" value={stats.activeRoutes} icon={<MapPin className="h-6 w-6" />} />
                <StatCard title="Total Passengers" value={stats.totalPassengers} icon={<Users className="h-6 w-6" />} />
                <StatCard title="Daily Bookings" value={stats.dailyBookings} icon={<Calendar className="h-6 w-6" />} />
                <StatCard 
                  title="Today's Revenue" 
                  value={`₹${stats.dailyRevenue.toLocaleString()}`} 
                  icon={<DollarSign className="h-6 w-6" />} 
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg"
                />
                <StatCard title="Monthly Revenue" value={`₹${stats.monthlyRevenue.toLocaleString()}`} icon={<DollarSign className="h-6 w-6" />} />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="card p-4">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="mr-3 rounded-full bg-blue-100 p-2 text-blue-600">
                        <Bus className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">AC-2 Bus maintenance completed at Howrah Depot</p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 rounded-full bg-green-100 p-2 text-green-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">New driver Rajesh Kumar assigned to Salt Lake route</p>
                        <p className="text-sm text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 rounded-full bg-yellow-100 p-2 text-yellow-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">E-1 Route schedule updated for Sealdah Station</p>
                        <p className="text-sm text-gray-500">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card p-4">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">System Alerts</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="mr-3 rounded-full bg-red-100 p-2 text-red-600">
                        <Bus className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">S-2 Bus requires immediate maintenance at Gariahat Depot</p>
                        <p className="text-sm text-gray-500">High priority</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 rounded-full bg-yellow-100 p-2 text-yellow-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">AC-1 Route experiencing delays near Park Street</p>
                        <p className="text-sm text-gray-500">Medium priority</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 rounded-full bg-blue-100 p-2 text-blue-600">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">High passenger volume on E-1 Route at Esplanade</p>
                        <p className="text-sm text-gray-500">Low priority</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Buses, Drivers, Routes Tabs */}
          {(activeTab === 'buses' || activeTab === 'drivers' || activeTab === 'routes') && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeTab === 'buses' && 'Manage Buses'}
                  {activeTab === 'drivers' && 'Manage Drivers'}
                  {activeTab === 'routes' && 'Manage Routes'}
                </h2>
                <button className="btn btn-primary flex items-center">
                  <Plus className="mr-1 h-4 w-4" />
                  <span>Add {activeTab === 'buses' ? 'Bus' : activeTab === 'drivers' ? 'Driver' : 'Route'}</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                {activeTab === 'buses' && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Bus Number</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Model</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Current Route</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Driver</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total Revenue</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredItems.map((bus) => (
                        <tr key={bus.id}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{bus.busNumber}</div>
                            <div className="text-sm text-gray-500">Capacity: {bus.capacity}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{bus.model}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${bus.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {bus.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{bus.currentRoute}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{bus.driver}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{`₹${bus.totalRevenue?.toLocaleString() || 'N/A'}`}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => viewBusRevenue(bus)}
                                className="text-green-600 hover:text-green-900"
                                title="View Revenue Details"
                              >
                                <BarChart2 className="h-4 w-4" />
                              </button>
                              <button className="text-primary-600 hover:text-primary-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'drivers' && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Current Route</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Rating</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredItems.map((driver) => (
                        <tr key={driver.id}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                            <div className="text-sm text-gray-500">{driver.phone}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-900">{driver.employeeId}</div>
                            <div className="text-sm text-gray-500">{driver.licenseNumber}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${driver.status === 'On Duty' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {driver.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{driver.currentRoute}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{driver.rating}/5</td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => viewBusRevenue(bus)}
                                className="text-green-600 hover:text-green-900"
                                title="View Revenue Details"
                              >
                                <BarChart2 className="h-4 w-4" />
                              </button>
                              <button className="text-primary-600 hover:text-primary-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'routes' && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Bus Number</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Route Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Stops</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Timings</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredItems.map((route) => (
                        <tr key={route.id}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{route.routeNumber}</div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-900">{route.routeName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-h-20 overflow-y-auto text-sm text-gray-500">
                              {route.stops.map((stop, index) => (
                                <div key={index} className="mb-1">
                                  {index === 0 ? '🚏 ' : index === route.stops.length - 1 ? '🏁 ' : '↓ '}{stop}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="mr-1 h-4 w-4" />
                              <div className="max-h-20 overflow-y-auto">
                                {route.timings.map((time, index) => (
                                  <div key={index} className="mb-1">{time}</div>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${route.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {route.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => viewBusRevenue(bus)}
                                className="text-green-600 hover:text-green-900"
                                title="View Revenue Details"
                              >
                                <BarChart2 className="h-4 w-4" />
                              </button>
                              <button className="text-primary-600 hover:text-primary-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revenue Modal */}
      {showRevenueModal && selectedBus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="card w-full max-w-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Revenue Details: {selectedBus.busNumber}
              </h2>
              <button 
                onClick={() => setShowRevenueModal(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Bus Model: {selectedBus.model}</p>
              <p className="text-sm text-gray-600">Current Route: {selectedBus.currentRoute}</p>
              <p className="text-sm text-gray-600">Total Revenue: <span className="font-medium text-green-600">₹{selectedBus.totalRevenue?.toLocaleString() || '0'}</span></p>
            </div>

            <h3 className="mb-2 text-lg font-medium text-gray-900">Revenue by Date</h3>
            
            {revenueByDate.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {revenueByDate.map((entry, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {new Date(entry.date).toLocaleDateString('en-IN', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-green-600">
                          ₹{entry.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-gray-500">No revenue data available for this bus.</p>
                <p className="mt-2 text-sm text-gray-400">Revenue data will appear here once trips are completed and fares are collected.</p>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setShowRevenueModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel