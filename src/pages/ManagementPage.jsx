import { useState } from 'react';
import { Bus, MapPin, Edit, Trash2, Plus, AlertTriangle, Check, X } from 'lucide-react';
import busData from '../../buses.js';

const ManagementPage = () => {
  const [activeTab, setActiveTab] = useState('buses');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [buses, setBuses] = useState(busData.map((bus, index) => ({
    id: index + 1,
    busId: bus.busId,
    type: bus.busId.startsWith('AC-') ? 'AC' : 'Non-AC',
    capacity: bus.busId.startsWith('AC-') ? 45 : 50,
    status: 'Active',
    maintenanceDate: new Date().toISOString().split('T')[0],
    route: bus.route
  })));

  const [routes, setRoutes] = useState(busData.map((bus, index) => ({
    id: index + 1,
    routeNumber: bus.busId,
    name: bus.route,
    stops: bus.stops,
    startTime: bus.timings[0],
    endTime: bus.timings[bus.timings.length - 1],
    fare: bus.busId.startsWith('AC-') ? 40 : 25
  })));

  const handleEdit = (item) => {
    setEditItem(item);
    setEditModalOpen(true);
  };

  const handleDelete = (item) => {
    setEditItem(item);
    setConfirmModalOpen(true);
  };

  const handleSave = (updatedItem) => {
    if (activeTab === 'buses') {
      setBuses(buses.map(bus => bus.id === updatedItem.id ? updatedItem : bus));
    } else {
      setRoutes(routes.map(route => route.id === updatedItem.id ? updatedItem : route));
    }
    setEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (activeTab === 'buses') {
      setBuses(buses.filter(bus => bus.id !== editItem.id));
    } else {
      setRoutes(routes.filter(route => route.id !== editItem.id));
    }
    setConfirmModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Buses & Routes</h1>
        <p className="mt-2 text-gray-600">Edit and manage your fleet and route information</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setActiveTab('buses')}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 ${
            activeTab === 'buses'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Bus className="h-5 w-5" />
          <span>Buses</span>
        </button>
        <button
          onClick={() => setActiveTab('routes')}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 ${
            activeTab === 'routes'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <MapPin className="h-5 w-5" />
          <span>Routes</span>
        </button>
      </div>

      {/* Data Grid */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {activeTab === 'buses' ? (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Bus ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Maintenance Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Route</th>
                </>
              ) : (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Route Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Stops</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Start Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">End Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fare (₹)</th>
                </>
              )}
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {activeTab === 'buses'
              ? buses.map((bus) => (
                  <tr key={bus.id}>
                    <td className="whitespace-nowrap px-6 py-4">{bus.busId}</td>
                    <td className="whitespace-nowrap px-6 py-4">{bus.type}</td>
                    <td className="whitespace-nowrap px-6 py-4">{bus.capacity}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        bus.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {bus.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">{bus.maintenanceDate}</td>
                    <td className="whitespace-nowrap px-6 py-4">{bus.route}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(bus)}
                        className="mr-2 text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(bus)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              : routes.map((route) => (
                  <tr key={route.id}>
                    <td className="whitespace-nowrap px-6 py-4">{route.routeNumber}</td>
                    <td className="whitespace-nowrap px-6 py-4">{route.name}</td>
                    <td className="whitespace-nowrap px-6 py-4">{route.stops.length} stops</td>
                    <td className="whitespace-nowrap px-6 py-4">{route.startTime}</td>
                    <td className="whitespace-nowrap px-6 py-4">{route.endTime}</td>
                    <td className="whitespace-nowrap px-6 py-4">₹{route.fare}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(route)}
                        className="mr-2 text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(route)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Edit {activeTab === 'buses' ? 'Bus' : 'Route'} Information
                </h3>
                <div className="mt-4 space-y-4">
                  {activeTab === 'buses' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bus ID</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={editItem?.busId || ''}
                          onChange={(e) => setEditItem({ ...editItem, busId: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={editItem?.type || ''}
                          onChange={(e) => setEditItem({ ...editItem, type: e.target.value })}
                        >
                          <option value="AC">AC</option>
                          <option value="Non-AC">Non-AC</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Capacity</label>
                        <input
                          type="number"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={editItem?.capacity || ''}
                          onChange={(e) => setEditItem({ ...editItem, capacity: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={editItem?.status || ''}
                          onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                        >
                          <option value="Active">Active</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Maintenance Date</label>
                        <input
                          type="date"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={editItem?.maintenanceDate || ''}
                          onChange={(e) => setEditItem({ ...editItem, maintenanceDate: e.target.value })}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Route Number</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={editItem?.routeNumber || ''}
                          onChange={(e) => setEditItem({ ...editItem, routeNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={editItem?.name || ''}
                          onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input
                          type="time"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={editItem?.startTime || ''}
                          onChange={(e) => setEditItem({ ...editItem, startTime: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">End Time</label>
                        <input
                          type="time"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={editItem?.endTime || ''}
                          onChange={(e) => setEditItem({ ...editItem, endTime: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fare (₹)</label>
                        <input
                          type="number"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={editItem?.fare || ''}
                          onChange={(e) => setEditItem({ ...editItem, fare: parseInt(e.target.value) })}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleSave(editItem)}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Confirm Delete
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this {activeTab === 'buses' ? 'bus' : 'route'}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setConfirmModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => {
            setEditItem(activeTab === 'buses' ? {
              id: buses.length + 1,
              busId: '',
              type: 'Non-AC',
              capacity: 50,
              status: 'Active',
              maintenanceDate: new Date().toISOString().split('T')[0],
              route: ''
            } : {
              id: routes.length + 1,
              routeNumber: '',
              name: '',
              stops: [],
              startTime: '',
              endTime: '',
              fare: 25
            });
            setEditModalOpen(true);
          }}
          className="flex items-center space-x-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add New {activeTab === 'buses' ? 'Bus' : 'Route'}</span>
        </button>
      </div>
    </div>
  );
};

export default ManagementPage;