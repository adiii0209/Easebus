import { useEffect, useRef } from 'react';

const AnimatedBus = () => {
  const busRef = useRef(null);

  useEffect(() => {
    const bus = busRef.current;
    if (!bus) return;

    const animate = () => {
      bus.style.transform = 'translateX(-100%)';
      bus.style.opacity = '0';
      
      setTimeout(() => {
        bus.style.transition = 'transform 2s ease-in-out, opacity 0.5s ease-in-out';
        bus.style.transform = 'translateX(0)';
        bus.style.opacity = '1';
      }, 100);
    };

    animate();
    const interval = setInterval(animate, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full" ref={busRef}>
      <svg
        viewBox="0 0 512 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Bus Body */}
        <rect x="50" y="80" width="400" height="120" rx="20" fill="#ffffff" />
        <rect x="50" y="140" width="400" height="60" rx="10" fill="#f3f4f6" />

        {/* Windows */}
        <rect x="80" y="100" width="40" height="30" rx="5" fill="#60a5fa" />
        <rect x="140" y="100" width="40" height="30" rx="5" fill="#60a5fa" />
        <rect x="200" y="100" width="40" height="30" rx="5" fill="#60a5fa" />
        <rect x="260" y="100" width="40" height="30" rx="5" fill="#60a5fa" />
        <rect x="320" y="100" width="40" height="30" rx="5" fill="#60a5fa" />
        <rect x="380" y="100" width="40" height="30" rx="5" fill="#60a5fa" />

        {/* Wheels */}
        <circle cx="120" cy="200" r="25" fill="#1f2937" />
        <circle cx="380" cy="200" r="25" fill="#1f2937" />
        <circle cx="120" cy="200" r="12" fill="#d1d5db" />
        <circle cx="380" cy="200" r="12" fill="#d1d5db" />

        {/* Details */}
        <rect x="40" y="160" width="420" height="10" rx="5" fill="#2563eb" />
        <rect x="380" y="80" width="40" height="5" rx="2.5" fill="#ef4444" />
      </svg>
    </div>
  );
};

export default AnimatedBus;