// components/ShareJobDialog.jsx
"use client";
import React from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  FaWhatsapp,
  FaEnvelope,
  FaShareAlt,
  FaCopy,
  FaTimes,
} from "react-icons/fa";
import {
  SiLinkedin,
  SiFacebook,
} from "react-icons/si";

const ShareJobDialog = ({ 
  job, 
  isOpen, 
  onOpenChange 
}) => {
  if (!job) return null;

  const generateJobUrl = (jobId) => {
    return `${window.location.origin}/jobs/${jobId}`;
  };

  const copyToClipboard = () => {
    if (!job) return;

    const shareText = `Check out this job opportunity: ${job.job_titel?.name} at ${job.company?.name} in ${job.city?.name}, ${job.city?.country?.name}.`;
    const jobUrl = generateJobUrl(job.id);
    const fullText = `${jobUrl}`;

    navigator.clipboard.writeText(fullText)
      .then(() => {
        toast.success('Job details copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy to clipboard');
      });
  };

  const shareViaWhatsApp = () => {
    if (!job) return;

    const shareText = `Check out this job opportunity: ${job.job_titel?.name} at ${job.company?.name} in ${job.city?.name}, ${job.city?.country?.name}.`;
    const jobUrl = generateJobUrl(job.id);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + jobUrl)}`;

    window.open(whatsappUrl, '_blank');
  };

  const shareViaEmail = () => {
    if (!job) return;

    const shareText = `Check out this job opportunity: ${job.job_titel?.name} at ${job.company?.name} in ${job.city?.name}, ${job.city?.country?.name}.`;
    const jobUrl = generateJobUrl(job.id);
    const emailSubject = `Job Opportunity: ${job.job_titel?.name}`;
    const emailBody = `${shareText}\n\nCheck it out: ${jobUrl}`;

    window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  const shareViaSocial = (platform) => {
    if (!job) return;

    const shareText = `Check out this job opportunity: ${job.job_titel?.name} at ${job.company?.name}`;
    const jobUrl = generateJobUrl(job.id);

    let shareUrl;
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareViaNative = () => {
    if (!job) return;

    if (navigator.share) {
      const shareText = `Check out this job opportunity: ${job.job_titel?.name} at ${job.company?.name} in ${job.city?.name}, ${job.city?.country?.name}.`;
      const jobUrl = generateJobUrl(job.id);

      navigator.share({
        title: job.job_titel?.name,
        text: shareText,
        url: jobUrl,
      })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      copyToClipboard();
    }
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
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
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-full max-w-md shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50"
          aria-label="Share Job Dialog"
        >
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-2xl font-bold text-gray-900">
              Share Job
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <FaTimes className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 text-lg font-semibold">
                  {job.company?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{job.job_titel?.name}</h3>
                <p className="text-sm text-gray-600">{job.company?.name}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Location:</span> {job.city?.name}, {job.city?.country?.name}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Salary:</span> {job.expected_salary} {job.city?.country?.name === 'Egypt' ? 'EGP' : ''}
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-xs text-blue-700 break-all">
                Share URL: {generateJobUrl(job.id)}
              </p>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              Share this job opportunity with your network.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-4">
            <button
              onClick={copyToClipboard}
              className="flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              title="Copy to clipboard"
            >
              <FaCopy className="w-5 h-5 mb-2" />
              <span className="text-xs">Copy</span>
            </button>

            <button
              onClick={shareViaWhatsApp}
              className="flex flex-col items-center justify-center bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              title="Share via WhatsApp"
            >
              <FaWhatsapp className="w-5 h-5 mb-2" />
              <span className="text-xs">WhatsApp</span>
            </button>

            <button
              onClick={shareViaEmail}
              className="flex flex-col items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              title="Share via Email"
            >
              <FaEnvelope className="w-5 h-5 mb-2" />
              <span className="text-xs">Email</span>
            </button>

            <button
              onClick={shareViaNative}
              className="flex flex-col items-center justify-center bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              title="Share via other apps"
            >
              <FaShareAlt className="w-5 h-5 mb-2" />
              <span className="text-xs">Other</span>
            </button>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3 text-center">
              Or share on social media
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => shareViaSocial('facebook')}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-full transition-all duration-300"
                title="Share on Facebook"
              >
                <SiFacebook className="w-5 h-5" />
              </button>
              <button
                onClick={() => shareViaSocial('linkedin')}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-full transition-all duration-300"
                title="Share on LinkedIn"
              >
                <SiLinkedin className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ShareJobDialog;