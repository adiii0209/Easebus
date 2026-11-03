const AnimatedBus = () => (
  <div className="relative w-full">
    {/* Road */}
    <div className="absolute inset-x-0 bottom-[14%] h-px bg-white/25" />
    <div className="animate-drive">
      <svg viewBox="0 0 512 256" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-[0_18px_24px_rgba(8,47,73,0.35)]">
        {/* Bus Body */}
        <rect x="50" y="80" width="400" height="120" rx="26" fill="#ffffff" />
        <rect x="50" y="140" width="400" height="60" rx="14" fill="#f1f5f9" />

        {/* Windows */}
        {[80, 140, 200, 260, 320].map((x) => (
          <rect key={x} x={x} y="100" width="44" height="34" rx="8" fill="#7dd3fc" />
        ))}
        <rect x="384" y="100" width="46" height="60" rx="8" fill="#38bdf8" />

        {/* Details */}
        <rect x="50" y="160" width="400" height="10" fill="#0ea5e9" />
        <rect x="425" y="176" width="22" height="10" rx="5" fill="#fde047" />

        {/* Wheels */}
        <g className="origin-center">
          <circle cx="120" cy="200" r="27" fill="#1e293b" />
          <circle cx="120" cy="200" r="12" fill="#cbd5e1" />
          <circle cx="380" cy="200" r="27" fill="#1e293b" />
          <circle cx="380" cy="200" r="12" fill="#cbd5e1" />
        </g>
      </svg>
    </div>
  </div>
)

export default AnimatedBus
