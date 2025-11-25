import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "@/context/currency-context";

function ShoppingProductTile({ product, handleAddtoCart }) {
  const { convertPrice } = useCurrency();

  // Convert prices using the context's convertPrice function
  const salePrice = product?.sale_price ? convertPrice(product.sale_price) : null;
  const actualPrice = convertPrice(product?.actual_price);

  // Calculate discount percentage if sale_price exists and is less than actual_price
  const discountPercentage = product?.discount_percentage || 0;

  // Get the primary image
  const primaryImage =
    product?.images?.find((img) => img.is_primary)?.image ||
    product?.images?.[0]?.image ||
    "https://via.placeholder.com/150"; // Fallback image if none exists

  return (
    <Card className="w-4/3 md:w-[180px] mx-auto bg-transparent shadow-none group relative border-none hover:cursor-pointer">
      <div className="relative mb-4 md:mb-0 flex flex-row md:flex-col items-center">
        {/* Product Image */}
        <div className="relative w-1/2 md:w-full md:overflow-hidden rounded-md">
          <Link to={`/shop/product/${product.id}`}>
            <img
              src={primaryImage}
              alt={product?.title}
              className="w-full h-[150px] object-contain rounded-md transition-transform duration-500 ease-in-out group-hover:scale-110"
              style={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.06)",
                transform: "translateZ(0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.transition = "transform 0.5s ease-in-out";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.transition = "transform 0.5s ease-in-out";
              }}
            />
          </Link>

          {/* Badges for Stock and Discount */}
          {product?.stock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white font-medium">
              Out of Stock
            </Badge>
          ) : product?.stock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600 text-white font-medium">
              {`Only ${product?.stock} left`}
            </Badge>
          ) : discountPercentage > 0 ? (
            <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600 text-white font-medium">
              {`${discountPercentage}% Off`}
            </Badge>
          ) : null}
        </div>

        {/* Product Details */}
        <CardContent className="px-2 py-2 w-1/2 md:w-full">
        <Link to={`/shop/product/${product.id}`}>

          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight truncate">
            {product?.title}
          </h2>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{product?.category?.name}</span>
            <span>{product?.brand?.name}</span>
          </div>

          {/* Price Display */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {salePrice || actualPrice} {/* Show sale_price if available, otherwise actual_price */}
            </span>
            {salePrice && discountPercentage > 0 && (
              <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                {actualPrice}
              </span>
            )}
          </div>
        </Link>
        </CardContent>
     
      </div>

      {/* Uncomment this section if you want the footer with buttons */}
      {/* <CardFooter className="relative h-10">
        <div className="absolute inset-0 flex items-center justify-center space-x-3 opacity-0 translate-y-3 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-500 ease-in-out">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 shadow-lg"></div>

          <button className="p-2 bg-white/20 rounded-full shadow-md backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-6 hover:bg-white/30">
            <Heart size={18} className="text-red-500" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent navigation when clicking cart
              handleAddtoCart(product?.id, product?.stock);
            }}
            className="p-2 bg-white/20 rounded-full shadow-md backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-6 hover:bg-white/30"
          >
            <ShoppingCart size={18} className="text-blue-500" />
          </button>
        </div>
      </CardFooter> */}
    </Card>
  );
}

export default ShoppingProductTile;