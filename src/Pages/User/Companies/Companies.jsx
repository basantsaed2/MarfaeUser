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
import { MapPin, Phone, Mail, Link, Facebook, Twitter, Linkedin, Building2, FlaskConical, Copy } from 'lucide-react';
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
                {Icon && <Icon className="w-6 h-6 text-indigo-500" />}
                <span className="font-medium text-gray-800">{label}:</span>
                {isEmail ? (
                    <a
                        href={`mailto:${value}`}
                        className="text-indigo-600 hover:underline truncate max-w-[200px]"
                    >
                        {value}
                    </a>
                ) : isPhone ? (
                    <div className="flex items-center gap-2">
                        <a
                            href={`https://wa.me/${value.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline truncate max-w-[150px]"
                        >
                            {value}
                        </a>
                        <button
                            onClick={() => handleCopyPhone(value)}
                            className="p-1 text-indigo-500 hover:text-indigo-700 focus:outline-none relative"
                            title="Copy phone number"
                        >
                            <Copy className="w-5 h-5" />
                            {copied && label === "Phone" && (
                                <span className="absolute left-0 top-8 bg-indigo-600 text-white text-xs px-2 py-1 rounded shadow">
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
                        className="text-indigo-600 hover:underline truncate max-w-[200px]"
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
                <div className="flex flex-col md:flex-row items-center gap-4 bg-white rounded-lg shadow-md py-4 px-4 md:px-6 m-5">
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 w-full p-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Select
                        options={specializations}
                        value={selectedSpecialization}
                        onChange={setSelectedSpecialization}
                        placeholder="Filter by specialization"
                        className="w-full md:w-64"
                        isClearable
                    />
                    <Select
                        options={countryOptions}
                        value={selectedCountry}
                        onChange={setSelectedCountry}
                        placeholder="Filter by country"
                        className="w-full md:w-64"
                        isClearable
                    />
                    <Button
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedSpecialization(null);
                            setSelectedCountry(null);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors duration-200"
                    >
                        Clear Filters
                    </Button>
                </div>

                {/* Companies Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6 px-4 md:px-8">
                    {filteredCompanies.map((company, index) => (
                        <motion.div
                            key={company.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -4 }}
                        >
                            <div className="h-48 relative">
                                {company.image_link && !company.image_link.includes("400 Bad Request") ? (
                                    <img
                                        src={company.image_link}
                                        alt={company.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                                        <span className="text-gray-500">No Image Available</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{company.name}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">{company.description}</p>

                                {company.company_specializations?.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-500 mb-1">Specializations:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {company.company_specializations.map((spec) => (
                                                <span
                                                    key={spec.id}
                                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                                >
                                                    {spec.specialization.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                    onClick={() => handleViewCompanyClick(company)}
                                    variant="secondary"
                                >
                                    View Company Details
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredCompanies.length === 0 && (
                    <p className="text-center text-gray-500 mt-8">No companies found.</p>
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
                            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto overflow-x-hidden p-0 bg-gradient-to-br from-gray-50 to-gray-100">
                                {/* Company Image in Dialog Header */}
                                <motion.div
                                    className="w-full h-64 bg-gray-200 flex items-center justify-center relative overflow-hidden"
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
                                        <span className="text-gray-500 text-lg font-medium">No Image Available</span>
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
                                            <Building2 className="w-7 h-7 text-indigo-600" /> Company Overview
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
                                            <Phone className="w-6 h-6 text-green-600" /> Contact Info
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
                                                <Building2 className="w-6 h-6 text-blue-600" /> Specializations
                                            </h4>
                                            <div className="flex flex-wrap gap-3">
                                                {selectedCompanyDetails.company_specializations.map((spec) => (
                                                    <span
                                                        key={spec.id}
                                                        className="bg-indigo-100 text-indigo-800 text-sm px-4 py-2 rounded-full font-medium hover:bg-indigo-200 transition-colors"
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
                                                <FlaskConical className="w-6 h-6 text-red-600" /> Products/Drugs
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
                                            <Link className="w-6 h-6 text-purple-600" /> External Links
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
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
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