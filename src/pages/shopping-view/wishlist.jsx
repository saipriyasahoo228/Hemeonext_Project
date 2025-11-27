// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useToast } from '@/components/ui/use-toast';
// import { Heart, ShoppingCart, Trash2, Loader2, Check } from 'lucide-react';
// import {
//   fetchWishlist,
//   removeFromWishlist,
//   clearWishlist,
//   addToCart,
//   fetchCart,
// } from '@/api/productApi';
// import { useCurrency } from "../../context/currency-context";
// import { useCart } from "@/context/cart-context";

// const Wishlist = () => {
//   const navigate = useNavigate();
//   const { selectedCurrency, convertPrice } = useCurrency();
//   const { toast } = useToast();
//   const { cartItems, setCartItems } = useCart();
//   const [wishlist, setWishlist] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [removing, setRemoving] = useState(null);
//   const [addingToCart, setAddingToCart] = useState(null);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         const [wishlistData, cartData] = await Promise.all([
//           fetchWishlist(),
//           fetchCart()
//         ]);
//         setWishlist(wishlistData[0] || { items: [] });
//         setCartItems(cartData[0]?.items || []);
//       } catch (err) {
//         toast({
//           title: "Error",
//           description: "Failed to load data.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, [setCartItems, toast]);

//   const isItemInCart = (productId) => cartItems.some(item => item.product.id === productId);
//   const getCartItemQuantity = (productId) => {
//     const cartItem = cartItems.find(item => item.product.id === productId);
//     return cartItem ? cartItem.quantity : 0;
//   };

//   const handleRemoveFromWishlist = async (wishlistItemId) => {
//     setRemoving(wishlistItemId);
//     try {
//       await removeFromWishlist(wishlistItemId);
//       const updatedWishlist = await fetchWishlist();
//       setWishlist(updatedWishlist[0] || { items: [] });
//       toast({ title: "Success", description: "Item removed from wishlist", className: "bg-green-100 text-green-800 border-green-200" });
//     } catch (err) {
//       toast({ title: "Error", description: "Failed to remove item from wishlist.", variant: "destructive" });
//     } finally {
//       setRemoving(null);
//     }
//   };

//   const handleAddToCart = async (product, wishlistItemId) => {
//     const productId = product.id;
//     const inCart = isItemInCart(productId);
//     const totalCartItems = cartItems.length;

//     if (totalCartItems >= 10 && !inCart) {
//       toast({ title: "Cart Limit Reached", description: "You can only add up to 10 different items to your cart.", variant: "destructive" });
//       return;
//     }

//     if (inCart) {
//       toast({ title: "Notice", description: `${product.title} is already in your cart (${getCartItemQuantity(productId)} items)`, className: "bg-blue-100 text-blue-800 border-blue-200" });
//       return;
//     }

//     setAddingToCart(wishlistItemId);
//     try {
//       await addToCart(productId, 1, "", "");
//       const updatedCart = await fetchCart();
//       setCartItems(updatedCart[0]?.items || []);
//       const updatedWishlist = await fetchWishlist();
//       setWishlist(updatedWishlist[0] || { items: [] });
//       toast({ title: "Success", description: `${product.title} added to cart`, className: "bg-green-100 text-green-800 border-green-200" });
//     } catch (err) {
//       toast({ title: "Error", description: err.response?.data?.error || "Failed to add item to cart.", variant: "destructive" });
//     } finally {
//       setAddingToCart(null);
//     }
//   };

//   const handleClearWishlist = async () => {
//     if (!window.confirm("Are you sure you want to clear your wishlist?")) return;
//     try {
//       await clearWishlist();
//       setWishlist({ items: [] });
//       toast({ title: "Success", description: "Wishlist Cleared", className: "bg-green-100 text-green-800 border-green-200" });
//     } catch (err) {
//       toast({ title: "Error", description: "Failed to clear wishlist.", variant: "destructive" });
//     }
//   };

//   if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-gray-600" /></div>;

//   if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
//         <Heart className="h-20 w-20 text-pink-300 mb-6" />
//         <h2 className="text-3xl font-extrabold text-gradient-to-r from-yellow-400 via-green-400 to-pink-300 mb-3">Your Wishlist is Empty</h2>
//         <p className="text-gray-600 mb-8 max-w-md">Add items to your wishlist to save your favorites for later!</p>
//         <Link to="/shop/listing">
//           <button className="px-8 py-3 bg-gradient-to-r from-yellow-300 via-green-300 to-pink-200 text-black font-semibold rounded-full hover:opacity-90 transition-all duration-300 shadow-lg">
//             Explore Products
//           </button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 pt-24 pb-14">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">My Wishlist</h1>
//         <button
//           onClick={handleClearWishlist}
//           className="px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 flex items-center gap-2 shadow-md"
//         >
//           <Trash2 className="h-5 w-5" /> Clear All
//         </button>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//         {wishlist.items.map((item) => {
//           const inCart = isItemInCart(item.product.id);
//           const priceINR = item.product.sale_price || item.product.actual_price;
//           const convertedPrice = convertPrice(priceINR);
//           const quantityInCart = getCartItemQuantity(item.product.id);
//           const isOutOfStock = item.product.stock === 0;

//           return (
//             <div key={item.id} className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300">
//               <Link to={`/shop/product/${item.product.id}`}>
//                 <div className="relative overflow-hidden">
//                   <img
//                     src={item.product.images?.[0]?.image || "https://via.placeholder.com/300"}
//                     alt={item.product.title}
//                     className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-300"
//                   />
//                 </div>
//               </Link>
//               <div className="p-5 flex flex-col gap-3">
//                 <Link to={`/shop/product/${item.product.id}`}>
//                   <h3 className="text-lg font-semibold text-gray-800 hover:text-yellow-400 transition-colors line-clamp-1">
//                     {item.product.title}
//                   </h3>
//                 </Link>
//                 <p className="text-xl font-bold text-gradient-to-r from-yellow-400 via-green-400 to-pink-300">{convertedPrice}</p>

//                 {inCart && (
//                   <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
//                     <Check className="h-4 w-4" />
//                     In cart ({quantityInCart})
//                   </p>
//                 )}

//                 <div className="flex flex-col gap-2 mt-4">
//                   <button
//                     onClick={() => inCart ? navigate('/shop/cart') : handleAddToCart(item.product, item.id)}
//                     disabled={addingToCart === item.id || isOutOfStock}
//                     className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-white font-medium shadow-md transition-all duration-300 ${
//                       inCart
//                         ? "bg-green-500 hover:bg-green-600"
//                         : addingToCart === item.id || isOutOfStock
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-gradient-to-r from-yellow-300 via-green-300 to-pink-200 hover:opacity-90"
//                     }`}
//                   >
//                     {addingToCart === item.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingCart className="h-5 w-5" />}
//                     {inCart ? "Go to Cart" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
//                   </button>
//                   <button
//                     onClick={() => handleRemoveFromWishlist(item.id)}
//                     disabled={removing === item.id}
//                     className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-50 transition-all duration-300 ${
//                       removing === item.id ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     {removing === item.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Wishlist;











import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Heart, ShoppingCart, Trash2, Loader2, Check, ArrowRight } from 'lucide-react';
import {
  fetchWishlist,
  removeFromWishlist,
  clearWishlist,
  addToCart,
  fetchCart,
} from '@/api/productApi';
import { useCurrency } from "../../context/currency-context";
import { useCart } from "@/context/cart-context";

const Wishlist = () => {
  const navigate = useNavigate();
  const { selectedCurrency, convertPrice } = useCurrency();
  const { toast } = useToast();
  const { cartItems, setCartItems } = useCart();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [wishlistData, cartData] = await Promise.all([
          fetchWishlist(),
          fetchCart()
        ]);
        setWishlist(wishlistData[0] || { items: [] });
        setCartItems(cartData[0]?.items || []);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [setCartItems, toast]);

  const isItemInCart = (productId) => cartItems.some(item => item.product.id === productId);
  const getCartItemQuantity = (productId) => {
    const cartItem = cartItems.find(item => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleRemoveFromWishlist = async (wishlistItemId) => {
    setRemoving(wishlistItemId);
    try {
      await removeFromWishlist(wishlistItemId);
      const updatedWishlist = await fetchWishlist();
      setWishlist(updatedWishlist[0] || { items: [] });
      toast({ 
        title: "Success", 
        description: "Item removed from wishlist", 
        className: "bg-green-100 text-green-800 border-green-200" 
      });
    } catch (err) {
      toast({ 
        title: "Error", 
        description: "Failed to remove item from wishlist.", 
        variant: "destructive" 
      });
    } finally {
      setRemoving(null);
    }
  };

  const handleAddToCart = async (product, wishlistItemId) => {
    const productId = product.id;
    const inCart = isItemInCart(productId);
    const totalCartItems = cartItems.length;

    if (totalCartItems >= 10 && !inCart) {
      toast({ 
        title: "Cart Limit Reached", 
        description: "You can only add up to 10 different items to your cart.", 
        variant: "destructive" 
      });
      return;
    }

    if (inCart) {
      toast({ 
        title: "Notice", 
        description: `${product.title} is already in your cart (${getCartItemQuantity(productId)} items)`, 
        className: "bg-blue-100 text-blue-800 border-blue-200" 
      });
      return;
    }

    setAddingToCart(wishlistItemId);
    try {
      await addToCart(productId, 1, "", "");
      const updatedCart = await fetchCart();
      setCartItems(updatedCart[0]?.items || []);
      const updatedWishlist = await fetchWishlist();
      setWishlist(updatedWishlist[0] || { items: [] });
      toast({ 
        title: "Success", 
        description: `${product.title} added to cart`, 
        className: "bg-green-100 text-green-800 border-green-200" 
      });
    } catch (err) {
      toast({ 
        title: "Error", 
        description: err.response?.data?.error || "Failed to add item to cart.", 
        variant: "destructive" 
      });
    } finally {
      setAddingToCart(null);
    }
  };

  const handleClearWishlist = async () => {
    if (!window.confirm("Are you sure you want to clear your wishlist?")) return;
    try {
      await clearWishlist();
      setWishlist({ items: [] });
      toast({ 
        title: "Success", 
        description: "Wishlist Cleared", 
        className: "bg-green-100 text-green-800 border-green-200" 
      });
    } catch (err) {
      toast({ 
        title: "Error", 
        description: "Failed to clear wishlist.", 
        variant: "destructive" 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-green-600" />
          <p className="text-green-700 font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-200 max-w-md">
          <Heart className="h-20 w-20 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-green-800 mb-4">Your Wishlist is Empty</h2>
          <p className="text-green-600 mb-8">Add items to your wishlist to save your favorites for later!</p>
          <Link to="/shop/listing">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto">
              Explore Products
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto px-4 pt-24 pb-14">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">My Wishlist</h1>
            <p className="text-green-600">{wishlist.items.length} {wishlist.items.length === 1 ? 'item' : 'items'} saved</p>
          </div>
          <button
            onClick={handleClearWishlist}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl font-semibold"
          >
            <Trash2 className="h-5 w-5" /> Clear All
          </button>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.items.map((item) => {
            const inCart = isItemInCart(item.product.id);
            const priceINR = item.product.sale_price || item.product.actual_price;
            const convertedPrice = convertPrice(priceINR);
            const quantityInCart = getCartItemQuantity(item.product.id);
            const isOutOfStock = item.product.stock === 0;

            return (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-200 hover:shadow-xl transition-all duration-300">
                {/* Product Image */}
                <Link to={`/shop/product/${item.product.id}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={item.product.images?.[0]?.image || "https://via.placeholder.com/300"}
                      alt={item.product.title}
                      className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                    {/* Stock Badge */}
                    {isOutOfStock && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        Out of Stock
                      </div>
                    )}
                    {item.product.discount_percentage > 0 && (
                      <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {item.product.discount_percentage}% OFF
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-5 flex flex-col gap-3">
                  <Link to={`/shop/product/${item.product.id}`}>
                    <h3 className="text-lg font-semibold text-green-800 hover:text-green-600 transition-colors line-clamp-2 h-14">
                      {item.product.title}
                    </h3>
                  </Link>
                  
                  {/* Price */}
                  <p className="text-xl font-bold text-green-700">{convertedPrice}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-sm ${
                            star <= Math.floor(item.product.average_rating || 0)
                              ? "text-orange-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-green-600">
                      ({item.product.review_count || 0})
                    </span>
                  </div>

                  {/* Cart Status */}
                  {inCart && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      In cart ({quantityInCart})
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 mt-3">
                    <button
                      onClick={() => inCart ? navigate('/shop/cart') : handleAddToCart(item.product, item.id)}
                      disabled={addingToCart === item.id || isOutOfStock}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold shadow-md transition-all duration-300 ${
                        inCart
                          ? "bg-green-600 hover:bg-green-700"
                          : addingToCart === item.id || isOutOfStock
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {addingToCart === item.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <ShoppingCart className="h-5 w-5" />
                      )}
                      {inCart ? "Go to Cart" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </button>
                    
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      disabled={removing === item.id}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-orange-500 text-orange-500 hover:bg-orange-50 transition-all duration-300 font-semibold ${
                        removing === item.id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {removing === item.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Shopping Button */}
        <div className="text-center mt-12">
          <Link to="/shop/listing">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto">
              Continue Shopping
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;