"use client";
import React, { useRef } from "react";
import mainImage from "@/assets/mainImage.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const Hero = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { threshold: 0.3, once: false });

  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroImageRotate = useTransform(scrollY, [0, 600], [0, 2]);

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

  const handleBrowseJobs = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/jobs");
    }
  };

  return (
    <section ref={heroRef} className="relative h-screen max-h-[600px] w-full overflow-hidden">
      <motion.img
        src={mainImage}
        alt="Medical professionals working"
        className="absolute inset-0 w-full h-full object-cover brightness-75"
        style={{ y: heroImageY, rotate: heroImageRotate }}
        variants={imageVariants}
        initial="hidden"
        animate={isHeroInView ? "visible" : "hidden"}
      />
      {/* Updated gradient to use CSS primary color */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-bg-primary/40 to-transparent flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            className="max-w-2xl ml-auto text-right"
            variants={containerVariants}
            initial="hidden"
            animate={isHeroInView ? "visible" : "hidden"}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-xl"
              variants={titleVariants}
            >
              Discover Your Next Medical Career Opportunity
            </motion.h1>
            <motion.p
              className="text-xl text-white mb-8 drop-shadow-md"
              variants={itemVariants}
            >
              Connecting healthcare professionals with top institutions worldwide
            </motion.p>
            {/* Updated button to use CSS primary colors */}
            <motion.button
              onClick={handleBrowseJobs}
              className="bg-white text-bg-primary hover:bg-bg-primary/10 font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg border-2 border-transparent hover:border-bg-primary"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Browse Jobs
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border-4 border-white rounded-full flex justify-center">
          <motion.div
            className="w-1 h-2 bg-white mt-2 rounded-full"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;