"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import companyImage from "@/assets/company.png";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useGet } from "@/Hooks/UseGet";

const Partners = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // State for Companies
  const {
    refetch: refetchCompanies,
    loading: loadingCompanies,
    data: CompaniesData,
  } = useGet({
    url: `${apiUrl}/guest/getCompanies`,
  });

  const [allCompanies, setAllCompanies] = useState([]);
  const [displayedCompanies, setDisplayedCompanies] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const companiesPerBatch = 20;
  const animationDuration = 30;

  const partnersRef = useRef(null);
  const isPartnersInView = useInView(partnersRef, {
    threshold: 0.3,
    once: false,
  });

  const { scrollY } = useScroll();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const partnersImageY = useTransform(
    scrollY,
    [1200, 1800],
    [0, isMobile ? 20 : 80]
  );

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

  useEffect(() => {
    refetchCompanies();
  }, [refetchCompanies]);

  useEffect(() => {
    if (CompaniesData && CompaniesData.companies) {
      setAllCompanies(CompaniesData.companies);
      setDisplayedCompanies(CompaniesData.companies.slice(0, companiesPerBatch));
    }
  }, [CompaniesData]);

  const rotateBatch = useCallback(() => {
    if (allCompanies.length <= companiesPerBatch) return;

    setCurrentBatch(prev => {
      const nextBatch = (prev + 1) % Math.ceil(allCompanies.length / companiesPerBatch);
      const startIndex = nextBatch * companiesPerBatch;
      const endIndex = startIndex + companiesPerBatch;
      setDisplayedCompanies(allCompanies.slice(startIndex, endIndex));
      return nextBatch;
    });
  }, [allCompanies, companiesPerBatch]);

  useEffect(() => {
    if (allCompanies.length > companiesPerBatch) {
      const interval = setInterval(rotateBatch, animationDuration * 1000);
      return () => clearInterval(interval);
    }
  }, [allCompanies, companiesPerBatch, rotateBatch, animationDuration]);

  return (
    <section ref={partnersRef} className="py-10 bg-gray-100">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Left Side: Image */}
          <motion.div
            className="lg:w-1/2 w-full"
            variants={imageVariants}
            initial="hidden"
            animate={isPartnersInView ? "visible" : "hidden"}
          >
            <motion.img
              src={companyImage}
              alt="Medical facility"
              className="rounded-2xl shadow-lg w-full h-auto object-cover"
              whileHover={{
                scale: 1,
                rotate: -1,
                transition: { duration: 0.3 },
              }}
            />
          </motion.div>

          {/* Right Side: Content */}
          <motion.div
            className="lg:w-1/2 w-full"
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
              We've established partnerships with over {allCompanies.length} hospitals, clinics,
              and research centers across the globe to bring you exclusive
              career opportunities.
            </motion.p>

            {/* Companies Slider */}
            {displayedCompanies.length > 0 && (
              <div className="overflow-hidden">
                <motion.div
                  className="flex gap-6"
                  animate={{ x: ["100%", "-100%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: animationDuration,
                    ease: "linear",
                  }}
                >
                  {displayedCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="bg-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-4 min-w-[220px] hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                    >
                      {company.image_link ? (
                        <img
                          src={company.image_link}
                          alt={company.name}
                          className="w-12 h-12 object-cover rounded-full border border-gray-200 bg-gray-50"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-bg-primary/10 text-bg-primary font-bold text-lg border border-gray-200">
                          {company.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-gray-700 font-semibold whitespace-nowrap truncate">
                        {company.name}
                      </span>
                    </div>
                  ))}
                </motion.div>
                
                {/* Batch indicator */}
                {allCompanies.length > companiesPerBatch && (
                  <div className="flex justify-center mt-4">
                    <div className="flex gap-2">
                      {Array.from({ 
                        length: Math.ceil(allCompanies.length / companiesPerBatch) 
                      }).map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentBatch ? 'bg-bg-primary' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {loadingCompanies && (
              <div className="text-center text-gray-500">
                Loading companies...
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Partners;