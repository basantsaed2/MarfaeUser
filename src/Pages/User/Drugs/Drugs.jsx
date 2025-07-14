"use client";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import companyImage from '@/assets/company.png';
import { FlaskConical, Building2, CalendarDays, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

    if (loadingDrugs) {
        return <FullPageLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full">
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
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg">Drugs List</h1>
                    </motion.div>
                </motion.div>

                {/* Search and Filter Section */}
                <motion.div
                    className="flex flex-col md:flex-row items-center gap-4 bg-white rounded-lg shadow-md py-4 px-4 md:px-6 m-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
                >
                    <motion.input
                        type="text"
                        placeholder="Search by drug name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                        whileHover={{ scale: 1.01 }}
                        whileFocus={{ scale: 1.01 }}
                    />
                    <Select
                        options={categoryOptions}
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        placeholder="Filter by Category"
                        className="w-full md:w-64"
                        isClearable
                        classNamePrefix="react-select"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                borderColor: '#d1d5db',
                                boxShadow: 'none',
                                '&:hover': {
                                    borderColor: '#a78bfa',
                                },
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isSelected ? '#c4b5fd' : state.isFocused ? '#ede9fe' : null,
                                color: '#1f2937',
                            }),
                        }}
                    />
                    <Select
                        options={companyOptions}
                        value={selectedCompany}
                        onChange={setSelectedCompany}
                        placeholder="Filter by Company"
                        className="w-full md:w-64"
                        isClearable
                        classNamePrefix="react-select"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                borderColor: '#d1d5db',
                                boxShadow: 'none',
                                '&:hover': {
                                    borderColor: '#a78bfa',
                                },
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isSelected ? '#c4b5fd' : state.isFocused ? '#ede9fe' : null,
                                color: '#1f2937',
                            }),
                        }}
                    />
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory(null);
                                setSelectedCompany(null);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors duration-200"
                        >
                            Clear Filters
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Drugs Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-3 px-4 md:px-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    {filteredDrugs.length > 0 ? (
                        filteredDrugs.map((drug, index) => (
                            <motion.div
                                key={drug.id}
                                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -4 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white opacity-50 rounded-xl -z-10"></div>
                                <motion.div
                                    className="h-40 w-full rounded-lg overflow-hidden mb-4 border border-gray-200 flex items-center justify-center bg-gray-50"
                                    initial={{ scale: 1.1, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                                >
                                    {drug.image_link && !drug.image_link.includes("400 Bad Request") ? (
                                        <img
                                            src={drug.image_link}
                                            alt={drug.name}
                                            className="object-contain h-full w-full p-2"
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-center p-4">
                                            <FlaskConical className="w-12 h-12 mx-auto mb-2 opacity-70" />
                                            <span className="text-sm">No Product Image</span>
                                        </div>
                                    )}
                                </motion.div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                                    {drug.name}
                                </h2>
                                <p className="text-gray-700 text-base mb-4 flex-grow line-clamp-3">
                                    {drug.description || "No description available."}
                                </p>
                                <div className="space-y-2 text-sm text-gray-700 mt-auto pt-4 border-t border-gray-100">
                                    {drug.drug_category?.name && (
                                        <p className="flex items-center gap-2 text-purple-700 font-medium">
                                            <FlaskConical className="w-4 h-4 text-purple-500" />
                                            <span>{drug.drug_category.name}</span>
                                        </p>
                                    )}
                                    {drug.company?.name && (
                                        <p className="flex items-center gap-2 text-indigo-700">
                                            <Building2 className="w-4 h-4 text-indigo-500" />
                                            <span>{drug.company.name}</span>
                                        </p>
                                    )}
                                    <p className="flex items-center gap-2 text-gray-500">
                                        <CalendarDays className="w-4 h-4 text-gray-400" />
                                        <span>Added: {new Date(drug.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            className="col-span-full text-center py-10 text-gray-500 text-lg rounded-lg bg-white shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <p>No drugs found matching your criteria.</p>
                            <p className="mt-2">Try adjusting your search or filters.</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Drugs;