"use client";
import { useGet } from "@/Hooks/UseGet"; // Adjust import based on your setup
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as Dialog from '@radix-ui/react-dialog';
import Select from 'react-select';
import { Button } from "@/components/ui/button"; // Adjust import based on your setup
import { usePost } from "@/Hooks/UsePost";
import { toast, ToastContainer } from "react-toastify";

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
      alert('Please select a CV to apply with');
      return;
    }

    if (!hasExperience) {
      alert('Please specify if you have experience for this job');
      return;
    }

    try {
      const payload = {
        job_offer_id: jobId,
        cv_file: selectedCv.cv_file_url,
        has_experience: hasExperience,
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
                className="bg-white rounded-2xl p-8 border border-indigo-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-blue-600 text-3xl font-semibold">{job.company.name.charAt(0)}</span>
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
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {job.type === "full_time" ? "Full Time" : "Part Time"}
                  </span>
                  <span className="flex items-center bg-purple-100 text-purple-800 font-semibold px-3 py-1 rounded-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {job.city.name}, {job.city.country.name}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <span className="text-xl font-extrabold text-blue-600">{job.expected_salary}EGP</span>
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
                <label htmlFor="cvSelect" className="block text-gray-700 font-medium mb-2">Select your CV:</label>
                <Select
                  options={cvsData?.userCv?.map((cv) => ({
                    value: cv,
                    label: `CV - ${cv.cv_file_url} (Uploaded: ${new Date(cv.created_at).toLocaleDateString()})`,
                    cv_file_url: cv.cv_file_url,
                  }))}
                  value={selectedCv ? {
                    value: selectedCv,
                    label: `CV - ${selectedCv.cv_file_url} (Uploaded: ${new Date(selectedCv.created_at).toLocaleDateString()})`,
                  } : null}
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
                onClick={() => handleApplyJob(selectedJobId)}
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
    </section>
  );
};

export default JobsSection;