import apiClient from "./apiClient";


// Submit new seller application
export const submitSellerApplication = async (applicationData) => {
  try {
    console.log("Submitting seller application:", applicationData);
    const response = await apiClient.post("/sellers/seller/apply/", applicationData);
    return response.data;
  } catch (error) {
    console.error("Error submitting seller application:", error);
    throw error.response?.data || { error: "Seller application submission failed" };
  }
};

// Fetch all seller applications (for admin use)
export const listSellerApplications = async () => {
  try {
    const response = await apiClient.get("/sellers/admin/seller-applications/");
    return response.data;
  } catch (error) {
    console.error("Error fetching seller applications:", error);
    throw error.response?.data || { error: "Failed to fetch seller applications" };
  }
};

// Fetch a specific seller application by request_id (for admin use)
export const getSellerApplication = async (requestId) => {
  try {
    const response = await apiClient.get(`/sellers/admin/seller-applications/${requestId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching seller application:", error);
    throw error.response?.data || { error: "Failed to fetch seller application" };
  }
};

// Update a seller application (approve/reject) (for admin use)
export const updateSellerApplication = async (requestId, applicationData) => {
  try {
    const response = await apiClient.patch(`/sellers/admin/seller-applications/${requestId}/`, applicationData);
    return response.data;
  } catch (error) {
    console.error("Error updating seller application:", error);
    throw error.response?.data || { error: "Seller application update failed" };
  }
};