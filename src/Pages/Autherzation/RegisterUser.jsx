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
import { FaStethoscope, FaHeartbeat, FaUserMd, FaSyringe, FaEye, FaEyeSlash, FaBriefcase, FaUsers, FaCamera, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useGet } from "@/Hooks/UseGet";
import Select from "react-select";

const RegisterUser = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchList, loading: loadingList, data: listData } = useGet({
    url: `${apiUrl}/get-specialization-experience`,
  });
  const { refetch: refetchRegion, loading: loadingRegion, data: regionData } = useGet({
    url: `${apiUrl}/city-country`,
  });
  const { postData, loadingPost: loadingPost, response } = usePost({ url: `${apiUrl}/registerUser` });
  const { postData: postOTP, loadingPost: loadingOTP, response: responseOTP } = usePost({
    url: `${apiUrl}/verifyOtp`,
  });

  // Tab state
  const [activeTab, setActiveTab] = useState("user");

  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [experienceOptions, setExperienceOptions] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Image upload states
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const otpInputs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch initial data
  useEffect(() => {
    refetchList();
    refetchRegion();
  }, [refetchList, refetchRegion]);

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
    if (regionData?.countries && regionData?.cities) {
      const formattedCountries = regionData.countries.map((country) => ({
        label: country.name,
        value: country.id.toString(),
      }));
      const formattedCities = regionData.cities.map((city) => ({
        label: city.name,
        value: city.id.toString(),
        countryId: city.country_id?.toString(),
      }));
      setCountries(formattedCountries);
      setCities(formattedCities);
    }
  }, [regionData]);

  // Filter cities when country selection changes
  useEffect(() => {
    if (selectedCountry && cities.length > 0) {
      const filtered = cities.filter(city => city.countryId === selectedCountry.value);
      setFilteredCities(filtered);
      setSelectedCity(null);
    } else {
      setFilteredCities([]);
      setSelectedCity(null);
    }
  }, [selectedCountry, cities]);

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
    if (!loadingOTP && responseOTP && responseOTP.status === 200) {
      dispatch(setUser(responseOTP?.data));
      localStorage.setItem("user", JSON.stringify(responseOTP?.data));
      localStorage.setItem("token", responseOTP?.data.token);
      const redirectTo = new URLSearchParams(location.search).get("redirect");
      navigate(redirectTo || "/login");
      setIsOtpModalOpen(false);
      toast.success("OTP verified successfully!");
    }
  }, [responseOTP, loadingOTP, navigate, dispatch]);

  // Image handling functions
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF)");
      return;
    }

    // // Validate file size (max 5MB)
    // const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    // if (file.size > maxSize) {
    //   toast.error("Image size should be less than 5MB");
    //   return;
    // }

    setProfileImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setProfileImage(null);
    setProfileImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // const convertImageToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       // Remove the data:image/...;base64, prefix if you only want the base64 string
  //       const base64String = reader.result.split(',')[1];
  //       resolve(base64String);
  //     };
  //     reader.onerror = error => reject(error);
  //   });
  // };

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   if (!emailOrUsername || !password || !firstName || !lastName || !phone) {
  //     toast.error("All fields are required");
  //     return;
  //   }
  //   if (selectedSpecializations.length === 0) {
  //     toast.error("Please select at least one specialization");
  //     return;
  //   }
  //   if (!selectedExperience) {
  //     toast.error("Please select an experience level");
  //     return;
  //   }

  //   setIsUploading(true);

  //   try {
  //     const body = new FormData();
  //     body.append("first_name", firstName);
  //     body.append("last_name", lastName);
  //     body.append("email", emailOrUsername);
  //     body.append("phone", phone);
  //     body.append("password", password);
  //     selectedSpecializations.forEach((spec, index) => {
  //       body.append(`specialization[${index}]`, spec.value);
  //     });
  //     body.append("experience", selectedExperience.value);
  //     if (selectedCountry) {
  //       body.append("country_id", selectedCountry.value);
  //     }
  //     if (selectedCity) {
  //       body.append("city_id", selectedCity.value);
  //     }

  //     // Add profile image as base64 if exists
  //     if (profileImage) {
  //       const base64Image = await convertImageToBase64(profileImage);
  //       body.append("image", base64Image);
  //     }

  //     await postData(body, "Please check your email for OTP");
  //   } catch (error) {
  //     toast.error("Error processing image. Please try again.");
  //     console.error("Image conversion error:", error);
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // keeps data:image/...;base64,
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

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

    setIsUploading(true);

    try {
      let base64Image = null;
      if (profileImage) {
        base64Image = await convertImageToBase64(profileImage);
      }

      const body = {
        first_name: firstName,
        last_name: lastName,
        email: emailOrUsername,
        phone: phone,
        password: password,
        specialization: selectedSpecializations.map(spec => spec.value),
        experience: selectedExperience.value,
        country_id: selectedCountry?.value,
        city_id: selectedCity?.value,
        image: base64Image, // includes data:image/...;base64,...
      };

      await postData(body, "Please check your email for OTP");
    } catch (error) {
      toast.error("Error processing image. Please try again.");
      console.error("Image conversion error:", error);
    } finally {
      setIsUploading(false);
    }
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "0.75rem",
      borderColor: "rgba(59, 130, 246, 0.5)",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      padding: "0.30rem",
      minHeight: "56px",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(59, 130, 246, 0.5)"
        : "none",
      "&:hover": {
        borderColor: "rgba(59, 130, 246, 0.7)",
      },
      transition: "all 0.3s ease",
    }),
    placeholder: (base) => ({
      ...base,
      color: "rgba(59, 130, 246, 0.7)",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      borderRadius: "0.75rem",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
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
      <div className="absolute inset-0 bg-[url('https://i.pinimg.com/1200x/0e/82/d4/0e82d4cbbfd783d3d7245fcb927dd358.jpg')] bg-cover bg-center opacity-40"></div>

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
        <Card className="bg-white/90 gap-0 backdrop-blur-xl shadow-2xl rounded-3xl border border-bg-primary/50 ring-1 ring-bg-primary/30 overflow-hidden">
          {/* Tab Header */}
          <div className="relative p-1">
            <div className="flex rounded-2xl bg-white/50 backdrop-blur-sm p-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("user")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 md:px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === "user"
                    ? "bg-gradient-to-r from-bg-primary to-blue-600 text-white shadow-lg"
                    : "text-bg-primary hover:bg-white/70"
                  }`}
              >
                <FaUserMd className="text-md md:text-lg" />
                Medical Professional
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("employer")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 md:px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === "employer"
                    ? "bg-gradient-to-r from-bg-primary to-blue-600 text-white shadow-lg"
                    : "text-bg-primary hover:bg-white/70"
                  }`}
              >
                <FaBriefcase className="text-md md:text-lg" />
                Employer
              </motion.button>
            </div>
          </div>

          <CardContent className="p-4 md:p-6">
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-center mb-5"
            >
              <h2 className="text-4xl font-extrabold text-bg-primary tracking-tight bg-clip-text bg-gradient-to-r from-bg-primary to-blue-300">
                Mrfae
              </h2>
              <AnimatePresence mode="wait">
                {activeTab === "user" ? (
                  <motion.p
                    key="user-subtitle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-500 mt-2 text-base font-medium"
                  >
                    Join the medical job platform
                  </motion.p>
                ) : (
                  <motion.p
                    key="employer-subtitle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-500 mt-2 text-base font-medium"
                  >
                    Find qualified medical professionals
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence mode="wait">
              {activeTab === "user" ? (
                <motion.div
                  key="user-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <form onSubmit={handleRegister} className="space-y-3">
                    {/* Profile Image Upload */}
                    <motion.div
                      className="flex justify-center mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-bg-primary/30 bg-white/80 flex items-center justify-center overflow-hidden cursor-pointer hover:border-bg-primary/50 transition-all duration-300">
                          {profileImagePreview ? (
                            <>
                              <img
                                src={profileImagePreview}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                              >
                                <FaTimes className="text-xs" />
                              </button>
                            </>
                          ) : (
                            <div
                              className="flex flex-col items-center justify-center text-bg-primary/60 hover:text-bg-primary transition-colors duration-200"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <FaCamera className="text-2xl mb-1" />
                              <span className="text-xs">Add Photo</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </motion.div>

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
                          className="w-full p-4 pr-10 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70 placeholder-bg-primary/70"
                          disabled={loadingPost || isUploading}
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
                          className="w-full p-4 pr-10 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70 placeholder-bg-primary/70"
                          disabled={loadingPost || isUploading}
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
                        className="w-full p-4 pr-10 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70 placeholder-bg-primary/70"
                        disabled={loadingPost || isUploading}
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
                        className="w-full p-4 pr-10 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70 placeholder-bg-primary/70"
                        disabled={loadingPost || isUploading}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bg-primary">
                        <FaSyringe />
                      </span>
                    </motion.div>

                    {/* Password field with toggle visibility */}
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 pr-20 border border-bg-primary/50 rounded-xl focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-300 bg-white/70 placeholder-bg-primary/70"
                        disabled={loadingPost || isUploading}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-12 top-1/2 -translate-y-1/2 text-bg-primary hover:text-blue-700 transition-colors duration-200 focus:outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-bg-primary">
                        <FaHeartbeat />
                      </span>
                    </motion.div>

                    {/* Specializations */}
                    <motion.div
                      className="relative"
                      style={{ zIndex: 50 }}
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
                        isDisabled={loadingPost || isUploading}
                        className="w-full"
                        classNamePrefix="select"
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                      />
                    </motion.div>

                    {/* Experience */}
                    <motion.div
                      className="relative"
                      style={{ zIndex: 40 }}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Select
                        options={experienceOptions}
                        value={selectedExperience}
                        onChange={setSelectedExperience}
                        placeholder="Select Experience"
                        isLoading={loadingList}
                        isDisabled={loadingPost || isUploading}
                        className="w-full"
                        classNamePrefix="select"
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                      />
                    </motion.div>

                    {/* Country */}
                    <motion.div
                      className="relative"
                      style={{ zIndex: 30 }}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Select
                        options={countries}
                        value={selectedCountry}
                        onChange={setSelectedCountry}
                        placeholder="Select Country"
                        isLoading={loadingRegion}
                        isDisabled={loadingPost || isUploading}
                        className="w-full"
                        classNamePrefix="select"
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                      />
                    </motion.div>

                    {/* City */}
                    <motion.div
                      className="relative"
                      style={{ zIndex: 20 }}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Select
                        options={filteredCities}
                        value={selectedCity}
                        onChange={setSelectedCity}
                        placeholder={selectedCountry ? "Select City" : "Select Country First"}
                        isLoading={loadingRegion}
                        isDisabled={loadingPost || isUploading || !selectedCountry}
                        className="w-full"
                        classNamePrefix="select"
                        styles={selectStyles}
                        menuPortalTarget={document.body}
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
                        disabled={loadingPost || isUploading}
                      >
                        {loadingPost || isUploading ? "Registering..." : "Register as Medical Professional"}
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
                </motion.div>
              ) : (
                <motion.div
                  key="employer-content"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-2"
                >
                  {/* Employer content remains the same */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-gradient-to-br from-bg-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <FaUsers className="text-white text-3xl" />
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-bg-primary mb-4"
                  >
                    Looking to Hire Medical Professionals?
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 mb-4 text-lg leading-relaxed"
                  >
                    Post jobs, find qualified medical staff, and build your healthcare team with ease.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a
                      href="https://employer.mrfae.com/register"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-bg-primary to-blue-600 text-white text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaBriefcase className="mr-3 text-xl group-hover:rotate-12 transition-transform duration-300" />
                      Register as Employer
                      <svg
                        className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Easy Job Posting</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Qualified Candidates</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
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