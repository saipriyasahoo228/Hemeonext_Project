// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "../ui/button";
// import { Link } from "react-router-dom";
// import { Menu, X, ShoppingBag, Sparkles, ArrowRight, Zap } from "lucide-react";

// export default function MenuComponent({
//   menuOpen,
//   setMenuOpen,
//   categories,
//   toggleButtonClassName = "",
//   toggleButtonSize = "w-14 h-14", // Default size
//   customClassName="",
//   customToggle = null,
// }) {
//   const defaultToggleClassName = `group relative ${toggleButtonSize} rounded-full hover:bg-black hover:text-white bg-transparent dark:bg-indigo-950/80 backdrop-blur-md border-black dark:border-indigo-800 shadow-lg hover:shadow-orange-200/50 dark:hover:shadow-indigo-700/30 hover:border-gray-200 hover:border-4 dark:hover:border-indigo-700 transition-all duration-300`;

//   return (
//     <>
//       {!menuOpen && (
//         <motion.div className={`${customClassName}`} whileHover={{ scale: 1.05 }}>
//           {customToggle ? (
//             customToggle({ setMenuOpen })
//           ) : (
//             <Button
//               variant="outline"
//               size="icon"
//               className={`${defaultToggleClassName} ${toggleButtonClassName}`}
//               onClick={() => setMenuOpen(!menuOpen)}
//             >
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key="menu"
//                   initial={{ rotate: 90, opacity: 0 }}
//                   animate={{ rotate: 0, opacity: 1 }}
//                   exit={{ rotate: -90, opacity: 0 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <Menu className="h-6 w-6 md:text-black text-white dark:text-violet-300 group-hover:text-white transition-transform duration-300" />
//                 </motion.div>
//               </AnimatePresence>
//             </Button>
//           )}
//         </motion.div>
//       )}

//       <AnimatePresence>
//         {menuOpen && (
//           <motion.div
//             className="fixed inset-0 z-20 flex"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <motion.div
//               className="w-full md:w-2/3 lg:w-1/2 h-full border-4 border-primary bg-background dark:bg-indigo-950 backdrop-blur-md shadow-2xl overflow-y-auto dark:border-indigo-800"
//               initial={{ x: "-100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "-100%" }}
//               transition={{ type: "spring", damping: 25, stiffness: 300 }}
//             >
//               <motion.div
//                 className="absolute right-8 top-8 z-30"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: 20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className={`group relative ${toggleButtonSize} rounded-full hover:bg-black hover:text-white bg-transparent dark:bg-indigo-950/80 backdrop-blur-md border-black dark:border-indigo-800 shadow-lg hover:shadow-orange-200/50 dark:hover:shadow-indigo-700/30 hover:border-gray-200 hover:border-4 dark:hover:border-indigo-700 transition-all duration-300`}
//                   onClick={() => setMenuOpen(false)}
//                 >
//                   <X className="h-6 w-6 text-black dark:text-violet-300 group-hover:text-white transition-transform duration-300" />
//                 </Button>
//               </motion.div>

//               <div className="p-4 pl-8 space-y-2">
//                 <div className="flex items-center gap-3 mb-10">
//                   {/* Uncomment if you want the logo */}
//                   {/* <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-violet-500 to-indigo-600">
//                     <ShoppingBag className="h-6 w-6 text-white" />
//                   </div>
//                   <span className="font-bold text-2xl bg-gradient-to-r from-violet-700 to-indigo-600 dark:from-violet-400 dark:to-indigo-300 bg-clip-text text-transparent">
//                     YourrKart
//                   </span> */}
//                 </div>

//                 <div className="space-y-2">
//                   <h3 className="text-2xl font-medium text-black dark:text-violet-200 dark:border-indigo-700 pb-2 flex items-center gap-2">
//                     <Sparkles className="h-5 w-5 text-gray-700 dark:text-violet-400" />
//                     Categories
//                   </h3>

//                   <div className="grid grid-cols-1 gap-1">
//                     {categories.length > 0 ? (
//                       categories.map((category) => (
//                         <motion.div
//                           key={category.id}
//                           className="group"
//                           whileHover={{ x: 5 }}
//                           transition={{ duration: 0.2 }}
//                         >
//                           <div className="flex flex-col p-1 rounded-md bg-none dark:bg-indigo-900/30 hover:border-none dark:hover:bg-indigo-800/50 transition-colors duration-300 dark:border-indigo-800 group-hover:border-violet-300 dark:group-hover:border-indigo-700">
//                             <Link
//                               to={`/shop/listing?category=${category.slug}`}
//                               className="flex items-center gap-2"
//                               onClick={() => setMenuOpen(false)}
//                             >
//                               <div className="flex-1">
//                                 <div className="text-lg font-medium text-black dark:text-violet-200 group-hover:text-[#ebc34d] dark:group-hover:text-violet-300 transition-colors">
//                                   {category.name}
//                                 </div>
//                               </div>
//                               <ArrowRight className="h-5 w-5 text-gray-500 dark:text-violet-500 group-hover:text-gray-700 dark:group-hover:text-violet-300 group-hover:translate-x-1 transition-all duration-300" />
//                             </Link>
//                             <div className="ml-4 mt-1 space-y-1">
//                               {category.subcategories?.map((subcat) => (
//                                 <Link
//                                   key={subcat.id}
//                                   to={`/shop/listing?category=${category.slug}&subcategory=${subcat.slug}`}
//                                   className="block text-sm text-black/70 dark:text-violet-300/70 hover:text-primary dark:hover:text-violet-300 transition-colors"
//                                   onClick={() => setMenuOpen(false)}
//                                 >
//                                   - {subcat.name}
//                                 </Link>
//                               ))}
//                             </div>
//                           </div>
//                         </motion.div>
//                       ))
//                     ) : (
//                       <div className="text-sm text-black/70 dark:text-violet-300/70">
//                         No categories available
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="pt-2 dark:border-indigo-800">
//                   <Button
//                     className="w-full bg-gradient-to-r from-primary/60 to-primary/80 hover:from-gray-400 hover:to-gray-300 text-black shadow-lg hover:shadow-primary/50 dark:hover:shadow-indigo-700/30 group h-12 rounded-md text-lg"
//                     onClick={() => setMenuOpen(false)}
//                     asChild
//                   >
//                     <Link to="/shop/listing" className="flex items-center justify-center gap-2">
//                       <Zap className="h-5 w-5 group-hover:animate-pulse" />
//                       Browse All Products
//                       <ArrowRight className="ml-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
//                     </Link>
//                   </Button>
//                 </div>
//               </div>
//             </motion.div>

//             <motion.div
//               className="flex-1 bg-indigo-950/30 backdrop-blur-sm"
//               onClick={() => setMenuOpen(false)}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );

// }




// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "../ui/button";
// import { Link } from "react-router-dom";
// import { Menu, X, Sparkles, ArrowRight, Zap } from "lucide-react";

// export default function MenuComponent({
//   menuOpen,
//   setMenuOpen,
//   categories,
//   toggleButtonClassName = "",
//   toggleButtonSize = "w-14 h-14",
//   customClassName="",
//   customToggle = null,
// }) {
//   const defaultToggleClassName = `
//     group relative ${toggleButtonSize} rounded-full 
//     bg-gradient-to-br from-purple-200/50 via-pink-200/30 to-yellow-200/50
//     backdrop-blur-xl border border-purple-300/40 shadow-md
//     hover:shadow-purple-400/50 hover:bg-gradient-to-br from-purple-300/60 via-pink-300/40 to-yellow-300/60
//     transition-all duration-300
//   `;

//   return (
//     <>
//       {!menuOpen && (
//         <motion.div className={`${customClassName}`} whileHover={{ scale: 1.05 }}>
//           {customToggle ? (
//             customToggle({ setMenuOpen })
//           ) : (
//             <Button
//               variant="outline"
//               size="icon"
//               className={`${defaultToggleClassName} ${toggleButtonClassName}`}
//               onClick={() => setMenuOpen(!menuOpen)}
//             >
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key="menu"
//                   initial={{ rotate: 90, opacity: 0 }}
//                   animate={{ rotate: 0, opacity: 1 }}
//                   exit={{ rotate: -90, opacity: 0 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <Menu className="h-6 w-6 text-purple-700 dark:text-violet-300 transition-transform duration-300" />
//                 </motion.div>
//               </AnimatePresence>
//             </Button>
//           )}
//         </motion.div>
//       )}

//       <AnimatePresence>
//         {menuOpen && (
//           <motion.div
//             className="fixed inset-0 z-20 flex"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <motion.div
//               className="
//                 w-full md:w-2/3 lg:w-1/2 h-full
//                 bg-white dark:bg-indigo-950
//                 border-4 border-gradient-to-r from-purple-400/50 via-pink-400/40 to-yellow-400/50
//                 shadow-2xl shadow-purple-200/40 dark:shadow-indigo-900/40
//                 overflow-y-auto
//               "
//               initial={{ x: "-100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "-100%" }}
//               transition={{ type: "spring", damping: 25, stiffness: 300 }}
//             >
//               <motion.div
//                 className="absolute right-8 top-8 z-30"
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: 20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className={`
//                     group relative ${toggleButtonSize} rounded-full
//                     bg-gradient-to-br from-purple-200/50 via-pink-200/30 to-yellow-200/50
//                     border border-purple-300/40 shadow-md
//                     hover:shadow-purple-400/50 hover:bg-gradient-to-br from-purple-300/60 via-pink-300/40 to-yellow-300/60
//                     transition-all duration-300
//                   `}
//                   onClick={() => setMenuOpen(false)}
//                 >
//                   <X className="h-6 w-6 text-purple-700 dark:text-violet-300" />
//                 </Button>
//               </motion.div>

//               <div className="p-4 pl-8 space-y-5">
//                 <div>
//                   <h3 className="
//                     text-3xl font-semibold flex items-center gap-2
//                     text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400
//                   ">
//                     <Sparkles className="h-5 w-5 text-purple-600 dark:text-violet-400" />
//                     Categories
//                   </h3>
//                 </div>

//                 <div className="grid grid-cols-1 gap-2">
//                   {categories.length > 0 ? (
//                     categories.map((category) => (
//                       <motion.div
//                         key={category.id}
//                         className="group"
//                         whileHover={{ x: 4 }}
//                       >
//                         <div className="
//                           flex flex-col p-2 rounded-lg
//                           bg-white dark:bg-indigo-900
//                           border-2 border-gradient-to-r from-purple-300/40 via-pink-300/30 to-yellow-300/40
//                           hover:bg-gradient-to-br from-purple-200/50 via-pink-200/30 to-yellow-200/50
//                           transition-all duration-300
//                         ">
//                           <Link
//                             to={`/shop/listing?category=${category.slug}`}
//                             className="flex items-center gap-3"
//                             onClick={() => setMenuOpen(false)}
//                           >
//                             <span className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
//                               {category.name}
//                             </span>
//                             <ArrowRight className="h-5 w-5 text-purple-700 dark:text-violet-300" />
//                           </Link>

//                           <div className="ml-5 mt-1 space-y-1">
//                             {category.subcategories?.map((subcat) => (
//                               <Link
//                                 key={subcat.id}
//                                 to={`/shop/listing?category=${category.slug}&subcategory=${subcat.slug}`}
//                                 className="block text-sm text-purple-700/70 dark:text-violet-300/70 hover:text-purple-500 transition-colors"
//                                 onClick={() => setMenuOpen(false)}
//                               >
//                                 - {subcat.name}
//                               </Link>
//                             ))}
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))
//                   ) : (
//                     <p className="text-sm text-purple-700/70 dark:text-violet-300/70">
//                       No categories available
//                     </p>
//                   )}
//                 </div>

//                 <div className="pt-2">
//                   <Button
//                     className="
//                       w-full h-12 rounded-lg text-lg
//                       bg-gradient-to-r from-purple-300/60 via-pink-300/50 to-yellow-300/60
//                       hover:from-purple-400/70 hover:via-pink-400/60 hover:to-yellow-400/70
//                       text-black dark:text-white shadow-lg hover:shadow-purple-400/50 transition-all duration-300
//                     "
//                     asChild
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     <Link to="/shop/listing" className="flex items-center justify-center gap-2">
//                       <Zap className="h-5 w-5" />
//                       Browse All Products
//                       <ArrowRight className="h-5 w-5" />
//                     </Link>
//                   </Button>
//                 </div>
//               </div>
//             </motion.div>

//             <motion.div
//               className="flex-1 bg-white/10 backdrop-blur-sm"
//               onClick={() => setMenuOpen(false)}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }




import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Menu, X, Sparkles, ArrowRight, Zap } from "lucide-react";

export default function MenuComponent({
  menuOpen,
  setMenuOpen,
  categories,
}) {
  const categoryColors = [
    "from-green-800 via-green-600 to-yellow-400",
    "from-green-700 via-yellow-500 to-orange-400",
    "from-yellow-600 via-orange-400 to-green-500",
    "from-green-900 via-green-700 to-yellow-500",
  ];

  const subCatColors = [
    "text-green-700",
    "text-yellow-700",
    "text-orange-600",
    "text-green-600",
  ];

  return (
    <>
      {!menuOpen && (
        <Button
          variant="outline"
          size="icon"
          className="w-14 h-14 rounded-full bg-green-200/50 shadow-md hover:shadow-green-400 transition-all duration-300"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="h-6 w-6 text-green-800" />
        </Button>
      )}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-20 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-full md:w-2/3 lg:w-1/2 h-full bg-amber-50 p-6 overflow-y-auto shadow-xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Close button */}
              <motion.div
                className="absolute right-6 top-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Button
                  size="icon"
                  className="w-12 h-12 rounded-full bg-green-200/50 shadow-md hover:shadow-green-400"
                  onClick={() => setMenuOpen(false)}
                >
                  <X className="h-6 w-6 text-green-800" />
                </Button>
              </motion.div>

              {/* Categories header */}
              <div className="mb-6">
                <h3 className="text-3xl font-bold flex items-center gap-2 text-green-900">
                  <Sparkles className="h-5 w-5 text-green-700" />
                  Categories
                </h3>
              </div>

              {/* Categories list (vertical stacked arrangement) */}
              <div className="space-y-4">
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="rounded-xl bg-white/80 p-4 shadow-md backdrop-blur-sm transition-all"
                    >
                      <Link
                        to={`/shop/listing?category=${category.slug}`}
                        className={`text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r ${categoryColors[index % categoryColors.length]}`}
                        onClick={() => setMenuOpen(false)}
                      >
                        {category.name} <ArrowRight className="inline h-5 w-5" />
                      </Link>

                      <div className="ml-3 mt-2 flex flex-col gap-1">
  {category.subcategories?.map((subcat, sIndex) => (
    <Link
      key={subcat.id}
      to={`/shop/listing?category=${category.slug}&subcategory=${subcat.slug}`}
      className={`${subCatColors[sIndex % subCatColors.length]} text-sm hover:text-green-600 transition-colors`}
      onClick={() => setMenuOpen(false)}
    >
      * {subcat.name}
    </Link>
  ))}
</div>

                    </motion.div>
                  ))
                ) : (
                  <p className="text-green-800/70">No categories available</p>
                )}
              </div>

              {/* Browse All Products */}
              <div className="mt-6">
                <Button
                  className="w-full h-12 rounded-full bg-gradient-to-r from-green-700 via-yellow-400 to-orange-400 hover:from-green-800 hover:via-yellow-300 hover:to-orange-300 text-white shadow-lg transition-all duration-300"
                  asChild
                  onClick={() => setMenuOpen(false)}
                >
                  <Link to="/shop/listing" className="flex items-center justify-center gap-2">
                    <Zap className="h-5 w-5" /> Browse All Products <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Overlay */}
            <motion.div
              className="flex-1 bg-black/10 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
