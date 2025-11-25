"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { categories } from "../../data/mockProducts";
import MenuComponent from "../shopping-view/menu-component";
import { ChevronDown, User, Search, Menu, X, ArrowRight, Sparkles, ShoppingBag, Heart, Zap, ShoppingCart } from "lucide-react";
import { useMemo } from "react";
import logo from "../../assets/YourrKartLogo.avif";
import { useCart } from "@/components/common/use-cart";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useCurrency } from "@/context/currency-context"; // Import the currency context
import ReactCountryFlag from "react-country-flag"; // Import the flag component

export default function HeroSection() {
  const { selectedCurrency, setSelectedCurrency } = useCurrency(); // Use the currency context
  const [activeCategory, setActiveCategory] = useState(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const navigate = useNavigate();

  const currentUserId = "user1"; // Hardcoded for now; ideally from auth context
  const { cartCount } = useCart(currentUserId);

  // Map currency codes to country codes for flags (same as in header.jsx)
  const currencyFlags = {
    INR: "IN", // India
    USD: "US", // United States
    EUR: "EU", // Euro (using EU flag for Eurozone)
    GBP: "GB", // United Kingdom
    CAD: "CA", // Canada
    AED: "AE", // United Arab Emirates
    AUD: "AU", // Australia
    JPY: "JP", // Japan
    CNY: "CN", // China
    CHF: "CH", // Switzerland
    SEK: "SE", // Sweden
    NZD: "NZ", // New Zealand
    SGD: "SG", // Singapore
    HKD: "HK", // Hong Kong
    KRW: "KR", // South Korea
    BRL: "BR", // Brazil
    RUB: "RU", // Russia
    ZAR: "ZA", // South Africa
    MXN: "MX", // Mexico
    TRY: "TR", // Turkey
    SAR: "SA", // Saudi Arabia
    THB: "TH", // Thailand
    MYR: "MY", // Malaysia
    IDR: "ID", // Indonesia
    PHP: "PH", // Philippines
    VND: "VN", // Vietnam
    NOK: "NO", // Norway
    DKK: "DK", // Denmark
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const circles = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      width: Math.random() * 300 + 50,
      height: Math.random() * 300 + 50,
      left: Math.random() * 100,
      top: Math.random() * 100,
      xMovement: Math.random() * 50 - 25,
      yMovement: Math.random() * 50 - 25,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="relative pt-16 overflow-hidden min-h-screen flex">
      {/* Background with gradient and texture */}
      <div className="absolute inset-0 bg-[#D7D3CA] z-0" />
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 z-0" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {circles.map((circle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-white"
            style={{
              width: circle.width,
              height: circle.height,
              left: `${circle.left}%`,
              top: `${circle.top}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [0.8, 1.2, 0.8],
              x: [0, circle.xMovement, 0],
              y: [0, circle.yMovement, 0],
            }}
            transition={{
              duration: circle.duration,
              repeat: Infinity,
              delay: circle.delay,
            }}
          />
        ))}
      </div>

      {/* Currency Dropdown and Display (Top-Right Corner) */}
      <div className="absolute top-8 right-8 z-30 flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div className="group" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="w-10 h-10 rounded-full hover:bg-black hover:text-white bg-transparent dark:bg-indigo-950/80 backdrop-blur-md border-black dark:border-indigo-800 shadow-lg hover:shadow-orange-200/50 dark:hover:shadow-indigo-700/30 hover:border-gray-200 hover:border-4 dark:hover:border-indigo-700 transition-all duration-300"
              >
                <Globe className="h-5 w-5 text-black dark:text-violet-300 group-hover:text-white transition-transform duration-300" />
              </Button>
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 top-full bg-white/80 dark:bg-indigo-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-bold text-black dark:text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Currency
              </span>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white/90 dark:bg-indigo-900/90 backdrop-blur-md border-gray-200 dark:border-indigo-800 max-h-[60vh] overflow-y-auto">
            <DropdownMenuLabel className="text-black dark:text-violet-300">Select Currency</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("INR")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="IN" svg style={{ width: "1.5em", height: "1.5em" }} />
              Indian Rupee (INR)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("USD")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="US" svg style={{ width: "1.5em", height: "1.5em" }} />
              US Dollar (USD)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("EUR")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="EU" svg style={{ width: "1.5em", height: "1.5em" }} />
              Euro (EUR)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("GBP")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="GB" svg style={{ width: "1.5em", height: "1.5em" }} />
              British Pound (GBP)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("CAD")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="CA" svg style={{ width: "1.5em", height: "1.5em" }} />
              Canadian Dollar (CAD)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("AED")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="AE" svg style={{ width: "1.5em", height: "1.5em" }} />
              UAE Dirham (AED)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("AUD")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="AU" svg style={{ width: "1.5em", height: "1.5em" }} />
              Australian Dollar (AUD)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("JPY")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="JP" svg style={{ width: "1.5em", height: "1.5em" }} />
              Japanese Yen (JPY)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("CNY")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="CN" svg style={{ width: "1.5em", height: "1.5em" }} />
              Chinese Yuan (CNY)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("CHF")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="CH" svg style={{ width: "1.5em", height: "1.5em" }} />
              Swiss Franc (CHF)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("SEK")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="SE" svg style={{ width: "1.5em", height: "1.5em" }} />
              Swedish Krona (SEK)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("NZD")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="NZ" svg style={{ width: "1.5em", height: "1.5em" }} />
              New Zealand Dollar (NZD)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("SGD")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="SG" svg style={{ width: "1.5em", height: "1.5em" }} />
              Singapore Dollar (SGD)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("HKD")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="HK" svg style={{ width: "1.5em", height: "1.5em" }} />
              Hong Kong Dollar (HKD)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("KRW")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="KR" svg style={{ width: "1.5em", height: "1.5em" }} />
              South Korean Won (KRW)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("BRL")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="BR" svg style={{ width: "1.5em", height: "1.5em" }} />
              Brazilian Real (BRL)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("RUB")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="RU" svg style={{ width: "1.5em", height: "1.5em" }} />
              Russian Ruble (RUB)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("ZAR")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="ZA" svg style={{ width: "1.5em", height: "1.5em" }} />
              South African Rand (ZAR)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("MXN")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="MX" svg style={{ width: "1.5em", height: "1.5em" }} />
              Mexican Peso (MXN)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("TRY")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="TR" svg style={{ width: "1.5em", height: "1.5em" }} />
              Turkish Lira (TRY)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("SAR")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="SA" svg style={{ width: "1.5em", height: "1.5em" }} />
              Saudi Riyal (SAR)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("THB")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="TH" svg style={{ width: "1.5em", height: "1.5em" }} />
              Thai Baht (THB)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("MYR")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="MY" svg style={{ width: "1.5em", height: "1.5em" }} />
              Malaysian Ringgit (MYR)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("IDR")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="ID" svg style={{ width: "1.5em", height: "1.5em" }} />
              Indonesian Rupiah (IDR)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("PHP")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="PH" svg style={{ width: "1.5em", height: "1.5em" }} />
              Philippine Peso (PHP)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("VND")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="VN" svg style={{ width: "1.5em", height: "1.5em" }} />
              Vietnamese Dong (VND)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("NOK")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="NO" svg style={{ width: "1.5em", height: "1.5em" }} />
              Norwegian Krone (NOK)
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedCurrency("DKK")} 
              className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800 flex items-center gap-2"
            >
              <ReactCountryFlag countryCode="DK" svg style={{ width: "1.5em", height: "1.5em" }} />
              Danish Krone (DKK)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="relative rounded-lg px-3 py-0.5 text-sm font-bold bg-white/80 shadow-lg backdrop-blur-md text-black dark:text-violet-300 flex items-center gap-1">
          <ReactCountryFlag 
            countryCode={currencyFlags[selectedCurrency]} 
            svg 
            style={{ width: "1em", height: "1em" }} 
          />
          {selectedCurrency}
        </span>
      </div>

      {/* Fixed vertical action buttons */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-5">
        <motion.div className="group" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            className="group w-14 h-14 rounded-full hover:bg-black hover:text-white bg-transparent dark:bg-indigo-950/80 backdrop-blur-md border-black dark:border-indigo-800 shadow-lg hover:shadow-orange-200/50 dark:hover:shadow-indigo-700/30 hover:border-gray-200 hover:border-8 dark:hover:border-indigo-700 transition-all duration-300"
            onClick={() => setSearchActive(!searchActive)}
          >
            <Search className="h-6 w-6 text-black dark:text-violet-300 group-hover:text-white transition-transform duration-300" />
          </Button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-indigo-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-bold text-black dark:text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Search
          </span>
        </motion.div>

        <motion.div className="group" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/shop/account")}
            className="group w-14 h-14 rounded-full hover:bg-black hover:text-white bg-transparent dark:bg-indigo-950/80 backdrop-blur-md border-black dark:border-indigo-800 shadow-lg hover:shadow-orange-200/50 dark:hover:shadow-indigo-700/30 hover:border-gray-200 hover:border-8 dark:hover:border-indigo-700 transition-all duration-300"
          >
            <User className="h-6 w-6 text-black dark:text-violet-300 group-hover:text-white transition-transform duration-300" />
          </Button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-indigo-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-bold text-black dark:text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Account
          </span>
        </motion.div>

        <motion.div className="group" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            className="group w-14 h-14 rounded-full hover:bg-black hover:text-white bg-transparent dark:bg-indigo-950/80 backdrop-blur-md border-black dark:border-indigo-800 shadow-lg hover:shadow-orange-200/50 dark:hover:shadow-indigo-700/30 hover:border-gray-200 hover:border-8 dark:hover:border-indigo-700 transition-all duration-300"
          >
            <Heart className="h-6 w-6 text-black dark:text-violet-300 group-hover:text-white transition-transform duration-300" />
          </Button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-indigo-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-bold text-black dark:text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Wishlist
          </span>
        </motion.div>

        <motion.div className="group relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            className="group w-14 h-14 rounded-full hover:bg-black hover:text-white bg-transparent dark:bg-indigo-950/80 backdrop-blur-md border-black dark:border-indigo-800 shadow-lg hover:shadow-orange-200/50 dark:hover:shadow-indigo-700/30 hover:border-gray-200 hover:border-8 dark:hover:border-indigo-700 transition-all duration-300"
            onClick={() => navigate("/shop/cart")}
          >
            <ShoppingCart className="h-6 w-6 text-black dark:text-violet-300 group-hover:text-white transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-indigo-300 text-xs font-bold flex items-center justify-center text-black">
              {cartCount}
            </span>
          </Button>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-indigo-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-bold text-black dark:text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Cart
          </span>
        </motion.div>
      </div>

      {/* Search overlay */}
      <AnimatePresence>
        {searchActive && (
          <motion.div
            className="fixed inset-0 z-40 bg-indigo-950/50 backdrop-blur-sm flex items-start justify-center pt-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchActive(false)}
          >
            <motion.div
              className="w-full max-w-2xl mx-4"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full h-16 px-6 rounded-2xl bg-white/90 dark:bg-indigo-900/90 backdrop-blur-md shadow-xl text-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 border border-violet-200 dark:border-indigo-700"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      navigate(`/shop/search?keyword=${encodeURIComponent(e.target.value)}`);
                      setSearchActive(false);
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white h-10 w-10 rounded-xl"
                  onClick={() => {
                    const input = document.querySelector('input[type="text"]');
                    if (input.value.trim()) {
                      navigate(`/shop/search?keyword=${encodeURIComponent(input.value)}`);
                      setSearchActive(false);
                    }
                  }}
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white h-10 w-10 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600"
                  onClick={() => setSearchActive(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu toggle button */}
      <MenuComponent
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        categories={categories}
        toggleButtonSize="w-14 h-14"
        toggleButtonClassName="rounded-full hover:bg-black hover:text-white bg-transparent dark:bg-indigo-950/80 backdrop-blur-md border-black dark:border-indigo-800 shadow-lg hover:shadow-orange-200/50 dark:hover:shadow-indigo-700/30 hover:border-gray-200 hover:border-4 dark:hover:border-indigo-700 transition-all duration-300"
        customClassName="absolute top-8 left-8 z-30"
      />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 relative z-10 flex flex-col items-center justify-center text-center flex-1">
        <motion.div
          className="max-w-3xl mx-auto space-y-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl">
              <img
                src={logo}
                alt="YourrKart Logo"
                className="w-full h-full object-cover rounded-xl border-b-4 border-gray-500"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-600">YourrKart</h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-xl">
              Discover the perfect blend of style, quality, and innovation
            </p>
          </motion.div>

          {/* <motion.div
            className="flex justify-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <motion.div
              animate={{
                x: [0, -5, 5, -5, 5, 0],
                y: [0, -3, 0, 3, 0],
                scale: [1, 1.02, 1],
                boxShadow: [
                  "0px 0px 5px rgba(231, 200, 145, 0.4)",
                  "0px 0px 15px rgba(231, 200, 145, 0.8)",
                  "0px 0px 5px rgba(231, 200, 145, 0.4)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 0px 30px #e7c891",
              }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button
                size="lg"
                className="relative overflow-hidden bg-transparent border border-gray-800 hover:border-white hover:text-white text-black group px-10 py-8 text-xl font-[1000] rounded-2xl"
                asChild
              >
                <Link to="/shop/listing" className="flex items-center gap-2 z-10 relative">
                  <span>Shop Now</span>
                  <ArrowRight className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <motion.div
                className="absolute inset-0 overflow-hidden rounded-2xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.div
                  className="w-20 h-full bg-white/20 blur-md absolute -skew-x-12"
                  animate={{
                    left: ["-20%", "120%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                    repeatDelay: 0.5,
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div> */}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="scroll-arrows">
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2, ease: "easeInOut" }}
              className="scroll-arrow"
            >
              <ChevronDown className="h-6 w-6 text-black dark:text-violet-400" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2, delay: 0.1, ease: "easeInOut" }}
              className="scroll-arrow -mt-2"
            >
              <ChevronDown className="h-5 w-5 text-black/80 dark:text-violet-400/80" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2, delay: 0.2, ease: "easeInOut" }}
              className="scroll-arrow -mt-2"
            >
              <ChevronDown className="h-5 w-5 text-black/60 dark:text-violet-400/60" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

