import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="bg-[#faf3f4]">

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

      {/* ================= BIG SEARCH BAR SECTION ================= */}
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

    </div>
  )
}
