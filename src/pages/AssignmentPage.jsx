import { useState, useEffect } from 'react';
import './AssignmentPage.css';
import { useNavigate } from 'react-router-dom';
import { User, Bus, Shuffle, Save, Clock, Calendar, Filter, ChevronDown, ArrowLeft } from 'lucide-react';
import busData from '../../buses.js';

const AssignmentPage = () => {
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState('');
  const [activeTab, setActiveTab] = useState('morning');
  const [activeBuses, setActiveBuses] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableConductors, setAvailableConductors] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Get unique timings from all buses
  const availableTimings = [...new Set(busData.flatMap(bus => bus.timings))];

  const shifts = [
    { id: 'morning', label: 'Morning Shift', time: '6:00 AM - 2:00 PM' },
    { id: 'afternoon', label: 'Afternoon Shift', time: '2:00 PM - 10:00 PM' },
    { id: 'night', label: 'Night Shift', time: '10:00 PM - 6:00 AM' }
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
  }, [activeTab]);

  const handleRandomAssignment = async () => {
    const newAssignments = {};
    const availableDriversList = availableDrivers.filter(driver => driver.preferredShifts.includes(activeTab));
    const availableConductorsList = availableConductors.filter(conductor => conductor.preferredShifts.includes(activeTab));
    
    if (availableDriversList.length === 0 || availableConductorsList.length === 0) {
      alert('Not enough staff available for this shift!');
      return;
    }

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
        busCard.classList.add('animate-assignment');
      }

      // Add delay between assignments
      await new Promise(resolve => setTimeout(resolve, 800));
    }
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
    alert('Assignments saved successfully!');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-600 transition hover:bg-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <div className="mb-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Assignment</h1>
              <p className="mt-1 text-gray-600">Manage bus staff assignments by shift</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
                <Calendar className="h-5 w-5 text-gray-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border-none bg-transparent focus:outline-none"
                />
              </div>
              <button
                onClick={handleRandomAssignment}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
              >
                <Shuffle className="h-5 w-5" />
                Auto Assign
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Select Bus Timing</h2>
            <div className="flex flex-wrap gap-2">
              {availableTimings.sort().map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedTime === time
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 flex space-x-1 rounded-xl bg-white p-1 shadow-sm">
          {shifts.map((shift) => (
            <button
              key={shift.id}
              onClick={() => setActiveTab(shift.id)}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                activeTab === shift.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{shift.label}</span>
              </div>
              <div className="mt-1 text-xs opacity-80">{shift.time}</div>
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeBuses.map(bus => (
            <div id={`bus-${bus.id}`} key={bus.id} className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md">
              <div className="border-b bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-100 p-2">
                      <Bus className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{bus.busNumber}</h3>
                      <p className="text-sm text-gray-500">{bus.route}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {bus.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="grid grid-cols-2 gap-4">
                    <div>Type: {bus.type}</div>
                    <div>Capacity: {bus.capacity}</div>
                  </div>
                  <div>
                    <div className="font-medium">Timings:</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {bus.timings.map((time, index) => (
                        <span key={index} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Driver</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 overflow-y-auto max-h-48"
                    value={assignments[bus.id]?.driver?.id || ''}
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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Conductor</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 overflow-y-auto max-h-48"
                    value={assignments[bus.id]?.conductor?.id || ''}
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

                {assignments[bus.id] && (
                  <div className="mt-4 rounded-lg bg-indigo-50 p-3">
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-indigo-600" />
                        <span className="font-medium">Assigned Driver:</span>
                        <span>{assignments[bus.id].driver?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-indigo-600" />
                        <span className="font-medium">Assigned Conductor:</span>
                        <span>{assignments[bus.id].conductor?.name}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveAssignments}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-white transition hover:bg-green-700"
          >
            <Save className="h-5 w-5" />
            Save Assignments
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;