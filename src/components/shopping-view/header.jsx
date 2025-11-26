import { motion, AnimatePresence } from "framer-motion";
import { Box, ShoppingCart, User, UserCog, LogOut, Home, X, Heart, ShieldEllipsis } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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

import { fetchCategories } from "../../api/productApi";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";

function ShoppingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
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
      setSearchQuery("");
    }
  };

  if (shouldHideNavbar) return null;

  console.log("ShoppingHeader Render:", { isAuthenticated, user });

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-500 px-4 py-3`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between w-full">
          {/* Left side - Brand name and icons pushed to absolute left */}
          <div className="flex items-center gap-4 flex-1">
            {/* Brand Name */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h1 
                className="text-2xl font-bold italic text-white cursor-pointer -mt-1"
                onClick={() => navigate("/shop/home")}
              >
                Hemeonext
              </h1>
            </motion.div>

            {/* Left side icons */}
            <div className="flex items-center gap-2">
              <motion.div className="group" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  className="
                    w-10 h-10 rounded-full 
                    bg-white/20 backdrop-blur-3xl
                    border border-white/30
                    flex items-center justify-center
                    hover:bg-white/30 transition-all duration-300
                  "
                  onClick={() => navigate("/shop/home")}
                >
                  <Home className="h-5 w-5 text-white group-hover:text-white" />
                </Button>
                <span className="hidden md:block absolute bg-white/80 left-1/2 -translate-x-1/2 mt-2 top-full backdrop-blur-3xl px-3 py-1 rounded-lg text-sm font-bold text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  Home
                </span>
              </motion.div>

              <motion.div className="group" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  className="
                    w-10 h-10 rounded-full 
                    bg-white/20 backdrop-blur-3xl
                    border border-white/30
                    flex items-center justify-center
                    hover:bg-white/30 transition-all duration-300
                  "
                  onClick={() => handleProtectedClick("/shop/wishlist")}
                >
                  <Heart className="h-5 w-5 text-white group-hover:text-white" />
                </Button>
                <span className="hidden md:block absolute left-1/2 -translate-x-1/2 mt-2 top-full bg-white/80 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-bold text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  Wishlist
                </span>
              </motion.div>
            </div>
          </div>

          {/* Center Search Box */}
          <div className="flex-1 w-full max-w-none mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products, brands, and more..."
                className="w-full h-12 px-6 rounded-full bg-white/95 backdrop-blur-md shadow-2xl text-lg focus:outline-none focus:ring-4 focus:ring-white/50 border border-white/50 placeholder-gray-600"
                autoFocus={searchActive}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    handleSearch();
                  }
                }}
                onFocus={() => setSearchActive(true)}
              />
              <Button
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white h-8 w-8 rounded-full hover:from-orange-600 hover:to-pink-600"
                onClick={handleSearch}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Right side icons - pushed to absolute right */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            {!user?.is_admin ? (
              <>
                {/* Account Section */}
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.div className="group" whileTap={{ scale: 0.95 }}>
                        <div className="flex items-center hover:cursor-pointer gap-2 md:px-3 md:py-2 bg-white/20 backdrop-blur-3xl rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300">
                          <Avatar className="h-8 w-8 border border-white/50">
                            <AvatarFallback className="text-gray-800 bg-white/80">
                              {user?.name?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="hidden md:flex flex-col">
                            <span className="text-sm font-bold text-white">
                              Hi, {user?.name || "User"}
                            </span>
                            <span className="text-xs text-white/80">Account & Settings</span>
                          </div>
                        </div>
                      </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-white/95 backdrop-blur-md border border-white/50"
                    >
                      <DropdownMenuLabel className="text-gray-800">
                        Hi, {user?.name || "User"}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => navigate("/shop/account")}
                        className="text-gray-800 hover:bg-orange-50"
                      >
                        <UserCog className="mr-2 h-4 w-4" /> Account
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/shop/account?tab=orders")}
                        className="text-gray-800 hover:bg-orange-50"
                      >
                        <Box className="mr-2 h-4 w-4" /> Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-gray-800 hover:bg-orange-50"
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
                          className="rounded-full hidden md:flex md:px-4 md:py-2 bg-white/20 backdrop-blur-3xl border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-300"
                        >
                          <User className="h-5 w-5 md:mr-2 text-white group-hover:text-white" />
                          <span className="text-sm hidden md:block text-white font-semibold group-hover:text-white">Login</span>
                        </Button>

                        {/* Mobile */}
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-10 h-10 flex md:hidden rounded-full bg-white/20 backdrop-blur-3xl border border-white/30 hover:bg-white/30 transition-all duration-300"
                        >
                          <User className="h-5 w-5 text-white group-hover:text-white" />
                        </Button>
                      </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-white/95 backdrop-blur-md border border-white/50"
                    >
                      <DropdownMenuItem
                        onClick={() => navigate("/auth/login")}
                        className="text-gray-800 hover:bg-orange-50"
                      >
                        <User className="mr-2 h-4 w-4" /> Login
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/auth/register")}
                        className="text-gray-800 hover:bg-orange-50"
                      >
                        <UserCog className="mr-2 h-4 w-4" /> Register
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Cart Button */}
                <motion.div className="group relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="
                      w-10 h-10 rounded-full
                      bg-white/20 backdrop-blur-3xl
                      border border-white/30
                      flex items-center justify-center
                      hover:bg-white/30 transition-all duration-300
                    "
                    onClick={() => handleProtectedClick("/shop/cart")}
                  >
                    <ShoppingCart className="h-5 w-5 text-white group-hover:text-white" />
                  </Button>

                  {/* Cart count badge */}
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-xs font-bold flex items-center justify-center text-orange-500 z-10 shadow-lg border border-white">
                      {totalCartCount}
                    </span>
                  )}

                  <span className="hidden md:block absolute left-1/2 -translate-x-1/2 mt-2 top-full bg-white/80 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-bold text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    Cart
                  </span>
                </motion.div>
              </>
            ) : (
              <Button 
                onClick={() => navigate("/admin/dashboard")}
                className="bg-white/20 backdrop-blur-3xl border border-white/30 text-white font-bold hover:bg-white/30 transition-all duration-300 px-4 py-2"
              >
                <ShieldEllipsis className="h-5 w-5 mr-2" />
                <span>Admin Dashboard</span>
              </Button>
            )}
          </div>
        </div>
      </motion.header>

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
              className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 border border-white/50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Please Log In or Register
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                You need to be logged in to access this feature.
              </p>
              <div className="flex gap-3">
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAuthPopup(false);
                    navigate("/auth/login");
                  }}
                >
                  Login
                </Button>
                <Button
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg"
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