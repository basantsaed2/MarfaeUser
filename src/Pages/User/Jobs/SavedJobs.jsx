"use client";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { usePost } from "@/Hooks/UsePost";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import companyImage from '@/assets/company.png';
import { FiFilter, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";

// Import components
import JobCard from "@/components/JobCard";
import ApplyJobDialog from "@/components/ApplyJobDialog";
import JobDetailsDialog from "@/components/JobDetailsDialog";
import ShareJobDialog from "@/components/ShareJobDialog";

const SavedJobs = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [savedJobs, setSavedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [jobToShare, setJobToShare] = useState(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');

  const { refetch: refetchSavedJobs, loading: loadingSavedJobs, data: savedJobsData } = useGet({
    url: `${apiUrl}/user/get-saved-jobs`,
  });

  const { postData: postSavedJob, loading: loadingPostSavedJob } = usePost({
    url: `${apiUrl}/user/save-job`,
  });

  // Fetch initial data
  useEffect(() => {
    refetchSavedJobs();
  }, [refetchSavedJobs]);

  // Process saved jobs data
  useEffect(() => {
    if (savedJobsData?.saved_jobs) {
      const jobsWithDetails = savedJobsData.saved_jobs.map(savedJob => ({
        ...savedJob.job_offer,
        is_saved: 1,
        id: savedJob.job_offer_id,
        saved_job_id: savedJob.id
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

  // Remove saved job
  const removeSavedJob = async (jobId) => {
    try {
      await postSavedJob({
        job_offer_id: jobId.id,
        key: 0
      });

      // Update the UI immediately
      setSavedJobs(prev => prev.filter(job => job.id !== jobId.id));
      setFilteredJobs(prev => prev.filter(job => job.id !== jobId.id));

      // If the detailed view is open for this job, close it
      if (selectedJobDetails?.id === jobId.id) {
        setIsDetailsDialogOpen(false);
      }

      toast.success('Job removed from saved jobs');
    } catch (error) {
      console.error("Error removing saved job:", error);
      toast.error('Failed to remove saved job. Please try again.');
    }
  };

  // Handle apply job
  const handleApplyJob = (jobId, jobTitle) => {
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
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Browse through your saved job opportunities
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 md:px-8 py-8">
        {/* Simplified Filter Bar */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your saved jobs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-primary focus:border-bg-primary"
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
              <JobCard
                key={job.id}
                job={job}
                onApply={(jobId) => handleApplyJob(jobId, job.job_titel?.name)}
                onViewDetails={handleViewDetails}
                onShare={handleShareJob}
                onSaveJob={removeSavedJob}
                showSaveButton={true}
              />
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
          onSaveJob={removeSavedJob}
          isSaved={true}
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

export default SavedJobs;