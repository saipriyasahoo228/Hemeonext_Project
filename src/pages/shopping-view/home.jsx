// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { useState, useEffect, useRef } from "react";
// import banner4 from "../../assets/banner_homeo1.webp";
// import banner5 from "../../assets/banner5.jpg";
// import banner6 from "../../assets/banner6.jpg";

// // API client function
// import { fetchBrands,fetchCategories  } from "../../api/productApi"; 


// const dummyImages = [
//   "/public/assets/oil.jpg",
//   "/public/assets/cold.jpg",
//   "/public/assets/digestive.jpg",
//   "/public/assets/immunity.jpg",
//   "/public/assets/jointpain.jpg",
//   "/public/assets/kids.jpg",
//   "/public/assets/offer1.jpg",
//   "/public/assets/urinary.jpg",
//   "/assets/cholesterol.jpg",
//   "/assets/allergy.jpg",
//   "/assets/uti.jpg",
// ];


// const dummyBrandLogos = [
//   "/public/assets/sbl.jpg",
//   "/public/assets/Ainsworths.webp",
//   "/public/assets/Dr. Batra’s.webp",
//   "/public/assets/Nelsons.jpg",
//   "/public/assets/B. Jain.jpg",
//   "/public/assets/Medisynth.jpg",
//   "/public/assets/Bioforce.jpg",
//   "/public/assets/Adel.webp",
// ];



// const specialOffers = [
//   {
//     id: "offer-1",
//     label: "Family Wellness Package",
//     image: "/assets/offer1.jpg",
//     description: "Complete health package for family of 4 with 3 months supply",
//     originalPrice: "₹4999",
//     discountedPrice: "₹3499",
//     discount: "30% OFF",
//     tag: "MOST POPULAR"
//   },
//   {
//     id: "offer-2",
//     label: "Seasonal Immunity Kit",
//     image: "/assets/offer2.jpg",
//     description: "Special kit for seasonal changes and weather transitions",
//     originalPrice: "₹1999",
//     discountedPrice: "₹1399",
//     discount: "25% OFF",
//     tag: "LIMITED TIME"
//   },
//   {
//     id: "offer-3",
//     label: "Senior Citizen Care",
//     image: "/assets/offer3.jpg",
//     description: "Tailored solutions for age-related health concerns",
//     originalPrice: "₹2999",
//     discountedPrice: "₹2099",
//     discount: "35% OFF",
//     tag: "SPECIAL OFFER"
//   },
//   {
//     id: "offer-4",
//     label: "First Time User Pack",
//     image: "/assets/offer4.jpg",
//     description: "Introductory pack for new customers with guidance booklet",
//     originalPrice: "₹1599",
//     discountedPrice: "₹999",
//     discount: "40% OFF",
//     tag: "BEST VALUE"
//   },
//   {
//     id: "offer-5",
//     label: "Detox & Cleanse Combo",
//     image: "/assets/offer5.jpg",
//     description: "Complete detoxification system for holistic wellness",
//     originalPrice: "₹3599",
//     discountedPrice: "₹2499",
//     discount: "30% OFF",
//     tag: "NEW"
//   },
// ];

// const popularTests = [
//   {
//     id: "test-1",
//     label: "Full Body Wellness Test",
//     image: "/assets/test1.jpg",
//     description: "Comprehensive health assessment with personalized recommendations",
//     tests: "25+ Parameters",
//     duration: "24-48 hrs",
//     price: "₹1499"
//   },
//   {
//     id: "test-2",
//     label: "Immunity Profile Test",
//     image: "/assets/test2.jpg",
//     description: "Detailed analysis of your immune system strength and vitality",
//     tests: "15 Parameters",
//     duration: "24 hrs",
//     price: "₹999"
//   },
//   {
//     id: "test-3",
//     label: "Metabolic Health Check",
//     image: "/assets/test3.jpg",
//     description: "Complete metabolic profile with diet and lifestyle guidance",
//     tests: "18 Parameters",
//     duration: "48 hrs",
//     price: "₹1299"
//   },
//   {
//     id: "test-4",
//     label: "Allergy Sensitivity Test",
//     image: "/assets/test4.jpg",
//     description: "Identify allergens and sensitivities with natural remedy suggestions",
//     tests: "20+ Allergens",
//     duration: "72 hrs",
//     price: "₹1899"
//   },
// ];

// const banners = [
//   { id: 1, image: banner4, text: "New Homeopathic Remedies!" },
//   { id: 2, image: banner5, text: "Natural Healing Solutions!" },
//   { id: 3, image: banner6, text: "Family Wellness Packages!" },
// ];


// const brandsWithLogos = brands.map((brand, index) => ({
//   ...brand,
//   logo: dummyBrandLogos[index % dummyBrandLogos.length], // repeat logos if needed
// }));


// // Scrollable Carousel Component
// const ScrollableCarousel = ({ items, title, navigate, type = "offers" }) => {
//   const scrollRef = useRef(null);
//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(true);

//   const scroll = (direction) => {
//     if (scrollRef.current) {
//       const scrollAmount = 400;
//       const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
//       scrollRef.current.scrollTo({
//         left: newScrollLeft,
//         behavior: 'smooth'
//       });

//       setTimeout(() => {
//         if (scrollRef.current) {
//           const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
//           setShowLeftArrow(scrollLeft > 0);
//           setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
//         }
//       }, 300);
//     }
//   };

//   const checkScroll = () => {
//     if (scrollRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
//       setShowLeftArrow(scrollLeft > 0);
//       setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
//     }
//   };

//   useEffect(() => {
//     const currentRef = scrollRef.current;
//     if (currentRef) {
//       currentRef.addEventListener('scroll', checkScroll);
//       checkScroll();
//       return () => currentRef.removeEventListener('scroll', checkScroll);
//     }
//   }, []);

//   return (
//     <section className="py-16 bg-gray-50 w-full">
//       <div className="w-full">
//         <div className="flex justify-between items-center mb-8 px-4">
//           <motion.h2 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="text-3xl md:text-4xl font-bold text-gray-900"
//           >
//             {title}
//           </motion.h2>
          
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="hidden md:block"
//           >
//             <Button
//               variant="ghost"
//               onClick={() => navigate(type === "offers" ? "/offers" : "/tests")}
//               className="text-blue-600 hover:text-blue-700 font-semibold"
//             >
//               View All →
//             </Button>
//           </motion.div>
//         </div>

//         <div className="relative w-full">
//           {showLeftArrow && (
//             <motion.button
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               onClick={() => scroll('left')}
//               className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-300"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </motion.button>
//           )}

//           {showRightArrow && (
//             <motion.button
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               onClick={() => scroll('right')}
//               className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-300"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </motion.button>
//           )}

//           <div
//             ref={scrollRef}
//             className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 pl-4 pr-6"
//             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//           >
//             {items.map((item, index) => (
//               <motion.div
//                 key={item.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                 viewport={{ once: true }}
//                 className="flex-shrink-0 w-80 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 ml-2 first:ml-4"
//                 whileHover={{ scale: 1.02, y: -5 }}
//               >
//                 <div className="relative h-48 overflow-hidden">
//                   <img
//                     src={item.image}
//                     alt={item.label}
//                     className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
//                   />
//                   {type === "offers" && (
//                     <>
//                       <div className="absolute top-3 right-3">
//                         <span className="px-3 py-1 rounded-full text-sm font-bold text-white bg-red-500">
//                           {item.discount}
//                         </span>
//                       </div>
//                       <div className="absolute top-3 left-3">
//                         <span className="px-2 py-1 rounded-full text-xs font-bold text-white bg-blue-500">
//                           {item.tag}
//                         </span>
//                       </div>
//                     </>
//                   )}
//                 </div>
//                 <div className="p-4">
//                   <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{item.label}</h3>
//                   <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  
//                   {type === "offers" ? (
//                     <div className="flex items-center justify-between mb-4">
//                       <div>
//                         <span className="text-xl font-bold text-green-600">{item.discountedPrice}</span>
//                         <span className="text-sm text-gray-500 line-through ml-2">{item.originalPrice}</span>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-2 gap-2 mb-4">
//                       <div className="text-center">
//                         <div className="text-xs text-gray-500">Tests</div>
//                         <div className="font-semibold text-green-600">{item.tests}</div>
//                       </div>
//                       <div className="text-center">
//                         <div className="text-xs text-gray-500">Duration</div>
//                         <div className="font-semibold text-blue-600">{item.duration}</div>
//                       </div>
//                     </div>
//                   )}
                  
//                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                     <Button
//                       onClick={() => navigate(type === "offers" ? `/offers/${item.id}` : `/tests/${item.id}`)}
//                       className={`w-full py-2 rounded-lg font-semibold ${
//                         type === "offers" 
//                           ? "bg-blue-600 hover:bg-blue-700 text-white" 
//                           : "bg-green-600 hover:bg-green-700 text-white"
//                       }`}
//                     >
//                       {type === "offers" ? "Grab Offer" : "Book Test"}
//                     </Button>
//                   </motion.div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="flex justify-center mt-8 md:hidden px-4"
//         >
//           <Button
//             onClick={() => navigate(type === "offers" ? "/offers" : "/tests")}
//             className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
//           >
//             View All {type === "offers" ? "Offers" : "Tests"}
//           </Button>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// // Brand Circle Component
// const BrandCircle = ({ brand, index }) => {
//   // Generate a consistent color based on brand name
//   const getBrandColor = (brandName) => {
//     const colors = [
//       'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
//       'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
//       'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
//       'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
//       'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
//       'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200',
//       'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200',
//       'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200',
//       'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
//       'bg-lime-100 text-lime-800 border-lime-200 hover:bg-lime-200',
//     ];
    
//     const hash = brandName.split('').reduce((a, b) => {
//       a = ((a << 5) - a) + b.charCodeAt(0);
//       return a & a;
//     }, 0);
    
//     return colors[Math.abs(hash) % colors.length];
//   };

//   const colorClass = getBrandColor(brand.name);

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.8 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ duration: 0.5, delay: index * 0.1 }}
//       whileHover={{ scale: 1.15, y: -5 }}
//       className="flex flex-col items-center"
//     >
//       <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full border-2 flex items-center justify-center mb-4 transition-all duration-300 shadow-md hover:shadow-lg ${colorClass}`}>
//         <span className="text-lg md:text-xl font-bold text-center px-2">
//           {brand.name}
//         </span>
//       </div>
//     </motion.div>
//   );
// };

// export default function HomeopathicLayout() {
//   const navigate = useNavigate();
//   const [currentBanner, setCurrentBanner] = useState(0);
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [categories, setCategories] = useState([]);


//   const toSlug = (name) =>
//   name
//     .toLowerCase()
//     .replace(/&/g, "and")
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");


//   // Fetch brands from API
//   useEffect(() => {
//     const loadBrands = async () => {
//       try {
//         setLoading(true);
//         const brandsData = await fetchBrands();
//         setBrands(brandsData);
//       } catch (err) {
//         console.error("Error fetching brands:", err);
//         setError("Failed to load brands");
//         // Fallback to some default brands if API fails
//         setBrands([
//           { id: 1, name: "BJAIN" },
//           { id: 2, name: "SBL" },
//           { id: 3, name: "Dr. Reckeweg" },
//           { id: 4, name: "Wilmar Schwabe" },
//           { id: 5, name: "Adel Pekana" },
//           { id: 6, name: "Biosyncrasia" },
//           { id: 7, name: "MediSynth" },
//           { id: 8, name: "Baidyanath" },
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadBrands();
//   }, []);

  
// useEffect(() => {
//   fetchCategories()
//     .then((res) => setCategories(res))
//     .catch((err) => console.error(err));
// }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentBanner((prev) => (prev + 1) % banners.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="flex flex-col min-h-screen bg-white">
//       {/* Full Screen Banner Section */}
//       <section className="relative h-[50vh] w-full overflow-hidden">
//         <AnimatePresence initial={false}>
//           <motion.div
//             key={currentBanner}
//             initial={{ opacity: 0, scale: 1.1 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 1 }}
//             transition={{ duration: 0.8 }}
//             className="absolute inset-0"
//           >
//             <img
//               src={banners[currentBanner].image}
//               alt={`Banner ${banners[currentBanner].id}`}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
//               <div className="text-center text-white">
//                 <motion.h1
//                   initial={{ opacity: 0, y: 30 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.8, delay: 0.3 }}
//                   className="text-4xl md:text-6xl font-bold mb-6"
//                 >
//                   {banners[currentBanner].text}
//                 </motion.h1>
//                 <motion.div
//                   initial={{ opacity: 0, y: 30 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.8, delay: 0.5 }}
//                 >
//                   <Button
//                     onClick={() => navigate("/shop/listing")}
//                     className="px-8 py-4 text-lg bg-white text-gray-900 hover:bg-gray-100 font-semibold rounded-lg"
//                   >
//                     Shop Now
//                   </Button>
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>
//         </AnimatePresence>

//         <button 
//           onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
//           className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-3 transition-all"
//         >
//           ←
//         </button>
//         <button 
//           onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
//           className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-3 transition-all"
//         >
//           →
//         </button>

//         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//           {banners.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentBanner(index)}
//               className={`w-2 h-2 rounded-full transition-all ${
//                 currentBanner === index ? 'bg-white' : 'bg-white/50'
//               }`}
//             />
//           ))}
//         </div>
//       </section>

//       {/* BRANDS SECTION - Edge to Edge */}
//       <section className="py-16 bg-white w-full">
//         <div className="w-full px-4">
//           <motion.h2 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
//           >
//             Trusted Brands
//           </motion.h2>
          
//           {loading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//           ) : error ? (
//             <div className="text-center text-red-600 py-8">
//               {error}
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 w-full">
//               {brands.map((brand, index) => (
//                 <BrandCircle key={brand.id} brand={brand} index={index} />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* SPECIAL OFFERS SECTION - Edge to Edge */}
//       <ScrollableCarousel 
//         items={specialOffers} 
//         title="Special Offers" 
//         navigate={navigate}
//         type="offers"
//       />

//       {/* CATEGORIES GRID - Edge to Edge */}
   
//       <section className="py-16 bg-white w-full">
//   <div className="w-full px-4">

//     {/* HEADER */}
//     <div className="flex flex-col md:flex-row justify-between items-center mb-12">
//       <motion.h2 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="text-3xl md:text-4xl font-bold text-gray-900 text-center md:text-left mb-6 md:mb-0"
//       >
//         Our Treatment Categories
//       </motion.h2>

//       <motion.div
//         initial={{ opacity: 0, x: 20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.6, delay: 0.3 }}
//         className="hidden md:block"
//       >
//         <Button
//           onClick={() => navigate("/shop/listing")}
//           className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
//         >
//           View All Products
//         </Button>
//       </motion.div>
//     </div>

//     {/* CATEGORY CARDS (scrollable) */}
//     <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3">
//       {categories.map((cat, index) => (
//         <motion.div
//           key={cat.id}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: index * 0.1 }}
//           whileHover={{ scale: 1.05 }}
//           onClick={() => navigate(`/shop/listing?category=${toSlug(cat.name)}`)}
//           className="relative min-w-[150px] max-w-[150px] h-[220px] rounded-xl overflow-hidden shadow-md cursor-pointer"
//         >
//           <img
//             // src={cat.image}
//             src={dummyImages[index]}
//             alt={cat.name}
//             className="w-full h-full object-cover"
//           />

//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

//           <p className="absolute bottom-3 left-3 text-white font-semibold text-sm leading-tight">
//             {cat.name}
//           </p>
//         </motion.div>
//       ))}
//     </div>

//   </div>
// </section>


//       {/* POPULAR TESTS SECTION - Edge to Edge */}
//       <ScrollableCarousel 
//         items={popularTests} 
//         title="Popular Health Tests" 
//         navigate={navigate}
//         type="tests"
//       />

//       {/* CTA SECTION - Edge to Edge */}
//       <section className="py-16 bg-gray-50 w-full">
//         <div className="w-full px-4 text-center">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
//           >
//             Ready for Natural Healing?
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="text-xl mb-8 max-w-2xl mx-auto text-gray-600"
//           >
//             Discover our range of homeopathic remedies and consult with certified practitioners
//           </motion.p>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className="flex flex-col sm:flex-row gap-4 justify-center"
//           >
//             <Button
//               onClick={() => navigate("/shop/listing")}
//               className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg"
//             >
//               Shop All Products
//             </Button>
//             <Button
//               variant="outline"
//               className="px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg text-lg"
//             >
//               Book Consultation
//             </Button>
//           </motion.div>
//         </div>
//       </section>

//       {/* FOOTER - Edge to Edge */}
//       <footer className="bg-gray-900 text-white py-12 w-full">
//         <div className="w-full px-4 text-center">
//           <p className="text-lg font-semibold mb-2">Homeopathic Healing Center</p>
//           <p className="text-gray-400 mb-4">Natural • Safe • Effective</p>
          
//           <p className="text-sm mt-4 font-light text-gray-400">
//             Developed by{" "}
//             <a
//               href="https://www.intulet.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-400 hover:underline transition-colors duration-300"
//             >
//               Intulet Technologies
//             </a>
//           </p>

//           <div className="flex justify-center space-x-6 mt-6">
//             <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
//               Privacy Policy
//             </a>
//             <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
//               Terms of Service
//             </a>
//             <a href="/shop/listing" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
//               Browse All Products
//             </a>
//           </div>

//           <div className="mt-8">
//             <Button
//               onClick={() => navigate("/shop/listing")}
//               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
//             >
//               Browse All Products
//             </Button>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }












import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import banner4 from "../../assets/banner_homeo1.webp";
import banner5 from "../../assets/banner5.jpg";
import banner6 from "../../assets/banner6.jpg";

// API client function
import { fetchBrands, fetchCategories } from "../../api/productApi";

const dummyImages = [
  "/public/assets/oil.jpg",
  "/public/assets/cold.jpg",
  "/public/assets/digestive.jpg",
  "/public/assets/immunity.jpg",
  "/public/assets/jointpain.jpg",
  "/public/assets/kids.jpg",
  "/public/assets/offer1.jpg",
  "/public/assets/urinary.jpg",
  "/public/assets/diabetes.jpeg",
  "/public/assets/warts.jpg",
  "/public/assets/cholesterol.webp",
];

const dummyBrandLogos = [
  "/public/assets/SBL_logo.jpg",
  "/public/assets/Ainsworths.webp",
  "/public/assets/Dr. Batra’s.webp",
  "/public/assets/Nelsons.jpg",
  "/public/assets/B. Jain.jpg",
  "/public/assets/Medisynth.jpg",
  "/public/assets/Bioforce.jpg",
  "/public/assets/Adel.webp",
];

const specialOffers = [
  {
    id: "offer-1",
    label: "Family Wellness Package",
    image: "/assets/offer1.jpg",
    description: "Complete health package for family of 4 with 3 months supply",
    originalPrice: "₹4999",
    discountedPrice: "₹3499",
    discount: "30% OFF",
    tag: "MOST POPULAR",
  },
  {
    id: "offer-2",
    label: "Seasonal Immunity Kit",
    image: "/assets/offer2.jpg",
    description: "Special kit for seasonal changes and weather transitions",
    originalPrice: "₹1999",
    discountedPrice: "₹1399",
    discount: "25% OFF",
    tag: "LIMITED TIME",
  },
  {
    id: "offer-3",
    label: "Senior Citizen Care",
    image: "/assets/offer3.jpg",
    description: "Tailored solutions for age-related health concerns",
    originalPrice: "₹2999",
    discountedPrice: "₹2099",
    discount: "35% OFF",
    tag: "SPECIAL OFFER",
  },
  {
    id: "offer-4",
    label: "First Time User Pack",
    image: "/assets/offer4.jpg",
    description: "Introductory pack for new customers with guidance booklet",
    originalPrice: "₹1599",
    discountedPrice: "₹999",
    discount: "40% OFF",
    tag: "BEST VALUE",
  },
  {
    id: "offer-5",
    label: "Detox & Cleanse Combo",
    image: "/assets/offer5.jpg",
    description: "Complete detoxification system for holistic wellness",
    originalPrice: "₹3599",
    discountedPrice: "₹2499",
    discount: "30% OFF",
    tag: "NEW",
  },
];

const popularTests = [
  {
    id: "test-1",
    label: "Full Body Wellness Test",
    image: "/assets/test1.jpg",
    description: "Comprehensive health assessment with personalized recommendations",
    tests: "25+ Parameters",
    duration: "24-48 hrs",
    price: "₹1499",
  },
  {
    id: "test-2",
    label: "Immunity Profile Test",
    image: "/assets/test2.jpg",
    description: "Detailed analysis of your immune system strength and vitality",
    tests: "15 Parameters",
    duration: "24 hrs",
    price: "₹999",
  },
  {
    id: "test-3",
    label: "Metabolic Health Check",
    image: "/assets/test3.jpg",
    description: "Complete metabolic profile with diet and lifestyle guidance",
    tests: "18 Parameters",
    duration: "48 hrs",
    price: "₹1299",
  },
  {
    id: "test-4",
    label: "Allergy Sensitivity Test",
    image: "/assets/test4.jpg",
    description: "Identify allergens and sensitivities with natural remedy suggestions",
    tests: "20+ Allergens",
    duration: "72 hrs",
    price: "₹1899",
  },
];

const banners = [
  { id: 1, image: banner4, text: "New Homeopathic Remedies!" },
  { id: 2, image: banner5, text: "Natural Healing Solutions!" },
  { id: 3, image: banner6, text: "Family Wellness Packages!" },
];

// Scrollable Carousel Component
const ScrollableCarousel = ({ items, title, navigate, type = "offers" }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        scrollRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      setTimeout(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          setShowLeftArrow(scrollLeft > 0);
          setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
      }, 300);
    }
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => currentRef.removeEventListener("scroll", checkScroll);
    }
  }, []);

  return (
    <section className="py-16 bg-gray-50 w-full">
      <div className="w-full">
        <div className="flex justify-between items-center mb-8 px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            {title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(type === "offers" ? "/offers" : "/tests")}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All →
            </Button>
          </motion.div>
        </div>

        <div className="relative w-full">
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scroll("left")}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          )}

          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scroll("right")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}

          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 pl-4 pr-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-80 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 ml-2 first:ml-4"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  {type === "offers" && (
                    <>
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 rounded-full text-sm font-bold text-white bg-red-500">
                          {item.discount}
                        </span>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded-full text-xs font-bold text-white bg-blue-500">
                          {item.tag}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{item.label}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                  {type === "offers" ? (
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xl font-bold text-green-600">{item.discountedPrice}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">{item.originalPrice}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Tests</div>
                        <div className="font-semibold text-green-600">{item.tests}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Duration</div>
                        <div className="font-semibold text-blue-600">{item.duration}</div>
                      </div>
                    </div>
                  )}

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => navigate(type === "offers" ? `/offers/${item.id}` : `/tests/${item.id}`)}
                      className={`w-full py-2 rounded-lg font-semibold ${
                        type === "offers" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {type === "offers" ? "Grab Offer" : "Book Test"}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mt-8 md:hidden px-4"
        >
          <Button
            onClick={() => navigate(type === "offers" ? "/offers" : "/tests")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            View All {type === "offers" ? "Offers" : "Tests"}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

// Brand Card Component
const BrandCard = ({ brand, index }) => {
  return (
    <motion.div
      className="flex flex-col items-center bg-white rounded-lg p-4 cursor-pointer border border-gray-200 shadow-md"
      whileHover={{
        scale: 1.05,
         boxShadow: "0 15px 35px rgba(40, 27, 27, 0.35)",
        rotate: [0, -2, 2, -2, 2, 0], // vibrate effect
      }}
      transition={{ duration: 0.4 }}
    >
      {/* Brand Logo */}
      <div className="w-20 h-20 md:w-24 md:h-24 mb-2 flex items-center justify-center overflow-hidden rounded-full">
        <img
          src={brand.logo || "/public/assets/default-logo.png"} // fallback logo
          alt={brand.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Name */}
      <p className="text-sm md:text-base font-semibold text-gray-800 text-center">
        {brand.name}
      </p>
    </motion.div>
  );
};

export default function HomeopathicLayout() {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const toSlug = (name) =>
    name
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Fetch brands from API
  useEffect(() => {
    const loadBrands = async () => {
      try {
        setLoading(true);
        const brandsData = await fetchBrands();
        setBrands(
          brandsData.map((b, i) => ({
            ...b,
            logo: dummyBrandLogos[i % dummyBrandLogos.length],
          }))
        );
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load brands");
        setBrands(
          [
            { id: 1, name: "BJAIN" },
            { id: 2, name: "SBL" },
            { id: 3, name: "Dr. Reckeweg" },
            { id: 4, name: "Wilmar Schwabe" },
            { id: 5, name: "Adel Pekana" },
            { id: 6, name: "Biosyncrasia" },
            { id: 7, name: "MediSynth" },
            { id: 8, name: "Baidyanath" },
          ].map((b, i) => ({
            ...b,
            logo: dummyBrandLogos[i % dummyBrandLogos.length],
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  // Fetch categories
  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res))
      .catch((err) => console.error(err));
  }, []);

  // Banner autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Banner Section */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src={banners[currentBanner].image}
              alt={`Banner ${banners[currentBanner].id}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="text-center text-white">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-4xl md:text-6xl font-bold mb-6"
                >
                  {banners[currentBanner].text}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Button
                    onClick={() => navigate("/shop/listing")}
                    className="px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Shop Now
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Brands Section */}
      <section className="py-16 w-full bg-gray-50">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8"
      >
        Popular Brands
      </motion.h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading brands...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 px-4">
          {brands.map((brand, index) => (
            <BrandCard key={brand.id} brand={brand} index={index} />
          ))}
        </div>
      )}
    </section>

       {/* CATEGORIES GRID - Edge to Edge */}
   
       <section className="py-16 bg-white w-full">
   <div className="w-full px-4">

     {/* HEADER */}
     <div className="flex flex-col md:flex-row justify-between items-center mb-12">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-gray-900 text-center md:text-left mb-6 md:mb-0"
      >
        Our Treatment Categories
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="hidden md:block"
      >
        <Button
          onClick={() => navigate("/shop/listing")}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
        >
          View All Products
        </Button>
      </motion.div>
    </div>

    {/* CATEGORY CARDS (scrollable) */}
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3">
      {categories.map((cat, index) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate(`/shop/listing?category=${toSlug(cat.name)}`)}
          className="relative min-w-[150px] max-w-[150px] h-[220px] rounded-xl overflow-hidden shadow-md cursor-pointer"
        >
          <img
            // src={cat.image}
            src={dummyImages[index]}
            alt={cat.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

          <p className="absolute bottom-3 left-3 text-white font-semibold text-sm leading-tight">
            {cat.name}
          </p>
        </motion.div>
      ))}
    </div>

  </div>
</section>

      {/* Special Offers Carousel */}
      <ScrollableCarousel items={specialOffers} title="Special Offers" navigate={navigate} type="offers" />

      {/* Popular Tests Carousel */}
      <ScrollableCarousel items={popularTests} title="Popular Tests" navigate={navigate} type="tests" />

      
       {/* CTA SECTION - Edge to Edge */}
       <section className="py-16 bg-gray-50 w-full">
         <div className="w-full px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
          >
            Ready for Natural Healing?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto text-gray-600"
          >
            Discover our range of homeopathic remedies and consult with certified practitioners
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => navigate("/shop/listing")}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg"
            >
              Shop All Products
            </Button>
            <Button
              variant="outline"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg text-lg"
            >
              Book Consultation
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER - Edge to Edge */}
      <footer className="bg-gray-900 text-white py-12 w-full">
        <div className="w-full px-4 text-center">
          <p className="text-lg font-semibold mb-2">Homeopathic Healing Center</p>
          <p className="text-gray-400 mb-4">Natural • Safe • Effective</p>
          
          <p className="text-sm mt-4 font-light text-gray-400">
            Developed by{" "}
            <a
              href="https://www.intulet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline transition-colors duration-300"
            >
              Intulet Technologies
            </a>
          </p>

          <div className="flex justify-center space-x-6 mt-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
              Terms of Service
            </a>
            <a href="/shop/listing" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
              Browse All Products
            </a>
          </div>

          <div className="mt-8">
            <Button
              onClick={() => navigate("/shop/listing")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
            >
              Browse All Products
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
