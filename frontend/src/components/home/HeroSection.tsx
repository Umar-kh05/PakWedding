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

          {/* Right Content - Dashboard Design */}
          <div className="relative h-full min-h-[600px] flex items-center justify-center lg:justify-end perspective-1000">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-primary-200/30 via-rose-200/20 to-amber-200/30 rounded-full blur-[80px] -z-10 animate-pulse"></div>
            
            {/* 3D Container */}
            <div className="relative w-full max-w-md transform transition-transform duration-700 hover:scale-[1.02] hover:rotate-1">
              
              {/* Main Glass Card */}
              <div className="bg-white/90 backdrop-blur-2xl border border-white/60 p-6 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] relative z-20">
                {/* Fake Window Controls */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100/80">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">Dashboard</div>
                  <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                </div>

                {/* Dashboard Grid */}
                <div className="space-y-4">
                  {/* Top Row: Budget & Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Budget Card */}
                    <div className="col-span-2 bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-100 shadow-sm group hover:border-primary-200 transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Budget</p>
                          <h3 className="text-2xl font-bold text-gray-800">PKR 1.5M</h3>
                        </div>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                        <div className="bg-primary-500 h-2 rounded-full w-[65%] shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 font-medium">
                        <span>Spent: 975k</span>
                        <span>65%</span>
                      </div>
                    </div>

                    {/* Count Cards */}
                    <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                      <span className="text-2xl mb-1">❤️</span>
                      <span className="text-sm font-bold text-gray-800">12 Vendors</span>
                      <span className="text-[10px] text-rose-600 font-medium bg-rose-100 px-2 py-0.5 rounded-full mt-1">Shortlisted</span>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                      <span className="text-2xl mb-1">📅</span>
                      <span className="text-sm font-bold text-gray-800">24 Oct</span>
                      <span className="text-[10px] text-amber-700 font-medium bg-amber-100 px-2 py-0.5 rounded-full mt-1">Save the Date</span>
                    </div>
                  </div>

                  {/* Task List */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                      Priority Tasks
                    </h4>
                    <div className="space-y-3">
                      {[
                        { text: 'Book Venue', done: true, tag: 'Done' },
                        { text: 'Finalize Menu', done: false, tag: 'Urgent' },
                        { text: 'Send Invites', done: false, tag: 'Pending' }
                      ].map((task, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-default">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${task.done ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-300 group-hover:border-primary-400'}`}>
                              {task.done && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className={`text-sm ${task.done ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>{task.text}</span>
                          </div>
                          <span className={`text-[10px] px-2 py-1 rounded-md font-medium ${
                            task.tag === 'Done' ? 'bg-green-100 text-green-700' :
                            task.tag === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {task.tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -right-12 top-20 bg-white p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 z-30 animate-[bounce_4s_infinite] hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">New Message</div>
                    <div className="text-xs text-gray-500">Decor vendor replied</div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-10 bottom-32 bg-white p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 z-30 animate-[bounce_5s_infinite] hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">Checklist</div>
                    <div className="text-xs text-green-600 font-medium">Task Completed!</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

