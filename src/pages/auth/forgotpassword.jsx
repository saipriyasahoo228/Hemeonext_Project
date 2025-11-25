import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { requestPasswordResetOTP, verifyPasswordResetOTP, confirmPasswordResetOTP, resendOtp } from "../../api/authApi";
import { useCountryCode } from "../../hooks/useCountryCode";

function ForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    identifier: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const { countries, countryCode, manualCountryCode, isEmail, handleInputChange, handleCountryCodeChange, getFullIdentifier } = useCountryCode();
  const [resendCount, setResendCount] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(180);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const MAX_RESEND_ATTEMPTS = 3;
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (step === 2 && resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, resendCooldown]);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoadingVerify(true);
    try {
      const fullIdentifier = getFullIdentifier(formData.identifier);
      const response = await requestPasswordResetOTP(fullIdentifier);
      toast({ title: response.message });
      setStep(2);
      setResendCooldown(180);
      setIsResendDisabled(true);
    } catch (err) {
      toast({ title: err.error || "Failed to send OTP", variant: "destructive" });
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleResendOTP = async () => {
    setLoadingResend(true);
    try {
      const fullIdentifier = getFullIdentifier(formData.identifier);
      const payload = isEmail ? { email: fullIdentifier } : { mobile_number: fullIdentifier };
      const response = await resendOtp(payload);
      toast({ title: response.message });
      setResendCount((prev) => prev + 1);
      setResendCooldown(180);
      setIsResendDisabled(true);
    } catch (err) {
      toast({ title: err.error || "Failed to resend OTP", variant: "destructive" });
    } finally {
      setLoadingResend(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoadingVerify(true);
    try {
      const fullIdentifier = getFullIdentifier(formData.identifier);
      const response = await verifyPasswordResetOTP(fullIdentifier, formData.otp);
      toast({ title: response.message });
      setStep(3);
    } catch (err) {
      toast({ title: err.error || "Invalid OTP", variant: "destructive" });
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setLoadingVerify(true);
    try {
      const fullIdentifier = getFullIdentifier(formData.identifier);
      const response = await confirmPasswordResetOTP(fullIdentifier, formData.newPassword);
      toast({ title: response.message });
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err) {
      toast({ title: err.error || "Password reset failed", variant: "destructive" });
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-indigo-950 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-violet-300 mb-8 text-center">
          Reset Your Password
        </h2>

        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <div>
              <Label htmlFor="identifier" className="text-lg text-gray-700 dark:text-violet-400">
                Email or Mobile Number
              </Label>
              <div className="mt-2 flex items-center gap-2">
                {!isEmail && countryCode && (
                  <select
                    value={manualCountryCode || "IN"}
                    onChange={handleCountryCodeChange}
                    className="p-2 w-32 border border-gray-300 dark:border-indigo-700 dark:bg-indigo-900 dark:text-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  >
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.name} (+{country.phone})
                      </option>
                    ))}
                  </select>
                )}
                <Input
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={(e) => handleInputChange(e, setFormData)}
                  placeholder="Enter email or mobile number"
                  className="py-5 px-4 border-gray-300 dark:border-indigo-700 dark:bg-indigo-900 dark:text-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 flex-1"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loadingVerify}
              className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white py-3 rounded-lg text-lg font-medium transition-all"
            >
              {loadingVerify ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Send OTP"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <Label htmlFor="otp" className="text-lg text-gray-700 dark:text-violet-400">
                Enter OTP
              </Label>
              <div className="mt-2">
                <Input
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={(e) => handleInputChange(e, setFormData)}
                  placeholder="Enter the OTP"
                  className="py-5 px-4 border-gray-300 dark:border-indigo-700 dark:bg-indigo-900 dark:text-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <Button
                type="submit"
                disabled={loadingVerify}
                className="flex-1 bg-violet-600 hover:bg-violet-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white py-3 rounded-lg text-lg font-medium transition-all"
              >
                {loadingVerify ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Verify OTP"}
              </Button>
              {resendCount < MAX_RESEND_ATTEMPTS && (
                <Button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loadingResend || isResendDisabled}
                  className="flex-1 bg-violet-600 hover:bg-gray-600 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white py-3 rounded-lg text-lg font-medium transition-all"
                >
                  {loadingResend ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    `Resend OTP (${resendCooldown}s)`
                  )}
                </Button>
              )}
            </div>
            {resendCount >= MAX_RESEND_ATTEMPTS && (
              <p className="text-sm text-center text-gray-600 dark:text-violet-400">
                Maximum resend attempts reached. Please try again later.
              </p>
            )}
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <Label htmlFor="newPassword" className="text-lg text-gray-700 dark:text-violet-400">
                New Password
              </Label>
              <div className="mt-2 relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-violet-500" />
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange(e, setFormData)}
                  placeholder="Enter new password"
                  className="pl-10 py-5 border-gray-300 dark:border-indigo-700 dark:bg-indigo-900 dark:text-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  required
                />
                <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 dark:text-violet-500 hover:text-gray-600 dark:hover:text-violet-400 focus:outline-none"
              >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}

              </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-lg text-gray-700 dark:text-violet-400">
                Confirm Password
              </Label>
              <div className="mt-2 relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-violet-500" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange(e, setFormData)}
                  placeholder="Confirm new password"
                  className="pl-10 py-5 border-gray-300 dark:border-indigo-700 dark:bg-indigo-900 dark:text-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {formData.confirmPassword && formData.confirmPassword === formData.newPassword ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : formData.confirmPassword ? (
                                      <XCircle className="h-4 w-4 text-red-500" />
                                    ) : null}
                              </div>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loadingVerify}
              className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white py-3 rounded-lg text-lg font-medium transition-all"
            >
              {loadingVerify ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Reset Password"}
            </Button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-violet-400">
          Back to{" "}
          <a href="/auth/login" className="text-violet-600 dark:text-violet-300 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;