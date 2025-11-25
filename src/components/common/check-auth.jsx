import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // Public routes that don't require authentication
  const publicRoutes = [
    "/shop/home",
    "/shop/listing",
    "/shop/product/",
    "/shop/search",
  ];

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // Root path redirection
  if (location.pathname === "/") {
    if (!isAuthenticated) return <Navigate to="/shop/home" />;
    if (user?.is_admin) return <Navigate to="/admin/dashboard" />;
    return <Navigate to="/shop/home" />;
  }

  // Allow public routes for unauthenticated users
  if (!isAuthenticated && isPublicRoute) {
    return <>{children}</>;
  }

  // Redirect unauthenticated users to login for protected routes
  if (
    !isAuthenticated &&
    !isPublicRoute &&
    !location.pathname.includes("/auth")
  ) {
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  // Redirect authenticated users away from auth pages
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.is_admin) return <Navigate to="/admin/dashboard" />;
    return <Navigate to="/shop/home" />;
  }

  // Restrict non-admin users from admin routes
  if (isAuthenticated && user?.is_admin !== true && location.pathname.includes("/admin")) {
    return <Navigate to="/unauth-page" />;
  }

  // Restrict admin users from shop routes (optional, adjust as needed)
  if (
    isAuthenticated &&
    user?.is_admin &&
    location.pathname.includes("/shop") &&
    !isPublicRoute
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;