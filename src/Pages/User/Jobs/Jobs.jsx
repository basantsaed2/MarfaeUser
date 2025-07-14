"use client";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { usePost } from "@/Hooks/UsePost";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import companyImage from '@/assets/company.png';
import { FiFilter, FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiSearch, FiCalendar, FiFileText, FiAward, FiXCircle } from "react-icons/fi";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence, useInView, useScroll, useMotionValueEvent } from "framer-motion";

// Custom styles for react-select to fix dropdown issues and control visible options
const customSelectStyles = {
  menu: (provided) => ({
    ...provided,
    maxHeight: '220px', // Adjusted to show approximately 5 options before scrolling
    overflowY: 'auto',  // Enables vertical scrolling
    zIndex: 9999,      // Ensures the dropdown appears above other elements
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '220px', // Keep consistent with menu for predictable scrolling
    overflowY: 'auto',  // Enables vertical scrolling for the list of options
  }),
  control: (provided) => ({
    ...provided,
    minHeight: '40px',
  }),
  option: (provided) => ({
    ...provided,
    // Add consistent padding to ensure more predictable option height
    padding: '10px 12px',
  }),
};

const Jobs = () => {
  const apiUrl = "https://backMarfea.marfaa-alex.com/api";
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
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [selectedCv, setSelectedCv] = useState(null);
  const [hasExperience, setHasExperience] = useState('');
  const [message, setMessage] = useState('');
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isFetchingPage, setIsFetchingPage] = useState(false);

  const { refetch: refetchList, loading: loadingList, data: listData } = useGet({
    url: `${apiUrl}/user/jobfilterids`,
  });

  const { refetch: refetchJobs, loading: loadingJobs, data: jobsData } = useGet({
    url: `${apiUrl}/user/getJobs`,
  });

  const { refetch: refetchCVS, loading: loadingCVS, data: cvsData } = useGet({
    url: `${apiUrl}/user/get-usercv`,
  });

  const { postData, loading: loadingPost, response: searchResponse } = usePost({
    url: `${apiUrl}/user/job-search`,
  });

  const { postData: postCv, loading: loadingPostCv, response: cvResponse } = usePost({
    url: `${apiUrl}/user/apply-job`,
  });

  const { postData: postSavedJob, loading: loadingPostSavedJob, response: savedJobResponse } = usePost({
    url: `https://backMarfea.marfaa-alex.com/api/user/save-job`,
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

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
  };

  // Fetch initial data
  useEffect(() => {
    refetchList();
    refetchJobs();
    refetchCVS();
  }, [refetchList, refetchJobs, refetchCVS]);

  // Process filter options with debugging
  useEffect(() => {
    if (listData) {
      console.log('Cities:', listData.cities);
      console.log('Companies:', listData.companies);
      console.log('Categories:', listData.job_categories);
      console.log('Titles:', listData.job_titles);
      console.log('Types:', listData.types);
      console.log('Experiences:', listData.experiences);
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

  // Handle apply job submission
  const handleApplyJob = async () => {
    if (!selectedJobId || !selectedCv) {
      alert('Please select a CV to apply with');
      return;
    }

    if (!hasExperience) {
      alert('Please specify if you have experience for this job');
      return;
    }

    try {
      const payload = {
        job_offer_id: selectedJobId,
        cv_file: selectedCv.cv_file_url,
        has_experience: hasExperience,
        message: message
      };

      await postCv(payload);

      setSelectedCv(null);
      setHasExperience('');
      setMessage('');
      setIsApplyDialogOpen(false);
      setSelectedJobId(null);

      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

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

  // Format experience and type labels
  const getExperienceLabel = (exp) => {
    switch (exp) {
      case 'fresh': return 'Fresh Graduate';
      case 'junior': return 'Junior';
      case 'mid': return 'Mid-Level';
      case 'senior': return 'Senior';
      case '+1 year': return '1+ Years';
      case '+2 years': return '2+ Years';
      case '+3 years': '3+ Years';
      default: return exp?.toUpperCase() || 'N/A';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'full_time': return 'Full Time';
      case 'part_time': return 'Part Time';
      case 'freelance': return 'Freelance';
      case 'internship': return 'Internship';
      case 'hybrid': return 'Hybrid';
      default: return type?.toUpperCase() || 'N/A';
    }
  };

  // Function to open job details dialog
  const openJobDetails = (job) => {
    setSelectedJobDetails(job);
    setIsDetailsDialogOpen(true);
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
                initial="hidden"
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
              <motion.div
                key={job.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={isJobsInView ? (scrollDirection === "down" ? "down" : "up") : "up"}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{job.job_title?.name || 'Unknown Position'}</h3>
                    <p className="text-gray-600">{job.company?.name || 'Unknown Company'}</p>
                  </div>
                  <button
                    onClick={() => toggleSavedJob(job)}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                    disabled={loadingPostSavedJob}
                  >
                    {job.is_saved === 1 ? (
                      <FaBookmark className="text-yellow-500 text-xl" />
                    ) : (
                      <FaRegBookmark className="text-xl" />
                    )}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <FiBriefcase className="mr-1" />
                    {getTypeLabel(job.type)}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <FiClock className="mr-1" />
                    {getExperienceLabel(job.experience)}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <FiMapPin className="mr-1" />
                    {job.city?.name || 'Unknown'}, {job.city?.country?.name || 'N/A'}
                  </span>
                  {job.expected_salary && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <FiDollarSign className="mr-1" />
                      {job.expected_salary} {job.city?.country?.name === 'Egypt' ? 'EGP' : ''}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-4 line-clamp-3">{job.description || 'No description available.'}</p>
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setIsApplyDialogOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Apply Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => openJobDetails(job)}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-full transition-all duration-300"
                  >
                    View Details
                  </Button>
                </div>
              </motion.div>
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

        {/* Job Details Dialog */}
        <Dialog.Root open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" style={{ overflow: 'visible' }} />
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50 DialogContent"
              style={{ overflowY: 'auto' }}
              aria-label="Job Details Dialog"
              aria-describedby="job-details-description"
            >
              {selectedJobDetails && (
                <>
                  <motion.div
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <Dialog.Title className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedJobDetails.job_title?.name || 'Job Details'}
                    </Dialog.Title>
                    <div className="flex items-center text-gray-600 mb-6">
                      <span className="font-semibold">{selectedJobDetails.company?.name}</span>
                      <span className="mx-2">•</span>
                      <span>{selectedJobDetails.city?.name}, {selectedJobDetails.city?.country?.name}</span>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-gray-700 text-sm mb-6">
                    <motion.div
                      className="flex items-center"
                      variants={itemVariants}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <FiAward className="text-blue-500 mr-2 text-lg" />
                      <strong>Experience:</strong> {getExperienceLabel(selectedJobDetails.experience)}
                    </motion.div>
                    <motion.div
                      className="flex items-center"
                      variants={itemVariants}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <FiBriefcase className="text-blue-500 mr-2 text-lg" />
                      <strong>Type:</strong> {getTypeLabel(selectedJobDetails.type)}
                    </motion.div>
                    <motion.div
                      className="flex items-center"
                      variants={itemVariants}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      <FiCalendar className="text-blue-500 mr-2 text-lg" />
                      <strong>Posted:</strong> {new Date(selectedJobDetails.created_at).toLocaleDateString()}
                    </motion.div>
                    {selectedJobDetails.expected_salary && (
                      <motion.div
                        className="flex items-center"
                        variants={itemVariants}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                      >
                        <FiDollarSign className="text-blue-500 mr-2 text-lg" />
                        <strong>Salary:</strong> {selectedJobDetails.expected_salary} {selectedJobDetails.city?.country?.name === 'Egypt' ? 'EGP' : ''}
                      </motion.div>
                    )}
                  </div>

                  <motion.div
                    className="mb-6"
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  >
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                      <FiFileText className="mr-2 text-xl" /> Job Description
                    </h4>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedJobDetails.description || 'No detailed description available.'}
                    </p>
                  </motion.div>

                  <motion.div
                    className="flex justify-end gap-3"
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                  >
                    <Button
                      onClick={() => toggleSavedJob(selectedJobDetails)}
                      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                      disabled={loadingPostSavedJob}
                    >
                      {selectedJobDetails.is_saved === 1 ? (
                        <FaBookmark className="text-white text-lg" />
                      ) : (
                        <FaRegBookmark className="text-white text-lg" />
                      )}
                      {selectedJobDetails.is_saved === 1 ? 'Unsave Job' : 'Save Job'}
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedJobId(selectedJobDetails.id);
                        setIsDetailsDialogOpen(false); // Close details dialog
                        setIsApplyDialogOpen(true); // Open apply dialog
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Apply Now
                    </Button>
                    <Dialog.Close asChild>
                      <Button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Close
                      </Button>
                    </Dialog.Close>
                  </motion.div>
                </>
              )}
            </motion.div>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Apply Job Dialog */}
        <Dialog.Root open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-full max-w-lg shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50 DialogContent"
              aria-label="Apply for Job Dialog"
            >
              <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">Apply for Job</Dialog.Title>
              <Dialog.Description className="text-gray-600 mb-6">
                Please provide your CV and details to apply for this position.
              </Dialog.Description>

              {loadingCVS && <FullPageLoader />}

              {!loadingCVS && cvsData?.usercv && cvsData.usercv.length > 0 ? (
                <div className="mb-4">
                  <label htmlFor="cvSelect" className="block text-gray-700 font-medium mb-2">Select your CV:</label>
                  <Select
                    id="cvSelect"
                    options={cvsData.usercv.map(cv => ({ value: cv.id, label: cv.file_name, cv_file_url: cv.cv_file_url }))}
                    onChange={setSelectedCv}
                    value={selectedCv}
                    placeholder="Choose your CV"
                    styles={customSelectStyles}
                  />
                </div>
              ) : (
                <div className="mb-4 text-center text-gray-600">
                  <p>No CVs found. Please upload a CV in your profile to apply.</p>
                  {/* Potentially add a link to upload CV */}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Do you have experience for this job?</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-600"
                      name="hasExperience"
                      value="1"
                      checked={hasExperience === "1"}
                      onChange={(e) => setHasExperience(e.target.value)}
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-600"
                      name="hasExperience"
                      value="0"
                      checked={hasExperience === "0"}
                      onChange={(e) => setHasExperience(e.target.value)}
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message (Optional):</label>
                <textarea
                  id="message"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a message to the employer..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleApplyJob}
                  disabled={loadingPostCv || !selectedCv || hasExperience === ''}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingPostCv ? 'Applying...' : 'Submit Application'}
                </Button>
                <Dialog.Close asChild>
                  <Button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Cancel
                  </Button>
                </Dialog.Close>
              </div>
            </motion.div>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

export default Jobs;