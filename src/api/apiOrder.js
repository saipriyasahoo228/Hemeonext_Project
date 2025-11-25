import apiClient from "./apiClient";


// Fetch all order details

// export const fetchOrderDetails = async () => {
//     try {
//       const response = await apiClient.get("/orders/orders/");
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       throw error;
//     }
//   };

export const fetchOrderDetails = async () => {
  try {
    const response = await apiClient.get("/orders/orders/");
    const sortedData = response.data.sort((a, b) => new Date(b.order_date) - new Date(a.order_date)); // Sort by date in descending order
    return sortedData;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};


// Update order details (Admin)
export const updateOrderDetails = async (orderId, updatedData) => {
  try {
      const response = await apiClient.put(`/orders/orders/${orderId}/`, updatedData);
      return response.data;
  } catch (error) {
      console.error("Error updating order details:", error);
      throw error;
  }
};


// For Admin Delete an order
export const cancelOrder = async (orderId) => {
  try {
    const response = await apiClient.delete(`/orders/orders/${orderId}/`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error.response?.data || { error: "Order cancellation failed" };
  }
};