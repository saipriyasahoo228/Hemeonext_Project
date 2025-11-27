import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Star,
  ShoppingCart,
  X,
  Heart,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCurrency } from "@/context/currency-context";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/use-toast";
import {
  fetchProductById,
  addToCart,
  fetchWishlist,
  toggleWishlistItem,
  fetchProductReviews,
  submitReview,
  updateReview,
  deleteReview,
} from "@/api/productApi";
import { useCart } from "@/context/cart-context";
import RelatedItems from "@/components/shopping-view/related-items";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { convertPrice, loading: currencyLoading } = useCurrency();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, refreshCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [editingReview, setEditingReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "", images: [] });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedReviewImage, setSelectedReviewImage] = useState(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const productId = parseInt(id);
  const toTitleCase = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  // Fetch product details
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductById(productId);
        setProduct(productData);
        setSelectedColor(productData.colors?.[0] || "");
        setSelectedSize(productData.sizes?.[0] || "");
      } catch (err) {
        console.error("Product Fetch Error:", err);
        setError("Failed to load product details.");
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId, toast]);

  // Fetch wishlist only if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadWishlist = async () => {
      try {
        const wishlistData = await fetchWishlist();
        const wishlistObj = wishlistData[0] || { items: [] };
        setWishlist(wishlistObj);
        const isProductInWishlist = wishlistObj.items.some(
          (item) => item.product.id === productId
        );
        setIsInWishlist(isProductInWishlist);
      } catch (err) {
        console.error("Wishlist Fetch Error:", err);
        toast({
          title: "Error",
          description: "Failed to load wishlist.",
          variant: "destructive",
        });
      }
    };
    loadWishlist();
  }, [productId, toast, isAuthenticated]);

  // Fetch reviews
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const reviewData = await fetchProductReviews(productId);
        setReviews(reviewData);
        if (user) {
          const currentUserReview = reviewData.find(
            (review) => review.customer === user.id
          );
          setUserReview(currentUserReview || null);
          if (currentUserReview) {
            setNewReview({
              rating: currentUserReview.rating,
              comment: currentUserReview.comment || "",
              images: currentUserReview.images || [],
            });
            setImagePreviews(currentUserReview.images.map((img) => img.image));
          } else {
            setNewReview({ rating: 0, comment: "", images: [] });
            setImagePreviews([]);
          }
        }
      } catch (err) {
        console.error("Reviews Fetch Error:", err);
        toast({
          title: "Error",
          description: "Failed to load reviews.",
          variant: "destructive",
        });
      }
    };
    loadReviews();
  }, [productId, toast, user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setNewReview((prev) => ({
        ...prev,
        images: [...prev.images, { image: base64String }],
      }));
      setImagePreviews((prev) => [...prev, base64String]);
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const removeImage = (index) => {
    setNewReview((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowAuthPopup(true);
      return;
    }

    if (!newReview.rating || newReview.rating < 1 || newReview.rating > 5) {
      toast({
        title: "Error",
        description: "Please provide a rating between 1 and 5.",
        variant: "destructive",
      });
      return;
    }
    setSubmittingReview(true);
    try {
      const submittedReview = await submitReview(productId, newReview);
      setReviews([submittedReview, ...reviews]);
      setUserReview(submittedReview);
      setNewReview({ rating: 0, comment: "", images: [] });
      setImagePreviews([]);
      toast({
        title: "Review Submitted",
        className: "bg-green-500 text-white border-none shadow-lg",
      });
    } catch (err) {
      console.error("Review Submit Error:", err.response?.data);
      if (
        err.response?.status === 400 &&
        err.response.data.detail === "You have already reviewed this product."
      ) {
        toast({
          title: "Review Exists",
          description:
            "You've already reviewed this product. Edit your existing review instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit review.",
          variant: "destructive",
        });
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReviewUpdate = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowAuthPopup(true);
      return;
    }

    if (!newReview.rating || newReview.rating < 1 || newReview.rating > 5) {
      toast({
        title: "Error",
        description: "Please provide a rating between 1 and 5.",
        variant: "destructive",
      });
      return;
    }
    setSubmittingReview(true);
    try {
      const updatedReview = await updateReview(userReview.id, newReview);
      setReviews(
        reviews.map((review) =>
          review.id === updatedReview.id ? updatedReview : review
        )
      );
      setUserReview(updatedReview);
      setEditingReview(false);
      setNewReview({
        rating: updatedReview.rating,
        comment: updatedReview.comment || "",
        images: updatedReview.images || [],
      });
      setImagePreviews(updatedReview.images.map((img) => img.image));
      toast({
        title: "Review Updated",
        className: "bg-green-500 text-white border-none shadow-lg",
      });
    } catch (err) {
      console.error("Review Update Error:", err);
      toast({
        title: "Error",
        description: "Failed to update review.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReviewDelete = async () => {
    if (!isAuthenticated) {
      setShowAuthPopup(true);
      return;
    }

    setSubmittingReview(true);
    try {
      await deleteReview(userReview.id);
      setReviews(reviews.filter((review) => review.id !== userReview.id));
      setUserReview(null);
      setNewReview({ rating: 0, comment: "", images: [] });
      setImagePreviews([]);
      setEditingReview(false);
      toast({
        title: "Review Deleted",
        className: "bg-green-500 text-white border-none shadow-lg",
      });
    } catch (err) {
      console.error("Review Delete Error:", err);
      toast({
        title: "Error",
        description: "Failed to delete review.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      setShowAuthPopup(true);
      return;
    }

    setCartLoading(true);
    const totalCartItems = cartItems.length;

    if (
      totalCartItems >= 10 &&
      !cartItems.some(
        (item) =>
          item.product.id === productId &&
          item.color === selectedColor &&
          item.size === selectedSize
      )
    ) {
      toast({
        title: "Cart Limit Reached",
        description: "You can only add up to 10 different items to your cart.",
        variant: "destructive",
      });
      setCartLoading(false);
      return;
    }

    try {
      await addToCart(productId, 1, selectedColor, selectedSize);
      await refreshCart();
      const updatedCartItem = cartItems.find(
        (item) =>
          item.product.id === productId &&
          item.color === selectedColor &&
          item.size === selectedSize
      );
      const quantity = updatedCartItem ? updatedCartItem.quantity : 0;

      toast({
        title: `Product added to cart. In Cart: ${quantity+1}`,
        description: (
          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-2 border-green-600 bg-transparent shadow-md hover:bg-green-600 hover:text-white"
            onClick={() => navigate("/shop/cart")}
          >
            Go to Cart
          </Button>
        ),
        className: "bg-green-500 text-white border-none",
        duration: 4000,
      });
    } catch (err) {
      console.error("Add to Cart Error:", err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to add product to cart.",
        variant: "destructive",
      });
    } finally {
      setCartLoading(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      setShowAuthPopup(true);
      return;
    }

    setTogglingWishlist(true);
    const previousWishlistState = isInWishlist;

    try {
      setIsInWishlist(!isInWishlist);
      await toggleWishlistItem(productId);
      const updatedWishlistData = await fetchWishlist();
      const updatedWishlist = updatedWishlistData[0] || { items: [] };
      setWishlist(updatedWishlist);
      const isProductInWishlist = updatedWishlist.items.some(
        (item) => item.product.id === productId
      );
      setIsInWishlist(isProductInWishlist);
      toast({
        title: isProductInWishlist ? "Added to wishlist" : "Removed from wishlist",
        className: "bg-green-500 text-white border-none",
      });
    } catch (err) {
      console.error("Wishlist Toggle Error:", err);
      setIsInWishlist(previousWishlistState);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to update wishlist.",
        variant: "destructive",
      });
    } finally {
      setTogglingWishlist(false);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setShowAuthPopup(true);
      return;
    }

    const cartQuantity = cartItems.find(
      (item) =>
        item.product.id === productId &&
        item.color === selectedColor &&
        item.size === selectedSize
    )?.quantity || 0;
    navigate(`/shop/buy-now/${productId}`, { state: { quantity: cartQuantity || 1 } });
  };

  const images = product?.images?.map((img) => img.image) || [];
  const nextImage = () =>{ 
    if(images.length>0){
     setCurrentImage((prev) => (prev + 1) % images.length)}
    };
  const prevImage = () =>{
    if (images.length>0){
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}};

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") prevImage();
      else if (event.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images]);

  const salePrice = product?.sale_price
    ? currencyLoading
      ? "..."
      : convertPrice(product.sale_price)
    : null;
  const actualPrice = currencyLoading ? "..." : convertPrice(product?.actual_price);
  const discountPercentage = product?.discount_percentage || 0;

  const renderCartButton = () => {
    const cartQuantity = cartItems.find(
      (item) =>
        item.product.id === productId &&
        item.color === selectedColor &&
        item.size === selectedSize
    )?.quantity || 0;
    return (
      <div className="flex flex-col items-start">
        <Button
          variant="outline"
          size="lg"
          onClick={handleAddToCart}
          disabled={cartLoading || cartQuantity >= product.stock || product.stock === 0}
          className="flex-1 gap-1 md:pr-16 md:pl-16 p-3 border-2 border-green-600 bg-green-100 hover:bg-green-600 text-green-800 hover:text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
        >
          {cartLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ShoppingCart className="h-5 w-5" />
          )}
          Add to Cart
        </Button>
        {cartQuantity >= product.stock && product.stock > 0 && (
          <p className="text-xs pl-2 text-orange-500 mt-1">Maximum stock reached.</p>
        )}
        {product.stock === 0 && (
          <p className="text-xs pl-0 md:pl-8 text-red-600 mt-1">Out of stock.</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-green-800">{error || "Product not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="flex flex-col md:flex-row">
        {/* Main Image Card */}
        <div className="relative top-0 left-0 w-full md:w-1/2 h-auto md:h-auto flex flex-col items-center justify-center">
          <motion.div
            className="flex items-center justify-center mt-20 w-full h-[50vh] md:h-[70vh] cursor-zoom-in"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => setIsZoomed(true)}
          >
            <img
              src={images[currentImage]}
              alt={product.title}
              className="object-contain w-[75%] md:w-full h-full max-w-md mx-auto"
              loading="lazy"
            />
          </motion.div>
          <div className="w-full max-w-md flex flex-wrap gap-2 justify-center py-4 px-4 overflow-y-auto">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 h-16 object-cover border-2 rounded-md cursor-pointer transition-all duration-300 ${
                  currentImage === index ? "border-orange-500 shadow-lg" : "border-transparent hover:border-green-300"
                }`}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-green-300 hover:bg-green-300"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6 text-green-800" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-green-300 hover:bg-green-300"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6 text-green-800" />
              </button>
            </>
          )}
        </div>

        <div className="w-full md:w-1/2 ml-auto p-6 lg:p-12">
          <div className="sticky top-0 pt-8 pb-6 bg-transparent z-10">
            <h1 className="text-3xl lg:text-3xl font-bold tracking-tight text-green-800">
              {product.title}
            </h1>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.average_rating || 0)
                        ? "text-orange-500 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-green-600">
                {product.average_rating} ({product.review_count} reviews)
              </span>
              <span
                className={`text-sm font-medium ${
                  product.stock === 0
                    ? "text-red-600"
                    : product.stock < 10
                    ? "text-orange-500"
                    : "text-green-600"
                }`}
              >
                {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="text-2xl font-bold text-green-800 bg-green-100 px-4 py-2 rounded-2xl shadow-lg border border-green-300">
                {salePrice || actualPrice}
              </div>
              {salePrice && discountPercentage > 0 && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    {actualPrice}
                  </span>
                  <span className="text-sm font-medium text-white bg-orange-500 px-3 py-1 rounded-full shadow-lg">
                    {`${discountPercentage}% Off`}
                  </span>
                </>
              )}
            </div>
            {product.colors?.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold text-green-800">
                  <strong>Color:</strong>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      onClick={() => setSelectedColor(color)}
                      disabled={cartLoading}
                      className={`text-sm transition-all duration-300 ${
                        selectedColor === color
                          ? "bg-green-600 text-white border-2 border-green-600 shadow-lg"
                          : "bg-white text-green-800 border-2 border-green-300 hover:bg-green-100"
                      }`}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {product.sizes?.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold text-green-800">
                  <strong>Size:</strong>
                </p>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      disabled={cartLoading}
                      className={`text-sm transition-all duration-300 ${
                        selectedSize === size
                          ? "bg-green-600 text-white border-2 border-green-600 shadow-lg"
                          : "bg-white text-green-800 border-2 border-green-300 hover:bg-green-100"
                      }`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {isZoomed && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="relative bg-white border-2 border-white p-6 rounded-2xl max-w-4xl w-full shadow-2xl">
                <button
                  onClick={() => setIsZoomed(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-lg"
                  aria-label="Close zoom view"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
                <div className="flex items-center justify-center h-[70vh]">
                  <img
                    src={images[currentImage]}
                    alt={product.title}
                    className="object-contain w-full h-full rounded-2xl"
                  />
                </div>
                <div className="flex gap-2 justify-center py-4">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-16 h-16 object-cover border-2 rounded-md cursor-pointer transition-all duration-300 ${
                        currentImage === index ? "border-orange-500 shadow-lg" : "border-transparent hover:border-green-300"
                      }`}
                      onClick={() => setCurrentImage(index)}
                    />
                  ))}
                </div>
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-green-300 hover:bg-green-300"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6 text-green-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-green-300 hover:bg-green-300"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6 text-green-800" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <motion.p
            className="mt-4 text-lg text-green-700 bg-green-100 rounded-2xl p-4 shadow-lg border border-green-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {product.description}
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              size="lg"
              className="flex-1 gap-1 md:pr-20 md:pl-20 p-4 border-2 border-green-600 bg-green-100 hover:bg-green-600 text-green-800 hover:text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
              onClick={handleBuyNow}
              disabled={cartLoading || togglingWishlist || product.stock === 0}
            >
              <ShoppingBag className="h-5 w-5" /> Buy Now
            </Button>
            {renderCartButton()}
            {/* Heart Icon */}
            <Button
              size="lg"
              variant="outline"
              className="flex items-center justify-center gap-2 p-4 border-2 border-green-600 "
              onClick={handleToggleWishlist}
              disabled={togglingWishlist || cartLoading}
            >
              {togglingWishlist ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Heart
                  className={`h-5 w-5 transition-colors duration-200 
                    ${isInWishlist ? "fill-orange-500" : "fill-none"}`}
                  color={isInWishlist ? "#f53702ff" : "#166534"}
                  strokeWidth={1}
                />
              )}
              <span className="inline md:hidden">
                {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </span>
            </Button>
          </motion.div>

          <Tabs defaultValue="details" className="mt-6 mb-10 md:mb-0">
            <TabsList className="w-full justify-start bg-green-100 rounded-2xl p-2 shadow-lg border border-green-200 mb-2">
              <TabsTrigger value="details" className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-xl font-medium transition-all duration-300">Details</TabsTrigger>
              <TabsTrigger value="specifications" className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-xl font-medium transition-all duration-300">Specifications</TabsTrigger>
              <TabsTrigger value="shipping" className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-xl font-medium transition-all duration-300">Shipping</TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-xl font-medium transition-all duration-300">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <motion.div
                className="p-6 bg-white rounded-2xl shadow-2xl border-2 border-green-100"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <p className="text-green-800">
                  <strong className="text-orange-500">Brand:</strong> {product.brand?.name || "N/A"}
                </p>
                {product.material && (
                  <p className="text-green-800 mt-2">
                    <strong className="text-orange-500">Material:</strong> {product.material}
                  </p>
                )}
              </motion.div>
            </TabsContent>
            <TabsContent value="specifications">
              <motion.div
                className="p-6 bg-white rounded-2xl shadow-2xl border-2 border-green-100"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {product.specifications?.length > 0 ? (
                  product.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="p-4 m-2 rounded-2xl bg-green-50 border border-green-200"
                    >
                      <p className="font-semibold text-green-800">
                        {toTitleCase(spec.key)}:
                      </p>
                      <p className="text-green-700">{toTitleCase(spec.value)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-green-700">No specifications available.</p>
                )}
              </motion.div>
            </TabsContent>
            <TabsContent value="shipping">
              <motion.div
                className="p-6 bg-white rounded-2xl shadow-2xl border-2 border-green-100"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <p className="text-green-800">{product.shipping_info || "Standard shipping applies."}</p>
                <p className="text-green-800 mt-2">{product.return_policy || "30-day return policy."}</p>
              </motion.div>
            </TabsContent>

            <TabsContent value="reviews">
              <motion.div
                className="p-6 bg-white rounded-2xl shadow-2xl border-2 border-green-100"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <h3 className="text-xl font-semibold mb-4 text-green-800">
                  Customer Reviews
                </h3>
                {user ? (
                  userReview ? (
                    <div className="mb-6">
                      <h4 className="font-semibold text-lg mb-2 text-green-800">
                        Your Review
                      </h4>
                      {editingReview ? (
                        <form
                          onSubmit={handleReviewUpdate}
                          className="border border-green-200 p-4 rounded-2xl shadow-xl bg-white"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Label className="font-medium text-green-800">
                              Rating:
                            </Label>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-6 h-6 cursor-pointer ${
                                    star <= newReview.rating
                                      ? "text-orange-500 fill-current"
                                      : "text-gray-300"
                                  }`}
                                  onClick={() =>
                                    setNewReview({
                                      ...newReview,
                                      rating: star,
                                    })
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <Textarea
                            placeholder="Update your review here..."
                            value={newReview.comment}
                            onChange={(e) =>
                              setNewReview({
                                ...newReview,
                                comment: e.target.value,
                              })
                            }
                            className="mb-3 border-green-200 focus:border-orange-500"
                          />
                          <div className="mb-3">
                            <Label className="font-medium text-green-800">
                              Upload Image:
                            </Label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="mt-1 block w-full text-sm text-green-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
                            />
                          </div>
                          {imagePreviews.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={preview}
                                    alt={`Preview ${index}`}
                                    className="w-20 h-20 object-cover rounded-md cursor-pointer border-2 border-green-200"
                                    onClick={() =>
                                      setSelectedReviewImage(preview)
                                    }
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-0 right-0 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-orange-600 transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-col md:flex-row gap-2">
                            <Button
                              type="submit"
                              disabled={submittingReview}
                              className="bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg"
                            >
                              {submittingReview ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                "Update Review"
                              )}
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleReviewDelete}
                              disabled={submittingReview}
                              className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg"
                            >
                              {submittingReview ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                "Delete Review"
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingReview(false)}
                              disabled={submittingReview}
                              className="border-green-200 text-green-800 hover:bg-green-100 font-bold"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="border border-green-200 p-4 rounded-2xl shadow-xl bg-white flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-green-800">
                              {userReview.customer_name}
                            </p>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= userReview.rating
                                      ? "text-orange-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-green-700">
                              {userReview.comment || "No comment provided."}
                            </p>
                            {userReview.images && userReview.images.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {userReview.images.map((img, index) => (
                                  <img
                                    key={index}
                                    src={img.image}
                                    alt={`Review image ${index}`}
                                    className="w-20 h-20 object-cover rounded-md cursor-pointer border-2 border-green-200"
                                    onClick={() =>
                                      setSelectedReviewImage(img.image)
                                    }
                                  />
                                ))}
                              </div>
                            )}
                            <p className="text-sm text-green-600">
                              {new Date(userReview.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => setEditingReview(true)}
                            className="ml-4 border-green-200 text-green-800 hover:bg-green-100 hover:text-green-800 transition-colors font-bold"
                          >
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <form
                      onSubmit={handleReviewSubmit}
                      className="mb-6 border border-green-200 p-4 rounded-2xl bg-white shadow-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Label className="font-medium text-green-800">Rating:</Label>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-6 h-6 cursor-pointer ${
                                star <= newReview.rating
                                  ? "text-orange-500 fill-current"
                                  : "text-gray-300"
                              }`}
                              onClick={() =>
                                setNewReview({ ...newReview, rating: star })
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <Textarea
                        placeholder="Write your review here..."
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({ ...newReview, comment: e.target.value })
                        }
                        className="mb-3 border-green-200 focus:border-orange-500"
                      />
                      <div className="mb-3">
                        <Label className="font-medium text-green-800">
                          Upload Image:
                        </Label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="mt-1 block w-full text-sm text-green-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
                        />
                      </div>
                      {imagePreviews.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview}
                                alt={`Preview ${index}`}
                                className="w-20 h-20 object-cover rounded-md cursor-pointer border-2 border-green-200"
                                onClick={() => setSelectedReviewImage(preview)}
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-0 right-0 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-orange-600 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <Button
                        type="submit"
                        disabled={submittingReview}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg"
                      >
                        {submittingReview ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          "Submit Review"
                        )}
                      </Button>
                    </form>
                  )
                ) : (
                  <p className="mb-6 text-green-700">
                    Please log in to submit a review.
                  </p>
                )}

                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 rounded-2xl bg-green-50 shadow-lg border border-green-200"
                      >
                        <p className="font-semibold text-green-800">
                          {review.customer_name}
                        </p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "text-orange-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-green-700">
                          {review.comment || "No comment provided."}
                        </p>
                        {review.images && review.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {review.images.map((img, index) => (
                              <img
                                key={index}
                                src={img.image}
                                alt={`Review image ${index}`}
                                className="w-20 h-20 object-cover rounded-md cursor-pointer border-2 border-green-200"
                                onClick={() => setSelectedReviewImage(img.image)}
                              />
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-green-600">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-green-700">
                      No reviews yet. Be the first to review this product!
                    </p>
                  )}
                </div>

                {selectedReviewImage && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="relative bg-white border-2 border-white p-6 rounded-2xl max-w-4xl w-full shadow-2xl">
                      <button
                        onClick={() => setSelectedReviewImage(null)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-lg"
                        aria-label="Close image view"
                      >
                        <X className="h-6 w-6 text-white" />
                      </button>
                      <div className="flex items-center justify-center h-[70vh]">
                        <img
                          src={selectedReviewImage}
                          alt="Full view"
                          className="object-contain w-full h-full rounded-2xl"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

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
              className="bg-green-50 rounded-2xl p-6 shadow-2xl border-2 border-green-200 max-w-sm w-full mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-green-800 mb-4">
                Please Log In or Register
              </h3>
              <p className="text-sm text-green-700 mb-6">
                You need to be logged in to access this feature.
              </p>
              <div className="flex gap-4">
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg"
                  onClick={() => {
                    setShowAuthPopup(false);
                    navigate("/auth/login");
                  }}
                >
                  Login
                </Button>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg"
                  onClick={() => {
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
      <RelatedItems categoryId={product.category.id} currentProductId={productId} />
    </div>
  );
}