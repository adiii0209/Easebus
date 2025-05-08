import { Link } from 'react-router-dom'
import { Bus, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react'
import '../styles/animations.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Careers', path: '/careers' },
        { name: 'Press', path: '/press' },
      ],
    },
    {
      title: 'Services',
      links: [
        { name: 'Bus Tracking', path: '/bus-tracking' },
        { name: 'Ticket Booking', path: '/ticket-booking' },
        { name: 'Route Planner', path: '/route-planner' },
        { name: 'Schedule', path: '/schedule' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', path: '/help' },
        { name: 'FAQs', path: '/faqs' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' },
      ],
    },
  ]

  return (
    <footer className="bg-gray-900 text-white animate-fade-in">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 hover-lift">
              <Bus className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold text-white">EaseBus</span>
            </Link>
            <p className="mt-4 text-gray-400">
              EaseBus provides a modern solution for bus transportation with real-time tracking,
              easy ticket booking, and route planning to make your journey seamless and stress-free.
            </p>
            <div className="mt-6 flex space-x-4 animate-slide-up">
              <a
                href="#"
                className="rounded-full bg-gray-800 p-2 text-gray-400 transition-all hover:bg-primary-600 hover:text-white hover-scale"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-gray-800 p-2 text-gray-400 transition-all hover:bg-primary-600 hover:text-white hover-scale"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-gray-800 p-2 text-gray-400 transition-all hover:bg-primary-600 hover:text-white hover-scale"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 transition-all hover:text-primary-400 hover-lift animate-slide-left"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:info@easebus.com"
                  className="flex items-center space-x-2 text-gray-400 transition-all hover:text-primary-400 hover-lift animate-slide-right"
                >
                  <Mail className="h-5 w-5" />
                  <span>info@easebus.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="flex items-center space-x-2 text-gray-400 transition-all hover:text-primary-400 hover-lift animate-slide-right"
                >
                  <Phone className="h-5 w-5" />
                  <span>+91 7044205279</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} EaseBus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer