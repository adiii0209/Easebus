// RouteGraph.js - Graph-based route calculation system

class RouteGraph {
  constructor() {
    this.nodes = new Map(); // Map of stop names to their adjacent stops
    this.edges = new Map(); // Map of edge weights (distances/times) between stops
  }

  addStop(stopName) {
    if (!this.nodes.has(stopName)) {
      this.nodes.set(stopName, new Set());
    }
  }

  addRoute(fromStop, toStop, busId, distance, duration) {
    // Add both stops to the graph
    this.addStop(fromStop);
    this.addStop(toStop);

    // Add bidirectional connections
    this.nodes.get(fromStop).add(toStop);
    this.nodes.get(toStop).add(fromStop);

    // Store edge weights
    const edgeKey = `${fromStop}-${toStop}`;
    const reverseEdgeKey = `${toStop}-${fromStop}`;
    
    this.edges.set(edgeKey, {
      busId,
      distance,
      duration,
      direct: true
    });
    
    this.edges.set(reverseEdgeKey, {
      busId,
      distance,
      duration,
      direct: true
    });
  }

  findShortestPath(start, end, preferenceType = 'duration') {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();

    // Initialize distances
    for (const stop of this.nodes.keys()) {
      distances.set(stop, Infinity);
      unvisited.add(stop);
    }
    distances.set(start, 0);

    while (unvisited.size > 0) {
      // Find the unvisited node with minimum distance
      let current = null;
      let minDistance = Infinity;

      for (const stop of unvisited) {
        if (distances.get(stop) < minDistance) {
          minDistance = distances.get(stop);
          current = stop;
        }
      }

      if (current === null || current === end) break;

      unvisited.delete(current);

      // Update distances to neighbors
      for (const neighbor of this.nodes.get(current)) {
        if (!unvisited.has(neighbor)) continue;

        const edgeKey = `${current}-${neighbor}`;
        const edge = this.edges.get(edgeKey);
        
        if (!edge) continue;

        const weight = preferenceType === 'duration' ? edge.duration : edge.distance;
        const newDistance = distances.get(current) + weight;

        if (newDistance < distances.get(neighbor)) {
          distances.set(neighbor, newDistance);
          previous.set(neighbor, {
            stop: current,
            edge
          });
        }
      }
    }

    // Reconstruct path
    const path = [];
    let current = end;

    while (current !== start && previous.has(current)) {
      const { stop, edge } = previous.get(current);
      path.unshift({
        from: stop,
        to: current,
        busId: edge.busId,
        distance: edge.distance,
        duration: edge.duration,
        direct: edge.direct
      });
      current = stop;
    }

    return path.length > 0 ? {
      path,
      totalDistance: distances.get(end),
      totalDuration: this.calculateTotalDuration(path)
    } : null;
  }

  calculateTotalDuration(path) {
    let totalDuration = 0;
    let previousBusId = null;

    for (const segment of path) {
      totalDuration += segment.duration;
      
      // Add transfer time if changing buses
      if (previousBusId && previousBusId !== segment.busId) {
        totalDuration += 15; // 15 minutes transfer time
      }
      previousBusId = segment.busId;
    }

    return totalDuration;
  }

  // Build graph from bus service data
  static fromBusService(busService) {
    const graph = new RouteGraph();
    const buses = busService.getAllBuses();

    buses.forEach(bus => {
      for (let i = 0; i < bus.stops.length - 1; i++) {
        const fromStop = bus.stops[i];
        const toStop = bus.stops[i + 1];
        
        // Estimate distance and duration between consecutive stops
        const distance = 1.5; // 1.5 km between stops (estimated)
        const duration = 10; // 10 minutes between stops (estimated)

        graph.addRoute(fromStop, toStop, bus.busId, distance, duration);
      }
    });

    return graph;
  }
}

export default RouteGraph;