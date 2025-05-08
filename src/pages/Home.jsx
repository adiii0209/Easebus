import { Link } from 'react-router-dom'
import { MapPin, Clock, CreditCard, Map, Bell, Shield } from 'lucide-react'
import AnimatedBus from '../components/AnimatedBus'

const Home = () => {
  const features = [
    {
      icon: <MapPin className="h-10 w-10 text-primary-600" />,
      title: 'Real-time Bus Tracking',
      description: 'Track your bus in real-time and know exactly when it will arrive at your stop.',
      link: '/bus-tracking'
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary-600" />,
      title: 'Easy Ticket Booking',
      description: 'Book your bus tickets online with just a few clicks and secure your seat.',
      link: '/ticket-booking'
    },
    {
      icon: <Map className="h-10 w-10 text-primary-600" />,
      title: 'Route Planning',
      description: 'Plan your journey with our intelligent route planner to find the best route.',
      link: '/route-planner'
    },
    {
      icon: <Bell className="h-10 w-10 text-primary-600" />,
      title: 'Notifications',
      description: 'Get timely notifications about your bus, delays, and other important updates.',
      link: '/notifications'
    },
    {
      icon: <Clock className="h-10 w-10 text-primary-600" />,
      title: 'Schedule Viewing',
      description: 'View bus schedules for all routes and plan your journey accordingly.',
      link: '/route-planner'
    },
    {
      icon: <Shield className="h-10 w-10 text-primary-600" />,
      title: 'Secure Payments',
      description: 'Make secure payments for your tickets using various payment methods.',
      link: '/ticket-booking'
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Daily Commuter',
      content: 'EaseBus has completely transformed my daily commute. I no longer have to guess when my bus will arrive, and booking tickets in advance has saved me so much time!',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'Business Traveler',
      content: 'As someone who travels frequently for business, the route planner feature has been invaluable. It helps me navigate unfamiliar cities with ease and confidence.',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Student',
      content: 'The affordable prices and reliable service make EaseBus perfect for students like me. The real-time tracking feature ensures I never miss my bus to class!',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-primary-600 py-12 text-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-sans text-yellow-400 text-5xl md:text-7xl font-bold mb-3 animate-slide-down">
              EaseBus
            </h1>
            <p className="text-lg text-primary-100 mb-4 animate-slide-up delay-200">
              Tracking Made Easy
            </p>
          </div>
          <div className="mt-6 max-w-md mx-auto animate-slide-up delay-700">
            <AnimatedBus />
          </div>
          <div className="mt-8 flex justify-center space-x-6 animate-fade-in delay-500">
            <Link 
              to="/bus-tracking" 
              className="px-6 py-3 bg-white text-primary-700 rounded-full font-semibold hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Track Your Bus
            </Link>
            <Link 
              to="/ticket-booking" 
              className="px-6 py-3 bg-primary-700 text-white rounded-full font-semibold hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Book Tickets
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-600/30 pointer-events-none"></div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need for Hassle-free Travel
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Our comprehensive features make bus travel easier, more reliable, and more enjoyable than ever before.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600/10 text-primary-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-700">{feature.title}</h3>
                  <p className="mt-3 text-gray-600 group-hover:text-gray-700">{feature.description}</p>
                  <Link 
                    to={feature.link} 
                    className="mt-6 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 group-hover:underline"
                  >
                    Learn more
                    <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How EaseBus Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Get started with EaseBus in just a few simple steps.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Create an Account</h3>
              <p className="mt-2 text-gray-600">
                Sign up for a free account to access all features of EaseBus.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Plan Your Journey</h3>
              <p className="mt-2 text-gray-600">
                Use our route planner to find the best bus routes for your destination.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Book & Travel</h3>
              <p className="mt-2 text-gray-600">
                Book your tickets, track your bus in real-time, and enjoy your journey.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/register" className="btn btn-primary">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Thousands of people use EaseBus every day. Here's what some of them have to say.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Simplify Your Bus Travel?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
              Join thousands of satisfied users who have transformed their travel experience with EaseBus.
            </p>
            <div className="mt-10 flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50">
                Sign Up for Free
              </Link>
              <Link to="/bus-tracking" className="btn bg-primary-700 text-white hover:bg-primary-800 border border-white">
                Try Bus Tracking
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home