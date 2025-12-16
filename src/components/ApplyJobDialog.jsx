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
  const [hasLicenseKey, setHasLicenseKey] = useState(''); // New state
  const [showPrometricMessage, setShowPrometricMessage] = useState(false);

  // Check if job title includes medical keywords
  const isMedicalJob = () => {
    if (!jobTitle) return false;
    const medicalKeywords = ['doctor', 'dentist', 'nurse', 'physician', 'pharmacist', 'therapist'];
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
      setHasPrometric('');
      setHasLicenseKey(''); // Reset license key
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

    if (isMedicalJob() && !hasPrometric) {
      toast.error('Please specify your prometric status');
      return;
    }

    if (isMedicalJob() && !hasLicenseKey) {
      toast.error('Please specify if you have a license key');
      return;
    }

    try {
      const payload = {
        job_offer_id: jobId,
        cv_file: selectedCv.cv_file_url,
        has_experience: hasExperience === "1" ? "yes" : "no",
        message: message,
        ...(isMedicalJob() && {
          has_prometric: hasPrometric === "1" ? "yes" : "no",
          has_license_key: hasLicenseKey === "1" ? "yes" : "no"  // Send license key status
        })
      };

      await postCv(payload);

      // Show message if medical job AND (no prometric OR no license key)
      if (isMedicalJob() && (hasPrometric === "0" || hasLicenseKey === "0")) {
        setShowPrometricMessage(true);
      } else {
        resetForm();
        onOpenChange(false);
        if (onSuccess) onSuccess();
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
    setHasLicenseKey('');
    setShowPrometricMessage(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const openWhatsApp = () => {
    const phoneNumber = "01277337807";
    const message = "Hello, I'm interested in training or passing the prometric exam / getting a license key.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
  };

  if (!user) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <motion.div
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-full max-w-lg shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-bg-primary/5 max-h-[90vh] overflow-y-auto"
        >
          {showPrometricMessage ? (
            // Same message shown for no prometric OR no license key
            <div className="text-center">
              <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">
                Application Submitted
              </Dialog.Title>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <div className="text-yellow-800 mb-4">
                  <p className="font-semibold text-lg mb-2">Additional Requirements</p>
                  <p className="text-sm">
                    For this medical position, prometric certification and/or license key may be required.
                  </p>
                </div>

                <div className="bg-bg-primary/10 border border-bg-primary/20 rounded-lg p-4">
                  <p className="text-bg-primary text-sm mb-3">
                    <strong>Need help with prometric or license key?</strong>
                  </p>
                  <p className="text-bg-primary/80 text-xs mb-4">
                    Contact us for training or assistance with exams and licensing.
                  </p>
                  <button
                    onClick={openWhatsApp}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>Contact on WhatsApp</span>
                  </button>
                  <p className="text-bg-primary text-xs mt-2">01277337807</p>
                </div>
              </div>

              <Button
                onClick={handleClose}
                className="bg-bg-primary hover:bg-bg-primary/90 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Close
              </Button>
            </div>
          ) : (
            <>
              <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">
                Apply for Job
              </Dialog.Title>
              <Dialog.Description className="text-gray-600 mb-6">
                Please provide your CV and details to apply for this position.
                {isMedicalJob() && (
                  <span className="block mt-2 text-bg-primary font-medium">
                    ⚕️ Medical position - Prometric & License Key may be required
                  </span>
                )}
              </Dialog.Description>

              {/* CV Selection */}
              {loadingCVS && <div className="text-center py-4">Loading CVs...</div>}

              {!loadingCVS && cvsData?.userCv && cvsData?.userCv.length > 0 ? (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Select your CV:</label>
                  <Select
                    options={cvsData?.userCv?.map((cv, index) => ({
                      value: cv,
                      label: `CV ${index + 1} (Uploaded: ${new Date(cv.created_at).toLocaleDateString()})`,
                    }))}
                    value={selectedCv ? {
                      value: selectedCv,
                      label: `CV ${cvsData?.userCv?.findIndex(cv => cv === selectedCv) + 1} (Uploaded: ${new Date(selectedCv.created_at).toLocaleDateString()})`
                    } : null}
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

              {/* Prometric Section */}
              {isMedicalJob() && (
                <div className="mb-4 p-4 bg-bg-primary/10 rounded-lg border border-bg-primary/20">
                  <label className="block text-gray-700 font-medium mb-2">
                    Do you have prometric certification? *
                  </label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input type="radio" className="form-radio text-bg-primary" name="hasPrometric" value="1" checked={hasPrometric === "1"} onChange={(e) => setHasPrometric(e.target.value)} />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" className="form-radio text-bg-primary" name="hasPrometric" value="0" checked={hasPrometric === "0"} onChange={(e) => setHasPrometric(e.target.value)} />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              )}

              {/* New License Key Section */}
              {isMedicalJob() && (
                <div className="mb-4 p-4 bg-bg-primary/10 rounded-lg border border-bg-primary/20">
                  <label className="block text-gray-700 font-medium mb-2">
                    Do you have a license key? *
                  </label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-bg-primary"
                        name="hasLicenseKey"
                        value="1"
                        checked={hasLicenseKey === "1"}
                        onChange={(e) => setHasLicenseKey(e.target.value)}
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-bg-primary"
                        name="hasLicenseKey"
                        value="0"
                        checked={hasLicenseKey === "0"}
                        onChange={(e) => setHasLicenseKey(e.target.value)}
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                  <p className="text-xs text-bg-primary mt-2">
                    A valid license key is often required for medical positions.
                  </p>
                </div>
              )}

              {/* Experience Section */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Do you have experience for this job? *
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input type="radio" className="form-radio text-bg-primary" name="hasExperience" value="1" checked={hasExperience === "1"} onChange={(e) => setHasExperience(e.target.value)} />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" className="form-radio text-bg-primary" name="hasExperience" value="0" checked={hasExperience === "0"} onChange={(e) => setHasExperience(e.target.value)} />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {/* Message Fields */}
              {hasExperience === "1" && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Please describe your experience *
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-primary focus:border-bg-primary"
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your relevant experience..."
                    required
                  />
                </div>
              )}

              {hasExperience === "0" && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Why are you interested in this role? *
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-primary focus:border-bg-primary"
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us why you're interested..."
                    required
                  />
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
                    (isMedicalJob() && (hasPrometric === '' || hasLicenseKey === ''))
                  }
                  className="bg-bg-primary hover:bg-bg-primary/90 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingPostCv ? 'Applying...' : 'Submit Application'}
                </Button>
                <Dialog.Close asChild>
                  <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
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