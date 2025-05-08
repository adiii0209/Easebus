import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, MapPin, Bus, ArrowRight, TrendingUp, ChevronLeft, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import busService from '../services/BusService';

const SearchModal = ({ isOpen, onClose, onSearch, initialQuery = '' }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const searchInputRef = useRef(null);

  // Focus the search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
    }
  }, []);

  // Set popular destinations
  useEffect(() => {
    // Get all stops and select some popular ones
    const allStops = busService.getAllStops();
    const popular = [
      'Howrah Station',
      'Esplanade',
      'Park Street',
      'Salt Lake',
      'Jadavpur',
      'Tollygunge'
    ].filter(stop => allStops.includes(stop));
    
    setPopularDestinations(popular);
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = busService.searchBusesByRoute(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Save search to recent searches
  const saveToRecentSearches = (query, bus = null) => {
    if (!query.trim()) return;
    
    const searchItem = bus ? {
      query,
      busId: bus.busId,
      route: bus.route,
      stops: bus.stops
    } : { query };
    
    const updatedSearches = [
      searchItem,
      ...recentSearches.filter(item => 
        bus ? item.busId !== searchItem.busId : item.query !== searchItem.query
      )
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Handle search submission
  const handleSearch = (query, bus = null) => {
    saveToRecentSearches(query, bus);
    onSearch(query);
    onClose();
  };

  // Handle clicking on a recent search or popular destination
  const handleSearchItemClick = (item) => {
    // If the item is a bus from search results
    if (searchResults.some(bus => bus.busId === item)) {
      const bus = searchResults.find(bus => bus.busId === item);
      saveToRecentSearches(bus.route, bus);
      navigate(`/bus-details/${item}`);
      onClose();
      return;
    }
    
    // If the item is from recent searches
    if (typeof item === 'object' && item.busId) {
      navigate(`/bus-details/${item.busId}`);
      onClose();
      return;
    }
    
    const query = typeof item === 'object' ? item.query : item;
    setSearchQuery(query);
    
    // If the item is a popular destination, search for buses by stop
    if (popularDestinations.includes(query)) {
      const results = busService.getBusesByStop(query);
      setSearchResults(results);
    } else {
      handleSearch(query);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Search by route number, name or stop"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Search Results */}
            {searchQuery.trim() && searchResults.length > 0 ? (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Search Results</h3>
                <div className="space-y-3">
                  {searchResults.map((bus) => (
                    <motion.div
                      key={bus.busId}
                      className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleSearchItemClick(bus.busId)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                          <Bus className="h-6 w-6" />
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-gray-900">{bus.busId} - {bus.route}</h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{bus.stops[0]}</span>
                            <ArrowRight className="h-3 w-3 mx-1" />
                            <span>{bus.stops[bus.stops.length - 1]}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : searchQuery.trim() && searchResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No results found for "{searchQuery}"</p>
              </div>
            ) : (
              <>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Recent Searches</h3>
                    <div className="space-y-1.5">
                      {recentSearches.map((search, index) => (
                        <motion.div
                          key={index}
                          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer flex items-center"
                          onClick={() => handleSearchItemClick(search)}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700 flex-1">
                            {search.busId ? `${search.busId} - ${search.route}` : search.query}
                            {search.busId && (
                              <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                <MapPin className="h-2.5 w-2.5 mr-1" />
                                <span>{search.stops[0]}</span>
                                <ArrowRight className="h-2.5 w-2.5 mx-1" />
                                <span>{search.stops[search.stops.length - 1]}</span>
                              </div>
                            )}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const updatedSearches = recentSearches.filter(s => s !== search);
                              setRecentSearches(updatedSearches);
                              localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Destinations */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Popular Destinations</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {popularDestinations.map((destination, index) => (
                      <motion.div
                        key={index}
                        className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer flex items-center"
                        onClick={() => handleSearchItemClick(destination)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-100 text-secondary-600 mr-3">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <span className="text-gray-700">{destination}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;