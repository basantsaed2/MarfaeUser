import React from "react";
import { motion } from "framer-motion";
import Logo from "../../../assets/Logo.jpeg";
import image_one from "../../../assets/image_one.jpeg";
import image_two from "../../../assets/image_two.jpeg";
import image_three from "../../../assets/image_three.jpeg";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring", stiffness: 100, damping: 10 }
};

const slideInUp = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      {/* Hero Section with Parallax Effect */}
      <motion.section
        key="hero-section"
        initial="initial"
        animate="animate"
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img
            src={Logo}
            alt="Medical Professionals"
            className="w-full h-full object-contain transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60"></div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="relative container mx-auto px-6 text-center text-white"
        >
          <motion.div
            variants={bounceIn}
            className="inline-block mb-6"
          >
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
              Since 2009
            </span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Connecting <motion.span
              className="text-blue-300"
              animate={{
                color: ["#93c5fd", "#c7d2fe", "#93c5fd"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >Medical Talent</motion.span> with Opportunity
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed"
          >
            Building Egypt's largest medical professional community, one connection at a time
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              href="#for-job-seekers"
              className="bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Find Your Dream Job
            </motion.a>
            <motion.a
              href="#for-employers"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Hire Top Talent
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </motion.section>

      {/* Story Section - REMOVED once: true */}
      <motion.section
        key="story-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.3 }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeInLeft}
              className="relative"
            >
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl transform -rotate-3"
                whileHover={{ rotate: -1 }}
                transition={{ type: "spring", stiffness: 300 }}
              ></motion.div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <motion.h2
                  variants={fadeInUp}
                  className="text-4xl font-bold text-gray-800 mb-6"
                >
                  Our Story
                </motion.h2>
                <motion.div
                  variants={staggerContainer}
                  className="space-y-6 text-gray-700 leading-relaxed"
                >
                  <motion.p variants={fadeInUp} className="text-lg">
                    <strong className="text-blue-600">2009</strong> marked the beginning of our journey as one of the pioneering Facebook groups dedicated to medical professionals in Egypt.
                  </motion.p>
                  <motion.p variants={fadeInUp} className="text-lg">
                    Our vision was simple yet powerful: to create a platform where medical career candidates—from medical representatives and supervisors to district managers, area managers, business unit managers, product managers, marketing professionals, HR specialists, and general managers—could find suitable and promising career opportunities.
                  </motion.p>
                  <motion.p variants={fadeInUp} className="text-lg">
                    Through collective effort and unwavering support, we've grown into Egypt's largest medical professional community, where every member contributes to helping others succeed.
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInRight}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { number: "200K+", label: "Professional Members", color: "blue" },
                { number: "15+", label: "Years of Excellence", color: "purple" },
                { number: "1000+", label: "Companies Connected", color: "green" },
                { number: "50+", label: "Medical Specialties", color: "orange" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`bg-${stat.color}-50 rounded-2xl p-6 border border-${stat.color}-100 cursor-pointer`}
                >
                  <motion.div
                    className={`text-3xl font-bold text-${stat.color}-600 mb-2`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className={`text-gray-700 font-semibold`}>{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Vision & Mission - REMOVED once: true */}
      <motion.section
        key="vision-mission-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.3 }}
        className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 text-white"
      >
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Vision Card */}
            <motion.div
              variants={fadeInLeft}
              className="group relative"
            >
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"
                whileHover={{ scale: 1.02 }}
              ></motion.div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <motion.div
                  className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-2xl">👁️</span>
                </motion.div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <motion.p
                  className="text-blue-100 text-xl italic mb-4 leading-relaxed"
                  whileHover={{ scale: 1.02 }}
                >
                  "Innovative link with medical society"
                </motion.p>
                <p className="text-blue-200">
                  It's not about having ideas; it's about transforming vision into reality through actionable solutions.
                </p>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              variants={fadeInRight}
              className="group relative"
            >
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"
                whileHover={{ scale: 1.02 }}
              ></motion.div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <motion.div
                  className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-2xl">🎯</span>
                </motion.div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <motion.div
                  className="space-y-4 text-blue-200"
                  variants={staggerContainer}
                >
                  <motion.p variants={fadeInUp}>
                    To build a comprehensive platform that organizes and empowers the medical community through digital innovation.
                  </motion.p>
                  <motion.p variants={fadeInUp}>
                    To provide essential services including company insights, medical information, skill development resources, and seamless hiring solutions across all medical specialties.
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* For Job Seekers - REMOVED once: true */}
      <motion.section
        id="for-job-seekers"
        key="job-seekers-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.3 }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeInLeft}>
              <motion.div
                className="inline-block mb-6"
                variants={bounceIn}
              >
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Career Opportunities
                </span>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-4xl font-bold text-gray-800 mb-8"
              >
                Find Your Perfect Medical Career
              </motion.h2>

              <motion.div
                variants={fadeInUp}
                className="mb-8"
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Medical Roles We Serve:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Pharmacist", "Chemist", "Veterinarian", "Physical Therapist",
                    "Dentist", "Doctors", "Medical Reps", "Senior MR",
                    "Supervisor", "District Manager", "Area Manager", "BUM",
                    "GM", "Product Manager", "HR", "Sales Reps"
                  ].map((role, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center group"
                      variants={fadeInUp}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"
                        whileHover={{ scale: 1.5 }}
                      ></motion.div>
                      <span className="text-gray-700 group-hover:text-blue-600 transition-colors duration-300">{role}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={scaleIn}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100"
                whileHover={{ y: -5 }}
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Industry Sectors:</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Pharmaceutical Companies", "Pharmacies", "Laboratories",
                    "Veterinary Companies", "Veterinary Clinics", "Hospitals",
                    "Private Clinics", "Medical Sales"
                  ].map((sector, index) => (
                    <motion.span
                      key={index}
                      className="bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200 shadow-sm"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {sector}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeInRight}
              className="relative"
            >
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded-3xl transform rotate-3"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              ></motion.div>
              <motion.img
                src={image_one}
                alt="Medical Career Opportunities"
                className="relative rounded-2xl shadow-2xl w-full h-96 object-cover"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* For Employers - REMOVED once: true */}
      <motion.section
        id="for-employers"
        key="employers-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.3 }}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeInLeft}
              className="relative order-2 lg:order-1"
            >
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-green-200 to-blue-200 rounded-3xl transform -rotate-3"
                whileHover={{ rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              ></motion.div>
              <motion.img
                src={image_three}
                alt="Employer Solutions"
                className="relative rounded-2xl shadow-2xl w-full h-96 object-cover"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>

            <motion.div
              variants={fadeInRight}
              className="order-1 lg:order-2"
            >
              <motion.div
                className="inline-block mb-6"
                variants={bounceIn}
              >
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Hiring Solutions
                </span>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-4xl font-bold text-gray-800 mb-8"
              >
                Find Qualified Medical Professionals
              </motion.h2>

              <motion.div
                variants={staggerContainer}
                className="space-y-6 mb-8"
              >
                {[
                  "Your company operates in the medical field",
                  "You need qualified professionals for your organization",
                  "Access thousands of CVs from qualified medical specialists",
                  "Connect with 200,000+ professional members in our network"
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start group"
                    variants={fadeInUp}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div
                      className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </motion.div>
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                variants={scaleIn}
                className="bg-white rounded-2xl p-6 border border-green-200 shadow-lg"
                whileHover={{ y: -5 }}
              >
                <h4 className="text-xl font-bold text-gray-800 mb-3">Why Choose Medilinky?</h4>
                <p className="text-gray-600">
                  We provide the perfect bridge between qualified medical professionals and leading healthcare organizations.
                  Our platform ensures you find the right talent for your specific needs.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Values Section - REMOVED once: true */}
      <motion.section
        key="values-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.3 }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide our mission and define our community
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: "👥", title: "You First", desc: "Putting our community members at the forefront" },
              { icon: "🌱", title: "Continuous Development", desc: "Constantly evolving and improving ourselves" },
              { icon: "🤝", title: "Perfect Relationships", desc: "Building strong, meaningful connections" },
              { icon: "💎", title: "Honesty & Integrity", desc: "Maintaining transparency in all interactions" },
              { icon: "🚀", title: "Constructive Approach", desc: "Focusing on solutions and positive outcomes" },
              { icon: "🌍", title: "Inclusive Community", desc: "Welcoming professionals from all backgrounds" }
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="group text-center p-8 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl cursor-pointer"
              >
                <motion.div
                  className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  {value.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section - REMOVED once: true */}
      <motion.section
        key="cta-section"
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.3 }}
        className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white"
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Transform Your Medical Career?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto"
          >
            Join Egypt's largest medical professional community and unlock endless opportunities
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            <motion.a
              href="https://medilinky.com"
              className="bg-white text-blue-700 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl flex items-center space-x-3"
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Your Journey Today</span>
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </motion.svg>
            </motion.a>
          </motion.div>

          {/* <motion.div 
            variants={slideInUp}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto"
          >
            <motion.p 
              className="text-2xl font-bold mb-4"
              animate={{ 
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
            MEDILINKY
            </motion.p>
            <p className="text-xl text-blue-200">Innovation link with medical society</p>
            <p className="text-lg text-blue-300 mt-2">The only and perfect way you can select</p>
          </motion.div> */}
        </div>
      </motion.section>

      {/* Footer - REMOVED once: true */}
      <motion.footer
        key="footer-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        className="bg-gray-900 text-white py-12"
      >
        <div className="container mx-auto px-6">
          <div className="text-center">
            <motion.div
              className="flex justify-center items-center space-x-4 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <motion.img
                src={Logo}
                alt="MEDILINKY Logo"
                className="w-12 h-12 object-contain rounded"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              />
              <h3 className="text-2xl font-bold">MEDILINKY</h3>
            </motion.div>
            <p className="text-gray-400 mb-4">
              Medical Representatives For All Egypt • Connecting Professionals Since 2009
            </p>
            <p className="text-gray-500">
              &copy; 2024 MEDILINKY. All rights reserved. |
              <a href="https://medilinky.com" className="text-blue-400 hover:text-blue-300 ml-2">
                MEDILINKY.COM
              </a>
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default AboutUs;