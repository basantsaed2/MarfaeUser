"use client";
import { usePost } from "@/Hooks/UsePost";
import React, { useState, useEffect } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi"; // Importing icons for a cleaner look
import { AnimatePresence, motion } from "framer-motion"; // For subtle animations

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
    await postData(formData,"Your message has been sent successfully! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col-reverse md:flex-row">
        {/* Left Section: Contact Information & Branding */}
        <div className="md:w-1/3 bg-gradient-to-br from-purple-600 to-indigo-700 p-4 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-extrabold mb-4 leading-tight">
              Get in Touch
            </h2>
            <p className="text-purple-100 text-lg mb-8">
              We're here to help and answer any question you might have. We look
              forward to hearing from you!
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <FiMail className="text-purple-200 mr-3 text-xl" />
                <span>Marfae@gmail.com</span> {/* Replace with your actual email */}
              </div>
              <div className="flex items-center">
                <FiPhone className="text-purple-200 mr-3 text-xl" />
                <span>+1 (234) 567-8900</span> {/* Replace with your actual phone */}
              </div>
              <div className="flex items-start">
                <FiMapPin className="text-purple-200 mr-3 text-xl mt-1" />
                <span>
                  123 Innovation Drive
                </span>{" "}
                {/* Replace with your actual address */}
              </div>
            </div>
          </div>
          <div className="mt-8">
            {/* You can add social media icons or a small logo here */}
            <p className="text-sm text-purple-200">© 2025 Your Company. All rights reserved.</p>
          </div>
        </div>

        {/* Right Section: Contact Form */}
        <div className="md:w-2/3 p-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 px-8">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 px-8">
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                placeholder="Enter Full Name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                placeholder="Regarding a project inquiry..."
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="3"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-y"
                placeholder="Type your message here..."
              ></textarea>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
              disabled={loadingPost}
            >
              {loadingPost ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <>
                  <FiSend className="mr-2" /> Send Message
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-4 p-4 rounded-lg bg-green-100 text-green-800 text-center font-medium"
                >
                  Your message has been sent successfully! We'll get back to you soon.
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-4 p-4 rounded-lg bg-red-100 text-red-800 text-center font-medium"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;