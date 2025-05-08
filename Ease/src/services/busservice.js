// BusService.js
import busData from '../../buses.js';

class BusService {
  constructor() {
    // Initialize buses with an empty revenueEntries array and trip history
    this.buses = busData.map(bus => ({ 
      ...bus, 
      revenueEntries: [], // To store { date, tripId, amount }
      tripHistory: [] // To store { tripId, date, fareCollected }
    }));
  }

  // Get all buses
  getAllBuses() {
    return this.buses;
  }

  // Get bus by ID
  getBusById(busId) {
    return this.buses.find(bus => bus.busId === busId);
  }

  // Search buses by route name or stop name
  searchBusesByRoute(query) {
    if (!query) return this.buses;
    
    const lowercaseQuery = query.toLowerCase();
    return this.buses.filter(bus => 
      bus.route.toLowerCase().includes(lowercaseQuery) ||
      bus.busId.toLowerCase().includes(lowercaseQuery) ||
      bus.stops.some(stop => stop.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Get all unique stops across all buses
  getAllStops() {
    const stopsSet = new Set();
    
    this.buses.forEach(bus => {
      bus.stops.forEach(stop => {
        stopsSet.add(stop);
      });
    });
    
    return Array.from(stopsSet).sort();
  }

  // Find buses that pass through a specific stop
  getBusesByStop(stopName) {
    if (!stopName) return [];
    
    const lowercaseStop = stopName.toLowerCase();
    return this.buses.filter(bus => 
      bus.stops.some(stop => stop.toLowerCase().includes(lowercaseStop))
    );
  }

  // Find buses between two stops
  findRoutesBetweenStops(fromStop, toStop) {
    if (!fromStop || !toStop) return [];
    
    const lowercaseFrom = fromStop.toLowerCase();
    const lowercaseTo = toStop.toLowerCase();
    
    return this.buses.filter(bus => {
      const fromIndex = bus.stops.findIndex(stop => 
        stop.toLowerCase().includes(lowercaseFrom)
      );
      
      const toIndex = bus.stops.findIndex(stop => 
        stop.toLowerCase().includes(lowercaseTo)
      );
      
      // Check if both stops exist and the 'to' stop comes after the 'from' stop
      return fromIndex !== -1 && toIndex !== -1 && toIndex > fromIndex;
    });
  }

  // Get all available timings
  getAllTimings() {
    // Since all buses have the same timings in this dataset
    return this.buses[0]?.timings || [];
  }

  // Record revenue for a completed trip
  recordTripRevenue(busId, tripId, date, amount) {
    const bus = this.getBusById(busId);
    if (bus) {
      const newEntry = { date, tripId, amount: parseFloat(amount) };
      bus.revenueEntries.push(newEntry);
      bus.tripHistory.push({ tripId, date, fareCollected: parseFloat(amount) }); // Also log to trip history for simplicity
      console.log(`Revenue recorded for bus ${busId}, trip ${tripId}: $${amount}`);
      return true;
    }
    console.error(`Bus with ID ${busId} not found for recording revenue.`);
    return false;
  }

  // Get total revenue for a specific bus
  getBusTotalRevenue(busId) {
    const bus = this.getBusById(busId);
    if (bus) {
      return bus.revenueEntries.reduce((total, entry) => total + entry.amount, 0);
    }
    return 0;
  }

  // Get revenue for a specific bus on a specific date
  getBusRevenueByDate(busId, date) {
    const bus = this.getBusById(busId);
    if (bus) {
      return bus.revenueEntries
        .filter(entry => entry.date === date)
        .reduce((total, entry) => total + entry.amount, 0);
    }
    return 0;
  }

  // Get revenue entries for a specific bus, optionally filtered by date
  getBusRevenueEntries(busId, date = null) {
    const bus = this.getBusById(busId);
    if (!bus) return [];
    if (date) {
      return bus.revenueEntries.filter(entry => entry.date === date);
    }
    return bus.revenueEntries;
  }

  // Get overall daily revenue for a specific date
  getDailyRevenue(date) {
    let totalDailyRevenue = 0;
    this.buses.forEach(bus => {
      bus.revenueEntries.forEach(entry => {
        if (entry.date === date) {
          totalDailyRevenue += entry.amount;
        }
      });
    });
    return totalDailyRevenue;
  }

  // Get overall monthly revenue for a specific year and month
  getMonthlyRevenue(year, month) { // month is 1-indexed (1 for Jan, 12 for Dec)
    let totalMonthlyRevenue = 0;
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    this.buses.forEach(bus => {
      bus.revenueEntries.forEach(entry => {
        if (entry.date.startsWith(monthStr)) {
          totalMonthlyRevenue += entry.amount;
        }
      });
    });
    return totalMonthlyRevenue;
  }
}

// Create a singleton instance
const busService = new BusService();

export default busService;