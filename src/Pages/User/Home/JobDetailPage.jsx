"use client";
import { useGet } from "@/Hooks/UseGet";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaBriefcase,
  FaArrowLeft,
} from "react-icons/fa";
import ApplyJobDialog from "@/components/ApplyJobDialog"; // Adjust path as needed
import { toast } from "react-toastify";

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [job, setJob] = useState(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  const { refetch: refetchJobs, loading: loadingJobs, data: JobsData } = useGet({
    url: `${apiUrl}/guest/getAllJobs`,
  });

  useEffect(() => {
    if (id) {
      refetchJobs();
    }
  }, [id, refetchJobs]);

  useEffect(() => {
    if (JobsData?.jobs && id) {
      const foundJob = JobsData.jobs.find((j) => j.id === parseInt(id));
      setJob(foundJob || null);
    }
  }, [JobsData, id]);

  const handleApplySuccess = () => {
    toast.success("Application submitted successfully!");
    // Optional: refetch job or update UI if needed
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
            onClick={() => navigate("/jobs")}
            className="bg-bg-primary text-white px-6 py-2 rounded-lg hover:bg-bg-secondary transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-6 max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-bg-primary hover:text-bg-secondary mb-6 transition-colors"
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {job.job_titel.name}
                </h1>
                <h2 className="text-xl text-gray-700 mb-4">{job.company.name}</h2>

                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="flex items-center bg-bg-primary/10 text-bg-primary font-semibold px-4 py-2 rounded-full text-sm">
                    <FaMapMarkerAlt className="mr-2" />
                    {job.city.name}, {job.city.country.name}
                  </span>
                  <span className="flex items-center bg-bg-secondary/10 text-bg-secondary font-semibold px-4 py-2 rounded-full text-sm">
                    <FaMoneyBillWave className="mr-2" />
                    {job.expected_salary} EGP
                  </span>
                  <span className="flex items-center bg-bg-primary/10 text-bg-primary font-semibold px-4 py-2 rounded-full text-sm">
                    <FaClock className="mr-2" />
                    {job.type === "full_time" ? "Full Time" : "Part Time"}
                  </span>
                </div>
              </div>

              <div className="w-20 h-20 bg-bg-primary/10 rounded-full flex items-center justify-center shadow-md">
                <span className="text-bg-primary text-3xl font-bold">
                  {job.company.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Job Description
              </h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {job.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-gray-50 p-5 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <FaBriefcase className="mr-2 text-bg-primary" />
                  Job Category
                </h4>
                <p className="text-gray-700">{job.job_category.name}</p>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <FaClock className="mr-2 text-bg-primary" />
                  Employment Type
                </h4>
                <p className="text-gray-700 capitalize">
                  {job.type.replace("_", " ")}
                </p>
              </div>
            </div>

            {/* Apply Button */}
            {user ? (
              <button
                onClick={() => setIsApplyDialogOpen(true)}
                className="bg-bg-primary hover:bg-bg-secondary text-white font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Apply Now
              </button>
            ) : (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 max-w-md">
                <p className="text-yellow-800 font-medium mb-4">
                  You need to be logged in to apply for this job
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-bg-primary hover:bg-bg-secondary text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Login to Apply
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Reusable ApplyJobDialog */}
      <ApplyJobDialog
        jobId={job.id}
        jobTitle={job.job_titel.name}
        isOpen={isApplyDialogOpen}
        onOpenChange={setIsApplyDialogOpen}
        onSuccess={handleApplySuccess}
      />
    </div>
  );
};

export default JobDetailPage;