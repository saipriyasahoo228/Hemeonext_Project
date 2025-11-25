import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockProducts, wishlistOperations, cartOperations } from "@/data/mockProducts";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

export default function WishlistComponent({ userId }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const wishlist = wishlistOperations.getWishlist(userId);
    const items = wishlist.items.map((item) => {
      const product = mockProducts.find((p) => p.id === item.productId);
      return {
        id: item.productId,
        name: product.title,
        price: product.salePrice,
        originalPrice: product.actualPrice > product.salePrice ? product.actualPrice : null,
        discount: product.actualPrice > product.salePrice ? Math.round(((product.actualPrice - product.salePrice) / product.actualPrice) * 100) : null,
        image: product.image,
      };
    });
    setWishlistItems(items);
  }, [userId]);

  const handleAddToCart = (productId) => {
    const product = mockProducts.find((p) => p.id === productId);
    const updatedCart = cartOperations.addItem(
      userId,
      productId,
      1,
      product.colors && product.colors.length > 0 ? product.colors[0] : null,
      product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
    );
    toast({
      title: "Product added to cart",
      className: "bg-[#E6C692] text-black border-none",
    });
  };

  const handleRemoveFromWishlist = (productId) => {
    wishlistOperations.removeItem(userId, productId);
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    toast({
      title: "Item removed from wishlist",
      variant: "destructive",
    });
  };

  return (
    <Card className="bg-transparent shadow-md border-none">
      <CardHeader>
        <CardTitle>My Wishlist</CardTitle>
        <CardDescription>Items you've saved for later</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <Badge className="absolute right-2 top-2 z-10">{item.discount ? `${item.discount}% OFF` : "New"}</Badge>
                <Link to={`/shop/product/${item.id}`}>
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
                </Link>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute bottom-2 right-2 h-8 w-8 rounded-full opacity-90"
                  onClick={() => handleRemoveFromWishlist(item.id)}
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Remove from wishlist</span>
                </Button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium">{item.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-bold">${item.price.toFixed(2)}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">${item.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <Button className="mt-4 w-full gap-2" onClick={() => handleAddToCart(item.id)}>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {wishlistItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">Your wishlist is empty</h3>
            <p className="mt-2 text-sm text-muted-foreground">Items added to your wishlist will appear here</p>
            <Button className="mt-6">Continue Shopping</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}