import apiClient from "./apiClient";

// Function to refresh token
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) throw new Error("No refresh token available");
    const response = await apiClient.post("/auth/token/refresh/", { refresh }, { skipAuth: true }); // Skip auth for refresh
    localStorage.setItem("access_token", response.data.access);
    if (response.data.refresh) {
      localStorage.setItem("refresh_token", response.data.refresh);
    }
    return response.data.access;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error.response?.data || { error: "Token refresh failed" };
  }
};

// Add interceptor to apiClient to handle 401 errors and refresh token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && !config.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.skipAuth) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout or handle accordingly
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Register a new user
export const registerUser = async (userData) => {
  try {
    console.log("Registering user:", userData);
    const response = await apiClient.post("/auth/register/", userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    const errorMessage = error.response?.data?.non_field_errors?.[0] ||
    error.response?.data?.error || "Registration failed";
    throw new Error(errorMessage);
  }
};

// Verify SMS OTP
export const verifySmsOtp = async (mobileNumber, otp) => {
  try {
    const response = await apiClient.post("/auth/verify-sms-otp/", {
      mobile_number: mobileNumber,
      sms_otp: otp,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    const errorMessage = error.response?.data?.error || "OTP verification failed";
    throw new Error(errorMessage);
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    console.log(credentials);
    const response = await apiClient.post("/auth/login/", credentials, { skipAuth: true });
    localStorage.setItem("access_token", response.data.Token.access);
    localStorage.setItem("refresh_token", response.data.Token.refresh);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    const errorMessage = error.response?.data?.non_field_errors?.[0] ||
    error.response?.data?.error || "An unexpected error occurred during login";
    throw new Error(errorMessage);
  }
};

// Refresh access token ( for manual use if needed)
export { refreshToken };

// Request password reset OTP
export const requestPasswordResetOTP = async (identifier) => {
  try {
    const payload = identifier.includes('@') 
      ? { email: identifier } 
      : { mobile_number: identifier };
    const response = await apiClient.post("/auth/password-reset/request-otp/", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || { error: "Password reset request failed" };
  }
};

// Verify password reset OTP
export const verifyPasswordResetOTP = async (identifier, otp) => {
  try {
    const response = await apiClient.post("/auth/password-reset/verify-otp/", {
      identifier,
      otp,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "OTP verification failed" };
  }
};

// Confirm password reset OTP
export const confirmPasswordResetOTP = async (identifier, newPassword) => {
  try {
    const response = await apiClient.post("/auth/password-reset/confirm-otp/", {
      identifier,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Password reset failed" };
  }
};

// Verify email OTP
export const verifyEmailOtp = async (email, otp) => {
  try {
    const response = await apiClient.post("/auth/verify-email-otp/", {
      email: email,
      email_otp: otp,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying email OTP:", error);
    throw error.response?.data || { error: "Email OTP verification failed" };
  }
};

// Verify temporary update
export const verifyTemporaryUpdate = async (fieldName, otp) => {
  try {
    const response = await apiClient.post("/auth/verify-temporary-update/", {
      field_name: fieldName,
      otp: otp,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying temporary update:", error);
    throw error.response?.data || { error: "Temporary update verification failed" };
  }
};

// Resend OTP
export const resendOtp = async (data) => {
  try {
    const response = await apiClient.post("/auth/resend-otp/", data);
    return response.data;
  } catch (error) {
    console.error("Error resending OTP:", error);
    throw error.response?.data || { error: "OTP resend failed" };
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put("/auth/update-profile/", profileData);
    console.log("Profile update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    console.log("Response data:", error.response?.data);
    throw error.response?.data || { error: "Profile update failed" };
  }
};

// Get user profile
export const getProfile = async () => {
  try {
    const response = await apiClient.get("/auth/update-profile/");
    console.log("Get Profile", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error.response?.data || { error: "Failed to fetch profile" };
  }
};

// Check auth status
export const checkAuthStatus = async () => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) return { isAuthenticated: false, user: null };

  try {
    const data = await getProfile();
    return {
      isAuthenticated: true,
      user: {
        name: data.user.name,
        email: data.user.email,
        mobile_number: data.user.mobile_number,
        is_admin: data.is_admin,
        customer_id: data.user.customer_id,
        id: data.user.id,
      },
    };
  } catch (error) {
    console.error("Authentication check failed:", error);
    return { isAuthenticated: false, user: null };
  }
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

// Delete account
export const deleteAccount = async (password) => {
  try {
    const response = await apiClient.post("/auth/delete-account/", { password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Account deletion failed" };
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.post("/auth/change-password/", passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Password change failed" };
  }
};