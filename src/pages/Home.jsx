import { Link } from 'react-router-dom'
import { MapPin, Clock, CreditCard, Map, Bell, Shield, Bus, Route, Ticket, Search, ChevronRight, ArrowRight, Check } from 'lucide-react'
import AnimatedBus from '../components/AnimatedBus'
import { Avatar, BusBadge, Reveal } from '../components/ui'
import busService from '../services/BusService'
import { useAuth } from '../contexts/AuthContext'

const quickActions = [
  { label: 'Track', icon: Bus, to: '/bus-tracking', gradient: 'bg-primary-600' },
  { label: 'Plan', icon: Route, to: '/route-planner', gradient: 'bg-secondary-600' },
  { label: 'Tickets', icon: Ticket, to: '/ticket-booking', gradient: 'bg-emerald-600' },
  { label: 'Alerts', icon: Bell, to: '/notifications', gradient: 'bg-amber-500' },
]

const features = [
  { icon: MapPin, title: 'Real-time Bus Tracking', description: 'See exactly when your bus will arrive at your stop.', link: '/bus-tracking', gradient: 'bg-primary-600' },
  { icon: CreditCard, title: 'Easy Ticket Booking', description: 'Book tickets in a few taps and secure your seat.', link: '/ticket-booking', gradient: 'bg-emerald-600' },
  { icon: Map, title: 'Route Planning', description: 'Find the best route, with transfers worked out for you.', link: '/route-planner', gradient: 'bg-secondary-600' },
  { icon: Bell, title: 'Notifications', description: 'Timely updates about delays and service changes.', link: '/notifications', gradient: 'bg-amber-500' },
  { icon: Clock, title: 'Schedule Viewing', description: 'Browse timings for every route in advance.', link: '/route-planner', gradient: 'bg-indigo-500' },
  { icon: Shield, title: 'Secure Payments', description: 'Pay with card, UPI or cash on board.', link: '/ticket-booking', gradient: 'bg-rose-500' },
]

const steps = [
  { title: 'Create an account', text: 'Sign up for free to unlock every feature.' },
  { title: 'Plan your journey', text: 'Use the route planner to find the best buses.' },
  { title: 'Book & travel', text: 'Book your ticket and track your bus live.' },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Daily Commuter',
    content: 'EaseBus has completely transformed my daily commute. I no longer have to guess when my bus will arrive, and booking tickets in advance has saved me so much time!',
  },
  {
    name: 'Michael Chen',
    role: 'Business Traveler',
    content: 'As someone who travels frequently for business, the route planner feature has been invaluable. It helps me navigate unfamiliar cities with ease and confidence.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Student',
    content: 'The affordable prices and reliable service make EaseBus perfect for students like me. The real-time tracking feature ensures I never miss my bus to class!',
  },
]

const Home = () => {
  const { user } = useAuth()
  const popularBuses = busService.getAllBuses().slice(0, 8)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-b-[40px] bg-gradient-to-br from-indigo-600 via-purple-600 to-primary-600 pb-20 pt-[calc(env(safe-area-inset-top)+4.5rem)] text-white">

        <div className="relative mx-auto max-w-2xl px-5 text-center">
          <p className="animate-slide-up text-sm font-medium text-white/70">
            {user ? `Welcome back, ${user.name?.split(' ')[0] || 'traveller'}` : 'Welcome to'}
          </p>
          <h1 className="animate-slide-up text-[44px] font-extrabold leading-none sm:text-[56px] tracking-tight text-yellow-400" style={{ animationDelay: '60ms' }}>
            EaseBus
          </h1>
          <p className="mt-2 animate-slide-up text-lg text-primary-100" style={{ animationDelay: '120ms' }}>
            Tracking Made Easy
          </p>

          <div className="mx-auto mt-6 max-w-sm" style={{ animationDelay: '200ms' }}>
            <AnimatedBus />
          </div>
        </div>
      </section>

      {/* Floating search */}
      <div className="relative z-10 mx-auto -mt-7 w-full max-w-2xl px-5">
        <Link
          to="/route-planner"
          className="flex h-14 animate-slide-up items-center gap-3 rounded-2xl bg-white px-4 shadow-ios-lg ring-1 ring-black/5 transition active:scale-[0.98]"
          style={{ animationDelay: '250ms' }}
        >
          <Search className="h-5 w-5 text-primary-600" />
          <span className="flex-1 text-[16px] text-gray-400">Where do you want to go?</span>
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">Plan</span>
        </Link>
      </div>

      <div className="mx-auto w-full max-w-2xl space-y-9 px-5 pt-7">
        {/* Quick actions */}
        <section className="grid grid-cols-4 gap-3">
          {quickActions.map(({ label, icon: Icon, to, gradient }, i) => (
            <Reveal key={label} index={i + 5}>
              <Link to={to} className="group flex flex-col items-center gap-2 transition active:scale-90">
                <span className={`flex h-[60px] w-[60px] items-center justify-center rounded-[20px] ${gradient} text-white shadow-ios transition-transform duration-300 ease-ios group-hover:-translate-y-0.5`}>
                  <Icon className="h-7 w-7" strokeWidth={2} />
                </span>
                <span className="text-xs font-semibold text-gray-700">{label}</span>
              </Link>
            </Reveal>
          ))}
        </section>

        {/* Popular routes */}
        <section>
          <div className="mb-3 flex items-end justify-between px-1">
            <h2 className="text-[22px] font-bold text-gray-900">Popular routes</h2>
            <Link to="/bus-tracking" className="flex items-center text-sm font-medium text-primary-600">
              See all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2">
            {popularBuses.map((bus) => (
              <Link
                key={bus.busId}
                to={`/bus-details/${bus.busId}`}
                className="card hover-lift w-[230px] flex-shrink-0 snap-start p-4 transition active:scale-[0.97]"
              >
                <div className="flex items-center justify-between">
                  <BusBadge id={bus.busId} />
                  <span className="text-xs font-medium text-gray-400">{bus.stops.length} stops</span>
                </div>
                <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-[15px] font-semibold leading-snug text-gray-900">{bus.route}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="truncate">{bus.stops[0]}</span>
                  <ArrowRight className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{bus.stops[bus.stops.length - 1]}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Features */}
        <section>
          <h2 className="mb-3 px-1 text-[22px] font-bold text-gray-900">Everything you need</h2>
          <div className="list-group">
            {features.map(({ icon: Icon, title, description, link, gradient }) => (
              <Link key={title} to={link} className="list-row gap-4 py-3.5">
                <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${gradient} text-white`}>
                  <Icon className="h-[22px] w-[22px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-semibold text-gray-900">{title}</h3>
                  <p className="mt-0.5 text-[13px] leading-snug text-gray-500">{description}</p>
                </div>
                <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-300" />
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="mb-3 px-1 text-[22px] font-bold text-gray-900">How it works</h2>
          <div className="card p-5">
            {steps.map((step, i) => (
              <div key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
                {i < steps.length - 1 && <span className="absolute left-[15px] top-9 h-[calc(100%-2.25rem)] w-0.5 rounded-full bg-primary-100" />}
                <span className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <h3 className="text-[15px] font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-0.5 text-sm text-gray-500">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="mb-3 px-1 text-[22px] font-bold text-gray-900">Loved by commuters</h2>
          <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2">
            {testimonials.map((t) => (
              <figure key={t.name} className="card w-[290px] flex-shrink-0 snap-start p-5">
                <div className="flex items-center gap-3">
                  <Avatar name={t.name} size="h-11 w-11" />
                  <figcaption>
                    <h4 className="text-[15px] font-semibold text-gray-900">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </figcaption>
                </div>
                <blockquote className="mt-3 text-[14px] leading-relaxed text-gray-600">“{t.content}”</blockquote>
              </figure>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden rounded-3xl bg-primary-700 p-6 text-center text-white shadow-ios-lg">
          <h2 className="relative text-2xl font-bold tracking-tight">Ready to simplify your bus travel?</h2>
          <p className="relative mx-auto mt-2 max-w-xs text-[15px] text-primary-100">
            Join thousands of travellers who ride smarter with EaseBus.
          </p>
          <div className="relative mt-5 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            {user ? (
              <Link to="/ticket-booking" className="btn btn-lg bg-white text-primary-700 hover:bg-primary-50">
                <Ticket className="h-5 w-5" /> Book a ticket
              </Link>
            ) : (
              <Link to="/register" className="btn btn-lg bg-white text-primary-700 hover:bg-primary-50">
                <Check className="h-5 w-5" strokeWidth={3} /> Sign up for free
              </Link>
            )}
            <Link to="/bus-tracking" className="btn btn-lg bg-white/15 text-white ring-1 ring-inset ring-white/30 hover:bg-white/25">
              Try bus tracking
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
