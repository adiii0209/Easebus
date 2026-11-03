import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shuffle, Save, Clock, Sun, Sunset, Moon, User, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import busData from '../../buses.js';
import { PageHeader, Segmented, BusBadge, Pill, Spinner } from '../components/ui';

const AssignmentPage = () => {
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState('');
  const [activeTab, setActiveTab] = useState('morning');
  const [activeBuses, setActiveBuses] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableConductors, setAvailableConductors] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAssigning, setIsAssigning] = useState(false);

  // Get unique timings from all buses
  const availableTimings = [...new Set(busData.flatMap(bus => bus.timings))];

  const shifts = [
    { id: 'morning', label: 'Morning', time: '6 AM – 2 PM', icon: Sun },
    { id: 'afternoon', label: 'Afternoon', time: '2 – 10 PM', icon: Sunset },
    { id: 'night', label: 'Night', time: '10 PM – 6 AM', icon: Moon }
  ];

  useEffect(() => {
    // Filter buses based on selected time and set active buses
    const filteredBuses = selectedTime
      ? busData.filter(bus => bus.timings.includes(selectedTime))
      : busData;

    setActiveBuses(filteredBuses.map(bus => ({
      id: bus.busId,
      busNumber: bus.busId,
      route: bus.route,
      capacity: 45,
      type: bus.busId.startsWith('AC') ? 'AC' : 'Non-AC',
      status: 'Active',
      timings: bus.timings
    })));

    // Simulating API call to get staff based on shift
    setAvailableDrivers([
      { id: 1, name: 'Rajesh Kumar', experience: 5, rating: 4.8, preferredShifts: ['morning', 'afternoon'], gender: 'male' },
      { id: 2, name: 'Amit Banerjee', experience: 3, rating: 4.7, preferredShifts: ['afternoon', 'night'], gender: 'male' },
      { id: 3, name: 'Sunil Das', experience: 6, rating: 4.6, preferredShifts: ['night'], gender: 'male' },
      { id: 4, name: 'Manoj Singh', experience: 4, rating: 4.5, preferredShifts: ['morning', 'afternoon'], gender: 'male' },
      { id: 5, name: 'Vikram Patel', experience: 7, rating: 4.9, preferredShifts: ['morning', 'afternoon'], gender: 'male' },
      { id: 6, name: 'Arun Verma', experience: 5, rating: 4.8, preferredShifts: ['night'], gender: 'male' },
      { id: 7, name: 'Rahul Mehta', experience: 6, rating: 4.8, preferredShifts: ['afternoon', 'night'], gender: 'male' },
      { id: 8, name: 'Deepak Gupta', experience: 4, rating: 4.7, preferredShifts: ['morning'], gender: 'male' },
      { id: 9, name: 'Sanjay Malhotra', experience: 3, rating: 4.5, preferredShifts: ['night'], gender: 'male' },
      { id: 10, name: 'Rakesh Kapoor', experience: 4, rating: 4.6, preferredShifts: ['afternoon', 'night'], gender: 'male' }
    ]);

    setAvailableConductors([
      { id: 1, name: 'Mohan Singh', experience: 3, preferredShifts: ['morning'], gender: 'male' },
      { id: 2, name: 'Ravi Kumar', experience: 2, preferredShifts: ['afternoon'], gender: 'male' },
      { id: 3, name: 'Deepak Saha', experience: 4, preferredShifts: ['night'], gender: 'male' },
      { id: 4, name: 'Bikash Roy', experience: 3, preferredShifts: ['morning', 'afternoon'], gender: 'male' },
      { id: 5, name: 'Sanjay Ghosh', experience: 2, preferredShifts: ['afternoon', 'night'], gender: 'male' },
      { id: 6, name: 'Ramesh Yadav', experience: 3, preferredShifts: ['morning', 'afternoon'], gender: 'male' },
      { id: 7, name: 'Kishore Kumar', experience: 4, preferredShifts: ['night'], gender: 'male' },
      { id: 8, name: 'Vijay Tiwari', experience: 3, preferredShifts: ['afternoon', 'night'], gender: 'male' },
      { id: 9, name: 'Ashok Nair', experience: 4, preferredShifts: ['morning', 'afternoon'], gender: 'male' },
      { id: 10, name: 'Rajendra Prasad', experience: 3, preferredShifts: ['morning'], gender: 'male' }
    ]);
  }, [activeTab, selectedTime]);

  const handleRandomAssignment = async () => {
    const newAssignments = {};
    const availableDriversList = availableDrivers.filter(driver => driver.preferredShifts.includes(activeTab));
    const availableConductorsList = availableConductors.filter(conductor => conductor.preferredShifts.includes(activeTab));

    if (availableDriversList.length === 0 || availableConductorsList.length === 0) {
      toast.error('Not enough staff available for this shift');
      return;
    }

    setIsAssigning(true);

    // Iterate through buses with delay for animation
    for (const bus of activeBuses) {
      const randomDriver = availableDriversList[Math.floor(Math.random() * availableDriversList.length)];
      const randomConductor = availableConductorsList[Math.floor(Math.random() * availableConductorsList.length)];

      newAssignments[bus.id] = {
        driver: randomDriver,
        conductor: randomConductor,
      };

      // Update assignments one by one with animation
      setAssignments({...newAssignments});

      // Scroll to the assigned bus card
      const busCard = document.getElementById(`bus-${bus.id}`);
      if (busCard) {
        busCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        busCard.classList.remove('animate-assignment');
        void busCard.offsetWidth; // restart the pulse animation
        busCard.classList.add('animate-assignment');
      }

      // Add delay between assignments
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setIsAssigning(false);
    toast.success('Staff assigned to all buses');
  };

  const handleManualAssignment = (busId, staffType, staffId) => {
    const staff = staffType === 'driver'
      ? availableDrivers.find(d => d.id === parseInt(staffId))
      : availableConductors.find(c => c.id === parseInt(staffId));

    if (staff && staff.preferredShifts.includes(activeTab)) {
      setAssignments(prev => ({
        ...prev,
        [busId]: {
          ...prev[busId],
          [staffType]: staff,
        },
      }));
    }
  };

  const handleSaveAssignments = () => {
    console.log('Saving assignments:', { date: selectedDate, shift: activeTab, assignments });
    toast.success('Assignments saved');
    navigate('/admin');
  };

  const assignedCount = activeBuses.filter(b => assignments[b.id]?.driver && assignments[b.id]?.conductor).length;

  return (
    <>
      <PageHeader title="Staff" subtitle="Assign crews to buses by shift" back backTo="/admin" />

      <div className="mx-auto max-w-5xl space-y-5 px-4 pb-32">
        {/* Date + auto assign */}
        <div className="flex gap-2.5">
          <label className="card flex flex-1 items-center gap-2.5 px-3.5">
            <Clock className="h-[18px] w-[18px] flex-shrink-0 text-primary-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-12 w-full min-w-0 bg-transparent text-[15px] font-medium text-gray-900 focus:outline-none"
            />
          </label>
          <button onClick={handleRandomAssignment} disabled={isAssigning} className="btn btn-primary h-auto px-4">
            {isAssigning ? <Spinner className="h-5 w-5" /> : <Shuffle className="h-5 w-5" />}
            <span className="hidden sm:inline">Auto assign</span>
          </button>
        </div>

        {/* Shift */}
        <Segmented
          id="shift"
          value={activeTab}
          onChange={setActiveTab}
          options={shifts.map(({ id, label, icon: Icon }) => ({ value: id, label, icon: <Icon className="h-4 w-4" /> }))}
        />
        <p className="-mt-2 text-center text-xs text-gray-500">{shifts.find(s => s.id === activeTab)?.time}</p>

        {/* Timing chips */}
        <div>
          <p className="section-label">Bus timing</p>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            <button onClick={() => setSelectedTime('')} className={`chip ${selectedTime === '' ? 'chip-active' : ''}`}>All</button>
            {availableTimings.sort().map((time) => (
              <button key={time} onClick={() => setSelectedTime(time)} className={`chip tabular ${selectedTime === time ? 'chip-active' : ''}`}>
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Bus cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeBuses.map((bus, i) => {
            const a = assignments[bus.id]
            const complete = a?.driver && a?.conductor
            return (
              <div id={`bus-${bus.id}`} key={bus.id} className="stagger card overflow-hidden" style={{ '--i': Math.min(i, 8) }}>
                <div className="flex items-center gap-3 p-4">
                  <BusBadge id={bus.busNumber} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[15px] font-semibold text-gray-900">{bus.route}</h3>
                    <p className="text-[13px] text-gray-500">{bus.type} · {bus.capacity} seats</p>
                  </div>
                  <Pill tone={complete ? 'green' : 'gray'} dot={complete}>{complete ? 'Assigned' : 'Open'}</Pill>
                </div>

                <div className="space-y-3 border-t border-gray-100 bg-gray-50/50 p-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      <User className="h-3.5 w-3.5" /> Driver
                    </label>
                    <select
                      className="input bg-white ring-1 ring-black/5"
                      value={a?.driver?.id || ''}
                      onChange={(e) => handleManualAssignment(bus.id, 'driver', e.target.value)}
                    >
                      <option value="">Select a driver</option>
                      {availableDrivers
                        .filter(driver => driver.preferredShifts.includes(activeTab))
                        .map(driver => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name} (★{driver.rating})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      <Ticket className="h-3.5 w-3.5" /> Conductor
                    </label>
                    <select
                      className="input bg-white ring-1 ring-black/5"
                      value={a?.conductor?.id || ''}
                      onChange={(e) => handleManualAssignment(bus.id, 'conductor', e.target.value)}
                    >
                      <option value="">Select a conductor</option>
                      {availableConductors
                        .filter(conductor => conductor.preferredShifts.includes(activeTab))
                        .map(conductor => (
                          <option key={conductor.id} value={conductor.id}>
                            {conductor.name} ({conductor.experience}y exp)
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="glass mx-auto flex max-w-xl items-center gap-3 rounded-[24px] p-2.5 pl-5 shadow-ios-float ring-1 ring-black/5">
          <div className="flex-1">
            <p className="text-[15px] font-bold tabular text-gray-900">{assignedCount} / {activeBuses.length}</p>
            <p className="text-xs text-gray-500">buses staffed</p>
          </div>
          <button onClick={handleSaveAssignments} className="btn btn-primary btn-lg">
            <Save className="h-5 w-5" /> Save
          </button>
        </div>
      </div>
    </>
  );
};

export default AssignmentPage;
