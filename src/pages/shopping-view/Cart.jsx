import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ShoppingCart, Trash2, Loader2, Plus, Minus } from 'lucide-react';
import { addToCart, removeFromCart, clearCart, updateCartItemQuantity } from '@/api/productApi';
import { useCurrency } from "../../context/currency-context";
import { useCart } from "../../context/cart-context";

const CartPage = () => {
  const navigate = useNavigate();
  const { convertPrice } = useCurrency();
  const { cartItems, refreshCart, loading: cartLoading } = useCart();
  const [updating, setUpdating] = useState({});

  const handleIncreaseQuantity = async (cartItemId) => {
    setUpdating(prev => ({ ...prev, [cartItemId]: true }));
    try {
      const item = cartItems.find(i => i.id === cartItemId);
      if (item.quantity >= item.product.stock) {
        toast({
          title: "Stock Limit",
          description: `Maximum ${item.product.stock} items available.`,
          variant: "destructive",
        });
        return;
      }
      await updateCartItemQuantity(cartItemId, item.quantity + 1);
      await refreshCart();
      toast({ title: "Success", description: `${item.product.title} quantity increased`, className: "bg-green-100 text-green-800 border-green-200" });
    } catch (err) {
      toast({ title: "Error", description: err.response?.data?.error || "Failed to update quantity.", variant: "destructive" });
    } finally {
      setUpdating(prev => ({ ...prev, [cartItemId]: false }));
    }
  };

  const handleDecreaseQuantity = async (cartItemId) => {
    setUpdating(prev => ({ ...prev, [cartItemId]: true }));
    try {
      const item = cartItems.find(i => i.id === cartItemId);
      if (item.quantity <= 1) {
        await handleRemoveFromCart(cartItemId);
        return;
      }
      await updateCartItemQuantity(cartItemId, item.quantity - 1);
      await refreshCart();
      toast({ title: "Success", description: `${item.product.title} quantity decreased`, className: "bg-green-100 text-green-800 border-green-200" });
    } catch (err) {
      toast({ title: "Error", description: err.response?.data?.error || "Failed to update quantity.", variant: "destructive" });
    } finally {
      setUpdating(prev => ({ ...prev, [cartItemId]: false }));
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    setUpdating(prev => ({ ...prev, [cartItemId]: true }));
    try {
      await removeFromCart(cartItemId);
      await refreshCart();
      toast({ title: "Success", description: "Item removed from cart", className: "bg-green-100 text-green-800 border-green-200" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to remove item from cart.", variant: "destructive" });
    } finally {
      setUpdating(prev => ({ ...prev, [cartItemId]: false }));
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;
    try {
      await clearCart();
      await refreshCart();
      toast({ title: "Success", description: "Cart cleared", className: "bg-green-100 text-green-800 border-green-200" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to clear cart.", variant: "destructive" });
    }
  };

  const calculateTotal = () => cartItems.reduce((total, item) => total + (parseFloat(item.product.sale_price || item.product.actual_price) * item.quantity), 0);
  const hasOverQuantityItems = () => cartItems.some(item => item.quantity > item.product.stock);
  const hasOutOfStockItems = () => cartItems.some(item => item.product.stock === 0);

  if (cartLoading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-gray-600" /></div>;
  if (!cartItems.length) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <ShoppingCart className="h-20 w-20 text-gray-300 mb-6" />
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
      <p className="text-gray-600 mb-8 max-w-md">Add some items to your cart to get started! Browse our collection and find your favorites.</p>
      <Link to="/shop/listing">
        <button className="px-8 py-3 bg-gradient-to-r from-yellow-300 via-green-300 to-pink-200 text-black font-medium rounded-full hover:opacity-90 transition-all duration-300 shadow-md">
          Explore Products
        </button>
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 pt-24 pb-14">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
          <ShoppingCart className="h-8 w-8" /> My Cart
        </h1>
        <button
          onClick={handleClearCart}
          className="px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 flex items-center gap-2 shadow-md"
        >
          <Trash2 className="h-5 w-5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {cartItems.map(item => {
          const priceINR = parseFloat(item.product.sale_price || item.product.actual_price);
          const convertedPrice = convertPrice(priceINR);
          const isUpdating = updating[item.id];

          return (
            <div key={item.id} className="bg-gradient-to-r from-green-50/80 to-yellow-50/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transition-all duration-300 border border-green-100 p-5 hover:shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="md:col-span-2 flex items-center gap-4">
                  <Link to={`/shop/product/${item.product.id}`}>
                    <img
                      src={item.product.images?.[0]?.image || "https://via.placeholder.com/300"}
                      alt={item.product.title}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shadow-md"
                    />
                  </Link>
                  <div>
                    <Link to={`/shop/product/${item.product.id}`}>
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-yellow-400 transition-colors">{item.product.title}</h3>
                    </Link>
                    <p className="text-gray-700">Category: {item.product.category?.name || 'N/A'}</p>
                    <p className="text-gray-700">Subcategory: {item.product.subcategory?.name || 'N/A'}</p>
                    {item.color && <p className="text-gray-700">Color: {item.color}</p>}
                    {item.size && <p className="text-gray-700">Size: {item.size}</p>}
                    {item.product.stock < 1 && <p className="text-red-600 font-semibold">Out of Stock</p>}
                  </div>
                </div>

                {item.quantity > item.product.stock && (
                  <div className="text-red-600 text-sm font-semibold mt-2">
                    Quantity exceeds stock ({item.product.stock})
                  </div>
                )}

                <p className="text-gray-700 font-medium text-center text-lg">{convertedPrice}</p>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleDecreaseQuantity(item.id)}
                    disabled={isUpdating || item.quantity <= 1 || hasOutOfStockItems() || hasOverQuantityItems()}
                    className="p-2 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-gray-800 font-semibold">{isUpdating ? <Loader2 className="h-4 w-4 animate-spin inline" /> : item.quantity}</span>
                  <button
                    onClick={() => handleIncreaseQuantity(item.id)}
                    disabled={isUpdating || item.quantity >= item.product.stock}
                    className="p-2 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-gray-800 font-semibold text-center">{convertPrice(priceINR * item.quantity)}</p>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  disabled={isUpdating}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-50 transition-all duration-300 ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isUpdating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-r from-green-50/50 to-yellow-50/50 backdrop-blur-md rounded-xl shadow-md p-6 sticky top-24 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
          <span className="font-semibold">{convertPrice(calculateTotal())}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between mb-4">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-lg font-semibold">{convertPrice(calculateTotal())}</span>
        </div>
        {hasOutOfStockItems() && <p className="text-red-600 text-sm mb-4">Please remove out-of-stock items before proceeding to checkout.</p>}
        <button
          onClick={() => navigate('/shop/checkout')}
          disabled={hasOutOfStockItems() || hasOverQuantityItems()}
          className={`w-full px-8 py-3 text-black font-medium rounded-full transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${hasOutOfStockItems() || hasOverQuantityItems() ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-yellow-300 via-green-300 to-pink-200 hover:opacity-90"}`}
        >
          <ShoppingCart className="h-5 w-5" />
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
