// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { fetchProducts } from "@/api/productApi"; // Use fetchProducts
// import { useToast } from "@/components/ui/use-toast";
// import { Loader2 } from "lucide-react";
// import ShoppingProductTile from "./product-tile";

// export default function RelatedItems({ categoryId, currentProductId }) {
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadRelatedProducts = async () => {
//       try {
//         setLoading(true);
//         // Fetch all products
//         const products = await fetchProducts();
//         // Filter products by category and exclude the current product
//         const filteredProducts = products
//           .filter(
//             (product) =>
//               product.category.id === categoryId &&
//               product.id !== currentProductId
//           )
//           .slice(0, 4); // Limit to 4 items
//         setRelatedProducts(filteredProducts);
//       } catch (err) {
//         console.error("Related Products Fetch Error:", err);
//         toast({
//           title: "Error",
//           description: "Failed to load related products.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadRelatedProducts();
//   }, [categoryId, currentProductId, toast]);

//   if (loading) {
//     return (
//       <div className="py-6 flex justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
//       </div>
//     );
//   }

//   if (relatedProducts.length === 0) {
//     return null; // Don't render if no related products
//   }

//   return (
//     <div className="py-16 px-6">
//       <h2 className="text-2xl ml-6 font-bold text-gray-800 dark:text-white mb-6">
//         Related Items
//       </h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {relatedProducts.map((product) => (
//             <ShoppingProductTile
//                   product={product}/>
//         ))}
//       </div>
//     </div>
//   );
// }








import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "@/api/productApi";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
import ShoppingProductTile from "./product-tile";
import { useCurrency } from "@/context/currency-context";

export default function RelatedItems({ categoryId, currentProductId }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { convertPrice } = useCurrency();

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        const filteredProducts = products
          .filter(
            (product) =>
              product.category.id === categoryId &&
              product.id !== currentProductId
          )
          .slice(0, 4);
        setRelatedProducts(filteredProducts);
      } catch (err) {
        console.error("Related Products Fetch Error:", err);
        toast({
          title: "Error",
          description: "Failed to load related products.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadRelatedProducts();
  }, [categoryId, currentProductId, toast]);

  if (loading) {
    return (
      <div className="py-16 px-6 bg-gradient-to-br from-[#F0FFF8] to-[#E8F7F0]">
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Loader2 className="h-12 w-12 animate-spin text-[#2D5016]" />
          </motion.div>
          <p className="text-[#5A7D3E] font-medium">Loading related items...</p>
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-16 px-6 bg-gradient-to-br from-[#F0FFF8] to-[#E8F7F0]">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-[#2D5016]" />
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#2D5016] to-[#5A7D3E] bg-clip-text text-transparent">
              You Might Also Like
            </h2>
            <Sparkles className="h-6 w-6 text-[#2D5016]" />
          </div>
          <p className="text-[#5A7D3E] text-lg max-w-2xl mx-auto">
            Discover more amazing products from the same category
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {relatedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              {/* Enhanced Product Card Container */}
              <div className="group relative">
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#C9F0DD] to-[#2D5016]/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"></div>
                
                {/* Main Card */}
                <div className="relative bg-gradient-to-br from-white to-[#F8FFFC] rounded-2xl shadow-2xl border-2 border-[#C9F0DD] hover:border-[#2D5016] transition-all duration-300 overflow-hidden backdrop-blur-sm">
                  
                  {/* Header Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    {product.discount_percentage > 0 && (
                      <span className="bg-gradient-to-r from-[#2D5016] to-[#5A7D3E] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {product.discount_percentage}% OFF
                      </span>
                    )}
                  </div>

                  {/* Stock Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full shadow-lg ${
                      product.stock === 0 
                        ? "bg-red-600 text-white" 
                        : product.stock < 10 
                        ? "bg-amber-600 text-white" 
                        : "bg-green-600 text-white"
                    }`}>
                      {product.stock === 0 ? "Out of Stock" : `${product.stock} left`}
                    </span>
                  </div>

                  {/* Product Content */}
                  <div className="p-6">
                    {/* Image Container */}
                    <div className="relative mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-[#C9F0DD] to-[#E8F7F0]">
                      <img
                        src={product.images?.[0]?.image || "/placeholder-product.jpg"}
                        alt={product.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2D5016]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      {/* Title */}
                      <h3 className="font-semibold text-[#2D5016] text-lg leading-tight line-clamp-2 group-hover:text-[#1E3D12] transition-colors duration-300">
                        {product.title}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-sm ${
                                star <= Math.floor(product.average_rating || 0)
                                  ? "text-[#FFD666]"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-[#5A7D3E]">
                          ({product.review_count || 0})
                        </span>
                      </div>

                      {/* Price Section */}
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-[#2D5016] bg-gradient-to-r from-[#C9F0DD] to-[#E8F7F0] px-3 py-1 rounded-lg border border-[#C9F0DD]">
                          {convertPrice(product.sale_price || product.actual_price)}
                        </span>
                        {product.sale_price && (
                          <span className="text-sm text-gray-500 line-through">
                            {convertPrice(product.actual_price)}
                          </span>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-[#2D5016] to-[#5A7D3E] hover:from-[#1E3D12] hover:to-[#2D5016] text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => navigate(`/shop/product/${product.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#2D5016]/30 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View More Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button
            className="bg-gradient-to-r from-[#2D5016] to-[#5A7D3E] hover:from-[#1E3D12] hover:to-[#2D5016] text-white font-bold px-8 py-3 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 group"
            onClick={() => navigate("/shop")}
          >
            Explore More Products
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}