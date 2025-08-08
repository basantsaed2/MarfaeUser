"use client";
import React, { useRef } from "react";
import meeting from "@/assets/group.jpg";
import group from "@/assets/doctor.png"; // Replace with the second image source
import { motion, useInView } from "framer-motion";

const Features = () => {
  const featuresRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, { threshold: 0.3, once: false });

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
    hidden: { opacity: 0, x: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
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
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.9 },
  };

  const CheckIcon = () => (
    <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <section ref={featuresRef} className="py-10 bg-gray-50">
      <div className="container px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-center gap-30 md:gap-10">
          {/* Left Side: Images with Overlap */}
          <motion.div
            className="md:w-1/2 relative"
            variants={containerVariants}
            initial="hidden"
            animate={isFeaturesInView ? "visible" : "hidden"}
          >
            {/* Top Image */}
            <motion.img
              src={meeting}
              alt="People in a meeting"
              className="rounded-2xl shadow-xl w-4/6 h-34 md:h-64 object-cover"
              variants={itemVariants}
            />
            {/* Bottom Image with Overlap */}
            <motion.img
              src={group}
              alt="A group of smiling professionals"
              className="rounded-2xl shadow-xl w-4/6 h-34 md:h-64 object-cover absolute top-[70%] md:top-[40%] left-4/6 transform -translate-x-1/2 z-10"
              variants={itemVariants}
            />
          </motion.div>

          {/* Right Side: Text Content and Features */}
          <motion.div
            className="md:w-1/2"
            variants={containerVariants}
            initial="hidden"
            animate={isFeaturesInView ? "visible" : "hidden"}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              variants={titleVariants}
            >
              Smart Solutions for Smarter Career Moves
            </motion.h2>
            <motion.p
              className="text-gray-600 mb-8"
              variants={itemVariants}
            >
              Volutpat mus orci a maximus interdum adipiscing eleifend eros bibendum rutrum. Montes congue a orci habitant nascetur malesuada.
            </motion.p>
            <div className="space-y-6">
              {/* Feature 1 */}
              <motion.div className="flex gap-4 items-start" variants={itemVariants}>
                <div className="flex-shrink-0 mt-1">
                  <span className="flex items-center justify-center h-8 w-8 bg-blue-100 rounded-full text-blue-500">
                    <CheckIcon />
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">Thousands of jobs available</h4>
                  <p className="text-gray-600 mt-1">Lobortis nullam sagittis diam nostra ligula viverra suscipit. Vulputate natoque adipiscing tempus libero curae sagittis.</p>
                </div>
              </motion.div>
              {/* Feature 2 */}
              <motion.div className="flex gap-4 items-start" variants={itemVariants}>
                <div className="flex-shrink-0 mt-1">
                  <span className="flex items-center justify-center h-8 w-8 bg-blue-100 rounded-full text-blue-500">
                    <CheckIcon />
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">The right job for your skills</h4>
                  <p className="text-gray-600 mt-1">Lobortis nullam sagittis diam nostra ligula viverra suscipit. Vulputate natoque adipiscing tempus libero curae sagittis.</p>
                </div>
              </motion.div>
            </div>
            <motion.button
              className="mt-8 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Get To Know Us
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;