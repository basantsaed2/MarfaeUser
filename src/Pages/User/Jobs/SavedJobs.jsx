"use client";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { usePost } from "@/Hooks/UsePost";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import companyImage from '@/assets/company.png';
import { FiFilter, FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiSearch, FiFileText, FiAward } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import * as Dialog from '@radix-ui/react-dialog';

const SavedJobs = () => {
  const apiUrl = "https://backMarfea.marfaa-alex.com/api";
  const [savedJobs, setSavedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [selectedCv, setSelectedCv] = useState(null);
  const [hasExperience, setHasExperience] = useState('');
  const [message, setMessage] = useState('');
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const { refetch: refetchCVS, loading: loadingCVS, data: cvsData } = useGet({
    url: `${apiUrl}/user/get-usercv`,
  });

  const { refetch: refetchSavedJobs, loading: loadingSavedJobs, data: savedJobsData } = useGet({
    url: `${apiUrl}/user/get-saved-jobs`,
  });

  const { postData: postCv, loading: loadingPostCv, response: cvResponse } = usePost({
    url: `${apiUrl}/user/apply-job`,
  });

  const { postData: postSavedJob, loading: loadingPostSavedJob } = usePost({
    url: `${apiUrl}/user/save-job`,
  });

  // Fetch initial data
  useEffect(() => {
    refetchSavedJobs();
    refetchCVS();
  }, [refetchSavedJobs, refetchCVS]);

  // Process saved jobs data
  useEffect(() => {
    if (savedJobsData?.saved_jobs) {
      // Map through saved jobs and extract the job_offer details
      const jobsWithDetails = savedJobsData.saved_jobs.map(savedJob => ({
        ...savedJob.job_offer,
        is_saved: true, // Add this flag to indicate it's a saved job
        id: savedJob.job_offer_id, // Ensure we keep the job offer ID
        saved_job_id: savedJob.id // Keep the saved job relationship ID
      }));
      setSavedJobs(jobsWithDetails);
      setFilteredJobs(jobsWithDetails);
    }
  }, [savedJobsData]);

  // Apply search filter
  useEffect(() => {
    if (searchTerm) {
      const filtered = savedJobs.filter(job => 
        (job.job_titel?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (job.description?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(savedJobs);
    }
  }, [searchTerm, savedJobs]);

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

  // Remove saved job
  const removeSavedJob = async (savedJobId) => {
    try {
      await postSavedJob({
        job_offer_id: savedJobId,
        key: 0 // This unsaves the job
      });
      
      // Update the UI immediately
      setSavedJobs(prev => prev.filter(job => job.saved_job_id !== savedJobId));
      setFilteredJobs(prev => prev.filter(job => job.saved_job_id !== savedJobId));
      
      // If the detailed view is open for this job, close it
      if (selectedJobDetails?.saved_job_id === savedJobId) {
        setIsDetailsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error removing saved job:", error);
      alert('Failed to remove saved job. Please try again.');
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
      case '+3 years': return '3+ Years';
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

  if (loadingSavedJobs) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="w-full h-64 relative">
        <img
          src={companyImage}
          alt="Jobs Banner"
          className="object-cover md:object-fill h-full w-full"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Your Saved Jobs</h1>
          <p className="text-xl text-white/90 diag max-w-2xl mx-auto">
            Browse through your saved job opportunities
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Simplified Filter Bar */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your saved jobs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FiFilter />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Simple Filter Section */}
          {showFilters && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'full_time', label: 'Full Time' },
                  { value: 'part_time', label: 'Part Time' },
                  { value: 'freelance', label: 'Freelance' },
                  { value: 'internship', label: 'Internship' },
                  { value: 'hybrid', label: 'Hybrid' },
                ]}
                onChange={(selected) => {
                  if (!selected || selected.value === 'all') {
                    setFilteredJobs(savedJobs);
                  } else {
                    setFilteredJobs(savedJobs.filter(job => job.type === selected.value));
                  }
                }}
                placeholder="Filter by Type"
                isClearable
              />
              <Select
                options={[
                  { value: 'all', label: 'All Experiences' },
                  { value: 'fresh', label: 'Fresh Graduate' },
                  { value: 'junior', label: 'Junior' },
                  { value: 'mid', label: 'Mid-Level' },
                  { value: 'senior', label: 'Senior' },
                  { value: '+1 year', label: '1+ Years' },
                  { value: '+2 years', label: '2+ Years' },
                  { value: '+3 years', label: '3+ Years' },
                ]}
                onChange={(selected) => {
                  if (!selected || selected.value === 'all') {
                    setFilteredJobs(savedJobs);
                  } else {
                    setFilteredJobs(savedJobs.filter(job => job.experience === selected.value));
                  }
                }}
                placeholder="Filter by Experience"
                isClearable
              />
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Saved
            {searchTerm && ` matching "${searchTerm}"`}
          </h2>
        </div>

        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{job.job_titel?.name || 'Unknown Position'}</h3>
                    <p className="text-gray-600">{job.company?.name || 'Unknown Company'}</p>
                  </div>
                  <button
                    onClick={() => removeSavedJob(job.saved_job_id)}
                    className="text-yellow-500 hover:text-yellow-600 transition-colors"
                    disabled={loadingPostSavedJob}
                  >
                    <FaBookmark className="text-xl" />
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
                      {job.expected_salary} {job.city?.country?.name === 'Egyptt' ? 'EGP' : ''}
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
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Apply Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => openJobDetails(job)}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {searchTerm ? 'No matching saved jobs found' : 'No saved jobs found'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? "Try a different search term."
                : "You haven't saved any jobs yet. Start browsing jobs to save them for later."}
            </p>
            {searchTerm && (
              <Button 
                onClick={() => setSearchTerm('')} 
                variant="link" 
                className="mt-4"
              >
                Clear search
              </Button>
            )}
          </div>
        )}

        {/* Job Details Dialog */}
        <Dialog.Root open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
              {selectedJobDetails && (
                <>
                  <Dialog.Title className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedJobDetails.job_titel?.name || 'Job Details'}
                  </Dialog.Title>
                  <div className="flex items-center text-gray-600 mb-4">
                    <span className="font-medium">{selectedJobDetails.company?.name}</span>
                    <span className="mx-2">•</span>
                    <span>{selectedJobDetails.city?.name}, {selectedJobDetails.city?.country?.name}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <FiFileText className="mr-2" />
                          Job Description
                        </h3>
                        <p className="text-gray-700">
                          {selectedJobDetails.description || 'No description available.'}
                        </p>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <FiAward className="mr-2" />
                          Qualifications
                        </h3>
                        <p className="text-gray-700">
                          {selectedJobDetails.qualifications || 'No specific qualifications listed.'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Overview</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <FiBriefcase className="text-gray-500 mr-2" />
                            <span className="text-gray-700">
                              <span className="font-medium">Job Type:</span> {getTypeLabel(selectedJobDetails.type)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FiClock className="text-gray-500 mr-2" />
                            <span className="text-gray-700">
                              <span className="font-medium">Experience:</span> {getExperienceLabel(selectedJobDetails.experience)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FiDollarSign className="text-gray-500 mr-2" />
                            <span className="text-gray-700">
                              <span className="font-medium">Salary:</span> {selectedJobDetails.expected_salary || 'Not specified'} {selectedJobDetails.city?.country?.name === 'Egyptt' ? 'EGP' : ''}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FiCalendar className="text-gray-500 mr-2" />
                            <span className="text-gray-700">
                              <span className="font-medium">Expires:</span> {selectedJobDetails.expire_date || 'Not specified'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FiMapPin className="text-gray-500 mr-2" />
                            <span className="text-gray-700">
                              <span className="font-medium">Location:</span> {selectedJobDetails.zone?.name}, {selectedJobDetails.city?.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Company Information</h3>
                        <div className="flex items-center">
                          <div className="mr-4">
                            <img
                              src={selectedJobDetails.company?.image_link || companyImage}
                              alt={selectedJobDetails.company?.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{selectedJobDetails.company?.name}</h4>
                            <p className="text-gray-600">{selectedJobDetails.company?.email}</p>
                            <p className="text-gray-600">{selectedJobDetails.company?.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <Button
                      onClick={() => {
                        setIsDetailsDialogOpen(false);
                        setSelectedJobId(selectedJobDetails.id);
                        setIsApplyDialogOpen(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                      Apply Now
                    </Button>
                    <Button
                      onClick={() => removeSavedJob(selectedJobDetails.saved_job_id)}
                      className="bg-red-600 hover:bg-red-700 text-white transition-colors"
                    >
                      Remove Saved Job
                    </Button>
                    <Dialog.Close asChild>
                      <Button variant="outline">Close</Button>
                    </Dialog.Close>
                  </div>
                </>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Apply Job Dialog */}
        <Dialog.Root open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <Dialog.Title className="text-xl font-bold text-gray-800 mb-4">
                Apply for Job
              </Dialog.Title>
              <Dialog.Description className="text-gray-600 mb-4">
                Select a CV, indicate your experience, and add a message.
              </Dialog.Description>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select CV</label>
                <Select
                  options={cvsData?.userCv?.map(cv => ({
                    value: cv,
                    label: `CV - ${cv.cv_file_url} (Uploaded: ${new Date(cv.created_at).toLocaleDateString()})`,
                    cv_file_url: cv.cv_file_url,
                  }))}
                  value={selectedCv ? {
                    value: selectedCv,
                    label: `CV - ${selectedCv.user_address} (Uploaded: ${new Date(selectedCv.created_at).toLocaleDateString()})`
                  } : null}
                  onChange={(selected) => setSelectedCv(selected?.value)}
                  placeholder="Select a CV"
                  isClearable
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Have you experience in this job?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="experience"
                      value="yes"
                      checked={hasExperience === 'yes'}
                      onChange={() => setHasExperience('yes')}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="experience"
                      value="no"
                      checked={hasExperience === 'no'}
                      onChange={() => setHasExperience('no')}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message to the employer..."
                  className="w-full h-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Dialog.Close asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.Close>
                <Button
                  onClick={handleApplyJob}
                  disabled={loadingPostCv || !selectedCv || !hasExperience}
                >
                  {loadingPostCv ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

export default SavedJobs;