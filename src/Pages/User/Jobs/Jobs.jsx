// "use client";
// import FullPageLoader from "@/components/Loading";
// import { useGet } from "@/Hooks/UseGet";
// import { usePost } from "@/Hooks/UsePost";
// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import Select from "react-select";
// import companyImage from '@/assets/company.png';
// import { FiFilter, FiInfo, FiLink, FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiSearch, FiCalendar, FiFileText, FiAward, FiXCircle } from "react-icons/fi";
// import { FaRegBookmark, FaBookmark, FaShareAlt } from "react-icons/fa";
// import * as Dialog from '@radix-ui/react-dialog';
// import { motion, AnimatePresence, useInView, useScroll, useMotionValueEvent } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import {
//   FaWhatsapp,
//   FaEnvelope,
//   FaClock,
//   FaMapMarkerAlt,
//   FaCopy,
//   FaBriefcase,
//   FaTimes
// } from "react-icons/fa";
// import {
//   SiLinkedin,
//   SiFacebook,
// } from "react-icons/si";

// // Custom styles for react-select to fix dropdown issues and control visible options
// const customSelectStyles = {
//   menu: (provided) => ({
//     ...provided,
//     maxHeight: '220px', // Adjusted to show approximately 5 options before scrolling
//     overflowY: 'auto',  // Enables vertical scrolling
//     zIndex: 9999,      // Ensures the dropdown appears above other elements
//   }),
//   menuList: (provided) => ({
//     ...provided,
//     maxHeight: '220px', // Keep consistent with menu for predictable scrolling
//     overflowY: 'auto',  // Enables vertical scrolling for the list of options
//   }),
//   control: (provided) => ({
//     ...provided,
//     minHeight: '40px',
//   }),
//   option: (provided) => ({
//     ...provided,
//     // Add consistent padding to ensure more predictable option height
//     padding: '10px 12px',
//   }),
// };

// const Jobs = () => {
//   const apiUrl = import.meta.env.VITE_API_BASE_URL;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [allJobs, setAllJobs] = useState([]);
//   const [displayedJobs, setDisplayedJobs] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [nextPageUrl, setNextPageUrl] = useState(null);
//   const [prevPageUrl, setPrevPageUrl] = useState(null);
//   const [firstPageUrl, setFirstPageUrl] = useState(null);
//   const [lastPageUrl, setLastPageUrl] = useState(null);
//   const [filters, setFilters] = useState({
//     city_id: null,
//     company_id: null,
//     job_category_id: null,
//     job_title_id: null,
//     type: null,
//     experience: null,
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [savedJobs, setSavedJobs] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [titles, setTitles] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [experiences, setExperiences] = useState([]);
//   const [isFiltered, setIsFiltered] = useState(false);
//   const [selectedJobId, setSelectedJobId] = useState(null);
//   const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
//   const [selectedCv, setSelectedCv] = useState(null);
//   const [hasExperience, setHasExperience] = useState('');
//   const [message, setMessage] = useState('');
//   const [selectedJobDetails, setSelectedJobDetails] = useState(null);
//   const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
//   const [isFetchingPage, setIsFetchingPage] = useState(false);
//   const [isExpanded, setIsExpanded] = React.useState(false); // State to toggle description

//   const { refetch: refetchList, loading: loadingList, data: listData } = useGet({
//     url: `${apiUrl}/user/jobfilterids`,
//   });

//   const { refetch: refetchJobs, loading: loadingJobs, data: jobsData } = useGet({
//     url: `${apiUrl}/user/getJobs`,
//   });

//   const { refetch: refetchCVS, loading: loadingCVS, data: cvsData } = useGet({
//     url: `${apiUrl}/user/get-usercv`,
//   });

//   const { postData, loading: loadingPost, response: searchResponse } = usePost({
//     url: `${apiUrl}/user/job-search`,
//   });

//   const { postData: postCv, loading: loadingPostCv, response: cvResponse } = usePost({
//     url: `${apiUrl}/user/apply-job`,
//   });

//   const { postData: postSavedJob, loading: loadingPostSavedJob, response: savedJobResponse } = usePost({
//     url: `${apiUrl}/user/save-job`,
//   });

//   // Refs for scroll-triggered animations
//   const headerRef = useRef(null);
//   const filterBarRef = useRef(null);
//   const resultsRef = useRef(null);
//   const jobsRef = useRef(null);
//   const paginationRef = useRef(null);
//   const isHeaderInView = useInView(headerRef, { threshold: 0.2, once: false });
//   const isFilterBarInView = useInView(filterBarRef, { threshold: 0.2, once: false });
//   const isResultsInView = useInView(resultsRef, { threshold: 0.2, once: false });
//   const isJobsInView = useInView(jobsRef, { threshold: 0.2, once: false });
//   const isPaginationInView = useInView(paginationRef, { threshold: 0.2, once: false });

//   // Scroll direction detection
//   const { scrollY } = useScroll();
//   const [scrollDirection, setScrollDirection] = useState("down");
//   const [lastScrollY, setLastScrollY] = useState(0);

//   // State for share dialog
//   const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
//   const [jobToShare, setJobToShare] = useState(null);

//   useMotionValueEvent(scrollY, "change", (latest) => {
//     setScrollDirection(latest > lastScrollY ? "down" : "up");
//     setLastScrollY(latest);
//   });

//   // Animation variants
//   const sectionVariants = {
//     down: { opacity: 1, y: 0, scale: 1 },
//     up: { opacity: 0.9, y: 15, scale: 0.98 },
//   };

//   const itemVariants = {
//     down: { opacity: 1, y: 0 },
//     up: { opacity: 0.95, y: 10 },
//   };

//   const filterVariants = {
//     hidden: { height: 0, opacity: 0, overflow: "hidden" },
//     visible: { height: "auto", opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
//   };

//   const dialogVariants = {
//     hidden: { opacity: 0, scale: 0.95 },
//     visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
//     exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
//   };

//   // Fetch initial data
//   useEffect(() => {
//     refetchList();
//     refetchJobs();
//     refetchCVS();
//   }, [refetchList, refetchJobs, refetchCVS]);

//   // Process filter options with debugging
//   useEffect(() => {
//     if (listData) {
//       setCompanies(listData.companies?.map(c => ({ value: c.id, label: c.name })) || []);
//       setCities(listData.cities?.map(c => ({ value: c.id, label: c.name })) || []);
//       setCategories(listData.job_categories?.map(c => ({ value: c.id, label: c.name })) || []);
//       setTitles(listData.job_titels?.map(t => ({ value: t.id, label: t.name })) || []);
//       setTypes(listData.types?.map(t => ({ value: t, label: t.replace('_', ' ').toUpperCase() })) || []);
//       setExperiences(listData.experiences?.map(e => ({ value: e, label: e.toUpperCase() })) || []);
//     }
//   }, [listData]);

//   // Process initial jobs data
//   useEffect(() => {
//     if (jobsData?.jobs && !isFiltered) {
//       const jobsArray = Array.isArray(jobsData.jobs) ? jobsData.jobs : [];
//       setAllJobs(jobsArray);
//       setDisplayedJobs(jobsArray.slice(0, 20));
//       setTotalPages(1);
//       setNextPageUrl(null);
//       setPrevPageUrl(null);
//       setFirstPageUrl(null);
//       setLastPageUrl(null);
//     }
//   }, [jobsData, isFiltered]);

//   // Process search response
//   useEffect(() => {
//     if (searchResponse) {
//       const jobsArray = Array.isArray(searchResponse.data?.data) ? searchResponse.data?.data : [];
//       setAllJobs(jobsArray);
//       setDisplayedJobs(jobsArray);
//       setCurrentPage(searchResponse?.data.current_page || 1);
//       setTotalPages(searchResponse?.data.last_page || 1);
//       setNextPageUrl(searchResponse?.data.next_page_url);
//       setPrevPageUrl(searchResponse?.data.prev_page_url);
//       setFirstPageUrl(searchResponse?.data.first_page_url);
//       setLastPageUrl(searchResponse?.data.last_page_url);
//       setIsFiltered(true);
//     }
//   }, [searchResponse]);

//   // Handle apply job submission
//   const handleApplyJob = async () => {
//     if (!selectedJobId || !selectedCv) {
//       toast.error('Please select a CV to apply with');
//       return;
//     }

//     if (!hasExperience) {
//       toast.error('Please specify if you have experience for this job');
//       return;
//     }

//     try {
//       const payload = {
//         job_offer_id: selectedJobId,
//         cv_file: selectedCv.cv_file_url,
//         has_experience: hasExperience == 1 ? "yes" : "no",
//         message: message
//       };

//       await postCv(payload);

//       setSelectedCv(null);
//       setHasExperience('');
//       setMessage('');
//       setIsApplyDialogOpen(false);
//       setSelectedJobId(null);

//       toast.success('Application submitted successfully!');
//     } catch (error) {
//       console.error('Error applying for job:', error);
//       toast.error('Failed to submit application. Please try again.');
//     }
//   };

//   // Handle share functionality
//   const handleShareJob = (job) => {
//     setJobToShare(job);
//     setIsShareDialogOpen(true);
//   };

//   const generateJobUrl = (jobId) => {
//     // In a real app, this would be your actual domain
//     return `${window.location.origin}/jobs/${jobId}`;
//   };

//   const copyToClipboard = () => {
//     if (!jobToShare) return;

//     const shareText = `Check out this job opportunity: ${jobToShare.job_titel.name} at ${jobToShare.company.name} in ${jobToShare.city.name}, ${jobToShare.city.country.name}.`;
//     const jobUrl = generateJobUrl(jobToShare.id);
//     const fullText = `${jobUrl}`;

//     navigator.clipboard.writeText(fullText)
//       .then(() => {
//         toast.success('Job details copied to clipboard!');
//       })
//       .catch(err => {
//         console.error('Failed to copy: ', err);
//         toast.error('Failed to copy to clipboard');
//       });
//   };

//   const shareViaWhatsApp = () => {
//     if (!jobToShare) return;

//     const shareText = `Check out this job opportunity: ${jobToShare.job_titel.name} at ${jobToShare.company.name} in ${jobToShare.city.name}, ${jobToShare.city.country.name}.`;
//     const jobUrl = generateJobUrl(jobToShare.id);
//     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + jobUrl)}`;

//     window.open(whatsappUrl, '_blank');
//   };

//   const shareViaEmail = () => {
//     if (!jobToShare) return;

//     const shareText = `Check out this job opportunity: ${jobToShare.job_titel.name} at ${jobToShare.company.name} in ${jobToShare.city.name}, ${jobToShare.city.country.name}.`;
//     const jobUrl = generateJobUrl(jobToShare.id);
//     const emailSubject = `Job Opportunity: ${jobToShare.job_titel.name}`;
//     const emailBody = `${shareText}\n\nCheck it out: ${jobUrl}`;

//     window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
//   };

//   const shareViaSocial = (platform) => {
//     if (!jobToShare) return;

//     const shareText = `Check out this job opportunity: ${jobToShare.job_titel.name} at ${jobToShare.company.name}`;
//     const jobUrl = generateJobUrl(jobToShare.id);

//     let shareUrl;
//     switch (platform) {
//       case 'twitter':
//         shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(jobUrl)}`;
//         break;
//       case 'facebook':
//         shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}&quote=${encodeURIComponent(shareText)}`;
//         break;
//       case 'linkedin':
//         shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
//         break;
//       default:
//         return;
//     }

//     window.open(shareUrl, '_blank', 'width=600,height=400');
//   };

//   const shareViaNative = () => {
//     if (!jobToShare) return;

//     if (navigator.share) {
//       const shareText = `Check out this job opportunity: ${jobToShare.job_titel.name} at ${jobToShare.company.name} in ${jobToShare.city.name}, ${jobToShare.city.country.name}.`;
//       const jobUrl = generateJobUrl(jobToShare.id);

//       navigator.share({
//         title: jobToShare.job_titel.name,
//         text: shareText,
//         url: jobUrl,
//       })
//         .then(() => console.log('Shared successfully'))
//         .catch((error) => console.log('Error sharing:', error));
//     } else {
//       copyToClipboard();
//     }
//   };

//   // Handle filter changes
//   const handleFilterChange = (name, value) => {
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   // Apply filters
//   const applyFilters = async () => {
//     const payload = {
//       city_id: filters.city_id?.value || null,
//       company_id: filters.company_id?.value || null,
//       job_category_id: filters.job_category_id?.value || null,
//       job_title_id: filters.job_title_id?.value || null,
//       type: filters.type?.value || null,
//       experience: filters.experience?.value || null,
//     };
//     try {
//       await postData(payload);
//       setShowFilters(false);
//     } catch (error) {
//       console.error("Error applying filters:", error);
//     }
//   };

//   // Fetch jobs for a specific page
//   const fetchPage = async (url) => {
//     if (!url) return;
//     setIsFetchingPage(true);
//     const token = localStorage.getItem("token");
//     try {
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           city_id: filters.city_id?.value || null,
//           company_id: filters.company_id?.value || null,
//           job_category_id: filters.job_category_id?.value || null,
//           job_title_id: filters.job_title_id?.value || null,
//           type: filters.type?.value || null,
//           experience: filters.experience?.value || null,
//         }),
//       });
//       const data = await response.json();

//       setAllJobs(data.data || []);
//       setDisplayedJobs(data.data || []);
//       setCurrentPage(data.current_page || 1);
//       setTotalPages(data.last_page || 1);
//       setNextPageUrl(data.next_page_url);
//       setPrevPageUrl(data.prev_page_url);
//       setFirstPageUrl(data.first_page_url);
//       setLastPageUrl(data.last_page_url);
//     } catch (error) {
//       console.error("Error fetching page:", error);
//     } finally {
//       setIsFetchingPage(false);
//     }
//   };

//   // Handle pagination
//   const goToNextPage = () => {
//     if (nextPageUrl) {
//       fetchPage(nextPageUrl);
//     }
//   };

//   const goToPreviousPage = () => {
//     if (prevPageUrl) {
//       fetchPage(prevPageUrl);
//     } else if (firstPageUrl) {
//       fetchPage(firstPageUrl);
//     }
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setFilters({
//       city_id: null,
//       company_id: null,
//       job_category_id: null,
//       job_title_id: null,
//       type: null,
//       experience: null,
//     });
//     setCurrentPage(1);
//     setIsFiltered(false);
//     refetchJobs();
//   };

//   // Toggle saved job
//   const toggleSavedJob = async (job) => {
//     try {
//       const newSavedStatus = job.is_saved === 1 ? 0 : 1;
//       const payload = {
//         job_offer_id: job.id,
//         key: newSavedStatus,
//       };
//       await postSavedJob(payload);

//       setAllJobs(prev =>
//         prev.map(j =>
//           j.id === job.id ? { ...j, is_saved: newSavedStatus } : j
//         )
//       );
//       setDisplayedJobs(prev =>
//         prev.map(j =>
//           j.id === job.id ? { ...j, is_saved: newSavedStatus } : j
//         )
//       );

//       setSelectedJobDetails(prev =>
//         prev && prev.id === job.id ? { ...prev, is_saved: newSavedStatus } : prev
//       );
//     } catch (error) {
//       console.error("Error toggling saved job:", error);
//       alert('Failed to save/unsave job. Please try again.');
//     }
//   };

//   // Format experience and type labels
//   const getExperienceLabel = (exp) => {
//     switch (exp) {
//       case 'fresh': return 'Fresh Graduate';
//       case 'junior': return 'Junior';
//       case 'mid': return 'Mid-Level';
//       case 'senior': return 'Senior';
//       case '+1 year': return '1+ Years';
//       case '+2 years': return '2+ Years';
//       case '+3 years': '3+ Years';
//       default: return exp?.toUpperCase() || 'N/A';
//     }
//   };

//   const getTypeLabel = (type) => {
//     switch (type) {
//       case 'full_time': return 'Full Time';
//       case 'part_time': return 'Part Time';
//       case 'freelance': return 'Freelance';
//       case 'internship': return 'Internship';
//       case 'hybrid': return 'Hybrid';
//       default: return type?.toUpperCase() || 'N/A';
//     }
//   };

//   // Function to open job details dialog
//   const openJobDetails = (job) => {
//     setSelectedJobDetails(job);
//     setIsDetailsDialogOpen(true);
//   };

//   if (loadingList || loadingJobs || loadingPostSavedJob) {
//     return <FullPageLoader />;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {(loadingPost || isFetchingPage) && <FullPageLoader />}

//       {/* Header Section */}
//       <section ref={headerRef} className="w-full h-64 relative">
//         <img
//           src={companyImage}
//           alt="Jobs Banner"
//           className="object-cover md:object-fill h-full w-full"
//         />
//         <div className="absolute inset-0 flex flex-col items-center justify-center">
//           <motion.h1
//             className="text-4xl font-bold text-white drop-shadow-lg"
//             variants={itemVariants}
//             initial={{ opacity: 0, y: 20 }}
//             animate={isHeaderInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
//             transition={{ duration: 0.6, delay: 0.3 }}
//           >
//             Find Your Dream Job
//           </motion.h1>
//           <motion.p
//             className="text-xl text-white/90 max-w-2xl mx-auto"
//             variants={itemVariants}
//             initial={{ opacity: 0, y: 20 }}
//             animate={isHeaderInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
//             transition={{ duration: 0.6, delay: 0.4 }}
//           >
//             Browse through thousands of full-time and part-time jobs near you
//           </motion.p>
//         </div>
//       </section>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         {/* Filter Bar */}
//         <motion.div
//           ref={filterBarRef}
//           className="mb-8 bg-white rounded-lg shadow-md p-6"
//           variants={sectionVariants}
//           animate={isFilterBarInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
//           transition={{ duration: 0.5, ease: "easeOut" }}
//         >
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <motion.div
//               className="flex-1 relative"
//               variants={itemVariants}
//               animate={isFilterBarInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
//               transition={{ duration: 0.4, delay: 0.2 }}
//             >
//               <input
//                 type="text"
//                 placeholder="Search by job title, company, or keywords"
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//               <FiSearch className="absolute left-3 top-3 text-gray-400" />
//             </motion.div>
//             <motion.div
//               variants={itemVariants}
//               animate={isFilterBarInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
//               transition={{ duration: 0.4, delay: 0.3 }}
//             >
//               <Button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold py-2 px-6 rounded-full hover:from-blue-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
//               >
//                 <motion.span
//                   animate={{ rotate: showFilters ? 90 : 0 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <FiFilter />
//                 </motion.span>
//                 {showFilters ? 'Hide Filters' : 'Show Filters'}
//               </Button>
//             </motion.div>
//           </div>

//           {/* Filter Section */}
//           <AnimatePresence>
//             {showFilters && (
//               <motion.div
//                 variants={filterVariants}
//                 initial="auto"
//                 animate="visible"
//                 exit="hidden"
//                 className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
//               >
//                 {[
//                   { name: 'city_id', options: [{ value: null, label: 'All Cities' }, ...cities], placeholder: 'Select City' },
//                   { name: 'company_id', options: [{ value: null, label: 'All Companies' }, ...companies], placeholder: 'Select Company' },
//                   { name: 'job_category_id', options: [{ value: null, label: 'All Categories' }, ...categories], placeholder: 'Select Category' },
//                   { name: 'job_title_id', options: [{ value: null, label: 'All Titles' }, ...titles], placeholder: 'Select Title' },
//                   { name: 'type', options: [{ value: null, label: 'All Types' }, ...types], placeholder: 'Select Type' },
//                   { name: 'experience', options: [{ value: null, label: 'All Experiences' }, ...experiences], placeholder: 'Select Experience' },
//                 ].map((select, index) => (
//                   <motion.div
//                     key={select.name}
//                     variants={itemVariants}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 0.1 * index }}
//                   >
//                     <Select
//                       options={select.options}
//                       value={filters[select.name]}
//                       onChange={(selected) => handleFilterChange(select.name, selected)}
//                       placeholder={select.placeholder}
//                       isClearable
//                       styles={customSelectStyles}
//                     />
//                   </motion.div>
//                 ))}
//                 <motion.div
//                   className="flex gap-2"
//                   variants={itemVariants}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.4, delay: 0.6 }}
//                 >
//                   <Button
//                     onClick={applyFilters}
//                     disabled={loadingPost}
//                     className="relative bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold py-2 px-6 rounded-full hover:from-blue-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
//                   >
//                     <motion.span
//                       className="flex items-center gap-2"
//                       animate={{ scale: loadingPost ? 0.95 : 1 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <FiFilter className="group-hover:animate-pulse" />
//                       {loadingPost ? 'Applying...' : 'Apply Filters'}
//                     </motion.span>
//                   </Button>
//                   <Button
//                     onClick={resetFilters}
//                     className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg hover:animate-shake"
//                   >
//                     <FiXCircle className="inline mr-2" />
//                     Reset Filters
//                   </Button>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>

//         {/* Results Count */}
//         <motion.div
//           ref={resultsRef}
//           className="mb-6 flex justify-between items-center"
//           variants={sectionVariants}
//           animate={isResultsInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
//           transition={{ duration: 0.5, ease: "easeOut" }}
//         >
//           <motion.h2
//             className="text-xl font-semibold text-gray-800"
//             variants={itemVariants}
//             animate={isResultsInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
//             transition={{ duration: 0.4, delay: 0.2 }}
//           >
//             {allJobs.length} {allJobs.length === 1 ? 'Job' : 'Jobs'} Found
//           </motion.h2>
//           {allJobs.length > 0 && (
//             <motion.div
//               className="text-sm text-gray-500"
//               variants={itemVariants}
//               animate={isResultsInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
//               transition={{ duration: 0.4, delay: 0.3 }}
//             >
//               Page {currentPage} of {totalPages}
//             </motion.div>
//           )}
//         </motion.div>

//         {/* Jobs List */}
//         <motion.div
//           ref={jobsRef}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//           variants={sectionVariants}
//           animate={isJobsInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
//           transition={{ duration: 0.5, ease: "easeOut" }}
//         >
//           {displayedJobs.length > 0 ? (
//             displayedJobs.map((job, index) => {
//               const isLongDescription = (job.description?.length || 0) > 150; // Threshold for truncation

//               return (
//                 <motion.div
//                   key={job.id}
//                   className="bg-white flex flex-col justify-between rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
//                   variants={itemVariants}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={isJobsInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
//                   transition={{ duration: 0.4, delay: 0.1 * index }}
//                 >
//                   <div>
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-xl font-bold text-gray-800">{job.job_titel?.name || 'Unknown Position'}</h3>
//                         <p className="text-gray-600">{job.company?.name || 'Unknown Company'}</p>
//                       </div>
//                       <button
//                         onClick={() => toggleSavedJob(job)}
//                         className="text-gray-400 hover:text-yellow-500 transition-colors"
//                         disabled={loadingPostSavedJob}
//                       >
//                         {job.is_saved === 1 ? (
//                           <FaBookmark className="text-yellow-500 text-xl" />
//                         ) : (
//                           <FaRegBookmark className="text-xl" />
//                         )}
//                       </button>
//                     </div>
//                     <div className="mt-3 flex flex-wrap gap-2">
//                       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         <FiBriefcase className="mr-1" />
//                         {getTypeLabel(job.type)}
//                       </span>
//                       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                         <FiClock className="mr-1" />
//                         {getExperienceLabel(job.experience)}
//                       </span>
//                       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//                         <FiMapPin className="mr-1" />
//                         {job.city?.name || 'Unknown'}, {job.city?.country?.name || 'N/A'}
//                       </span>
//                       {job.expected_salary && (
//                         <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
//                           <FiDollarSign className="mr-1" />
//                           {job.expected_salary} {job.city?.country?.name === 'Egypt' ? 'EGP' : ''}
//                         </span>
//                       )}
//                     </div>
//                     <div className="mt-4">
//                       <p
//                         className={`text-gray-600 transition-all duration-300 ${isExpanded ? '' : 'line-clamp-3'
//                           }`}
//                       >
//                         {job.description || 'No description available.'}
//                       </p>
//                       {isLongDescription && (
//                         <button
//                           onClick={() => setIsExpanded(!isExpanded)}
//                           className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors duration-200"
//                         >
//                           {isExpanded ? 'Read Less' : 'Read More'}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                   <div className="mt-4 flex gap-2">
//                     <button
//                       onClick={() => handleShareJob(job)}
//                       className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full text-sm transition-all duration-300 shadow-md hover:shadow-lg"
//                       aria-label="Share job"
//                     >
//                       <FaShareAlt className="w-4 h-4" />
//                     </button>
//                     <Button
//                       onClick={() => {
//                         setSelectedJobId(job.id);
//                         setIsApplyDialogOpen(true);
//                       }}
//                       className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
//                     >
//                       Apply Now
//                     </Button>
//                     <Button
//                       variant="outline"
//                       onClick={() => openJobDetails(job)}
//                       className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-full transition-all duration-300"
//                     >
//                       View Details
//                     </Button>
//                   </div>
//                 </motion.div>
//               );
//             })
//           ) : (
//             <motion.div
//               className="bg-white rounded-lg shadow-md p-8 text-center"
//               variants={itemVariants}
//               initial={{ opacity: 0, y: 20 }}
//               animate={isJobsInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
//               transition={{ duration: 0.4 }}
//             >
//               <h3 className="text-xl font-medium text-gray-700 mb-2">No jobs found</h3>
//               <p className="text-gray-500">
//                 {Object.values(filters).some(f => f !== null)
//                   ? "Try adjusting your filters to see more results."
//                   : "There are currently no jobs available. Please check back later."}
//               </p>
//               {Object.values(filters).some(f => f !== null) && (
//                 <Button
//                   onClick={resetFilters}
//                   className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:animate-shake"
//                 >
//                   <FiXCircle className="inline mr-2" />
//                   Reset all filters
//                 </Button>
//               )}
//             </motion.div>
//           )}
//         </motion.div>

//         {/* Pagination Controls */}
//         {totalPages > 1 && (
//           <motion.div
//             ref={paginationRef}
//             className="mt-8 flex justify-center gap-4"
//             variants={sectionVariants}
//             animate={isPaginationInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
//             transition={{ duration: 0.5, ease: "easeOut" }}
//           >
//             <Button
//               onClick={goToPreviousPage}
//               disabled={!prevPageUrl && currentPage === 1}
//               className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-2 px-6 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <motion.span
//                 animate={{ x: isFetchingPage ? 0 : -5 }}
//                 transition={{ repeat: isFetchingPage ? 0 : Infinity, repeatType: "reverse", duration: 0.3 }}
//               >
//                 ←
//               </motion.span>
//               Previous
//             </Button>
//             <Button
//               onClick={goToNextPage}
//               disabled={!nextPageUrl}
//               className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//               <motion.span
//                 animate={{ x: isFetchingPage ? 0 : 5 }}
//                 transition={{ repeat: isFetchingPage ? 0 : Infinity, repeatType: "reverse", duration: 0.3 }}
//               >
//                 →
//               </motion.span>
//             </Button>
//           </motion.div>
//         )}

//         {/* Job Details Dialog */}
//         <Dialog.Root open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
//           <Dialog.Portal>
//             <Dialog.Overlay className="fixed inset-0 bg-black/50" style={{ overflow: 'visible' }} />
//             <motion.div
//               variants={dialogVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50 DialogContent"
//               style={{ overflowY: 'auto' }}
//               aria-label="Job Details Dialog"
//               aria-describedby="job-details-description"
//             >
//               {selectedJobDetails && (
//                 <>
//                   <motion.div
//                     variants={itemVariants}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 0.2 }}
//                   >
//                     <Dialog.Title className="text-3xl font-bold text-gray-900 mb-2">
//                       {selectedJobDetails.job_titel?.name || 'Job Details'}
//                     </Dialog.Title>
//                     <div className="flex items-center text-gray-600 mb-6">
//                       <span className="font-semibold">{selectedJobDetails.company?.name}</span>
//                       <span className="mx-2">•</span>
//                       <span>{selectedJobDetails.city?.name}, {selectedJobDetails.city?.country?.name}</span>
//                     </div>
//                   </motion.div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-gray-700 text-sm mb-6">
//                     <motion.div className="flex items-center" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
//                       <FiAward className="text-blue-500 mr-2 text-lg" />
//                       <strong>Experience:</strong> {getExperienceLabel(selectedJobDetails.experience)}
//                     </motion.div>
//                     <motion.div className="flex items-center" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
//                       <FiBriefcase className="text-blue-500 mr-2 text-lg" />
//                       <strong>Type:</strong> {getTypeLabel(selectedJobDetails.type)}
//                     </motion.div>
//                     <motion.div className="flex items-center" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
//                       <FiCalendar className="text-blue-500 mr-2 text-lg" />
//                       <strong>Posted:</strong> {selectedJobDetails.created_at ? new Date(selectedJobDetails.created_at).toLocaleDateString() : 'Not specified'}
//                     </motion.div>
//                     {selectedJobDetails.expected_salary && (
//                       <motion.div className="flex items-center" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
//                         <FiDollarSign className="text-blue-500 mr-2 text-lg" />
//                         <strong>Salary:</strong> {selectedJobDetails.expected_salary} {selectedJobDetails.city?.country?.name === 'Egypt' ? 'EGP' : ''}
//                       </motion.div>
//                     )}
//                     <motion.div className="flex items-center" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.7 }}>
//                       <FiMapPin className="text-blue-500 mr-2 text-lg" />
//                       <strong>Zone:</strong> {selectedJobDetails.zone?.name || 'Not specified'}
//                     </motion.div>
//                     <motion.div className="flex items-center" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.8 }}>
//                       <FiCalendar className="text-blue-500 mr-2 text-lg" />
//                       <strong>Expiry Date:</strong> {selectedJobDetails.expire_date ? new Date(selectedJobDetails.expire_date).toLocaleDateString() : 'Not specified'}
//                     </motion.div>
//                   </div>
//                   <motion.div className="mb-6" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.9 }}>
//                     <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
//                       <FiFileText className="mr-2 text-xl" /> Job Description
//                     </h4>
//                     <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//                       {selectedJobDetails.description || 'No detailed description available.'}
//                     </p>
//                   </motion.div>
//                   <motion.div className="mb-6" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 1.0 }}>
//                     <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
//                       <FiInfo className="mr-2 text-xl" /> Qualifications
//                     </h4>
//                     <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//                       {selectedJobDetails.job_qualification?.name || 'No qualifications provided.'}
//                     </p>
//                   </motion.div>
//                   <motion.div className="mb-6" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 1.1 }}>
//                     <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
//                       <FiLink className="mr-2 text-xl" /> Location Link
//                     </h4>
//                     <a
//                       href={selectedJobDetails.location_link || '#'}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 hover:underline"
//                     >
//                       {selectedJobDetails.location_link || 'No location link provided.'}
//                     </a>
//                   </motion.div>
//                   <motion.div
//                     className="flex justify-end gap-3"
//                     variants={itemVariants}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: 1.2 }}
//                   >
//                     <Button
//                       onClick={() => toggleSavedJob(selectedJobDetails)}
//                       className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
//                       disabled={loadingPostSavedJob}
//                     >
//                       {selectedJobDetails.is_saved === 1 ? (
//                         <FaBookmark className="text-white text-lg" />
//                       ) : (
//                         <FaRegBookmark className="text-white text-lg" />
//                       )}
//                       {selectedJobDetails.is_saved === 1 ? 'Unsave Job' : 'Save Job'}
//                     </Button>
//                     <Button
//                       onClick={() => {
//                         setSelectedJobId(selectedJobDetails.id);
//                         setIsDetailsDialogOpen(false);
//                         setIsApplyDialogOpen(true);
//                       }}
//                       className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
//                     >
//                       Apply Now
//                     </Button>
//                     <Dialog.Close asChild>
//                       <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
//                         Close
//                       </Button>
//                     </Dialog.Close>
//                   </motion.div>
//                 </>
//               )}
//             </motion.div>
//           </Dialog.Portal>
//         </Dialog.Root>

//         {/* Apply Job Dialog */}
//         <Dialog.Root open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
//           <Dialog.Portal>
//             <Dialog.Overlay className="fixed inset-0 bg-black/50" />
//             <motion.div
//               variants={dialogVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-full max-w-lg shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50 DialogContent"
//               aria-label="Apply for Job Dialog"
//             >
//               <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">Apply for Job</Dialog.Title>
//               <Dialog.Description className="text-gray-600 mb-6">
//                 Please provide your CV and details to apply for this position.
//               </Dialog.Description>

//               {loadingCVS && <FullPageLoader />}

//               {!loadingCVS && cvsData?.userCv && cvsData?.userCv.length > 0 ? (
//                 <div className="mb-4">
//                   <label htmlFor="cvSelect" className="block text-gray-700 font-medium mb-2">
//                     Select your CV:
//                   </label>
//                   <Select
//                     options={cvsData?.userCv?.map((cv, index) => ({
//                       value: cv,
//                       label: `CV ${index + 1} (Uploaded: ${new Date(cv.created_at).toLocaleDateString()})`,
//                       cv_file_url: cv.cv_file_url,
//                     }))}
//                     value={
//                       selectedCv
//                         ? {
//                           value: selectedCv,
//                           label: `CV ${cvsData?.userCv?.findIndex(
//                             (cv) => cv === selectedCv
//                           ) + 1} (Uploaded: ${new Date(
//                             selectedCv.created_at
//                           ).toLocaleDateString()})`,
//                         }
//                         : null
//                     }
//                     onChange={(selected) => setSelectedCv(selected?.value)}
//                     placeholder="Select a CV"
//                     isClearable
//                   />
//                 </div>

//               ) : (
//                 <div className="mb-4 text-center text-gray-600">
//                   <p>No CVs found. Please upload a CV in your profile to apply.</p>
//                   {/* Potentially add a link to upload CV */}
//                 </div>
//               )}

//               <div className="mb-4">
//                 <label className="block text-gray-700 font-medium mb-2">Do you have experience for this job?</label>
//                 <div className="flex gap-4">
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       className="form-radio text-blue-600"
//                       name="hasExperience"
//                       value="1"
//                       checked={hasExperience === "1"}
//                       onChange={(e) => setHasExperience(e.target.value)}
//                     />
//                     <span className="ml-2 text-gray-700">Yes</span>
//                   </label>
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       className="form-radio text-blue-600"
//                       name="hasExperience"
//                       value="0"
//                       checked={hasExperience === "0"}
//                       onChange={(e) => setHasExperience(e.target.value)}
//                     />
//                     <span className="ml-2 text-gray-700">No</span>
//                   </label>
//                 </div>
//               </div>

//               {/* Conditional Message Fields */}
//               {hasExperience === "1" && (
//                 <div className="mb-6">
//                   <label htmlFor="experienceMessage" className="block text-gray-700 font-medium mb-2">
//                     Please describe your experience *
//                   </label>
//                   <textarea
//                     id="experienceMessage"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     rows="4"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Describe your relevant experience, skills, and achievements in this field..."
//                     required
//                   ></textarea>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Please provide specific details about your experience that relates to this job role.
//                   </p>
//                 </div>
//               )}

//               {hasExperience === "0" && (
//                 <div className="mb-6">
//                   <label htmlFor="motivationMessage" className="block text-gray-700 font-medium mb-2">
//                     Why are you interested in this role? *
//                   </label>
//                   <textarea
//                     id="motivationMessage"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     rows="4"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Tell us why you're interested in this position, what skills you can bring, and what motivates you to apply..."
//                     required
//                   ></textarea>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Share your motivation and enthusiasm for this opportunity.
//                   </p>
//                 </div>
//               )}

//               <div className="flex justify-end gap-3">
//                 <Button
//                   onClick={handleApplyJob}
//                   disabled={loadingPostCv || !selectedCv || hasExperience === '' || !message.trim()}
//                   className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {loadingPostCv ? 'Applying...' : 'Submit Application'}
//                 </Button>
//                 <Dialog.Close asChild>
//                   <Button
//                     className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
//                   >
//                     Cancel
//                   </Button>
//                 </Dialog.Close>
//               </div>
//             </motion.div>
//           </Dialog.Portal>
//         </Dialog.Root>

//         {/* Share Job Dialog */}
//         <Dialog.Root open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
//           <Dialog.Portal>
//             <Dialog.Overlay className="fixed inset-0 bg-black/50" />
//             <motion.div
//               variants={dialogVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-full max-w-md shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50"
//               aria-label="Share Job Dialog"
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <Dialog.Title className="text-2xl font-bold text-gray-900">Share Job</Dialog.Title>
//                 <Dialog.Close asChild>
//                   <button className="text-gray-500 hover:text-gray-700 transition-colors">
//                     <FaTimes className="w-5 h-5" />
//                   </button>
//                 </Dialog.Close>
//               </div>

//               {jobToShare && (
//                 <div className="mb-6">
//                   <div className="flex items-center mb-4">
//                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                       <span className="text-blue-600 text-lg font-semibold">{jobToShare.company.name.charAt(0)}</span>
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-gray-900">{jobToShare.job_titel.name}</h3>
//                       <p className="text-sm text-gray-600">{jobToShare.company.name}</p>
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                     <p className="text-sm text-gray-700 mb-2">
//                       <span className="font-medium">Location:</span> {jobToShare.city.name}, {jobToShare.city.country.name}
//                     </p>
//                     <p className="text-sm text-gray-700">
//                       <span className="font-medium">Salary:</span> {jobToShare.expected_salary} EGP
//                     </p>
//                   </div>

//                   <div className="bg-blue-50 p-3 rounded-lg mb-4">
//                     <p className="text-xs text-blue-700 break-all">
//                       Share URL: {generateJobUrl(jobToShare.id)}
//                     </p>
//                   </div>

//                   <p className="text-gray-600 text-sm mb-6">
//                     Share this job opportunity with your network.
//                   </p>
//                 </div>
//               )}

//               <div className="grid grid-cols-4 gap-3 mb-4">
//                 <button
//                   onClick={copyToClipboard}
//                   className="flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
//                   title="Copy to clipboard"
//                 >
//                   <FaCopy className="w-5 h-5 mb-2" />
//                   <span className="text-xs">Copy</span>
//                 </button>

//                 <button
//                   onClick={shareViaWhatsApp}
//                   className="flex flex-col items-center justify-center bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
//                   title="Share via WhatsApp"
//                 >
//                   <FaWhatsapp className="w-5 h-5 mb-2" />
//                   <span className="text-xs">WhatsApp</span>
//                 </button>

//                 <button
//                   onClick={shareViaEmail}
//                   className="flex flex-col items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
//                   title="Share via Email"
//                 >
//                   <FaEnvelope className="w-5 h-5 mb-2" />
//                   <span className="text-xs">Email</span>
//                 </button>

//                 <button
//                   onClick={shareViaNative}
//                   className="flex flex-col items-center justify-center bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
//                   title="Share via other apps"
//                 >
//                   <FaShareAlt className="w-5 h-5 mb-2" />
//                   <span className="text-xs">Other</span>
//                 </button>
//               </div>

//               <div className="border-t pt-4">
//                 <p className="text-sm text-gray-600 mb-3 text-center">Or share on social media</p>
//                 <div className="flex justify-center gap-3">
//                   <button
//                     onClick={() => shareViaSocial('facebook')}
//                     className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-full transition-all duration-300"
//                     title="Share on Facebook"
//                   >
//                     <SiFacebook className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => shareViaSocial('linkedin')}
//                     className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-full transition-all duration-300"
//                     title="Share on LinkedIn"
//                   >
//                     <SiLinkedin className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </Dialog.Portal>
//         </Dialog.Root>
//       </div>
//     </div>
//   );
// };

// export default Jobs;


"use client";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { usePost } from "@/Hooks/UsePost";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import companyImage from '@/assets/company.png';
import { FiFilter, FiXCircle, FiSearch } from "react-icons/fi";
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence, useInView, useScroll, useMotionValueEvent } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";

// Import components
import JobCard from "@/components/JobCard";
import ApplyJobDialog from "@/components/ApplyJobDialog";
import JobDetailsDialog from "@/components/JobDetailsDialog";
import ShareJobDialog from "@/components/ShareJobDialog";

// Custom styles for react-select to fix dropdown issues and control visible options
const customSelectStyles = {
  menu: (provided) => ({
    ...provided,
    maxHeight: '220px',
    overflowY: 'auto',
    zIndex: 9999,
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '220px',
    overflowY: 'auto',
  }),
  control: (provided) => ({
    ...provided,
    minHeight: '40px',
  }),
  option: (provided) => ({
    ...provided,
    padding: '10px 12px',
  }),
};

const Jobs = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const [allJobs, setAllJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [firstPageUrl, setFirstPageUrl] = useState(null);
  const [lastPageUrl, setLastPageUrl] = useState(null);
  const [filters, setFilters] = useState({
    city_id: null,
    company_id: null,
    job_category_id: null,
    job_title_id: null,
    type: null,
    experience: null,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [titles, setTitles] = useState([]);
  const [types, setTypes] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState(''); // Add this state
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isFetchingPage, setIsFetchingPage] = useState(false);
  const [jobToShare, setJobToShare] = useState(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const { refetch: refetchList, loading: loadingList, data: listData } = useGet({
    url: `${apiUrl}/user/jobfilterids`,
  });

  const { refetch: refetchJobs, loading: loadingJobs, data: jobsData } = useGet({
    url: `${apiUrl}/user/getJobs`,
  });

  const { postData, loading: loadingPost, response: searchResponse } = usePost({
    url: `${apiUrl}/user/job-search`,
  });

  const { postData: postSavedJob, loading: loadingPostSavedJob } = usePost({
    url: `${apiUrl}/user/save-job`,
  });

  // Refs for scroll-triggered animations
  const headerRef = useRef(null);
  const filterBarRef = useRef(null);
  const resultsRef = useRef(null);
  const jobsRef = useRef(null);
  const paginationRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { threshold: 0.2, once: false });
  const isFilterBarInView = useInView(filterBarRef, { threshold: 0.2, once: false });
  const isResultsInView = useInView(resultsRef, { threshold: 0.2, once: false });
  const isJobsInView = useInView(jobsRef, { threshold: 0.2, once: false });
  const isPaginationInView = useInView(paginationRef, { threshold: 0.2, once: false });

  // Scroll direction detection
  const { scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState("down");
  const [lastScrollY, setLastScrollY] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrollDirection(latest > lastScrollY ? "down" : "up");
    setLastScrollY(latest);
  });

  // Animation variants
  const sectionVariants = {
    down: { opacity: 1, y: 0, scale: 1 },
    up: { opacity: 0.9, y: 15, scale: 0.98 },
  };

  const itemVariants = {
    down: { opacity: 1, y: 0 },
    up: { opacity: 0.95, y: 10 },
  };

  const filterVariants = {
    hidden: { height: 0, opacity: 0, overflow: "hidden" },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Fetch initial data
  useEffect(() => {
    refetchList();
    refetchJobs();
  }, [refetchList, refetchJobs]);

  // Process filter options
  useEffect(() => {
    if (listData) {
      setCompanies(listData.companies?.map(c => ({ value: c.id, label: c.name })) || []);
      setCities(listData.cities?.map(c => ({ value: c.id, label: c.name })) || []);
      setCategories(listData.job_categories?.map(c => ({ value: c.id, label: c.name })) || []);
      setTitles(listData.job_titels?.map(t => ({ value: t.id, label: t.name })) || []);
      setTypes(listData.types?.map(t => ({ value: t, label: t.replace('_', ' ').toUpperCase() })) || []);
      setExperiences(listData.experiences?.map(e => ({ value: e, label: e.toUpperCase() })) || []);
    }
  }, [listData]);

  // Process initial jobs data
  useEffect(() => {
    if (jobsData?.jobs && !isFiltered) {
      const jobsArray = Array.isArray(jobsData.jobs) ? jobsData.jobs : [];
      setAllJobs(jobsArray);
      setDisplayedJobs(jobsArray.slice(0, 20));
      setTotalPages(1);
      setNextPageUrl(null);
      setPrevPageUrl(null);
      setFirstPageUrl(null);
      setLastPageUrl(null);
    }
  }, [jobsData, isFiltered]);

  // Process search response
  useEffect(() => {
    if (searchResponse) {
      const jobsArray = Array.isArray(searchResponse.data?.data) ? searchResponse.data?.data : [];
      setAllJobs(jobsArray);
      setDisplayedJobs(jobsArray);
      setCurrentPage(searchResponse?.data.current_page || 1);
      setTotalPages(searchResponse?.data.last_page || 1);
      setNextPageUrl(searchResponse?.data.next_page_url);
      setPrevPageUrl(searchResponse?.data.prev_page_url);
      setFirstPageUrl(searchResponse?.data.first_page_url);
      setLastPageUrl(searchResponse?.data.last_page_url);
      setIsFiltered(true);
    }
  }, [searchResponse]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = async () => {
    const payload = {
      city_id: filters.city_id?.value || null,
      company_id: filters.company_id?.value || null,
      job_category_id: filters.job_category_id?.value || null,
      job_title_id: filters.job_title_id?.value || null,
      type: filters.type?.value || null,
      experience: filters.experience?.value || null,
    };
    try {
      await postData(payload);
      setShowFilters(false);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  // Fetch jobs for a specific page
  const fetchPage = async (url) => {
    if (!url) return;
    setIsFetchingPage(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          city_id: filters.city_id?.value || null,
          company_id: filters.company_id?.value || null,
          job_category_id: filters.job_category_id?.value || null,
          job_title_id: filters.job_title_id?.value || null,
          type: filters.type?.value || null,
          experience: filters.experience?.value || null,
        }),
      });
      const data = await response.json();

      setAllJobs(data.data || []);
      setDisplayedJobs(data.data || []);
      setCurrentPage(data.current_page || 1);
      setTotalPages(data.last_page || 1);
      setNextPageUrl(data.next_page_url);
      setPrevPageUrl(data.prev_page_url);
      setFirstPageUrl(data.first_page_url);
      setLastPageUrl(data.last_page_url);
    } catch (error) {
      console.error("Error fetching page:", error);
    } finally {
      setIsFetchingPage(false);
    }
  };

  // Handle pagination
  const goToNextPage = () => {
    if (nextPageUrl) {
      fetchPage(nextPageUrl);
    }
  };

  const goToPreviousPage = () => {
    if (prevPageUrl) {
      fetchPage(prevPageUrl);
    } else if (firstPageUrl) {
      fetchPage(firstPageUrl);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      city_id: null,
      company_id: null,
      job_category_id: null,
      job_title_id: null,
      type: null,
      experience: null,
    });
    setCurrentPage(1);
    setIsFiltered(false);
    refetchJobs();
  };

  // Toggle saved job
  const toggleSavedJob = async (job) => {
    try {
      const newSavedStatus = job.is_saved === 1 ? 0 : 1;
      const payload = {
        job_offer_id: job.id,
        key: newSavedStatus,
      };
      await postSavedJob(payload);

      setAllJobs(prev =>
        prev.map(j =>
          j.id === job.id ? { ...j, is_saved: newSavedStatus } : j
        )
      );
      setDisplayedJobs(prev =>
        prev.map(j =>
          j.id === job.id ? { ...j, is_saved: newSavedStatus } : j
        )
      );

      setSelectedJobDetails(prev =>
        prev && prev.id === job.id ? { ...prev, is_saved: newSavedStatus } : prev
      );
    } catch (error) {
      console.error("Error toggling saved job:", error);
      alert('Failed to save/unsave job. Please try again.');
    }
  };

  // Handle apply job
  const handleApplyJob = (jobId, jobTitle) => {
    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle || ''); // Use empty string as fallback
    setIsApplyDialogOpen(true);
  };

  // Handle view details
  const handleViewDetails = (job) => {
    setSelectedJobDetails(job);
    setIsDetailsDialogOpen(true);
  };

  // Handle share job
  const handleShareJob = (job) => {
    setJobToShare(job);
    setIsShareDialogOpen(true);
  };

  if (loadingList || loadingJobs || loadingPostSavedJob) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {(loadingPost || isFetchingPage) && <FullPageLoader />}

      {/* Header Section */}
      <section ref={headerRef} className="w-full h-64 relative">
        <img
          src={companyImage}
          alt="Jobs Banner"
          className="object-cover md:object-fill h-full w-full"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.h1
            className="text-4xl font-bold text-white drop-shadow-lg"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Find Your Dream Job
          </motion.h1>
          <motion.p
            className="text-xl text-white/90 max-w-2xl mx-auto"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Browse through thousands of full-time and part-time jobs near you
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter Bar */}
        <motion.div
          ref={filterBarRef}
          className="mb-8 bg-white rounded-lg shadow-md p-6"
          variants={sectionVariants}
          animate={isFilterBarInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <motion.div
              className="flex-1 relative"
              variants={itemVariants}
              animate={isFilterBarInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <input
                type="text"
                placeholder="Search by job title, company, or keywords"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </motion.div>
            <motion.div
              variants={itemVariants}
              animate={isFilterBarInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold py-2 px-6 rounded-full hover:from-blue-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <motion.span
                  animate={{ rotate: showFilters ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiFilter />
                </motion.span>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </motion.div>
          </div>

          {/* Filter Section */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                variants={filterVariants}
                initial="auto"
                animate="visible"
                exit="hidden"
                className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {[
                  { name: 'city_id', options: [{ value: null, label: 'All Cities' }, ...cities], placeholder: 'Select City' },
                  { name: 'company_id', options: [{ value: null, label: 'All Companies' }, ...companies], placeholder: 'Select Company' },
                  { name: 'job_category_id', options: [{ value: null, label: 'All Categories' }, ...categories], placeholder: 'Select Category' },
                  { name: 'job_title_id', options: [{ value: null, label: 'All Titles' }, ...titles], placeholder: 'Select Title' },
                  { name: 'type', options: [{ value: null, label: 'All Types' }, ...types], placeholder: 'Select Type' },
                  { name: 'experience', options: [{ value: null, label: 'All Experiences' }, ...experiences], placeholder: 'Select Experience' },
                ].map((select, index) => (
                  <motion.div
                    key={select.name}
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <Select
                      options={select.options}
                      value={filters[select.name]}
                      onChange={(selected) => handleFilterChange(select.name, selected)}
                      placeholder={select.placeholder}
                      isClearable
                      styles={customSelectStyles}
                    />
                  </motion.div>
                ))}
                <motion.div
                  className="flex gap-2"
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <Button
                    onClick={applyFilters}
                    disabled={loadingPost}
                    className="relative bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold py-2 px-6 rounded-full hover:from-blue-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <motion.span
                      className="flex items-center gap-2"
                      animate={{ scale: loadingPost ? 0.95 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiFilter className="group-hover:animate-pulse" />
                      {loadingPost ? 'Applying...' : 'Apply Filters'}
                    </motion.span>
                  </Button>
                  <Button
                    onClick={resetFilters}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg hover:animate-shake"
                  >
                    <FiXCircle className="inline mr-2" />
                    Reset Filters
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Count */}
        <motion.div
          ref={resultsRef}
          className="mb-6 flex justify-between items-center"
          variants={sectionVariants}
          animate={isResultsInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.h2
            className="text-xl font-semibold text-gray-800"
            variants={itemVariants}
            animate={isResultsInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {allJobs.length} {allJobs.length === 1 ? 'Job' : 'Jobs'} Found
          </motion.h2>
          {allJobs.length > 0 && (
            <motion.div
              className="text-sm text-gray-500"
              variants={itemVariants}
              animate={isResultsInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              Page {currentPage} of {totalPages}
            </motion.div>
          )}
        </motion.div>

        {/* Jobs List */}
        <motion.div
          ref={jobsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={sectionVariants}
          animate={isJobsInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {displayedJobs.length > 0 ? (
            displayedJobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={(jobId) => handleApplyJob(jobId, job.job_titel?.name)}
                onViewDetails={handleViewDetails}
                onShare={handleShareJob}
                onSaveJob={toggleSavedJob}
                showSaveButton={true}
              />
            ))
          ) : (
            <motion.div
              className="bg-white rounded-lg shadow-md p-8 text-center"
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={isJobsInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xl font-medium text-gray-700 mb-2">No jobs found</h3>
              <p className="text-gray-500">
                {Object.values(filters).some(f => f !== null)
                  ? "Try adjusting your filters to see more results."
                  : "There are currently no jobs available. Please check back later."}
              </p>
              {Object.values(filters).some(f => f !== null) && (
                <Button
                  onClick={resetFilters}
                  className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:animate-shake"
                >
                  <FiXCircle className="inline mr-2" />
                  Reset all filters
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div
            ref={paginationRef}
            className="mt-8 flex justify-center gap-4"
            variants={sectionVariants}
            animate={isPaginationInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Button
              onClick={goToPreviousPage}
              disabled={!prevPageUrl && currentPage === 1}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-2 px-6 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <motion.span
                animate={{ x: isFetchingPage ? 0 : -5 }}
                transition={{ repeat: isFetchingPage ? 0 : Infinity, repeatType: "reverse", duration: 0.3 }}
              >
                ←
              </motion.span>
              Previous
            </Button>
            <Button
              onClick={goToNextPage}
              disabled={!nextPageUrl}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <motion.span
                animate={{ x: isFetchingPage ? 0 : 5 }}
                transition={{ repeat: isFetchingPage ? 0 : Infinity, repeatType: "reverse", duration: 0.3 }}
              >
                →
              </motion.span>
            </Button>
          </motion.div>
        )}

        {/* Apply Job Dialog */}
        <ApplyJobDialog
          jobId={selectedJobId}
          jobTitle={selectedJobTitle}
          isOpen={isApplyDialogOpen}
          onOpenChange={setIsApplyDialogOpen}
          onSuccess={() => {
            // Refresh jobs or show success message
          }}
        />

        {/* Job Details Dialog */}
        <JobDetailsDialog
          job={selectedJobDetails}
          isOpen={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          onApply={handleApplyJob}
          onSaveJob={toggleSavedJob}
          isSaved={selectedJobDetails?.is_saved === 1}
          isSaveLoading={loadingPostSavedJob}
        />

        {/* Share Job Dialog */}
        <ShareJobDialog
          job={jobToShare}
          isOpen={isShareDialogOpen}
          onOpenChange={setIsShareDialogOpen}
        />
      </div>
    </div>
  );
};

export default Jobs;