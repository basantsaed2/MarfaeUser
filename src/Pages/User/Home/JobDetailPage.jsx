"use client";
import { useGet } from "@/Hooks/UseGet";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import * as Dialog from '@radix-ui/react-dialog';
import Select from 'react-select';
import { Button } from "@/components/ui/button";
import { usePost } from "@/Hooks/UsePost";
import { toast } from "react-toastify";
import { 
  FaMapMarkerAlt, 
  FaMoneyBillWave, 
  FaClock, 
  FaBriefcase,
  FaArrowLeft,
  FaTimes
} from "react-icons/fa";

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Use getAllJobs API instead of getJob
  const { refetch: refetchJobs, loading: loadingJobs, data: JobsData } = useGet({
    url: `${apiUrl}/guest/getAllJobs`,
  });

  // State for apply dialog
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

  const [job, setJob] = useState(null);

  useEffect(() => {
    if (id) {
      refetchJobs();
    }
    if (user) {
      refetchCVS();
    }
  }, [id, refetchJobs, refetchCVS, user]);

  useEffect(() => {
    if (JobsData && JobsData.jobs && id) {
      // Find the specific job from all jobs
      const foundJob = JobsData.jobs.find(job => job.id === parseInt(id));
      setJob(foundJob);
    }
  }, [JobsData, id]);

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
        has_experience: hasExperience == 1 ? "yes" : "no",
        message: message,
      };

      await postCv(payload);

      setSelectedCv(null);
      setHasExperience('');
      setMessage('');
      setIsApplyDialogOpen(false);

      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  if (loadingJobs) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-xl text-gray-600">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Not Found</h2>
          <button 
            onClick={() => navigate('/jobs')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.job_titel.name}</h1>
                <h2 className="text-xl text-gray-700 mb-4">{job.company.name}</h2>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="flex items-center bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-full text-sm">
                    <FaMapMarkerAlt className="mr-2" />
                    {job.city.name}, {job.city.country.name}
                  </span>
                  <span className="flex items-center bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-full text-sm">
                    <FaMoneyBillWave className="mr-2" />
                    {job.expected_salary} EGP
                  </span>
                  <span className="flex items-center bg-purple-100 text-purple-800 font-semibold px-3 py-1 rounded-full text-sm">
                    <FaClock className="mr-2" />
                    {job.type === "full_time" ? "Full Time" : "Part Time"}
                  </span>
                </div>
              </div>
              
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-md mb-4 md:mb-0">
                <span className="text-blue-600 text-2xl font-semibold">{job.company.name.charAt(0)}</span>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <FaBriefcase className="mr-2 text-blue-600" />
                  Job Category
                </h4>
                <p className="text-gray-700">{job.job_category.name}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <FaClock className="mr-2 text-blue-600" />
                  Employment Type
                </h4>
                <p className="text-gray-700 capitalize">{job.type.replace('_', ' ')}</p>
              </div>
            </div>

            {user ? (
              <button
                onClick={() => setIsApplyDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Apply Now
              </button>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 mb-3">You need to be logged in to apply for this job</p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Login to Apply
                </button>
              </div>
            )}
          </div>
        </motion.div>
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
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-2xl font-bold text-gray-900">Apply for {job.job_titel.name}</Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  <FaTimes className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
            
            <Dialog.Description className="text-gray-600 mb-6">
              Please provide your CV and details to apply for this position at {job.company.name}.
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
                  onClick={() => navigate('/profile')}
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
                onClick={() => handleApplyJob(job.id)}
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
  );
};

export default JobDetailPage;