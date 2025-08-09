import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { setUser } from "../../Store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import "react-toastify/dist/ReactToastify.css";
import { usePost } from "@/Hooks/UsePost";
import { FaStethoscope, FaHeartbeat, FaUserMd, FaSyringe } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const RegisterEmployer = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/registerUser` });
  const { postData: postOTP, loadingPost: loadingOTP, response: responseOTP } = usePost({
    url: `${apiUrl}/verifyOtp`,
  });
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Employer");

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      toast.info("You are already logged in");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!loadingPost && response) {
      if (response.status === 200) {
        setIsOtpModalOpen(true);
      } else {
        toast.error(response?.data?.message || "Registration failed");
      }
    }
  }, [response, loadingPost]);

  useEffect(() => {
    if (!loadingOTP && responseOTP) {
      dispatch(setUser(responseOTP?.data));
      localStorage.setItem("user", JSON.stringify(responseOTP?.data));
      localStorage.setItem("token", responseOTP?.data.token);
      const redirectTo = new URLSearchParams(location.search).get("redirect");
      navigate(redirectTo || "/login");
      setIsOtpModalOpen(false);
      toast.success("OTP verified successfully!");
    }
  }, [responseOTP, loadingOTP, navigate, dispatch]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!emailOrUsername || !password || !firstName || !lastName || !phone) {
      toast.error("All fields are required");
      return;
    }
    const body = new FormData();
    body.append("first_name", firstName);
    body.append("last_name", lastName);
    body.append("email", emailOrUsername);
    body.append("phone", phone);
    body.append("password", password);
    await postData(body, "Please check your email for OTP");
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        otpInputs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    const body = new FormData();
    body.append("email", emailOrUsername);
    body.append("code", otpCode);
    await postOTP(body, "OTP verification successful!");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-bg-primary/40 to-white bg-cover bg-center relative overflow-hidden">
      {/* Doctor-themed background image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580281780460-82d277b0e3f8')] bg-cover bg-center opacity-20"></div>

      {/* Decorative medical elements */}
      <div className="absolute top-8 left-8 text-bg-primary opacity-30 text-6xl">
        <FaStethoscope />
      </div>
      <div className="absolute bottom-8 right-8 text-bg-primary opacity-30 text-6xl">
        <FaHeartbeat />
      </div>
      <div className="absolute top-1/4 right-12 text-bg-primary opacity-25 text-5xl">
        <FaUserMd />
      </div>
      <div className="absolute bottom-1/4 left-12 text-bg-primary opacity-25 text-5xl">
        <FaSyringe />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-2xl p-4 w-full"
      >
        <Card className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-bg-primary/50 overflow-hidden ring-1 ring-bg-primary/30">
          <CardContent className="p-4 md:p-8">
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-center mb-5"
            >
              <h2 className="text-5xl font-extrabold text-bg-primary tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-bg-primary to-blue-300">
                Mrfae
              </h2>
              <p className="text-gray-500 mt-4 text-lg font-medium">
                Join the medical job platform
              </p>
            </motion.div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-4 pr-12 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70  placeholder-bg-primary/70"
                    disabled={loadingPost}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-bg-primary">
                    <FaUserMd />
                  </span>
                </motion.div>
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-4 pr-12 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70 placeholder-bg-primary/70"
                    disabled={loadingPost}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-bg-primary">
                    <FaUserMd />
                  </span>
                </motion.div>
              </div>
              <motion.div
                className="relative"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  type="email"
                  placeholder="Email"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full p-4 pr-12 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70 placeholder-bg-primary/70"
                  disabled={loadingPost}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-bg-primary">
                  <FaStethoscope />
                </span>
              </motion.div>
              <motion.div
                className="relative"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  type="text"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-4 pr-12 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70 placeholder-bg-primary/70"
                  disabled={loadingPost}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-bg-primary">
                  <FaSyringe />
                </span>
              </motion.div>
              <motion.div
                className="relative"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 pr-12 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70 placeholder-bg-primary/70"
                  disabled={loadingPost}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-bg-primary">
                  <FaHeartbeat />
                </span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  type="submit"
                  className="w-full p-4 text-lg bg-gradient-to-r from-bg-primary to-blue-300 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 shadow-lg"
                  disabled={loadingPost}
                >
                  {loadingPost ? "Registering..." : "Register Mrfae"}
                </Button>
              </motion.div>
            </form>

            <p className="text-center text-gray-500 mt-6 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-bg-primary font-semibold hover:underline hover:text-blue-500 transition-colors duration-200"
              >
                Log In
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {isOtpModalOpen && (
          <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen} className="bg-transparent">
            <DialogContent className="bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl p-8 max-w-md border border-bg-primary/50">
              <DialogHeader>
                <DialogTitle className="text-bg-primary text-2xl font-bold">
                  Verify OTP
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Enter the 6-digit OTP sent to your email ({emailOrUsername}).
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      ref={(el) => (otpInputs.current[index] = el)}
                      className="w-12 h-12 text-center text-lg border border-bg-primary/50 rounded-md focus:ring-2 focus:ring-bg-primary text-bg-primary"
                      disabled={loadingOTP}
                    />
                  ))}
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-bg-primary to-blue-300 text-white hover:from-blue-700 hover:to-blue-500 rounded-lg transition-all duration-200"
                    disabled={loadingOTP}
                  >
                    {loadingOTP ? "Verifying..." : "Verify OTP"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <ToastContainer />
    </div>
  );
};

export default RegisterEmployer;
