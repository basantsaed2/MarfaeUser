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