import { NavLink } from 'react-router-dom';
import { Home, Bus, Ticket, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
 import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const BottomNavigation = () => {
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Bus, label: 'Track Bus', path: '/bus-tracking' },
    { icon: Ticket, label: 'Book Tickets', path: '/ticket-booking' },
    { icon: User, label: 'Profile', path: user ? '/passenger-dashboard' : '/auth' }
  ];

  // Update active index based on current path
  useEffect(() => {
    const currentPath = window.location.pathname;
    const index = navItems.findIndex(item => item.path === currentPath);
    if (index !== -1) setActiveIndex(index);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="relative flex justify-around items-center h-16">
        <motion.div
          className="absolute top-0 left-0 h-0.5 bg-primary-600"
          initial={false}
          animate={{
            width: '25%',
            x: `${activeIndex * 100}%`
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        {navItems.map(({ icon: Icon, label, path }, index) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => {
              if (isActive && activeIndex !== index) setActiveIndex(index);
              return `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary-600' : 'text-gray-600'}`;
            }}
          >
            {label === 'Profile' && user ? (
              <img
                src={user.profileImage || '/src/assets/passenger.jpeg'}
                alt="Profile"
                className="h-6 w-6 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <Icon className="h-6 w-6" />
            )}
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;