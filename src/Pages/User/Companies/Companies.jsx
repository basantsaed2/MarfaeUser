"use client";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import companyImagePlaceholder from '@/assets/company.png'; // Renamed to avoid conflict if company.image is used
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"; // Assuming shadcn/ui Dialog component
import { MapPin, Phone, Mail, Link, Facebook, Twitter, Linkedin, Building2, FlaskConical } from 'lucide-react'; // Example icons

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
    };

    // Helper function to render a detail row in the dialog
    const DetailRow = ({ icon: Icon, label, value, isLink = false }) => {
        if (!value || value === "null" || value === "" || value.includes("400 Bad Request")) {
            return null; // Don't render if value is empty, null, or a bad request
        }
        return (
            <div className="flex items-center gap-2 text-gray-700">
                {Icon && <Icon className="w-5 h-5 text-blue-500" />}
                <span className="font-medium">{label}:</span>
                {isLink ? (
                    <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {value.split('/').pop().substring(0, 30)}{value.split('/').pop().length > 30 ? '...' : ''}
                    </a>
                ) : (
                    <span>{value}</span>
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
                <div className="w-full h-94 relative">
                    <img
                        src={companyImagePlaceholder} // Using the renamed placeholder
                        alt="Companies List Banner"
                        className="object-cover md:object-fill h-full w-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg">Companies List</h1>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row items-center gap-4 bg-white rounded-lg shadow-md py-4 px-4 md:px-6 m-5">
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 p-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6 px-4 md:px-6">
                    {filteredCompanies.map((company) => (
                        <div
                            key={company.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        // Removed onClick from here, now handled by the button
                        >
                            <div className="h-48 relative">
                                {company.image_link && !company.image_link.includes("400 Bad Request") ? (
                                    <img
                                        src={company.image_link}
                                        alt={company.name}
                                        className="w-full h-full object-cover" // Added w-full h-full object-cover
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
                                    variant="secondary" // CHANGE HERE: Use "secondary" variant
                                >
                                    View Company Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCompanies.length === 0 && (
                    <p className="text-center text-gray-500 mt-8">No companies found.</p>
                )}
            </div>

            {/* Company Details Dialog */}
            {selectedCompanyDetails && (
                <Dialog open={showCompanyDialog} onOpenChange={setShowCompanyDialog}>
                    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 bg-white">
                        {/* Company Image in Dialog Header */}
                        <div className="w-full h-56 bg-gray-200 flex items-center justify-center relative">
                            {selectedCompanyDetails.image_link && !selectedCompanyDetails.image_link.includes("400 Bad Request") ? (
                                <img
                                    src={selectedCompanyDetails.image_link}
                                    alt={selectedCompanyDetails.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-500 text-lg">No Image Available</span>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                <DialogTitle className="text-3xl font-bold text-white drop-shadow-md">
                                    {selectedCompanyDetails.name}
                                </DialogTitle>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="md:col-span-2">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Building2 className="w-6 h-6 text-indigo-600" /> Company Overview
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {selectedCompanyDetails.description || "No description available."}
                                </p>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-green-600" /> Contact Info
                                </h4>
                                <div className="space-y-2">
                                    <DetailRow icon={Mail} label="Email" value={selectedCompanyDetails.email} />
                                    <DetailRow icon={Phone} label="Phone" value={selectedCompanyDetails.phone} />
                                    <DetailRow icon={MapPin} label="Location" value={selectedCompanyDetails.location_link} />
                                </div>
                            </div>

                            {/* Specializations */}
                            {selectedCompanyDetails.company_specializations?.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-blue-600" /> Specializations
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCompanyDetails.company_specializations.map((spec) => (
                                            <span
                                                key={spec.id}
                                                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
                                            >
                                                {spec.specialization?.name || "N/A"}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Drugs (if any) */}
                            {selectedCompanyDetails.drugs?.length > 0 && (
                                <div className="md:col-span-2">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <FlaskConical className="w-5 h-5 text-red-600" /> Products/Drugs
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {selectedCompanyDetails.drugs.map(drug => (
                                            <div key={drug.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                                                <h5 className="font-semibold text-gray-900">{drug.name}</h5>
                                                <p className="text-sm text-gray-600 mt-1">{drug.description}</p>
                                                {/* Optionally show drug image if available */}
                                                {drug.image_link && !drug.image_link.includes("400 Bad Request") && (
                                                    <img src={drug.image_link} alt={drug.name} className="w-full h-24 object-contain mt-2 rounded" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* External Links */}
                            <div className="md:col-span-2">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Link className="w-5 h-5 text-purple-600" /> External Links
                                </h4>
                                <div className="space-y-2">
                                    <DetailRow icon={Link} label="Website" value={selectedCompanyDetails.site_link} isLink={true} />
                                    <DetailRow icon={Facebook} label="Facebook" value={selectedCompanyDetails.facebook_link} isLink={true} />
                                    <DetailRow icon={Twitter} label="Twitter" value={selectedCompanyDetails.twitter_link} isLink={true} />
                                    <DetailRow icon={Linkedin} label="LinkedIn" value={selectedCompanyDetails.linkedin_link} isLink={true} />
                                </div>
                            </div>

                            {/* Other Details (General Keys) */}
                            {/* <div className="md:col-span-2">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-orange-600" /> Other Details
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                    Iterating through all keys, but carefully handling complex ones
                                    {Object.entries(selectedCompanyDetails).map(([key, value]) => {
                                        Skip keys already handled explicitly above or complex objects
                                        const skippedKeys = [
                                            "id", "name", "description", "email", "phone", "location_link",
                                            "image", "image_link", // Handled by image display
                                            "site_link", "facebook_link", "twitter_link", "linkedin_link", // Handled by external links
                                            "company_specializations", "drugs", // Handled by dedicated sections
                                            "user_id", "city_id", "company_type_id", // Often internal IDs
                                            "created_at", "updated_at", "start_date", "end_date", // Dates can be formatted if needed, else skip for conciseness
                                            "country_id", "status" // Status is often just 'active', country name is better
                                        ];

                                        if (skippedKeys.includes(key) || typeof value === 'object' && value !== null) {
                                            return null;
                                        }

                                        // Try to get country name if country_id is present
                                        if (key === 'country_id' && value !== null) {
                                            const country = countries.find(c => c.id === value);
                                            return (
                                                <div key={key} className="flex items-center gap-2 text-gray-700">
                                                    <MapPin className="w-5 h-5 text-blue-500" />
                                                    <span className="font-medium">Country:</span>
                                                    <span>{country ? country.name : 'N/A'}</span>
                                                </div>
                                            );
                                        }


                                        return (
                                            <div key={key} className="flex items-center gap-2 text-gray-700 break-words">
                                                <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                                                <span>{value !== null && value !== "" ? String(value) : "N/A"}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div> */}
                        </div>

                        <DialogFooter className="p-6 border-t border-gray-200">
                            <Button onClick={() => setShowCompanyDialog(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default Companies;