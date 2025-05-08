import { useEffect, useRef } from 'react';
import easeBusLogo from '../assets/modern-bus.svg';

const AnimatedLogo = ({ className = '', width = 600, height = 400 }) => {
  const logoRef = useRef(null);
  const busRef = useRef(null);

  useEffect(() => {
    const logo = logoRef.current;
    const bus = busRef.current;
    
    // Entrance animation
    if (logo) {
      logo.style.opacity = '0';
      logo.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        logo.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        logo.style.opacity = '1';
        logo.style.transform = 'translateY(0)';
      }, 100);
    }

    // Bus animation
    if (bus) {
      // Initial position slightly off-screen to the left
      bus.style.transform = 'translateX(-50px)';
      
      // Animate the bus moving into view with a slight bounce
      setTimeout(() => {
        bus.style.transition = 'transform 1.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
        bus.style.transform = 'translateX(0)';
        
        // Add a subtle floating animation
        setInterval(() => {
          bus.style.transition = 'transform 3s ease-in-out';
          bus.style.transform = 'translateY(-5px)';
          
          setTimeout(() => {
            bus.style.transform = 'translateY(0px)';
          }, 1500);
        }, 3000);
      }, 500);
    }
  }, []);

  return (
    <div 
      ref={logoRef} 
      className={`animated-logo-container ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '0.5rem',
        boxShadow: '0 20px 40px -10px rgba(79, 70, 229, 0.4)',
        background: 'transparent',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Road with dashed lines */}
      <div 
        style={{
          position: 'absolute',
          bottom: '50px',
          width: '100%',
          height: '10px',
          background: '#444',
          zIndex: 1
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: '4px',
            width: '100%',
            height: '2px',
            background: 'repeating-linear-gradient(90deg, #fff, #fff 20px, transparent 20px, transparent 40px)',
          }}
        />
      </div>
      
      {/* Bus image with animation */}
      <div 
        ref={busRef}
        style={{
          width: '80%',
          height: '80%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
          background: 'transparent'
        }}
      >
        <img src={easeBusLogo} alt="EaseBus Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
      </div>
      
      {/* Clouds in background */}
      <div 
        style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          width: '60px',
          height: '30px',
          borderRadius: '15px',
          background: 'rgba(255, 255, 255, 0.8)',
          zIndex: 0,
          animation: 'float 6s infinite ease-in-out',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          top: '70px',
          right: '80px',
          width: '80px',
          height: '40px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.8)',
          zIndex: 0,
          animation: 'float 8s infinite ease-in-out',
        }}
      />
      
      {/* Add keyframes for cloud animation */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
};

export default AnimatedLogo;