import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Bus, MapPin, Calendar, Users, ChevronRight, Settings, LogOut, Plus, Edit, Trash2, Search, Clock } from 'lucide-react'
import busData from '../../buses.js'
import adminProfileImage from '../assets/Easee.jpg'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock admin data
  const [admin] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@easebus.com',
    role: 'System Administrator',
    memberSince: 'January 2022',
    profileImage: adminProfileImage
  })

  // Mock statistics
  const [stats] = useState({
    totalBuses: 45,
    activeBuses: 38,
    totalDrivers: 52,
    activeDrivers: 48,
    totalRoutes: 25,
    activeRoutes: 20,
    totalPassengers: 12580,
    dailyBookings: 345
  })

  // Mock buses
  const [buses] = useState([
    {
      id: 1,
      busNumber: 'BUS-2023-101',
      model: 'Mercedes-Benz Citaro',
      capacity: 45,
      status: 'Active',
      currentRoute: '101 - Downtown Express',
      driver: 'Michael Johnson',
      lastMaintenance: '2023-05-15'
    },
    {
      id: 2,
      busNumber: 'BUS-2023-102',
      model: 'Volvo 7900',
      capacity: 50,
      status: 'Active',
      currentRoute: '202 - Airport Shuttle',
      driver: 'Sarah Williams',
      lastMaintenance: '2023-05-20'
    },
    {
      id: 3,
      busNumber: 'BUS-2023-103',
      model: 'MAN Lion\'s City',
      capacity: 45,
      status: 'Maintenance',
      currentRoute: 'N/A',
      driver: 'N/A',
      lastMaintenance: '2023-06-10'
    },
    {
      id: 4,
      busNumber: 'BUS-2023-104',
      model: 'Scania Citywide',
      capacity: 40,
      status: 'Active',
      currentRoute: '303 - University Line',
      driver: 'David Chen',
      lastMaintenance: '2023-05-25'
    },
  ])

  // Mock drivers
  const [drivers] = useState([
    {
      id: 1,
      name: 'Michael Johnson',
      employeeId: 'DRV-2023-1045',
      licenseNumber: 'CDL-123456789',
      status: 'On Duty',
      currentRoute: '101 - Downtown Express',
      phone: '(123) 456-7890',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Sarah Williams',
      employeeId: 'DRV-2023-1046',
      licenseNumber: 'CDL-987654321',
      status: 'On Duty',
      currentRoute: '202 - Airport Shuttle',
      phone: '(123) 456-7891',
      rating: 4.7
    },
    {
      id: 3,
      name: 'David Chen',
      employeeId: 'DRV-2023-1047',
      licenseNumber: 'CDL-456789123',
      status: 'On Duty',
      currentRoute: '303 - University Line',
      phone: '(123) 456-7892',
      rating: 4.9
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      employeeId: 'DRV-2023-1048',
      licenseNumber: 'CDL-789123456',
      status: 'Off Duty',
      currentRoute: 'N/A',
      phone: '(123) 456-7893',
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

  // Render stat card
  const StatCard = ({ title, value, icon }) => (
    <div className="card p-4">
      <div className="flex items-center">
        <div className="mr-4 rounded-full bg-primary-100 p-3 text-primary-600">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage buses, routes, drivers, and view system statistics
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
                        <p className="font-medium text-gray-900">Bus BUS-2023-103 maintenance completed</p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 rounded-full bg-green-100 p-2 text-green-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">New driver James Wilson added</p>
                        <p className="text-sm text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 rounded-full bg-yellow-100 p-2 text-yellow-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Route 505 schedule updated</p>
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
                        <p className="font-medium text-gray-900">Bus BUS-2023-105 requires maintenance</p>
                        <p className="text-sm text-gray-500">High priority</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 rounded-full bg-yellow-100 p-2 text-yellow-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Route 202 experiencing delays</p>
                        <p className="text-sm text-gray-500">Medium priority</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="mr-3 rounded-full bg-blue-100 p-2 text-blue-600">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">High passenger volume on Route 101</p>
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
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <div className="flex space-x-2">
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
    </div>
  )
}

export default AdminPanel