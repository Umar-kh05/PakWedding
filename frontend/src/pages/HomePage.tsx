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
      image: '/images/venue-decor.png',
      title: 'Beautiful Venues',
      description: 'Find stunning venues perfect for your celebration'
    },
    {
      image: '/images/decorator.png',
      title: 'Elegant Decorations',
      description: 'Create the perfect ambiance for your special day'
    },
    {
      image: '/images/catering.png',
      title: 'Delicious Catering',
      description: 'Treat your guests to exquisite cuisine'
    },
    {
      image: '/images/dream-settings.png',
      title: 'Dream Settings',
      description: 'Make your wedding vision come to life'
    },
    {
      image: '/images/perfect-details.png',
      title: 'Perfect Details',
      description: 'Every detail crafted to perfection'
    },
    {
      image: '/images/memorable-experiences.png',
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
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-20 pb-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-5 py-2 rounded-full text-sm font-semibold">
                <span>✨</span>
                <span>Pakistan's #1 Wedding Platform</span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight">
                Your Dream
                <br />
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Wedding
                </span>
                <br />
                Starts Here
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Connect with <strong className="text-pink-600">1000+ vendors</strong>, plan your budget, and create unforgettable memories for your special day.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/vendors"
                  className="group bg-gradient-to-r from-pink-600 to-pink-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-pink-700 hover:to-pink-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  Find Vendors
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  to="/budget-planner"
                  className="bg-white border-2 border-pink-600 text-pink-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-pink-50 transition-all shadow-md"
                >
                  Budget Planner
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">1000+</div>
                  <div className="text-sm text-gray-600 font-medium">Vendors</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">5000+</div>
                  <div className="text-sm text-gray-600 font-medium">Happy Couples</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">50+</div>
                  <div className="text-sm text-gray-600 font-medium">Cities</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/hero-couple.png"
                  alt="Wedding Couple"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
              Plan Your Perfect Wedding
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to make your special day unforgettable
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {showcaseImages.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-pink-200 text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link
              to="/vendors"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-pink-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Browse All Vendors
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">PakWedding</span>?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: '🔍',
                title: 'Find Best Vendors',
                description: 'Browse through 1000+ wedding vendors across Pakistan. All vendors are reviewed by real couples.',
                gradient: 'from-pink-500 to-rose-500'
              },
              {
                icon: '💰',
                title: 'Budget Planning',
                description: 'Plan and track your wedding budget with our comprehensive budget planner tool.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: '📋',
                title: 'Easy Management',
                description: 'Stay organized with our wedding planning checklists and manage everything in one place.',
                gradient: 'from-rose-500 to-pink-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className="relative p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to your dream wedding
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { step: '1', title: 'Sign Up', description: 'Create your free account', icon: '👤', color: 'pink' },
              { step: '2', title: 'Browse', description: 'Search vendors by category', icon: '🔍', color: 'purple' },
              { step: '3', title: 'Book', description: 'Send booking requests', icon: '📅', color: 'rose' },
              { step: '4', title: 'Plan', description: 'Manage everything', icon: '✨', color: 'pink' }
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl">{item.icon}</span>
                    </div>
                    <div className={`absolute -top-2 -right-2 w-8 h-8 bg-${item.color}-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auto-Moving Testimonials */}
      <section className="py-24 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
              What Couples Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real couples
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-3xl p-12 shadow-xl">
              {/* Testimonial Content */}
              <div className="text-center">
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-3xl">⭐</span>
                  ))}
                </div>
                <p className="text-2xl text-gray-800 mb-8 italic leading-relaxed font-medium">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div className="space-y-2">
                  <p className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
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
                      ? 'bg-pink-600 w-10 h-3'
                      : 'bg-gray-300 w-3 h-3 hover:bg-gray-400'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-5xl font-extrabold text-white mb-6">
                Ready to Start Planning?
              </h2>
              <p className="text-xl text-pink-100 mb-10 max-w-2xl mx-auto">
                Join thousands of couples who found their perfect wedding vendors on PakWedding
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/register"
                  className="bg-white text-pink-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-pink-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/vendors"
                  className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-pink-600 transition-all transform hover:scale-105"
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
