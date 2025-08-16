// "use client";
// import React, { useState, useRef } from "react";
// import companyImage from "@/assets/company.png";
// import doctor from "@/assets/doctor.png";
// import mainImage from "@/assets/mainImage.png";
// import contactus from "@/assets/contactus.png";
// import { usePost } from "@/Hooks/UsePost";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
// import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
// import { Copy } from "lucide-react";
// import { useGet } from "@/Hooks/UseGet";

// const Home = () => {
//   const apiUrl = import.meta.env.VITE_API_BASE_URL;
//   const { postData, loadingPost, response } = usePost({
//     url: `${apiUrl}/user/sendMessage`,
//   });
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.auth.user);

//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });
//   const [error, setError] = useState(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [copied, setCopied] = useState(false);

//   // Refs for scroll-triggered animations
//   const heroRef = useRef(null);
//   const featuresRef = useRef(null);
//   const partnersRef = useRef(null);
//   const contactRef = useRef(null);
//   const ReviewsRef = useRef(null);
//   const FooterRef = useRef(null);
//   const isHeroInView = useInView(heroRef, { threshold: 0.3, once: false });
//   const isFeaturesInView = useInView(featuresRef, { threshold: 0.3, once: false });
//   const isPartnersInView = useInView(partnersRef, { threshold: 0.3, once: false });
//   const isContactInView = useInView(contactRef, { threshold: 0.3, once: false });
//   const isReviewsInView = useInView(ReviewsRef, { threshold: 0.3, once: false });
//   const isFooterterInView = useInView(FooterterRef, { threshold: 0.3, once: false });

//   // Parallax effect for images
//   const { scrollY } = useScroll();
//   const heroImageY = useTransform(scrollY, [0, 600], [0, 120]);
//   const heroImageRotate = useTransform(scrollY, [0, 600], [0, 2]);
//   const featuresImageY = useTransform(scrollY, [600, 1200], [0, 100]);
//   const partnersImageY = useTransform(scrollY, [1200, 1800], [0, 80]);
//   const contactImageY = useTransform(scrollY, [1800, 2400], [0, 60]);
//   const ReviewsImageY = useTransform(scrollY, [2400, 3000], [0, 50]); // New parallax for Reviews image

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     setError(null);
//     setIsSubmitted(false);
//     const payload = { ...formData, key: !!user };
//     await postData(payload, "Your message has been sent successfully! We'll get back to you soon.");
//     setIsSubmitted(true);
//   };

//   const handleCopyPhone = async (phone) => {
//     try {
//       await navigator.clipboard.writeText(phone.replace(/\D/g, ""));
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error("Failed to copy:", err);
//     }
//   };

//   const handleBrowseJobs = () => {
//     if (!user) {
//       navigate("/login");
//     } else {
//       navigate("/jobs");
//     }
//   };

//   const handleLogin = () => {
//     navigate("/login");
//   };

//   const handleRegister = () => {
//     navigate("/register");
//   };

//   // Animation variants with creative, Rekrutalen-inspired effects
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         duration: 0.8,
//         ease: [0.6, 0.05, 0.01, 0.9],
//         staggerChildren: 0.15,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const titleVariants = (fromRight = true) => ({
//     hidden: { opacity: 0, x: fromRight ? 100 : -100, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       scale: 1,
//       transition: {
//         duration: 0.8,
//         ease: [0.6, 0.05, 0.01, 0.9],
//         type: "spring",
//         stiffness: 100,
//         damping: 20,
//       },
//     },
//   });

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         duration: 0.6,
//         ease: [0.6, 0.05, 0.01, 0.9],
//       },
//     },
//   };

//   const imageVariants = {
//     hidden: { opacity: 0, scale: 0.8, rotate: -5 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       rotate: 0,
//       transition: {
//         duration: 1,
//         ease: [0.6, 0.05, 0.01, 0.9],
//         type: "spring",
//         stiffness: 80,
//         damping: 15,
//       },
//     },
//   };

//   const buttonVariants = {
//     hidden: { opacity: 0, scale: 0.8, y: 20 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       y: 0,
//       transition: {
//         duration: 0.7,
//         ease: [0.6, 0.05, 0.01, 0.9],
//         type: "spring",
//         stiffness: 120,
//         damping: 20,
//       },
//     },
//     hover: {
//       scale: 1.15,
//       boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
//       transition: { duration: 0.3 },
//     },
//     tap: { scale: 0.9 },
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <section ref={heroRef} className="relative h-screen max-h-[600px] w-full overflow-hidden">
//         <motion.img
//           src={mainImage}
//           alt="Medical professionals working"
//           className="absolute inset-0 w-full h-full object-cover brightness-75"
//           style={{ y: heroImageY, rotate: heroImageRotate }}
//           variants={imageVariants}
//           initial="hidden"
//           animate={isHeroInView ? "visible" : "hidden"}
//         />
//         <motion.div
//           className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent flex items-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
//         >
//           <div className="container mx-auto px-6 lg:px-12">
//             <motion.div
//               className="max-w-2xl ml-auto text-right"
//               variants={containerVariants}
//               initial="hidden"
//               animate={isHeroInView ? "visible" : "hidden"}
//             >
//               <motion.h1
//                 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-xl"
//                 variants={titleVariants(true)}
//               >
//                 Discover Your Next Medical Career Opportunity
//               </motion.h1>
//               <motion.p
//                 className="text-xl text-white mb-8 drop-shadow-md"
//                 variants={itemVariants}
//               >
//                 Connecting healthcare professionals with top institutions worldwide
//               </motion.p>
//               <motion.button
//                 onClick={handleBrowseJobs}
//                 className="bg-white text-blue-800 hover:bg-blue-100 font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg"
//                 variants={buttonVariants}
//                 whileHover="hover"
//                 whileTap="tap"
//               >
//                 Browse Jobs
//               </motion.button>
//             </motion.div>
//           </div>
//         </motion.div>
//         <motion.div
//           className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
//           animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
//           transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
//         >
//           <div className="w-6 h-10 border-4 border-white rounded-full flex justify-center">
//             <motion.div
//               className="w-1 h-2 bg-white mt-2 rounded-full"
//               animate={{ y: [0, 5, 0] }}
//               transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
//             />
//           </div>
//         </motion.div>
//       </section>

//       {/* Features Section */}
//       <section ref={featuresRef} className="py-20 bg-white">
//         <div className="container mx-auto px-6 lg:px-12">
//           <motion.div
//             className="text-center mb-16"
//             variants={containerVariants}
//             initial="hidden"
//             animate={isFeaturesInView ? "visible" : "hidden"}
//           >
//             <motion.h2
//               className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
//               variants={titleVariants(false)}
//             >
//               Your Career Journey Starts Here
//             </motion.h2>
//             <motion.p
//               className="text-lg text-gray-600 max-w-2xl mx-auto"
//               variants={itemVariants}
//             >
//               We partner with leading healthcare providers to bring you the best opportunities in the medical field.
//             </motion.p>
//           </motion.div>
//           <div className="flex flex-col lg:flex-row gap-10 items-center">
//             <motion.div
//               className="lg:w-1/2 order-2 lg:order-1"
//               variants={containerVariants}
//               initial="hidden"
//               animate={isFeaturesInView ? "visible" : "hidden"}
//             >
//               <div className="bg-blue-700 p-10 rounded-2xl text-white h-full flex flex-col justify-center">
//                 <motion.h3
//                   className="text-2xl font-bold mb-4"
//                   variants={titleVariants(true)}
//                 >
//                   Why Choose Us?
//                 </motion.h3>
//                 <ul className="space-y-4">
//                   {[
//                     "Curated selection of premium medical positions",
//                     "Direct connections with hiring managers",
//                     "Personalized career guidance",
//                   ].map((text, index) => (
//                     <motion.li
//                       key={index}
//                       className="flex items-start"
//                       variants={itemVariants}
//                       whileHover={{ x: 10, scale: 1.03, transition: { duration: 0.3 } }}
//                     >
//                       <span className="bg-white text-blue-700 rounded-full p-1 mr-3 flex-shrink-0">
//                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                           <path
//                             fillRule="evenodd"
//                             d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                       </span>
//                       <span>{text}</span>
//                     </motion.li>
//                   ))}
//                 </ul>
//               </div>
//             </motion.div>
//             <motion.div
//               className="lg:w-1/2 order-1 lg:order-2"
//               variants={imageVariants}
//               initial="hidden"
//               animate={isFeaturesInView ? "visible" : "hidden"}
//             >
//               <motion.img
//                 src={doctor}
//                 alt="Doctor smiling"
//                 className="rounded-2xl shadow-xl w-full h-auto object-cover max-h-[500px]"
//                 style={{ y: featuresImageY }}
//                 whileHover={{ scale: 1.05, rotate: 2, transition: { duration: 0.3 } }}
//               />
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Partners Section */}
//       <section ref={partnersRef} className="py-20 bg-gray-100">
//         <div className="container mx-auto px-6 lg:px-12">
//           <div className="flex flex-col lg:flex-row items-center gap-10">
//             <motion.div
//               className="lg:w-1/2"
//               variants={imageVariants}
//               initial="hidden"
//               animate={isPartnersInView ? "visible" : "hidden"}
//             >
//               <motion.img
//                 src={companyImage}
//                 alt="Medical facility"
//                 className="rounded-2xl shadow-lg w-full h-auto object-cover"
//                 style={{ y: partnersImageY }}
//                 whileHover={{ scale: 1.05, rotate: -2, transition: { duration: 0.3 } }}
//               />
//             </motion.div>
//             <motion.div
//               className="lg:w-1/2"
//               variants={containerVariants}
//               initial="hidden"
//               animate={isPartnersInView ? "visible" : "hidden"}
//             >
//               <motion.h2
//                 className="text-3xl font-bold text-gray-800 mb-6"
//                 variants={titleVariants(true)}
//               >
//                 Trusted by Leading Healthcare Institutions
//               </motion.h2>
//               <motion.p
//                 className="text-lg text-gray-600 mb-8"
//                 variants={itemVariants}
//               >
//                 We've established partnerships with over 500 hospitals, clinics, and research centers across the globe to bring you exclusive career opportunities.
//               </motion.p>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 {[1, 2, 3, 4, 5, 6].map((item, index) => (
//                   <motion.div
//                     key={item}
//                     className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center h-20"
//                     variants={itemVariants}
//                     whileHover={{
//                       scale: 1.1,
//                       rotate: index % 2 === 0 ? 5 : -5,
//                       boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
//                       transition: { duration: 0.3 },
//                     }}
//                   >
//                     <span className="text-gray-400 font-bold">Logo {item}</span>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Contact Us Section */}
//       <section ref={contactRef} className="py-20 bg-white">
//         <div className="container mx-auto px-6 lg:px-12">
//           <div className="flex flex-col lg:flex-row items-center gap-10">
//             <motion.div
//               className="lg:w-1/2"
//               variants={imageVariants}
//               initial="hidden"
//               animate={isContactInView ? "visible" : "hidden"}
//             >
//               <motion.img
//                 src={contactus}
//                 alt="Contact us"
//                 className="rounded-2xl shadow-xl w-full h-auto object-cover"
//                 style={{ y: contactImageY }}
//                 whileHover={{ scale: 1.05, rotate: 2, transition: { duration: 0.3 } }}
//               />
//             </motion.div>
//             <motion.div
//               className="lg:w-1/2"
//               variants={containerVariants}
//               initial="hidden"
//               animate={isContactInView ? "visible" : "hidden"}
//             >
//               <motion.h2
//                 className="text-3xl font-bold text-gray-800 mb-6"
//                 variants={titleVariants(false)}
//               >
//                 Get In Touch With Us
//               </motion.h2>
//               <motion.p
//                 className="text-lg text-gray-600 mb-4"
//                 variants={itemVariants}
//               >
//                 Have questions about our services or need career advice? Our team is ready to assist you with personalized guidance.
//               </motion.p>
//               <div className="space-y-4 mb-8">
//                 <motion.div
//                   className="flex items-center gap-3 group"
//                   variants={itemVariants}
//                   whileHover={{ x: 10, transition: { duration: 0.3 } }}
//                 >
//                   <FiMail className="text-blue-700 text-xl" />
//                   <a
//                     href="mailto:support@medicalcareers.com"
//                     className="text-blue-700 hover:text-blue-900 transition-colors truncate max-w-[200px]"
//                   >
//                     support@medicalcareers.com
//                   </a>
//                 </motion.div>
//                 <motion.div
//                   className="flex items-center gap-3 group relative"
//                   variants={itemVariants}
//                   whileHover={{ x: 10, transition: { duration: 0.3 } }}
//                 >
//                   <FiPhone className="text-blue-700 text-xl" />
//                   <div className="flex items-center gap-2">
//                     <a
//                       href="https://wa.me/12345678900"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-700 hover:text-blue-900 transition-colors truncate max-w-[150px]"
//                     >
//                       +1 (234) 567-8900
//                     </a>
//                     <button
//                       onClick={() => handleCopyPhone("+12345678900")}
//                       className="p-1 text-blue-700 hover:text-blue-900 focus:outline-none"
//                       title="Copy phone number"
//                     >
//                       <Copy className="w-5 h-5" />
//                       <AnimatePresence>
//                         {copied && (
//                           <motion.span
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: 10 }}
//                             className="absolute left-0 top-8 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow"
//                             aria-live="polite"
//                           >
//                             Copied!
//                           </motion.span>
//                         )}
//                       </AnimatePresence>
//                     </button>
//                   </div>
//                 </motion.div>
//                 <motion.div
//                   className="flex items-start gap-3 group"
//                   variants={itemVariants}
//                   whileHover={{ x: 10, transition: { duration: 0.3 } }}
//                 >
//                   <FiMapPin className="text-blue-700 text-xl mt-1" />
//                   <a
//                     href="https://maps.google.com/?q=123+Innovation+Drive"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-700 hover:text-blue-900 transition-colors"
//                   >
//                     123 Innovation Drive
//                   </a>
//                 </motion.div>
//               </div>
//               <form className="space-y-4" onSubmit={handleSubmit}>
//                 {[
//                   { id: "full_name", label: "Your Name", type: "text", placeholder: "Enter your name" },
//                   { id: "email", label: "Email Address", type: "email", placeholder: "Enter your email" },
//                   { id: "subject", label: "Subject", type: "text", placeholder: "Enter your subject" },
//                   { id: "message", label: "Your Message", type: "textarea", placeholder: "How can we help you?", rows: 4 },
//                 ].map((field, index) => (
//                   <motion.div
//                     key={field.id}
//                     variants={itemVariants}
//                   >
//                     <label htmlFor={field.id} className="block text-gray-700 mb-2">
//                       {field.label}
//                     </label>
//                     {field.type === "textarea" ? (
//                       <motion.textarea
//                         id={field.id}
//                         rows={field.rows}
//                         value={formData[field.id]}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder={field.placeholder}
//                         whileFocus={{ scale: 1.03, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
//                         transition={{ duration: 0.3 }}
//                       />
//                     ) : (
//                       <motion.input
//                         type={field.type}
//                         id={field.id}
//                         value={formData[field.id]}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder={field.placeholder}
//                         whileFocus={{ scale: 1.03, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
//                         transition={{ duration: 0.3 }}
//                       />
//                     )}
//                   </motion.div>
//                 ))}
//                 <motion.button
//                   type="submit"
//                   disabled={loadingPost}
//                   className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md"
//                   variants={buttonVariants}
//                   whileHover="hover"
//                   whileTap="tap"
//                 >
//                   {loadingPost ? (
//                     <motion.span
//                       animate={{ rotate: 360 }}
//                       transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//                     >
//                       Sending...
//                     </motion.span>
//                   ) : (
//                     "Send Message"
//                   )}
//                 </motion.button>
//                 <AnimatePresence>
//                   {isSubmitted && response && (
//                     <motion.p
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 20 }}
//                       transition={{ duration: 0.4, ease: [0.6, 0.05, 0.01, 0.9] }}
//                       className="text-green-600 mt-4"
//                     >
//                       {response.message}
//                     </motion.p>
//                   )}
//                   {error && (
//                     <motion.p
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 20 }}
//                       transition={{ duration: 0.4, ease: [0.6, 0.05, 0.01, 0.9] }}
//                       className="text-red-600 mt-4"
//                     >
//                       {error}
//                     </motion.p>
//                   )}
//                 </AnimatePresence>
//               </form>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Reviews Section */}
//       <section ref={ReviewsRef} className="py-20 bg-white">
//         <div className="container mx-auto px-6 lg:px-12">
//           <motion.div
//             className="text-center mb-12"
//             variants={containerVariants}
//             initial="hidden"
//             animate={isReviewsw ? "visible" : "hidden"}
//           >
//             <motion.h2
//               className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative"
//               variants={titleVariants(true)}
//             >
//               <span className="inline-block mr-2 text-blue-600">★</span> What they say about us
//             </motion.h2>
//             <motion.p
//               className="text-lg text-gray-600 max-w-2xl mx-auto"
//               variants={itemVariants}
//             >
//               Platea hac pharetra commodo laoreet fringilla. Arcu libero elementum convallis facilisi erat eros duis facilisis viverra aliquam ridiculus senectus lectus conubia dictum.
//             </motion.p>
//           </motion.div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 quote: "From application to interview, Rekrutalen was there every step. I felt confident and supported throughout my job search!",
//                 rating: 5,
//                 author: "Jack Dexter",
//                 title: "Insurance Manager",
//                 image: "https://via.placeholder.com/50?text=JD",
//               },
//               {
//                 quote: "I got matched with a great company thanks to Rekrutalen. The process was smooth and fast. Best experience with a recruitment agency!",
//                 rating: 4,
//                 author: "William Hall",
//                 title: "Construction Mechanic",
//                 image: "https://via.placeholder.com/50?text=WH",
//               },
//               {
//                 quote: "Rekrutalen helped me land my dream job in just two weeks! Their team is super supportive and professional. Highly recommend!",
//                 rating: 5,
//                 author: "Maggie Ulrey",
//                 title: "PR Coordinator",
//                 image: "https://via.placeholder.com/50?text=MU",
//               },
//             ].map((testimonial, index) => (
//               <motion.div
//                 key={index}
//                 className="bg-blue-50 p-6 rounded-lg shadow-md text-center"
//                 variants={itemVariants}
//                 whileHover={{
//                   scale: 1.05,
//                   boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
//                   transition: { duration: 0.3 },
//                 }}
//               >
//                 <div className="mb-4 flex justify-center">
//                   <img
//                     src={testimonial.image}
//                     alt={`${testimonial.author} profile`}
//                     className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
//                   />
//                 </div>
//                 <div className="flex justify-center mb-4">
//                   {[...Array(testimonial.rating)].map((_, i) => (
//                     <span key={i} className="text-yellow-400 text-xl">★</span>
//                   ))}
//                   {[...Array(5 - testimonial.rating)].map((_, i) => (
//                     <span key={i} className="text-gray-300 text-xl">★</span>
//                   ))}
//                 </div>
//                 <p className="text-gray-700 mb-4 italic">&quot;{testimonial.quote}&quot;</p>
//                 <h4 className="font-semibold text-blue-800">{testimonial.author}</h4>
//                 <p className="text-gray-500 text-sm">{testimonial.title}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footerter Section */}
//       <section ref={FooterRef} className="py-16 bg-blue-800 text-white">
//         <div className="container mx-auto px-6 lg:px-12 text-center">
//           <motion.h2
//             className="text-3xl md:text-4xl font-bold mb-6"
//             variants={titleVariants(true)}
//             initial="hidden"
//             animate={isFooterterterterterInView ? "visible" : "hidden"}
//           >
//             Ready to Advance Your Medical Career?
//           </motion.h2>
//           <motion.p
//             className="text-xl mb-8 max-w-2xl mx-auto"
//             variants={itemVariants}
//             initial="hidden"
//             animate={isFooterterInView ? "visible" : "hidden"}
//           >
//             Join thousands of healthcare professionals who found their dream jobs through our platform.
//           </motion.p>
//           <motion.div
//             className="flex flex-col sm:flex-row justify-center gap-4"
//             variants={containerVariants}
//             initial="hidden"
//             animate={isFooterInView ? "visible" : "hidden"}
//           >
//             {!user && (
//               <>
//                 <motion.button
//                   onClick={handleRegister}
//                   className="bg-white text-blue-800 hover:bg-blue-100 font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg"
//                   variants={buttonVariants}
//                   whileHover="hover"
//                   whileTap="tap"
//                 >
//                   Register Now
//                 </motion.button>
//                 <motion.button
//                   onClick={handleLogin}
//                   className="bg-transparent border-2 border-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg"
//                   variants={buttonVariants}
//                   whileHover="hover"
//                   whileTap="tap"
//                 >
//                   LogIn
//                 </motion.button>
//               </>
//             )}
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;


"use client";
import React from "react";
import Hero from "./Hero";
import Features from "./Features";
import Partners from "./Partners";
import Contact from "./Contact";
import Reviews from "./Reviews";
import Footer from "./Footer";
import JobsSection from "./JobsSection";

const Home = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <Features />
      <Partners />
      <JobsSection />
      <Contact />
      <Reviews />
      <Footer />
    </div>
  );
};

export default Home;