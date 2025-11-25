import apiClient from "./apiClient";

// Fetch search results
export const fetchSearchResults = async (query) => {
  try {
    const response = await apiClient.get("/products/search/", {
      params: { q: query },
    });
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};

// Fetch all products
export const fetchProducts = async (params = {}) => {
  try {
    const response = await apiClient.get("/products/products/", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Fetch categories (for filtering)
export const fetchCategories = async () => {
  try {
    const response = await apiClient.get("/products/categories/");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
export const fetchCategoryById = async (id) => {
  try {
    const response = await apiClient.get(`/products/categories/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    throw error;
  }
};

// Fetch products by category
export const fetchProductsByCategory = async (categoryId, params = {}) => {
  try {
    const response = await apiClient.get(`/products/products/`, {
      params: {
        category: categoryId,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    throw error;
  }
};

// Fetch subcategories (for filtering)
export const fetchSubCategories = async () => {
  try {
    const response = await apiClient.get("/products/subcategories/");
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

// Fetch Brands
export const fetchBrands = async () => {
  try {
    const response = await apiClient.get("/products/brands/");
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};


//Add Product

export const addProduct = async (data) => {
  try {
    const response = await apiClient.post("/products/products/", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};



// Fetch a single product by ID
export const fetchProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/products/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};





// Partial update a product (PATCH)
export const updateProduct = async (productId, data) => {
  try {
    console.log("Product ID:", productId);
    console.log("Data:", data);
    const response = await apiClient.patch(`/products/products/${productId}/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error patching product with ID ${productId}:`, error);
    throw error;
  }
};


//Delete product by id

export const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/products/products/${productId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with ID ${productId}:`, error);
    throw error;
  }
};


// Fetch the user's cart
export const fetchCart = async () => {
  try {
    const response = await apiClient.get("/cart-wishlist/cart/");
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

// Add an item to the cart
export const addToCart = async (productId, quantity, color, size) => {
  try {
    const response = await apiClient.post("/cart-wishlist/cart-items/", {
      product_id: productId,
      quantity,
      color,
      size,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

// Update the quantity of a cart item
export const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    
    const response = await apiClient.patch(`/cart-wishlist/cart-items/${cartItemId}/`, {
      quantity,
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error(`Error updating cart item ${cartItemId} quantity:`, error);
    throw error;
  }
};

// Remove an item from the cart
export const removeFromCart = async (cartItemId) => {
  try {
    const response = await apiClient.delete(`/cart-wishlist/cart-items/${cartItemId}/`);
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

// Clear the cart
export const clearCart = async () => {
  try {
    const response = await apiClient.delete("/cart-wishlist/cart/clear/");
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

// Fetch the user's wishlist
export const fetchWishlist = async () => {
  try {
    const response = await apiClient.get("/cart-wishlist/wishlist/");
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
};

// Toggle an item in the wishlist (add if not present, remove if present)
export const toggleWishlistItem = async (productId) => {
  try {
    const response = await apiClient.post("/cart-wishlist/wishlist-items/", {
      product_id: productId,
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling wishlist item:", error);
    throw error;
  }
};

// Remove an item from the wishlist
export const removeFromWishlist = async (wishlistItemId) => {
  try {
    const response = await apiClient.delete(`/cart-wishlist/wishlist-items/${wishlistItemId}/`);
    return response.data;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};

// Clear the wishlist
export const clearWishlist = async () => {
  try {
    const response = await apiClient.delete("/cart-wishlist/wishlist/clear/");
    return response.data;
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    throw error;
  }
};


export const createAddress = async (addressData) => {
  try {
    console.log("Address Data:", addressData);
    const response = await apiClient.post("/address/address/create/", addressData);
    return response.data;
  } catch (error) {
    console.error("Error creating address:", error);
    throw error;
  }
};

// Fetch all addresses for a customer
export const fetchAddresses = async (customerId) => {
  try {
    const response = await apiClient.get(`/address/address/list/${customerId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw error;
  }
};

// Update an existing address
export const updateAddress = async (customerId, addressId, addressData) => {
  try {
    const response = await apiClient.put(
      `/address/address/update/${customerId}/${addressId}/`,
      addressData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

// Delete an address
export const deleteAddress = async (customerId, addressId) => {
  try {
    const response = await apiClient.delete(
      `/address/address/update/${customerId}/${addressId}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
};


// APIs For Product Review

// Fetch reviews for a product
export const fetchProductReviews = async (productId) => {
  try {
    const response = await apiClient.get(`/reviews/products/${productId}/reviews/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    throw error;
  }
};

// Submit a new review
export const submitReview = async (productId, reviewData) => {
  try {
    const response = await apiClient.post(`/reviews/products/${productId}/reviews/`, reviewData);
    return response.data;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

// Update an existing review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await apiClient.put(`/reviews/reviews/${reviewId}/`, reviewData);
    return response.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await apiClient.delete(`/reviews/reviews/${reviewId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};



// Add a category
export const addCategory = async (data) => {
  try {
    const response = await apiClient.post("/products/categories/", { name: data.name });
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// Update a category
export const updateCategory = async (categoryId, data) => {
  try {
    const response = await apiClient.put(`/products/categories/${categoryId}/`, { name: data.name });
    return response.data;
  } catch (error) {
    console.error(`Error updating category with ID ${categoryId}:`, error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (categoryId) => {
  try {
    const response = await apiClient.delete(`/products/categories/${categoryId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category with ID ${categoryId}:`, error);
    throw error;
  }
};



// Add a subcategory
export const addSubCategory = async (data) => {
  try {
    const response = await apiClient.post("/products/subcategories/", {
      name: data.name,
      category: data.category,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding subcategory:", error);
    throw error;
  }
};

// Update a subcategory
export const updateSubCategory = async (subCategoryId, data) => {
  try {
    const response = await apiClient.put(`/products/subcategories/${subCategoryId}/`, {
      name: data.name,
      category: data.category,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating subcategory with ID ${subCategoryId}:`, error);
    throw error;
  }
};

// Delete a subcategory
export const deleteSubCategory = async (subCategoryId) => {
  try {
    const response = await apiClient.delete(`/products/subcategories/${subCategoryId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting subcategory with ID ${subCategoryId}:`, error);
    throw error;
  }
};

// Add a brand
export const addBrand = async (data) => {
  try {
    const response = await apiClient.post("/products/brands/", { name: data.name });
    return response.data;
  } catch (error) {
    console.error("Error adding brand:", error);
    throw error;
  }
};

// Update a brand
export const updateBrand = async (brandId, data) => {
  try {
    const response = await apiClient.put(`/products/brands/${brandId}/`, { name: data.name });
    return response.data;
  } catch (error) {
    console.error(`Error updating brand with ID ${brandId}:`, error);
    throw error;
  }
};

// Delete a brand
export const deleteBrand = async (brandId) => {
  try {
    const response = await apiClient.delete(`/products/brands/${brandId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting brand with ID ${brandId}:`, error);
    throw error;
  }
};