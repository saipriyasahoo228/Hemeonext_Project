import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "@/api/productApi"; // Use fetchProducts
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import ShoppingProductTile from "./product-tile";

export default function RelatedItems({ categoryId, currentProductId }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        setLoading(true);
        // Fetch all products
        const products = await fetchProducts();
        // Filter products by category and exclude the current product
        const filteredProducts = products
          .filter(
            (product) =>
              product.category.id === categoryId &&
              product.id !== currentProductId
          )
          .slice(0, 4); // Limit to 4 items
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
      <div className="py-6 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null; // Don't render if no related products
  }

  return (
    <div className="py-16 px-6">
      <h2 className="text-2xl ml-6 font-bold text-gray-800 dark:text-white mb-6">
        Related Items
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
            <ShoppingProductTile
                  product={product}/>
        ))}
      </div>
    </div>
  );
}










//   <motion.div
        //     key={product.id}
        //     className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        //     initial={{ opacity: 0, y: 20 }}
        //     animate={{ opacity: 1, y: 0 }}
        //     transition={{ duration: 0.3 }}
        //   >
        //     <img
        //       src={product.images[0]?.image || "https://via.placeholder.com/150"}
        //       alt={product.title}
        //       className="w-full h-48 object-cover"
        //       loading="lazy"
        //     />
        //     <div className="p-4">
        //       <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
        //         {product.title}
        //       </h3>
        //       <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
        //         {product.description.slice(0, 50)}...
        //       </p>
        //       <div className="flex items-center justify-between mt-3">
        //         <span className="text-lg font-bold text-gray-900 dark:text-white">
        //           {product.sale_price ? product.sale_price : product.actual_price}
        //         </span>
        //         <Button
        //           variant="outline"
        //           size="sm"
        //           onClick={() => navigate(`/shop/product/${product.id}`)}
        //           className="border-gray-800 hover:bg-primary hover:text-white"
        //         >
        //           View
        //         </Button>
        //       </div>
        //     </div>
        //   </motion.div>