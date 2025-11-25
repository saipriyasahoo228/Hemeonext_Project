import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient  from "../../api/apiClient";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setMessage("Invalid or missing verification token.");
        return;
      }

      try {
        const response = await apiClient.get("/auth/verify-email/", {
          params: { token },
        });
        if (response.data.message === "Email verified successfully") {
          setMessage("Email verified successfully! Redirecting to login...");
          setTimeout(() => navigate("/auth/login"), 2000); // Redirect after 2 seconds
        }
      } catch (err) {
        setMessage(err.response?.data?.error || "Email verification failed.");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-indigo-950 rounded-2xl shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-violet-300 mb-4">
          Email Verification
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
}