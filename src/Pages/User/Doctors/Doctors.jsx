"use client";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { usePost } from "@/Hooks/UsePost";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import companyImage from '@/assets/company.png';
import { FiFilter, FiMapPin, FiClock, FiSearch, FiCalendar, FiAward, FiXCircle } from "react-icons/fi";
import { FaStethoscope } from "react-icons/fa";
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

// Custom styles for react-select
const customSelectStyles = {
    menu: (provided) => ({
        ...provided,
        maxHeight: '220px',
        overflowY: 'auto',
        zIndex: 9999,
    }),
    menuList: (provided) => ({
        ...provided,
        maxHeight: '220px',
        overflowY: 'auto',
    }),
    control: (provided) => ({
        ...provided,
        minHeight: '40px',
    }),
    option: (provided) => ({
        ...provided,
        padding: '10px 12px',
    }),
};

// Custom styles for multi-select
const customMultiSelectStyles = {
    ...customSelectStyles,
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: 'var(--color-bg-primary)',
        color: 'white',
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: 'white',
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: 'white',
        ':hover': {
            backgroundColor: '#ef4444',
            color: 'white',
        },
    }),
};

const Doctors = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // State management
    const [allDoctors, setAllDoctors] = useState([]);
    const [displayedDoctors, setDisplayedDoctors] = useState([]);
    const [filters, setFilters] = useState({
        address: "",
        specialization_id: null,
        doctor_name: "",
        available_start_time: "",
        available_end_time: "",
        availability_days: [],
    });
    const [showFilters, setShowFilters] = useState(false);
    const [specializations, setSpecializations] = useState([]);
    const [selectedDoctorDetails, setSelectedDoctorDetails] = useState(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

    // Days of week for availability
    const daysOfWeek = [
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' },
        { value: 'saturday', label: 'Saturday' },
        { value: 'sunday', label: 'Sunday' }
    ];

    // Format time for input (keep as HH:MM)
    const formatTime = (timeString) => {
        if (!timeString) return "—";
        return timeString.split(':').slice(0, 2).join(':');
    };

    // Format time for display with AM/PM
    const formatTimeWithAMPM = (timeString) => {
        if (!timeString) return "—";

        // Extract hours and minutes
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const minute = minutes || '00';

        // Convert to 12-hour format
        const period = hour >= 12 ? 'PM' : 'AM';
        const twelveHour = hour % 12 || 12;

        return `${twelveHour}:${minute} ${period}`;
    };

    // API hooks
    const { refetch: refetchDoctors, loading: loadingDoctors, data: doctorsData } = useGet({
        url: `${apiUrl}/user/doctors`,
    });

    const { refetch: refetchSpecializations, loading: loadingSpecializations, data: specializationsData } = useGet({
        url: `${apiUrl}/user/specializations/get`,
    });

    const { postData, loading: loadingSearch, response: searchResponse } = usePost({
        url: `${apiUrl}/user/search-doctors`,
    });

    // Fetch initial data
    useEffect(() => {
        refetchDoctors();
        refetchSpecializations();
    }, [refetchDoctors, refetchSpecializations]);

    // Process doctors data
    useEffect(() => {
        if (doctorsData?.data?.data) {
            const doctorsArray = Array.isArray(doctorsData.data.data) ? doctorsData.data.data : [];
            setAllDoctors(doctorsArray);
            setDisplayedDoctors(doctorsArray);
        } else if (doctorsData?.doctors) {
            const doctorsArray = Array.isArray(doctorsData.doctors) ? doctorsData.doctors : [];
            setAllDoctors(doctorsArray);
            setDisplayedDoctors(doctorsArray);
        }
    }, [doctorsData]);

    // Process specializations data
    useEffect(() => {
        if (specializationsData?.specializations) {
            setSpecializations(specializationsData.specializations.map(s => ({ value: s.id, label: s.name })));
        }
    }, [specializationsData]);

    // Process search response
    useEffect(() => {
        if (searchResponse?.success && searchResponse?.data?.data) {
            const doctorsArray = Array.isArray(searchResponse.data.data) ? searchResponse.data.data : [];
            setDisplayedDoctors(doctorsArray);
        } else if (searchResponse?.doctors) {
            const doctorsArray = Array.isArray(searchResponse.doctors) ? searchResponse.doctors : [];
            setDisplayedDoctors(doctorsArray);
        } else if (searchResponse?.data?.data?.data) {
            const doctorsArray = Array.isArray(searchResponse.data.data.data) ? searchResponse.data.data.data : [];
            setDisplayedDoctors(doctorsArray);
        } else {
            setDisplayedDoctors([]);
        }
    }, [searchResponse]);

    // Handle filter changes
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Handle multi-select changes for availability days
    const handleMultiSelectChange = (name, selectedOptions) => {
        setFilters(prev => ({ ...prev, [name]: selectedOptions }));
    };

    // Handle text input changes
    const handleTextChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Handle time input changes
    const handleTimeChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Apply filters and search
    const applyFilters = async () => {
        const payload = {
            address: filters.address || null,
            specialization_id: filters.specialization_id?.value || null,
            doctor_name: filters.doctor_name || null,
            available_start_time: filters.available_start_time || null,
            available_end_time: filters.available_end_time || null,
            availability_days: filters.availability_days?.map(day => day.value) || null,
        };

        // Remove null values
        Object.keys(payload).forEach(key => {
            if (payload[key] === null || payload[key] === "" || (Array.isArray(payload[key]) && payload[key].length === 0)) {
                delete payload[key];
            }
        });

        console.log('Search payload:', payload);

        try {
            await postData(payload);
            setShowFilters(false);
        } catch (error) {
            console.error("Error applying filters:", error);
            toast.error("Failed to apply filters");
        }
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            address: "",
            specialization_id: null,
            doctor_name: "",
            available_start_time: "",
            available_end_time: "",
            availability_days: [],
        });
        setDisplayedDoctors(allDoctors);
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

    // Loading state
    if (loadingDoctors || loadingSpecializations) {
        return <FullPageLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-bg-primary/5">
            {loadingSearch && <FullPageLoader />}

            {/* Header Section */}
            <section className="w-full h-64 relative">
                <img
                    src={companyImage}
                    alt="Doctors Banner"
                    className="object-cover md:object-fill h-full w-full"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold text-white drop-shadow-lg text-center">
                        Find Your Doctor
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto text-center mt-2">
                        Browse through our network of qualified healthcare professionals
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="w-full px-4 md:px-8 py-8">
                {/* Filter Bar */}
                <motion.div
                    className="mb-8 bg-white rounded-lg shadow-md p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search by doctor name..."
                                value={filters.doctor_name}
                                onChange={(e) => handleTextChange('doctor_name', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-primary focus:border-bg-primary"
                            />
                            <FiSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        <Button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 bg-bg-primary text-white font-semibold py-2 px-6 rounded-full hover:bg-bg-primary/90 transition-all duration-300"
                        >
                            <FiFilter />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </Button>
                    </div>

                    {/* Filter Section */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {/* Address Filter */}
                                <div className="sm:col-span-2 lg:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search by address, street, area, or landmark..."
                                            value={filters.address}
                                            onChange={(e) => handleTextChange('address', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-primary focus:border-bg-primary"
                                        />
                                        <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Enter street name, area, landmark, or full address
                                    </p>
                                </div>

                                {/* Specialization Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                    <Select
                                        options={[{ value: null, label: 'All Specializations' }, ...specializations]}
                                        value={filters.specialization_id}
                                        onChange={(selected) => handleFilterChange('specialization_id', selected)}
                                        placeholder="Select Specialization"
                                        isClearable
                                        styles={customSelectStyles}
                                    />
                                </div>

                                {/* Start Time Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            value={filters.available_start_time}
                                            onChange={(e) => handleTimeChange('available_start_time', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-primary focus:border-bg-primary"
                                        />
                                        <FiClock className="absolute left-3 top-3 text-gray-400" />
                                    </div>
                                </div>

                                {/* End Time Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Until</label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            value={filters.available_end_time}
                                            onChange={(e) => handleTimeChange('available_end_time', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-primary focus:border-bg-primary"
                                        />
                                        <FiClock className="absolute left-3 top-3 text-gray-400" />
                                    </div>
                                </div>

                                {/* Availability Day Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Days</label>
                                    <Select
                                        options={daysOfWeek}
                                        value={filters.availability_days}
                                        onChange={(selected) => handleMultiSelectChange('availability_days', selected)}
                                        placeholder="Select Days"
                                        isMulti
                                        isClearable
                                        styles={customMultiSelectStyles}
                                        closeMenuOnSelect={false}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 items-end">
                                    <Button
                                        onClick={applyFilters}
                                        disabled={loadingSearch}
                                        className="bg-bg-primary text-white font-semibold py-2 px-6 rounded-full hover:bg-bg-primary/90 transition-all duration-300 disabled:opacity-50"
                                    >
                                        {loadingSearch ? 'Searching...' : 'Apply Filters'}
                                    </Button>
                                    <Button
                                        onClick={resetFilters}
                                        className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-600 transition-all duration-300"
                                    >
                                        <FiXCircle className="inline mr-2" />
                                        Reset
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Results Count */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {displayedDoctors.length} {displayedDoctors.length === 1 ? 'Doctor' : 'Doctors'} Found
                    </h2>
                </div>

                {/* Doctors List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedDoctors.length > 0 ? (
                        displayedDoctors.map((doctor) => (
                            <motion.div
                                key={doctor.id}
                                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">Dr. {doctor.doctor_name}</h3>
                                        <p className="text-gray-600">{doctor.specialization?.name || 'General Practitioner'}</p>
                                    </div>
                                    {doctor.doctor_image_url && (
                                        <img
                                            src={doctor.doctor_image_url}
                                            alt={doctor.doctor_name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    )}
                                </div>

                                <div className="space-y-2 mb-4">
                                    {/* Display address from doctor data */}
                                    {doctor.address && (
                                        <div className="flex items-center text-gray-600">
                                            <FiMapPin className="mr-2 flex-shrink-0" />
                                            <span className="break-words">{doctor.address}</span>
                                        </div>
                                    )}
                                    {/* UPDATED: Using AM/PM format for display */}
                                    <div className="flex items-center text-gray-600">
                                        <FiClock className="mr-2" />
                                        <span>{formatTimeWithAMPM(doctor.available_start_time)} - {formatTimeWithAMPM(doctor.available_end_time)}</span>
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

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => openDoctorDetails(doctor)}
                                        className="border-2 border-bg-primary text-bg-primary hover:bg-bg-primary/10 font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex-1"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center col-span-full">
                            <h3 className="text-xl font-medium text-gray-700 mb-2">No doctors found</h3>
                            <p className="text-gray-500">
                                {Object.values(filters).some(f => f !== null && f !== "" && (!Array.isArray(f) || f.length > 0))
                                    ? "Try adjusting your filters to see more results."
                                    : "There are currently no doctors available. Please check back later."}
                            </p>
                            {Object.values(filters).some(f => f !== null && f !== "" && (!Array.isArray(f) || f.length > 0)) && (
                                <Button
                                    onClick={resetFilters}
                                    className="mt-4 bg-bg-primary text-white font-semibold py-2 px-4 rounded-full hover:bg-bg-primary/90 transition-all duration-300"
                                >
                                    Reset all filters
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Doctor Details Dialog */}
            <Dialog.Root open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-8 w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-xl">
                        {selectedDoctorDetails && (
                            <>
                                <Dialog.Title className="text-3xl font-bold text-gray-900 mb-4">
                                    Dr. {selectedDoctorDetails.doctor_name}
                                </Dialog.Title>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                                            <FiAward className="mr-2 text-bg-primary" />
                                            Specialization
                                        </h4>
                                        <p className="text-gray-700">{selectedDoctorDetails.specialization?.name || 'Not specified'}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                                            <FaStethoscope className="mr-2 text-bg-primary" />
                                            Clinic
                                        </h4>
                                        <p className="text-gray-700">{selectedDoctorDetails.clinic_name || 'Not specified'}</p>
                                    </div>

                                    {/* Display address in details dialog */}
                                    {selectedDoctorDetails.address && (
                                        <div className="md:col-span-2">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                                                <FiMapPin className="mr-2 text-bg-primary" />
                                                Address
                                            </h4>
                                            <p className="text-gray-700">{selectedDoctorDetails.address}</p>
                                        </div>
                                    )}

                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                                            <FiClock className="mr-2 text-bg-primary" />
                                            Availability
                                        </h4>
                                        {/* UPDATED: Using AM/PM format in details dialog */}
                                        <p className="text-gray-700">
                                            {formatTimeWithAMPM(selectedDoctorDetails.available_start_time)} - {formatTimeWithAMPM(selectedDoctorDetails.available_end_time)}
                                        </p>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {formatAvailabilityDays(selectedDoctorDetails.availability_days)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Dialog.Close asChild>
                                        <Button className="bg-bg-primary hover:bg-bg-primary/90 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300">
                                            Close
                                        </Button>
                                    </Dialog.Close>
                                </div>
                            </>
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default Doctors;