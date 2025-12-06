export default function Footer() {
  return (
    <footer className="bg-[#121212] text-white py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-primary-400 transition-colors duration-300 cursor-pointer">About Us</li>
            <li className="hover:text-primary-400 transition-colors duration-300 cursor-pointer">Careers</li>
            <li className="hover:text-primary-400 transition-colors duration-300 cursor-pointer">Press</li>
            <li className="hover:text-primary-400 transition-colors duration-300 cursor-pointer">Blog</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-primary-400 transition-colors duration-300 cursor-pointer">Find Vendors</li>
            <li className="hover:text-primary-400 transition-colors duration-300 cursor-pointer">Budget Planner</li>
            <li className="hover:text-primary-400 transition-colors duration-300 cursor-pointer">Checklists</li>
            <li className="hover:text-primary-400 transition-colors duration-300 cursor-pointer">Inspiration</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-primary-400 transition-colors duration-300 cursor-pointer">Help Center</li>
            <li className="hover:text-primary-400 transition-colors duration-300 cursor-pointer">Contact Us</li>
            <li className="hover:text-primary-400 transition-colors duration-300 cursor-pointer">FAQs</li>
            <li className="hover:text-primary-400 transition-colors duration-300 cursor-pointer">Terms of Service</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Connect</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-primary-400 transition-colors duration-300 cursor-pointer">Facebook</li>
            <li className="hover:text-primary-400 transition-colors duration-300 cursor-pointer">Instagram</li>
            <li className="hover:text-primary-400 transition-colors duration-300 cursor-pointer">Twitter</li>
            <li className="hover:text-primary-400 transition-colors duration-300 cursor-pointer">Pinterest</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        © 2025 PakWedding. All rights reserved. Made with ❤️ in Pakistan.
      </div>
    </footer>
  )
}

