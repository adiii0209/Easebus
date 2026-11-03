import { useState } from 'react';
import { Bus, MapPin, Edit, Trash2, Plus, AlertTriangle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import busData from '../../buses.js';
import { PageHeader, Segmented, Sheet, AlertDialog, AlertAction, BusBadge, Pill, Reveal } from '../components/ui';

const FormField = ({ label, children }) => (
  <div>
    <label className="mb-1.5 block text-[13px] font-semibold text-gray-600">{label}</label>
    {children}
  </div>
)

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
    const upsert = (list) =>
      list.some(item => item.id === updatedItem.id)
        ? list.map(item => item.id === updatedItem.id ? updatedItem : item)
        : [...list, updatedItem];

    if (activeTab === 'buses') {
      setBuses(upsert(buses));
    } else {
      setRoutes(upsert(routes));
    }
    setEditModalOpen(false);
    toast.success(`${activeTab === 'buses' ? 'Bus' : 'Route'} saved`);
  };

  const handleConfirmDelete = () => {
    if (activeTab === 'buses') {
      setBuses(buses.filter(bus => bus.id !== editItem.id));
    } else {
      setRoutes(routes.filter(route => route.id !== editItem.id));
    }
    setConfirmModalOpen(false);
    toast.success(`${activeTab === 'buses' ? 'Bus' : 'Route'} deleted`);
  };

  const noun = activeTab === 'buses' ? 'bus' : 'route';
  const isNew = editItem && !(activeTab === 'buses' ? buses : routes).some(i => i.id === editItem.id);
  const set = (patch) => setEditItem({ ...editItem, ...patch });

  return (
    <>
      <PageHeader
        title="Fleet"
        subtitle="Manage buses and routes"
        back
        backTo="/admin"
        action={
          <button
            onClick={() => {
              setEditItem(activeTab === 'buses' ? {
                id: Date.now(),
                busId: '',
                type: 'Non-AC',
                capacity: 50,
                status: 'Active',
                maintenanceDate: new Date().toISOString().split('T')[0],
                route: ''
              } : {
                id: Date.now(),
                routeNumber: '',
                name: '',
                stops: [],
                startTime: '',
                endTime: '',
                fare: 25
              });
              setEditModalOpen(true);
            }}
            className="flex h-9 items-center gap-1 rounded-full bg-primary-600 pl-2.5 pr-3.5 text-sm font-semibold text-white transition active:scale-95"
          >
            <Plus className="h-4 w-4" strokeWidth={3} /> Add
          </button>
        }
      />

      <div className="mx-auto max-w-3xl space-y-4 px-4 pb-10">
        <Segmented
          id="mgmt-tabs"
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { value: 'buses', label: 'Buses', icon: <Bus className="h-4 w-4" />, badge: buses.length },
            { value: 'routes', label: 'Routes', icon: <MapPin className="h-4 w-4" />, badge: routes.length },
          ]}
        />

        <div className="list-group" key={activeTab}>
          {activeTab === 'buses'
            ? buses.map((bus, i) => (
                <Reveal key={bus.id} index={i}>
                  <div className="list-row py-3.5">
                    <BusBadge id={bus.busId || '—'} />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[15px] font-semibold text-gray-900">{bus.route || 'No route assigned'}</h3>
                      <p className="mt-0.5 text-[13px] text-gray-500">{bus.type} · {bus.capacity} seats</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Pill tone={bus.status === 'Active' ? 'green' : 'red'}>{bus.status}</Pill>
                        <span className="truncate text-xs text-gray-400">Serviced {bus.maintenanceDate}</span>
                      </div>
                    </div>
                    <button onClick={() => handleEdit(bus)} className="icon-btn text-primary-600" aria-label="Edit bus"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(bus)} className="icon-btn text-red-500" aria-label="Delete bus"><Trash2 className="h-5 w-5" /></button>
                  </div>
                </Reveal>
              ))
            : routes.map((route, i) => (
                <Reveal key={route.id} index={i}>
                  <div className="list-row py-3.5">
                    <BusBadge id={route.routeNumber || '—'} />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[15px] font-semibold text-gray-900">{route.name || 'Untitled route'}</h3>
                      <p className="mt-0.5 flex items-center gap-1 text-[13px] text-gray-500">
                        <Clock className="h-3 w-3" /> {route.startTime || '—'} – {route.endTime || '—'}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">{route.stops.length} stops · <span className="font-semibold text-emerald-600">₹{route.fare}</span></p>
                    </div>
                    <button onClick={() => handleEdit(route)} className="icon-btn text-primary-600" aria-label="Edit route"><Edit className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(route)} className="icon-btn text-red-500" aria-label="Delete route"><Trash2 className="h-5 w-5" /></button>
                  </div>
                </Reveal>
              ))}
        </div>
      </div>

      {/* Edit sheet */}
      <Sheet
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`${isNew ? 'New' : 'Edit'} ${noun}`}
        footer={
          <div className="flex gap-2.5">
            <button className="btn btn-outline btn-lg flex-1" onClick={() => setEditModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary btn-lg flex-[2]" onClick={() => handleSave(editItem)}>Save changes</button>
          </div>
        }
      >
        <div className="space-y-4">
          {activeTab === 'buses' ? (
            <>
              <FormField label="Bus ID">
                <input type="text" className="input" value={editItem?.busId || ''} onChange={(e) => set({ busId: e.target.value })} placeholder="e.g. AC-3" />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Type">
                  <select className="input" value={editItem?.type || ''} onChange={(e) => set({ type: e.target.value })}>
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                  </select>
                </FormField>
                <FormField label="Capacity">
                  <input type="number" inputMode="numeric" className="input" value={editItem?.capacity || ''} onChange={(e) => set({ capacity: parseInt(e.target.value) })} />
                </FormField>
              </div>
              <FormField label="Status">
                <select className="input" value={editItem?.status || ''} onChange={(e) => set({ status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </FormField>
              <FormField label="Maintenance date">
                <input type="date" className="input" value={editItem?.maintenanceDate || ''} onChange={(e) => set({ maintenanceDate: e.target.value })} />
              </FormField>
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                <FormField label="Route no.">
                  <input type="text" className="input" value={editItem?.routeNumber || ''} onChange={(e) => set({ routeNumber: e.target.value })} />
                </FormField>
                <div className="col-span-2">
                  <FormField label="Name">
                    <input type="text" className="input" value={editItem?.name || ''} onChange={(e) => set({ name: e.target.value })} />
                  </FormField>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Start time">
                  <input type="text" className="input" placeholder="8:00 AM" value={editItem?.startTime || ''} onChange={(e) => set({ startTime: e.target.value })} />
                </FormField>
                <FormField label="End time">
                  <input type="text" className="input" placeholder="10:00 PM" value={editItem?.endTime || ''} onChange={(e) => set({ endTime: e.target.value })} />
                </FormField>
              </div>
              <FormField label="Fare (₹)">
                <input type="number" inputMode="numeric" className="input" value={editItem?.fare || ''} onChange={(e) => set({ fare: parseInt(e.target.value) })} />
              </FormField>
            </>
          )}
        </div>
      </Sheet>

      {/* Delete confirmation */}
      <AlertDialog
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        tone="danger"
        icon={<AlertTriangle className="h-6 w-6" />}
        title={`Delete this ${noun}?`}
        message="This action cannot be undone."
        actions={
          <>
            <AlertAction onClick={() => setConfirmModalOpen(false)} tone="muted">Cancel</AlertAction>
            <AlertAction onClick={handleConfirmDelete} tone="danger" strong>Delete</AlertAction>
          </>
        }
      />
    </>
  );
};

export default ManagementPage;
