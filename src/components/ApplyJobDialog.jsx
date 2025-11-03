"use client";
import React, { useState, useEffect } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { usePost } from "@/Hooks/UsePost";
import { useGet } from "@/Hooks/UseGet";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ApplyJobDialog = ({ 
  jobId, 
  jobTitle = "",
  isOpen, 
  onOpenChange,
  onSuccess 
}) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  
  const [selectedCv, setSelectedCv] = useState(null);
  const [hasExperience, setHasExperience] = useState('');
  const [message, setMessage] = useState('');
  const [hasPrometric, setHasPrometric] = useState('');
  const [showPrometricMessage, setShowPrometricMessage] = useState(false);

  // Check if job title includes medical keywords
  const isMedicalJob = () => {
    if (!jobTitle) return false;
    const medicalKeywords = ['doctor', 'dentist', 'nurse'];
    return medicalKeywords.some(keyword => 
      jobTitle.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const { refetch: refetchCVS, loading: loadingCVS, data: cvsData } = useGet({
    url: `${apiUrl}/user/get-usercv`,
  });

  const { postData: postCv, loading: loadingPostCv } = usePost({
    url: `${apiUrl}/user/apply-job`,
  });

  useEffect(() => {
    if (isOpen && user) {
      refetchCVS();
      // Reset prometric state when dialog opens
      setHasPrometric('');
      setShowPrometricMessage(false);
    }
  }, [isOpen, user, refetchCVS]);

  const handleApplyJob = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!jobId || !selectedCv) {
      toast.error('Please select a CV to apply with');
      return;
    }

    if (!hasExperience) {
      toast.error('Please specify if you have experience for this job');
      return;
    }

    // Check if prometric is required for medical jobs
    if (isMedicalJob() && !hasPrometric) {
      toast.error('Please specify your prometric status');
      return;
    }

    try {
      const payload = {
        job_offer_id: jobId,
        cv_file: selectedCv.cv_file_url,
        has_experience: hasExperience == 1 ? "yes" : "no",
        message: message,
        ...(isMedicalJob() && { has_prometric: hasPrometric === "1" ? "yes" : "no" })
      };

      await postCv(payload);

      // Show prometric message if it's a medical job and user doesn't have prometric
      if (isMedicalJob() && hasPrometric === "0") {
        setShowPrometricMessage(true);
      } else {
        // Reset form and close dialog for non-medical jobs or medical jobs with prometric
        resetForm();
        onOpenChange(false);
        
        if (onSuccess) {
          onSuccess();
        }
        toast.success('Application submitted successfully!');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const resetForm = () => {
    setSelectedCv(null);
    setHasExperience('');
    setMessage('');
    setHasPrometric('');
    setShowPrometricMessage(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const openWhatsApp = () => {
    const phoneNumber = "01277337807";
    const message = "Hello, I'm interested in training or passing the prometric exam.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <motion.div
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-full max-w-lg shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50 max-h-[90vh] overflow-y-auto"
          aria-label="Apply for Job Dialog"
        >
          {showPrometricMessage ? (
            // Prometric Message View
            <div className="text-center">
              <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">
                Application Submitted
              </Dialog.Title>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <div className="text-yellow-800 mb-4">
                  <p className="font-semibold text-lg mb-2">Prometric Requirement</p>
                  <p className="text-sm">
                    For this medical position, prometric certification is required.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm mb-3">
                    <strong>Need help with prometric?</strong>
                  </p>
                  <p className="text-blue-700 text-xs mb-4">
                    Contact us if you want to train or pass the prometric exam
                  </p>
                  <button
                    onClick={openWhatsApp}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>Contact on WhatsApp</span>
                  </button>
                  <p className="text-blue-600 text-xs mt-2">01277337807</p>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <Button
                  onClick={handleClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            // Main Application Form View
            <>
              <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">
                Apply for Job
              </Dialog.Title>
              <Dialog.Description className="text-gray-600 mb-6">
                Please provide your CV and details to apply for this position.
                {isMedicalJob() && (
                  <span className="block mt-2 text-blue-600 font-medium">
                    ⚕️ Medical position - Prometric certification required
                  </span>
                )}
              </Dialog.Description>

              {loadingCVS && <div className="text-center py-4">Loading CVs...</div>}

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
                </div>
              )}

              {/* Prometric Section for Medical Jobs */}
              {isMedicalJob() && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <label className="block text-gray-700 font-medium mb-2">
                    Do you have prometric certification? *
                  </label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-blue-600"
                        name="hasPrometric"
                        value="1"
                        checked={hasPrometric === "1"}
                        onChange={(e) => setHasPrometric(e.target.value)}
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-blue-600"
                        name="hasPrometric"
                        value="0"
                        checked={hasPrometric === "0"}
                        onChange={(e) => setHasPrometric(e.target.value)}
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Prometric certification is required for this medical position.
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Do you have experience for this job? *
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-600"
                      name="hasExperience"
                      value="1"
                      checked={hasExperience === "1"}
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
                      checked={hasExperience === "0"}
                      onChange={(e) => setHasExperience(e.target.value)}
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {/* Conditional Message Fields */}
              {hasExperience === "1" && (
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

              {hasExperience === "0" && (
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
                  onClick={handleApplyJob}
                  disabled={
                    loadingPostCv || 
                    !selectedCv || 
                    hasExperience === '' || 
                    !message.trim() ||
                    (isMedicalJob() && hasPrometric === '')
                  }
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
            </>
          )}
        </motion.div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ApplyJobDialog;