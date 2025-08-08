"use client";
import React, { useRef } from "react";
import companyImage from "@/assets/company.png";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const Partners = () => {
  const partnersRef = useRef(null);
  const isPartnersInView = useInView(partnersRef, { threshold: 0.3, once: false });

  const { scrollY } = useScroll();
  const partnersImageY = useTransform(scrollY, [1200, 1800], [0, 80]);

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

  return (
    <section ref={partnersRef} className="py-10 bg-gray-100">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <motion.div
            className="lg:w-1/2"
            variants={imageVariants}
            initial="hidden"
            animate={isPartnersInView ? "visible" : "hidden"}
          >
            <motion.img
              src={companyImage}
              alt="Medical facility"
              className="rounded-2xl shadow-lg w-full h-auto object-cover"
              style={{ y: partnersImageY }}
              whileHover={{ scale: 1, rotate: -1, transition: { duration: 0.3 } }}
            />
          </motion.div>
          <motion.div
            className="lg:w-1/2"
            variants={containerVariants}
            initial="hidden"
            animate={isPartnersInView ? "visible" : "hidden"}
          >
            <motion.h2
              className="text-3xl font-bold text-gray-800 mb-6"
              variants={titleVariants}
            >
              Trusted by Leading Healthcare Institutions
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 mb-8"
              variants={itemVariants}
            >
              We've established partnerships with over 500 hospitals, clinics, and research centers across the globe to bring you exclusive career opportunities.
            </motion.p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <motion.div
                  key={item}
                  className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center h-20"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.1,
                    rotate: index % 2 === 0 ? 5 : -5,
                    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <span className="text-gray-400 font-bold">Logo {item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Partners;