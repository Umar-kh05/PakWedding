import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
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
                className="bg-white border-2 border-amber-600 text-amber-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-amber-50 hover:border-amber-700 hover:text-amber-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Budget Planner
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-6">
              <div className="text-center p-4 rounded-xl bg-white backdrop-blur-sm border-2 border-amber-100 hover:border-amber-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold bg-gradient-to-r from-red-700 to-amber-600 bg-clip-text text-transparent">1000+</div>
                <div className="text-sm text-gray-700 font-semibold mt-1">Vendors</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white backdrop-blur-sm border-2 border-amber-100 hover:border-amber-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold bg-gradient-to-r from-red-700 to-amber-600 bg-clip-text text-transparent">5000+</div>
                <div className="text-sm text-gray-700 font-semibold mt-1">Happy Couples</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white backdrop-blur-sm border-2 border-amber-100 hover:border-amber-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-bold bg-gradient-to-r from-red-700 to-amber-600 bg-clip-text text-transparent">50+</div>
                <div className="text-sm text-gray-700 font-semibold mt-1">Cities</div>
              </div>
            </div>
          </div>

          {/* Right Content - Simple Elegant Design */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Decorative Elements */}
            <div className="relative w-full max-w-lg">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 via-amber-50 to-orange-100 rounded-full blur-3xl opacity-60"></div>
              
              {/* Main Content Card */}
              <div className="relative bg-white rounded-3xl p-12 shadow-2xl border-4 border-red-100">
                {/* Icon Grid */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="flex flex-col items-center gap-3 p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <span className="text-xs font-bold text-gray-700 text-center">Find Vendors</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-3 p-4 bg-amber-50 rounded-2xl hover:bg-amber-100 transition-colors duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-xs font-bold text-gray-700 text-center">Plan Budget</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-3 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    </div>
                    <span className="text-xs font-bold text-gray-700 text-center">Checklist</span>
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-white rounded-xl border-l-4 border-red-600">
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">1000+ Vendors</h4>
                      <p className="text-sm text-gray-600">All verified & reviewed</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-white rounded-xl border-l-4 border-amber-600">
                    <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Budget Planner</h4>
                      <p className="text-sm text-gray-600">Track every expense</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-white rounded-xl border-l-4 border-orange-600">
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Easy Booking</h4>
                      <p className="text-sm text-gray-600">Book with one click</p>
                    </div>
                  </div>
                </div>

                {/* Decorative Ring */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-red-600 to-amber-600 rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-amber-600 to-orange-600 rounded-full opacity-20 blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

