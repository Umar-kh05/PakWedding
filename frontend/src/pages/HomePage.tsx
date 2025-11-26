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

              <button
                className="border-2 border-pink-600 text-pink-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-50"
              >
                View Budget Planner
              </button>
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


      {/* ================== BLACK FOOTER STYLE SECTION ================== */}
      <section className="bg-[#121212] text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Blog</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Find Vendors</li>
              <li>Budget Planner</li>
              <li>Checklists</li>
              <li>Inspiration</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>FAQs</li>
              <li>Terms of Service</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Facebook</li>
              <li>Instagram</li>
              <li>Twitter</li>
              <li>Pinterest</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
          © 2025 PakWedding. All rights reserved. Made with ❤️ in Pakistan.
        </div>
      </section>

    </div>
  )
}
