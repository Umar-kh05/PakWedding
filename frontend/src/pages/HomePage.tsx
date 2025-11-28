import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="bg-[#faf3f4] min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-4">
        <div className="container mx-auto px-10 grid md:grid-cols-2 items-center">
          <div>
            <h1 className="text-6xl font-extrabold text-black mb-6 leading-tight">
              Plan Your Perfect <br /> Pakistani Wedding
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-xl">
              Connect with 1000+ verified vendors, manage your budget,
              and create unforgettable memories.
            </p>
            <div className="flex gap-5">
              <Link
                to="/vendors"
                className="bg-pink-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-700"
              >
                Find Vendors
              </Link>
              <Link
                to="/budget-planner"
                className="border-2 border-pink-600 text-pink-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-50"
              >
                View Budget Planner
              </Link>
            </div>
          </div>
          <div></div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="max-w-7xl mx-auto px-4 pt-2 pb-20">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search for vendors, services, venues..."
            className="flex-1 h-14 px-4 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Location"
            className="md:w-72 h-14 px-4 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 h-14 rounded-lg font-semibold whitespace-nowrap">
            Search
          </button>
        </div>
      </section>

      {/* Features Overview Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose PakWedding?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Find Verified Vendors</h3>
              <p className="text-gray-600">Browse through 1000+ verified wedding vendors across Pakistan. All vendors are verified and reviewed.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Budget Planning</h3>
              <p className="text-gray-600">Plan and track your wedding budget with our comprehensive budget planner tool.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Wedding Checklists</h3>
              <p className="text-gray-600">Stay organized with our wedding planning checklists and never miss an important task.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-sm text-gray-600">Create your free account in seconds</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Browse Vendors</h3>
              <p className="text-sm text-gray-600">Search and compare vendors by category</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Book Services</h3>
              <p className="text-sm text-gray-600">Send booking requests to your chosen vendors</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Plan Your Day</h3>
              <p className="text-sm text-gray-600">Manage everything in one place</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Popular Categories</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {['Photographers', 'Venues', 'Caterers', 'Decorators', 'Makeup Artists', 'Music & Entertainment', 'Transportation', 'Invitations'].map((category) => (
              <Link
                key={category}
                to={`/vendors?category=${category}`}
                className="bg-white rounded-lg p-6 shadow-md text-center hover:shadow-lg transition-shadow hover:text-pink-600"
              >
                <h3 className="font-semibold text-gray-900">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
