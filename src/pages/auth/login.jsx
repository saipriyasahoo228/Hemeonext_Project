// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useToast } from "@/components/ui/use-toast";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
// import { loginUser } from "../../api/authApi";
// import { useAuth } from "@/context/auth-context";
// import { useCountryCode } from "../../hooks/useCountryCode";

// function AuthLogin() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { login } = useAuth();
//   const [formData, setFormData] = useState({ emailOrMobile: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const { countries, countryCode, manualCountryCode, isEmail, handleInputChange, handleCountryCodeChange, getFullIdentifier, validationError } = useCountryCode();
//   const [showPassword, setShowPassword] = useState(false);
//   // Helper function to format backend errors
//   const formatErrorMessage = (err) => {
//     if (err.response?.data) {
//       // Handle non_field_errors (e.g., ["Invalid credentials"])
//       if (err.response.data.non_field_errors) {
//         return err.response.data.non_field_errors[0];
//       }
//       // Handle field-specific errors (e.g., {"email": ["Invalid email"]})
//       const errorMessages = Object.entries(err.response.data)
//         .map(([field, errors]) => {
//           if (Array.isArray(errors)) {
//             return `${field}: ${errors.join(", ")}`;
//           }
//           return `${field}: ${errors}`;
//         })
//         .join("; ");
//       return errorMessages || "Login failed";
//     }
//     // Handle generic errors (e.g., network issues)
//     return err.message || "An unexpected error occurred during login";
//   };

//   const onSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);

//     try {
//       const fullIdentifier = getFullIdentifier(formData.emailOrMobile);
//       const emailCheck = fullIdentifier.includes("@");
//       console.log("Full Identifier:", fullIdentifier, "IsEmail", isEmail, "EmailCheck", emailCheck);

//       const payload = emailCheck
//         ? { email: fullIdentifier, password: formData.password }
//         : { mobile_number: fullIdentifier, password: formData.password };

//       const data = await loginUser(payload);
//       console.log("Login Response:", data);
//       login(data.user, data.Token.access, data.Token.refresh);
//       toast({ title: data.msg });

//       // Navigate based on user role and reload only after success
//       if (data.user?.is_admin) {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/shop/home");
//       }
//       window.location.reload();
//     } catch (err) {
//       console.error("Login error:", err, err.response?.data);
//       const errorMessage = formatErrorMessage(err);
//       toast({
//         title: errorMessage,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900">
//       <div className="w-full max-w-lg p-10 bg-background dark:bg-indigo-950 rounded-2xl shadow-2xl">
//         <h2 className="text-2xl pb-12 font-bold text-center text-gray-800 dark:text-violet-300 mb-0">
//           Welcome Back
//         </h2>
//         <form onSubmit={onSubmit} className="space-y-8">
//           {/* Email or Mobile Number Field */}
//           <div className="relative">
//             <Label htmlFor="emailOrMobile" className="text-lg text-gray-700 dark:text-violet-400">
//               Email or Mobile Number
//             </Label>
//             <div className="mt-2 flex items-center gap-2">
//               {!isEmail && countryCode && (
//                 <select
//                   value={manualCountryCode || "IN"}
//                   onChange={handleCountryCodeChange}
//                   className="p-2 w-32 border border-gray-300 dark:border-indigo-700 dark:bg-indigo-900 dark:text-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500"
//                 >
//                   {countries.map((country) => (
//                     <option key={country.code} value={country.code}>
//                       {country.name} (+{country.phone})
//                     </option>
//                   ))}
//                 </select>
//               )}
//               <Input
//                 id="emailOrMobile"
//                 name="emailOrMobile"
//                 value={formData.emailOrMobile}
//                 onChange={(e) => handleInputChange(e, setFormData)}
//                 placeholder="Enter your email or mobile"
//                 className="py-4 px-4 text-base w-full border-gray-300 dark:border-indigo-700 dark:bg-indigo-900 dark:text-violet-300 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 rounded-lg flex-1"
//                 required
//               />
//             </div>
//             {validationError && (
//               <p className="mt-1 text-sm text-red-600">{validationError}</p>
//             )}
//           </div>

//           {/* Password Field */}
//           <div className="relative">
//             <Label htmlFor="password" className="text-lg text-gray-700 dark:text-violet-400">
//               Password
//             </Label>
//             <div className="relative mt-2">
//               <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-violet-500" />
//               <Input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 value={formData.password}
//                 onChange={(e) => handleInputChange(e, setFormData)}
//                 placeholder="Enter your password"
//                 className="pl-10 text-base py-4 w-full border-gray-300 dark:border-indigo-700 dark:bg-indigo-900 dark:text-violet-300 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 rounded-lg"
//                 required
//               />
//               <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-violet-500 hover:text-gray-600 dark:hover:text-violet-400 focus:outline-none"
//               >
//               {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}

//               </button>
//             </div>
//           </div>

//           {/* Forgot Password Link */}
//           <div className="text-right">
//             <button
//               type="button"
//               onClick={() => navigate("/auth/forgot-password")}
//               className="text-sm text-violet-600 dark:text-violet-400 hover:underline focus:outline-none"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           {/* Submit Button */}
//           <Button
//             type="submit"
//             disabled={loading || !!validationError}
//             className="w-full bg-primary hover:bg-violet-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center text-lg transition-all duration-300"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="mr-2 h-6 w-6 animate-spin" />
//                 Logging in...
//               </>
//             ) : (
//               "Login"
//             )}
//           </Button>
//         </form>

//         {/* Sign Up Link */}
//         <p className="mt-6 text-center text-sm text-gray-600 dark:text-violet-400">
//           Don’t have an account?{" "}
//           <a
//             href="/auth/register"
//             className="text-violet-600 dark:text-violet-300 hover:underline"
//           >
//             Sign Up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default AuthLogin;








import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../api/authApi";
import { useAuth } from "@/context/auth-context";
import { useCountryCode } from "../../hooks/useCountryCode";

function AuthLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ emailOrMobile: "", password: "" });
  const [loading, setLoading] = useState(false);
  const {
    countries,
    countryCode,
    manualCountryCode,
    isEmail,
    handleInputChange,
    handleCountryCodeChange,
    getFullIdentifier,
    validationError,
  } = useCountryCode();
  const [showPassword, setShowPassword] = useState(false);

  const formatErrorMessage = (err) => {
    if (err.response?.data) {
      if (err.response.data.non_field_errors) {
        return err.response.data.non_field_errors[0];
      }
      const errorMessages = Object.entries(err.response.data)
        .map(([field, errors]) =>
          Array.isArray(errors)
            ? `${field}: ${errors.join(", ")}`
            : `${field}: ${errors}`
        )
        .join("; ");
      return errorMessages || "Login failed";
    }
    return err.message || "An unexpected error occurred during login";
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const fullIdentifier = getFullIdentifier(formData.emailOrMobile);
      const emailCheck = fullIdentifier.includes("@");

      const payload = emailCheck
        ? { email: fullIdentifier, password: formData.password }
        : { mobile_number: fullIdentifier, password: formData.password };

      const data = await loginUser(payload);
      login(data.user, data.Token.access, data.Token.refresh);

      toast({ title: data.msg });

      if (data.user?.is_admin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/shop/home");
      }
      window.location.reload();
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-transparent">
      <div className="w-full max-w-2xl p-10 rounded-2xl shadow-2xl backdrop-blur-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(167,243,208,0.35), rgba(216,180,254,0.35))",
          border: "1px solid rgba(255,255,255,0.4)",
        }}
      >
        <h2 className="text-3xl pb-8 font-bold text-center text-purple-700 drop-shadow-md">
          Welcome Back
        </h2>

        <form onSubmit={onSubmit} className="space-y-6">

          {/* Email / Mobile */}
          <div className="relative">
            <Label className="text-lg text-purple-900 font-semibold">
              Email or Mobile Number
            </Label>

            <div className="mt-2 flex items-center gap-2">
              {!isEmail && countryCode && (
                <select
                  value={manualCountryCode || "IN"}
                  onChange={handleCountryCodeChange}
                  className="p-2 w-32 rounded-lg border border-purple-300 bg-purple-50 text-purple-700"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name} (+{country.phone})
                    </option>
                  ))}
                </select>
              )}

              <Input
                name="emailOrMobile"
                value={formData.emailOrMobile}
                onChange={(e) => handleInputChange(e, setFormData)}
                placeholder="Enter your email or mobile"
                className="py-4 px-4 text-base w-full rounded-lg border border-purple-300 bg-purple-50 text-purple-800 placeholder-purple-400 focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {validationError && (
              <p className="mt-1 text-sm text-red-600">{validationError}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Label className="text-lg text-purple-900 font-semibold">
              Password
            </Label>

            <div className="relative mt-2">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />

              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange(e, setFormData)}
                placeholder="Enter your password"
                className="pl-12 py-4 w-full rounded-lg border border-purple-300 bg-purple-50 text-purple-800 placeholder-purple-400 focus:ring-2 focus:ring-purple-500"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-700"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/auth/forgot-password")}
              className="text-purple-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading || !!validationError}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg text-lg shadow-lg"
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-purple-900">
          Don’t have an account?{" "}
          <a href="/auth/register" className="text-purple-700 font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default AuthLogin;
