"use client";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { format } from "date-fns";

// Import icons from React Icons
import { FaCalendarAlt, FaBriefcase, FaBuilding, FaTag, FaFilter, FaRegSmileBeam } from 'react-icons/fa';

const JobsTracked = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchTrackJob, loading: loadingTrackJob, data: TrackJobData } = useGet({
        url: `${apiUrl}/user/my-applications`,
    });
    const [TrackJobs, setTrackJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [showFilters, setShowFilters] = useState(true); // State for toggling filters

    // Filter states
    const [statusFilter, setStatusFilter] = useState(null);
    const [companyFilter, setCompanyFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [titleFilter, setTitleFilter] = useState(null);
    const [dateFilter, setDateFilter] = useState(null);

    useEffect(() => {
        refetchTrackJob();
    }, [refetchTrackJob]);

    useEffect(() => {
        if (TrackJobData && TrackJobData.applications) {
            setTrackJobs(TrackJobData.applications);
            setFilteredJobs(TrackJobData.applications); // Initialize filtered jobs
        }
    }, [TrackJobData]);

    // Options for Select components (memoized for performance)
    const statusOptions = useMemo(() => {
        const statuses = new Set(TrackJobs.map(job => job.status));
        return [{ value: null, label: "All Statuses" }, ...Array.from(statuses).map(status => ({ value: status, label: status.charAt(0).toUpperCase() + status.slice(1) }))];
    }, [TrackJobs]);

    const companyOptions = useMemo(() => {
        const companies = new Set(TrackJobs.map(job => job.job_offer.company.name));
        return [{ value: null, label: "All Companies" }, ...Array.from(companies).map(company => ({ value: company, label: company }))];
    }, [TrackJobs]);

    const categoryOptions = useMemo(() => {
        const categories = new Set(TrackJobs.map(job => job.job_offer.job_category.name));
        return [{ value: null, label: "All Categories" }, ...Array.from(categories).map(category => ({ value: category, label: category }))];
    }, [TrackJobs]);

    const titleOptions = useMemo(() => {
        const titles = new Set(TrackJobs.map(job => job.job_offer.job_titel.name));
        return [{ value: null, label: "All Titles" }, ...Array.from(titles).map(title => ({ value: title, label: title }))];
    }, [TrackJobs]);

    // Filtering logic
    useEffect(() => {
        let currentFilteredJobs = TrackJobs;

        if (statusFilter) {
            currentFilteredJobs = currentFilteredJobs.filter(job => job.status === statusFilter.value);
        }
        if (companyFilter) {
            currentFilteredJobs = currentFilteredJobs.filter(job => job.job_offer.company.name === companyFilter.value);
        }
        if (categoryFilter) {
            currentFilteredJobs = currentFilteredJobs.filter(job => job.job_offer.job_category.name === categoryFilter.value);
        }
        if (titleFilter) {
            currentFilteredJobs = currentFilteredJobs.filter(job => job.job_offer.job_titel.name === titleFilter.value);
        }
        if (dateFilter) {
            currentFilteredJobs = currentFilteredJobs.filter(job => {
                const jobDate = new Date(job.created_at).toDateString();
                const filterDate = new Date(dateFilter).toDateString();
                return jobDate === filterDate;
            });
        }

        setFilteredJobs(currentFilteredJobs);
    }, [TrackJobs, statusFilter, companyFilter, categoryFilter, titleFilter, dateFilter]);

    const clearFilters = () => {
        setStatusFilter(null);
        setCompanyFilter(null);
        setCategoryFilter(null);
        setTitleFilter(null);
        setDateFilter(null);
    };

    const toggleFilters = () => {
        setShowFilters(prev => !prev);
    };

    if (loadingTrackJob) {
        return <FullPageLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-extrabold text-gray-900 text-center drop-shadow-sm">
                        Your Job Applications
                    </h1>
                    <Button
                        onClick={toggleFilters}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center"
                    >
                        <FaFilter className="h-5 w-5 mr-2" />
                        {showFilters ? "Hide Filters" : "Show Filters"}
                    </Button>
                </div>

                {/* Filter Section */}
                {showFilters && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
                            <FaFilter className="h-7 w-7 text-indigo-500 mr-3" />
                            Filter Applications
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                            <div>
                                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <Select
                                    id="status-filter"
                                    options={statusOptions}
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    isClearable={true}
                                    placeholder="Select Status"
                                    classNamePrefix="react-select"
                                />
                            </div>
                            <div>
                                <label htmlFor="company-filter" className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                <Select
                                    id="company-filter"
                                    options={companyOptions}
                                    value={companyFilter}
                                    onChange={setCompanyFilter}
                                    isClearable={true}
                                    placeholder="Select Company"
                                    classNamePrefix="react-select"
                                />
                            </div>
                            <div>
                                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <Select
                                    id="category-filter"
                                    options={categoryOptions}
                                    value={categoryFilter}
                                    onChange={setCategoryFilter}
                                    isClearable={true}
                                    placeholder="Select Category"
                                    classNamePrefix="react-select"
                                />
                            </div>
                            <div>
                                <label htmlFor="title-filter" className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                                <Select
                                    id="title-filter"
                                    options={titleOptions}
                                    value={titleFilter}
                                    onChange={setTitleFilter}
                                    isClearable={true}
                                    placeholder="Select Title"
                                    classNamePrefix="react-select"
                                />
                            </div>
                            <div>
                                <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-2">Applied Date</label>
                                <input
                                    id="date-filter"
                                    type="date"
                                    value={dateFilter ? format(new Date(dateFilter), 'yyyy-MM-dd') : ''}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                onClick={clearFilters}
                                className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 shadow-sm"
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    </div>
                )}

                {/* Application List */}
                {filteredJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map((application) => (
                            <div
                                key={application.id}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden border border-gray-200"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 leading-snug">
                                            {application.job_offer.job_titel.name}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-2 flex items-center">
                                        <FaBuilding className="h-5 w-5 text-indigo-400 mr-2" />
                                        <span className="font-medium text-gray-800">{application.job_offer.company.name}</span>
                                    </p>
                                    <p className="text-gray-600 mb-2 flex items-center">
                                        <FaTag className="h-5 w-5 text-purple-400 mr-2" />
                                        {application.job_offer.job_category.name}
                                    </p>
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <FaCalendarAlt className="h-5 w-5 text-gray-400 mr-2" />
                                        Applied on: {format(new Date(application.created_at), 'MMM dd, yyyy')}
                                    </p>

                                    {application.message && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="text-sm font-medium text-gray-700"> Your Message:</p>
                                            <p className="text-sm text-gray-600 italic mt-1 break-words">{application.message}</p>
                                        </div>
                                    )}

                                    {application.cv_file && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <a
                                                href={application.cv_file}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                                            >
                                                View Submitted CV
                                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-10 text-center border border-gray-200">
                        <FaRegSmileBeam
                            className="mx-auto h-24 w-24 text-gray-400"
                        />
                        <h3 className="mt-4 text-2xl font-semibold text-gray-900">No Applications Found</h3>
                        <p className="mt-2 text-gray-600">
                            It looks like you haven't applied for any jobs yet, or your current filters are too restrictive.
                        </p>
                        <div className="mt-6">
                            <Button onClick={clearFilters} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobsTracked;