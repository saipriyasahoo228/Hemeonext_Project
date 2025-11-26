import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function MenuComponent({ categories }) {
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <div className="w-full bg-white shadow-sm border-b border-gray-100">
      {/* Main Categories Bar */}
      <div className="flex items-center justify-center px-6 py-4">
        {/* Main Categories - Centered */}
        <div className="flex items-center space-x-10">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(category.slug)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center text-gray-800 hover:text-gray-900 font-medium text-sm transition-colors duration-200 py-2">
                  {category.name}
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === category.slug && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="p-6">
                      {/* Subcategories */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide border-b border-gray-100 pb-2">
                          {category.name}
                        </h4>
                        <div className="space-y-3">
                          {category.subcategories?.map((subcat) => (
                            <Link
                              key={subcat.id}
                              to={`/shop/listing?category=${category.slug}&subcategory=${subcat.slug}`}
                              className="block text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200 hover:bg-gray-50 px-3 py-2 rounded-md"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {subcat.name}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Section */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link
                          to={`/shop/listing?category=${category.slug}`}
                          className="text-gray-700 font-medium text-sm hover:text-gray-900 transition-colors duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          View all {category.name} products
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            // Fallback categories if no data
            <div className="flex space-x-10">
              {['Homeopathy', 'Ayurveda', 'Nutrition', 'Personal Care', 'Baby Care', 'Fitness'].map((cat) => (
                <div key={cat} className="relative group">
                  <button className="flex items-center text-gray-800 hover:text-gray-900 font-medium text-sm transition-colors duration-200 py-2">
                    {cat}
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Categories Link */}
        <div className="ml-10">
          <Link
            to="/shop/listing"
            className="text-gray-700 font-medium text-sm hover:text-gray-900 transition-colors duration-200"
          >
            All Categories
          </Link>
        </div>
      </div>
    </div>
  );
}