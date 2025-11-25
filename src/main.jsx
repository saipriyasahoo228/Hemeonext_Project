import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./store/store.js";
import { Toaster } from "./components/ui/toaster.jsx";
import { CurrencyProvider } from "./context/currency-context";
import { AuthProvider } from "./context/auth-context";
import { CartProvider } from "./context/cart-context";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* <Provider store={store}> */}
    <AuthProvider>
      <CurrencyProvider>
      <CartProvider>
          <App />
          <Toaster />
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
      <Toaster />
    {/* </Provider> */}
  </BrowserRouter>
);