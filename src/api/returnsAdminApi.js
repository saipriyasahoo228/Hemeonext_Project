import apiClient from "./apiClient";

// Fetch all return requests
export const fetchReturnRequests = async () => {
  try {
    const response = await apiClient.get("/returns/admin/returns/");
    return response.data;
  } catch (error) {
    console.error("Error fetching return requests:", error);
    throw error;
  }
};

// Fetch products for exchange
export const fetchProducts = async () => {
  try {
    const response = await apiClient.get("/products/products/");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Submit approve/reject action for a return request
export const submitReturnAction = async (returnId, data) => {
  try {
    const response = await apiClient.put(`/returns/admin/returns/${returnId}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error submitting return action:", error);
    throw error;
  }
};