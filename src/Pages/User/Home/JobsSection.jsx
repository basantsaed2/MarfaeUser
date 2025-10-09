"use client";
import { useGet } from "@/Hooks/UseGet";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as Dialog from '@radix-ui/react-dialog';
import Select from 'react-select';
import { Button } from "@/components/ui/button";
import { usePost } from "@/Hooks/UsePost";
import { toast, ToastContainer } from "react-toastify";
import {
  FaWhatsapp,
  FaEnvelope,
  FaShareAlt,
  FaClock,
  FaMapMarkerAlt,
  FaCopy,
  FaBriefcase,
  FaTimes
} from "react-icons/fa";
import {
  SiLinkedin,
  SiFacebook,
} from "react-icons/si";
import { FiLink, FiBriefcase, FiMapPin, FiDollarSign, FiCalendar, FiFileText, FiAward, FiInfo } from "react-icons/fi";

const JobsSection = () => {
  const router = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // State for jobs
  const { refetch: refetchJobs, loading: loadingJobs, data: JobsData } = useGet({
    url: `${apiUrl}/guest/getAllJobs`,
  });
  const [Jobs, setJobs] = useState([]);

  // State for apply dialog
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedCv, setSelectedCv] = useState(null);
  const [hasExperience, setHasExperience] = useState('');
  const [message, setMessage] = useState('');
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  // State for share dialog
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [jobToShare, setJobToShare] = useState(null);

  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  // Fetch CVs
  const { refetch: refetchCVS, loading: loadingCVS, data: cvsData } = useGet({
    url: `${apiUrl}/user/get-usercv`,
  });

  // Post application
  const { postData: postCv, loading: loadingPostCv } = usePost({
    url: `${apiUrl}/user/apply-job`,
  });

  useEffect(() => {
    refetchJobs();
    if (user) {
      refetchCVS();
    }
  }, [refetchJobs, refetchCVS, user]);

  useEffect(() => {
    if (JobsData && JobsData.jobs) {
      setJobs(JobsData.jobs.slice(0, 6));
    }
  }, [JobsData]);

  // Handle apply job submission
  const handleApplyJob = async (jobId) => {
    if (!jobId || !selectedCv) {
      toast.error('Please select a CV to apply with');
      return;
    }

    if (!hasExperience) {
      toast.error('Please specify if you have experience for this job');
      return;
    }

    try {
      const payload = {
        job_offer_id: jobId,
        cv_file: selectedCv.cv_file_url,
        has_experience: hasExperience == 1 ? "yes" : "no",
        message: message,
      };

      await postCv(payload);

      setSelectedCv(null);
      setHasExperience('');
      setMessage('');
      setIsApplyDialogOpen(false);
      setSelectedJobId(null);

      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  // Handle share functionality
  const handleShareJob = (job) => {
    setJobToShare(job);
    setIsShareDialogOpen(true);
  };

  // Function to open job details dialog
  const openJobDetails = (job) => {
    setSelectedJobDetails(job);
    setIsDetailsDialogOpen(true);
  };

  const generateJobUrl = (jobId) => {
    // In a real app, this would be your actual domain
    return `${window.location.origin}/jobs/${jobId}`;
  };

  const copyToClipboard = () => {
    if (!jobToShare) return;

    const shareText = `Check out this job opportunity: ${jobToShare.image} ${jobToShare.job_titel.name} at ${jobToShare.company.name} in ${jobToShare.city.name}, ${jobToShare.city.country.name}.`;
    const jobUrl = generateJobUrl(jobToShare.id);
    // const fullText = `${shareText + ' ' + jobUrl + '' + jobToShare.image_link}`;
    const fullText = `${jobUrl}`;

    navigator.clipboard.writeText(fullText)
      .then(() => {
        toast.success('Job details copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy to clipboard');
      });
  };

  const shareViaWhatsApp = () => {
    if (!jobToShare) return;

    const shareText = `Check out this job opportunity: ${jobToShare.job_titel.name} at ${jobToShare.company.name} in ${jobToShare.city.name}, ${jobToShare.city.country.name}.`;
    const jobUrl = generateJobUrl(jobToShare.id);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + jobUrl)}`;

    window.open(whatsappUrl, '_blank');
  };

  const shareViaEmail = () => {
    if (!jobToShare) return;

    const shareText = `Check out this job opportunity: ${jobToShare.job_titel.name} at ${jobToShare.company.name} in ${jobToShare.city.name}, ${jobToShare.city.country.name}.`;
    const jobUrl = generateJobUrl(jobToShare.id);
    const emailSubject = `Job Opportunity: ${jobToShare.job_titel.name}`;
    const emailBody = `${shareText}\n\nCheck it out: ${jobUrl}`;

    window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  const shareViaSocial = (platform) => {
    if (!jobToShare) return;

    const shareText = `Check out this job opportunity: ${jobToShare.job_titel.name} at ${jobToShare.company.name}`;
    const jobUrl = generateJobUrl(jobToShare.id);

    let shareUrl;
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(jobUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareViaNative = () => {
    if (!jobToShare) return;

    if (navigator.share) {
      const shareText = `Check out this job opportunity: ${jobToShare.job_titel.name} at ${jobToShare.company.name} in ${jobToShare.city.name}, ${jobToShare.city.country.name}.`;
      const jobUrl = generateJobUrl(jobToShare.id);

      navigator.share({
        // image: jobToShare.image_link,
        title: jobToShare.job_titel.name,
        text: shareText,
        url: jobUrl,
      })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      copyToClipboard();
    }
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

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } },
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

  if (loadingJobs) return <div className="text-center py-10 text-xl text-gray-600">Loading....</div>;

  return (
    <section className="py-10 bg-gradient-to-br from-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <motion.h2
          className="text-4xl font-extrabold mb-12 tracking-tight overflow-hidden"
          variants={headingVariants}
          initial="hidden"
          animate="visible"
        >
          Discover Your Next Career Move
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {Jobs.map((job) => (
              <motion.div
                key={job.id}
                className="bg-white rounded-2xl p-4 md:p-8 border border-indigo-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
                    {job.image_link ? (
                      <img
                        src={job.image_link}
                        alt={job.company.name}
                        className="rounded-full w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-700">
                        {job.company?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">{job.company.name}</h3>
                    <p className="text-md text-gray-500">{job.job_category.name}</p>
                  </div>
                </div>

                <hr className="my-6 border-gray-200" />
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{job.job_titel.name}</h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>
                <div className="flex items-center text-sm mb-4 flex-wrap gap-2">
                  <span className="flex items-center bg-indigo-100 text-indigo-800 font-semibold px-3 py-1 rounded-full">
                    <FaClock className="w-3 h-3 mr-2" />
                    {job.type === "full_time" ? "Full Time" : "Part Time"}
                  </span>
                  <span className="flex items-center bg-purple-100 text-purple-800 font-semibold px-3 py-1 rounded-full">
                    <FaMapMarkerAlt className="w-3 h-3 mr-2" />
                    {job.city.name}, {job.city.country.name}
                  </span>
                </div>
                <div className="flex flex-col justify-between gap-y-3 mt-6">
                  <span className="text-xl font-extrabold text-blue-600">{job.expected_salary}EGP</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShareJob(job)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                      aria-label="Share job"
                    >
                      <FaShareAlt className="w-4 h-4" />
                    </button>
                    <button
                      variant="outline"
                      onClick={() => openJobDetails(job)}
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-full transition-all duration-300"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        if (!user) {
                          router('/login');
                          return;
                        }
                        setSelectedJobId(job.id);
                        setIsApplyDialogOpen(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full text-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <div className="text-center mt-12">
          <button
            onClick={handleBrowseMore}
            className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 transform hover:scale-105"
          >
            Browse More Jobs
          </button>
        </div>
      </div>

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
                    {selectedJobDetails.job_titel?.name || 'Job Details'}
                  </Dialog.Title>
                  <div className="flex items-center text-gray-600 mb-6">
                    <span className="font-semibold">{selectedJobDetails.company?.name}</span>
                    <span className="mx-2">•</span>
                    <span>{selectedJobDetails.city?.name}, {selectedJobDetails.city?.country?.name}</span>
                  </div>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-gray-700 text-sm mb-6">
                  <motion.div className="flex items-center" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                    <FiAward className="text-blue-500 mr-2 text-lg" />
                    <strong>Experience:</strong> {getExperienceLabel(selectedJobDetails.experience)}
                  </motion.div>
                  <motion.div className="flex items-center" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
                    <FiBriefcase className="text-blue-500 mr-2 text-lg" />
                    <strong>Type:</strong> {getTypeLabel(selectedJobDetails.type)}
                  </motion.div>
                  <motion.div className="flex items-center" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
                    <FiCalendar className="text-blue-500 mr-2 text-lg" />
                    <strong>Posted:</strong> {selectedJobDetails.created_at ? new Date(selectedJobDetails.created_at).toLocaleDateString() : 'Not specified'}
                  </motion.div>
                  {selectedJobDetails.expected_salary && (
                    <motion.div className="flex items-center" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
                      <FiDollarSign className="text-blue-500 mr-2 text-lg" />
                      <strong>Salary:</strong> {selectedJobDetails.expected_salary} {selectedJobDetails.city?.country?.name === 'Egypt' ? 'EGP' : ''}
                    </motion.div>
                  )}
                  <motion.div className="flex items-center" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.7 }}>
                    <FiMapPin className="text-blue-500 mr-2 text-lg" />
                    <strong>Zone:</strong> {selectedJobDetails.zone?.name || 'Not specified'}
                  </motion.div>
                  <motion.div className="flex items-center" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.8 }}>
                    <FiCalendar className="text-blue-500 mr-2 text-lg" />
                    <strong>Expiry Date:</strong> {selectedJobDetails.expire_date ? new Date(selectedJobDetails.expire_date).toLocaleDateString() : 'Not specified'}
                  </motion.div>
                </div>
                <motion.div className="mb-6" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.9 }}>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <FiFileText className="mr-2 text-xl" /> Job Description
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedJobDetails.description || 'No detailed description available.'}
                  </p>
                </motion.div>
                <motion.div className="mb-6" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 1.0 }}>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <FiInfo className="mr-2 text-xl" /> Qualifications
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedJobDetails.job_qualification?.name || 'No qualifications provided.'}
                  </p>
                </motion.div>
                <motion.div className="mb-6" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 1.1 }}>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <FiLink className="mr-2 text-xl" /> Location Link
                  </h4>
                  <a
                    href={selectedJobDetails.location_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedJobDetails.location_link || 'No location link provided.'}
                  </a>
                </motion.div>
                <motion.div
                  className="flex justify-end gap-3"
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 }}
                >
                  {/* <Button
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
                  </Button> */}
                  <Button
                    onClick={() => {
                      setSelectedJobId(selectedJobDetails.id);
                      setIsDetailsDialogOpen(false);
                      setIsApplyDialogOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Apply Now
                  </Button>
                  <Dialog.Close asChild>
                    <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
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
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-full max-w-lg shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50"
            aria-label="Apply for Job Dialog"
          >
            <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">Apply for Job</Dialog.Title>
            <Dialog.Description className="text-gray-600 mb-6">
              Please provide your CV and details to apply for this position.
            </Dialog.Description>

            {loadingCVS && <div>Loading CVs...</div>}

            {!loadingCVS && cvsData?.userCv && cvsData?.userCv.length > 0 ? (
              <div className="mb-4">
                <label htmlFor="cvSelect" className="block text-gray-700 font-medium mb-2">
                  Select your CV:
                </label>
                <Select
                  options={cvsData?.userCv?.map((cv, index) => ({
                    value: cv,
                    label: `CV ${index + 1} (Uploaded: ${new Date(cv.created_at).toLocaleDateString()})`,
                    cv_file_url: cv.cv_file_url,
                  }))}
                  value={
                    selectedCv
                      ? {
                        value: selectedCv,
                        label: `CV ${cvsData?.userCv?.findIndex(
                          (cv) => cv === selectedCv
                        ) + 1} (Uploaded: ${new Date(
                          selectedCv.created_at
                        ).toLocaleDateString()})`,
                      }
                      : null
                  }
                  onChange={(selected) => setSelectedCv(selected?.value)}
                  placeholder="Select a CV"
                  isClearable
                />
              </div>

            ) : (
              <div className="mb-4 text-center text-gray-600">
                <p>No CVs found. Please upload a CV in your profile to apply.</p>
                <button
                  onClick={() => router('/profile')}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full"
                >
                  Upload CV
                </button>
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
                    checked={hasExperience === '1'}
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
                    checked={hasExperience === '0'}
                    onChange={(e) => setHasExperience(e.target.value)}
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Conditional Message Fields */}
            {hasExperience === '1' && (
              <div className="mb-6">
                <label htmlFor="experienceMessage" className="block text-gray-700 font-medium mb-2">
                  Please describe your experience *
                </label>
                <textarea
                  id="experienceMessage"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your relevant experience, skills, and achievements in this field..."
                  required
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  Please provide specific details about your experience that relates to this job role.
                </p>
              </div>
            )}

            {hasExperience === '0' && (
              <div className="mb-6">
                <label htmlFor="motivationMessage" className="block text-gray-700 font-medium mb-2">
                  Why are you interested in this role? *
                </label>
                <textarea
                  id="motivationMessage"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us why you're interested in this position, what skills you can bring, and what motivates you to apply..."
                  required
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  Share your motivation and enthusiasm for this opportunity.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => handleApplyJob(selectedJobId)}
                disabled={loadingPostCv || !selectedCv || hasExperience === '' || !message.trim()}
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

      {/* Share Job Dialog */}
      <Dialog.Root open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <motion.div
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-full max-w-md shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50"
            aria-label="Share Job Dialog"
          >
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-2xl font-bold text-gray-900">Share Job</Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  <FaTimes className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            {jobToShare && (
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-lg font-semibold">{jobToShare.company.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{jobToShare.job_titel.name}</h3>
                    <p className="text-sm text-gray-600">{jobToShare.company.name}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Location:</span> {jobToShare.city.name}, {jobToShare.city.country.name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Salary:</span> {jobToShare.expected_salary} EGP
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-xs text-blue-700 break-all">
                    Share URL: {generateJobUrl(jobToShare.id)}
                  </p>
                </div>

                <p className="text-gray-600 text-sm mb-6">
                  Share this job opportunity with your network.
                </p>
              </div>
            )}

            <div className="grid grid-cols-4 gap-3 mb-4">
              <button
                onClick={copyToClipboard}
                className="flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                title="Copy to clipboard"
              >
                <FaCopy className="w-5 h-5 mb-2" />
                <span className="text-xs">Copy</span>
              </button>

              <button
                onClick={shareViaWhatsApp}
                className="flex flex-col items-center justify-center bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                title="Share via WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5 mb-2" />
                <span className="text-xs">WhatsApp</span>
              </button>

              <button
                onClick={shareViaEmail}
                className="flex flex-col items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                title="Share via Email"
              >
                <FaEnvelope className="w-5 h-5 mb-2" />
                <span className="text-xs">Email</span>
              </button>

              <button
                onClick={shareViaNative}
                className="flex flex-col items-center justify-center bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                title="Share via other apps"
              >
                <FaShareAlt className="w-5 h-5 mb-2" />
                <span className="text-xs">Other</span>
              </button>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-3 text-center">Or share on social media</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => shareViaSocial('facebook')}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-full transition-all duration-300"
                  title="Share on Facebook"
                >
                  <SiFacebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => shareViaSocial('linkedin')}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-full transition-all duration-300"
                  title="Share on LinkedIn"
                >
                  <SiLinkedin className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
};

export default JobsSection;