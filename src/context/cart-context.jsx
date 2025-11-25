import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { fetchCart } from '../api/productApi';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { isAuthenticated } = useAuth();

  // Fetch cart items when the provider mounts or auth state changes
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          const cartData = await fetchCart();
          const items = cartData[0]?.items || [];
          setCartItems(items); // Set cartItems as an array of items
          console.log("CartProvider Initial Load - Cart Items:", items);
        } catch (error) {
          console.error("Failed to fetch cart in CartProvider:", error);
          setCartItems([]); // Reset on error
        }
      } else {
        setCartItems([]); // Clear cart when not authenticated
      }
    };

    loadCart();
  }, [isAuthenticated]); // Re-run when auth state changes

  // Function to manually refresh cart (used after updates like addToCart)
  const refreshCart = async () => {
    try {
      const cartData = await fetchCart();
      const items = cartData[0]?.items || [];
      setCartItems(items);
      console.log("CartProvider Refresh - Updated Cart Items:", items);
    } catch (error) {
      console.error("Failed to refresh cart:", error);
      setCartItems([]);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);