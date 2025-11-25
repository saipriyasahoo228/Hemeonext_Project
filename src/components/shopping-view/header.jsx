import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, Box, Search, ShoppingCart, User, UserCog, LogOut, Home, X, Heart, ShieldEllipsis } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useEffect, useState } from "react";

import MenuComponent from "../shopping-view/menu-component";
import { useCurrency } from "@/context/currency-context";
import ReactCountryFlag from "react-country-flag";
import { fetchCategories } from "../../api/productApi";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";

function ShoppingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 

  const navigate = useNavigate();
  const location = useLocation();
 
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();
  const [searchParams] = useSearchParams();

  const hideOnRoutes = [];
  const shouldHideNavbar = hideOnRoutes.includes(location.pathname);

  const totalCartCount = cartItems.length || 0;

 
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await fetchCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (searchActive) {
      const keyword = searchParams.get("keyword") || "";
      setSearchQuery(keyword);
    }
  }, [searchActive, searchParams]);

  const handleProtectedClick = (path) => {
    console.log("Handle Protected Click:", { isAuthenticated, path });
    if (!isAuthenticated) {
      setShowAuthPopup(true);
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    logout();
    window.location.reload();
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/shop/search?keyword=${encodeURIComponent(searchQuery)}`);
      setSearchActive(false);
      setSearchQuery("");
    }
  };

  if (shouldHideNavbar) return null;

  console.log("ShoppingHeader Render:", { isAuthenticated, user });

  return (
    <>
      <motion.header
        className={`overflow-y-auto md:overflow-visible fixed top-0 md:top-2 left-0 right-0 z-50 w-auto bg-black  md:rounded-none rounded-b-3xl md:bg-transparent transition-all duration-500 px-4 py-4 md:px-0 md:py-0`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex flex-row md:flex-row items-center justify-between md:px-14 md:py-2">
          {/* Mobile: Single row with icons centered, Desktop: Left section */}
          <div className="flex items-center gap-4 md:p-2 rounded-md justify-center md:justify-start">
            <MenuComponent
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              categories={categories}
              toggleButtonSize="w-8 h-8"
              toggleButtonClassName="rounded-full hover:bg-black hover:text-white bg-transparent dark:bg-indigo-950/80 backdrop-blur-3xl md:border-black border-white dark:border-indigo-800 hover:shadow-orange-200/50 dark:hover:shadow-indigo-700/30 hover:border-gray-200 hover:border-4 dark:hover:border-indigo-700 transition-all duration-300"
            />
            <motion.div className="group" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="
    w-11 h-11 rounded-full 
    relative overflow-hidden 
    bg-transparent backdrop-blur-3xl
    before:absolute before:-inset-0.5 before:rounded-full 
    before:bg-gradient-to-r before:from-pink-500 before:via-purple-500 before:to-cyan-400 
    before:bg-[length:400%_400%] before:animate-shimmer
    before:z-[-1] 
    border border-transparent
    flex items-center justify-center
  "

                onClick={() => navigate("/shop/home")}
              >
                <Home className="h-5 w-5 md:text-black text-white dark:text-violet-300 group-hover:text-white transition-transform duration-300" />
              </Button>
              <span className="hidden md:block absolute bg-white/80 left-1/2 -translate-x-1/2 mt-2 top-full dark:bg-indigo-950/80 backdrop-blur-3xl px-3 py-1 rounded-lg text-sm font-bold text-black dark:text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Home
              </span>
            </motion.div>
            <motion.div className="group" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
               className="
    w-11 h-11 rounded-full 
    relative overflow-hidden 
    bg-transparent backdrop-blur-3xl
    before:absolute before:-inset-0.5 before:rounded-full 
    before:bg-gradient-to-r before:from-pink-500 before:via-purple-500 before:to-cyan-400 
    before:bg-[length:400%_400%] before:animate-shimmer
    before:z-[-1] 
    border border-transparent
    flex items-center justify-center
  "

                onClick={() => setSearchActive(true)}
              >
                <Search className="h-5 w-5 md:text-black text-white dark:text-violet-300 group-hover:text-white transition-transform duration-300" />
              </Button>
              <span className="hidden md:block absolute left-1/2 -translate-x-1/2 mt-2 top-full bg-white/80 dark:bg-indigo-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-bold text-black dark:text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Search
              </span>
            </motion.div>
          </div>

          {/* Mobile: Icons in same row, Desktop: Right section */}
          {!user?.is_admin ? (
            <div className="flex items-center gap-4 justify-center md:justify-end">
              

              {/* Account Section */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div className="group" whileTap={{ scale: 0.95 }}>
                      <div className="flex items-center hover:cursor-pointer gap-2 md:px-2 md:py-2 bg-transparent dark:bg-indigo-950/80 backdrop-blur-3xl rounded-full md:border-black border-white dark:hover:bg-indigo-800 transition-all duration-300">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-black dark:text-violet-300 group-hover:text-white">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden md:flex flex-col">
                          <span className="text-sm font-bold text-black dark:text-violet-300">
                            Hi, {user?.name || "User"}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-violet-400">Accounts, Logout</span>
                        </div>
                      </div>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 dark:bg-indigo-900/90 dark:border-indigo-800"
                  >
                    <DropdownMenuLabel className="text-black dark:text-violet-300">
                      Hi, {user?.name || "User"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate("/shop/account")}
                      className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800"
                    >
                      <UserCog className="mr-2 h-4 w-4" /> Account
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/shop/account?tab=orders")}
                      className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800"
                    >
                      <Box className="mr-2 h-4 w-4" /> Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    
                  <motion.div className="group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="rounded-full  hidden md:flex md:px-4 md:py-2 bg-transparent dark:bg-indigo-950/80 backdrop-blur-3xl md:border-black border-white dark:border-indigo-800 shadow-lg hover:shadow-orange-200/50 dark:hover:shadow-indigo-700/30 hover:bg-black hover:text-white transition-all duration-300"
                    >
                      <User className="h-5 w-5 md:mr-2 md:text-black text-white dark:text-violet-300 group-hover:text-white" />
                      <span className="text-sm hidden md:block text-gray-800 font-semibold dark:text-violet-400 group-hover:text-white">Login | Register</span>
                    </Button>

                    {/* For Mobile Devices */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 flex md:hidden rounded-full hover:bg-black hover:text-white bg-transparent dark:bg-indigo-950/80 backdrop-blur-3xl md:border-black border-white dark:border-indigo-800 hover:shadow-orange-200/50 dark:hover:shadow-indigo-700/30 hover:border-gray-200 hover:border-4 dark:hover:border-indigo-700 transition-all duration-300"
                    >
                    <User className="h-5 w-5 md:text-black text-white dark:text-violet-300 group-hover:text-white" />
                    </Button>
                  </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 dark:bg-indigo-900/90 backdrop-blur-md dark:border-indigo-800"
                  >
                    <DropdownMenuItem
                      onClick={() => navigate("/auth/login")}
                      className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800"
                    >
                      <User className="mr-2 h-4 w-4" /> Login
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/auth/register")}
                      className="text-black dark:text-violet-300 hover:bg-gray-100 dark:hover:bg-indigo-800"
                    >
                      <UserCog className="mr-2 h-4 w-4" /> Register
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Wishlist and Cart Buttons */}
              <div className="flex gap-4 md:p-2 rounded-md">
                <motion.div className="group" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="icon"
                     className="
    w-11 h-11 rounded-full 
    relative overflow-hidden 
    bg-transparent backdrop-blur-3xl
    before:absolute before:-inset-0.5 before:rounded-full 
    before:bg-gradient-to-r before:from-pink-500 before:via-purple-500 before:to-cyan-400 
    before:bg-[length:400%_400%] before:animate-shimmer
    before:z-[-1] 
    border border-transparent
    flex items-center justify-center
  "

                    onClick={() => handleProtectedClick("/shop/wishlist")}
                  >
                    <Heart className="h-5 w-5 md:text-black text-white dark:text-violet-300 group-hover:text-white transition-transform duration-300" />
                  </Button>
                  <span className="hidden md:block absolute left-1/2 -translate-x-1/2 mt-2 top-full bg-white/80 dark:bg-indigo-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-bold text-black dark:text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    Wishlist
                  </span>
                </motion.div>

                <motion.div className="group relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
  <Button
    variant="outline"
    size="icon"
    className="
      w-10 h-10 rounded-full
      relative overflow-visible
      bg-transparent backdrop-blur-3xl
      border border-transparent
      flex items-center justify-center
      before:absolute before:-inset-1 before:rounded-full
      before:bg-gradient-to-r before:from-pink-500 before:via-purple-500 before:to-cyan-400
      before:bg-[length:400%_400%] before:animate-shimmer
      before:z-[-1]
      hover:shadow-orange-200/50 dark:hover:shadow-indigo-700/30
      transition-all duration-300
    "
    onClick={() => handleProtectedClick("/shop/cart")}
  >
    <ShoppingCart className="h-6 w-6 text-white dark:text-violet-300 group-hover:text-white transition-transform duration-300" />
  </Button>

  {/* Cart count badge */}
  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white dark:bg-indigo-300 text-xs font-bold flex items-center justify-center text-black z-10 shadow-md">
    {totalCartCount}
  </span>

  {/* Tooltip */}
  <span className="hidden md:block absolute left-1/2 -translate-x-1/2 mt-2 top-full bg-white/80 dark:bg-indigo-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-bold text-black dark:text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
    Cart
  </span>
</motion.div>

              </div>
            </div>
          ) : (
            <Button 
              onClick={() => navigate("/admin/dashboard")}
              className="bg-transparent backdrop-blur-3xl border border-white md:border-black text-white md:text-black font-bold hover:bg-black hover:text-white hover:border-gray-200 hover:border-2 transition-all duration-300"
            >
              <ShieldEllipsis className="h-5 w-5 mr-2" />
              <span>Admin Dashboard</span>
            </Button>
          )}
        </div>
      </motion.header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchActive && (
          <motion.div
            className="fixed inset-0 z-40 bg-indigo-950/50 backdrop-blur-sm flex items-start justify-center pt-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSearchActive(false);
              setSearchQuery("");
            }}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      handleSearch();
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white h-10 w-10 rounded-xl"
                  onClick={handleSearch}
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white h-10 w-10 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600"
                  onClick={() => {
                    setSearchActive(false);
                    setSearchQuery("");
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Authentication Popup */}
      <AnimatePresence>
        {showAuthPopup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthPopup(false)}
          >
            <motion.div
              className="bg-white dark:bg-indigo-900 rounded-lg p-6 shadow-lg max-w-sm w-full mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-black dark:text-violet-300 mb-4">
                Please Log In or Register
              </h3>
              <p className="text-sm text-gray-600 dark:text-violet-400 mb-6">
                You need to be logged in to access this feature.
              </p>
              <div className="flex gap-4">
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAuthPopup(false);
                    navigate("/auth/login");
                  }}
                >
                  Login
                </Button>
                <Button
                  className="w-full bg-gray-200 hover:bg-gray-300 text-black dark:bg-indigo-800 dark:hover:bg-indigo-700 dark:text-violet-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAuthPopup(false);
                    navigate("/auth/register");
                  }}
                >
                  Register
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ShoppingHeader;