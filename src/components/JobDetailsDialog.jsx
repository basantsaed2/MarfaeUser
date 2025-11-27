"use client";
import React from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  FiBriefcase, 
  FiMapPin, 
  FiDollarSign, 
  FiClock, 
  FiCalendar, 
  FiFileText, 
  FiAward, 
  FiInfo, 
  FiLink 
} from "react-icons/fi";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const JobDetailsDialog = ({ 
  job, 
  isOpen, 
  onOpenChange,
  onApply,
  onSaveJob,
  isSaved = false,
  isSaveLoading = false 
}) => {
  if (!job) return null;

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

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <motion.div
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-bg-primary/5"
          aria-label="Job Details Dialog"
        >
          {job && (
            <>
              <motion.div variants={itemVariants}>
                <Dialog.Title className="text-3xl font-bold text-gray-900 mb-2">
                  {job.job_titel?.name || 'Job Details'}
                </Dialog.Title>
                <div className="flex items-center text-gray-600 mb-6">
                  <span className="font-semibold">{job.company?.name}</span>
                  <span className="mx-2">•</span>
                  <span>{job.city?.name}, {job.city?.country?.name}</span>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-gray-700 text-sm mb-6">
                <motion.div className="flex items-center" variants={itemVariants}>
                  <FiAward className="text-bg-primary mr-2 text-lg" />
                  <strong>Experience:</strong> {getExperienceLabel(job.experience)}
                </motion.div>
                <motion.div className="flex items-center" variants={itemVariants}>
                  <FiBriefcase className="text-bg-primary mr-2 text-lg" />
                  <strong>Type:</strong> {getTypeLabel(job.type)}
                </motion.div>
                <motion.div className="flex items-center" variants={itemVariants}>
                  <FiCalendar className="text-bg-primary mr-2 text-lg" />
                  <strong>Posted:</strong> {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Not specified'}
                </motion.div>
                {job.expected_salary && (
                  <motion.div className="flex items-center" variants={itemVariants}>
                    <FiDollarSign className="text-bg-primary mr-2 text-lg" />
                    <strong>Salary:</strong> {job.expected_salary} {job.city?.country?.name === 'Egypt' ? 'EGP' : ''}
                  </motion.div>
                )}
                <motion.div className="flex items-center" variants={itemVariants}>
                  <FiMapPin className="text-bg-primary mr-2 text-lg" />
                  <strong>Zone:</strong> {job.zone?.name || 'Not specified'}
                </motion.div>
                <motion.div className="flex items-center" variants={itemVariants}>
                  <FiCalendar className="text-bg-primary mr-2 text-lg" />
                  <strong>Expiry Date:</strong> {job.expire_date ? new Date(job.expire_date).toLocaleDateString() : 'Not specified'}
                </motion.div>
              </div>

              <motion.div className="mb-6" variants={itemVariants}>
                <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <FiFileText className="mr-2 text-xl text-bg-primary" /> Job Description
                </h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {job.description || 'No detailed description available.'}
                </p>
              </motion.div>

              <motion.div className="mb-6" variants={itemVariants}>
                <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <FiInfo className="mr-2 text-xl text-bg-primary" /> Qualifications
                </h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {job.job_qualification?.name || 'No qualifications provided.'}
                </p>
              </motion.div>

              {job.location_link && (
                <motion.div className="mb-6" variants={itemVariants}>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <FiLink className="mr-2 text-xl text-bg-primary" /> Location Link
                  </h4>
                  <a
                    href={job.location_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bg-primary hover:underline"
                  >
                    {job.location_link}
                  </a>
                </motion.div>
              )}

              <motion.div
                className="flex justify-end gap-3"
                variants={itemVariants}
              >
                {onSaveJob && (
                  <Button
                    onClick={() => onSaveJob(job)}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                    disabled={isSaveLoading}
                  >
                    {isSaved ? (
                      <FaBookmark className="text-white text-lg" />
                    ) : (
                      <FaRegBookmark className="text-white text-lg" />
                    )}
                    {isSaved ? 'Unsave Job' : 'Save Job'}
                  </Button>
                )}
                
                {onApply && (
                  <Button
                    onClick={() => {
                      onOpenChange(false);
                      onApply(job.id);
                    }}
                    className="bg-bg-primary hover:bg-bg-primary/90 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Apply Now
                  </Button>
                )}
                
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
  );
};

export default JobDetailsDialog;