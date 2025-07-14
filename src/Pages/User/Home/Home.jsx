"use client";
import React, { useState, useRef } from "react";
import companyImage from "@/assets/company.png";
import doctor from "@/assets/doctor.png";
import mainImage from "@/assets/mainImage.png";
import contactus from "@/assets/contactus.png";
import { usePost } from "@/Hooks/UsePost";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence, useInView, useScroll, useMotionValueEvent } from "framer-motion";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { Copy } from "lucide-react";

const Home = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/user/sendMessage`,
  });
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("down");

  // Refs for scroll-triggered animations
  const featuresRef = useRef(null);
  const partnersRef = useRef(null);
  const contactRef = useRef(null);
  const ctaRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, { threshold: 0.2, once: false });
  const isPartnersInView = useInView(partnersRef, { threshold: 0.2, once: false });
  const isContactInView = useInView(contactRef, { threshold: 0.2, once: false });
  const isCtaInView = useInView(ctaRef, { threshold: 0.2, once: false });

  // Scroll direction detection
  const { scrollY } = useScroll();
  const [lastScrollY, setLastScrollY] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrollDirection(latest > lastScrollY ? "down" : "up");
    setLastScrollY(latest);
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setError(null);
    setIsSubmitted(false);
    const payload = { ...formData, key: !!user };
    await postData(payload, "Your message has been sent successfully! We'll get back to you soon.");
    setIsSubmitted(true);
  };

  const handleCopyPhone = async (phone) => {
    try {
      await navigator.clipboard.writeText(phone.replace(/\D/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleBrowseJobs = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/jobs");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  // Animation variants for scroll direction - SIMPLIFIED FOR SCROLL UP
  const sectionVariants = {
    down: { opacity: 1, y: 0, scale: 1 }, // Elements animate in clearly when scrolling down
    // When scrolling up, just a subtle fade and slight upward shift
    up: { opacity: 0.8, y: -10, scale: 1 },
  };

  const itemVariants = {
    down: { opacity: 1, y: 0 }, // Items animate in clearly when scrolling down
    // When scrolling up, just a subtle fade and slight upward shift
    up: { opacity: 0.8, y: -5 },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen max-h-[600px] w-full overflow-hidden">
        <motion.img
          src={mainImage}
          alt="Medical professionals working"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              className="max-w-2xl ml-auto text-right"
              variants={sectionVariants}
              // Only apply scroll-direction animation if the section is in view, otherwise default to "up" state
              animate={scrollDirection === "down" ? "down" : "up"}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-xl"
                variants={itemVariants}
                // Only apply scroll-direction animation if the section is in view, otherwise default to "up" state
                animate={scrollDirection === "down" ? "down" : "up"}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Discover Your Next Medical Career Opportunity
              </motion.h1>
              <motion.p
                className="text-xl text-white mb-8 drop-shadow-md"
                variants={itemVariants}
                // Only apply scroll-direction animation if the section is in view, otherwise default to "up" state
                animate={scrollDirection === "down" ? "down" : "up"}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Connecting healthcare professionals with top institutions worldwide
              </motion.p>
              <motion.button
                onClick={handleBrowseJobs}
                className="bg-white text-blue-800 hover:bg-blue-100 font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg"
                variants={itemVariants}
                // Only apply scroll-direction animation if the section is in view, otherwise default to "up" state
                animate={scrollDirection === "down" ? "down" : "up"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Browse Jobs
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-4 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white mt-2 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            className="text-center mb-16"
            variants={sectionVariants}
            animate={isFeaturesInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Your Career Journey Starts Here
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We partner with leading healthcare providers to bring you the best opportunities in the medical field.
            </p>
          </motion.div>
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <motion.div
              className="lg:w-1/2 order-2 lg:order-1"
              variants={sectionVariants}
              animate={isFeaturesInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
              <div className="bg-blue-700 p-10 rounded-2xl text-white h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
                <ul className="space-y-4">
                  {[
                    "Curated selection of premium medical positions",
                    "Direct connections with hiring managers",
                    "Personalized career guidance",
                  ].map((text, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start"
                      variants={itemVariants}
                      animate={isFeaturesInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="bg-white text-blue-700 rounded-full p-1 mr-3 flex-shrink-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span>{text}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
            <motion.div
              className="lg:w-1/2 order-1 lg:order-2"
              variants={sectionVariants}
              animate={isFeaturesInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
              <img
                src={doctor}
                alt="Doctor smiling"
                className="rounded-2xl shadow-xl w-full h-auto object-cover max-h-[500px]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section ref={partnersRef} className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <motion.div
              className="lg:w-1/2"
              variants={sectionVariants}
              animate={isPartnersInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
              <img
                src={companyImage}
                alt="Medical facility"
                className="rounded-2xl shadow-lg w-full h-auto object-cover"
              />
            </motion.div>
            <motion.div
              className="lg:w-1/2"
              variants={sectionVariants}
              animate={isPartnersInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Trusted by Leading Healthcare Institutions
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We've established partnerships with over 500 hospitals, clinics, and research centers across the globe to bring you exclusive career opportunities.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item, index) => (
                  <motion.div
                    key={item}
                    className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center h-20"
                    variants={itemVariants}
                    animate={isPartnersInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-gray-400 font-bold">Logo {item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section ref={contactRef} className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <motion.div
              className="lg:w-1/2"
              variants={sectionVariants}
              animate={isContactInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
              <img
                src={contactus}
                alt="Contact us"
                className="rounded-2xl shadow-xl w-full h-auto object-cover"
              />
            </motion.div>
            <motion.div
              className="lg:w-1/2"
              variants={sectionVariants}
              animate={isContactInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Get In Touch With Us
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Have questions about our services or need career advice? Our team is ready to assist you with personalized guidance.
              </p>
              <div className="space-y-4 mb-8">
                <motion.div
                  className="flex items-center gap-3 group"
                  variants={itemVariants}
                  animate={isContactInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <FiMail className="text-blue-700 text-xl" />
                  <a
                    href="mailto:support@medicalcareers.com"
                    className="text-blue-700 hover:text-blue-900 transition-colors truncate max-w-[200px]"
                  >
                    support@medicalcareers.com
                  </a>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3 group relative"
                  variants={itemVariants}
                  animate={isContactInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <FiPhone className="text-blue-700 text-xl" />
                  <div className="flex items-center gap-2">
                    <a
                      href="https://wa.me/12345678900"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-900 transition-colors truncate max-w-[150px]"
                    >
                      +1 (234) 567-8900
                    </a>
                    <button
                      onClick={() => handleCopyPhone("+12345678900")}
                      className="p-1 text-blue-700 hover:text-blue-900 focus:outline-none"
                      title="Copy phone number"
                    >
                      <Copy className="w-5 h-5" />
                      <AnimatePresence>
                        {copied && (
                          <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-0 top-8 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow"
                            aria-live="polite"
                          >
                            Copied!
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start gap-3 group"
                  variants={itemVariants}
                  animate={isContactInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <FiMapPin className="text-blue-700 text-xl mt-1" />
                  <a
                    href="https://maps.google.com/?q=123+Innovation+Drive"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    123 Innovation Drive
                  </a>
                </motion.div>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {[
                  { id: "full_name", label: "Your Name", type: "text", placeholder: "Enter your name" },
                  { id: "email", label: "Email Address", type: "email", placeholder: "Enter your email" },
                  { id: "subject", label: "Subject", type: "text", placeholder: "Enter your subject" },
                  { id: "message", label: "Your Message", type: "textarea", placeholder: "How can we help you?", rows: 4 },
                ].map((field, index) => (
                  <motion.div
                    key={field.id}
                    variants={itemVariants}
                    animate={isContactInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  >
                    <label htmlFor={field.id} className="block text-gray-700 mb-2">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.id}
                        rows={field.rows}
                        value={formData[field.id]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        type={field.type}
                        id={field.id}
                        value={formData[field.id]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={field.placeholder}
                      />
                    )}
                  </motion.div>
                ))}
                <motion.button
                  type="submit"
                  disabled={loadingPost}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md"
                  variants={itemVariants}
                  animate={isContactInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.4, delay: 1 }}
                >
                  {loadingPost ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      Sending...
                    </motion.span>
                  ) : (
                    "Send Message"
                  )}
                </motion.button>
                <AnimatePresence>
                  {isSubmitted && response && (
                    <motion.p
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="text-green-600 mt-4"
                    >
                      {response.message}
                    </motion.p>
                  )}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="text-red-600 mt-4"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-16 bg-blue-800 text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            variants={sectionVariants}
            animate={isCtaInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Ready to Advance Your Medical Career?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
            animate={isCtaInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            Join thousands of healthcare professionals who found their dream jobs through our platform.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            variants={itemVariants}
            animate={isCtaInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          >
            {!user && (
              <>
                <motion.button
                  onClick={handleRegister}
                  className="bg-white text-blue-800 hover:bg-blue-100 font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Register Now
                </motion.button>
                <motion.button
                  onClick={handleLogin}
                  className="bg-transparent border-2 border-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  LogIn
                </motion.button>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;