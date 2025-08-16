"use client";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { usePost } from "@/Hooks/UsePost";

const Footer = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const FooterRef = useRef(null);
  const isFooterInView = useInView(FooterRef, { threshold: 0.3, once: false });
  const { postData, loadingPost ,response} = usePost({
    url: `${apiUrl}/user/add-review`,
  });

  const [rate, setRate] = useState(0);
  const [hoverRate, setHoverRate] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRate = (value) => setRate(value);
  const handleHover = (value) => setHoverRate(value);
  const handleCommentChange = (e) => setComment(e.target.value);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please log in to submit a review.");
      return;
    }
    if (rate === 0) {
      setError("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please enter a comment.");
      return;
    }

    try {
      const reviewData = {
        userId: user.id,
        rate,
        comment,
      };
      await postData(reviewData);
      setSuccess("Review submitted!");
      setRate(0);
      setComment("");
      setError(null);
    } catch (err) {
      setError("Failed to submit review.");
      setSuccess(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.6, 0.05, 0.01, 0.9],
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.6, 0.05, 0.01, 0.9],
        type: "spring",
        stiffness: 120,
        damping: 15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.6, 0.05, 0.01, 0.9],
        type: "spring",
        stiffness: 130,
        damping: 15,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  const starVariants = {
    filled: {
      scale: 1.2,
      rotate: 10,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    empty: {
      scale: 1,
      rotate: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");

  return (
    <section
      ref={FooterRef}
      className="py-6 bg-gradient-to-b from-[var(--color-bg-primary)] via-[#2a3a51] to-[var(--color-bg-secondary)] text-[var(--color-white)]"
    >
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <motion.h2
          className="text-2xl md:text-3xl font-bold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-white)] to-[var(--color-bgBabyBlue)]"
          variants={titleVariants}
          initial="hidden"
          animate={isFooterInView ? "visible" : "hidden"}
        >
          Elevate Your Medical Career
        </motion.h2>

        <motion.p
          className="text-sm mb-3 max-w-md mx-auto leading-relaxed text-[var(--color-bgGray)]"
          variants={itemVariants}
          initial="hidden"
          animate={isFooterInView ? "visible" : "hidden"}
        >
          Join professionals finding their dream jobs with us.
        </motion.p>

        <motion.div
          className="flex flex-row justify-center gap-2 mb-4"
          variants={containerVariants}
          initial="hidden"
          animate={isFooterInView ? "visible" : "hidden"}
        >
          {!user && (
            <>
              <motion.button
                onClick={handleRegister}
                className="text-white bg-[var(--color-bgBabyBlue)] hover:text-[var(--color-bgBabyBlue)] hover:bg-[var(--color-white)] font-medium py-1 px-4 rounded-full text-sm transition-all duration-200 shadow-sm focus-visible:ring-2 focus-visible:ring-[var(--color-bgBabyBlue)] focus-visible:ring-offset-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Register
              </motion.button>
              <motion.button
                onClick={handleLogin}
                className="bg-transparent border border-[var(--color-bgBabyBlue)] hover:bg-[var(--color-bgBabyBlue)]/20 hover:text-[var(--color-bgBabyBlue)] font-medium py-1 px-4 rounded-full text-sm transition-all duration-200 shadow-sm focus-visible:ring-2 focus-visible:ring-[var(--color-bgBabyBlue)] focus-visible:ring-offset-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Log In
              </motion.button>
            </>
          )}
        </motion.div>

        {/* Review Form */}
        <motion.div
          className="mt-4 bg-[var(--color-bg-secondary)]/20 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-[var(--color-bgGray)]/30"
          variants={itemVariants}
          initial="hidden"
          animate={isFooterInView ? "visible" : "hidden"}
        >
          <h3 className="text-base font-semibold mb-1.5 text-white">
            Share Your Experience
          </h3>

          <AnimatePresence>
            {error && (
              <motion.p
                className="text-red-300 text-xs mb-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                className="text-green-300 text-xs mb-1.5"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {success}
              </motion.p>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmitReview} className="space-y-2">
            {/* Star Rating */}
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => handleHover(star)}
                  onMouseLeave={() => setHoverRate(0)}
                  className="focus:outline-none relative group"
                  aria-label={`Rate ${star}`}
                  variants={starVariants}
                  animate={star <= (hoverRate || rate) ? "filled" : "empty"}
                >
                  <svg
                    className="w-6 h-6 transition-all duration-200 ease-out"
                    fill={
                      star <= (hoverRate || rate)
                        ? "#FFD700"
                        : "var(--color-bgGray)"
                    }
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  {star <= (hoverRate || rate) && (
                    <div className="absolute inset-0 rounded-full bg-yellow-300/30 blur-sm" />
                  )}
                  <span className="absolute -top-10 text-xs bg-black text-white px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all duration-150">
                    {star} {star === 1 ? "Star" : "Stars"}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Comment Input */}
            <div className="relative">
              <textarea
                value={comment}
                onChange={handleCommentChange}
                placeholder="Your feedback..."
                className="w-full p-2 rounded-md bg-[var(--color-bg-primary)]/30 text-[var(--color-white)] border border-[var(--color-bgGray)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-bgBabyBlue)] placeholder-[var(--color-bgGray)] text-xs transition-all duration-200"
                rows="2"
                maxLength="500"
                disabled={loadingPost}
                aria-label="Review comment"
              />
              <span className="absolute bottom-1 right-2 text-[10px] text-[var(--color-bgGray)]">
                {comment.length}/500
              </span>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <motion.button
                type="submit"
                className="bg-[var(--color-bgBabyBlue)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-white)] font-medium py-1 px-5 rounded-full text-xs transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[var(--color-bgBabyBlue)] focus-visible:ring-offset-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                disabled={loadingPost}
              >
                {loadingPost ? (
                  <svg
                    className="animate-spin h-4 w-4 mx-auto text-white"
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
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3-3-3h4z"
                    ></path>
                  </svg>
                ) : (
                  "Submit"
                )}
              </motion.button>
            </div>

          </form>
        </motion.div>

        {/* Powered by */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isFooterInView ? "visible" : "hidden"}
          className="mt-4"
        >
          <p className="text-xs text-[var(--color-bgGray)]">
            Powered by{" "}
            <a
              href="https://connecttocode.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-bgBabyBlue)] transition-colors"
            >
              ConnectToCode
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Footer;
