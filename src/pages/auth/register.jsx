import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast"; // Added for toast notifications
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { registerUser, verifySmsOtp, resendOtp } from "../../api/authApi";
import { useCountryCode } from "../../hooks/useCountryCode";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast(); // Added for toast notifications
  const [formData, setFormData] = useState({
    name: "",
    credential: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [error, setError] = useState(""); // For client-side errors (e.g., form validation)
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState("initial");
  const [mobileNumber, setMobileNumber] = useState("");
  const [resendCooldown, setResendCooldown] = useState(180); // 3 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Initially disabled
  const [resendCount, setResendCount] = useState(0); // Track resend attempts
  const MAX_RESEND_ATTEMPTS = 3; // Limit to 3 resends
  const { countries, countryCode, manualCountryCode, isEmail, handleInputChange, handleCountryCodeChange, getFullIdentifier, validationError } = useCountryCode();
  const [showPassword, setShowPassword] = useState(false);

  // Timer for resend cooldown
  useEffect(() => {
    if (step === "otp" && resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsResendDisabled(false); // Enable resend after 3 minutes
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer); // Cleanup on unmount or step change
    }
  }, [step, resendCooldown]);

  // Helper function to format backend errors
  const formatErrorMessage = (err) => {
    if (err.response?.data) {
      // Handle non_field_errors (e.g., ["Invalid credentials"])
      if (err.response.data.non_field_errors) {
        return err.response.data.non_field_errors[0];
      }
      // Handle field-specific errors (e.g., {"email": ["This field must be unique"]})
      const errorMessages = Object.entries(err.response.data)
        .map(([field, errors]) => {
          if (Array.isArray(errors)) {
            return `${field}: ${errors.join(", ")}`;
          }
          return `${field}: ${errors}`;
        })
        .join("; ");
      return errorMessages || "Registration failed";
    }
    return err.message || "Registration failed";
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      setError("Please enter the OTP");
      setSuccess("");
      return;
    }
    setLoadingVerify(true);
    setError("");
    setSuccess("");
    try {
      const response = await verifySmsOtp(mobileNumber, formData.otp);
      setSuccess(response.message || "Registration successful!");
      setStep("initial");
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleResendOtp = async () => {
    setLoadingResend(true);
    setError("");
    setSuccess("");
    try {
      await resendOtp(mobileNumber);
      setSuccess("OTP resent successfully");
      setResendCount((prev) => prev + 1); // Increment resend count
      setResendCooldown(180); // Reset cooldown
      setIsResendDisabled(true); // Disable resend
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoadingResend(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.credential || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields");
      setSuccess("");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    const fullIdentifier = getFullIdentifier(formData.credential);
    setLoadingVerify(true);
    setError("");
    setSuccess("");
    try {
      const data = {
        name: formData.name,
        password: formData.password,
      };
      const emailCheck = fullIdentifier.includes("@");
      if (emailCheck) {
        data.email = fullIdentifier;
      } else {
        data.mobile_number = fullIdentifier;
      }

      const response = await registerUser(data);
      if (emailCheck) {
        console.log("Email registration response:", response);
        setStep("email_sent");
        setSuccess(response.msg || "Registration successful! Please verify your email.");
      } else {
        setMobileNumber(fullIdentifier);
        setStep("otp");
        setSuccess("OTP sent to your mobile number");
        setResendCooldown(180); // Start cooldown
        setIsResendDisabled(true); // Disable resend initially
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = formatErrorMessage(err);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div className="flex items-center w-96 justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg p-10 bg-background dark:bg-indigo-950 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-violet-300 mb-0">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          {step === "initial" && (
            <div>
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange(e, setFormData)}
                disabled={loadingVerify || loadingResend}
                className="mt-1 w-full dark:bg-gray-700 dark:text-white"
                placeholder="Enter your name"
              />
            </div>
          )}

          {/* Credential (Email or Mobile Number) */}
          {step === "initial" && (
            <div>
              <Label htmlFor="credential" className="text-gray-700 dark:text-gray-300">
                Email or Mobile Number
              </Label>
              <div className="mt-1 flex items-center gap-2">
                {!isEmail && countryCode && (
                  <select
                    value={manualCountryCode || "IN"}
                    onChange={handleCountryCodeChange}
                    className="p-2 w-32 border border-gray-300 dark:border-indigo-700 dark:bg-indigo-900 dark:text-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} (+{country.phone})
                      </option>
                    ))}
                  </select>
                )}
                <Input
                  id="credential"
                  name="credential"
                  type="text"
                  value={formData.credential}
                  onChange={(e) => handleInputChange(e, setFormData)}
                  disabled={loadingVerify || loadingResend}
                  className="w-full dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your email or mobile number"
                />
              </div>
              {validationError && (
                <p className="mt-1 text-sm text-red-600">{validationError}</p>
              )}
            </div>
          )}

          {/* Password */}
          {step === "initial" && (
            <div className="relative">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type={showPassword? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange(e, setFormData)}
                disabled={loadingVerify || loadingResend}
                className="mt-1 w-full dark:bg-gray-700 dark:text-white"
                placeholder="Enter your password"
              />
              <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3/4 right-4 transform -translate-y-1/2 text-gray-400 dark:text-violet-500 hover:text-gray-600 dark:hover:text-violet-400 focus:outline-none"
              >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}

              </button>
            </div>
          )}

          {/* Confirm Password */}
          {step === "initial" && (
            <div className="relative">
              <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange(e, setFormData)}
                disabled={loadingVerify || loadingResend}
                className="mt-1 w-full dark:bg-gray-700 dark:text-white"
                placeholder="Confirm your password"
              />
              <div className="absolute right-4 top-3/4 transform -translate-y-1/2">
              {formData.confirmPassword && formData.confirmPassword === formData.password ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : formData.confirmPassword ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : null}
              </div>
            </div>
          )}

          {/* OTP Input */}
          {step === "otp" && (
            <div>
              <Label htmlFor="otp" className="text-gray-700 dark:text-gray-300">
                Enter OTP
              </Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                value={formData.otp}
                onChange={(e) => handleInputChange(e, setFormData)}
                disabled={loadingVerify || loadingResend}
                className="mt-1 w-full dark:bg-gray-700 dark:text-white"
                placeholder="Enter the OTP"
              />
            </div>
          )}

          {/* Resend OTP */}
          {step === "otp" && resendCount < MAX_RESEND_ATTEMPTS && (
            <Button
              type="button"
              onClick={handleResendOtp}
              disabled={loadingResend || isResendDisabled}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg mt-2"
            >
              {loadingResend ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                `Resend OTP (${resendCooldown}s)`
              )}
            </Button>
          )}

          {/* Verify OTP or Register */}
          {step === "otp" ? (
            <Button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loadingVerify}
              className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center text-lg transition-all duration-300"
            >
              {loadingVerify ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          ) : (
            step === "initial" && (
              <Button
                type="submit"
                disabled={loadingVerify || !!validationError}
                className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center text-lg transition-all duration-300"
              >
                {loadingVerify ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            )
          )}
        </form>

        {/* Email Verification Message */}
        {step === "email_sent" && (
          <div className="mt-4 text-center">
            <div className="text-blue-600 text-md bg-blue-100 py-6 px-6 rounded-lg shadow-lg">
              Your verification link has been sent. Please check your email and verify your account.
            </div>
            <Button
              type="button"
              onClick={() => navigate("/auth/login")}
              className="mt-4 w-30 bg-primary/90 shadow-md hover:bg-primary dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg text-lg transition-all duration-300"
            >
              Go to Login
            </Button>
          </div>
        )}

        {/* Resend Limit Message */}
        {step === "otp" && resendCount >= MAX_RESEND_ATTEMPTS && (
          <div className="mt-4 text-center text-gray-600 dark:text-violet-400 text-sm">
            Maximum resend attempts reached. Please try again later.
          </div>
        )}

        {/* Client-side Error Message */}
        {error && (
          <div className="mt-4 text-center text-red-600 text-sm bg-red-100 py-2 px-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mt-4 text-center text-green-600 text-sm bg-green-100 py-2 px-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Redirect to Login */}
        {step === "initial" && (
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-violet-400">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/auth/login")}
              className="text-violet-600 dark:text-violet-300 hover:underline cursor-pointer"
            >
              Log in
            </span>
          </p>
        )}
      </div>
    </div>
  );
}










// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Loader2 } from "lucide-react";
// import { registerUser, verifySmsOtp, resendOtp } from "../../api/authApi";
// import { useCountryCode } from "../../hooks/useCountryCode";

// export default function Register() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     credential: "",
//     password: "",
//     confirmPassword: "",
//     otp: "",
//   });
//   const [loadingVerify, setLoadingVerify] = useState(false);
//   const [loadingResend, setLoadingResend] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [step, setStep] = useState("initial");
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [resendCooldown, setResendCooldown] = useState(180); // 3 minutes in seconds
//   const [isResendDisabled, setIsResendDisabled] = useState(true); // Initially disabled
//   const [resendCount, setResendCount] = useState(0); // Track resend attempts
//   const MAX_RESEND_ATTEMPTS = 3; // Limit to 3 resends
//   const { countries, countryCode, manualCountryCode, isEmail, handleInputChange, handleCountryCodeChange, getFullIdentifier } = useCountryCode();

//   // Timer for resend cooldown
//   useEffect(() => {
//     if (step === "otp" && resendCooldown > 0) {
//       const timer = setInterval(() => {
//         setResendCooldown((prev) => {
//           if (prev <= 1) {
//             clearInterval(timer);
//             setIsResendDisabled(false); // Enable resend after 3 minutes
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//       return () => clearInterval(timer); // Cleanup on unmount or step change
//     }
//   }, [step, resendCooldown]);

//   const handleVerifyOtp = async () => {
//     if (!formData.otp) {
//       setError("Please enter the OTP");
//       setSuccess("");
//       return;
//     }
//     setLoadingVerify(true);
//     setError("");
//     setSuccess("");
//     try {
//       const response = await verifySmsOtp(mobileNumber, formData.otp);
//       setSuccess(response.message || "Registration successful!");
//       setStep("initial");
//       setTimeout(() => navigate("/auth/login"), 2000);
//     } catch (err) {
//       setError(err.error || "Invalid OTP");
//     } finally {
//       setLoadingVerify(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     setLoadingResend(true);
//     setError("");
//     setSuccess("");
//     try {
//       await resendOtp(mobileNumber);
//       setSuccess("OTP resent successfully");
//       setResendCount((prev) => prev + 1); // Increment resend count
//       setResendCooldown(180); // Reset cooldown
//       setIsResendDisabled(true); // Disable resend
//     } catch (err) {
//       setError(err.error || "Failed to resend OTP");
//     } finally {
//       setLoadingResend(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.name || !formData.credential || !formData.password || !formData.confirmPassword) {
//       setError("Please fill in all required fields");
//       setSuccess("");
//       return;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       setSuccess("");
//       return;
//     }

//     const fullIdentifier = getFullIdentifier(formData.credential);
//     setLoadingVerify(true);
//     setError("");
//     setSuccess("");
//     try {
//       const data = {
//         name: formData.name,
//         password: formData.password,
//       };
//       const emailCheck = fullIdentifier.includes("@");
//       if (emailCheck) {
//         data.email = fullIdentifier;
//       } else {
//         data.mobile_number = fullIdentifier;
//       }

//       const response = await registerUser(data);
//       if (emailCheck) {
//         console.log("Email registration response: haaa");
//         setStep("email_sent");
//         setSuccess(response.msg || "Registration successful! Please verify your email.");
//       } else {
//         setMobileNumber(fullIdentifier);
//         setStep("otp");
//         setSuccess("OTP sent to your mobile number");
//         setResendCooldown(180); // Start cooldown
//         setIsResendDisabled(true); // Disable resend initially
//       }
//     } catch (err) {
//       setError(err.error || "Registration failed");
//     } finally {
//       setLoadingVerify(false);
//     }
//   };

//   return (
//     <div className="flex items-center w-96 justify-center bg-gray-100 dark:bg-gray-900">
//       <div className="w-full max-w-lg p-10 bg-background dark:bg-indigo-950 rounded-2xl shadow-2xl">
//         <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-violet-300 mb-0">
//           Register
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Name */}
//           {step === "initial" && (
//             <div>
//               <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
//                 Name
//               </Label>
//               <Input
//                 id="name"
//                 name="name"
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) => handleInputChange(e, setFormData)}
//                 disabled={loadingVerify || loadingResend}
//                 className="mt-1 w-full dark:bg-gray-700 dark:text-white"
//                 placeholder="Enter your name"
//               />
//             </div>
//           )}

//           {/* Credential (Email or Mobile Number) */}
//           {step === "initial" && (
//             <div>
//               <Label htmlFor="credential" className="text-gray-700 dark:text-gray-300">
//                 Email or Mobile Number
//               </Label>
//               <div className="mt-1 flex items-center gap-2">
//                 {!isEmail && countryCode && (
//                   <select
//                     value={manualCountryCode || "IN"}
//                     onChange={handleCountryCodeChange}
//                     className="p-2 w-32 border border-gray-300 dark:border-indigo-700 dark:bg-indigo-900 dark:text-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500"
//                   >
//                     {countries.map(country => (
//                       <option key={country.code} value={country.code}>
//                         {country.name} (+{country.phone})
//                       </option>
//                     ))}
//                   </select>
//                 )}
//                 <Input
//                   id="credential"
//                   name="credential"
//                   type="text"
//                   value={formData.credential}
//                   onChange={(e) => handleInputChange(e, setFormData)}
//                   disabled={loadingVerify || loadingResend}
//                   className="w-full dark:bg-gray-700 dark:text-white"
//                   placeholder="Enter your email or mobile number"
//                 />
//               </div>
//             </div>
//           )}

//           {/* Password */}
//           {step === "initial" && (
//             <div>
//               <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
//                 Password
//               </Label>
//               <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={(e) => handleInputChange(e, setFormData)}
//                 disabled={loadingVerify || loadingResend}
//                 className="mt-1 w-full dark:bg-gray-700 dark:text-white"
//                 placeholder="Enter your password"
//               />
//             </div>
//           )}

//           {/* Confirm Password */}
//           {step === "initial" && (
//             <div>
//               <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
//                 Confirm Password
//               </Label>
//               <Input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type="password"
//                 value={formData.confirmPassword}
//                 onChange={(e) => handleInputChange(e, setFormData)}
//                 disabled={loadingVerify || loadingResend}
//                 className="mt-1 w-full dark:bg-gray-700 dark:text-white"
//                 placeholder="Confirm your password"
//               />
//             </div>
//           )}

//           {/* OTP Input */}
//           {step === "otp" && (
//             <div>
//               <Label htmlFor="otp" className="text-gray-700 dark:text-gray-300">
//                 Enter OTP
//               </Label>
//               <Input
//                 id="otp"
//                 name="otp"
//                 type="text"
//                 value={formData.otp}
//                 onChange={(e) => handleInputChange(e, setFormData)}
//                 disabled={loadingVerify || loadingResend}
//                 className="mt-1 w-full dark:bg-gray-700 dark:text-white"
//                 placeholder="Enter the OTP"
//               />
//             </div>
//           )}

//           {/* Resend OTP */}
//           {step === "otp" && resendCount < MAX_RESEND_ATTEMPTS && (
//             <Button
//               type="button"
//               onClick={handleResendOtp}
//               disabled={loadingResend || isResendDisabled}
//               className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg mt-2"
//             >
//               {loadingResend ? (
//                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//               ) : (
//                 `Resend OTP (${resendCooldown}s)`
//               )}
//             </Button>
//           )}

//           {/* Verify OTP or Register */}
//           {step === "otp" ? (
//             <Button
//               type="button"
//               onClick={handleVerifyOtp}
//               disabled={loadingVerify}
//               className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center text-lg transition-all duration-300"
//             >
//               {loadingVerify ? (
//                 <>
//                   <Loader2 className="mr-2 h-6 w-6 animate-spin" />
//                   Verifying...
//                 </>
//               ) : (
//                 "Verify OTP"
//               )}
//             </Button>
//           ) : (
//             step === "initial" && (
//               <Button
//                 type="submit"
//                 disabled={loadingVerify}
//                 className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center text-lg transition-all duration-300"
//               >
//                 {loadingVerify ? (
//                   <>
//                     <Loader2 className="mr-2 h-6 w-6 animate-spin" />
//                     Registering...
//                   </>
//                 ) : (
//                   "Register"
//                 )}
//               </Button>
//             )
//           )}
//         </form>

//         {/* Email Verification Message */}
//         {step === "email_sent" && (
//           <div className="mt-4 text-center">
//             <div className="text-blue-600 text-md bg-blue-100 py-6 px-6 rounded-lg shadow-lg">
//               Your verification link has been sent. Please check your email and verify your account.
//             </div>
//             <Button
//               type="button"
//               onClick={() => navigate("/auth/login")}
//               className="mt-4 w-30 bg-primary/90 shadow-md hover:bg-primary dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg text-lg transition-all duration-300"
//             >
//               Go to Login
//             </Button>
//           </div>
//         )}

//         {/* Resend Limit Message */}
//         {step === "otp" && resendCount >= MAX_RESEND_ATTEMPTS && (
//           <div className="mt-4 text-center text-gray-600 dark:text-violet-400 text-sm">
//             Maximum resend attempts reached. Please try again later.
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mt-4 text-center text-red-600 text-sm bg-red-100 py-2 px-3 rounded-lg">
//             {error}
//           </div>
//         )}

//         {/* Success Message */}
//         {success && (
//           <div className="mt-4 text-center text-green-600 text-sm bg-green-100 py-2 px-3 rounded-lg">
//             {success}
//           </div>
//         )}

//         {/* Redirect to Login */}
//         {step === "initial" && (
//           <p className="mt-6 text-center text-sm text-gray-600 dark:text-violet-400">
//             Already have an account?{" "}
//             <span
//               onClick={() => navigate("/auth/login")}
//               className="text-violet-600 dark:text-violet-300 hover:underline cursor-pointer"
//             >
//               Log in
//             </span>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }