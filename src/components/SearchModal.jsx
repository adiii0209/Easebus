import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, MapPin, ArrowRight, TrendingUp, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import busService from '../services/BusService';
import { BusBadge, EmptyState } from './ui';

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
      }, 200);
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

  const removeRecent = (search) => {
    const updatedSearches = recentSearches.filter(s => s !== search);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const hasQuery = searchQuery.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-surface"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        >
          {/* Search bar */}
          <div className="glass border-b border-black/5 pt-safe">
            <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-2.5">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="input h-10 rounded-xl pl-10 pr-9"
                  placeholder="Bus number, route or stop"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                    className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-gray-400/70 text-white transition active:scale-90"
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3" strokeWidth={3.5} />
                  </button>
                )}
              </div>
              <button onClick={onClose} className="text-[17px] font-medium text-primary-600 transition active:opacity-50">
                Cancel
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="mx-auto max-w-2xl px-4 py-5">
              {hasQuery && searchResults.length > 0 ? (
                <div>
                  <p className="section-label">{searchResults.length} result{searchResults.length > 1 ? 's' : ''}</p>
                  <div className="list-group">
                    {searchResults.map((bus, i) => (
                      <motion.button
                        key={bus.busId}
                        className="list-row"
                        onClick={() => handleSearchItemClick(bus.busId)}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.03 }}
                      >
                        <BusBadge id={bus.busId} />
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-[15px] font-semibold text-gray-900">{bus.route}</h4>
                          <div className="mt-0.5 flex items-center text-[13px] text-gray-500">
                            <span className="truncate">{bus.stops[0]}</span>
                            <ArrowRight className="mx-1 h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{bus.stops[bus.stops.length - 1]}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-300" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : hasQuery ? (
                <EmptyState icon={Search} title="No results" message={`Nothing matched “${searchQuery}”. Try a bus number, route or stop name.`} />
              ) : (
                <div className="space-y-7">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <p className="section-label">Recent</p>
                      <div className="list-group">
                        {recentSearches.map((search, index) => (
                          <motion.div
                            key={index}
                            className="list-row list-row-action"
                            onClick={() => handleSearchItemClick(search)}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: index * 0.04 }}
                          >
                            <Clock className="h-[18px] w-[18px] flex-shrink-0 text-gray-400" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[15px] text-gray-900">
                                {search.busId ? `${search.busId} · ${search.route}` : search.query}
                              </p>
                              {search.busId && (
                                <div className="mt-0.5 flex items-center text-xs text-gray-500">
                                  <MapPin className="mr-1 h-3 w-3" />
                                  <span className="truncate">{search.stops[0]}</span>
                                  <ArrowRight className="mx-1 h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{search.stops[search.stops.length - 1]}</span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeRecent(search); }}
                              className="icon-btn h-8 w-8 text-gray-300 hover:text-red-500"
                              aria-label="Remove from recent"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Destinations */}
                  <div>
                    <p className="section-label">Popular destinations</p>
                    <div className="flex flex-wrap gap-2">
                      {popularDestinations.map((destination, index) => (
                        <motion.button
                          key={destination}
                          className="chip h-10 gap-2 pl-3"
                          onClick={() => handleSearchItemClick(destination)}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.25, delay: index * 0.04 }}
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
                            <TrendingUp className="h-3.5 w-3.5" />
                          </span>
                          {destination}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
