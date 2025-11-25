// import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { fetchSearchResults, fetchProductById, addToCart, fetchCart } from "@/api/productApi";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const { cartItems, setCartItems } = useCart();

  // Initialize keyword from URL
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword") || "";
    setKeyword(urlKeyword);
    if (urlKeyword.trim()) {
      fetchResults(urlKeyword);
    } else {
      setSearchResults([]);
      setError(null);
    }
  }, [searchParams]);

  // Debounced search function
  const fetchResults = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await fetchSearchResults(query);
      setSearchResults(results);
      if (results.length === 0) {
        setError("No products found for your search.");
      }
    } catch (err) {
      setError("An error occurred while searching. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input changes with debouncing
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (keyword.trim()) {
        setSearchParams({ keyword });
        fetchResults(keyword);
      } else {
        setSearchParams({});
        setSearchResults([]);
        setError(null);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [keyword, setSearchParams, fetchResults]);

  // Handle adding to cart
  const handleAddtoCart = async (productId, totalStock) => {
    if (!user) {
      toast({
        title: "Please log in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    const getCartItems = cartItems?.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === productId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > totalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    try {
      await addToCart(productId, 1, null, null);
      const updatedCart = await fetchCart();
      setCartItems(updatedCart);
      toast({
        title: "Product added to cart",
      });
    } catch (err) {
      toast({
        title: "Failed to add product to cart",
        variant: "destructive",
      });
      console.error("Add to cart error:", err);
    }
  };

  // Handle fetching product details
  const handleGetProductDetails = async (productId) => {
    try {
      const details = await fetchProductById(productId);
      setProductDetails(details);
      setOpenDetailsDialog(true);
    } catch (err) {
      toast({
        title: "Failed to fetch product details",
        variant: "destructive",
      });
      console.error("Fetch product details error:", err);
    }
  };

  return (
    <div className="container mx-auto md:px-6 px-4 py-20">
      <div className="flex justify-center mb-10">
        <div className="w-full max-w-2xl flex items-center">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="py-6 text-lg"
            placeholder="Search Products..."
            autoFocus
          />
        </div>
      </div>

      {isLoading && (
        <p className="text-lg text-gray-500 text-center">Loading...</p>
      )}

      {!isLoading && error && (
        <h1 className="text-3xl font-semibold text-center text-gray-700">
          {error}
        </h1>
      )}

      {!isLoading && !error && searchResults.length === 0 && keyword.trim() === "" && (
        <p className="text-lg text-gray-500 text-center">
          Enter a keyword to search products.
        </p>
      )}

      {!isLoading && searchResults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {searchResults.map((item) => (
            <ShoppingProductTile
              key={item.id}
              product={item}
              handleAddtoCart={() => handleAddtoCart(item.id, item.inventory?.stock || 0)}
              handleGetProductDetails={() => handleGetProductDetails(item.id)}
            />
          ))}
        </div>
      )}

      {/* <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      /> */}
    </div>
  );
}

export default SearchProducts;