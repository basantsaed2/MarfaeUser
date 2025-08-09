"use client";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, useInView } from "framer-motion";

const CTA = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const ctaRef = useRef(null);
  const isCtaInView = useInView(ctaRef, { threshold: 0.3, once: false });

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
    hidden: { opacity: 0, x: 100, scale: 0.95 },
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

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");

  return (
    <section ref={ctaRef} className="py-16 bg-bg-primary text-white">
      <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6 tracking-tight"
          variants={titleVariants}
          initial="hidden"
          animate={isCtaInView ? "visible" : "hidden"}
        >
          Ready to Advance Your Medical Career?
        </motion.h2>
        <motion.p
          className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
          initial="hidden"
          animate={isCtaInView ? "visible" : "hidden"}
        >
          Join thousands of healthcare professionals who found their dream jobs through our platform.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate={isCtaInView ? "visible" : "hidden"}
        >
          {!user && (
            <>
              <motion.button
                onClick={handleRegister}
                className="bg-white text-blue-600 hover:bg-blue-100 font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                aria-label="Register Now"
              >
                Register Now
              </motion.button>
              <motion.button
                onClick={handleLogin}
                className="bg-transparent border-2 border-white hover:bg-white/20 font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                aria-label="Log In"
              >
                Log In
              </motion.button>
            </>
          )}
        </motion.div>

        {/* Powered by Link */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isCtaInView ? "visible" : "hidden"}
        >
          <p className="text-md text-white">
            Powered by{" "}
            <a
              href="https://connecttocode.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              ConnectToCode
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
