// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { AlertCircle, CheckCircle2, MapPin, Plus, ShoppingCart, Minus, PlusCircle, X, Pencil, Loader2 } from "lucide-react";
// import { Button } from "../../components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
// import { Separator } from "../../components/ui/separator";
// import { useCurrency } from "../../context/currency-context";
// import { useAuth } from "../../context/auth-context";
// import { useCountryCode } from "../../hooks/useCountryCode";
// import { fetchProductById, createAddress, fetchAddresses, updateAddress, fetchCart } from "../../api/productApi";
// import { createOrder, verifyPayment } from "../../api/userApi";
// import { useToast } from "../../components/ui/use-toast";
// // Shiprocket API function to fetch shipping rates based on pincode
// const getShiprocketToken = () => {
//   return localStorage.getItem("shiprocket_token") || import.meta.env.VITE_SHIPROCKET_API_TOKEN;
// };
// const setShiprocketToken = (token) => {
//   localStorage.setItem("shiprocket_token", token);
// };
// const refreshShiprocketToken = async () => {
//   try {
//     const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email: import.meta.env.VITE_SHIPROCKET_EMAIL,
//         password: import.meta.env.VITE_SHIPROCKET_PASSWORD,
//       }),
//     });
//     const data = await res.json();
//     if (data.token) {
//       setShiprocketToken(data.token);
//       return data.token;
//     }
//     throw new Error("Failed to refresh Shiprocket token");
//   } catch (err) {
//     console.error("Shiprocket token refresh error:", err);
//     return null;
//   }
// };
// const fetchShippingRates = async (pincode, weight, orderValue, retry=false) => {
//   try {
//     const params = new URLSearchParams({
//       // pickup_postcode: "751003", // Replace with warehouse pincode
//       pickup_postcode: import.meta.env.VITE_PICKUP_PINCODE, // Replace with warehouse pincode
//       delivery_postcode: pincode,
//       weight: weight.toString(), // In kg
//       cod: "0",
//       // Optional parameters:
//       // order_value: orderValue.toString(),
//       // length: "15", // In cm
//       // breadth: "10", // In cm
//       // height: "5", // In cm
//       // declared_value: orderValue.toString(),
//       // mode: "Surface", // or "Air"
//       // is_return: "0", // 1 for return orders
//       // couriers_type: "1", // For documents only
//       // only_local: "1", // For hyperlocal couriers
//       // qc_check: "1", // For QC-enabled couriers (requires is_return: 1)
//     });
//     const token = getShiprocketToken();
//     const response = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${params}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//     });
//     console.log("SHIPROCKET API: ",token)
//     console.log("PICKUP PINCODE: ",import.meta.env.VITE_PICKUP_PINCODE)
//     if (response.status === 401 && !retry) {
//       // Token expired, refresh and retry once
//       const newToken = await refreshShiprocketToken();
//       console.log("New Shiprocket token:", newToken);
//       if (newToken) {
//         return fetchShippingRates(pincode, weight, orderValue, true);
//       }
//     }
//     if (!response.ok) {
//       console.error(`Shiprocket API error: ${response.status} ${response.statusText}`);
//       const errorData = await response.json().catch(() => ({}));
//       console.error("Error details:", errorData);
//       return [];
//     }

//     const data = await response.json();
//     console.log("Shiprocket response:", data); // For debugging
//     return data?.data?.available_courier_companies || [];
//   } catch (error) {
//     console.error("Shiprocket API error:", error);
//     return [];
//   }
// };

// // Address Component for adding/editing shipping addresses
// const AddressComponent = ({ onSave, initialData, onCancel }) => {
//   const { countries } = useCountryCode();
//   const [address, setAddress] = useState({
//     address_type: initialData?.address_type || "Home",
//     full_name: initialData?.full_name || "",
//     mobile_number: initialData?.mobile_number || "",
//     address_line_1: initialData?.address_line_1 || "",
//     address_line_2: initialData?.address_line_2 || "",
//     city: initialData?.city || "",
//     state: initialData?.state || "",
//     area_zip_code: initialData?.area_zip_code || "",
//     country: initialData?.country || "India",
//     is_default: initialData?.is_default || false,
//   });
//   const [errors, setErrors] = useState({});

//   const toTitleCase = (str) => {
//     return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
//   };

//   const getPhonePrefix = (country) => {
//     const countryData = countries.find((c) => c.name === country);
//     return countryData ? `+${countryData.phone}` : "+91";
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const requiredFields = ["full_name", "mobile_number", "address_line_1", "city", "state", "area_zip_code", "country"];
//     requiredFields.forEach((field) => {
//       if (!address[field].trim()) {
//         newErrors[field] = `${toTitleCase(field.replace(/_/g, " "))} is required`;
//       }
//     });
//     if (address.mobile_number.length > 13) {
//       newErrors.mobile_number = "Mobile Number cannot exceed 13 digits";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (field, value) => {
//     setAddress((prev) => ({ ...prev, [field]: value }));
//     setErrors((prev) => ({ ...prev, [field]: "" }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       const fullPhone = `${getPhonePrefix(address.country)}${address.mobile_number}`;
//       onSave({ ...address, mobile_number: fullPhone, address_type: address.address_type.trim() || "Home" });
//     }
//   };
  

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <Label htmlFor="address_type" className="text-gray-700 dark:text-gray-300">Address Type</Label>
//         <Input
//           id="address_type"
//           value={address.address_type}
//           onChange={(e) => handleChange("address_type", e.target.value)}
//           placeholder="e.g., Home, Work, Other"
//           className={errors.address_type ? "border-red-500" : ""}
//         />
//         {errors.address_type && <p className="text-red-500 text-xs mt-1">{errors.address_type}</p>}
//       </div>
//       <div>
//         <Label htmlFor="full_name" className="text-gray-700 dark:text-gray-300">Full Name<span className="text-red-500">*</span></Label>
//         <Input
//           id="full_name"
//           value={address.full_name}
//           onChange={(e) => handleChange("full_name", e.target.value)}
//           className={errors.full_name ? "border-red-500" : ""}
//         />
//         {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
//       </div>
//       <div>
//         <Label htmlFor="mobile_number" className="text-gray-700 dark:text-gray-300">Mobile Number<span className="text-red-500">*</span></Label>
//         <div className="flex">
//           <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
//             {getPhonePrefix(address.country)}
//           </span>
//           <Input
//             id="mobile_number"
//             value={address.mobile_number}
//             onChange={(e) => {
//               const value = e.target.value.replace(/\D/g, "");
//               if (value.length <= 13) handleChange("mobile_number", value);
//             }}
//             className={`rounded-l-none ${errors.mobile_number ? "border-red-500" : ""}`}
//             maxLength="13"
//           />
//         </div>
//         {errors.mobile_number && <p className="text-red-500 text-xs mt-1">{errors.mobile_number}</p>}
//       </div>
//       <div>
//         <Label htmlFor="country" className="text-gray-700 dark:text-gray-300">Country<span className="text-red-500">*</span></Label>
//         <Select value={address.country} onValueChange={(value) => handleChange("country", value)}>
//           <SelectTrigger className={errors.country ? "border-red-500" : ""}>
//             <SelectValue placeholder="Select country" />
//           </SelectTrigger>
//           <SelectContent className="max-h-40">
//             {countries.map((country) => (
//               <SelectItem key={country.code} value={country.name}>{country.name}</SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
//       </div>
//       <div>
//         <Label htmlFor="address_line_1" className="text-gray-700 dark:text-gray-300">Address Line 1<span className="text-red-500">*</span></Label>
//         <Input
//           id="address_line_1"
//           value={address.address_line_1}
//           onChange={(e) => handleChange("address_line_1", e.target.value)}
//           className={errors.address_line_1 ? "border-red-500" : ""}
//         />
//         {errors.address_line_1 && <p className="text-red-500 text-xs mt-1">{errors.address_line_1}</p>}
//       </div>
//       <div>
//         <Label htmlFor="address_line_2" className="text-gray-700 dark:text-gray-300">Address Line 2 (Optional)</Label>
//         <Input
//           id="address_line_2"
//           value={address.address_line_2}
//           onChange={(e) => handleChange("address_line_2", e.target.value)}
//         />
//       </div>
//       <div>
//         <Label htmlFor="city" className="text-gray-700 dark:text-gray-300">City<span className="text-red-500">*</span></Label>
//         <Input
//           id="city"
//           value={address.city}
//           onChange={(e) => handleChange("city", e.target.value)}
//           className={errors.city ? "border-red-500" : ""}
//         />
//         {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
//       </div>
//       <div>
//         <Label htmlFor="state" className="text-gray-700 dark:text-gray-300">State<span className="text-red-500">*</span></Label>
//         <Input
//           id="state"
//           value={address.state}
//           onChange={(e) => handleChange("state", e.target.value)}
//           className={errors.state ? "border-red-500" : ""}
//         />
//         {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
//       </div>
//       <div>
//         <Label htmlFor="area_zip_code" className="text-gray-700 dark:text-gray-300">Zip Code<span className="text-red-500">*</span></Label>
//         <Input
//           id="area_zip_code"
//           value={address.area_zip_code}
//           onChange={(e) => handleChange("area_zip_code", e.target.value)}
//           className={errors.area_zip_code ? "border-red-500" : ""}
//         />
//         {errors.area_zip_code && <p className="text-red-500 text-xs mt-1">{errors.area_zip_code}</p>}
//       </div>
//       <div className="flex gap-2">
//         <Button type="submit" className="w-full">Save Address</Button>
//         <Button type="button" variant="outline" className="w-full" onClick={onCancel}>Cancel</Button>
//       </div>
//     </form>
//   );
// };

// export default function BuyNowPage() {
//   const { selectedCurrency, convertPrice } = useCurrency();
//   const { user, isAuthenticated, loading: authLoading } = useAuth();
//   const { countries } = useCountryCode();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const productId = location.pathname.split("/")[3];
//   const isCartCheckout = location.pathname.includes("/checkout");
//   const initialQuantity = location.state?.quantity || 1;

//   const [quantity, setQuantity] = useState(initialQuantity);
//   const [selectedAddressId, setSelectedAddressId] = useState("");
//   const [addresses, setAddresses] = useState([]);
//   const [newAddress, setNewAddress] = useState(null);
//   const [isAddingAddress, setIsAddingAddress] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState(null);
//   const [isEditingPhone, setIsEditingPhone] = useState(false);
//   const [editedPhone, setEditedPhone] = useState("");
//   const [product, setProduct] = useState(null);
//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [orderId, setOrderId] = useState(null);
//   const [isCheckingOut, setIsCheckingOut] = useState(false);
//   const [shippingRates, setShippingRates] = useState([]);
//   const [selectedShippingRate, setSelectedShippingRate] = useState(null);
//   const [isPincodeValid, setIsPincodeValid] = useState(true);
//   const [pincodeError, setPincodeError] = useState("");
//   const { toast } = useToast();
//   const hasOverQuantityItems = isCartCheckout
//   ? cart?.items?.some(item => item.quantity > item.product.stock)
//   : quantity > (product?.stock || 0);
//   // Calculate total price (moved before useEffect to avoid initialization error)
//   const calculateTotal = () => {
//     const baseTotal = isCartCheckout
//       ? cart?.items?.reduce((total, item) => {
//           const price = parseFloat(item.product.sale_price || item.product.actual_price);
//           return total + price * item.quantity;
//         }, 0) || 0
//       : product
//       ? parseFloat(product.sale_price || product.actual_price) * quantity
//       : 0;
//     const shippingCost = selectedShippingRate ? selectedShippingRate.freight_charge : 0;
//     return baseTotal + shippingCost;
//   };

//   // Initialize totalPriceINR and related variables before useEffect
//   const totalPriceINR = calculateTotal();
//   const totalPriceConverted = convertPrice(totalPriceINR, true);
//   const amountForRazorpay = Math.round(totalPriceConverted * 100);

//   useEffect(() => {
//     if (authLoading) return;
//     if (!isAuthenticated) {
//       navigate("/auth/login");
//       return;
//     }

//     const loadData = async () => {
//       try {
//         setLoading(true);
//         const addressData = await fetchAddresses(user.customer_id);
//         setAddresses(addressData);
//         const defaultAddress = addressData.find((addr) => addr.is_default);
//         setSelectedAddressId(defaultAddress?.id || "");

//         if (isCartCheckout) {
//           const cartData = await fetchCart();
//           setCart(cartData[0] || { items: [] });
//         } else if (productId) {
//           const productData = await fetchProductById(productId);
//           setProduct(productData);
//           setNewAddress({
//             address_type: "Home",
//             full_name: productData.customer_name || user.username || "",
//             mobile_number: productData.customer_number || "",
//             address_line_1: "",
//             address_line_2: "",
//             city: "",
//             state: "",
//             area_zip_code: "",
//             country: "India",
//             is_default: false,
//           });
//         }
//       } catch (error) {
//         console.error("Error loading data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [user, isAuthenticated, authLoading, productId, isCartCheckout, navigate]);

//   // Check pincode availability and fetch shipping rates
//   useEffect(() => {
//     const checkPincodeAvailability = async () => {
//       if (selectedAddressId) {
//         const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);
//         if (!selectedAddress?.area_zip_code || !/^\d{6}$/.test(selectedAddress.area_zip_code)) {
//           setShippingRates([]);
//           setSelectedShippingRate(null);
//           setIsPincodeValid(false);
//           setPincodeError("Invalid or missing pincode.");
//           return;
//         }

//         const weight = isCartCheckout
//           ? cart?.items?.reduce((total, item) => total + (item.product.weight || 0.5) * item.quantity, 0) || 0.5
//           : (product?.weight || 0.5) * quantity;
//         console.log("Checking pincode:", selectedAddress.area_zip_code, "Weight:", weight); // For debugging
//         const rates = await fetchShippingRates(selectedAddress.area_zip_code, weight, totalPriceINR);

//         if (rates.length > 0) {
//           setShippingRates(rates);
//           setSelectedShippingRate(rates[0]); // Default to first available rate
//           setIsPincodeValid(true);
//           setPincodeError("");
//         } else {
//           setShippingRates([]);
//           setSelectedShippingRate(null);
//           setIsPincodeValid(false);
//           setPincodeError("Delivery not available for this pincode. Please select a different address.");
//         }
//       }
//     };
//     checkPincodeAvailability();
//   }, [selectedAddressId, cart, product, quantity, totalPriceINR, addresses]);

//   // Early returns for loading, authentication, and empty states
//   if (authLoading || loading) return <div className="text-center py-8">Loading...</div>;
//   if (!isAuthenticated) return null;
//   if (!isCartCheckout && !product) return <div className="text-center py-8">Product not found.</div>;
//   if (isCartCheckout && (!cart || !cart.items.length)) return <div className="text-center py-8">Cart is empty.</div>;

//   const handleQuantityChange = (change) => {
//     if (!isCartCheckout) {
//       const newQuantity = quantity + change;
//       if (newQuantity >= 1 && newQuantity <= product.stock) {
//         setQuantity(newQuantity);
//       }
//     }
//   };

//   const handleAddAddress = async (addressData) => {
//     try {
//       const addedAddress = await createAddress({ ...addressData, customer_id: user.customer_id });
//       setAddresses([...addresses, addedAddress]);
//       setSelectedAddressId(addedAddress.id);
//       setIsAddingAddress(false);
//       setNewAddress(null);
//     } catch (error) {
//       console.error("Failed to add address:", error);
//       alert("Failed to Add Address");
//     }
//   };

//   const getPhonePrefix = (country) => {
//     const countryData = countries.find((c) => c.name === country);
//     return countryData ? `+${countryData.phone}` : "+91";
//   };

//   const handleCheckout = async () => {
//     if (!selectedAddressId) {
//       alert("Please Select or Add a Shipping Address.");
//       return;
//     }
//     if (!isPincodeValid || !selectedShippingRate) {
//       alert("Please select a valid shipping address with available delivery options.");
//       return;
//     }
// setPaymentStatus(null);
//     setIsCheckingOut(true);

//     const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);
//     let orderData;

//     const supportedCurrencies = ["USD", "GBP", "EUR", "CAD", "AUD", "SGD", "INR"];
//     const orderCurrency = supportedCurrencies.includes(selectedCurrency) ? selectedCurrency : "INR";

//     if (isCartCheckout) {
//       orderData = {
//         customer: user.id,
//         total_amount: orderCurrency === "INR" ? totalPriceINR.toFixed(2) : totalPriceConverted.toFixed(2),
//         currency: orderCurrency,
//         shipping_address: selectedAddress,
//         payment_method: "razorpay",
//         shipping_cost: orderCurrency === "INR" ? selectedShippingRate.freight_charge.toFixed(2): convertPrice(selectedShippingRate.freight_charge,true).toFixed(2),
//         shipping_cost_inr: selectedShippingRate.freight_charge.toFixed(2),
//         shipping_method: selectedShippingRate.courier_name,
//         items: cart.items.map((item) => ({
//           product_id: item.product.id,
//           quantity: item.quantity,
//           price: orderCurrency === "INR"
//             ? parseFloat(item.product.sale_price || item.product.actual_price).toFixed(2)
//             : convertPrice(parseFloat(item.product.sale_price || item.product.actual_price), true).toFixed(2),
//         })),
//       };
//     } else {
//       orderData = {
//         customer: user.id,
//         total_amount: orderCurrency === "INR" ? totalPriceINR.toFixed(2) : totalPriceConverted.toFixed(2),
//         currency: orderCurrency,
//         shipping_address: selectedAddress,
//         payment_method: "razorpay",
//         shipping_cost: orderCurrency === "INR" ? selectedShippingRate.freight_charge.toFixed(2) : convertPrice(selectedShippingRate.freight_charge,true).toFixed(2),
//         shipping_cost_inr: selectedShippingRate.freight_charge.toFixed(2),
//         shipping_method: selectedShippingRate.courier_name,
//         items: [
//           {
//             product_id: product.id,
//             quantity: quantity,
//             price: orderCurrency === "INR"
//               ? parseFloat(product.sale_price || product.actual_price).toFixed(2)
//               : convertPrice(parseFloat((product.sale_price || product.actual_price)),true).toFixed(2),
//           },
//         ],
//       };
//     }

//     try {
//       console.log("Order data:", orderData);
//       const data = await createOrder(orderData);
//       const razorpayOrderId = data.order_id;
//       setOrderId(razorpayOrderId);

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY,
//         amount: amountForRazorpay,
//         currency: orderCurrency,
//         name: "Yourrkart",
//         description: isCartCheckout ? "Cart Checkout Payment" : "Buy Now Payment",
//         order_id: razorpayOrderId,
//         handler: async (response) => {
//           setIsCheckingOut(true); // Show loader while verifying
//           setPaymentStatus(null); // Added to reset payment status before verification
//           try {
//             const paymentData = {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//             };
//             await verifyPayment(paymentData);
//             setPaymentStatus("success");
//           } catch (error) {
//             console.error("Payment verification error:", error);
//             setPaymentStatus("error");
//             let errorMsg = "There was a problem verifying your payment. Please contact support if the amount was deducted.";
//         if (error?.error) {
//           errorMsg = error.error;
//           } else if (error?.message) {
//             errorMsg = error.message;}
//             toast({
//             title: "Payment Verification Failed",
//             description: errorMsg,
//             variant: "destructive",
//       });
//             // alert("Payment Verification Failed: " + error.message);
//           } finally {
//             setIsCheckingOut(false);
//           }
//         },
//         prefill: {
//           name: selectedAddress.full_name,
//           contact: selectedAddress.mobile_number.replace(/^\+\d{1,3}\s/, ""),
//         },
//         theme: { color: "#16A085" },
//         notes: { address_id: selectedAddressId },
//         modal: {
//           ondismiss: () => {
//           setIsCheckingOut(false);
//           setPaymentStatus(null);
//         },
//   },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.on("payment.failed", (response) => {
//         setPaymentStatus("error");
//         setIsCheckingOut(false);
//         console.error("Payment failed:", response.error);
//         // alert("Payment Failed: " + response.error.description);
//         toast({
//         title: "Payment Failed",
//         description: response.error || "Your payment could not be processed. Please try again or use a different payment method.",
//         variant: "destructive",
//   });
//       });
//       if (!window.Razorpay) {
//         console.error("Razorpay script not loaded");
//         // alert("Payment system is not available. Please try again later.");
//         toast({
//         title: "Payment System Unavailable",
//         description: "Payment system is not available. Please try again later.",
//         variant: "destructive",
//   });
//         setIsCheckingOut(false);
//         return;
//       }
//       razorpay.open();
//     } catch (error) {
//       console.error("Checkout error:", error);
//       setPaymentStatus("error");
//       setIsCheckingOut(false);
//       toast({
//       title: "Payment Could Not Be Initiated",
//       description: "There was a problem starting your payment. Please try again or contact support if the issue persists.",
//       variant: "destructive",
//   });
//       // alert("Failed to Initiate Payment: " + (error.message || "An unknown error occurred"));
//     }
//   };

//   const handleEditPhone = () => {
//     const selectedAddr = addresses.find((addr) => addr.id === selectedAddressId);
//     setEditedPhone(selectedAddr.mobile_number.replace(getPhonePrefix(selectedAddr.country), ""));
//     setIsEditingPhone(true);
//   };

//   const handleSavePhone = async () => {
//     const selectedAddr = addresses.find((addr) => addr.id === selectedAddressId);
//     const updatedPhone = `${getPhonePrefix(selectedAddr.country)}${editedPhone}`;
//     try {
//       const updatedAddress = await updateAddress(user.customer_id, selectedAddressId, { mobile_number: updatedPhone });
//       setAddresses(addresses.map((addr) => (addr.id === selectedAddressId ? updatedAddress : addr)));
//       setIsEditingPhone(false);
//     } catch (error) {
//       console.error("Failed to update phone:", error);
//       alert("Failed to Update Phone Number");
//     }
//   };

//   const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);

//   return (
//     <div className="container mx-auto px-4 pt-20 pb-8 bg-background">
//       {isCheckingOut && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
//             <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
//             <p className="text-center">Processing Payment...</p>
//           </div>
//         </div>
//       )}
//       {paymentStatus === "success" ? (
//         <div className="text-center py-8">
//           <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
//           <h2 className="text-2xl font-semibold">Order Placed Successfully!</h2>
//           <p className="text-muted-foreground mt-2">Order ID: {orderId}. Thank you for your purchase.</p>
//           <Button variant="outline" className="mt-4" onClick={() => navigate("/shop/account?tab=orders")}>
//             View Orders
//           </Button>
//         </div>
//       ) : (
//         <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
//           <div className="space-y-6">
//             <Card className="bg-transparent shadow-md border-none">
//               <CardHeader>
//                 <CardTitle>{isCartCheckout ? "Cart Items" : "Product Details"}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {isCartCheckout ? (
//                   cart.items.map((item) => (
//                     <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-b-0">
//                       <img src={item.product.images[0]?.image} alt={item.product.title} className="w-16 h-16 object-cover rounded-md" />
//                       <div className="flex-1">
//                         <h3 className="font-medium">{item.product.title}</h3>
//                         <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
//                       </div>

//                       {item.quantity > item.product.stock && (
//             <p className="text-red-600 text-xs font-semibold mt-1">
//               Selected quantity exceeds available stock ({item.product.stock}). Please remove this item and add it again with the correct quantity to proceed.
//             </p>
//           )}
//                       <p className="font-semibold">{convertPrice((item.product.sale_price || item.product.actual_price) * item.quantity)}</p>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="flex items-center gap-4 py-4">
//                     <img src={product.images[0].image} alt={product.title} className="w-16 h-16 object-cover rounded-md" />
//                     <div className="flex-1">
//                       <h3 className="font-medium">{product.title}</h3>
//                       <div className="flex items-center gap-2 mt-1">
//                         <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
//                           <Minus className="h-4 w-4" />
//                         </Button>
//                         <span>{quantity}</span>
//                         <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>
//                           <PlusCircle className="h-4 w-4" />
//                         </Button>
//                         <span className="text-sm text-muted-foreground ml-2">(Stock: {product.stock})</span>
//                       </div>
//                     </div>
//                     {quantity > product.stock && (
//           <p className="text-red-600 text-xs font-semibold mt-1">
//             Selected quantity exceeds available stock ({product.stock}). Please decrease the quantity to proceed.
//           </p>
//         )}
//                     <p className="font-semibold">{convertPrice(totalPriceINR)}</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             <Card className="bg-transparent shadow-md border-none">
//               <CardHeader>
//                 <CardTitle>Shipping Address</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <Select value={selectedAddressId} onValueChange={setSelectedAddressId}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Select an address" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {addresses.map((addr) => (
//                       <SelectItem key={addr.id} value={addr.id}>
//                         {addr.address_line_1}, {addr.city}, {addr.state} {addr.area_zip_code}, {addr.country} ({addr.address_type})
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {selectedAddress && (
//                   <div className="text-sm text-muted-foreground">
//                     <p><strong>Name:</strong> {selectedAddress.full_name}</p>
//                     <div className="flex items-center gap-2">
//                       <p>
//                         <strong>Phone:</strong>{" "}
//                         {isEditingPhone ? (
//                           <div className="flex gap-2">
//                             <div className="flex">
//                               <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
//                                 {getPhonePrefix(selectedAddress.country)}
//                               </span>
//                               <Input
//                                 value={editedPhone}
//                                 onChange={(e) => setEditedPhone(e.target.value)}
//                                 className="w-40 rounded-l-none"
//                               />
//                             </div>
//                             <Button size="sm" onClick={handleSavePhone}>Save</Button>
//                             <Button size="sm" variant="outline" onClick={() => setIsEditingPhone(false)}>Cancel</Button>
//                           </div>
//                         ) : (
//                           <>
//                             {selectedAddress.mobile_number}
//                             <Button variant="ghost" size="sm" onClick={handleEditPhone} className="ml-2">
//                               <Pencil className="h-4 w-4" />
//                             </Button>
//                           </>
//                         )}
//                       </p>
//                     </div>
//                     <p><strong>Address:</strong> {selectedAddress.address_line_1}{selectedAddress.address_line_2 && `, ${selectedAddress.address_line_2}`}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.area_zip_code}, {selectedAddress.country}</p>
//                   </div>
//                 )}
//                 <Button variant="outline" className="w-full" onClick={() => setIsAddingAddress(!isAddingAddress)}>
//                   {isAddingAddress ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
//                   {isAddingAddress ? "Cancel" : "Add New Address"}
//                 </Button>
//                 {isAddingAddress && (
//                   <AddressComponent
//                     onSave={handleAddAddress}
//                     initialData={newAddress}
//                     onCancel={() => setIsAddingAddress(false)}
//                   />
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           <Card className="bg-transparent shadow-md border-none">
//             <CardHeader>
//               <CardTitle>Order Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span>Subtotal ({isCartCheckout ? cart.items.length : quantity} item{isCartCheckout ? cart.items.length > 1 : quantity > 1 ? "s" : ""})</span>
//                   <span>{convertPrice(isCartCheckout 
//                     ? cart.items.reduce((total, item) => total + parseFloat(item.product.sale_price || item.product.actual_price) * item.quantity, 0)
//                     : parseFloat(product.sale_price || product.actual_price) * quantity)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Shipping</span>
//                   <span>
//                     {isPincodeValid && selectedShippingRate ? (
//                       convertPrice(selectedShippingRate.freight_charge)
//                     ) : (
//                       <span className="text-destructive">Not Deliverable</span>
//                     )}
//                   </span>
//                 </div>
//                 {!isPincodeValid && (
//                   <p className="text-destructive text-sm flex items-center gap-1">
//                     <AlertCircle className="h-4 w-4" />
//                     {pincodeError}
//                   </p>
//                 )}
//                 {isPincodeValid && shippingRates.length > 0 && (
//                   <div>
//                     <Label>Shipping Method</Label>
//                     <Select
//                       value={selectedShippingRate?.courier_company_id}
//                       onValueChange={(value) => {
//                         const rate = shippingRates.find((r) => r.courier_company_id === value);
//                         setSelectedShippingRate(rate);
//                       }}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select shipping method" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {shippingRates.map((rate) => (
//                           <SelectItem key={rate.courier_company_id} value={rate.courier_company_id}>
//                             {rate.courier_name} - {convertPrice(rate.freight_charge)} ({rate.etd})
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 )}
//                 <Separator />
//                 <div className="flex justify-between font-semibold">
//                   <span>Total</span>
//                   <span>{convertPrice(totalPriceINR)}</span>
//                 </div>
//               </div>
//               <Button
//                 className="w-full"
//                 onClick={handleCheckout}
//                 disabled={!selectedAddressId || !isPincodeValid || !selectedShippingRate || isCheckingOut || hasOverQuantityItems}
//               >
//                 {isCheckingOut ? (
//                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                 ) : (
//                   <ShoppingCart className="mr-2 h-4 w-4" />
//                 )}
//                 Proceed to Payment
//               </Button>
//               {hasOverQuantityItems && (
//   <p className="text-red-600 text-sm mt-2">
//     Please ensure all item quantities do not exceed available stock to proceed with payment.
//   </p>
// )}
//               {paymentStatus === "error" && (
//                 <p className="text-destructive text-sm flex items-center gap-1">
//                   <AlertCircle className="h-4 w-4" />
//                   Payment Failed. Please try again.
//                 </p>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// }







import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, MapPin, Plus, ShoppingCart, Minus, PlusCircle, X, Pencil, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { useCurrency } from "../../context/currency-context";
import { useAuth } from "../../context/auth-context";
import { useCountryCode } from "../../hooks/useCountryCode";
import { fetchProductById, createAddress, fetchAddresses, updateAddress, fetchCart } from "../../api/productApi";
import { createOrder, verifyPayment } from "../../api/userApi";
import { useToast } from "../../components/ui/use-toast";

// Shiprocket API function to fetch shipping rates based on pincode
const getShiprocketToken = () => {
  return localStorage.getItem("shiprocket_token") || import.meta.env.VITE_SHIPROCKET_API_TOKEN;
};

const setShiprocketToken = (token) => {
  localStorage.setItem("shiprocket_token", token);
};

const refreshShiprocketToken = async () => {
  try {
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: import.meta.env.VITE_SHIPROCKET_EMAIL,
        password: import.meta.env.VITE_SHIPROCKET_PASSWORD,
      }),
    });
    const data = await res.json();
    if (data.token) {
      setShiprocketToken(data.token);
      return data.token;
    }
    throw new Error("Failed to refresh Shiprocket token");
  } catch (err) {
    console.error("Shiprocket token refresh error:", err);
    return null;
  }
};

const fetchShippingRates = async (pincode, weight, orderValue, retry=false) => {
  try {
    const params = new URLSearchParams({
      pickup_postcode: import.meta.env.VITE_PICKUP_PINCODE,
      delivery_postcode: pincode,
      weight: weight.toString(),
      cod: "0",
    });
    const token = getShiprocketToken();
    const response = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });

    if (response.status === 401 && !retry) {
      const newToken = await refreshShiprocketToken();
      if (newToken) {
        return fetchShippingRates(pincode, weight, orderValue, true);
      }
    }
    if (!response.ok) {
      console.error(`Shiprocket API error: ${response.status} ${response.statusText}`);
      const errorData = await response.json().catch(() => ({}));
      console.error("Error details:", errorData);
      return [];
    }

    const data = await response.json();
    return data?.data?.available_courier_companies || [];
  } catch (error) {
    console.error("Shiprocket API error:", error);
    return [];
  }
};

// Address Component for adding/editing shipping addresses
const AddressComponent = ({ onSave, initialData, onCancel }) => {
  const { countries } = useCountryCode();
  const [address, setAddress] = useState({
    address_type: initialData?.address_type || "Home",
    full_name: initialData?.full_name || "",
    mobile_number: initialData?.mobile_number || "",
    address_line_1: initialData?.address_line_1 || "",
    address_line_2: initialData?.address_line_2 || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    area_zip_code: initialData?.area_zip_code || "",
    country: initialData?.country || "India",
    is_default: initialData?.is_default || false,
  });
  const [errors, setErrors] = useState({});

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const getPhonePrefix = (country) => {
    const countryData = countries.find((c) => c.name === country);
    return countryData ? `+${countryData.phone}` : "+91";
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["full_name", "mobile_number", "address_line_1", "city", "state", "area_zip_code", "country"];
    requiredFields.forEach((field) => {
      if (!address[field].trim()) {
        newErrors[field] = `${toTitleCase(field.replace(/_/g, " "))} is required`;
      }
    });
    if (address.mobile_number.length > 13) {
      newErrors.mobile_number = "Mobile Number cannot exceed 13 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const fullPhone = `${getPhonePrefix(address.country)}${address.mobile_number}`;
      onSave({ ...address, mobile_number: fullPhone, address_type: address.address_type.trim() || "Home" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="address_type" className="text-[#2D5016] font-medium">Address Type</Label>
        <Input
          id="address_type"
          value={address.address_type}
          onChange={(e) => handleChange("address_type", e.target.value)}
          placeholder="e.g., Home, Work, Other"
          className={`border-[#C9F0DD] focus:border-[#FF6B9D] ${errors.address_type ? "border-red-500" : ""}`}
        />
        {errors.address_type && <p className="text-red-500 text-xs mt-1">{errors.address_type}</p>}
      </div>
      <div>
        <Label htmlFor="full_name" className="text-[#2D5016] font-medium">Full Name<span className="text-red-500">*</span></Label>
        <Input
          id="full_name"
          value={address.full_name}
          onChange={(e) => handleChange("full_name", e.target.value)}
          className={`border-[#C9F0DD] focus:border-[#FF6B9D] ${errors.full_name ? "border-red-500" : ""}`}
        />
        {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
      </div>
      <div>
        <Label htmlFor="mobile_number" className="text-[#2D5016] font-medium">Mobile Number<span className="text-red-500">*</span></Label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-[#C9F0DD] bg-[#C9F0DD]/20 text-[#2D5016] text-sm">
            {getPhonePrefix(address.country)}
          </span>
          <Input
            id="mobile_number"
            value={address.mobile_number}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 13) handleChange("mobile_number", value);
            }}
            className={`rounded-l-none border-[#C9F0DD] focus:border-[#FF6B9D] ${errors.mobile_number ? "border-red-500" : ""}`}
            maxLength="13"
          />
        </div>
        {errors.mobile_number && <p className="text-red-500 text-xs mt-1">{errors.mobile_number}</p>}
      </div>
      <div>
        <Label htmlFor="country" className="text-[#2D5016] font-medium">Country<span className="text-red-500">*</span></Label>
        <Select value={address.country} onValueChange={(value) => handleChange("country", value)}>
          <SelectTrigger className={`border-[#C9F0DD] focus:border-[#FF6B9D] ${errors.country ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent className="max-h-40 bg-gradient-to-b from-[#F0FFF8] to-[#FFF0F5] border-[#C9F0DD]">
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.name} className="text-[#2D5016] hover:bg-[#C9F0DD]/20">
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
      </div>
      <div>
        <Label htmlFor="address_line_1" className="text-[#2D5016] font-medium">Address Line 1<span className="text-red-500">*</span></Label>
        <Input
          id="address_line_1"
          value={address.address_line_1}
          onChange={(e) => handleChange("address_line_1", e.target.value)}
          className={`border-[#C9F0DD] focus:border-[#FF6B9D] ${errors.address_line_1 ? "border-red-500" : ""}`}
        />
        {errors.address_line_1 && <p className="text-red-500 text-xs mt-1">{errors.address_line_1}</p>}
      </div>
      <div>
        <Label htmlFor="address_line_2" className="text-[#2D5016] font-medium">Address Line 2 (Optional)</Label>
        <Input
          id="address_line_2"
          value={address.address_line_2}
          onChange={(e) => handleChange("address_line_2", e.target.value)}
          className="border-[#C9F0DD] focus:border-[#FF6B9D]"
        />
      </div>
      <div>
        <Label htmlFor="city" className="text-[#2D5016] font-medium">City<span className="text-red-500">*</span></Label>
        <Input
          id="city"
          value={address.city}
          onChange={(e) => handleChange("city", e.target.value)}
          className={`border-[#C9F0DD] focus:border-[#FF6B9D] ${errors.city ? "border-red-500" : ""}`}
        />
        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
      </div>
      <div>
        <Label htmlFor="state" className="text-[#2D5016] font-medium">State<span className="text-red-500">*</span></Label>
        <Input
          id="state"
          value={address.state}
          onChange={(e) => handleChange("state", e.target.value)}
          className={`border-[#C9F0DD] focus:border-[#FF6B9D] ${errors.state ? "border-red-500" : ""}`}
        />
        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
      </div>
      <div>
        <Label htmlFor="area_zip_code" className="text-[#2D5016] font-medium">Zip Code<span className="text-red-500">*</span></Label>
        <Input
          id="area_zip_code"
          value={address.area_zip_code}
          onChange={(e) => handleChange("area_zip_code", e.target.value)}
          className={`border-[#C9F0DD] focus:border-[#FF6B9D] ${errors.area_zip_code ? "border-red-500" : ""}`}
        />
        {errors.area_zip_code && <p className="text-red-500 text-xs mt-1">{errors.area_zip_code}</p>}
      </div>
      <div className="flex gap-2">
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#C9F0DD] to-[#FFD6E8] hover:from-[#B0E8CD] hover:to-[#F5C2D9] text-[#2D5016] font-bold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Save Address
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full border-[#C9F0DD] text-[#2D5016] hover:bg-[#C9F0DD]/20 font-bold"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default function BuyNowPage() {
  const { selectedCurrency, convertPrice } = useCurrency();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { countries } = useCountryCode();
  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.pathname.split("/")[3];
  const isCartCheckout = location.pathname.includes("/checkout");
  const initialQuantity = location.state?.quantity || 1;

  const [quantity, setQuantity] = useState(initialQuantity);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedPhone, setEditedPhone] = useState("");
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState(null);
  const [isPincodeValid, setIsPincodeValid] = useState(true);
  const [pincodeError, setPincodeError] = useState("");
  const { toast } = useToast();
  
  const hasOverQuantityItems = isCartCheckout
    ? cart?.items?.some(item => item.quantity > item.product.stock)
    : quantity > (product?.stock || 0);

  const calculateTotal = () => {
    const baseTotal = isCartCheckout
      ? cart?.items?.reduce((total, item) => {
          const price = parseFloat(item.product.sale_price || item.product.actual_price);
          return total + price * item.quantity;
        }, 0) || 0
      : product
      ? parseFloat(product.sale_price || product.actual_price) * quantity
      : 0;
    const shippingCost = selectedShippingRate ? selectedShippingRate.freight_charge : 0;
    return baseTotal + shippingCost;
  };

  const totalPriceINR = calculateTotal();
  const totalPriceConverted = convertPrice(totalPriceINR, true);
  const amountForRazorpay = Math.round(totalPriceConverted * 100);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const addressData = await fetchAddresses(user.customer_id);
        setAddresses(addressData);
        const defaultAddress = addressData.find((addr) => addr.is_default);
        setSelectedAddressId(defaultAddress?.id || "");

        if (isCartCheckout) {
          const cartData = await fetchCart();
          setCart(cartData[0] || { items: [] });
        } else if (productId) {
          const productData = await fetchProductById(productId);
          setProduct(productData);
          setNewAddress({
            address_type: "Home",
            full_name: productData.customer_name || user.username || "",
            mobile_number: productData.customer_number || "",
            address_line_1: "",
            address_line_2: "",
            city: "",
            state: "",
            area_zip_code: "",
            country: "India",
            is_default: false,
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, isAuthenticated, authLoading, productId, isCartCheckout, navigate]);

  useEffect(() => {
    const checkPincodeAvailability = async () => {
      if (selectedAddressId) {
        const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);
        if (!selectedAddress?.area_zip_code || !/^\d{6}$/.test(selectedAddress.area_zip_code)) {
          setShippingRates([]);
          setSelectedShippingRate(null);
          setIsPincodeValid(false);
          setPincodeError("Invalid or missing pincode.");
          return;
        }

        const weight = isCartCheckout
          ? cart?.items?.reduce((total, item) => total + (item.product.weight || 0.5) * item.quantity, 0) || 0.5
          : (product?.weight || 0.5) * quantity;
        
        const rates = await fetchShippingRates(selectedAddress.area_zip_code, weight, totalPriceINR);

        if (rates.length > 0) {
          setShippingRates(rates);
          setSelectedShippingRate(rates[0]);
          setIsPincodeValid(true);
          setPincodeError("");
        } else {
          setShippingRates([]);
          setSelectedShippingRate(null);
          setIsPincodeValid(false);
          setPincodeError("Delivery not available for this pincode. Please select a different address.");
        }
      }
    };
    checkPincodeAvailability();
  }, [selectedAddressId, cart, product, quantity, totalPriceINR, addresses]);

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0FFF8] via-[#FFF0F5] to-[#FFF9E6]">
      <Loader2 className="h-8 w-8 animate-spin text-[#2D5016]" />
    </div>
  );
  
  if (!isAuthenticated) return null;
  if (!isCartCheckout && !product) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0FFF8] via-[#FFF0F5] to-[#FFF9E6]">
      <p className="text-[#2D5016]">Product not found.</p>
    </div>
  );
  
  if (isCartCheckout && (!cart || !cart.items.length)) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0FFF8] via-[#FFF0F5] to-[#FFF9E6]">
      <p className="text-[#2D5016]">Cart is empty.</p>
    </div>
  );

  const handleQuantityChange = (change) => {
    if (!isCartCheckout) {
      const newQuantity = quantity + change;
      if (newQuantity >= 1 && newQuantity <= product.stock) {
        setQuantity(newQuantity);
      }
    }
  };

  const handleAddAddress = async (addressData) => {
    try {
      const addedAddress = await createAddress({ ...addressData, customer_id: user.customer_id });
      setAddresses([...addresses, addedAddress]);
      setSelectedAddressId(addedAddress.id);
      setIsAddingAddress(false);
      setNewAddress(null);
    } catch (error) {
      console.error("Failed to add address:", error);
      alert("Failed to Add Address");
    }
  };

  const getPhonePrefix = (country) => {
    const countryData = countries.find((c) => c.name === country);
    return countryData ? `+${countryData.phone}` : "+91";
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      alert("Please Select or Add a Shipping Address.");
      return;
    }
    if (!isPincodeValid || !selectedShippingRate) {
      alert("Please select a valid shipping address with available delivery options.");
      return;
    }

    setPaymentStatus(null);
    setIsCheckingOut(true);

    const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);
    let orderData;

    const supportedCurrencies = ["USD", "GBP", "EUR", "CAD", "AUD", "SGD", "INR"];
    const orderCurrency = supportedCurrencies.includes(selectedCurrency) ? selectedCurrency : "INR";

    if (isCartCheckout) {
      orderData = {
        customer: user.id,
        total_amount: orderCurrency === "INR" ? totalPriceINR.toFixed(2) : totalPriceConverted.toFixed(2),
        currency: orderCurrency,
        shipping_address: selectedAddress,
        payment_method: "razorpay",
        shipping_cost: orderCurrency === "INR" ? selectedShippingRate.freight_charge.toFixed(2): convertPrice(selectedShippingRate.freight_charge,true).toFixed(2),
        shipping_cost_inr: selectedShippingRate.freight_charge.toFixed(2),
        shipping_method: selectedShippingRate.courier_name,
        items: cart.items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: orderCurrency === "INR"
            ? parseFloat(item.product.sale_price || item.product.actual_price).toFixed(2)
            : convertPrice(parseFloat(item.product.sale_price || item.product.actual_price), true).toFixed(2),
        })),
      };
    } else {
      orderData = {
        customer: user.id,
        total_amount: orderCurrency === "INR" ? totalPriceINR.toFixed(2) : totalPriceConverted.toFixed(2),
        currency: orderCurrency,
        shipping_address: selectedAddress,
        payment_method: "razorpay",
        shipping_cost: orderCurrency === "INR" ? selectedShippingRate.freight_charge.toFixed(2) : convertPrice(selectedShippingRate.freight_charge,true).toFixed(2),
        shipping_cost_inr: selectedShippingRate.freight_charge.toFixed(2),
        shipping_method: selectedShippingRate.courier_name,
        items: [
          {
            product_id: product.id,
            quantity: quantity,
            price: orderCurrency === "INR"
              ? parseFloat(product.sale_price || product.actual_price).toFixed(2)
              : convertPrice(parseFloat((product.sale_price || product.actual_price)),true).toFixed(2),
          },
        ],
      };
    }

    try {
      const data = await createOrder(orderData);
      const razorpayOrderId = data.order_id;
      setOrderId(razorpayOrderId);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amountForRazorpay,
        currency: orderCurrency,
        name: "Yourrkart",
        description: isCartCheckout ? "Cart Checkout Payment" : "Buy Now Payment",
        order_id: razorpayOrderId,
        handler: async (response) => {
          setIsCheckingOut(true);
          setPaymentStatus(null);
          try {
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            };
            await verifyPayment(paymentData);
            setPaymentStatus("success");
          } catch (error) {
            console.error("Payment verification error:", error);
            setPaymentStatus("error");
            let errorMsg = "There was a problem verifying your payment. Please contact support if the amount was deducted.";
            if (error?.error) {
              errorMsg = error.error;
            } else if (error?.message) {
              errorMsg = error.message;
            }
            toast({
              title: "Payment Verification Failed",
              description: errorMsg,
              variant: "destructive",
            });
          } finally {
            setIsCheckingOut(false);
          }
        },
        prefill: {
          name: selectedAddress.full_name,
          contact: selectedAddress.mobile_number.replace(/^\+\d{1,3}\s/, ""),
        },
        theme: { color: "#C9F0DD" },
        notes: { address_id: selectedAddressId },
        modal: {
          ondismiss: () => {
            setIsCheckingOut(false);
            setPaymentStatus(null);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        setPaymentStatus("error");
        setIsCheckingOut(false);
        console.error("Payment failed:", response.error);
        toast({
          title: "Payment Failed",
          description: response.error || "Your payment could not be processed. Please try again or use a different payment method.",
          variant: "destructive",
        });
      });
      
      if (!window.Razorpay) {
        console.error("Razorpay script not loaded");
        toast({
          title: "Payment System Unavailable",
          description: "Payment system is not available. Please try again later.",
          variant: "destructive",
        });
        setIsCheckingOut(false);
        return;
      }
      razorpay.open();
    } catch (error) {
      console.error("Checkout error:", error);
      setPaymentStatus("error");
      setIsCheckingOut(false);
      toast({
        title: "Payment Could Not Be Initiated",
        description: "There was a problem starting your payment. Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    }
  };

  const handleEditPhone = () => {
    const selectedAddr = addresses.find((addr) => addr.id === selectedAddressId);
    setEditedPhone(selectedAddr.mobile_number.replace(getPhonePrefix(selectedAddr.country), ""));
    setIsEditingPhone(true);
  };

  const handleSavePhone = async () => {
    const selectedAddr = addresses.find((addr) => addr.id === selectedAddressId);
    const updatedPhone = `${getPhonePrefix(selectedAddr.country)}${editedPhone}`;
    try {
      const updatedAddress = await updateAddress(user.customer_id, selectedAddressId, { mobile_number: updatedPhone });
      setAddresses(addresses.map((addr) => (addr.id === selectedAddressId ? updatedAddress : addr)));
      setIsEditingPhone(false);
    } catch (error) {
      console.error("Failed to update phone:", error);
      alert("Failed to Update Phone Number");
    }
  };

  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FFF8] via-[#FFF0F5] to-[#FFF9E6] py-8">
      <div className="container mx-auto px-4 pt-20">
        {isCheckingOut && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-white to-[#F8FFFC] rounded-2xl p-8 shadow-2xl border-2 border-white">
              <Loader2 className="h-12 w-12 animate-spin text-[#2D5016] mx-auto mb-4" />
              <p className="text-center text-[#2D5016] font-medium">Processing Payment...</p>
            </div>
          </div>
        )}
        
        {paymentStatus === "success" ? (
          <div className="text-center py-12">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#2D5016] mb-4">Order Placed Successfully!</h2>
            <p className="text-[#5A7D3E] text-lg mb-6">Order ID: {orderId}. Thank you for your purchase.</p>
            <Button 
              className="bg-gradient-to-r from-[#C9F0DD] to-[#FFD6E8] hover:from-[#B0E8CD] hover:to-[#F5C2D9] text-[#2D5016] font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/shop/account?tab=orders")}
            >
              View Orders
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
            {/* Left Column - Product and Address */}
            <div className="space-y-6">
              {/* Product/Cart Card */}
              <Card className="bg-gradient-to-br from-white to-[#F8FFFC] rounded-2xl shadow-2xl border-2 border-white">
                <CardHeader className="bg-gradient-to-r from-[#C9F0DD]/20 to-[#FFD6E8]/20 rounded-t-2xl">
                  <CardTitle className="text-[#2D5016] text-xl font-bold">
                    {isCartCheckout ? "Cart Items" : "Product Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {isCartCheckout ? (
                    cart.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 py-4 border-b border-[#C9F0DD]/30 last:border-b-0">
                        <img 
                          src={item.product.images[0]?.image} 
                          alt={item.product.title} 
                          className="w-16 h-16 object-cover rounded-xl border-2 border-[#C9F0DD]"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#2D5016]">{item.product.title}</h3>
                          <p className="text-sm text-[#5A7D3E]">Quantity: {item.quantity}</p>
                          {item.quantity > item.product.stock && (
                            <p className="text-red-600 text-xs font-semibold mt-1">
                              Selected quantity exceeds available stock ({item.product.stock}). Please remove this item and add it again with the correct quantity to proceed.
                            </p>
                          )}
                        </div>
                        <p className="font-bold text-[#2D5016] text-lg">
                          {convertPrice((item.product.sale_price || item.product.actual_price) * item.quantity)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-4 py-4">
                      <img 
                        src={product.images[0].image} 
                        alt={product.title} 
                        className="w-16 h-16 object-cover rounded-xl border-2 border-[#C9F0DD]"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#2D5016] text-lg">{product.title}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleQuantityChange(-1)} 
                            disabled={quantity <= 1}
                            className="border-2 border-[#C9F0DD] hover:bg-[#C9F0DD]/20 text-[#2D5016]"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-semibold text-[#2D5016] w-8 text-center">{quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleQuantityChange(1)} 
                            disabled={quantity >= product.stock}
                            className="border-2 border-[#C9F0DD] hover:bg-[#C9F0DD]/20 text-[#2D5016]"
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                          <span className="text-sm text-[#5A7D3E] ml-2">(Stock: {product.stock})</span>
                        </div>
                        {quantity > product.stock && (
                          <p className="text-red-600 text-xs font-semibold mt-2">
                            Selected quantity exceeds available stock ({product.stock}). Please decrease the quantity to proceed.
                          </p>
                        )}
                      </div>
                      <p className="font-bold text-[#2D5016] text-xl">
                        {convertPrice(totalPriceINR)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Address Card */}
              <Card className="bg-gradient-to-br from-white to-[#F8FFFC] rounded-2xl shadow-2xl border-2 border-white">
                <CardHeader className="bg-gradient-to-r from-[#C9F0DD]/20 to-[#FFD6E8]/20 rounded-t-2xl">
                  <CardTitle className="text-[#2D5016] text-xl font-bold">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Select value={selectedAddressId} onValueChange={setSelectedAddressId}>
                    <SelectTrigger className="w-full border-2 border-[#C9F0DD] focus:border-[#FF6B9D]">
                      <SelectValue placeholder="Select an address" />
                    </SelectTrigger>
                    <SelectContent className="bg-gradient-to-b from-[#F0FFF8] to-[#FFF0F5] border-2 border-[#C9F0DD]">
                      {addresses.map((addr) => (
                        <SelectItem key={addr.id} value={addr.id} className="text-[#2D5016] hover:bg-[#C9F0DD]/20">
                          {addr.address_line_1}, {addr.city}, {addr.state} {addr.area_zip_code}, {addr.country} ({addr.address_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedAddress && (
                    <div className="bg-gradient-to-r from-[#C9F0DD]/20 to-[#FFD6E8]/20 rounded-2xl p-4 border border-[#C9F0DD]/30">
                      <div className="text-[#2D5016] space-y-2">
                        <p><strong>Name:</strong> {selectedAddress.full_name}</p>
                        <div className="flex items-center gap-2">
                          <p>
                            <strong>Phone:</strong>{" "}
                            {isEditingPhone ? (
                              <div className="flex gap-2 items-center">
                                <div className="flex">
                                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-[#C9F0DD] bg-[#C9F0DD]/20 text-[#2D5016] text-sm">
                                    {getPhonePrefix(selectedAddress.country)}
                                  </span>
                                  <Input
                                    value={editedPhone}
                                    onChange={(e) => setEditedPhone(e.target.value)}
                                    className="w-40 rounded-l-none border-[#C9F0DD]"
                                  />
                                </div>
                                <Button size="sm" onClick={handleSavePhone} className="bg-[#C9F0DD] text-[#2D5016] hover:bg-[#B0E8CD]">
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setIsEditingPhone(false)} className="border-[#C9F0DD] text-[#2D5016]">
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <>
                                {selectedAddress.mobile_number}
                                <Button variant="ghost" size="sm" onClick={handleEditPhone} className="ml-2 text-[#2D5016] hover:bg-[#C9F0DD]/20">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </p>
                        </div>
                        <p><strong>Address:</strong> {selectedAddress.address_line_1}{selectedAddress.address_line_2 && `, ${selectedAddress.address_line_2}`}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.area_zip_code}, {selectedAddress.country}</p>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-[#C9F0DD] text-[#2D5016] hover:bg-[#C9F0DD]/20 font-bold transition-all duration-300"
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                  >
                    {isAddingAddress ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {isAddingAddress ? "Cancel" : "Add New Address"}
                  </Button>
                  
                  {isAddingAddress && (
                    <div className="bg-gradient-to-r from-[#C9F0DD]/10 to-[#FFD6E8]/10 rounded-2xl p-4 border border-[#C9F0DD]/30">
                      <AddressComponent
                        onSave={handleAddAddress}
                        initialData={newAddress}
                        onCancel={() => setIsAddingAddress(false)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <Card className="bg-gradient-to-br from-white to-[#F8FFFC] rounded-2xl shadow-2xl border-2 border-white h-fit">
              <CardHeader className="bg-gradient-to-r from-[#C9F0DD]/20 to-[#FFD6E8]/20 rounded-t-2xl">
                <CardTitle className="text-[#2D5016] text-xl font-bold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-[#2D5016]">
                    <span>Subtotal ({isCartCheckout ? cart.items.length : quantity} item{isCartCheckout ? cart.items.length > 1 : quantity > 1 ? "s" : ""})</span>
                    <span className="font-semibold">
                      {convertPrice(isCartCheckout 
                        ? cart.items.reduce((total, item) => total + parseFloat(item.product.sale_price || item.product.actual_price) * item.quantity, 0)
                        : parseFloat(product.sale_price || product.actual_price) * quantity)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#2D5016]">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {isPincodeValid && selectedShippingRate ? (
                        convertPrice(selectedShippingRate.freight_charge)
                      ) : (
                        <span className="text-red-600">Not Deliverable</span>
                      )}
                    </span>
                  </div>
                  
                  {!isPincodeValid && (
                    <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 rounded-lg p-2">
                      <AlertCircle className="h-4 w-4" />
                      {pincodeError}
                    </p>
                  )}
                  
                  {isPincodeValid && shippingRates.length > 0 && (
                    <div>
                      <Label className="text-[#2D5016] font-medium">Shipping Method</Label>
                      <Select
                        value={selectedShippingRate?.courier_company_id}
                        onValueChange={(value) => {
                          const rate = shippingRates.find((r) => r.courier_company_id === value);
                          setSelectedShippingRate(rate);
                        }}
                      >
                        <SelectTrigger className="border-2 border-[#C9F0DD] focus:border-[#FF6B9D]">
                          <SelectValue placeholder="Select shipping method" />
                        </SelectTrigger>
                        <SelectContent className="bg-gradient-to-b from-[#F0FFF8] to-[#FFF0F5] border-2 border-[#C9F0DD]">
                          {shippingRates.map((rate) => (
                            <SelectItem key={rate.courier_company_id} value={rate.courier_company_id} className="text-[#2D5016] hover:bg-[#C9F0DD]/20">
                              {rate.courier_name} - {convertPrice(rate.freight_charge)} ({rate.etd})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <Separator className="bg-[#C9F0DD]" />
                  <div className="flex justify-between text-[#2D5016] font-bold text-lg">
                    <span>Total</span>
                    <span>{convertPrice(totalPriceINR)}</span>
                  </div>
                </div>
                
                <Button
                  className="w-full bg-gradient-to-r from-[#C9F0DD] via-[#FFD6E8] to-[#FFF2B2] hover:from-[#B0E8CD] hover:via-[#F5C2D9] hover:to-[#FFE999] text-[#2D5016] font-bold text-lg py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleCheckout}
                  disabled={!selectedAddressId || !isPincodeValid || !selectedShippingRate || isCheckingOut || hasOverQuantityItems}
                >
                  {isCheckingOut ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <ShoppingCart className="mr-2 h-5 w-5" />
                  )}
                  Proceed to Payment
                </Button>
                
                {hasOverQuantityItems && (
                  <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3 text-center">
                    Please ensure all item quantities do not exceed available stock to proceed with payment.
                  </p>
                )}
                
                {paymentStatus === "error" && (
                  <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 rounded-lg p-3">
                    <AlertCircle className="h-4 w-4" />
                    Payment Failed. Please try again.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}