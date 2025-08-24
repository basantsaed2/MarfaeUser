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
import { useGet } from "@/Hooks/UseGet";
import Select from "react-select";

const RegisterUser = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchList, loading: loadingList, data: listData } = useGet({
    url: `${apiUrl}/get-specialization-experience`,
  });
  const { postData, loading: loadingPost, response } = usePost({ url: `${apiUrl}/registerUser` });
  const { postData: postOTP, loading: loadingOTP, response: responseOTP } = usePost({
    url: `${apiUrl}/verifyOtp`,
  });
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [experienceOptions, setExperienceOptions] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState(null);
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

  // Fetch initial data
  useEffect(() => {
    refetchList();
  }, [refetchList]);

  useEffect(() => {
    if (listData?.data) {
      const formattedSpecialization =
        listData.data.specializations?.map((u) => ({
          label: u.name || "—",
          value: u.id.toString(),
        })) || [];
      const formattedExperience = [
        { label: "No Experience", value: null },
        ...(listData.data.experince?.map((u) => ({
          label: u,
          value: u,
        })) || []),
      ];
      setSpecializationOptions(formattedSpecialization);
      setExperienceOptions(formattedExperience);
    }
  }, [listData]);

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
    if (selectedSpecializations.length === 0) {
      toast.error("Please select at least one specialization");
      return;
    }
    if (!selectedExperience) {
      toast.error("Please select an experience level");
      return;
    }
    const body = new FormData();
    body.append("first_name", firstName);
    body.append("last_name", lastName);
    body.append("email", emailOrUsername);
    body.append("phone", phone);
    body.append("password", password);
    selectedSpecializations.forEach((spec, index) => {
      body.append(`specialization[${index}]`, spec.value);
    });
    body.append("experience", selectedExperience.value);
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

  // Unified styles for react-select to match Input
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "0.75rem",
      borderColor: "rgba(59, 130, 246, 0.5)", // Match Input's border-bg-primary/50
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      padding: "0.75rem",
      minHeight: "56px",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(59, 130, 246, 0.5)" // Match Input's focus ring
        : "none",
      "&:hover": {
        borderColor: "rgba(59, 130, 246, 0.7)",
      },
      transition: "all 0.3s ease",
    }),
    placeholder: (base) => ({
      ...base,
      color: "rgba(59, 130, 246, 0.7)", // Match Input's placeholder
    }),
    menu: (base) => ({
      ...base,
      zIndex: 50,
      borderRadius: "0.75rem",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "rgba(59, 130, 246, 0.1)"
        : state.isFocused
          ? "rgba(59, 130, 246, 0.05)"
          : "transparent",
      color: "black",
      "&:hover": {
        backgroundColor: "rgba(59, 130, 246, 0.1)",
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderRadius: "0.5rem",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "rgba(59, 130, 246, 1)",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "rgba(59, 130, 246, 1)",
      "&:hover": {
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        color: "white",
      },
    }),
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-bg-primary/40 to-white bg-cover bg-center relative overflow-hidden py-4">

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
        className="relative z-10 max-w-lg w-full p-2"
      >
        <Card className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-bg-primary/50 overflow-hidden ring-1 ring-bg-primary/30">
          <CardContent className="p-4 md:p-6">
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-center mb-5"
            >
              <h2 className="text-4xl font-extrabold text-bg-primary tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-bg-primary to-blue-300">
                Mrfae
              </h2>
              <p className="text-gray-500 mt-2 text-base font-medium">
                Join the medical job platform
              </p>
            </motion.div>
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                    className="w-full p-3 pr-10 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70 placeholder-bg-primary/70"
                    disabled={loadingPost}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bg-primary">
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
                    className="w-full p-3 pr-10 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70 placeholder-bg-primary/70"
                    disabled={loadingPost}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bg-primary">
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
                  className="w-full p-3 pr-10 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70 placeholder-bg-primary/70"
                  disabled={loadingPost}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bg-primary">
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
                  className="w-full p-3 pr-10 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70 placeholder-bg-primary/70"
                  disabled={loadingPost}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bg-primary">
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
                  className="w-full p-3 pr-10 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70 placeholder-bg-primary/70"
                  disabled={loadingPost}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bg-primary">
                  <FaHeartbeat />
                </span>
              </motion.div>
              <motion.div
                className="relative z-30"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <Select
                  options={specializationOptions}
                  value={selectedSpecializations}
                  onChange={setSelectedSpecializations}
                  placeholder="Select Specializations"
                  isMulti
                  isLoading={loadingList}
                  isDisabled={loadingPost}
                  className="w-full"
                  classNamePrefix="select"
                  styles={selectStyles}
                />
              </motion.div>
              <motion.div
                className="relative z-20"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <Select
                  options={experienceOptions}
                  value={selectedExperience}
                  onChange={setSelectedExperience}
                  placeholder="Select Experience"
                  isLoading={loadingList}
                  isDisabled={loadingPost}
                  className="w-full"
                  classNamePrefix="select"
                  styles={selectStyles}
                />
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
            <p className="mt-3 text-center text-sm text-gray-500">
              Register as an Employer?{" "}
              <a
                href="https://employermrfae.mrfae.com/register"
                className="font-semibold text-blue-600 hover:underline hover:text-blue-700 transition-colors duration-200"
              >
                Employer Register
              </a>
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

export default RegisterUser;