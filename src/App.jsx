import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
// import AdminDashboard from "./pages/admin-view/dashboard";
import CategoryDetails from "./pages/admin-view/categorydetails";
import VendorReport from "./pages/admin-view/sellerdetails";
import AdminStats from "./pages/admin-view/dashboardcard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminReturns from "./pages/admin-view/returns";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SearchProducts from "./pages/shopping-view/search";
import ProductDetailsPage from "./pages/shopping-view/productdetailspage";
import BuyNowPage from "./pages/shopping-view/buynowpage";
import CartPage from "./pages/shopping-view/Cart";
import Contact from "./pages/shopping-view/Contact";
import Wishlist from "./pages/shopping-view/wishlist";
import ForgotPassword from "./pages/auth/forgotpassword";
import { checkAuthStatus } from "./api/authApi";
import VerifyEmail from "./pages/auth/verifyemail";
import { useAuth } from "./context/auth-context";
import apiClient from "./api/apiClient";
import { refreshToken } from "./api/authApi";


function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });
  // const { refreshAccessToken } = useAuth(); // refreshAccessToken from context

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const { isAuthenticated, user } = await checkAuthStatus();
        setAuthState({ isAuthenticated, user, isLoading: false });
      } catch (error) {
        setAuthState({ isAuthenticated: false, user: null, isLoading: false });
      }
    };
    verifyAuth();
  }, []);


  if (authState.isLoading) return <Skeleton className="w-full h-[600px]" />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={authState.isAuthenticated} user={authState.user} />
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={authState.isAuthenticated} user={authState.user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={authState.isAuthenticated} user={authState.user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route index element={<AdminStats />} />
          <Route path="dashboard" element={<AdminStats />} />
          <Route path="addcategory" element={<CategoryDetails />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="sellerdetails" element={<VendorReport />} />
          <Route path="returns" element={<AdminReturns />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={authState.isAuthenticated} user={authState.user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="search" element={<SearchProducts />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<BuyNowPage />} />
          <Route path="buy-now/:productId" element={<BuyNowPage />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;