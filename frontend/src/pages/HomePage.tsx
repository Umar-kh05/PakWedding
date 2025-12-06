import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Ayesha & Ahmed",
      text: "PakWedding made our dream wedding come true! Found the perfect vendors in minutes.",
      location: "Lahore"
    },
    {
      name: "Fatima & Hassan",
      text: "The budget planner was a lifesaver. Highly recommend to all couples!",
      location: "Karachi"
    },
    {
      name: "Sara & Ali",
      text: "Amazing platform! Everything we needed in one place. Thank you PakWedding!",
      location: "Islamabad"
    }
  ]

  const showcaseImages = [
    {
      image: 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965365/homepage/homepage/homepage-venue-decor.jpg',
      title: 'Beautiful Venues',
      description: 'Find stunning venues perfect for your celebration'
    },
    {
      image: 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965382/homepage/homepage/homepage-decorator.png',
      title: 'Elegant Decorations',
      description: 'Create the perfect ambiance for your special day'
    },
    {
      image: 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965383/homepage/homepage/homepage-catering.jpg',
      title: 'Delicious Catering',
      description: 'Treat your guests to exquisite cuisine'
    },
    {
      image: 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965389/homepage/homepage/homepage-dream-settings.png',
      title: 'Dream Settings',
      description: 'Make your wedding vision come to life'
    },
    {
      image: 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965397/homepage/homepage/homepage-perfect-details.png',
      title: 'Perfect Details',
      description: 'Every detail crafted to perfection'
    },
    {
      image: 'https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965410/homepage/homepage/homepage-memorable-experiences.png',
      title: 'Memorable Experiences',
      description: 'Create unforgettable moments for your guests'
    }
  ]

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-b from-rose-50/30 via-white to-rose-50/20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-100 via-accent-50 to-rose-100 pt-20 pb-32 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl hover:shadow-primary-500/50 transition-all duration-300 transform hover:scale-105">
                <span>✨</span>
                <span>Pakistan's #1 Wedding Platform</span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight">
                Your Dream
                <br />
                <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
                  Wedding
                </span>
                <br />
                Starts Here
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Connect with <strong className="text-primary-600">1000+ vendors</strong>, plan your budget, and create unforgettable memories for your special day.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/vendors"
                  className="group bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-primary-700 hover:via-accent-700 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-600/50 flex items-center gap-2 transform hover:scale-105"
                >
                  Find Vendors
                  <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </Link>
                <Link
                  to="/budget-planner"
                  className="bg-white border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gradient-to-r hover:from-primary-50 hover:via-accent-50 hover:to-primary-50 hover:border-primary-700 hover:text-primary-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Budget Planner
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-6">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-rose-50 to-white backdrop-blur-sm border-2 border-rose-200 hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 transform hover:scale-105">
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">1000+</div>
                  <div className="text-sm text-gray-700 font-semibold mt-1">Vendors</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-rose-50 to-white backdrop-blur-sm border-2 border-rose-200 hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 transform hover:scale-105">
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">5000+</div>
                  <div className="text-sm text-gray-700 font-semibold mt-1">Happy Couples</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-rose-50 to-white backdrop-blur-sm border-2 border-rose-200 hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 transform hover:scale-105">
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">50+</div>
                  <div className="text-sm text-gray-700 font-semibold mt-1">Cities</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-4 ring-primary-200/50 hover:ring-primary-400/70 transition-all duration-300">
                <img
                  src="https://res.cloudinary.com/dsk2eyecb/image/upload/v1764965356/homepage/homepage/homepage-hero-couple.jpg"
                  alt="Wedding Couple"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-accent-900/30 via-primary-900/10 to-transparent"></div>
                {/* Decorative border glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 rounded-3xl opacity-20 blur-xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="py-24 bg-gradient-to-b from-rose-50/40 via-white to-rose-50/30 relative">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,_rgb(0,0,0)_1px,_transparent_0)] [background-size:40px_40px]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-primary-600 to-gray-900 bg-clip-text text-transparent mb-4">
              Plan Your Perfect Wedding
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              Everything you need to make your special day unforgettable
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {showcaseImages.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary-600/40 transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary-300"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-primary-900/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg group-hover:text-primary-200 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-rose-200 text-sm font-medium drop-shadow-md group-hover:text-rose-100 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
                {/* Accent overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/15 group-hover:to-accent-500/15 transition-all duration-500"></div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link
              to="/vendors"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-primary-700 hover:via-accent-700 hover:to-primary-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary-600/50 transform hover:scale-105"
            >
              Browse All Vendors
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gradient-to-br from-rose-50 via-accent-50/50 to-rose-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-accent-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary-200/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">PakWedding</span>?
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              Everything you need in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: '🔍',
                title: 'Find Best Vendors',
                description: 'Browse through 1000+ wedding vendors across Pakistan. All vendors are reviewed by real couples.',
                gradient: 'from-primary-500 to-rose-500'
              },
              {
                icon: '💰',
                title: 'Budget Planning',
                description: 'Plan and track your wedding budget with our comprehensive budget planner tool.',
                gradient: 'from-accent-500 to-primary-500'
              },
              {
                icon: '📋',
                title: 'Easy Management',
                description: 'Stay organized with our wedding planning checklists and manage everything in one place.',
                gradient: 'from-rose-500 to-primary-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary-600/30 transition-all duration-500 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-primary-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
                <div className="relative p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary-500/50 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:via-accent-600 group-hover:to-primary-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-white via-rose-50/30 to-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-accent-600 to-gray-900 bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              Simple steps to your dream wedding
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { step: '1', title: 'Sign Up', description: 'Create your free account', icon: '👤', gradient: 'from-primary-500 to-primary-600', ring: 'ring-primary-100', badge: 'from-primary-600 to-primary-700' },
              { step: '2', title: 'Browse', description: 'Search vendors by category', icon: '🔍', gradient: 'from-accent-500 to-accent-600', ring: 'ring-accent-100', badge: 'from-accent-600 to-accent-700' },
              { step: '3', title: 'Book', description: 'Send booking requests', icon: '📅', gradient: 'from-rose-500 to-rose-600', ring: 'ring-rose-100', badge: 'from-rose-600 to-rose-700' },
              { step: '4', title: 'Plan', description: 'Manage everything', icon: '✨', gradient: 'from-primary-500 to-primary-600', ring: 'ring-primary-100', badge: 'from-primary-600 to-primary-700' }
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-primary-600/30 transition-all duration-500 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-primary-300"
              >
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-primary-500/50 transition-all duration-300 ring-4 ${item.ring} group-hover:ring-primary-300`}>
                      <span className="text-3xl">{item.icon}</span>
                    </div>
                    <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br ${item.badge} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white group-hover:scale-110 transition-transform duration-300`}>
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:via-accent-600 group-hover:to-primary-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 font-medium">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auto-Moving Testimonials */}
      <section className="py-24 bg-gradient-to-br from-rose-50 via-accent-50/50 to-rose-50 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-accent-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary-200/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
              What Couples Say
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              Real stories from real couples
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-3xl p-12 shadow-2xl border-2 border-rose-100 hover:border-primary-300 transition-all duration-300">
              {/* Testimonial Content */}
              <div className="text-center">
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-3xl hover:text-yellow-500 transition-colors duration-300">⭐</span>
                  ))}
                </div>
                <p className="text-2xl text-gray-800 mb-8 italic leading-relaxed font-medium">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div className="space-y-2">
                  <p className="text-xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-gray-600">
                    {testimonials[currentTestimonial].location}
                  </p>
                </div>
              </div>

              {/* Indicators */}
              <div className="flex justify-center gap-2 mt-10">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`transition-all duration-300 rounded-full ${index === currentTestimonial
                      ? 'bg-primary-600 w-10 h-3 shadow-lg shadow-primary-600/50'
                      : 'bg-gray-300 w-3 h-3 hover:bg-primary-400 hover:w-6'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-rose-50/40 via-white to-rose-50/30 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden ring-4 ring-primary-200/50 hover:ring-primary-300/70 transition-all duration-300">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-5xl font-extrabold text-white mb-6">
                Ready to Start Planning?
              </h2>
              <p className="text-xl text-rose-50 font-medium mb-10 max-w-2xl mx-auto">
                Join thousands of couples who found their perfect wedding vendors on PakWedding
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/register"
                  className="bg-white text-primary-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-primary-50 hover:text-primary-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-white/50 transform hover:scale-105"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/vendors"
                  className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Browse Vendors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
