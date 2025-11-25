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
//         className: "bg-[#E6C692] text-black border-none",
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
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading products...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-red-500">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#D7D3CA]/50">
//       <div className="pt-24 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
//         <div className="bg-transparent dark:bg-[#0B0F19]/80 dark:border-[#1E293B] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 mb-6">
//           <div className="flex items-center gap-4">
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              
//             </motion.div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 relative inline-block pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gray-400 dark:after:bg-gray-500 after:shadow-md">
//                 Products
//               </h1>
//               <p className="text-sm text-gray-500 dark:text-gray-400">{productList.length} results</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <Button
//               variant="outline"
//               size="sm"
//               className={`flex items-center gap-1 border-none ${
//                 hasActiveFilters ? "bg-[#E6C692]/20 text-[#090C10]" : "bg-transparent"
//               } dark:bg-[#0B0F19]/80`}
//               onClick={() => setIsFilterOpen(true)}
//             >
//               <SlidersHorizontal className="h-4 w-4" />
//               <span>Filters</span>
//               {hasActiveFilters && (
//                 <span className="ml-1 w-4 h-4 rounded-full bg-[#E6C692] text-[#090C10] text-xs flex items-center justify-center">
//                   {Object.values(filters).flat().length}
//                 </span>
//               )}
//             </Button>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex items-center border-none bg-transparent gap-1 dark:bg-[#0B0F19]/80"
//                 >
//                   <ArrowUpDownIcon className="h-4 w-4" />
//                   <span>Sort</span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-[200px] bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md border-gray-200 dark:border-gray-800">
//                 <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
//                   {sortOptions.map((sortItem) => (
//                     <DropdownMenuRadioItem
//                       value={sortItem.id}
//                       key={sortItem.id}
//                       className="cursor-pointer hover:bg-[#E6C692]/20"
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
//             <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
//             {Object.entries(filters).map(([categoryName, selectedIds]) =>
//               selectedIds.map((id) => {
//                 const category = categories.find((cat) => cat.name === categoryName);
//                 const subcategory = subCategories.find((sub) => sub.id === id);
//                 if (!subcategory) return null;

//                 return (
//                   <div
//                     key={`${categoryName}-${id}`}
//                     className="px-2 py-1 rounded-full bg-[#E6C692]/20 text-[#090C10] dark:text-[#E6C692] text-xs flex items-center gap-1"
//                   >
//                     <span>{subcategory.name}</span>
//                     <button
//                       className="hover:text-red-500"
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
//               className="text-xs text-gray-500 hover:text-red-500"
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
//               <p className="text-gray-500 dark:text-gray-400">No products found matching your criteria</p>
//               <Button
//                 variant="outline"
//                 className="mt-4 border-[#E6C692] text-[#090C10] hover:bg-[#E6C692]/20"
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
//                 className="bg-white/90 dark:bg-[#0B0F19] border border-gray-200 dark:border-[#1E293B] shadow-lg rounded-xl w-full max-w-md mx-4 p-4 max-h-[80vh] overflow-y-auto"
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
//                     <SlidersHorizontal className="h-4 w-4" />
//                     Filters
//                   </h2>
//                   <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
//                     <X className="h-5 w-5" />
//                   </Button>
//                 </div>
//                 <ProductFilter filters={filters} handleFilter={handleFilter} categories={categories} />
//                 <div className="mt-4 flex gap-2">
//                   <Button
//                     className="flex-1 bg-[#E6C692] text-black hover:bg-[#ECD2AB]"
//                     onClick={() => setIsFilterOpen(false)}
//                   >
//                     Apply Filters
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="flex-1"
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











import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpDownIcon, SlidersHorizontal, X } from "lucide-react";
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
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { AnimatePresence } from "framer-motion";


import { useCurrency } from "@/context/currency-context";
import { useCart } from "@/context/cart-context"; // Add useCart import
import { fetchProducts, fetchCategories, fetchSubCategories, addToCart } from "@/api/productApi"; // Add addToCart

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
  const { cartItems, refreshCart } = useCart(); // Add useCart

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
      await addToCart(getCurrentProductId, 1, "", ""); // Assuming no color/size for listing
      await refreshCart();
      toast({
        title: "Product added to cart",
        className: "bg-gradient-to-r from-[#C9F0DD] to-[#FFD6E8] text-[#2D5016] border-none shadow-lg",
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0FFF8] via-[#FFF0F5] to-[#FFF9E6]">
        <div className="relative">
          <p className="text-[#2D5016] font-medium">Loading products...</p>
          <div className="absolute -inset-1 bg-gradient-to-r from-[#C9F0DD] via-[#FFD6E8] to-[#FFF2B2] rounded-lg blur-sm opacity-75 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0FFF8] via-[#FFF0F5] to-[#FFF9E6]">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FFF8] via-[#FFF0F5] to-[#FFF9E6]">
      <div className="pt-24 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#C9F0DD]/20 via-[#FFD6E8]/20 to-[#FFF2B2]/20 backdrop-blur-sm border border-[#C9F0DD]/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 mb-6 shadow-lg">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-[#2D5016] relative inline-block pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-[#C9F0DD] after:via-[#FFD6E8] after:to-[#FFF2B2] after:shadow-md">
                Products
              </h1>
              <p className="text-sm text-[#5A7D3E]">{productList.length} results</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 border-2 bg-gradient-to-r from-[#C9F0DD] via-[#FFD6E8] to-[#FFF2B2] hover:from-[#B0E8CD] hover:via-[#F5C2D9] hover:to-[#FFE999] text-[#2D5016] font-medium shadow-lg hover:shadow-xl transition-all duration-300 ${
                hasActiveFilters ? "ring-2 ring-[#FFD6E8] ring-offset-2" : ""
              }`}
              onClick={() => setIsFilterOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="ml-1 w-4 h-4 rounded-full bg-[#FF6B9D] text-white text-xs flex items-center justify-center shadow-md">
                  {Object.values(filters).flat().length}
                </span>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center border-2 bg-gradient-to-r from-[#C9F0DD] via-[#FFD6E8] to-[#FFF2B2] hover:from-[#B0E8CD] hover:via-[#F5C2D9] hover:to-[#FFE999] text-[#2D5016] font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] bg-gradient-to-b from-[#F0FFF8] to-[#FFF0F5] backdrop-blur-md border-2 border-[#C9F0DD] shadow-xl">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-[#C9F0DD] hover:via-[#FFD6E8] hover:to-[#FFF2B2] text-[#2D5016] transition-all duration-200"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-[#5A7D3E] font-medium">Active filters:</span>
            {Object.entries(filters).map(([categoryName, selectedIds]) =>
              selectedIds.map((id) => {
                const category = categories.find((cat) => cat.name === categoryName);
                const subcategory = subCategories.find((sub) => sub.id === id);
                if (!subcategory) return null;

                return (
                  <div
                    key={`${categoryName}-${id}`}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#C9F0DD] via-[#FFD6E8] to-[#FFF2B2] text-[#2D5016] font-medium text-xs flex items-center gap-1 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <span>{subcategory.name}</span>
                    <button
                      className="hover:text-[#FF6B9D] transition-colors duration-200"
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
              className="text-xs text-[#5A7D3E] hover:text-[#FF6B9D] hover:bg-[#FFD6E8]/20 font-medium transition-all duration-200"
              onClick={() => {
                setFilters({});
                sessionStorage.removeItem("filters");
              }}
            >
              Clear all
            </Button>
          </div>
        )}

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {productList.length > 0 ? (
            productList.map((productItem) => (
              <motion.div key={productItem.id} variants={item}>
                <ShoppingProductTile
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-[#5A7D3E] font-medium">No products found matching your criteria</p>
              <Button
                variant="outline"
                className="mt-4 border-2 bg-gradient-to-r from-[#C9F0DD] via-[#FFD6E8] to-[#FFF2B2] hover:from-[#B0E8CD] hover:via-[#F5C2D9] hover:to-[#FFE999] text-[#2D5016] font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  setFilters({});
                  sessionStorage.removeItem("filters");
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
            >
              <motion.div
                className="bg-gradient-to-b from-[#F0FFF8] to-[#FFF0F5] border-2 border-[#C9F0DD] shadow-2xl rounded-xl w-full max-w-md mx-4 p-4 max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#2D5016] flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsFilterOpen(false)}
                    className="hover:bg-[#FFD6E8]/20 text-[#2D5016]"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <ProductFilter filters={filters} handleFilter={handleFilter} categories={categories} />
                <div className="mt-4 flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-[#C9F0DD] via-[#FFD6E8] to-[#FFF2B2] hover:from-[#B0E8CD] hover:via-[#F5C2D9] hover:to-[#FFE999] text-[#2D5016] font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-[#C9F0DD] text-[#2D5016] hover:bg-[#FFD6E8]/20 font-medium transition-all duration-200"
                    onClick={() => {
                      setFilters({});
                      sessionStorage.removeItem("filters");
                      setIsFilterOpen(false);
                    }}
                  >
                    Clear
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