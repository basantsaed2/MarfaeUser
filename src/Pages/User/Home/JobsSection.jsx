"use client";
import { useGet } from "@/Hooks/UseGet";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  FaWhatsapp,
  FaEnvelope,
  FaClock,
  FaMapMarkerAlt,
  FaShareAlt,
  FaArrowRight
} from "react-icons/fa";

// Import components
import ApplyJobDialog from "@/components/ApplyJobDialog";
import JobDetailsDialog from "@/components/JobDetailsDialog";
import ShareJobDialog from "@/components/ShareJobDialog";

const JobsSection = () => {
  const router = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // State for jobs
  const { refetch: refetchJobs, loading: loadingJobs, data: JobsData } = useGet({
    url: `${apiUrl}/guest/getAllJobs`,
  });
  const [Jobs, setJobs] = useState([]);

  // State for dialogs
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [jobToShare, setJobToShare] = useState(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');

  useEffect(() => {
    refetchJobs();
  }, [refetchJobs]);

  useEffect(() => {
    if (JobsData && JobsData.jobs) {
      setJobs(JobsData.jobs.slice(0, 6));
    }
  }, [JobsData]);

  // Handle apply job
  const handleApplyJob = (jobId, jobTitle) => {
    if (!user) {
      router("/login");
      return;
    }
    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle || '');
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

  const handleBrowseMore = () => {
    if (!user) {
      router("/login");
    } else {
      router("/jobs");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const headingVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  if (loadingJobs) return <div className="text-center py-10 text-xl text-gray-600">Loading....</div>;

  return (
    <section className="bg-gradient-to-br from-white">
      <div className="w-full px-4 md:px-6 lg:px-12 py-12 bg-gradient-to-b from-gray-50 to-white">
        <motion.h2
          className="text-2xl md:text-4xl font-extrabold mb-16 tracking-tight text-center text-gray-900 bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
          variants={headingVariants}
          initial="hidden"
          animate="visible"
        >
          Discover Your Dream Career
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {Jobs.map((job) => (
              <motion.div
                key={job.id}
                className="relative bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 bg-opacity-90 backdrop-blur-sm"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >

                <div className="flex items-start mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-inner overflow-hidden ring-2 ring-indigo-200">
                    {job.image_link ? (
                      <img
                        src={job.image_link}
                        alt={job.company.name}
                        className="rounded-full w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-indigo-600">
                        {job.company?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="ml-5">
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{job.company.name}</h3>
                    <p className="text-md text-gray-500 italic">{job.job_category.name}</p>
                  </div>
                </div>

                <hr className="my-6 border-gray-200/50" />
                <h4 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">{job.job_titel.name}</h4>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">{job.description}</p>
                <div className="flex items-center text-sm mb-6 flex-wrap gap-3">
                  <span className="flex items-center bg-indigo-50 text-indigo-700 font-medium px-4 py-2 rounded-full shadow-sm">
                    <FaClock className="w-4 h-4 mr-2 text-indigo-500" />
                    {job.type === "full_time" ? "Full Time" : "Part Time"}
                  </span>
                  <span className="flex items-center bg-purple-50 text-purple-700 font-medium px-4 py-2 rounded-full shadow-sm">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-purple-500" />
                    {job.city.name}, {job.city.country.name}
                  </span>
                </div>
                <div className="flex flex-col justify-between gap-y-4 mt-6">
                  <span className="text-xl font-extrabold text-indigo-600">{job.expected_salary} EGP</span>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => handleShareJob(job)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-full text-sm transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
                      aria-label="Share job"
                    >
                      <FaShareAlt className="w-4 h-4 mr-2" />
                      Share
                    </button>
                    <button
                      onClick={() => handleViewDetails(job)}
                      className="border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50 font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleApplyJob(job.id, job.job_titel?.name)}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-full text-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <div className="text-center mt-16">
          <button
            onClick={handleBrowseMore}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Browse More Opportunities
          </button>
        </div>
      </div>

      {/* Apply Job Dialog */}
      <ApplyJobDialog
        jobId={selectedJobId}
        jobTitle={selectedJobTitle}
        isOpen={isApplyDialogOpen}
        onOpenChange={setIsApplyDialogOpen}
      />

      {/* Job Details Dialog */}
      <JobDetailsDialog
        job={selectedJobDetails}
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        onApply={handleApplyJob}
      />

      {/* Share Job Dialog */}
      <ShareJobDialog
        job={jobToShare}
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
      />
    </section>
  );
};

export default JobsSection;