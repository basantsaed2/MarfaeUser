// "use client";
// import FullPageLoader from "@/components/Loading";
// import { useGet } from "@/Hooks/UseGet";
// import { usePost } from "@/Hooks/UsePost";
// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import Select from "react-select";
// import companyImage from '@/assets/company.png';
// import { FiFilter, FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiSearch, FiCalendar, FiFileText, FiAward } from "react-icons/fi";
// import { FaRegBookmark, FaBookmark } from "react-icons/fa";
// import * as Dialog from '@radix-ui/react-dialog';
// import { useDelete } from "@/Hooks/useDelete";

// const Jobs = () => {
//   const apiUrl = import.meta.env.VITE_API_BASE_URL;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [allJobs, setAllJobs] = useState([]);
//   const [displayedJobs, setDisplayedJobs] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [nextPageUrl, setNextPageUrl] = useState(null);
//   const [prevPageUrl, setPrevPageUrl] = useState(null);
//   const [firstPageUrl, setFirstPageUrl] = useState(null);
//   const [lastPageUrl, setLastPageUrl] = useState(null);
//   const [filters, setFilters] = useState({
//     city_id: null,
//     company_id: null,
//     job_category_id: null,
//     job_titel_id: null,
//     type: null,
//     experience: null,
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [savedJobs, setSavedJobs] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [titels, setTitels] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [experiences, setExperiences] = useState([]);
//   const [isFiltered, setIsFiltered] = useState(false);
//   const [selectedJobId, setSelectedJobId] = useState(null);
//   const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
//   const [selectedCv, setSelectedCv] = useState(null);
//   const [hasExperience, setHasExperience] = useState('');
//   const [message, setMessage] = useState('');
//   const [selectedJobDetails, setSelectedJobDetails] = useState(null);
//   const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

//   const { deleteData, loadingDelete } = useDelete();
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);

//   const { refetch: refetchList, loading: loadingList, data: listData } = useGet({
//     url: `${apiUrl}/user/jobfilterids`,
//   });

//   const { refetch: refetchJobs, loading: loadingJobs, data: jobsData } = useGet({
//     url: `${apiUrl}/user/getJobs`,
//   });

//   const { refetch: refetchCVS, loading: loadingCVS, data: cvsData } = useGet({
//     url: `${apiUrl}/user/get-usercv`,
//   });

//    const { refetch: refetchSavedJob, loading: loadingSavedJob, data: savedJobData } = useGet({
//     url: `${apiUrl}/user/get-saved-jobs`,
//   });

//   const { postData, loading: loadingPost, response: searchResponse } = usePost({
//     url: `${apiUrl}/user/job-search`,
//   });

//   const { postData: postCv, loading: loadingPostCv, response: cvResponse } = usePost({
//     url: `${apiUrl}/user/apply-job`,
//   });

//   const { postData: postSavedJob, loading: loadingPostSavedJob, response: savedJobResponse } = usePost({
//     url: `${apiUrl}/user/save-job`,
//   });

//   // Fetch initial data
//   useEffect(() => {
//     refetchList();
//     refetchJobs();
//     refetchCVS();
//   }, [refetchList, refetchJobs, refetchCVS]);

//   // Process filter options
//   useEffect(() => {
//     if (listData) {
//       setCompanies(listData.companies?.map(c => ({ value: c.id, label: c.name })) || []);
//       setCities(listData.cities?.map(c => ({ value: c.id, label: c.name })) || []);
//       setCategories(listData.job_categories?.map(c => ({ value: c.id, label: c.name })) || []);
//       setTitels(listData.job_titels?.map(t => ({ value: t.id, label: t.name })) || []);
//       setTypes(listData.types?.map(t => ({ value: t, label: t.replace('_', ' ').toUpperCase() })) || []);
//       setExperiences(listData.experiences?.map(e => ({ value: e, label: e.toUpperCase() })) || []);
//     }
//   }, [listData]);

//   // Process initial jobs data
//   useEffect(() => {
//     if (jobsData?.jobs && !isFiltered) {
//       const jobsArray = Array.isArray(jobsData.jobs) ? jobsData.jobs : [];
//       setAllJobs(jobsArray);
//       setDisplayedJobs(jobsArray.slice(0, 20));
//       setTotalPages(1);
//       setNextPageUrl(null);
//       setPrevPageUrl(null);
//       setFirstPageUrl(null);
//       setLastPageUrl(null);
//     }
//   }, [jobsData, isFiltered]);

//   // Process search response
//   useEffect(() => {
//     if (searchResponse) {
//       const jobsArray = Array.isArray(searchResponse.data?.data) ? searchResponse.data?.data : [];
//       setAllJobs(jobsArray);
//       setDisplayedJobs(jobsArray);
//       setCurrentPage(searchResponse?.data.current_page || 1);
//       setTotalPages(searchResponse?.data.last_page || 1);
//       setNextPageUrl(searchResponse?.data.next_page_url);
//       setPrevPageUrl(searchResponse?.data.prev_page_url);
//       setFirstPageUrl(searchResponse?.data.first_page_url);
//       setLastPageUrl(searchResponse?.data.last_page_url);
//       setIsFiltered(true);
//     }
//   }, [searchResponse]);

//   // Handle apply job submission
//   const handleApplyJob = async () => {
//     if (!selectedJobId || !selectedCv) {
//       alert('Please select a CV to apply with');
//       return;
//     }

//     if (!hasExperience) {
//       alert('Please specify if you have experience for this job');
//       return;
//     }

//     try {
//       const payload = {
//         job_offer_id: selectedJobId,
//         cv_file: selectedCv.cv_file_url,
//         has_experience: hasExperience,
//         message: message
//       };

//       await postCv(payload);

//       setSelectedCv(null);
//       setHasExperience('');
//       setMessage('');
//       setIsApplyDialogOpen(false);
//       setSelectedJobId(null);

//       alert('Application submitted successfully!');
//     } catch (error) {
//       console.error('Error applying for job:', error);
//       alert('Failed to submit application. Please try again.');
//     }
//   };

//   // Handle filter changes
//   const handleFilterChange = (name, value) => {
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   // Apply filters
//   const applyFilters = async () => {
//     const payload = {
//       city_id: filters.city_id?.value || null,
//       company_id: filters.company_id?.value || null,
//       job_category_id: filters.job_category_id?.value || null,
//       job_titel_id: filters.job_titel_id?.value || null,
//       type: filters.type?.value || null,
//       experience: filters.experience?.value || null,
//     };
//     try {
//       await postData(payload);
//       setShowFilters(false);
//     } catch (error) {
//       console.error("Error applying filters:", error);
//     }
//   };

//   // Fetch jobs for a specific page
//   const fetchPage = async (url) => {
//     if (!url) return;
//     const token = localStorage.getItem("token");
//     try {
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           city_id: filters.city_id?.value || null,
//           company_id: filters.company_id?.value || null,
//           job_category_id: filters.job_category_id?.value || null,
//           job_titel_id: filters.job_titel_id?.value || null,
//           type: filters.type?.value || null,
//           experience: filters.experience?.value || null,
//         }),
//       });
//       const data = await response.json();

//       setAllJobs(data.data || []);
//       setDisplayedJobs(data.data || []);
//       setCurrentPage(data.current_page || 1);
//       setTotalPages(data.last_page || 1);
//       setNextPageUrl(data.next_page_url);
//       setPrevPageUrl(data.prev_page_url);
//       setFirstPageUrl(data.first_page_url);
//       setLastPageUrl(data.last_page_url);
//     } catch (error) {
//       console.error("Error fetching page:", error);
//     }
//   };

//   // Handle pagination
//   const goToNextPage = () => {
//     if (nextPageUrl) {
//       fetchPage(nextPageUrl);
//     }
//   };

//   const goToPreviousPage = () => {
//     if (prevPageUrl) {
//       fetchPage(prevPageUrl);
//     } else if (firstPageUrl) {
//       fetchPage(firstPageUrl);
//     }
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setFilters({
//       city_id: null,
//       company_id: null,
//       job_category_id: null,
//       job_titel_id: null,
//       type: null,
//       experience: null,
//     });
//     setCurrentPage(1);
//     setIsFiltered(false);
//     refetchJobs();
//   };

//   // Toggle saved job
//   const toggleSavedJob = (jobId) => {
//     setSavedJobs(prev =>
//       prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
//     );
//   };

//   // Format experience and type labels
//   const getExperienceLabel = (exp) => {
//     switch (exp) {
//       case 'fresh': return 'Fresh Graduate';
//       case 'junior': return 'Junior';
//       case 'mid': return 'Mid-Level';
//       case 'senior': return 'Senior';
//       case '+1 year': return '1+ Years';
//       case '+2 years': return '2+ Years';
//       case '+3 years': return '3+ Years';
//       default: return exp?.toUpperCase() || 'N/A';
//     }
//   };

//   const getTypeLabel = (type) => {
//     switch (type) {
//       case 'full_time': return 'Full Time';
//       case 'part_time': return 'Part Time';
//       case 'freelance': return 'Freelance';
//       case 'internship': return 'Internship';
//       case 'hybrid': return 'Hybrid';
//       default: return type?.toUpperCase() || 'N/A';
//     }
//   };

//   // Function to open job details dialog
//   const openJobDetails = (job) => {
//     setSelectedJobDetails(job);
//     setIsDetailsDialogOpen(true);
//   };

//   const handleDelete = (item) => {
//     setSelectedRow(item);
//     setIsDeleteOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!selectedRow) return;

//     const success = await deleteData(
//       `${apiUrl}/user/delete-saved-job/${selectedRow.id}`,
//       `${selectedRow.title} Deleted Successfully.`
//     );

//     if (success) {
//       setIsDeleteOpen(false);
//       setJobs((prev) => prev.filter((item) => item.id !== selectedRow.id));
//       setSelectedRow(null);
//     }
//   };

//   if (loadingList || loadingJobs) {
//     return <FullPageLoader />;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Header Section */}
//       <div className="w-full h-64 relative">
//         <img
//           src={companyImage} // Using the renamed placeholder
//           alt="Drugs List Banner"
//           className="object-cover md:object-fill h-full w-full"
//         />
//         <div className="absolute inset-0 flex flex-col items-center justify-center">
//           <h1 className="text-4xl font-bold text-white drop-shadow-lg">Find Your Dream Job</h1>
//           <p className="text-xl text-white/90 max-w-2xl mx-auto">
//             Browse through thousands of full-time and part-time jobs near you
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         {/* Filter Bar */}
//         <div className="mb-8 bg-white rounded-lg shadow-md p-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search by job title, company, or keywords"
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <FiSearch className="absolute left-3 top-3 text-gray-400" />
//               </div>
//             </div>
//             <Button
//               onClick={() => setShowFilters(!showFilters)}
//               variant="outline"
//               className="flex items-center gap-2"
//             >
//               <FiFilter />
//               {showFilters ? 'Hide Filters' : 'Show Filters'}
//             </Button>
//           </div>

//           {/* Filter Section */}
//           {showFilters && (
//             <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               <Select
//                 options={[{ value: null, label: 'All Cities' }, ...cities]}
//                 value={filters.city_id}
//                 onChange={(selected) => handleFilterChange('city_id', selected)}
//                 placeholder="Select City"
//                 isClearable
//               />
//               <Select
//                 options={[{ value: null, label: 'All Companies' }, ...companies]}
//                 value={filters.company_id}
//                 onChange={(selected) => handleFilterChange('company_id', selected)}
//                 placeholder="Select Company"
//                 isClearable
//               />
//               <Select
//                 options={[{ value: null, label: 'All Categories' }, ...categories]}
//                 value={filters.job_category_id}
//                 onChange={(selected) => handleFilterChange('job_category_id', selected)}
//                 placeholder="Select Category"
//                 isClearable
//               />
//               <Select
//                 options={[{ value: null, label: 'All Titles' }, ...titels]}
//                 value={filters.job_titel_id}
//                 onChange={(selected) => handleFilterChange('job_titel_id', selected)}
//                 placeholder="Select Title"
//                 isClearable
//               />
//               <Select
//                 options={[{ value: null, label: 'All Types' }, ...types]}
//                 value={filters.type}
//                 onChange={(selected) => handleFilterChange('type', selected)}
//                 placeholder="Select Type"
//                 isClearable
//               />
//               <Select
//                 options={[{ value: null, label: 'All Experiences' }, ...experiences]}
//                 value={filters.experience}
//                 onChange={(selected) => handleFilterChange('experience', selected)}
//                 placeholder="Select Experience"
//                 isClearable
//               />
//               <div className="flex gap-2">
//                 <Button onClick={applyFilters} disabled={loadingPost}>
//                   {loadingPost ? 'Applying...' : 'Apply Filters'}
//                 </Button>
//                 <Button onClick={resetFilters} variant="outline">
//                   Reset Filters
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Results Count */}
//         <div className="mb-6 flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-gray-800">
//             {allJobs.length} {allJobs.length === 1 ? 'Job' : 'Jobs'} Found
//           </h2>
//           {allJobs.length > 0 && (
//             <div className="text-sm text-gray-500">
//               Page {currentPage} of {totalPages}
//             </div>
//           )}
//         </div>

//         {/* Jobs List */}
//         {displayedJobs.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {displayedJobs.map((job) => (
//               <div
//                 key={job.id}
//                 className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-800">{job.job_titel?.name || 'Unknown Position'}</h3>
//                     <p className="text-gray-600">{job.company?.name || 'Unknown Company'}</p>
//                   </div>
//                   <button
//                     onClick={() => toggleSavedJob(job.id)}
//                     className="text-gray-400 hover:text-yellow-500 transition-colors"
//                   >
//                     {savedJobs.includes(job.id) ? (
//                       <FaBookmark className="text-yellow-500 text-xl" />
//                     ) : (
//                       <FaRegBookmark className="text-xl" />
//                     )}
//                   </button>
//                 </div>
//                 <div className="mt-3 flex flex-wrap gap-2">
//                   <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                     <FiBriefcase className="mr-1" />
//                     {getTypeLabel(job.type)}
//                   </span>
//                   <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                     <FiClock className="mr-1" />
//                     {getExperienceLabel(job.experience)}
//                   </span>
//                   <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//                     <FiMapPin className="mr-1" />
//                     {job.city?.name || 'Unknown'}, {job.city?.country?.name || 'N/A'}
//                   </span>
//                   {job.expected_salary && (
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
//                       <FiDollarSign className="mr-1" />
//                       {job.expected_salary} {job.city?.country?.name === 'Egyptt' ? 'EGP' : ''}
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-gray-600 mt-4 line-clamp-3">{job.description || 'No description available.'}</p>
//                 <div className="mt-4 flex gap-2">
//                   <Button
//                     onClick={() => {
//                       setSelectedJobId(job.id);
//                       setIsApplyDialogOpen(true);
//                     }}
//                     className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
//                   >
//                     Apply Now
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => openJobDetails(job)}
//                     className="border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
//                   >
//                     View Details
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <h3 className="text-xl font-medium text-gray-700 mb-2">No jobs found</h3>
//             <p className="text-gray-500">
//               {Object.values(filters).some(f => f !== null)
//                 ? "Try adjusting your filters to see more results."
//                 : "There are currently no jobs available. Please check back later."}
//             </p>
//             {Object.values(filters).some(f => f !== null) && (
//               <Button onClick={resetFilters} variant="link" className="mt-4">
//                 Reset all filters
//               </Button>
//             )}
//           </div>
//         )}

//         {/* Pagination Controls */}
//         {totalPages > 1 && (
//           <div className="mt-8 flex justify-center gap-4">
//             <Button
//               onClick={goToPreviousPage}
//               disabled={!prevPageUrl && currentPage === 1}
//               variant="outline"
//               className="flex items-center gap-2"
//             >
//               Previous
//             </Button>
//             <Button
//               onClick={goToNextPage}
//               disabled={!nextPageUrl}
//               variant="outline"
//               className="flex items-center gap-2"
//             >
//               Next
//             </Button>
//           </div>
//         )}

//         {/* Job Details Dialog */}
//         <Dialog.Root open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
//           <Dialog.Portal>
//             <Dialog.Overlay className="fixed inset-0 bg-black/50" />
//             <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
//               {selectedJobDetails && (
//                 <>
//                   <Dialog.Title className="text-2xl font-bold text-gray-800 mb-2">
//                     {selectedJobDetails.job_titel?.name || 'Job Details'}
//                   </Dialog.Title>
//                   <div className="flex items-center text-gray-600 mb-4">
//                     <span className="font-medium">{selectedJobDetails.company?.name}</span>
//                     <span className="mx-2">•</span>
//                     <span>{selectedJobDetails.city?.name}, {selectedJobDetails.city?.country?.name}</span>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Left Column */}
//                     <div>
//                       <div className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                           <FiFileText className="mr-2" />
//                           Job Description
//                         </h3>
//                         <p className="text-gray-700">
//                           {selectedJobDetails.description || 'No description available.'}
//                         </p>
//                       </div>

//                       <div className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                           <FiAward className="mr-2" />
//                           Qualifications
//                         </h3>
//                         <p className="text-gray-700">
//                           {selectedJobDetails.qualifications || 'No specific qualifications listed.'}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Right Column */}
//                     <div>
//                       <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Overview</h3>
//                         <div className="space-y-3">
//                           <div className="flex items-center">
//                             <FiBriefcase className="text-gray-500 mr-2" />
//                             <span className="text-gray-700">
//                               <span className="font-medium">Job Type:</span> {getTypeLabel(selectedJobDetails.type)}
//                             </span>
//                           </div>
//                           <div className="flex items-center">
//                             <FiClock className="text-gray-500 mr-2" />
//                             <span className="text-gray-700">
//                               <span className="font-medium">Experience:</span> {getExperienceLabel(selectedJobDetails.experience)}
//                             </span>
//                           </div>
//                           <div className="flex items-center">
//                             <FiDollarSign className="text-gray-500 mr-2" />
//                             <span className="text-gray-700">
//                               <span className="font-medium">Salary:</span> {selectedJobDetails.expected_salary || 'Not specified'} {selectedJobDetails.city?.country?.name === 'Egyptt' ? 'EGP' : ''}
//                             </span>
//                           </div>
//                           <div className="flex items-center">
//                             <FiCalendar className="text-gray-500 mr-2" />
//                             <span className="text-gray-700">
//                               <span className="font-medium">Expires:</span> {selectedJobDetails.expire_date || 'Not specified'}
//                             </span>
//                           </div>
//                           <div className="flex items-center">
//                             <FiMapPin className="text-gray-500 mr-2" />
//                             <span className="text-gray-700">
//                               <span className="font-medium">Location:</span> {selectedJobDetails.zone?.name}, {selectedJobDetails.city?.name}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3">Company Information</h3>
//                         <div className="flex items-center">
//                           <div className="mr-4">
//                             <img
//                               src={selectedJobDetails.company?.image_link || companyImage}
//                               alt={selectedJobDetails.company?.name}
//                               className="w-16 h-16 rounded-full object-cover"
//                             />
//                           </div>
//                           <div>
//                             <h4 className="font-medium text-gray-800">{selectedJobDetails.company?.name}</h4>
//                             <p className="text-gray-600">{selectedJobDetails.company?.email}</p>
//                             <p className="text-gray-600">{selectedJobDetails.company?.phone}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-6 flex justify-end gap-3">
//                     <Button
//                       onClick={() => {
//                         setIsDetailsDialogOpen(false);
//                         setSelectedJobId(selectedJobDetails.id);
//                         setIsApplyDialogOpen(true);
//                       }}
//                       className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
//                     >
//                       Apply Now
//                     </Button>
//                     <Dialog.Close asChild>
//                       <Button variant="outline">Close</Button>
//                     </Dialog.Close>
//                   </div>
//                 </>
//               )}
//             </Dialog.Content>
//           </Dialog.Portal>
//         </Dialog.Root>

//         {/* Apply Job Dialog */}
//         <Dialog.Root open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
//           <Dialog.Portal>
//             <Dialog.Overlay className="fixed inset-0 bg-black/50" />
//             <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
//               <Dialog.Title className="text-xl font-bold text-gray-800 mb-4">
//                 Apply for Job
//               </Dialog.Title>
//               <Dialog.Description className="text-gray-600 mb-4">
//                 Select a CV, indicate your experience, and add a message.
//               </Dialog.Description>

//               {/* CV Selection */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Select CV</label>
//                 <Select
//                   options={cvsData?.userCv?.map(cv => ({
//                     value: cv,
//                     label: `CV - ${cv.cv_file_url} (Uploaded: ${new Date(cv.created_at).toLocaleDateString()})`,
//                     cv_file_url: cv.cv_file_url,
//                   }))}
//                   value={selectedCv ? {
//                     value: selectedCv,
//                     label: `CV - ${selectedCv.user_address} (Uploaded: ${new Date(selectedCv.created_at).toLocaleDateString()})`
//                   } : null}
//                   onChange={(selected) => setSelectedCv(selected?.value)}
//                   placeholder="Select a CV"
//                   isClearable
//                 />
//               </div>

//               {/* Experience Question */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Have you experience in this job?
//                 </label>
//                 <div className="flex gap-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="experience"
//                       value="yes"
//                       checked={hasExperience === 'yes'}
//                       onChange={() => setHasExperience('yes')}
//                       className="mr-2"
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="experience"
//                       value="no"
//                       checked={hasExperience === 'no'}
//                       onChange={() => setHasExperience('no')}
//                       className="mr-2"
//                     />
//                     No
//                   </label>
//                 </div>
//               </div>

//               {/* Message Textarea */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
//                 <textarea
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder="Write a message to the employer..."
//                   className="w-full h-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               {/* Dialog Actions */}
//               <div className="flex justify-end gap-2">
//                 <Dialog.Close asChild>
//                   <Button variant="outline">Cancel</Button>
//                 </Dialog.Close>
//                 <Button
//                   onClick={handleApplyJob}
//                   disabled={loadingPostCv || !selectedCv || !hasExperience}
//                 >
//                   {loadingPostCv ? 'Submitting...' : 'Submit Application'}
//                 </Button>
//               </div>
//             </Dialog.Content>
//           </Dialog.Portal>
//         </Dialog.Root>
//       </div>
//     </div>
//   );
// };

// export default Jobs;


"use client";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { usePost } from "@/Hooks/UsePost";
import { useDelete } from "@/Hooks/useDelete";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import companyImage from '@/assets/company.png';
import { FiFilter, FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiSearch, FiCalendar, FiFileText, FiAward } from "react-icons/fi";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import * as Dialog from '@radix-ui/react-dialog';

const Jobs = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const [allJobs, setAllJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [firstPageUrl, setFirstPageUrl] = useState(null);
  const [lastPageUrl, setLastPageUrl] = useState(null);
  const [filters, setFilters] = useState({
    city_id: null,
    company_id: null,
    job_category_id: null,
    job_titel_id: null,
    type: null,
    experience: null,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [titels, setTitels] = useState([]);
  const [types, setTypes] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [selectedCv, setSelectedCv] = useState(null);
  const [hasExperience, setHasExperience] = useState('');
  const [message, setMessage] = useState('');
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const { deleteData, loading: loadingDelete } = useDelete();

  const { refetch: refetchList, loading: loadingList, data: listData } = useGet({
    url: `${apiUrl}/user/jobfilterids`,
  });

  const { refetch: refetchJobs, loading: loadingJobs, data: jobsData } = useGet({
    url: `${apiUrl}/user/getJobs`,
  });

  const { refetch: refetchCVS, loading: loadingCVS, data: cvsData } = useGet({
    url: `${apiUrl}/user/get-usercv`,
  });

  const { refetch: refetchSavedJobs, loading: loadingSavedJobs, data: savedJobsData } = useGet({
    url: `${apiUrl}/user/get-saved-jobs`,
  });

  const { postData, loading: loadingPost, response: searchResponse } = usePost({
    url: `${apiUrl}/user/job-search`,
  });

  const { postData: postCv, loading: loadingPostCv, response: cvResponse } = usePost({
    url: `${apiUrl}/user/apply-job`,
  });

  const { postData: postSavedJob, loading: loadingPostSavedJob, response: savedJobResponse } = usePost({
    url: `${apiUrl}/user/save-job`,
  });

  // Fetch initial data
  useEffect(() => {
    refetchList();
    refetchJobs();
    refetchCVS();
    refetchSavedJobs();
  }, [refetchList, refetchJobs, refetchCVS, refetchSavedJobs]);

  // Process saved jobs personnels filter options
  useEffect(() => {
    if (listData) {
      setCompanies(listData.companies?.map(c => ({ value: c.id, label: c.name })) || []);
      setCities(listData.cities?.map(c => ({ value: c.id, label: c.name })) || []);
      setCategories(listData.job_categories?.map(c => ({ value: c.id, label: c.name })) || []);
      setTitels(listData.job_titels?.map(t => ({ value: t.id, label: t.name })) || []);
      setTypes(listData.types?.map(t => ({ value: t, label: t.replace('_', ' ').toUpperCase() })) || []);
      setExperiences(listData.experiences?.map(e => ({ value: e, label: e.toUpperCase() })) || []);
    }
  }, [listData]);

  // Process saved jobs data
  useEffect(() => {
    if (savedJobsData?.saved_jobs) {
      const savedJobIds = savedJobsData.saved_jobs.map(job => job.job_offer_id);
      setSavedJobs(savedJobIds);
    }
  }, [savedJobsData]);

  // Process initial jobs data
  useEffect(() => {
    if (jobsData?.jobs && !isFiltered) {
      const jobsArray = Array.isArray(jobsData.jobs) ? jobsData.jobs : [];
      setAllJobs(jobsArray);
      setDisplayedJobs(jobsArray.slice(0, 20));
      setTotalPages(1);
      setNextPageUrl(null);
      setPrevPageUrl(null);
      setFirstPageUrl(null);
      setLastPageUrl(null);
    }
  }, [jobsData, isFiltered]);

  // Process search response
  useEffect(() => {
    if (searchResponse) {
      const jobsArray = Array.isArray(searchResponse.data?.data) ? searchResponse.data?.data : [];
      setAllJobs(jobsArray);
      setDisplayedJobs(jobsArray);
      setCurrentPage(searchResponse?.data.current_page || 1);
      setTotalPages(searchResponse?.data.last_page || 1);
      setNextPageUrl(searchResponse?.data.next_page_url);
      setPrevPageUrl(searchResponse?.data.prev_page_url);
      setFirstPageUrl(searchResponse?.data.first_page_url);
      setLastPageUrl(searchResponse?.data.last_page_url);
      setIsFiltered(true);
    }
  }, [searchResponse]);

  // Handle apply job submission
  const handleApplyJob = async () => {
    if (!selectedJobId || !selectedCv) {
      alert('Please select a CV to apply with');
      return;
    }

    if (!hasExperience) {
      alert('Please specify if you have experience for this job');
      return;
    }

    try {
      const payload = {
        job_offer_id: selectedJobId,
        cv_file: selectedCv.cv_file_url,
        has_experience: hasExperience,
        message: message
      };

      await postCv(payload);

      setSelectedCv(null);
      setHasExperience('');
      setMessage('');
      setIsApplyDialogOpen(false);
      setSelectedJobId(null);

      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = async () => {
    const payload = {
      city_id: filters.city_id?.value || null,
      company_id: filters.company_id?.value || null,
      job_category_id: filters.job_category_id?.value || null,
      job_titel_id: filters.job_titel_id?.value || null,
      type: filters.type?.value || null,
      experience: filters.experience?.value || null,
    };
    try {
      await postData(payload);
      setShowFilters(false);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  // Fetch jobs for a specific page
  const fetchPage = async (url) => {
    if (!url) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          city_id: filters.city_id?.value || null,
          company_id: filters.company_id?.value || null,
          job_category_id: filters.job_category_id?.value || null,
          job_titel_id: filters.job_titel_id?.value || null,
          type: filters.type?.value || null,
          experience: filters.experience?.value || null,
        }),
      });
      const data = await response.json();

      setAllJobs(data.data || []);
      setDisplayedJobs(data.data || []);
      setCurrentPage(data.current_page || 1);
      setTotalPages(data.last_page || 1);
      setNextPageUrl(data.next_page_url);
      setPrevPageUrl(data.prev_page_url);
      setFirstPageUrl(data.first_page_url);
      setLastPageUrl(data.last_page_url);
    } catch (error) {
      console.error("Error fetching page:", error);
    }
  };

  // Handle pagination
  const goToNextPage = () => {
    if (nextPageUrl) {
      fetchPage(nextPageUrl);
    }
  };

  const goToPreviousPage = () => {
    if (prevPageUrl) {
      fetchPage(prevPageUrl);
    } else if (firstPageUrl) {
      fetchPage(firstPageUrl);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      city_id: null,
      company_id: null,
      job_category_id: null,
      job_titel_id: null,
      type: null,
      experience: null,
    });
    setCurrentPage(1);
    setIsFiltered(false);
    refetchJobs();
  };

  // Toggle saved job
  const toggleSavedJob = async (jobId) => {
    try {
      if (savedJobs.includes(jobId)) {
        // Unsave job
        const savedJob = savedJobsData?.saved_jobs.find(job => job.job_offer_id === jobId);
        if (savedJob) {
         await deleteData(
          `${apiUrl}/user/delete-saved-job`,
          { job_offer_id: jobId },
          'Job unsaved successfully.'
        );
        setSavedJobs(prev => prev.filter(id => id !== jobId));
        }
      } else {
        // Save job
        await postSavedJob({ job_offer_id: jobId });
        setSavedJobs(prev => [...prev, jobId]);
      }
      refetchSavedJobs(); // Refresh saved jobs list
    } catch (error) {
      console.error("Error toggling saved job:", error);
      alert('Failed to save/unsave job. Please try again.');
    }
  };

  // Format experience and type labels
  const getExperienceLabel = (exp) => {
    switch (exp) {
      case 'fresh': return 'Fresh Graduate';
      case 'junior': return 'Junior';
      case 'mid': return 'Mid-Level';
      case 'senior': return 'Senior';
      case '+1 year': return '1+ Years';
      case '+2 years': return '2+ Years';
      case '+3 years': return '3+ Years';
      default: return exp?.toUpperCase() || 'N/A';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'full_time': return 'Full Time';
      case 'part_time': return 'Part Time';
      case 'freelance': return 'Freelance';
      case 'internship': return 'Internship';
      case 'hybrid': return 'Hybrid';
      default: return type?.toUpperCase() || 'N/A';
    }
  };

  // Function to open job details dialog
  const openJobDetails = (job) => {
    setSelectedJobDetails(job);
    setIsDetailsDialogOpen(true);
  };

  if (loadingList || loadingJobs || loadingSavedJobs) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="w-full h-64 relative">
        <img
          src={companyImage}
          alt="Jobs Banner"
          className="object-cover md:object-fill h-full w-full"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Find Your Dream Job</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Browse through thousands of full-time and part-time jobs near you
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by job title, company, or keywords"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FiFilter />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Filter Section */}
          {showFilters && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select
                options={[{ value: null, label: 'All Cities' }, ...cities]}
                value={filters.city_id}
                onChange={(selected) => handleFilterChange('city_id', selected)}
                placeholder="Select City"
                isClearable
              />
              <Select
                options={[{ value: null, label: 'All Companies' }, ...companies]}
                value={filters.company_id}
                onChange={(selected) => handleFilterChange('company_id', selected)}
                placeholder="Select Company"
                isClearable
              />
              <Select
                options={[{ value: null, label: 'All Categories' }, ...categories]}
                value={filters.job_category_id}
                onChange={(selected) => handleFilterChange('job_category_id', selected)}
                placeholder="Select Category"
                isClearable
              />
              <Select
                options={[{ value: null, label: 'All Titles' }, ...titels]}
                value={filters.job_titel_id}
                onChange={(selected) => handleFilterChange('job_titel_id', selected)}
                placeholder="Select Title"
                isClearable
              />
              <Select
                options={[{ value: null, label: 'All Types' }, ...types]}
                value={filters.type}
                onChange={(selected) => handleFilterChange('type', selected)}
                placeholder="Select Type"
                isClearable
              />
              <Select
                options={[{ value: null, label: 'All Experiences' }, ...experiences]}
                value={filters.experience}
                onChange={(selected) => handleFilterChange('experience', selected)}
                placeholder="Select Experience"
                isClearable
              />
              <div className="flex gap-2">
                <Button onClick={applyFilters} disabled={loadingPost}>
                  {loadingPost ? 'Applying...' : 'Apply Filters'}
                </Button>
                <Button onClick={resetFilters} variant="outline">
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {allJobs.length} {allJobs.length === 1 ? 'Job' : 'Jobs'} Found
          </h2>
          {allJobs.length > 0 && (
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>

        {/* Jobs List */}
        {displayedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{job.job_titel?.name || 'Unknown Position'}</h3>
                    <p className="text-gray-600">{job.company?.name || 'Unknown Company'}</p>
                  </div>
                  <button
                    onClick={() => toggleSavedJob(job.id)}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                    disabled={loadingPostSavedJob || loadingDelete}
                  >
                    {savedJobs.includes(job.id) ? (
                      <FaBookmark className="text-yellow-500 text-xl" />
                    ) : (
                      <FaRegBookmark className="text-xl" />
                    )}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <FiBriefcase className="mr-1" />
                    {getTypeLabel(job.type)}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <FiClock className="mr-1" />
                    {getExperienceLabel(job.experience)}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <FiMapPin className="mr-1" />
                    {job.city?.name || 'Unknown'}, {job.city?.country?.name || 'N/A'}
                  </span>
                  {job.expected_salary && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <FiDollarSign className="mr-1" />
                      {job.expected_salary} {job.city?.country?.name === 'Egyptt' ? 'EGP' : ''}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-4 line-clamp-3">{job.description || 'No description available.'}</p>
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setIsApplyDialogOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Apply Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => openJobDetails(job)}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No jobs found</h3>
            <p className="text-gray-500">
              {Object.values(filters).some(f => f !== null)
                ? "Try adjusting your filters to see more results."
                : "There are currently no jobs available. Please check back later."}
            </p>
            {Object.values(filters).some(f => f !== null) && (
              <Button onClick={resetFilters} variant="link" className="mt-4">
                Reset all filters
              </Button>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-4">
            <Button
              onClick={goToPreviousPage}
              disabled={!prevPageUrl && currentPage === 1}
              variant="outline"
              className="flex items-center gap-2"
            >
              Previous
            </Button>
            <Button
              onClick={goToNextPage}
              disabled={!nextPageUrl}
              variant="outline"
              className="flex items-center gap-2"
            >
              Next
            </Button>
          </div>
        )}

        {/* Job Details Dialog */}
        <Dialog.Root open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
              {selectedJobDetails && (
                <>
                  <Dialog.Title className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedJobDetails.job_titel?.name || 'Job Details'}
                  </Dialog.Title>
                  <div className="flex items-center text-gray-600 mb-4">
                    <span className="font-medium">{selectedJobDetails.company?.name}</span>
                    <span className="mx-2">•</span>
                    <span>{selectedJobDetails.city?.name}, {selectedJobDetails.city?.country?.name}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <FiFileText className="mr-2" />
                          Job Description
                        </h3>
                        <p className="text-gray-700">
                          {selectedJobDetails.description || 'No description available.'}
                        </p>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <FiAward className="mr-2" />
                          Qualifications
                        </h3>
                        <p className="text-gray-700">
                          {selectedJobDetails.qualifications || 'No specific qualifications listed.'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Overview</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <FiBriefcase className="text-gray-500 mr-2" />
                            <span className="text-gray-700">
                              <span className="font-medium">Job Type:</span> {getTypeLabel(selectedJobDetails.type)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FiClock className="text-gray-500 mr-2" />
                            <span className="text-gray-700">
                              <span className="font-medium">Experience:</span> {getExperienceLabel(selectedJobDetails.experience)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FiDollarSign className="text-gray-500 mr-2" />
                            <span className="text-gray-700">
                              <span className="font-medium">Salary:</span> {selectedJobDetails.expected_salary || 'Not specified'} {selectedJobDetails.city?.country?.name === 'Egyptt' ? 'EGP' : ''}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FiCalendar className="text-gray-500 mr-2" />
                            <span className="text-gray-700">
                              <span className="font-medium">Expires:</span> {selectedJobDetails.expire_date || 'Not specified'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FiMapPin className="text-gray-500 mr-2" />
                            <span className="text-gray-700">
                              <span className="font-medium">Location:</span> {selectedJobDetails.zone?.name}, {selectedJobDetails.city?.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Company Information</h3>
                        <div className="flex items-center">
                          <div className="mr-4">
                            <img
                              src={selectedJobDetails.company?.image_link || companyImage}
                              alt={selectedJobDetails.company?.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{selectedJobDetails.company?.name}</h4>
                            <p className="text-gray-600">{selectedJobDetails.company?.email}</p>
                            <p className="text-gray-600">{selectedJobDetails.company?.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <Button
                      onClick={() => {
                        setIsDetailsDialogOpen(false);
                        setSelectedJobId(selectedJobDetails.id);
                        setIsApplyDialogOpen(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                      Apply Now
                    </Button>
                    <Dialog.Close asChild>
                      <Button variant="outline">Close</Button>
                    </Dialog.Close>
                  </div>
                </>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Apply Job Dialog */}
        <Dialog.Root open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <Dialog.Title className="text-xl font-bold text-gray-800 mb-4">
                Apply for Job
              </Dialog.Title>
              <Dialog.Description className="text-gray-600 mb-4">
                Select a CV, indicate your experience, and add a message.
              </Dialog.Description>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select CV</label>
                <Select
                  options={cvsData?.userCv?.map(cv => ({
                    value: cv,
                    label: `CV - ${cv.cv_file_url} (Uploaded: ${new Date(cv.created_at).toLocaleDateString()})`,
                    cv_file_url: cv.cv_file_url,
                  }))}
                  value={selectedCv ? {
                    value: selectedCv,
                    label: `CV - ${selectedCv.user_address} (Uploaded: ${new Date(selectedCv.created_at).toLocaleDateString()})`
                  } : null}
                  onChange={(selected) => setSelectedCv(selected?.value)}
                  placeholder="Select a CV"
                  isClearable
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Have you experience in this job?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="experience"
                      value="yes"
                      checked={hasExperience === 'yes'}
                      onChange={() => setHasExperience('yes')}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="experience"
                      value="no"
                      checked={hasExperience === 'no'}
                      onChange={() => setHasExperience('no')}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message to the employer..."
                  className="w-full h-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Dialog.Close asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.Close>
                <Button
                  onClick={handleApplyJob}
                  disabled={loadingPostCv || !selectedCv || !hasExperience}
                >
                  {loadingPostCv ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

export default Jobs;