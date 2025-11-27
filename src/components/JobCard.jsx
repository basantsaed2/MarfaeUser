"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  FiBriefcase, 
  FiMapPin, 
  FiDollarSign, 
  FiClock 
} from "react-icons/fi";
import { FaRegBookmark, FaBookmark, FaShareAlt } from "react-icons/fa";

const JobCard = ({ 
  job, 
  onApply, 
  onViewDetails, 
  onShare, 
  onSaveJob,
  showSaveButton = true 
}) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

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

  const isLongDescription = (job.description?.length || 0) > 150;

  const handleApplyClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (onApply) {
      onApply(job.id);
    }
  };

  const handleSaveClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (onSaveJob) {
      onSaveJob(job);
    }
  };

  return (
    <motion.div
      className="bg-white flex flex-col justify-between rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {job.job_titel?.name || 'Unknown Position'}
            </h3>
            <p className="text-gray-600">{job.company?.name || 'Unknown Company'}</p>
          </div>
          
          {showSaveButton && user && (
            <button
              onClick={handleSaveClick}
              className="text-gray-400 hover:text-yellow-500 transition-colors"
            >
              {job.is_saved === 1 ? (
                <FaBookmark className="text-yellow-500 text-xl" />
              ) : (
                <FaRegBookmark className="text-xl" />
              )}
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-bg-primary/10 text-bg-primary">
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

        <div className="mt-4">
          <p
            className={`text-gray-600 transition-all duration-300 ${
              isExpanded ? '' : 'line-clamp-3'
            }`}
          >
            {job.description || 'No description available.'}
          </p>
          {isLongDescription && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-bg-primary hover:text-bg-primary/80 text-sm font-semibold transition-colors duration-200"
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onShare && onShare(job)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full text-sm transition-all duration-300 shadow-md hover:shadow-lg"
          aria-label="Share job"
        >
          <FaShareAlt className="w-4 h-4" />
        </button>
        
        <Button
          onClick={handleApplyClick}
          className="bg-bg-primary hover:bg-bg-primary/90 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Apply Now
        </Button>
        
        <Button
          variant="outline"
          onClick={() => onViewDetails && onViewDetails(job)}
          className="border-bg-primary text-bg-primary hover:bg-bg-primary/10 font-semibold py-2 px-4 rounded-full transition-all duration-300"
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
};

export default JobCard;