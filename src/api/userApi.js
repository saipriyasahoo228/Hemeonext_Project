import apiClient from "./apiClient";

// --- Address Management ---

// Create a new address
export const createAddress = async (addressData) => {
  try {
    console.log("Creating address:", addressData); // Log for debugging
    const response = await apiClient.post("/address/address/create/", addressData);
    return response.data;
  } catch (error) {
    console.error("Error creating address:", error);
    throw error.response?.data || { error: "Address creation failed" };
  }
};

// List all addresses for a customer
export const listAddresses = async (customerId) => {
  try {
    const response = await apiClient.get(`/address/address/list/${customerId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw error.response?.data || { error: "Failed to fetch addresses" };
  }
};

// Update an address
export const updateAddress = async (customerId, addressId, addressData) => {
  try {
    const response = await apiClient.put(`/address/address/update/${customerId}/${addressId}/`, addressData);
    return response.data;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error.response?.data || { error: "Address update failed" };
  }
};

// Delete an address
export const deleteAddress = async (customerId, addressId) => {
  try {
    const response = await apiClient.delete(`/address/address/delete/${customerId}/${addressId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error.response?.data || { error: "Address deletion failed" };
  }
};

// --- Profile Management ---

// Update user profile (already in authApi, but included here for completeness)
export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put("/auth/update-profile/", profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error.response?.data || { error: "Profile update failed" };
  }
};

// Get user profile (already in authApi, but included here for completeness)
export const getProfile = async () => {
  try {
    const response = await apiClient.get("/auth/update-profile/");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error.response?.data || { error: "Failed to fetch profile" };
  }
};

// --- Orders Management ---
export const createOrder = async (orderData) => {
  try {
    console.log("Creating order:", orderData);
    const response = await apiClient.post("/orders/orders/", orderData); // Updated endpoint
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error.response?.data || { error: "Order creation failed" };
  }
};

// Verify-payment
// Verify payment
export const verifyPayment = async (paymentData) => {
  try {
    const response = await apiClient.post("/orders/orders/verify-payment/", paymentData);
    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error.response?.data || { error: "Payment verification failed" };
  }
};

// List all orders for a customer
export const listOrders = async (customerId) => {
  try {
    const response = await apiClient.get(`/orders/orders/?customer=${customerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error.response?.data || { error: "Failed to fetch orders" };
  }
};

// Get specific order details
export const getOrder = async (customerId, orderId) => {
  try {
    const response = await apiClient.get(`/orders/orders/${orderId}/?customer=${customerId}`); // Updated endpoint
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error.response?.data || { error: "Failed to fetch order" };
  }
};

// Update an order
export const updateOrder = async (customerId, orderId, orderData) => {
  try {
    const response = await apiClient.put(`/orders/orders/${orderId}/?customer=${customerId}`, orderData); // Updated endpoint
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error.response?.data || { error: "Order update failed" };
  }
};



// --- Order Returns ---
// Create a return request
export const createReturnRequest = async (returnData) => {
  try {
    console.log("Creating return request:", returnData);
    const response = await apiClient.post("/returns/returns/", returnData);
    return response.data;
  } catch (error) {
    console.error("Error creating return request:", error);
    throw error.response?.data || { error: "Return request failed" };
  }
};

// List return requests for a customer
export const listReturnRequests = async () => {
  try {
    const response = await apiClient.get("/returns/returns/");
    console.log("Debug Response:", response.data); // Log for debugging
    return response.data;
  } catch (error) {
    console.error("Error fetching return requests:", error);
    throw error.response?.data || { error: "Failed to fetch return requests" };
  }
};

// Get specific return request details
export const getReturnRequest = async (returnId) => {
  try {
    const response = await apiClient.get(`/returns/returns/${returnId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching return request:", error);
    throw error.response?.data || { error: "Failed to fetch return request" };
  }
};