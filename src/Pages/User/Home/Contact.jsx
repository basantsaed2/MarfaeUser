"use client";
import React, { useRef } from "react";
import contactus from "@/assets/contactus.png";
import { usePost } from "@/Hooks/UsePost";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { Copy } from "lucide-react";

const Contact = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/user/sendMessage`,
  });
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = React.useState({
    full_name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [error, setError] = React.useState(null);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const contactRef = useRef(null);
  const isContactInView = useInView(contactRef, { threshold: 0.3, once: false });

  const { scrollY } = useScroll();
  const contactImageY = useTransform(scrollY, [1800, 2400], [0, 60]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9],
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, x: -100, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9],
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: [0.6, 0.05, 0.01, 0.9],
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.6, 0.05, 0.01, 0.9],
        type: "spring",
        stiffness: 120,
        damping: 20,
      },
    },
    hover: {
      scale: 1.15,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.9 },
  };

  return (
    <section ref={contactRef} className="py-5 lg:py-10 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center gap-20 md:gap-10">
          <motion.div
            className="lg:w-1/2"
            variants={imageVariants}
            initial="hidden"
            animate={isContactInView ? "visible" : "hidden"}
          >
            <motion.img
              src={contactus}
              alt="Contact us"
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
              style={{ y: contactImageY }}
              whileHover={{ scale: 1, rotate: 1, transition: { duration: 0.3 } }}
            />
          </motion.div>
          <motion.div
            className="lg:w-1/2"
            variants={containerVariants}
            initial="hidden"
            animate={isContactInView ? "visible" : "hidden"}
          >
            <motion.h2
              className="text-3xl font-bold text-gray-800 mb-6"
              variants={titleVariants}
            >
              Get In Touch With Us
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 mb-4"
              variants={itemVariants}
            >
              Have questions about our services or need career advice? Our team is ready to assist you with personalized guidance.
            </motion.p>
            <div className="space-y-4 mb-8">
              <motion.div
                className="flex items-center gap-3 group"
                variants={itemVariants}
                whileHover={{ x: 10, transition: { duration: 0.3 } }}
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
                whileHover={{ x: 10, transition: { duration: 0.3 } }}
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
                whileHover={{ x: 10, transition: { duration: 0.3 } }}
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
                >
                  <label htmlFor={field.id} className="block text-gray-700 mb-2">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <motion.textarea
                      id={field.id}
                      rows={field.rows}
                      value={formData[field.id]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={field.placeholder}
                      whileFocus={{ scale: 1.03, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <motion.input
                      type={field.type}
                      id={field.id}
                      value={formData[field.id]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={field.placeholder}
                      whileFocus={{ scale: 1.03, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              ))}
              <motion.button
                type="submit"
                disabled={loadingPost}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, ease: [0.6, 0.05, 0.01, 0.9] }}
                    className="text-green-600 mt-4"
                  >
                    {response.message}
                  </motion.p>
                )}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, ease: [0.6, 0.05, 0.01, 0.9] }}
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
  );
};

export default Contact;