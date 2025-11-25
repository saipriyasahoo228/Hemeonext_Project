import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import banner4 from "../../assets/banner4.jpg";
import banner5 from "../../assets/banner5.jpg";
import banner6 from "../../assets/banner6.jpg";

const categoriesWithIcon = [
  {
    id: "cold-cough",
    label: "Cold & Cough Relief",
    image: "/assets/cold.jpg",
    description: "Gentle remedies for runny nose, sore throat, sneezing and cough — safe for daily family use.",
  },
  {
    id: "digestive-care",
    label: "Digestive & Stomach Care",
    image: "/assets/digestive.jpg",
    description: "Natural support for acidity, indigestion, gas and bloating to restore digestive balance.",
  },
  {
    id: "immunity-boosters",
    label: "Immunity Boosters",
    image: "/assets/immunity.jpg",
    description: "Daily homeopathic formulations to strengthen your natural defenses and vitality.",
  },
  {
    id: "pain-relief",
    label: "Pain & Joint Relief",
    image: "/assets/jointpain.jpg",
    description: "Non-addictive, holistic relief for headaches, muscle & joint pain and inflammation.",
  },
  {
    id: "skin-and-hair",
    label: "Skin & Hair Care",
    image: "/assets/oil.jpg",
    description: "Soothing, gentle remedies for acne, rashes, dandruff and scalp health.",
  },
  {
    id: "kids-homeopathy",
    label: "Kids & Baby Care",
    image: "/assets/kids.jpg",
    description: "Mild, child-friendly homeopathic solutions for teething, fever, colds and routine care.",
  },
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
    tag: "MOST POPULAR"
  },
  {
    id: "offer-2",
    label: "Seasonal Immunity Kit",
    image: "/assets/offer2.jpg",
    description: "Special kit for seasonal changes and weather transitions",
    originalPrice: "₹1999",
    discountedPrice: "₹1399",
    discount: "25% OFF",
    tag: "LIMITED TIME"
  },
  {
    id: "offer-3",
    label: "Senior Citizen Care",
    image: "/assets/offer3.jpg",
    description: "Tailored solutions for age-related health concerns",
    originalPrice: "₹2999",
    discountedPrice: "₹2099",
    discount: "35% OFF",
    tag: "SPECIAL OFFER"
  },
  {
    id: "offer-4",
    label: "First Time User Pack",
    image: "/assets/offer4.jpg",
    description: "Introductory pack for new customers with guidance booklet",
    originalPrice: "₹1599",
    discountedPrice: "₹999",
    discount: "40% OFF",
    tag: "BEST VALUE"
  },
  {
    id: "offer-5",
    label: "Detox & Cleanse Combo",
    image: "/assets/offer5.jpg",
    description: "Complete detoxification system for holistic wellness",
    originalPrice: "₹3599",
    discountedPrice: "₹2499",
    discount: "30% OFF",
    tag: "NEW"
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
    price: "₹1499"
  },
  {
    id: "test-2",
    label: "Immunity Profile Test",
    image: "/assets/test2.jpg",
    description: "Detailed analysis of your immune system strength and vitality",
    tests: "15 Parameters",
    duration: "24 hrs",
    price: "₹999"
  },
  {
    id: "test-3",
    label: "Metabolic Health Check",
    image: "/assets/test3.jpg",
    description: "Complete metabolic profile with diet and lifestyle guidance",
    tests: "18 Parameters",
    duration: "48 hrs",
    price: "₹1299"
  },
  {
    id: "test-4",
    label: "Allergy Sensitivity Test",
    image: "/assets/test4.jpg",
    description: "Identify allergens and sensitivities with natural remedy suggestions",
    tests: "20+ Allergens",
    duration: "72 hrs",
    price: "₹1899"
  },
  
];

const banners = [
  { id: 1, image: banner4, text: "New Homeopathic Remedies!" },
  { id: 2, image: banner5, text: "Natural Healing Solutions!" },
  { id: 3, image: banner6, text: "Family Wellness Packages!" },
];

const glitterColors = [
  "#A7F3D0", // light mint
  "#D9F99D", // soft yellow-green
  "#C6F6D5", // pastel green
  "#FDE68A", // light yellow
  "#A5F3FC", // pale cyan
  "#FBCFE8", // soft pink
  "#6EE7B7", // soft teal
];

const GlitterParticle = ({ color, size, left, top, delay }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      left: `${left}%`,
      top: `${top}%`,
      background: color,
      boxShadow: `0 0 ${size} ${size} ${color}40`,
    }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      repeatType: "loop",
    }}
  />
);

// Scrollable Carousel Component
const ScrollableCarousel = ({ items, title, navigate, type = "offers" }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      // Update arrow visibility after scroll
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
      currentRef.addEventListener('scroll', checkScroll);
      checkScroll(); // Initial check
      return () => currentRef.removeEventListener('scroll', checkScroll);
    }
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <GlitterParticle
            key={i}
            color={glitterColors[i % glitterColors.length]}
            size={Math.random() * 8 + 3}
            left={Math.random() * 100}
            top={Math.random() * 100}
            delay={Math.random() * 3}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold leading-snug bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent font-poppins"
          >
            {title}
          </motion.h2>
          
          {/* View All Link */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(type === "offers" ? "/offers" : "/tests")}
              className="text-green-700 hover:text-green-800 hover:bg-green-50 font-semibold"
            >
              View All →
            </Button>
          </motion.div>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg border border-gray-200 backdrop-blur-sm transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg border border-gray-200 backdrop-blur-sm transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
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
                        <span className="px-3 py-1 rounded-full text-sm font-bold text-white bg-red-500 shadow-lg">
                          {item.discount}
                        </span>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded-full text-xs font-bold text-white bg-orange-500">
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
                        <span className="text-xl font-bold text-green-700">{item.discountedPrice}</span>
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
                        type === "offers" 
                          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white" 
                          : "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
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

        {/* Mobile View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mt-8 md:hidden"
        >
          <Button
            onClick={() => navigate(type === "offers" ? "/offers" : "/tests")}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold"
          >
            View All {type === "offers" ? "Offers" : "Tests"}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default function HomeopathicLayout() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 300], [0, -100]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden font-sans">
      {/* Background Glitter */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <GlitterParticle
            key={i}
            color={glitterColors[i % glitterColors.length]}
            size={Math.random() * 6 + 2}
            left={Math.random() * 100}
            top={Math.random() * 100}
            delay={Math.random() * 2}
          />
        ))}
      </div>

      <div className="w-full mx-auto min-h-screen relative z-10">
        {/* HEADER */}
        <section className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-200 via-green-100 to-yellow-100 animate-gradient-x"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/10"></div>

          {/* Header Sparkles */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white text-xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Top View All Products Link */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-end mb-4"
            >
             
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-5xl md:text-6xl font-extrabold italic mb-4 bg-gradient-to-r from-green-800 via-green-600 to-emerald-500 bg-clip-text text-transparent animate-pulse" style={{ fontFamily: "'Playfair Display', serif" }}>
                HOMEONEXT
              </h1>
              <p className="text-xl md:text-2xl italic mb-4 drop-shadow-md" style={{ fontFamily: "'Merriweather', serif", color: "#e45bf9ff" }}>
                Natural Remedies • Certified Treatments • Wellness Solutions
              </p>
            </motion.div>

            {/* Navigation Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {["Homeopathic Medicines", "Doctor Consultations", "Treatment Plans", "Wellness Products"].map((item, index) => (
                <motion.div
                  key={item}
                  whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    variant="outline"
                    className="px-6 py-3 rounded-full text-white drop-shadow-md relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, #047857, #d9c697ff, #f6afefff, #e4d2f6ff)`,
                    }}
                  >
                    <span className="relative z-10 font-semibold">{item}</span>
                    <div className="absolute inset-0 bg-white/10 hover:bg-white/20 transition-all rounded-full"></div>
                  </Button>
                </motion.div>
              ))}
            </motion.div>

            {/* Banner Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-6xl mx-auto relative h-80 rounded-3xl overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(45deg, #A7F3D0, #D9F99D, #FDE68A, #FBCFE8)',
                padding: '4px',
              }}
            >
              <div className="w-full h-full rounded-3xl overflow-hidden bg-white">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={currentBanner}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={banners[currentBanner].image}
                      alt={`Banner ${banners[currentBanner].id}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center">
                      <p className="text-3xl md:text-4xl font-bold text-white text-center px-4 drop-shadow-2xl font-poppins">
                        {banners[currentBanner].text}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <button 
                  onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-3 transition-all backdrop-blur-sm"
                >
                  ←
                </button>
                <button 
                  onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-3 transition-all backdrop-blur-sm"
                >
                  →
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SPECIAL OFFERS SECTION */}
        <ScrollableCarousel 
          items={specialOffers} 
          title="🎁 Special Offers" 
          navigate={navigate}
          type="offers"
        />

        {/* CATEGORIES GRID */}
        <section className="py-16 bg-gradient-to-br from-green-50 via-yellow-50 to-pink-50 relative overflow-hidden">
  <div className="absolute inset-0 opacity-10">
    {[...Array(8)].map((_, i) => (
      <GlitterParticle
        key={i}
        color={glitterColors[i % glitterColors.length]}
        size={Math.random() * 8 + 3}
        left={Math.random() * 100}
        top={Math.random() * 100}
        delay={Math.random() * 3}
      />
    ))}
  </div>

  <div className="container mx-auto px-4 relative z-10">
    {/* Header with View All Button */}
    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold leading-snug bg-gradient-to-r from-green-800 via-green-700 to-emerald-600 bg-clip-text text-transparent font-poppins text-center md:text-left mb-6 md:mb-0"
      >
        Our Treatment Categories
      </motion.h2>
      
      {/* View All Products Button */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="hidden md:block"
      >
        <Button
          onClick={() => navigate("/shop/listing")}
          className="px-8 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #047857, #059669, #10b981)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex items-center gap-2">
            View All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Button>
      </motion.div>
    </div>

    {/* Categories Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {categoriesWithIcon.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.03, rotateY: 5 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-transparent"
        >
          <div className="h-56 md:h-64 lg:h-72 overflow-hidden relative">
            <img
              src={category.image}
              alt={category.label}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-green-900 mb-3 font-poppins">
              {category.label}
            </h3>
            <p className="text-orange-800 mb-4 leading-relaxed font-serif">
              {category.description}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate(`/shop/listing?category=${category.id}`)}
                className="w-full py-3 rounded-lg transition-all duration-300 font-semibold"
                style={{
                  background: `linear-gradient(45deg, ${glitterColors[index % glitterColors.length]}, ${glitterColors[(index + 1) % glitterColors.length]})`,
                  color: 'white',
                  border: 'none',
                }}
              >
                Explore Products
              </Button>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Mobile View All Button */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex justify-center mt-12 md:hidden"
    >
      <Button
        onClick={() => navigate("/shop/listing")}
        className="px-8 py-4 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
        style={{
          background: 'linear-gradient(135deg, #047857, #059669, #10b981)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="flex items-center gap-3">
          View All Products
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </Button>
    </motion.div>
  </div>
</section>

        {/* POPULAR TESTS SECTION */}
        <ScrollableCarousel 
          items={popularTests} 
          title="🧪 Popular Health Tests" 
          navigate={navigate}
          type="tests"
        />

        {/* CTA SECTION */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-300 via-yellow-200 to-pink-200 animate-gradient-x"></div>
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white text-xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 2, delay: Math.random() * 2, repeat: Infinity }}
              >
                ✨
              </motion.div>
            ))}
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-green-900 drop-shadow-2xl font-poppins"
            >
              Ready for Natural Healing?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl mb-8 max-w-2xl mx-auto text-green-800 drop-shadow-lg font-serif"
            >
              Discover our range of homeopathic remedies and consult with certified practitioners
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate("/shop/listing")}
                  className="px-8 py-4 rounded-full text-lg font-semibold border-2 border-green-900"
                  style={{ background: 'linear-gradient(45deg, #A7F3D0, #D9F99D)', color: 'white' }}
                >
                  ✨ Shop All Products
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="px-8 py-4 rounded-full text-lg font-semibold border-2 border-green-900 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-green-900"
                >
                  🌟 Book Consultation
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gradient-to-r from-green-900 via-green-800 to-black text-white py-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {[...Array(5)].map((_, i) => (
              <GlitterParticle
                key={i}
                color={glitterColors[i % glitterColors.length]}
                size={Math.random() * 4 + 1}
                left={Math.random() * 100}
                top={Math.random() * 100}
                delay={Math.random() * 4}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <p className="text-lg font-semibold mb-2 bg-gradient-to-r from-green-300 via-green-200 to-green-100 bg-clip-text text-transparent font-poppins">
              Homeopathic Healing Center
            </p>
            <p className="text-green-200 mb-2">Natural • Safe • Effective</p>
            
            <p className="text-sm mt-2 md:mt-4 font-light">
              Developed by{" "}
              <a
                href="https://www.intulet.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d4a373] hover:underline transition-colors duration-300"
              >
                Intulet Technologies
              </a>
            </p>

            <div className="flex justify-center md:space-x-8 space-x-4 md:mt-4 mt-2">
              <a
                href="#"
                className="text-[#f7e4bc]/80 hover:text-[#d4a373] hover:underline transition-colors duration-300 text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-[#f7e4bc]/80 hover:text-[#d4a373] hover:underline transition-colors duration-300 text-sm"
              >
                Terms of Service
              </a>
              <a
                href="/shop/listing"
                className="text-[#f7e4bc]/80 hover:text-[#d4a373] hover:underline transition-colors duration-300 text-sm"
              >
                Browse All Products
              </a>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 inline-block"
            >
              <Button
                onClick={() => navigate("/shop/listing")}
                className="px-6 py-3 font-semibold text-white rounded-full transition-all duration-500"
                style={{
                  background: "linear-gradient(45deg, #a8e6cf, #dcedc1, #ffd3b6, #cce7ff)",
                  backgroundSize: "300% 300%",
                  animation: "shimmer 4s ease infinite",
                  border: "none",
                  color: "#000",
                }}
              >
                Browse All Products
              </Button>
            </motion.div>
          </div>

          <style>
            {`
              @keyframes shimmer {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}
          </style>
        </footer>
      </div>
    </div>
  );
}