"use client";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import companyImagePlaceholder from '@/assets/company.png';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { MapPin, Phone, Mail, Link, Facebook, Twitter, Linkedin, Building2, FlaskConical, Copy, Users, Calendar, ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Companies = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchCompanies, loading: loadingCompanies, data: CompaniesData } = useGet({
        url: `${apiUrl}/user/getCompanies`,
    });
    const { refetch: refetchCountries, loading: loadingCountries, data: CountriesData } = useGet({
        url: `${apiUrl}/user/get-countries`,
    });

    const [companies, setCompanies] = useState([]);
    const [countries, setCountries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialization, setSelectedSpecialization] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [showCompanyDialog, setShowCompanyDialog] = useState(false);
    const [selectedCompanyDetails, setSelectedCompanyDetails] = useState(null);
    const [copied, setCopied] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);

    useEffect(() => {
        refetchCompanies();
        refetchCountries();
    }, [refetchCompanies, refetchCountries]);

    useEffect(() => {
        if (CompaniesData && CompaniesData.companies) {
            setCompanies(CompaniesData.companies);
        }
    }, [CompaniesData]);

    useEffect(() => {
        if (CountriesData && CountriesData.countries) {
            setCountries(CountriesData.countries);
        }
    }, [CountriesData]);

    // Extract unique specializations for filter
    const specializations = [
        ...new Set(
            companies.flatMap(company =>
                company.company_specializations.map(spec => spec.specialization.name)
            )
        )
    ].map(spec => ({ value: spec, label: spec }));

    // Format countries for Select component
    const countryOptions = countries.map(country => ({
        value: country.id,
        label: country.name,
    }));

    // Filter companies based on search, specialization, and country
    const filteredCompanies = companies.filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialization = selectedSpecialization
            ? company.company_specializations.some(spec => spec.specialization.name === selectedSpecialization.value)
            : true;
        const matchesCountry = selectedCountry
            ? company.country_id === selectedCountry.value
            : true;

        return matchesSearch && matchesSpecialization && matchesCountry;
    });

    // Pagination calculations
    const totalItems = filteredCompanies.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

    // Pagination handlers
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
        setShowItemsPerPageDropdown(false);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Function to handle opening the dialog with company details
    const handleViewCompanyClick = (company) => {
        setSelectedCompanyDetails(company);
        setShowCompanyDialog(true);
        setCopied(false); // Reset copied state when opening dialog
    };

    // Function to handle copying phone number to clipboard
    const handleCopyPhone = async (phone) => {
        try {
            await navigator.clipboard.writeText(phone);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Helper function to render a detail row in the dialog
    const DetailRow = ({ icon: Icon, label, value, isLink = false, isEmail = false, isPhone = false }) => {
        if (!value || value === "null" || value === "" || value.includes("400 Bad Request")) {
            return null;
        }
        return (
            <div className="flex items-center gap-3 text-gray-700 relative group">
                {Icon && <Icon className="w-6 h-6 text-bg-primary" />}
                <span className="font-medium text-gray-800">{label}:</span>
                {isEmail ? (
                    <a
                        href={`mailto:${value}`}
                        className="text-bg-primary hover:underline truncate max-w-[200px]"
                    >
                        {value}
                    </a>
                ) : isPhone ? (
                    <div className="flex items-center gap-2">
                        <a
                            href={`https://wa.me/${value.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-bg-primary hover:underline truncate max-w-[150px]"
                        >
                            {value}
                        </a>
                        <button
                            onClick={() => handleCopyPhone(value)}
                            className="p-1 text-bg-primary hover:text-bg-primary/80 focus:outline-none relative"
                            title="Copy phone number"
                        >
                            <Copy className="w-5 h-5" />
                            {copied && label === "Phone" && (
                                <span className="absolute left-0 top-8 bg-bg-primary text-white text-xs px-2 py-1 rounded shadow">
                                    Copied!
                                </span>
                            )}
                        </button>
                    </div>
                ) : isLink ? (
                    <a
                        href={value.startsWith('http') ? value : `https://${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bg-primary hover:underline truncate max-w-[200px]"
                    >
                        {value.split('/').pop().substring(0, 30)}{value.split('/').pop().length > 30 ? '...' : ''}
                    </a>
                ) : (
                    <span className="truncate max-w-[200px]">{value}</span>
                )}
            </div>
        );
    };

    if (loadingCompanies || loadingCountries) {
        return <FullPageLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-bg-primary/5">
            <div className="w-full flex flex-col gap-3">
                {/* Header Image */}
                <motion.div
                    className="w-full h-94 relative overflow-hidden"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <img
                        src={companyImagePlaceholder}
                        alt="Companies List Banner"
                        className="object-cover md:object-fill h-full w-full"
                    />
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    >
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg">Companies List</h1>
                    </motion.div>
                </motion.div>

                {/* Search and Filter */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center gap-4 bg-white rounded-2xl shadow-lg py-6 px-6 m-5 border border-gray-100">
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 w-full p-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bg-primary focus:border-transparent transition-all duration-200"
                    />
                    <Select
                        options={specializations}
                        value={selectedSpecialization}
                        onChange={setSelectedSpecialization}
                        placeholder="Filter by specialization"
                        className="w-full"
                        isClearable
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                padding: '4px',
                                '&:hover': {
                                    borderColor: 'var(--color-bg-primary)'
                                }
                            })
                        }}
                    />
                    <Select
                        options={countryOptions}
                        value={selectedCountry}
                        onChange={setSelectedCountry}
                        placeholder="Filter by country"
                        className="w-full"
                        isClearable
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                padding: '4px',
                                '&:hover': {
                                    borderColor: 'var(--color-bg-primary)'
                                }
                            })
                        }}
                    />
                    <Button
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedSpecialization(null);
                            setSelectedCountry(null);
                            setCurrentPage(1);
                        }}
                        className="bg-bg-primary hover:bg-bg-primary/90 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
                    >
                        Clear Filters
                    </Button>
                </div>

                {/* Results and Pagination Info */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 mb-6">
                    <motion.div
                        className="text-gray-600 font-medium"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} companies
                    </motion.div>

                    {/* Items per page selector */}
                    <div className="relative">
                        <motion.button
                            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                            onClick={() => setShowItemsPerPageDropdown(!showItemsPerPageDropdown)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-gray-700">{itemsPerPage} per page</span>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showItemsPerPageDropdown ? 'rotate-180' : ''}`} />
                        </motion.button>

                        <AnimatePresence>
                            {showItemsPerPageDropdown && (
                                <motion.div
                                    className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 min-w-[120px]"
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {[10, 25, 50, 100].map((option) => (
                                        <button
                                            key={option}
                                            className={`w-full px-4 py-2 text-left hover:bg-bg-primary/10 transition-colors duration-150 ${itemsPerPage === option ? 'bg-bg-primary text-white hover:bg-bg-primary' : 'text-gray-700'
                                                }`}
                                            onClick={() => handleItemsPerPageChange(option)}
                                        >
                                            {option} per page
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Companies Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6 px-4 md:px-8">
                    {currentCompanies.map((company, index) => (
                        <motion.div
                            key={company.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                        >
                            {/* Company Image with Overlay */}
                            <div className="h-48 relative overflow-hidden flex-shrink-0">
                                {company.image_link && !company.image_link.includes("400 Bad Request") ? (
                                    <img
                                        src={company.image_link}
                                        alt={company.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="bg-gradient-to-br from-bg-primary to-bg-primary/80 h-full w-full flex items-center justify-center">
                                        <Building2 className="w-12 h-12 text-white opacity-80" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Specializations Badge */}
                                {company.company_specializations?.length > 0 && (
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-bg-primary/90 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                                            {company.company_specializations[0].specialization.name}
                                            {company.company_specializations.length > 1 && ` +${company.company_specializations.length - 1}`}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Company Content - This section will grow and push button to bottom */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1">{company.name}</h3>
                                </div>

                                <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed flex-grow">
                                    {company.description || "No description available."}
                                </p>

                                {/* Specializations */}
                                {company.company_specializations?.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {company.company_specializations.slice(0, 3).map((spec) => (
                                                <span
                                                    key={spec.id}
                                                    className="bg-bg-primary/10 text-bg-primary text-xs px-3 py-1.5 rounded-full font-medium border border-bg-primary/20"
                                                >
                                                    {spec.specialization.name}
                                                </span>
                                            ))}
                                            {company.company_specializations.length > 3 && (
                                                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium">
                                                    +{company.company_specializations.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Action Button - This will always be at the bottom */}
                                <div className="mt-auto pt-4">
                                    <Button
                                        className="w-full bg-gradient-to-r from-bg-primary to-bg-primary/90 hover:from-bg-primary/90 hover:to-bg-primary text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg group/btn"
                                        onClick={() => handleViewCompanyClick(company)}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                            View Details
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredCompanies.length === 0 && (
                    <motion.div
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No companies found matching your criteria.</p>
                        <Button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedSpecialization(null);
                                setSelectedCountry(null);
                                setCurrentPage(1);
                            }}
                            className="mt-4 bg-bg-primary hover:bg-bg-primary/90 text-white"
                        >
                            Clear Filters
                        </Button>
                    </motion.div>
                )}

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-6 bg-white rounded-2xl shadow-lg mx-4 md:mx-6 mt-6 border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* Page Info */}
                        <div className="text-sm text-gray-600 whitespace-nowrap">
                            Page {currentPage} of {totalPages}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center gap-2">
                            {/* Previous Button */}
                            <Button
                                variant="outline"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-primary/10 transition-colors text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Previous</span>
                            </Button>

                            {/* Page Numbers - ALWAYS VISIBLE */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-medium transition-all duration-200 text-sm ${currentPage === pageNum
                                                    ? 'bg-bg-primary text-white shadow-md'
                                                    : 'text-gray-600 hover:bg-bg-primary/10 hover:text-bg-primary border border-transparent hover:border-bg-primary/20'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Next Button */}
                            <Button
                                variant="outline"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-primary/10 transition-colors text-sm"
                            >
                                <span className="hidden sm:inline">Next</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Company Details Dialog */}
            <Dialog open={showCompanyDialog} onOpenChange={setShowCompanyDialog}>
                <AnimatePresence>
                    {showCompanyDialog && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto overflow-x-hidden p-0 bg-gradient-to-br from-gray-50 to-bg-primary/5">
                                {/* Company Image in Dialog Header */}
                                <motion.div
                                    className="w-full h-64 bg-gradient-to-br from-bg-primary to-bg-primary/80 flex items-center justify-center relative overflow-hidden"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {selectedCompanyDetails?.image_link && !selectedCompanyDetails.image_link.includes("400 Bad Request") ? (
                                        <img
                                            src={selectedCompanyDetails.image_link}
                                            alt={selectedCompanyDetails.name}
                                            className="w-full h-full object-cover transition-transform duration-300"
                                        />
                                    ) : (
                                        <Building2 className="w-20 h-20 text-white opacity-80" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                                        <DialogTitle className="text-4xl font-extrabold text-white drop-shadow-lg">
                                            {selectedCompanyDetails?.name}
                                        </DialogTitle>
                                    </div>
                                </motion.div>

                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/80 backdrop-blur-sm rounded-t-2xl">
                                    {/* Basic Information */}
                                    <motion.div
                                        className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 }}
                                    >
                                        <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                                            <Building2 className="w-7 h-7 text-bg-primary" /> Company Overview
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed text-lg">
                                            {selectedCompanyDetails?.description || "No description available."}
                                        </p>
                                    </motion.div>

                                    {/* Contact Information */}
                                    <motion.div
                                        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                    >
                                        <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                                            <Phone className="w-6 h-6 text-bg-primary" /> Contact Info
                                        </h4>
                                        <div className="space-y-4">
                                            <DetailRow icon={Mail} label="Email" value={selectedCompanyDetails?.email} isEmail={true} />
                                            <DetailRow icon={Phone} label="Phone" value={selectedCompanyDetails?.phone} isPhone={true} />
                                            <DetailRow icon={MapPin} label="Location" value={selectedCompanyDetails?.location_link} isLink={true} />
                                        </div>
                                    </motion.div>

                                    {/* Specializations */}
                                    {selectedCompanyDetails?.company_specializations?.length > 0 && (
                                        <motion.div
                                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.3 }}
                                        >
                                            <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                                                <Building2 className="w-6 h-6 text-bg-primary" /> Specializations
                                            </h4>
                                            <div className="flex flex-wrap gap-3">
                                                {selectedCompanyDetails.company_specializations.map((spec) => (
                                                    <span
                                                        key={spec.id}
                                                        className="bg-bg-primary/10 text-bg-primary text-sm px-4 py-2 rounded-full font-medium hover:bg-bg-primary/20 transition-colors"
                                                    >
                                                        {spec.specialization?.name || "N/A"}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Drugs (if any) */}
                                    {selectedCompanyDetails?.drugs?.length > 0 && (
                                        <motion.div
                                            className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.4 }}
                                        >
                                            <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                                                <FlaskConical className="w-6 h-6 text-bg-primary" /> Products/Drugs
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                {selectedCompanyDetails.drugs.map(drug => (
                                                    <motion.div
                                                        key={drug.id}
                                                        className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                                                        whileHover={{ scale: 1.02 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <h5 className="font-semibold text-gray-900 text-lg">{drug.name}</h5>
                                                        <p className="text-sm text-gray-600 mt-2">{drug.description}</p>
                                                        {drug.image_link && !drug.image_link.includes("400 Bad Request") && (
                                                            <img src={drug.image_link} alt={drug.name} className="w-full h-32 object-contain mt-3 rounded-lg" />
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* External Links */}
                                    <motion.div
                                        className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.5 }}
                                    >
                                        <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                                            <Link className="w-6 h-6 text-bg-primary" /> External Links
                                        </h4>
                                        <div className="space-y-4">
                                            <DetailRow icon={Link} label="Website" value={selectedCompanyDetails?.site_link} isLink={true} />
                                            <DetailRow icon={Facebook} label="Facebook" value={selectedCompanyDetails?.facebook_link} isLink={true} />
                                            <DetailRow icon={Twitter} label="Twitter" value={selectedCompanyDetails?.twitter_link} isLink={true} />
                                            <DetailRow icon={Linkedin} label="LinkedIn" value={selectedCompanyDetails?.linkedin_link} isLink={true} />
                                        </div>
                                    </motion.div>
                                </div>

                                <DialogFooter className="p-6 border-t border-gray-200 flex justify-end bg-white">
                                    <Button
                                        onClick={() => setShowCompanyDialog(false)}
                                        className="bg-bg-primary hover:bg-bg-primary/90 text-white px-6 py-2 rounded-xl shadow-md transition-colors duration-200 hover:shadow-lg"
                                    >
                                        Close
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Dialog>
        </div>
    );
};

export default Companies;