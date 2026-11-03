import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { ChevronLeft, X, Search, Check } from 'lucide-react'

export const spring = { type: 'spring', stiffness: 380, damping: 34, mass: 0.9 }

/* ---------------------------------------------------------------
 * Scroll-aware page header (iOS "large title" that collapses into
 * a compact translucent bar once the page scrolls).
 * ------------------------------------------------------------- */
export const PageHeader = ({ title, subtitle, back = false, backTo, action, className = '' }) => {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goBack = () => (backTo ? navigate(backTo) : navigate(-1))

  return (
    <>
      <div
        className={`sticky top-0 z-30 transition-all duration-300 ease-ios ${
          scrolled ? 'glass border-b border-black/5' : 'border-b border-transparent'
        }`}
      >
        <div className="pt-safe">
          <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-3">
            <div className="flex min-w-[72px] items-center">
              {back && (
                <button
                  onClick={goBack}
                  className="-ml-1 flex h-10 items-center gap-0.5 rounded-full pl-1 pr-3 text-[17px] font-medium text-primary-600 transition active:scale-95 active:opacity-60"
                  aria-label="Go back"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
                  Back
                </button>
              )}
            </div>
            <h2
              className={`truncate text-[17px] font-semibold text-gray-900 transition-all duration-300 ease-ios ${
                scrolled ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
              }`}
            >
              {title}
            </h2>
            <div className="flex min-w-[72px] items-center justify-end">{action}</div>
          </div>
        </div>
      </div>
      <div className={`mx-auto max-w-5xl px-4 pb-3 pt-1 ${className}`}>
        <h1 className="text-[34px] font-bold leading-tight tracking-tight text-gray-900">{title}</h1>
        {subtitle && <p className="mt-1 text-[15px] text-gray-500">{subtitle}</p>}
      </div>
    </>
  )
}

/* ---------------------------------------------------------------
 * Bottom sheet (mobile) / centered dialog (desktop)
 * ------------------------------------------------------------- */
export const Sheet = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  const dragControls = useDragControls()
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [isOpen, onClose])

  const width = size === 'lg' ? 'sm:max-w-2xl' : size === 'sm' ? 'sm:max-w-sm' : 'sm:max-w-lg'

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`relative flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-surface shadow-ios-float sm:rounded-[28px] ${width}`}
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={spring}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            dragListener={false}
            dragControls={dragControls}
            onDragEnd={(_, info) => (info.offset.y > 120 || info.velocity.y > 600) && onClose()}
          >
            <SheetGrabber onPointerDown={(e) => dragControls.start(e)} />
            {title && (
              <div className="flex items-center justify-between px-5 pb-2 pt-1" onPointerDown={(e) => e.target === e.currentTarget && dragControls.start(e)}>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <button onClick={onClose} className="icon-btn -mr-2 h-8 w-8 bg-gray-200/70 text-gray-500" aria-label="Close">
                  <X className="h-4 w-4" strokeWidth={3} />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-2">{children}</div>
            {footer && <div className="border-t border-black/5 bg-white/70 px-5 pb-safe pt-3 backdrop-blur-xl"><div className="pb-3">{footer}</div></div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

const SheetGrabber = ({ onPointerDown }) => (
  <div className="flex cursor-grab touch-none justify-center pb-2 pt-3 sm:hidden" onPointerDown={onPointerDown}>
    <div className="h-1.5 w-10 rounded-full bg-gray-300" />
  </div>
)

/* ---------------------------------------------------------------
 * Alert dialog (iOS style, centered, stacked or side-by-side actions)
 * ------------------------------------------------------------- */
export const AlertDialog = ({ isOpen, onClose, icon, tone = 'primary', title, message, actions }) => {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const tones = {
    primary: 'bg-primary-100 text-primary-600',
    danger: 'bg-red-100 text-red-600',
    success: 'bg-green-100 text-green-600',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-8">
          <motion.div
            className="absolute inset-0 bg-black/35 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            className="relative w-full max-w-[320px] overflow-hidden rounded-[28px] bg-white/90 text-center shadow-ios-float backdrop-blur-2xl"
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          >
            <div className="px-6 pb-5 pt-6">
              {icon && <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${tones[tone]}`}>{icon}</div>}
              <h3 className="text-[17px] font-semibold text-gray-900">{title}</h3>
              {message && <p className="mt-1.5 text-[14px] leading-snug text-gray-500">{message}</p>}
            </div>
            <div className="flex divide-x divide-black/10 border-t border-black/10">{actions}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export const AlertAction = ({ children, onClick, tone = 'primary', strong = false, disabled }) => {
  const color = tone === 'danger' ? 'text-red-500' : tone === 'muted' ? 'text-gray-600' : 'text-primary-600'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 py-3.5 text-[17px] transition-colors active:bg-black/5 disabled:opacity-40 ${color} ${strong ? 'font-semibold' : ''}`}
    >
      {children}
    </button>
  )
}

/* ---------------------------------------------------------------
 * Segmented control with a sliding thumb
 * ------------------------------------------------------------- */
export const Segmented = ({ options, value, onChange, id = 'seg', className = '', size = 'md' }) => (
  <div className={`flex rounded-xl bg-gray-200/60 p-[3px] ${className}`} role="tablist">
    {options.map((opt) => {
      const active = opt.value === value
      return (
        <button
          key={opt.value}
          role="tab"
          aria-selected={active}
          onClick={() => onChange(opt.value)}
          className={`relative flex-1 whitespace-nowrap rounded-[10px] font-semibold transition-colors duration-200 ${
            size === 'sm' ? 'px-3 py-1.5 text-[13px]' : 'px-3 py-2 text-sm'
          } ${active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          {active && (
            <motion.span
              layoutId={`${id}-thumb`}
              className="absolute inset-0 rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_0.5px_rgba(0,0,0,0.04)]"
              transition={spring}
            />
          )}
          <span className="relative z-10 inline-flex items-center justify-center gap-1.5">
            {opt.icon}
            {opt.label}
            {opt.badge != null && opt.badge > 0 && (
              <span className="rounded-full bg-primary-600 px-1.5 text-[11px] leading-[18px] text-white">{opt.badge}</span>
            )}
          </span>
        </button>
      )
    })}
  </div>
)

/* ---------------------------------------------------------------
 * Text field with leading icon, label and inline error
 * ------------------------------------------------------------- */
export const Field = ({ label, icon: Icon, error, className = '', inputClassName = '', ...props }) => (
  <div className={className}>
    {label && (
      <label htmlFor={props.id} className="mb-1.5 block text-[13px] font-semibold text-gray-600">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />}
      <input className={`input ${Icon ? 'pl-10' : ''} ${error ? 'input-error' : ''} ${inputClassName}`} {...props} />
    </div>
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden pt-1.5 text-[13px] text-red-500"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
)

/* ---------------------------------------------------------------
 * Small building blocks
 * ------------------------------------------------------------- */
const pillTones = {
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-primary-100 text-primary-700',
  violet: 'bg-secondary-100 text-secondary-700',
  gray: 'bg-gray-100 text-gray-600',
}

export const Pill = ({ tone = 'gray', children, dot = false, className = '' }) => (
  <span className={`pill ${pillTones[tone]} ${className}`}>
    {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
    {children}
  </span>
)

export const EmptyState = ({ icon: Icon, title, message, action }) => (
  <div className="flex flex-col items-center px-6 py-12 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-100 text-gray-400">
      <Icon className="h-8 w-8" strokeWidth={1.75} />
    </div>
    <h3 className="text-[17px] font-semibold text-gray-900">{title}</h3>
    {message && <p className="mt-1 max-w-xs text-sm text-gray-500">{message}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
)

export const Spinner = ({ className = 'h-4 w-4' }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

export const Avatar = ({ src, name = '', size = 'h-10 w-10', className = '' }) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
  return src ? (
    <img src={src} alt={name} className={`${size} flex-shrink-0 rounded-full object-cover ${className}`} />
  ) : (
    <div
      className={`${size} flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 text-sm font-semibold text-white ${className}`}
    >
      {initials || '?'}
    </div>
  )
}

/* Bus number badge used wherever a bus is listed */
export const BusBadge = ({ id, className = '' }) => {
  const isAC = id?.startsWith('AC')
  return (
    <div
      className={`flex h-11 min-w-[44px] flex-shrink-0 items-center justify-center rounded-xl px-2 text-[13px] font-bold tracking-tight ${
        isAC ? 'bg-secondary-100 text-secondary-700' : 'bg-primary-100 text-primary-700'
      } ${className}`}
    >
      {id}
    </div>
  )
}

/* Stagger-in wrapper for list items */
export const Reveal = ({ index = 0, children, className = '' }) => (
  <div className={`stagger ${className}`} style={{ '--i': Math.min(index, 10) }}>
    {children}
  </div>
)

/* ---------------------------------------------------------------
 * Searchable single-choice picker presented in a sheet
 * ------------------------------------------------------------- */
export const PickerSheet = ({ isOpen, onClose, title, options, value, onSelect, searchable = true, placeholder = 'Search' }) => {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!isOpen) setQuery('')
  }, [isOpen])

  const filtered = options.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title={title}>
      {searchable && (
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
          <input className="input pl-10" placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      )}
      {filtered.length > 0 ? (
        <div className="list-group">
          {filtered.map((opt) => {
            const active = opt === value
            return (
              <button
                key={opt}
                type="button"
                className="list-row py-3.5"
                onClick={() => {
                  onSelect(opt)
                  onClose()
                }}
              >
                <span className={`flex-1 text-[15px] ${active ? 'font-semibold text-primary-700' : 'text-gray-800'}`}>{opt}</span>
                {active && <Check className="h-5 w-5 text-primary-600" strokeWidth={3} />}
              </button>
            )
          })}
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-gray-500">No matches</p>
      )}
    </Sheet>
  )
}
