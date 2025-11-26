// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ArrowUpDownIcon, SlidersHorizontal, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useToast } from "@/components/ui/use-toast";
// import { sortOptions } from "@/config";
// import ProductFilter from "@/components/shopping-view/filter";
// import ShoppingProductTile from "@/components/shopping-view/product-tile";
// import { AnimatePresence } from "framer-motion";


// import { useCurrency } from "@/context/currency-context";
// import { useCart } from "@/context/cart-context"; // Add useCart import
// import { fetchProducts, fetchCategories, fetchSubCategories, addToCart } from "@/api/productApi"; // Add addToCart

// function createSearchParamsHelper(filterParams) {
//   return Object.entries(filterParams)
//     .filter(([_, value]) => Array.isArray(value) && value.length > 0)
//     .map(([key, value]) => `${key}=${encodeURIComponent(value.join(","))}`)
//     .join("&");
// }

// function ShoppingListing() {
//   const [filters, setFilters] = useState({});
//   const [sort, setSort] = useState("price-lowtohigh");
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [productList, setProductList] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { toast } = useToast();
//   const { selectedCurrency } = useCurrency();
//   const { cartItems, refreshCart } = useCart(); // Add useCart

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setLoading(true);
//         const [categoriesData, subCategoriesData] = await Promise.all([
//           fetchCategories(),
//           fetchSubCategories(),
//         ]);
//         setCategories(categoriesData);
//         setSubCategories(subCategoriesData);
//       } catch (err) {
//         setError("Failed to load categories and subcategories.");
//         toast({
//           title: "Error",
//           description: "Failed to load categories and subcategories.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInitialData();
//   }, []);

//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         setLoading(true);
//         const params = {};
  
//         const categorySlug = searchParams.get("category");
//         const subcategorySlug = searchParams.get("subcategory");
//         if (categorySlug) {
//           params.category__slug = categorySlug;
//         }
//         if (subcategorySlug) {
//           params.subcategory__slug = subcategorySlug;
//         }
  
//         if (filters && Object.keys(filters).length > 0) {
//           const subcategoryIds = Object.values(filters).flat();
//           if (subcategoryIds.length > 0) {
//             const subcategorySlugs = subCategories
//               .filter((sub) => subcategoryIds.includes(sub.id))
//               .map((sub) => sub.slug);
//             if (subcategorySlugs.length > 0) {
//               params["subcategory__slug__in"] = subcategorySlugs.join(",");
//             }
//           }
//         }
  
//         if (sort) {
//           params.ordering =
//             sort === "price-lowtohigh"
//               ? "final_price"
//               : sort === "price-hightolow"
//               ? "-final_price"
//               : sort === "name-atoz"
//               ? "title"
//               : "-title";
//         }
  
//         console.log("Fetching products with params:", params);
//         const products = await fetchProducts(params);
//         setProductList(products);
//       } catch (err) {
//         setError("Failed to load products.");
//         toast({
//           title: "Error",
//           description: "Failed to load products.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProductData();
//   }, [filters, searchParams, sort]);

//   useEffect(() => {
//     const storedFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
//     const subcategorySlug = searchParams.get("subcategory__slug");
//     if (subcategorySlug) {
//       const subcategory = subCategories.find((sub) => sub.slug === subcategorySlug);
//       if (subcategory) {
//         const category = categories.find((cat) => cat.id === subcategory.category);
//         if (category) {
//           storedFilters[category.name] = [subcategory.id];
//         }
//       }
//     }
//     setFilters(storedFilters);
//     setSort("price-lowtohigh");
//   }, [searchParams, categories, subCategories]);

//   useEffect(() => {
//     if (filters && Object.keys(filters).length > 0) {
//       setSearchParams(new URLSearchParams(createSearchParamsHelper(filters)));
//     }
//   }, [filters]);

//   function handleSort(value) {
//     setSort(value);
//   }

//   function handleFilter(getSectionId, getCurrentOption) {
//     setFilters((prev) => {
//       const newFilters = { ...prev };
//       newFilters[getSectionId] = newFilters[getSectionId] || [];

//       const index = newFilters[getSectionId].indexOf(getCurrentOption);
//       if (index === -1) newFilters[getSectionId].push(getCurrentOption);
//       else newFilters[getSectionId].splice(index, 1);

//       sessionStorage.setItem("filters", JSON.stringify(newFilters));
//       return newFilters;
//     });
//   }

//   async function handleAddtoCart(getCurrentProductId, getTotalStock) {
//     if (cartItems.length >= 10 && !cartItems.some(item => item.product.id === getCurrentProductId)) {
//       toast({
//         title: "Cart Limit Reached",
//         description: "You can only add up to 10 different items to your cart.",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       await addToCart(getCurrentProductId, 1, "", ""); // Assuming no color/size for listing
//       await refreshCart();
//       toast({
//         title: "Product added to cart",
//         className: "bg-gradient-to-r from-[#C9F0DD] to-[#FFD6E8] text-[#2D5016] border-none shadow-lg",
//       });
//     } catch (err) {
//       console.error("Add to Cart Error:", err);
//       toast({
//         title: "Error",
//         description: err.response?.data?.error || "Failed to add product to cart.",
//         variant: "destructive",
//       });
//     }
//   }

//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.05,
//       },
//     },
//   };

//   const item = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0 },
//   };

//   const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0FFF8] via-[#FFF0F5] to-[#FFF9E6]">
//         <div className="relative">
//           <p className="text-[#2D5016] font-medium">Loading products...</p>
//           <div className="absolute -inset-1 bg-gradient-to-r from-[#C9F0DD] via-[#FFD6E8] to-[#FFF2B2] rounded-lg blur-sm opacity-75 animate-pulse"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0FFF8] via-[#FFF0F5] to-[#FFF9E6]">
//         <p className="text-red-500 font-medium">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#F0FFF8] via-[#FFF0F5] to-[#FFF9E6]">
//       <div className="pt-24 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
//         <div className="bg-gradient-to-r from-[#C9F0DD]/20 via-[#FFD6E8]/20 to-[#FFF2B2]/20 backdrop-blur-sm border border-[#C9F0DD]/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 mb-6 shadow-lg">
//           <div className="flex items-center gap-4">
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              
//             </motion.div>
//             <div>
//               <h1 className="text-xl font-bold text-[#2D5016] relative inline-block pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-[#C9F0DD] after:via-[#FFD6E8] after:to-[#FFF2B2] after:shadow-md">
//                 Products
//               </h1>
//               <p className="text-sm text-[#5A7D3E]">{productList.length} results</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <Button
//               variant="outline"
//               size="sm"
//               className={`flex items-center gap-1 border-2 bg-gradient-to-r from-[#C9F0DD] via-[#FFD6E8] to-[#FFF2B2] hover:from-[#B0E8CD] hover:via-[#F5C2D9] hover:to-[#FFE999] text-[#2D5016] font-medium shadow-lg hover:shadow-xl transition-all duration-300 ${
//                 hasActiveFilters ? "ring-2 ring-[#FFD6E8] ring-offset-2" : ""
//               }`}
//               onClick={() => setIsFilterOpen(true)}
//             >
//               <SlidersHorizontal className="h-4 w-4" />
//               <span>Filters</span>
//               {hasActiveFilters && (
//                 <span className="ml-1 w-4 h-4 rounded-full bg-[#FF6B9D] text-white text-xs flex items-center justify-center shadow-md">
//                   {Object.values(filters).flat().length}
//                 </span>
//               )}
//             </Button>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex items-center border-2 bg-gradient-to-r from-[#C9F0DD] via-[#FFD6E8] to-[#FFF2B2] hover:from-[#B0E8CD] hover:via-[#F5C2D9] hover:to-[#FFE999] text-[#2D5016] font-medium shadow-lg hover:shadow-xl transition-all duration-300"
//                 >
//                   <ArrowUpDownIcon className="h-4 w-4" />
//                   <span>Sort</span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-[200px] bg-gradient-to-b from-[#F0FFF8] to-[#FFF0F5] backdrop-blur-md border-2 border-[#C9F0DD] shadow-xl">
//                 <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
//                   {sortOptions.map((sortItem) => (
//                     <DropdownMenuRadioItem
//                       value={sortItem.id}
//                       key={sortItem.id}
//                       className="cursor-pointer hover:bg-gradient-to-r hover:from-[#C9F0DD] hover:via-[#FFD6E8] hover:to-[#FFF2B2] text-[#2D5016] transition-all duration-200"
//                     >
//                       {sortItem.label}
//                     </DropdownMenuRadioItem>
//                   ))}
//                 </DropdownMenuRadioGroup>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>

//         {hasActiveFilters && (
//           <div className="mb-4 flex flex-wrap gap-2 items-center">
//             <span className="text-sm text-[#5A7D3E] font-medium">Active filters:</span>
//             {Object.entries(filters).map(([categoryName, selectedIds]) =>
//               selectedIds.map((id) => {
//                 const category = categories.find((cat) => cat.name === categoryName);
//                 const subcategory = subCategories.find((sub) => sub.id === id);
//                 if (!subcategory) return null;

//                 return (
//                   <div
//                     key={`${categoryName}-${id}`}
//                     className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#C9F0DD] via-[#FFD6E8] to-[#FFF2B2] text-[#2D5016] font-medium text-xs flex items-center gap-1 shadow-md hover:shadow-lg transition-all duration-200"
//                   >
//                     <span>{subcategory.name}</span>
//                     <button
//                       className="hover:text-[#FF6B9D] transition-colors duration-200"
//                       onClick={() => handleFilter(categoryName, id)}
//                     >
//                       <X className="h-3 w-3" />
//                     </button>
//                   </div>
//                 );
//               })
//             )}
//             <Button
//               variant="ghost"
//               size="sm"
//               className="text-xs text-[#5A7D3E] hover:text-[#FF6B9D] hover:bg-[#FFD6E8]/20 font-medium transition-all duration-200"
//               onClick={() => {
//                 setFilters({});
//                 sessionStorage.removeItem("filters");
//               }}
//             >
//               Clear all
//             </Button>
//           </div>
//         )}

//         <motion.div
//           className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
//           variants={container}
//           initial="hidden"
//           animate="show"
//         >
//           {productList.length > 0 ? (
//             productList.map((productItem) => (
//               <motion.div key={productItem.id} variants={item}>
//                 <ShoppingProductTile
//                   product={productItem}
//                   handleAddtoCart={handleAddtoCart}
//                 />
//               </motion.div>
//             ))
//           ) : (
//             <div className="col-span-full py-12 text-center">
//               <p className="text-[#5A7D3E] font-medium">No products found matching your criteria</p>
//               <Button
//                 variant="outline"
//                 className="mt-4 border-2 bg-gradient-to-r from-[#C9F0DD] via-[#FFD6E8] to-[#FFF2B2] hover:from-[#B0E8CD] hover:via-[#F5C2D9] hover:to-[#FFE999] text-[#2D5016] font-medium shadow-lg hover:shadow-xl transition-all duration-300"
//                 onClick={() => {
//                   setFilters({});
//                   sessionStorage.removeItem("filters");
//                 }}
//               >
//                 Clear all filters
//               </Button>
//             </div>
//           )}
//         </motion.div>

//         <AnimatePresence>
//           {isFilterOpen && (
//             <motion.div
//               className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsFilterOpen(false)}
//             >
//               <motion.div
//                 className="bg-gradient-to-b from-[#F0FFF8] to-[#FFF0F5] border-2 border-[#C9F0DD] shadow-2xl rounded-xl w-full max-w-md mx-4 p-4 max-h-[80vh] overflow-y-auto"
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-lg font-bold text-[#2D5016] flex items-center gap-2">
//                     <SlidersHorizontal className="h-4 w-4" />
//                     Filters
//                   </h2>
//                   <Button 
//                     variant="ghost" 
//                     size="icon" 
//                     onClick={() => setIsFilterOpen(false)}
//                     className="hover:bg-[#FFD6E8]/20 text-[#2D5016]"
//                   >
//                     <X className="h-5 w-5" />
//                   </Button>
//                 </div>
//                 <ProductFilter filters={filters} handleFilter={handleFilter} categories={categories} />
//                 <div className="mt-4 flex gap-2">
//                   <Button
//                     className="flex-1 bg-gradient-to-r from-[#C9F0DD] via-[#FFD6E8] to-[#FFF2B2] hover:from-[#B0E8CD] hover:via-[#F5C2D9] hover:to-[#FFE999] text-[#2D5016] font-medium shadow-lg hover:shadow-xl transition-all duration-300"
//                     onClick={() => setIsFilterOpen(false)}
//                   >
//                     Apply Filters
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="flex-1 border-2 border-[#C9F0DD] text-[#2D5016] hover:bg-[#FFD6E8]/20 font-medium transition-all duration-200"
//                     onClick={() => {
//                       setFilters({});
//                       sessionStorage.removeItem("filters");
//                       setIsFilterOpen(false);
//                     }}
//                   >
//                     Clear
//                   </Button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

// export default ShoppingListing;
















// import { useEffect, useState } from "react";

// import { useSearchParams,useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ArrowUpDownIcon, SlidersHorizontal, X, Heart, ShoppingCart, Star, Loader2, ShoppingBag } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useToast } from "@/components/ui/use-toast";
// import { sortOptions } from "@/config";
// import ProductFilter from "@/components/shopping-view/filter";
// import { AnimatePresence } from "framer-motion";
// import { useCurrency } from "@/context/currency-context";
// import { useCart } from "@/context/cart-context";
// import { useAuth } from "@/context/auth-context";

// import { fetchProducts, fetchCategories, fetchSubCategories, addToCart } from "@/api/productApi";

// // Professional Product Card Component
// const ProfessionalProductCard = ({ product, handleAddtoCart }) => {
//   const { convertPrice, loading: currencyLoading } = useCurrency();
//   const { toast } = useToast();
//   const { isAuthenticated } = useAuth();
//   const { cartItems, refreshCart } = useCart();
//   const [isInWishlist, setIsInWishlist] = useState(false);
//   const [togglingWishlist, setTogglingWishlist] = useState(false);
//   const [cartLoading, setCartLoading] = useState(false);
  

//   const salePrice = product?.sale_price
//     ? currencyLoading
//       ? "..."
//       : convertPrice(product.sale_price)
//     : null;
//   const actualPrice = currencyLoading ? "..." : convertPrice(product?.actual_price);
//   const discountPercentage = product?.discount_percentage || 0;

//   const handleWishlistToggle = async () => {
//     if (!isAuthenticated) {
//       toast({
//         title: "Please login",
//         description: "You need to login to add items to wishlist",
//         variant: "destructive",
//       });
//       return;
//     }

//     setTogglingWishlist(true);
//     try {
//       setIsInWishlist(!isInWishlist);
//       toast({
//         title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
//         className: "bg-white border border-gray-200 text-gray-800",
//       });
//     } catch (err) {
//       console.error("Wishlist Toggle Error:", err);
//     } finally {
//       setTogglingWishlist(false);
//     }
//   };

//   const handleAddToCartClick = async () => {
//     if (!isAuthenticated) {
//       toast({
//         title: "Please login",
//         description: "You need to login to add items to cart",
//         variant: "destructive",
//       });
//       return;
//     }

//     setCartLoading(true);
//     try {
//       await handleAddtoCart(product.id, product.stock);
//       await refreshCart();
//     } catch (err) {
//       console.error("Add to Cart Error:", err);
//     } finally {
//       setCartLoading(false);
//     }
//   };

//   const handleBuyNow = () => {
    
//   if (!isAuthenticated) {
//     toast({
//       title: "Please login",
//       description: "You need to login to buy products",
//       variant: "destructive",
//     });
//     return;
//   }
  
//   // Show toast message
//   toast({
//     title: "Buy Now",
//     description: "Redirecting to checkout...",
//     className: "bg-white border border-gray-200 text-gray-800",
//   });
  
//   // Navigate to buy now page
//    navigate(`/shop/buy-now/${product.id}`);
// };

//   return (
//     <motion.div
//       className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:border-gray-200"
//       whileHover={{ y: -4 }}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       {/* Product Image */}
//       <div className="relative bg-gray-50 aspect-square flex items-center justify-center p-4">
//         <img
//           src={product.images?.[0]?.image || "/placeholder-product.jpg"}
//           alt={product.title}
//           className="object-contain w-full h-40 transition-transform duration-300 hover:scale-105"
//         />
        
//         {/* Wishlist Button */}
//         <button
//           onClick={handleWishlistToggle}
//           disabled={togglingWishlist}
//           className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:bg-gray-50"
//         >
//           {togglingWishlist ? (
//             <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
//           ) : (
//             <Heart
//               className={`w-4 h-4 transition-colors duration-200 ${
//                 isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
//               }`}
//               strokeWidth={1.5}
//             />
//           )}
//         </button>

//         {/* Discount Badge */}
//         {discountPercentage > 0 && (
//           <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
//             {discountPercentage}% OFF
//           </div>
//         )}

//         {/* Stock Status */}
//         {product.stock === 0 && (
//           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//             <span className="bg-white px-3 py-1 rounded text-sm font-medium text-gray-800">
//               Out of Stock
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Product Info */}
//       <div className="p-3">
//         {/* Category/Brand */}
//         <div className="flex items-center justify-between mb-1">
//           <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
//             {product.brand?.name || product.category?.name || "Product"}
//           </span>
//           <div className="flex items-center gap-1">
//             <Star className="w-3 h-3 text-yellow-400 fill-current" />
//             <span className="text-xs text-gray-500">
//               {product.average_rating || "0.0"}
//             </span>
//           </div>
//         </div>

//         {/* Product Title */}
//         <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 h-10">
//           {product.title}
//         </h3>

//         {/* Price Section */}
//         <div className="flex items-center gap-2 mb-2">
//           <span className="text-lg font-bold text-gray-900">
//             {salePrice || actualPrice}
//           </span>
//           {salePrice && (
//             <span className="text-sm text-gray-500 line-through">
//               {actualPrice}
//             </span>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col gap-2">
//           <Button
//             onClick={handleBuyNow}
//             disabled={product.stock === 0}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 text-sm transition-all duration-200"
//           >
//             <ShoppingBag className="w-4 h-4 mr-1" />
//             Buy Now
//           </Button>
//           <Button
//             onClick={handleAddToCartClick}
//             disabled={cartLoading || product.stock === 0}
//             variant="outline"
//             className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 text-sm transition-all duration-200"
//           >
//             {cartLoading ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : (
//               <>
//                 <ShoppingCart className="w-4 h-4 mr-1" />
//                 Add to Cart
//               </>
//             )}
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// function createSearchParamsHelper(filterParams) {
//   return Object.entries(filterParams)
//     .filter(([_, value]) => Array.isArray(value) && value.length > 0)
//     .map(([key, value]) => `${key}=${encodeURIComponent(value.join(","))}`)
//     .join("&");
// }

// function ShoppingListing() {
//   const [filters, setFilters] = useState({});
//   const [sort, setSort] = useState("price-lowtohigh");
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [productList, setProductList] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { toast } = useToast();
//   const { selectedCurrency } = useCurrency();
//   const { cartItems, refreshCart } = useCart();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setLoading(true);
//         const [categoriesData, subCategoriesData] = await Promise.all([
//           fetchCategories(),
//           fetchSubCategories(),
//         ]);
//         setCategories(categoriesData);
//         setSubCategories(subCategoriesData);
//       } catch (err) {
//         setError("Failed to load categories and subcategories.");
//         toast({
//           title: "Error",
//           description: "Failed to load categories and subcategories.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInitialData();
//   }, []);

//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         setLoading(true);
//         const params = {};
  
//         const categorySlug = searchParams.get("category");
//         const subcategorySlug = searchParams.get("subcategory");
//         if (categorySlug) {
//           params.category__slug = categorySlug;
//         }
//         if (subcategorySlug) {
//           params.subcategory__slug = subcategorySlug;
//         }
  
//         if (filters && Object.keys(filters).length > 0) {
//           const subcategoryIds = Object.values(filters).flat();
//           if (subcategoryIds.length > 0) {
//             const subcategorySlugs = subCategories
//               .filter((sub) => subcategoryIds.includes(sub.id))
//               .map((sub) => sub.slug);
//             if (subcategorySlugs.length > 0) {
//               params["subcategory__slug__in"] = subcategorySlugs.join(",");
//             }
//           }
//         }
  
//         if (sort) {
//           params.ordering =
//             sort === "price-lowtohigh"
//               ? "final_price"
//               : sort === "price-hightolow"
//               ? "-final_price"
//               : sort === "name-atoz"
//               ? "title"
//               : "-title";
//         }
  
//         console.log("Fetching products with params:", params);
//         const products = await fetchProducts(params);
//         setProductList(products);
//       } catch (err) {
//         setError("Failed to load products.");
//         toast({
//           title: "Error",
//           description: "Failed to load products.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProductData();
//   }, [filters, searchParams, sort]);

//   useEffect(() => {
//     const storedFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
//     const subcategorySlug = searchParams.get("subcategory__slug");
//     if (subcategorySlug) {
//       const subcategory = subCategories.find((sub) => sub.slug === subcategorySlug);
//       if (subcategory) {
//         const category = categories.find((cat) => cat.id === subcategory.category);
//         if (category) {
//           storedFilters[category.name] = [subcategory.id];
//         }
//       }
//     }
//     setFilters(storedFilters);
//     setSort("price-lowtohigh");
//   }, [searchParams, categories, subCategories]);

//   useEffect(() => {
//     if (filters && Object.keys(filters).length > 0) {
//       setSearchParams(new URLSearchParams(createSearchParamsHelper(filters)));
//     }
//   }, [filters]);

//   function handleSort(value) {
//     setSort(value);
//   }

//   function handleFilter(getSectionId, getCurrentOption) {
//     setFilters((prev) => {
//       const newFilters = { ...prev };
//       newFilters[getSectionId] = newFilters[getSectionId] || [];

//       const index = newFilters[getSectionId].indexOf(getCurrentOption);
//       if (index === -1) newFilters[getSectionId].push(getCurrentOption);
//       else newFilters[getSectionId].splice(index, 1);

//       sessionStorage.setItem("filters", JSON.stringify(newFilters));
//       return newFilters;
//     });
//   }

//   async function handleAddtoCart(getCurrentProductId, getTotalStock) {
//     if (cartItems.length >= 10 && !cartItems.some(item => item.product.id === getCurrentProductId)) {
//       toast({
//         title: "Cart Limit Reached",
//         description: "You can only add up to 10 different items to your cart.",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       await addToCart(getCurrentProductId, 1, "", "");
//       await refreshCart();
//       toast({
//         title: "Product added to cart",
//         className: "bg-white border border-gray-200 text-gray-800",
//       });
//     } catch (err) {
//       console.error("Add to Cart Error:", err);
//       toast({
//         title: "Error",
//         description: err.response?.data?.error || "Failed to add product to cart.",
//         variant: "destructive",
//       });
//     }
//   }

//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.05,
//       },
//     },
//   };

//   const item = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0 },
//   };

//   const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-4" />
//           <p className="text-gray-600 font-medium">Loading products...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <p className="text-red-500 font-medium">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="pt-16"> {/* Reduced from pt-20 */}
//         {/* Header Section - Full Width */}
//         <div className="bg-white border-b border-gray-200 px-4 py-3"> {/* Reduced py-4 to py-3 */}
//           <div className="flex flex-wrap items-center justify-between gap-3"> {/* Reduced gap-4 to gap-3 */}
//             <div className="flex items-center gap-3"> {/* Reduced gap-4 to gap-3 */}
//               <div>
//                 <h1 className="text-lg font-bold text-gray-900">Products</h1> {/* Reduced text-xl to text-lg */}
//                 <p className="text-xs text-gray-600 mt-1">{productList.length} results found</p> {/* Reduced text-sm to text-xs */}
//               </div>
//             </div>

//             <div className="flex items-center gap-2"> {/* Reduced gap-3 to gap-2 */}
//               {/* Mobile Filter Button */}
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className={`flex items-center gap-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium md:hidden text-xs px-2 h-8 ${
//                   hasActiveFilters ? "border-blue-500 ring-1 ring-blue-500" : ""
//                 }`}
//                 onClick={() => setIsFilterOpen(true)}
//               >
//                 <SlidersHorizontal className="h-3 w-3" /> {/* Reduced icon size */}
//                 <span>Filters</span>
//                 {hasActiveFilters && (
//                   <span className="ml-1 w-4 h-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
//                     {Object.values(filters).flat().length}
//                   </span>
//                 )}
//               </Button>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex items-center gap-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs px-2 h-8" // Reduced padding and height
//                   >
//                     <ArrowUpDownIcon className="h-3 w-3" /> {/* Reduced icon size */}
//                     <span>Sort</span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-40 bg-white border border-gray-200 shadow-lg"> {/* Reduced width from w-[200px] to w-40 */}
//                   <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
//                     {sortOptions.map((sortItem) => (
//                       <DropdownMenuRadioItem
//                         value={sortItem.id}
//                         key={sortItem.id}
//                         className="cursor-pointer hover:bg-gray-50 text-gray-700 text-sm" // Added text-sm
//                       >
//                         {sortItem.label}
//                       </DropdownMenuRadioItem>
//                     ))}
//                   </DropdownMenuRadioGroup>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>

//           {/* Active Filters */}
//           {hasActiveFilters && (
//             <div className="mt-3 flex flex-wrap gap-2 items-center"> {/* Reduced mt-4 to mt-3 */}
//               <span className="text-xs text-gray-600 font-medium">Active filters:</span> {/* Reduced text-sm to text-xs */}
//               {Object.entries(filters).map(([categoryName, selectedIds]) =>
//                 selectedIds.map((id) => {
//                   const category = categories.find((cat) => cat.name === categoryName);
//                   const subcategory = subCategories.find((sub) => sub.id === id);
//                   if (!subcategory) return null;

//                   return (
//                     <div
//                       key={`${categoryName}-${id}`}
//                       className="px-2 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-medium text-xs flex items-center gap-1" // Reduced padding
//                     >
//                       <span>{subcategory.name}</span>
//                       <button
//                         className="hover:text-blue-900 transition-colors duration-200"
//                         onClick={() => handleFilter(categoryName, id)}
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </div>
//                   );
//                 })
//               )}
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="text-xs text-gray-600 hover:text-gray-800 font-medium"
//                 onClick={() => {
//                   setFilters({});
//                   sessionStorage.removeItem("filters");
//                 }}
//               >
//                 Clear all
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Main Content with Sidebar Layout - Full Width */}
//         <div className="flex">
//           {/* Sidebar Filters - Desktop */}
//           <div className="hidden md:block w-60 flex-shrink-0 bg-white border-r border-gray-200 min-h-screen"> {/* Reduced width from w-64 to w-60 */}
//             <div className="p-3 sticky top-16"> {/* Reduced p-4 to p-3 and top-20 to top-16 */}
//               <div className="flex items-center justify-between mb-3"> {/* Reduced mb-4 to mb-3 */}
//                 <h3 className="font-semibold text-gray-900 text-sm">Filters</h3> {/* Added text-sm */}
//                 {hasActiveFilters && (
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="text-xs text-blue-600 hover:text-blue-800 font-medium"
//                     onClick={() => {
//                       setFilters({});
//                       sessionStorage.removeItem("filters");
//                     }}
//                   >
//                     Clear all
//                   </Button>
//                 )}
//               </div>
//               <ProductFilter filters={filters} handleFilter={handleFilter} categories={categories} />
//             </div>
//           </div>

//           {/* Products Grid - Full Width */}
//           <div className="flex-1">
//             <div className="p-3"> {/* Reduced p-4 to p-3 */}
//               <motion.div
//                 className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3" // Reduced gap-4 to gap-3
//                 variants={container}
//                 initial="hidden"
//                 animate="show"
//               >
//                 {productList.length > 0 ? (
//                   productList.map((productItem) => (
//                     <motion.div key={productItem.id} variants={item}>
//                       <ProfessionalProductCard
//                         product={productItem}
//                         handleAddtoCart={handleAddtoCart}
//                       />
//                     </motion.div>
//                   ))
//                 ) : (
//                   <div className="col-span-full py-8 text-center"> {/* Reduced py-12 to py-8 */}
//                     <div className="max-w-md mx-auto">
//                       <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3"> {/* Reduced size and margin */}
//                         <SlidersHorizontal className="h-6 w-6 text-gray-400" /> {/* Reduced icon size */}
//                       </div>
//                       <h3 className="text-base font-semibold text-gray-900 mb-2">No products found</h3> {/* Reduced text-lg to text-base */}
//                       <p className="text-sm text-gray-600 mb-3">Try adjusting your filters to find what you're looking for.</p> {/* Reduced margin */}
//                       <Button
//                         variant="outline"
//                         className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm" // Added text-sm
//                         onClick={() => {
//                           setFilters({});
//                           sessionStorage.removeItem("filters");
//                         }}
//                       >
//                         Clear all filters
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Filter Modal */}
//         <AnimatePresence>
//           {isFilterOpen && (
//             <motion.div
//               className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm md:hidden"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsFilterOpen(false)}
//             >
//               <motion.div
//                 className="bg-white border border-gray-200 shadow-xl rounded-lg w-full max-w-md mx-4 p-4 max-h-[80vh] overflow-y-auto" // Reduced p-6 to p-4
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex items-center justify-between mb-4"> {/* Reduced mb-6 to mb-4 */}
//                   <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2"> {/* Reduced text-lg to text-base */}
//                     <SlidersHorizontal className="h-4 w-4" />
//                     Filters
//                   </h2>
//                   <Button 
//                     variant="ghost" 
//                     size="icon" 
//                     onClick={() => setIsFilterOpen(false)}
//                     className="hover:bg-gray-100 text-gray-600 h-8 w-8" // Reduced size
//                   >
//                     <X className="h-4 w-4" /> {/* Reduced icon size */}
//                   </Button>
//                 </div>
//                 <ProductFilter filters={filters} handleFilter={handleFilter} categories={categories} />
//                 <div className="mt-4 flex gap-2"> {/* Reduced mt-6 to mt-4 */}
//                   <Button
//                     className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm" // Added text-sm
//                     onClick={() => setIsFilterOpen(false)}
//                   >
//                     Apply Filters
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm" // Added text-sm
//                     onClick={() => {
//                       setFilters({});
//                       sessionStorage.removeItem("filters");
//                       setIsFilterOpen(false);
//                     }}
//                   >
//                     Clear All
//                   </Button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

// export default ShoppingListing;







import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpDownIcon, SlidersHorizontal, X, Heart, ShoppingCart, Star, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import ProductFilter from "@/components/shopping-view/filter";
import { AnimatePresence } from "framer-motion";
import { useCurrency } from "@/context/currency-context";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { fetchProducts, fetchCategories, fetchSubCategories, addToCart } from "@/api/productApi";

// Professional Product Card Component
const ProfessionalProductCard = ({ product, handleAddtoCart }) => {
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
      toast({
        title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
        className: "bg-white border border-gray-200 text-gray-800",
      });
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
            className="w-full bg-green-600 text-white font-medium py-2 text-sm transition-all duration-200"
          >
            <ShoppingBag className="w-4 h-4 mr-1" />
            Buy Now
          </Button>
          <Button
            onClick={handleAddToCartClick}
            disabled={cartLoading || product.stock === 0}
            variant="outline"
            className="w-full border border-gray-300 bg-blue hover:bg-gray-50 text-gray-700 font-medium py-2 text-sm transition-all duration-200"
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

function createSearchParamsHelper(filterParams) {
  return Object.entries(filterParams)
    .filter(([_, value]) => Array.isArray(value) && value.length > 0)
    .map(([key, value]) => `${key}=${encodeURIComponent(value.join(","))}`)
    .join("&");
}

function ShoppingListing() {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { selectedCurrency } = useCurrency();
  const { cartItems, refreshCart } = useCart();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [categoriesData, subCategoriesData] = await Promise.all([
          fetchCategories(),
          fetchSubCategories(),
        ]);
        setCategories(categoriesData);
        setSubCategories(subCategoriesData);
      } catch (err) {
        setError("Failed to load categories and subcategories.");
        toast({
          title: "Error",
          description: "Failed to load categories and subcategories.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const params = {};
  
        const categorySlug = searchParams.get("category");
        const subcategorySlug = searchParams.get("subcategory");
        if (categorySlug) {
          params.category__slug = categorySlug;
        }
        if (subcategorySlug) {
          params.subcategory__slug = subcategorySlug;
        }
  
        if (filters && Object.keys(filters).length > 0) {
          const subcategoryIds = Object.values(filters).flat();
          if (subcategoryIds.length > 0) {
            const subcategorySlugs = subCategories
              .filter((sub) => subcategoryIds.includes(sub.id))
              .map((sub) => sub.slug);
            if (subcategorySlugs.length > 0) {
              params["subcategory__slug__in"] = subcategorySlugs.join(",");
            }
          }
        }
  
        if (sort) {
          params.ordering =
            sort === "price-lowtohigh"
              ? "final_price"
              : sort === "price-hightolow"
              ? "-final_price"
              : sort === "name-atoz"
              ? "title"
              : "-title";
        }
  
        console.log("Fetching products with params:", params);
        const products = await fetchProducts(params);
        setProductList(products);
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
  }, [filters, searchParams, sort]);

  useEffect(() => {
    const storedFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
    const subcategorySlug = searchParams.get("subcategory__slug");
    if (subcategorySlug) {
      const subcategory = subCategories.find((sub) => sub.slug === subcategorySlug);
      if (subcategory) {
        const category = categories.find((cat) => cat.id === subcategory.category);
        if (category) {
          storedFilters[category.name] = [subcategory.id];
        }
      }
    }
    setFilters(storedFilters);
    setSort("price-lowtohigh");
  }, [searchParams, categories, subCategories]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      setSearchParams(new URLSearchParams(createSearchParamsHelper(filters)));
    }
  }, [filters]);

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    setFilters((prev) => {
      const newFilters = { ...prev };
      newFilters[getSectionId] = newFilters[getSectionId] || [];

      const index = newFilters[getSectionId].indexOf(getCurrentOption);
      if (index === -1) newFilters[getSectionId].push(getCurrentOption);
      else newFilters[getSectionId].splice(index, 1);

      sessionStorage.setItem("filters", JSON.stringify(newFilters));
      return newFilters;
    });
  }

  async function handleAddtoCart(getCurrentProductId, getTotalStock) {
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
  }

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

  const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-0">
        {/* Header Section - Full Width */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg font-bold text-gray-900">Products</h1>
                <p className="text-xs text-gray-600 mt-1">{productList.length} results found</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium md:hidden text-xs px-2 h-8 ${
                  hasActiveFilters ? "border-blue-500 ring-1 ring-blue-500" : ""
                }`}
                onClick={() => setIsFilterOpen(true)}
              >
                <SlidersHorizontal className="h-3 w-3" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="ml-1 w-4 h-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                    {Object.values(filters).flat().length}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs px-2 h-8"
                  >
                    <ArrowUpDownIcon className="h-3 w-3" />
                    <span>Sort</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 bg-white border border-gray-200 shadow-lg">
                  <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        value={sortItem.id}
                        key={sortItem.id}
                        className="cursor-pointer hover:bg-gray-50 text-gray-700 text-sm"
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-600 font-medium">Active filters:</span>
              {Object.entries(filters).map(([categoryName, selectedIds]) =>
                selectedIds.map((id) => {
                  const category = categories.find((cat) => cat.name === categoryName);
                  const subcategory = subCategories.find((sub) => sub.id === id);
                  if (!subcategory) return null;

                  return (
                    <div
                      key={`${categoryName}-${id}`}
                      className="px-2 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-medium text-xs flex items-center gap-1"
                    >
                      <span>{subcategory.name}</span>
                      <button
                        className="hover:text-blue-900 transition-colors duration-200"
                        onClick={() => handleFilter(categoryName, id)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-600 hover:text-gray-800 font-medium"
                onClick={() => {
                  setFilters({});
                  sessionStorage.removeItem("filters");
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Main Content with Sidebar Layout - Full Width */}
        <div className="flex">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden md:block w-60 flex-shrink-0 bg-white border-r border-gray-200 min-h-screen">
            <div className="p-3 sticky top-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">Filters</h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() => {
                      setFilters({});
                      sessionStorage.removeItem("filters");
                    }}
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <ProductFilter filters={filters} handleFilter={handleFilter} categories={categories} />
            </div>
          </div>

          {/* Products Grid - Full Width */}
          <div className="flex-1">
            <div className="p-3">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {productList.length > 0 ? (
                  productList.map((productItem) => (
                    <motion.div key={productItem.id} variants={item}>
                      <ProfessionalProductCard
                        product={productItem}
                        handleAddtoCart={handleAddtoCart}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <SlidersHorizontal className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-2">No products found</h3>
                      <p className="text-sm text-gray-600 mb-3">Try adjusting your filters to find what you're looking for.</p>
                      <Button
                        variant="outline"
                        className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm"
                        onClick={() => {
                          setFilters({});
                          sessionStorage.removeItem("filters");
                        }}
                      >
                        Clear all filters
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
            >
              <motion.div
                className="bg-white border border-gray-200 shadow-xl rounded-lg w-full max-w-md mx-4 p-4 max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsFilterOpen(false)}
                    className="hover:bg-gray-100 text-gray-600 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ProductFilter filters={filters} handleFilter={handleFilter} categories={categories} />
                <div className="mt-4 flex gap-2">
                  <Button
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm"
                    onClick={() => {
                      setFilters({});
                      sessionStorage.removeItem("filters");
                      setIsFilterOpen(false);
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ShoppingListing;