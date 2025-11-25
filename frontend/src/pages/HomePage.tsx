import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-pink-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Plan Your Perfect Pakistani Wedding
          </h1>
          <p className="text-xl mb-8">
            Connect with the best wedding vendors across Pakistan
          </p>
          <Link
            to="/vendors"
            className="bg-white text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 inline-block"
          >
            Browse Vendors
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Wedding Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Photographers', 'Caterers', 'Venues', 'Decorators', 'Makeup Artists', 'Music & Entertainment'].map((category) => (
              <div key={category} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">{category}</h3>
                <p className="text-gray-600">Find the best {category.toLowerCase()} for your special day</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

