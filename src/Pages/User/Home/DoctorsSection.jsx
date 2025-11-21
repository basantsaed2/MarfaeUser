"use client";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiFilter, FiMapPin, FiClock, FiSearch, FiCalendar, FiAward, FiXCircle } from "react-icons/fi";
import { FaStethoscope } from "react-icons/fa";
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DoctorsSection = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const router = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // State management
  const [allDoctors, setAllDoctors] = useState([]);
  const [displayedDoctors, setDisplayedDoctors] = useState([]);
  const [selectedDoctorDetails, setSelectedDoctorDetails] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // API hooks
  const { refetch: refetchDoctors, loading: loadingDoctors, data: doctorsData } = useGet({
    url: `${apiUrl}/user/doctors`,
  });

  // Fetch initial data
  useEffect(() => {
    refetchDoctors();
  }, [refetchDoctors]);

  // Process doctors data
  useEffect(() => {
    if (doctorsData?.data?.data) {
      const doctorsArray = Array.isArray(doctorsData.data.data) ? doctorsData.data.data : [];
      setAllDoctors(doctorsArray);
      setDisplayedDoctors(doctorsArray.slice(0, 6)); // Show only 6 doctors like jobs
    } else if (doctorsData?.doctors) {
      const doctorsArray = Array.isArray(doctorsData.doctors) ? doctorsData.doctors : [];
      setAllDoctors(doctorsArray);
      setDisplayedDoctors(doctorsArray.slice(0, 6)); // Show only 6 doctors like jobs
    }
  }, [doctorsData]);

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "—";
    return timeString.split(':').slice(0, 2).join(':');
  };

  // Format availability days
  const formatAvailabilityDays = (days) => {
    if (!Array.isArray(days) || days.length === 0) return "—";
    return days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ');
  };

  // Open doctor details
  const openDoctorDetails = (doctor) => {
    setSelectedDoctorDetails(doctor);
    setIsDetailsDialogOpen(true);
  };

  const handleBrowseMore = () => {
    if (!user) {
      router("/login");
    } else {
      router("/doctors");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const headingVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  // Loading state
  if (loadingDoctors) {
    return (
      <div className="text-center py-10 text-xl text-gray-600">
        Loading Doctors...
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-white">
      <div className="w-full px-4 md:px-6 lg:px-12 py-12 bg-gradient-to-b from-gray-50 to-white">
        <motion.h2
          className="text-2xl md:text-4xl font-extrabold mb-16 tracking-tight text-center bg-clip-text text-bg-primary"
          variants={headingVariants}
          initial="hidden"
          animate="visible"
        >
          Find Qualified Healthcare Professionals
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {displayedDoctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                className="relative bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 bg-opacity-90 backdrop-blur-sm"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-bg-primary/10 to-bg-primary/20 rounded-full flex items-center justify-center shadow-inner overflow-hidden ring-2 ring-bg-primary/30">
                    {doctor.doctor_image_url ? (
                      <img
                        src={doctor.doctor_image_url}
                        alt={doctor.doctor_name}
                        className="rounded-full w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-bg-primary">
                        {doctor.doctor_name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="ml-5">
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Dr. {doctor.doctor_name}</h3>
                    <p className="text-md text-gray-500 italic">{doctor.specialization?.name || 'General Practitioner'}</p>
                  </div>
                </div>

                <hr className="my-6 border-gray-200/50" />
                <h4 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">{doctor.specialization?.name || 'Medical Professional'}</h4>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                  Available for consultations and medical services.
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-2" />
                    <span>{doctor.city?.name || 'N/A'}, {doctor.country?.name || 'N/A'}</span>
                  </div>
                  {doctor.zone?.name && (
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="mr-2" />
                      <span>{doctor.zone.name}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <FiClock className="mr-2" />
                    <span>{formatTime(doctor.available_start_time)} - {formatTime(doctor.available_end_time)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-2" />
                    <span>{formatAvailabilityDays(doctor.availability_days)}</span>
                  </div>
                  {doctor.clinic_name && (
                    <div className="flex items-center text-gray-600">
                      <FaStethoscope className="mr-2" />
                      <span>{doctor.clinic_name}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between gap-y-4 mt-6">
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => openDoctorDetails(doctor)}
                      className="border-2 border-bg-primary text-bg-primary hover:bg-bg-primary/10 font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex-1"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {displayedDoctors.length === 0 && (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No doctors found</h3>
            <p className="text-gray-500">
              There are currently no doctors available. Please check back later.
            </p>
          </div>
        )}

        <div className="text-center mt-16">
          <button
            onClick={handleBrowseMore}
            className="bg-bg-primary hover:bg-bg-secondary text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Browse All Doctors
          </button>
        </div>
      </div>

      {/* Doctor Details Dialog */}
      <Dialog.Root open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <motion.div
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50"
            style={{ overflowY: 'auto' }}
            aria-label="Doctor Details Dialog"
          >
            {selectedDoctorDetails && (
              <>
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Dialog.Title className="text-3xl font-bold text-gray-900 mb-2">
                    Dr. {selectedDoctorDetails.doctor_name}
                  </Dialog.Title>
                  <div className="flex items-center text-gray-600 mb-6">
                    <span className="font-semibold">{selectedDoctorDetails.specialization?.name || 'Medical Professional'}</span>
                    {selectedDoctorDetails.clinic_name && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{selectedDoctorDetails.clinic_name}</span>
                      </>
                    )}
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-gray-700 text-sm mb-6">
                  <motion.div className="flex items-center" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                    <FiAward className="text-bg-primary mr-2 text-lg" />
                    <strong>Specialization:</strong> {selectedDoctorDetails.specialization?.name || 'Not specified'}
                  </motion.div>
                  <motion.div className="flex items-center" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
                    <FaStethoscope className="text-bg-primary mr-2 text-lg" />
                    <strong>Clinic:</strong> {selectedDoctorDetails.clinic_name || 'Not specified'}
                  </motion.div>
                  <motion.div className="flex items-center" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
                    <FiMapPin className="text-bg-primary mr-2 text-lg" />
                    <strong>Location:</strong> {selectedDoctorDetails.zone?.name && `${selectedDoctorDetails.zone.name}, `}
                    {selectedDoctorDetails.city?.name}, {selectedDoctorDetails.country?.name}
                  </motion.div>
                  <motion.div className="flex items-center" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
                    <FiClock className="text-bg-primary mr-2 text-lg" />
                    <strong>Availability:</strong> {formatTime(selectedDoctorDetails.available_start_time)} - {formatTime(selectedDoctorDetails.available_end_time)}
                  </motion.div>
                </div>

                <motion.div className="mb-6" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.7 }}>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <FiCalendar className="mr-2 text-xl" /> Available Days
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {formatAvailabilityDays(selectedDoctorDetails.availability_days)}
                  </p>
                </motion.div>

                <motion.div
                  className="flex justify-end gap-3"
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
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
    </section>
  );
};

export default DoctorsSection;