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
    <div className="bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 pt-20 pb-32 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-300/15 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-700 to-red-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <span>✨</span>
                <span>Pakistan's #1 Wedding Platform</span>
              </div>

              <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight">
                Your Dream
                <br />
                <span className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 bg-clip-text text-transparent">
                  Wedding
                </span>
                <br />
                Starts Here
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Connect with <strong className="text-red-700">1000+ vendors</strong>, plan your budget, and create unforgettable memories for your special day.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/vendors"
                  className="group bg-gradient-to-r from-red-700 to-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-red-800 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-600/30 flex items-center gap-2 transform hover:scale-105"
                >
                  Find Vendors
                  <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </Link>
                <Link
                  to="/budget-planner"
                  className="bg-white border-2 border-[#D72626] text-[#D72626] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#FEECEC] hover:border-[#D72626] hover:text-[#D72626] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Budget Planner
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-6">
                <div className="text-center p-4 rounded-xl bg-white backdrop-blur-sm border-2 border-[#F7A76C]/30 hover:border-[#F7A76C] hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#D72626] to-[#F26D46] bg-clip-text text-transparent">1000+</div>
                  <div className="text-sm text-gray-700 font-semibold mt-1">Vendors</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white backdrop-blur-sm border-2 border-[#F7A76C]/30 hover:border-[#F7A76C] hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#D72626] to-[#F26D46] bg-clip-text text-transparent">5000+</div>
                  <div className="text-sm text-gray-700 font-semibold mt-1">Happy Couples</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white backdrop-blur-sm border-2 border-[#F7A76C]/30 hover:border-[#F7A76C] hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#D72626] to-[#F26D46] bg-clip-text text-transparent">50+</div>
                  <div className="text-sm text-gray-700 font-semibold mt-1">Cities</div>
                </div>
              </div>
            </div>

            {/* Right Content - Wedding Planner Preview */}
            <div className="relative h-full min-h-[600px] flex items-center justify-center lg:justify-end">
              {/* Soft Background Glows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-primary-200/20 via-accent-200/15 to-amber-200/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
              
              {/* Wedding Planner Card Container */}
              <div className="relative w-full max-w-md transform transition-all duration-700 hover:scale-[1.02]">
                
                {/* Main Wedding Card */}
                <div className="bg-white/95 backdrop-blur-xl border-2 border-primary-100/60 p-8 rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] relative z-20 hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] transition-all duration-500">
                  
                  {/* Header with Icon */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full mb-4 shadow-lg">
                      <span className="text-3xl">💕</span>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
                      Your Dream Wedding
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Start planning your perfect day</p>
                  </div>

                  {/* Elegant Progress Circle */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      {/* Progress Ring */}
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#FEE2E2"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="url(#gradient)"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray="351.86"
                          strokeDashoffset="105.56"
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#D72626" />
                            <stop offset="50%" stopColor="#F26D46" />
                            <stop offset="100%" stopColor="#F6A423" />
                          </linearGradient>
                        </defs>
                      </svg>
                      {/* Center Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">70%</div>
                        <div className="text-xs text-gray-500 font-medium mt-1">Progress</div>
                      </div>
                    </div>
                  </div>

                  {/* Wedding Checklist */}
                  <div className="space-y-3 mb-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"></span>
                      Wedding Planning Steps
                    </h4>
                    
                    {[
                      { icon: '💒', text: 'Book Venue', status: 'complete' },
                      { icon: '🍽️', text: 'Finalize Menu', status: 'in-progress' },
                      { icon: '💌', text: 'Send Invites', status: 'pending' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary-50/50 to-accent-50/50 hover:from-primary-50 hover:to-accent-50 transition-all duration-300 group">
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                        <span className={`flex-1 text-sm font-medium ${
                          item.status === 'complete' ? 'text-gray-400 line-through' : 'text-gray-700'
                        }`}>
                          {item.text}
                        </span>
                        {item.status === 'complete' && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        {item.status === 'in-progress' && (
                          <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full">
                            In Progress
                          </span>
                        )}
                        {item.status === 'pending' && (
                          <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Wedding Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-6 border-t border-primary-100">
                    <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 hover:shadow-md transition-all duration-300 group">
                      <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">💝</div>
                      <div className="text-lg font-bold text-gray-800">8</div>
                      <div className="text-xs text-primary-600 font-medium">Vendors Selected</div>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-md transition-all duration-300 group">
                      <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">📆</div>
                      <div className="text-lg font-bold text-gray-800">45</div>
                      <div className="text-xs text-amber-700 font-medium">Days to Go</div>
                    </div>
                  </div>
                </div>

                {/* Floating Decorative Elements */}
                <div className="absolute -right-8 top-16 bg-white p-3 rounded-2xl shadow-xl border-2 border-primary-100 z-30 animate-[bounce_3s_infinite] hidden lg:block">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                  </div>
                </div>

                <div className="absolute -left-8 bottom-24 bg-white p-3 rounded-2xl shadow-xl border-2 border-primary-100 z-30 animate-[bounce_4s_infinite] hidden lg:block">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌸</span>
                  </div>
                </div>

                <div className="absolute -right-6 bottom-16 bg-white p-3 rounded-2xl shadow-xl border-2 border-amber-100 z-30 animate-[bounce_5s_infinite] hidden lg:block">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💐</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="py-24 bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 relative">
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
                className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl hover:shadow-primary-600/40 transition-all duration-500 transform hover:-translate-y-2 border-2 border-white hover:border-primary-300"
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
                  <p className="text-primary-200 text-sm font-medium drop-shadow-md group-hover:text-primary-100 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
                {/* Accent overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-amber-500/0 group-hover:from-primary-500/15 group-hover:to-amber-500/15 transition-all duration-500"></div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link
              to="/vendors"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white text-lg font-bold bg-gradient-to-r from-[#D72626] via-[#F26D46] to-[#F7A76C] hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Browse All Vendors
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-amber-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary-200/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-primary-600 via-amber-600 to-primary-600 bg-clip-text text-transparent">PakWedding</span>?
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
                gradient: 'from-primary-500 to-accent-500'
              },
              {
                icon: '💰',
                title: 'Budget Planning',
                description: 'Plan and track your wedding budget with our comprehensive budget planner tool.',
                gradient: 'from-amber-500 to-primary-500'
              },
              {
                icon: '📋',
                title: 'Easy Management',
                description: 'Stay organized with our wedding planning checklists and manage everything in one place.',
                gradient: 'from-accent-500 to-primary-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary-600/30 transition-all duration-500 transform hover:-translate-y-2 border-2 border-white hover:border-primary-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
                <div className="relative p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary-500/50 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:via-amber-600 group-hover:to-primary-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
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
      <section className="py-24 bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-amber-600 to-gray-900 bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              Simple steps to your dream wedding
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { step: '1', title: 'Sign Up', description: 'Create your free account', icon: '👤', gradient: 'from-primary-600 to-primary-700', ring: 'ring-primary-100', badge: 'from-primary-700 to-primary-800' },
              { step: '2', title: 'Browse', description: 'Search vendors by category', icon: '🔍', gradient: 'from-accent-600 to-accent-700', ring: 'ring-accent-100', badge: 'from-accent-700 to-accent-800' },
              { step: '3', title: 'Book', description: 'Send booking requests', icon: '📅', gradient: 'from-primary-600 to-accent-600', ring: 'ring-primary-100', badge: 'from-primary-700 to-accent-700' },
              { step: '4', title: 'Plan', description: 'Manage everything', icon: '✨', gradient: 'from-accent-600 to-primary-600', ring: 'ring-accent-100', badge: 'from-accent-700 to-primary-700' }
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-primary-600/30 transition-all duration-500 transform hover:-translate-y-2 border-2 border-white hover:border-primary-300"
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
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:via-amber-600 group-hover:to-primary-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
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
      <section className="py-24 bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-amber-200/10 rounded-full blur-3xl"></div>
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
            <div className="relative bg-white rounded-3xl p-12 shadow-2xl border-2 border-white hover:border-primary-300 transition-all duration-300">
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
                  <p className="text-xl font-bold bg-gradient-to-r from-primary-600 via-amber-600 to-primary-600 bg-clip-text text-transparent">
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
      <section className="py-24 bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-red-200/10 rounded-full blur-3xl"></div>
            </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Elegant heading */}
            <div className="mb-8">
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Begin Your Wedding Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Join thousands of couples who found their perfect wedding vendors on <span className="font-semibold text-red-700">PakWedding</span>
              </p>
            </div>

            {/* Elegant buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Link
                  to="/register"
                className="group bg-gradient-to-r from-red-700 to-red-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-red-800 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-600/30 transform hover:scale-105 flex items-center gap-2"
                >
                  Get Started Free
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
                <Link
                  to="/vendors"
                className="bg-white border-2 border-[#D72626] text-[#D72626] px-10 py-4 rounded-xl text-lg font-semibold hover:bg-[#FEECEC] hover:border-[#D72626] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Browse Vendors
                </Link>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-700 mb-2">1000+</div>
                <div className="text-sm text-gray-600 font-medium">Verified Vendors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-700 mb-2">5000+</div>
                <div className="text-sm text-gray-600 font-medium">Happy Couples</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-700 mb-2">50+</div>
                <div className="text-sm text-gray-600 font-medium">Cities Covered</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
