import { useState, useEffect } from "react";
import { login, userinfo } from "../slice/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import mathAnimation from "../assests/math.json";

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);
  console.log(API_URL)

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [success]);
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [error]);
  

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOtpChange = (e) => setOtp(e.target.value);

  const requestOtp = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    setIsResending(true);
    try {
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Failed to send OTP");

      setIsOtpSent(true);
      setSuccess("OTP sent to your email");
      setResendTimer(60); // Start 60-sec countdown
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
      setIsResending(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(
        `${API_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
      if (!response.ok) throw new Error("Invalid OTP");
      const data = await response.json();
      dispatch(login(data.token));
      dispatch(userinfo("New User"));
      navigate("/main");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
{/* Notifications */}
{success && (
  <div className="fixed top-6 right-20 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm toast">
    {success}
  </div>
)}

{error && (
  <div className="fixed top-6 right-20 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm toast">
    {error}
  </div>
)}

      <div className="bg-white p-10 rounded-3xl shadow-xl w-[400px] relative">
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
          <Lottie animationData={mathAnimation} className="w-44 h-44" />
        </div>
        <h2 className="text-2xl font-extrabold text-center text-purple-600 mt-12">
          Sign In with OTP
        </h2>

        <form onSubmit={verifyOtp} className="space-y-4 mt-4">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={handleEmailChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
            required
            disabled={isOtpSent}
          />

          {!isOtpSent ? (
            <button
              type="button"
              onClick={requestOtp}
              className={`w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg text-lg font-bold shadow-md transition ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Get OTP"}
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg text-lg font-bold shadow-md hover:opacity-90 transition"
              >
                Verify OTP
              </button>

              {/* Resend OTP Button */}
              {resendTimer > 0 ? (
                <p className="text-center text-sm text-gray-500 mt-2">
                  Resend OTP in {resendTimer}s
                </p>
              ) : (
                <button
                type="button"
                onClick={requestOtp}
                disabled={isResending || resendTimer > 0}
                className={`w-full bg-gray-300 text-black py-2 rounded-lg text-lg font-bold shadow-md transition mt-2 
                  ${isResending ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
              
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
