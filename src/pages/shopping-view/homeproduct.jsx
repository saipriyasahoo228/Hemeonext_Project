import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCurrency } from "@/context/currency-context";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { fetchProducts, addToCart } from "../../api/productApi";

// Professional Product Card Component
const ProductCard = ({ product, handleAddtoCart }) => {
  const { convertPrice, loading: currencyLoading } = useCurrency();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { cartItems, refreshCart } = useCart();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const navigate = useNavigate();

  const salePrice = product?.sale_price
    ? currencyLoading
      ? "..."
      : convertPrice(product.sale_price)
    : null;
  const actualPrice = currencyLoading ? "..." : convertPrice(product?.actual_price);
  const discountPercentage = product?.discount_percentage || 0;

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    setTogglingWishlist(true);
    try {
      setIsInWishlist(!isInWishlist);
    } catch (err) {
      console.error("Wishlist Toggle Error:", err);
    } finally {
      setTogglingWishlist(false);
    }
  };

  const handleAddToCartClick = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    setCartLoading(true);
    try {
      await handleAddtoCart(product.id, product.stock);
      await refreshCart();
    } catch (err) {
      console.error("Add to Cart Error:", err);
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to login to buy products",
        variant: "destructive",
      });
      return;
    }
    
    // Show toast message
    toast({
      title: "Buy Now",
      description: "Redirecting to checkout...",
      className: "bg-white border border-gray-200 text-gray-800",
    });
    
    // Navigate to buy now page
    navigate(`/shop/buy-now/${product.id}`);
  };

  const handleImageClick = () => {
    navigate(`/shop/product/${product.id}`);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:border-gray-200"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Product Image */}
      <div className="relative bg-gray-50 aspect-square flex items-center justify-center p-4 cursor-pointer" onClick={handleImageClick}>
        <img
          src={product.images?.[0]?.image || "/placeholder-product.jpg"}
          alt={product.title}
          className="object-contain w-full h-40 transition-transform duration-300 hover:scale-105"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={togglingWishlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:bg-gray-50"
        >
          {togglingWishlist ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
          ) : (
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${
                isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
              strokeWidth={1.5}
            />
          )}
        </button>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Stock Status */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white px-3 py-1 rounded text-sm font-medium text-gray-800">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Category/Brand */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {product.brand?.name || product.category?.name || "Product"}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-500">
              {product.average_rating || "0.0"}
            </span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 h-10 cursor-pointer" onClick={handleImageClick}>
          {product.title}
        </h3>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-gray-900">
            {salePrice || actualPrice}
          </span>
          {salePrice && (
            <span className="text-sm text-gray-500 line-through">
              {actualPrice}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="w-full bg-green-600 hover:bg-green-800 text-white font-medium py-2 text-sm transition-all duration-200"
          >
            <ShoppingBag className="w-4 h-4 mr-1" />
            Buy Now
          </Button>
          <Button
            onClick={handleAddToCartClick}
            disabled={cartLoading || product.stock === 0}
            variant="outline"
            className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 text-sm transition-all duration-200"
          >
            {cartLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Product Grid Component
const ProductGrid = ({ 
  category = null, 
  subcategory = null, 
  limit = null,
  title = "Featured Products",
  showHeader = true 
}) => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { cartItems, refreshCart } = useCart();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const params = {};

        if (category) {
          params.category__slug = category;
        }
        if (subcategory) {
          params.subcategory__slug = subcategory;
        }
        if (limit) {
          params.limit = limit;
        }

        console.log("Fetching products with params:", params);
        const products = await fetchProducts(params);
        
        // Apply limit after fetching if needed
        const finalProducts = limit ? products.slice(0, limit) : products;
        setProductList(finalProducts);
      } catch (err) {
        setError("Failed to load products.");
        toast({
          title: "Error",
          description: "Failed to load products.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [category, subcategory, limit, toast]);

  const handleAddtoCart = async (getCurrentProductId, getTotalStock) => {
    if (cartItems.length >= 10 && !cartItems.some(item => item.product.id === getCurrentProductId)) {
      toast({
        title: "Cart Limit Reached",
        description: "You can only add up to 10 different items to your cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addToCart(getCurrentProductId, 1, "", "");
      await refreshCart();
      toast({
        title: "Product added to cart",
        className: "bg-white border border-gray-200 text-gray-800",
      });
    } catch (err) {
      console.error("Add to Cart Error:", err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to add product to cart.",
        variant: "destructive",
      });
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 px-4"> {/* Added px-4 */}
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 px-4"> {/* Added px-4 */}
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4"> {/* Added px-4 for horizontal padding */}
      {showHeader && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">{productList.length} products</p>
        </div>
      )}
      
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {productList.length > 0 ? (
          productList.map((productItem) => (
            <motion.div key={productItem.id} variants={item}>
              <ProductCard
                product={productItem}
                handleAddtoCart={handleAddtoCart}
              />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center px-4"> {/* Added px-4 */}
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">No products available at the moment.</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProductGrid;