import apiClient from "./apiClient";

export const fetchOrderAnalytics = async (params = {}) => {
    try {
      const response = await apiClient.get("/orders/admin/orders/analytics/", {
        params, // time_period, country, start_date, end_date
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching order analytics:", error);
      throw error;
    }
  };
  

  export const fetchYearlyOrderAnalytics = async () => {
    try {
      const response = await apiClient.get("/orders/admin/orders/analytics/yearly/");
      return response.data;
    } catch (error) {
      console.error("Error fetching yearly order analytics:", error);
      throw error;
    }
  };


  export const fetchCountrySalesAnalytics = async (params = {}) => {
    try {
      const response = await apiClient.get("/orders/admin/orders/analytics/country/", {
        params, // Accepts { start_date, end_date, country }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching country-wise sales analytics:", error);
      throw error;
    }
  };