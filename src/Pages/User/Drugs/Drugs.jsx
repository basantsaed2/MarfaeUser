"use client";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import companyImage from '@/assets/company.png';
import { FlaskConical, Building2, CalendarDays, Tag, DollarSign, ArrowLeft, ArrowRight, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';

const Drugs = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchDrugs, loading: loadingDrugs, data: DrugsData } = useGet({
        url: `${apiUrl}/user/getDrugs`,
    });

    const [drugs, setDrugs] = useState([]);
    const [drugCategories, setDrugCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        refetchDrugs();
    }, [refetchDrugs]);

    useEffect(() => {
        if (DrugsData && DrugsData.drugs) {
            setDrugs(DrugsData.drugs);

            const extractedCategories = [];
            const categoryIds = new Set();
            DrugsData.drugs.forEach(drug => {
                if (drug.drug_category && drug.drug_category.id && !categoryIds.has(drug.drug_category.id)) {
                    extractedCategories.push(drug.drug_category);
                    categoryIds.add(drug.drug_category.id);
                }
            });
            setDrugCategories(extractedCategories);

            const extractedCompanies = [];
            const companyIds = new Set();
            DrugsData.drugs.forEach(drug => {
                if (drug.company && drug.company.id && !companyIds.has(drug.company.id)) {
                    extractedCompanies.push(drug.company);
                    companyIds.add(drug.company.id);
                }
            });
            setCompanies(extractedCompanies);
        }
    }, [DrugsData]);

    const categoryOptions = drugCategories.map(cat => ({ value: cat.id, label: cat.name }));
    const companyOptions = companies.map(comp => ({ value: comp.id, label: comp.name }));

    // Filter drugs
    const filteredDrugs = drugs.filter((drug) => {
        const matchesSearch =
            drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (drug.description && drug.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory
            ? drug.drug_category_id === selectedCategory.value
            : true;
        const matchesCompany = selectedCompany
            ? drug.company_id === selectedCompany.value
            : true;
        return matchesSearch && matchesCategory && matchesCompany;
    });

    // Pagination calculations
    const totalItems = filteredDrugs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDrugs = filteredDrugs.slice(startIndex, endIndex);

    // Pagination handlers
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // Format price
    const formatPrice = (price) => {
        if (!price) return "—";
        return `${parseFloat(price)}`;
    };

    // Excel export handler
    const handleDownloadExcel = () => {
        const dataToExport = filteredDrugs.map(drug => ({
            'Drug Name': drug.name,
            'Category': drug.drug_category?.name || 'N/A',
            'Manufacturer': drug.company?.name || 'N/A',
            'Price (EGP)': drug.price ? parseFloat(drug.price) : 'N/A',
            'Description': drug.description || 'No description available'
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Drugs");

        // Adjust column widths
        const maxWidths = [
            { wch: 30 }, // Drug Name
            { wch: 20 }, // Category
            { wch: 20 }, // Manufacturer
            { wch: 15 }, // Price
            { wch: 50 }, // Description
        ];
        worksheet['!cols'] = maxWidths;

        XLSX.writeFile(workbook, `Drugs_List_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
    };

    if (loadingDrugs) {
        return <FullPageLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-bg-primary/5">
            <div className="w-full flex flex-col gap-4">
                {/* Header Image */}
                <motion.div
                    className="w-full h-64 relative overflow-hidden"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <img
                        src={companyImage}
                        alt="Drugs List Banner"
                        className="object-cover md:object-fill h-full w-full"
                    />
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    >
                        <h1 className="text-2xl text-center md:text-3xl font-bold text-white drop-shadow-lg">Pharmaceutical Products</h1>
                    </motion.div>
                </motion.div>

                {/* Search and Filter Section */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-4 bg-white rounded-2xl shadow-lg py-6 px-6 m-5 border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
                >
                    <motion.input
                        type="text"
                        placeholder="Search by drug name or description..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bg-primary focus:border-bg-primary transition-all duration-200"
                        whileHover={{ scale: 1.01 }}
                        whileFocus={{ scale: 1.01 }}
                    />
                    <Select
                        options={categoryOptions}
                        value={selectedCategory}
                        onChange={(value) => {
                            setSelectedCategory(value);
                            setCurrentPage(1);
                        }}
                        placeholder="Filter by Category"
                        className="w-full"
                        isClearable
                        classNamePrefix="react-select"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                borderColor: '#d1d5db',
                                borderRadius: '12px',
                                boxShadow: 'none',
                                '&:hover': {
                                    borderColor: 'var(--color-bg-primary)',
                                },
                            }),
                            menuList: (provided) => ({
                                ...provided,
                                overflowX: 'hidden',
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isSelected ? 'var(--color-bg-primary)' : state.isFocused ? 'var(--color-bg-primary)/10' : null,
                                color: state.isSelected ? 'white' : '#1f2937',
                                borderRadius: '8px',
                                margin: '2px 8px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }),
                        }}
                    />
                    <Select
                        options={companyOptions}
                        value={selectedCompany}
                        onChange={(value) => {
                            setSelectedCompany(value);
                            setCurrentPage(1);
                        }}
                        placeholder="Filter by Company"
                        className="w-full"
                        isClearable
                        classNamePrefix="react-select"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                borderColor: '#d1d5db',
                                borderRadius: '12px',
                                boxShadow: 'none',
                                '&:hover': {
                                    borderColor: 'var(--color-bg-primary)',
                                },
                            }),
                            menuList: (provided) => ({
                                ...provided,
                                overflowX: 'hidden',
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isSelected ? 'var(--color-bg-primary)' : state.isFocused ? 'var(--color-bg-primary)/10' : null,
                                color: state.isSelected ? 'white' : '#1f2937',
                                borderRadius: '8px',
                                margin: '2px 8px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }),
                        }}
                    />
                    <motion.div
                        className="flex gap-2"
                        whileHover={{ scale: 1.02 }}
                    >
                        <Button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory(null);
                                setSelectedCompany(null);
                                setCurrentPage(1);
                            }}
                            className="bg-bg-primary hover:bg-bg-primary/90 w-full md:w-1/2 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg w-full"
                        >
                            Clear Filters
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Results and Pagination Info */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 mb-6">
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="text-gray-600 font-medium"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} products
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Button
                                onClick={handleDownloadExcel}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md flex items-center gap-2 text-sm"
                                title="Download as Excel"
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                <span>Export Excel</span>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Button
                                variant="outline"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-primary/10 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Previous
                            </Button>

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
                                            className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${currentPage === pageNum
                                                ? 'bg-bg-primary text-white shadow-md'
                                                : 'text-gray-600 hover:bg-bg-primary/10 hover:text-bg-primary border border-transparent hover:border-bg-primary/20'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-primary/10 transition-colors"
                            >
                                Next
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    )}
                </div>

                {/* Drugs Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-3 px-4 md:px-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    {currentDrugs.length > 0 ? (
                        currentDrugs.map((drug, index) => (
                            <motion.div
                                key={drug.id}
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                            >
                                {/* Background Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-bg-primary/5 to-white opacity-50 rounded-2xl -z-10 group-hover:opacity-70 transition-opacity duration-300"></div>

                                {/* Product Image */}
                                <motion.div
                                    className="h-48 w-full rounded-xl overflow-hidden mb-4 border border-gray-200 flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300"
                                    initial={{ scale: 1.1, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                                >
                                    {drug.image_link && !drug.image_link.includes("400 Bad Request") ? (
                                        <img
                                            src={drug.image_link}
                                            alt={drug.name}
                                            className="object-contain h-full w-full p-2 group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-center p-4">
                                            <FlaskConical className="w-16 h-16 mx-auto mb-3 opacity-60" />
                                            <span className="text-sm font-medium">No Product Image</span>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Product Name */}
                                <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-bg-primary transition-colors duration-200">
                                    {drug.name}
                                </h2>

                                {/* Product Description */}
                                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3 leading-relaxed">
                                    {drug.description || "No description available for this product."}
                                </p>

                                {/* Product Details */}
                                <div className="space-y-3 text-sm mt-auto pt-4 border-t border-gray-100">
                                    {/* Price */}
                                    {drug.price && (
                                        <div className="flex items-center justify-between bg-gradient-to-r from-bg-primary/10 to-bg-primary/5 p-3 rounded-lg border border-bg-primary/20">
                                            <div className="flex items-center gap-2 text-bg-primary font-semibold">
                                                <DollarSign className="w-4 h-4" />
                                                <span>Price</span>
                                            </div>
                                            <span className="font-bold text-bg-primary text-lg">
                                                {formatPrice(drug.price)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Category */}
                                    {drug.drug_category?.name && (
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <div className="flex items-center gap-2 flex-1">
                                                <Tag className="w-4 h-4 text-bg-primary" />
                                                <span className="font-medium">Category:</span>
                                            </div>
                                            <span className="bg-bg-primary/10 text-bg-primary px-3 py-1 rounded-full text-xs font-medium">
                                                {drug.drug_category.name}
                                            </span>
                                        </div>
                                    )}

                                    {/* Company */}
                                    {drug.company?.name && (
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <div className="flex items-center gap-2 flex-1">
                                                <Building2 className="w-4 h-4 text-bg-primary" />
                                                <span className="font-medium">Manufacturer:</span>
                                            </div>
                                            <span className="text-gray-600 text-right text-sm truncate max-w-[120px]">
                                                {drug.company.name}
                                            </span>
                                        </div>
                                    )}

                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            className="col-span-full text-center py-16 rounded-2xl bg-white shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <FlaskConical className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                {Object.values({ searchTerm, selectedCategory, selectedCompany }).some(val => val)
                                    ? "Try adjusting your search criteria or filters to see more results."
                                    : "There are currently no pharmaceutical products available in our database."}
                            </p>
                            {Object.values({ searchTerm, selectedCategory, selectedCompany }).some(val => val) && (
                                <Button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedCategory(null);
                                        setSelectedCompany(null);
                                        setCurrentPage(1);
                                    }}
                                    className="mt-4 bg-bg-primary hover:bg-bg-primary/90 text-white"
                                >
                                    Clear All Filters
                                </Button>
                            )}
                        </motion.div>
                    )}
                </motion.div>

                {/* Bottom Pagination */}
                {totalPages > 1 && (
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-6 bg-white rounded-2xl shadow-lg mx-6 mt-6 border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages} • {totalItems} total products
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-primary/10 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Previous
                            </Button>

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
                                            className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${currentPage === pageNum
                                                ? 'bg-bg-primary text-white shadow-md'
                                                : 'text-gray-600 hover:bg-bg-primary/10 hover:text-bg-primary border border-transparent hover:border-bg-primary/20'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-primary/10 transition-colors"
                            >
                                Next
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Drugs;