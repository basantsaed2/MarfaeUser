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
import { FiUpload, FiFileText, FiCheck, FiX } from "react-icons/fi";

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
  const [cvFile, setCvFile] = useState(null);
  const [cvName, setCvName] = useState("");
  const [cvContent, setCvContent] = useState(null);
  const fileInputRef = React.useRef(null);

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

  const { postData: uploadCV, loadingPost: loadingUploadCV, response: responseUploadCV } = usePost({
    url: `${apiUrl}/user/add-cv`,
  });

  useEffect(() => {
    if (isOpen && user) {
      refetchCVS();
      setHasPrometric('');
      setHasLicenseKey(''); // Reset license key
      setShowPrometricMessage(false);
      setCvFile(null);
      setCvName("");
      setCvContent(null);
    }
  }, [isOpen, user, refetchCVS]);

  useEffect(() => {
    if (responseUploadCV && !loadingUploadCV) {
      if (responseUploadCV.status === 200 || responseUploadCV.status === 201) {
        toast.success("CV uploaded successfully!");
        refetchCVS();
        setCvFile(null);
        setCvName("");
        setCvContent(null);
      }
    }
  }, [responseUploadCV, loadingUploadCV, refetchCVS]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF document");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setCvFile(file);
        setCvName(file.name);
        setCvContent(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadCV = async () => {
    if (!cvContent) return;

    const payload = {
      cvs: [
        { cv_file: cvContent }
      ]
    };

    await uploadCV(payload);
  };

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

      await postCv(payload, 'Application submitted successfully!');

      // Show message if medical job AND (no prometric OR no license key)
      if (isMedicalJob() && (hasPrometric === "0" || hasLicenseKey === "0")) {
        setShowPrometricMessage(true);
      } else {
        resetForm();
        onOpenChange(false);
        if (onSuccess) onSuccess();
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
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content asChild>
          <motion.div
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl border border-gray-100 bg-gradient-to-br from-white to-bg-primary/5 max-h-[85vh] overflow-y-auto z-50 apply-dialog-content"
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

                {/* CV Selection / Upload */}
                {loadingCVS && <div className="text-center py-4 text-bg-primary">Loading CVs...</div>}

                {!loadingCVS && (
                  <div className="mb-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-gray-700 font-semibold flex items-center gap-2">
                        <FiFileText className="text-bg-primary" />
                        Your CVs
                      </label>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-bg-primary text-sm font-medium hover:underline flex items-center gap-1"
                      >
                        <FiUpload />
                        {cvsData?.userCv?.length > 0 ? "Upload Another CV" : "Upload CV"}
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                    </div>

                    {cvName && (
                      <div className="bg-bg-primary/5 border border-dashed border-bg-primary/30 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="bg-bg-primary text-white p-2 rounded-lg">
                            <FiFileText />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">{cvName}</p>
                            <p className="text-xs text-gray-500">Ready to upload</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleUploadCV}
                            disabled={loadingUploadCV}
                            className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600 text-white rounded-full"
                          >
                            {loadingUploadCV ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FiCheck />
                            )}
                          </Button>
                          <Button
                            onClick={() => { setCvFile(null); setCvName(""); }}
                            className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                          >
                            <FiX />
                          </Button>
                        </div>
                      </div>
                    )}

                    {cvsData?.userCv && cvsData?.userCv.length > 0 && (
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
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: '0.75rem',
                            borderColor: '#e5e7eb',
                            boxShadow: 'none',
                            '&:hover': { borderColor: '#3b82f6' }
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
                            color: state.isSelected ? 'white' : '#374151',
                          })
                        }}
                      />
                    )}

                    {selectedCv && (
                      <div className="flex justify-start">
                        <a
                          href={selectedCv.cv_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-bg-primary text-sm font-medium hover:underline flex items-center gap-1"
                        >
                          <FiFileText />
                          View Selected CV
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}

                    {!cvsData?.userCv?.length && !cvName && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-bg-primary hover:bg-bg-primary/5 transition-all duration-300 group"
                      >
                        <FiUpload className="mx-auto text-3xl text-gray-400 group-hover:text-bg-primary mb-2" />
                        <p className="text-gray-600 font-medium">Click to upload your CV</p>
                        <p className="text-gray-400 text-xs mt-1">PDF, DOC, DOCX up to 10MB</p>
                      </div>
                    )}
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ApplyJobDialog;