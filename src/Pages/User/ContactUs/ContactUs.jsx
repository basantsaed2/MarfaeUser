"use client";
import { usePost } from "@/Hooks/UsePost";
import React, { useState, useEffect } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import { Copy } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";

const ContactUs = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/user/sendMessage`,
  });

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (response) {
      if (response.status === 200) {
        setIsSubmitted(true);
        setFormData({
          full_name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setError(response.message || "Something went wrong. Please try again.");
      }
    }
  }, [response]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitted(false);
    await postData(formData, "Your message has been sent successfully! We'll get back to you soon.");
  };

  const handleCopyPhone = async (phone) => {
    try {
      await navigator.clipboard.writeText(phone.replace(/\D/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-4 sm:px-6 lg:px-8 flex justify-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="w-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col-reverse md:flex-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        {/* Left Section: Contact Information & Branding */}
        <div className="md:w-1/3 bg-gradient-to-br from-purple-600 to-indigo-700 p-6 text-white flex flex-col justify-between">
          <div>
            <motion.h2
              className="text-3xl font-extrabold mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Get in Touch
            </motion.h2>
            <motion.p
              className="text-purple-100 text-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              We're here to help and answer any question you might have. We look forward to hearing from you!
            </motion.p>
            <div className="space-y-4">
              <motion.div
                className="flex items-center gap-3 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <FiMail className="text-purple-200 text-xl" />
                <a
                  href="mailto:Marfae@gmail.com"
                  className="text-purple-100 hover:text-white transition-colors truncate max-w-[200px]"
                >
                  Marfae@gmail.com
                </a>
              </motion.div>
              <motion.div
                className="flex items-center gap-3 group relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <FiPhone className="text-purple-200 text-xl" />
                <div className="flex items-center gap-2">
                  <a
                    href="https://wa.me/12345678900"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-100 hover:text-white transition-colors truncate max-w-[150px]"
                  >
                    +1 (234) 567-8900
                  </a>
                  <button
                    onClick={() => handleCopyPhone("+12345678900")}
                    className="p-1 text-purple-200 hover:text-white focus:outline-none"
                    title="Copy phone number"
                  >
                    <Copy className="w-5 h-5" />
                    {copied && (
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 top-8 bg-indigo-600 text-white text-xs px-2 py-1 rounded shadow"
                      >
                        Copied!
                      </motion.span>
                    )}
                  </button>
                </div>
              </motion.div>
              <motion.div
                className="flex items-start gap-3 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
              >
                <FiMapPin className="text-purple-200 text-xl mt-1" />
                <a
                  href="https://maps.google.com/?q=123+Innovation+Drive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-100 hover:text-white transition-colors"
                >
                  123 Innovation Drive
                </a>
              </motion.div>
            </div>
          </div>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <p className="text-sm text-purple-200">© 2025 Your Company. All rights reserved.</p>
          </motion.div>
        </div>

        {/* Right Section: Contact Form */}
        <div className="md:w-2/3 p-6">
          <motion.h2
            className="text-3xl font-bold text-gray-800 mb-6 px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Send Us a Message
          </motion.h2>
          <form onSubmit={handleSubmit} className="space-y-4 px-8">
            {[
              { idちな: true,
              id: "full_name",
              label: "Full Name",
              type: "text",
              placeholder: "Enter Full Name",
            },
            {
              id: "email",
              label: "Email Address",
              type: "email",
              placeholder: "email@example.com",
            },
            {
              id: "subject",
              label: "Subject",
              type: "text",
              placeholder: "Regarding a project inquiry...",
            },
            {
              id: "message",
              label: "Your Message",
              type: "textarea",
              placeholder: "Type your message here...",
              rows: 3,
            },
            ].map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    name={field.id}
                    rows={field.rows}
                    value={formData[field.id]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-y"
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder={field.placeholder}
                  />
                )}
              </motion.div>
            ))}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
              disabled={loadingPost}
            >
              {loadingPost ? (
                <motion.svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </motion.svg>
              ) : (
                <>
                  <FiSend className="mr-2" /> Send Message
                </>
              )}
            </motion.button>
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mt-4 p-4 rounded-lg bg-green-100 text-green-800 text-center font-medium"
                >
                  Your message has been sent successfully! We'll get back to you soon.
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mt-4 p-4 rounded-lg bg-red-100 text-red-800 text-center font-medium"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactUs;