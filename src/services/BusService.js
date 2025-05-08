// BusService.js
import busData from '../../buses.js';

class BusService {
  constructor() {
    this.buses = busData;
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
}

// Create a singleton instance
const busService = new BusService();

export default busService;