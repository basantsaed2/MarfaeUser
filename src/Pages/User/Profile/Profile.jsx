// "use client";

// import FullPageLoader from "@/components/Loading";
// import { useChangeState } from "@/Hooks/useChangeState";
// import { useDelete } from "@/Hooks/useDelete";
// import { useGet } from "@/Hooks/UseGet";
// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import DeleteDialog from "@/components/DeleteDialog";
// import { EditDialog } from "@/components/EditDialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
// import {
//   FiDownload,
//   FiTrash2,
//   FiEdit,
//   FiUser,
//   FiCheckCircle,
//   FiBriefcase,
//   FiMapPin,
//   FiFileText,
//   FiPlus,
// } from "react-icons/fi";
// import { toast, ToastContainer } from "react-toastify";
// import { usePost } from "@/Hooks/UsePost";

// const animatedComponents = makeAnimated();

// const Profile = () => {
//   const apiUrl = import.meta.env.VITE_API_BASE_URL;
//   const {
//     refetch: refetchProfile,
//     loading: loadingProfile,
//     data: profileData,
//   } = useGet({
//     url: `${apiUrl}/user/profile`,
//   });
//   const {
//     refetch: refetchSpecialization,
//     loading: loadingSpecialization,
//     data: specializationData,
//   } = useGet({
//     url: `${apiUrl}/user/specializations/get`,
//   });
//   const {
//     refetch: refetchRegion,
//     loading: loadingRegion,
//     data: regionData,
//   } = useGet({
//     url: `${apiUrl}/city-country`,
//   });
//   const { postData, loadingPost, response } = usePost({
//     url: `${apiUrl}/user/add-cv`,
//   });
//   const { changeState, loading: loadingChange } = useChangeState();
//   const { deleteData, loading: loadingDelete } = useDelete();
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//   const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [profile, setProfile] = useState([]);
//   const [specializations, setSpecializations] = useState([]);
//   const [experiences, setExperiences] = useState([]);
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     phone: "",
//     password: "",
//     password_confirmation: "",
//     user_address: "",
//     age: "",
//     specialization: [],
//     cv_files: [],
//     country_id: "",
//     city_id: "",
//     experience: "",
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [uploadCvError, setUploadCvError] = useState(null);
//   const [uploadCvSuccess, setUploadCvSuccess] = useState(null);
//   const [cities, setCities] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [filteredCities, setFilteredCities] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");
//   const [selectedExperience, setSelectedExperience] = useState("");

//   // Format options for Select
//   const [countryOptions, setCountryOptions] = useState([]);
//   const [cityOptions, setCityOptions] = useState([]);
//   const [specializationOptions, setSpecializationOptions] = useState([]);
//   const [experienceOptions, setExperienceOptions] = useState([]);

//   useEffect(() => {
//     refetchProfile();
//     refetchSpecialization();
//     refetchRegion();
//   }, [refetchProfile, refetchSpecialization, refetchRegion]);

//   useEffect(() => {
//     if (profileData && profileData.user) {
//       setProfile(profileData.user);
//       setFormData({
//         first_name: profileData.user.first_name || "",
//         last_name: profileData.user.last_name || "",
//         email: profileData.user.email || "",
//         phone: profileData.user.phone || "",
//         password: "",
//         password_confirmation: "",
//         user_address: profileData.user.user_address || "",
//         age: profileData.user.age ? String(profileData.user.age) : "",
//         specialization: profileData.user.specializations?.map((spec) => spec.id.toString()) || [],
//         cv_files: [],
//         country_id: profileData.user.country_id || "",
//         city_id: profileData.user.city_id || "",
//         experience: profileData.user.experience || "",
//       });

//       // Set selected country, city, and experience if available
//       if (profileData.user.country_id) {
//         setSelectedCountry(profileData.user.country_id.toString());
//       }
//       if (profileData.user.city_id) {
//         setSelectedCity(profileData.user.city_id.toString());
//       }
//       if (profileData.user.experience) {
//         setSelectedExperience(profileData.user.experience);
//       }
//     }
//   }, [profileData]);

//   useEffect(() => {
//     if (specializationData && specializationData.specializations) {
//       setSpecializations(specializationData.specializations);

//       // Format specialization options for MultiSelect
//       const formattedSpecializations = specializationData.specializations.map(spec => ({
//         value: spec.id.toString(),
//         label: spec.name
//       }));
//       setSpecializationOptions(formattedSpecializations);

//       // Set experience options if available in the response
//       if (specializationData.experince) {
//         setExperiences(specializationData.experince);
        
//         // Format experience options for Select
//         const formattedExperiences = specializationData.experince.map(exp => ({
//           value: exp,
//           label: exp
//         }));
//         setExperienceOptions(formattedExperiences);
//       }
//     }
//   }, [specializationData]);

//   useEffect(() => {
//     if (regionData?.countries && regionData?.cities) {
//       setCountries(regionData.countries);
//       setCities(regionData.cities);

//       // Format country options for Select
//       const formattedCountries = regionData.countries.map(country => ({
//         value: country.id.toString(),
//         label: country.name
//       }));
//       setCountryOptions(formattedCountries);

//       // Filter cities based on selected country
//       if (selectedCountry) {
//         const filtered = regionData.cities.filter(
//           (city) => city.country_id?.toString() === selectedCountry
//         );
//         setFilteredCities(filtered);

//         // Format city options for Select
//         const formattedCities = filtered.map(city => ({
//           value: city.id.toString(),
//           label: city.name
//         }));
//         setCityOptions(formattedCities);
//       } else {
//         setFilteredCities(regionData.cities);

//         // Format all city options for Select
//         const formattedCities = regionData.cities.map(city => ({
//           value: city.id.toString(),
//           label: city.name
//         }));
//         setCityOptions(formattedCities);
//       }
//     }
//   }, [regionData, selectedCountry]);

//   const handleCountryChange = (selectedOption) => {
//     const value = selectedOption ? selectedOption.value : "";
//     setSelectedCountry(value);
//     setFormData((prev) => ({ ...prev, country_id: value, city_id: "" }));
//     setSelectedCity("");

//     // Filter cities based on selected country
//     if (value && cities.length > 0) {
//       const filtered = cities.filter(
//         (city) => city.country_id?.toString() === value
//       );
//       setFilteredCities(filtered);

//       // Format city options for Select
//       const formattedCities = filtered.map(city => ({
//         value: city.id.toString(),
//         label: city.name
//       }));
//       setCityOptions(formattedCities);
//     } else {
//       setFilteredCities(cities);

//       // Format all city options for Select
//       const formattedCities = cities.map(city => ({
//         value: city.id.toString(),
//         label: city.name
//       }));
//       setCityOptions(formattedCities);
//     }

//     setFormErrors((prev) => ({ ...prev, country_id: null }));
//   };

//   const handleCityChange = (selectedOption) => {
//     const value = selectedOption ? selectedOption.value : "";
//     setSelectedCity(value);
//     setFormData((prev) => ({ ...prev, city_id: value }));
//     setFormErrors((prev) => ({ ...prev, city_id: null }));
//   };

//   const handleSpecializationChange = (selectedOptions) => {
//     const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
//     setFormData((prev) => ({ ...prev, specialization: values }));
//     setFormErrors((prev) => ({ ...prev, specialization: null }));
//   };

//   const handleExperienceChange = (selectedOption) => {
//     const value = selectedOption ? selectedOption.value : "";
//     setSelectedExperience(value);
//     setFormData((prev) => ({ ...prev, experience: value }));
//     setFormErrors((prev) => ({ ...prev, experience: null }));
//   };

//   // Get current values for react-select components
//   const getSelectedCountry = () => {
//     return countryOptions.find(option => option.value === selectedCountry) || null;
//   };

//   const getSelectedCity = () => {
//     return cityOptions.find(option => option.value === selectedCity) || null;
//   };

//   const getSelectedExperience = () => {
//     return experienceOptions.find(option => option.value === selectedExperience) || null;
//   };

//   const getSelectedSpecializations = () => {
//     return specializationOptions.filter(option => 
//       formData.specialization.includes(option.value)
//     );
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;

//     const errors = {};
//     const validFiles = [];

//     files.forEach((file) => {
//       if (file.type !== "application/pdf") {
//         errors.cv_files = "Please upload only PDF files";
//       } else {
//         validFiles.push(file);
//       }
//     });

//     if (Object.keys(errors).length > 0) {
//       setFormErrors((prev) => ({ ...prev, ...errors }));
//       setUploadCvError(errors.cv_files);
//       return;
//     }

//     // Process all valid files
//     const fileReaders = validFiles.map((file) => {
//       return new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//           resolve({
//             name: file.name,
//             content: event.target.result,
//             isNew: true,
//             size: file.size,
//           });
//         };
//         reader.readAsDataURL(file);
//       });
//     });

//     Promise.all(fileReaders).then((newCvFiles) => {
//       setFormData((prev) => ({
//         ...prev,
//         cv_files: [...prev.cv_files, ...newCvFiles],
//       }));
//       setFormErrors((prev) => ({ ...prev, cv_files: null }));
//       setUploadCvError(null);
//     });
//   };

//   const handleRemoveCv = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       cv_files: prev.cv_files.filter((_, i) => i !== index),
//     }));
//   };

//   const handleDeleteCv = (cv) => {
//     console.log("Deleting CV:", cv);
//     setSelectedRow(cv);
//     setIsDeleteOpen(true);
//   };

//   const handleDeleteAccount = () => {
//     setSelectedRow(profile);
//     setIsDeleteAccountOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     console.log("Deleting:", selectedRow);
//     if (!selectedRow) return;

//     if (isDeleteOpen) {
//       // Delete CV
//       const success = await deleteData(
//         `${apiUrl}/user/delete-cv`,
//         { cv_id: selectedRow.id },
//         "CV Deleted Successfully."
//       );

//       if (success) {
//         refetchProfile();
//       }
//       setIsDeleteOpen(false);
//     } else if (isDeleteAccountOpen) {
//       // Delete Account
//       const success = await deleteData(
//         `${apiUrl}/user/profile/delete`,
//         {},
//         "Account Deleted Successfully."
//       );

//       if (success) {
//         window.location.href = "/";
//       }
//       setIsDeleteAccountOpen(false);
//     }
//   };

//   const handleChangeProfile = async (e) => {
//     e.preventDefault();

//     const errors = {};
//     if (!formData.age) errors.age = "Age is required";
//     if (formData.password && formData.password !== formData.password_confirmation) {
//       errors.password_confirmation = "Passwords do not match";
//     }
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     const payload = {
//       first_name: formData.first_name,
//       last_name: formData.last_name,
//       email: formData.email,
//       phone: formData.phone,
//       user_address: formData.user_address,
//       age: parseInt(formData.age),
//       specialization: formData.specialization.map(id => parseInt(id)),
//       country_id: formData.country_id ? parseInt(formData.country_id) : null,
//       city_id: formData.city_id ? parseInt(formData.city_id) : null,
//       experience: formData.experience,
//     };

//     if (formData.password) {
//       payload.password = formData.password;
//       payload.password_confirmation = formData.password_confirmation;
//     }

//     try {
//       await changeState(
//         `${apiUrl}/user/profile/update`,
//         "Profile Updated Successfully.",
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setIsEditOpen(false);
//       setFormErrors({});
//       setFormData((prev) => ({
//         ...prev,
//         password: "",
//         password_confirmation: "",
//       }));
//       refetchProfile();
//     } catch (error) {
//       console.error("Error updating profile:", error.response?.data || error);
//       setFormErrors(error.response?.data?.errors || { general: "Failed to update profile" });
//     }
//   };

//   const handleUploadCv = async () => {
//     // Check if age is null or empty
//     if (!formData.age || formData.age === "0") {
//       toast.error("Age is required. Please update your profile.", {
//         duration: 4000,
//         position: "top-center",
//       });
//       setIsEditOpen(true);
//       return;
//     }

//     if (formData.cv_files.length === 0) {
//       setUploadCvError("Please select at least one PDF file to upload");
//       return;
//     }

//     // Prepare CVs in the required format
//     const cvs = formData.cv_files.map((cvFile) => ({
//       cv_file: cvFile.content,
//     }));

//     const payload = {
//       cvs: cvs,
//     };

//     try {
//       await postData(payload);

//       setUploadCvError(null);
//       setUploadCvSuccess("CVs uploaded successfully!");
//       setFormData((prev) => ({
//         ...prev,
//         cv_files: [],
//       }));
//       refetchProfile();
//       setTimeout(() => setUploadCvSuccess(null), 3000);
//     } catch (error) {
//       console.error("Error uploading CV:", error.response?.data || error);
//       setUploadCvError(error.response?.data?.errors?.cv_file || "Failed to upload CV");
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "age" ? String(value) : value,
//     }));
//     setFormErrors((prev) => ({ ...prev, [name]: null }));
//   };

//   const getCvDownloadLink = (cv, index) => {
//     if (!cv.cv_file_url) return null;
//     return (
//       <Card className="overflow-hidden border-none shadow-xl">
//         <CardContent className="p-3 flex items-center justify-between  border-none">
//           <div className="flex items-center">
//             <FiFileText className="text-blue-500 mr-2" />
//             <span className="text-gray-700 truncate max-w-xs">CV {index + 1 || "CV"}</span>
//           </div>
//           <div className="flex items-center">
//             <a
//               href={cv.cv_file_url}
//               download={cv.file_name || "user_cv.pdf"}
//               className="text-blue-500 hover:text-blue-700 flex items-center ml-4"
//             >
//               <FiDownload className="mr-1" /> Download
//             </a>
//             <button
//               onClick={() => handleDeleteCv(cv)}
//               className="text-red-500 hover:text-red-700 ml-4 p-1 rounded-full hover:bg-red-50"
//             >
//               <FiTrash2 />
//             </button>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   if (loadingProfile || loadingSpecialization) {
//     return <FullPageLoader />;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
//       <ToastContainer />
//       <div className="w-full">
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           {/* Profile Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
//               <div>
//                 <h1 className="text-2xl font-bold">{profile.full_name}</h1>
//                 <p className="flex items-center mt-1">
//                   <FiBriefcase className="mr-2" />
//                   {profile.role}
//                 </p>
//                 {profile.experience && (
//                   <p className="flex items-center mt-1">
//                     <span className="bg-white/20 px-2 py-1 rounded text-sm">
//                       {profile.experience}
//                     </span>
//                   </p>
//                 )}
//               </div>
//               <div className="mt-4 sm:mt-0 flex space-x-3">
//                 <Button
//                   onClick={() => setIsEditOpen(true)}
//                   className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center"
//                 >
//                   <FiEdit className="mr-2" /> Edit Profile
//                 </Button>
//                 <Button
//                   onClick={handleDeleteAccount}
//                   className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
//                 >
//                   <FiTrash2 className="mr-2" /> Delete Account
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Profile Content */}
//           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Personal Information */}
//             <div className="space-y-4">
//               <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center">
//                 <FiUser className="mr-2 text-blue-500" /> Personal Information
//               </h2>
//               <div className="space-y-3">
//                 <div>
//                   <p className="text-sm text-gray-500">Full Name</p>
//                   <p className="font-medium">{profile.full_name}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Email</p>
//                   <div className="flex items-center">
//                     <p className="font-medium">{profile.email}</p>
//                     {profile.email_verified && (
//                       <FiCheckCircle className="ml-2 text-green-500" />
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Phone</p>
//                   <p className="font-medium">{profile.phone || "Not provided"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Age</p>
//                   <p className="font-medium">{profile.age || "Not provided"}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Professional Information */}
//             <div className="space-y-4">
//               <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center">
//                 <FiBriefcase className="mr-2 text-blue-500" /> Professional Information
//               </h2>
//               <div className="space-y-3">
//                 <div>
//                   <p className="text-sm text-gray-500">Specializations</p>
//                   <div className="flex flex-wrap gap-1 mt-1">
//                     {profile.specializations?.length > 0 ? (
//                       profile.specializations.map((spec) => (
//                         <span
//                           key={spec.id}
//                           className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
//                         >
//                           {spec.name}
//                         </span>
//                       ))
//                     ) : (
//                       <p className="text-gray-500">None</p>
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Experience</p>
//                   <p className="font-medium">{profile.experience || "Not provided"}</p>
//                 </div>
//                 {/* <div>
//                   <p className="text-sm text-gray-500">Address</p>
//                   <div className="flex items-center">
//                     <FiMapPin className="mr-1 text-gray-400" />
//                     <p className="font-medium">{profile.user_address || "Not provided"}</p>
//                   </div>
//                 </div> */}
//                 <div>
//                   <p className="text-sm text-gray-500">Location</p>
//                   <div className="flex items-center">
//                     <FiMapPin className="mr-1 text-gray-400" />
//                     <p className="font-medium">
//                       {profile.city
//                         ? `${profile.city.name}, ${profile.country?.name}`
//                         : "Not provided"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* CV Section - Full Width */}
//             <div className="md:col-span-2 space-y-4">
//               <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center">
//                 <FiFileText className="mr-2 text-blue-500" /> CV Documents
//               </h2>
//               {profile.usercvs?.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {profile.usercvs.map((cv, index) => (
//                     <div key={index}>{getCvDownloadLink(cv, index)}</div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500">No CVs uploaded</p>
//               )}

//               {/* CV Upload Section */}
//               <div className="mt-6">
//                 <h3 className="text-md font-semibold text-gray-700 mb-3">Add New CVs</h3>

//                 {/* Selected CV files preview */}
//                 {formData.cv_files.length > 0 && (
//                   <div className="mb-4">
//                     <p className="text-sm font-medium text-gray-700 mb-2">Selected CVs:</p>
//                     <div className="space-y-2">
//                       {formData.cv_files.map((cv, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
//                         >
//                           <div className="flex items-center truncate">
//                             <FiFileText className="text-blue-500 mr-2 flex-shrink-0" />
//                             <span className="truncate">{cv.name}</span>
//                             <span className="text-xs text-gray-500 ml-2">
//                               ({(cv.size / 1024).toFixed(1)} KB)
//                             </span>
//                           </div>
//                           <button
//                             onClick={() => handleRemoveCv(index)}
//                             className="text-red-500 hover:text-red-700 ml-2 p-1 rounded-full hover:bg-red-50"
//                           >
//                             <FiTrash2 />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                     <Button
//                       onClick={handleUploadCv}
//                       disabled={loadingPost || formData.cv_files.length === 0}
//                       className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full"
//                     >
//                       {loadingPost ? "Uploading..." : `Upload ${formData.cv_files.length} CV(s)`}
//                     </Button>
//                   </div>
//                 )}

//                 {/* File input */}
//                 <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
//                   <input
//                     type="file"
//                     name="cv_upload"
//                     accept="application/pdf"
//                     onChange={handleFileChange}
//                     className="hidden"
//                     id="cv-upload-direct"
//                     multiple
//                   />
//                   <label
//                     htmlFor="cv-upload-direct"
//                     className="cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg flex items-center"
//                   >
//                     <FiPlus className="mr-2" /> Select CV Files
//                   </label>
//                   <p className="mt-2 text-xs text-gray-500">Select one or more PDF files</p>
//                 </div>

//                 {uploadCvError && (
//                   <p className="mt-2 text-sm text-red-600">{uploadCvError}</p>
//                 )}
//                 {uploadCvSuccess && (
//                   <p className="mt-2 text-sm text-green-600">{uploadCvSuccess}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Edit Dialog */}
//       <EditDialog
//         open={isEditOpen}
//         onOpenChange={setIsEditOpen}
//         selectedRow={profile}
//         title="Edit Profile"
//         onSave={handleChangeProfile}
//         loading={loadingChange}
//       >
//         <div className="w-full space-y-4">
//           {formErrors.general && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-lg">{formErrors.general}</div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="first_name">First Name</Label>
//               <Input
//                 id="first_name"
//                 name="first_name"
//                 value={formData.first_name}
//                 onChange={handleInputChange}
//               />
//               {formErrors.first_name && (
//                 <p className="text-sm text-red-600">{formErrors.first_name}</p>
//               )}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="last_name">Last Name</Label>
//               <Input
//                 id="last_name"
//                 name="last_name"
//                 value={formData.last_name}
//                 onChange={handleInputChange}
//               />
//               {formErrors.last_name && (
//                 <p className="text-sm text-red-600">{formErrors.last_name}</p>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 autoComplete="off"
//               />
//               {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone</Label>
//               <Input
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//               />
//               {formErrors.phone && <p className="text-sm text-red-600">{formErrors.phone}</p>}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 autoComplete="new-password"
//                 placeholder="Enter new password"
//               />
//               {formErrors.password && (
//                 <p className="text-sm text-red-600">{formErrors.password}</p>
//               )}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password_confirmation">Confirm Password</Label>
//               <Input
//                 id="password_confirmation"
//                 name="password_confirmation"
//                 type="password"
//                 value={formData.password_confirmation}
//                 onChange={handleInputChange}
//                 autoComplete="new-password"
//                 placeholder="Confirm new password"
//               />
//               {formErrors.password_confirmation && (
//                 <p className="text-sm text-red-600">{formErrors.password_confirmation}</p>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="age">Age</Label>
//               <Input
//                 id="age"
//                 name="age"
//                 type="number"
//                 value={formData.age}
//                 onChange={handleInputChange}
//                 required
//               />
//               {formErrors.age && <p className="text-sm text-red-600">{formErrors.age}</p>}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="experience">Experience</Label>
//               <Select
//                 value={getSelectedExperience()}
//                 onChange={handleExperienceChange}
//                 options={experienceOptions}
//                 placeholder="Select experience level"
//                 className="react-select-container"
//                 classNamePrefix="react-select"
//                 isClearable
//               />
//               {formErrors.experience && (
//                 <p className="text-sm text-red-600">{formErrors.experience}</p>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="country">Country</Label>
//               <Select
//                 value={getSelectedCountry()}
//                 onChange={handleCountryChange}
//                 options={countryOptions}
//                 placeholder="Select a country"
//                 className="react-select-container"
//                 classNamePrefix="react-select"
//                 isClearable
//               />
//               {formErrors.country_id && (
//                 <p className="text-sm text-red-600">{formErrors.country_id}</p>
//               )}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="city">City</Label>
//               <Select
//                 value={getSelectedCity()}
//                 onChange={handleCityChange}
//                 options={cityOptions}
//                 placeholder="Select a city"
//                 isDisabled={!selectedCountry}
//                 className="react-select-container"
//                 classNamePrefix="react-select"
//                 isClearable
//               />
//               {formErrors.city_id && <p className="text-sm text-red-600">{formErrors.city_id}</p>}
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="specializations">Specializations</Label>
//             <Select
//               value={getSelectedSpecializations()}
//               onChange={handleSpecializationChange}
//               options={specializationOptions}
//               placeholder="Select specializations"
//               isMulti
//               closeMenuOnSelect={false}
//               components={animatedComponents}
//               className="react-select-container"
//               classNamePrefix="react-select"
//             />
//             {formErrors.specialization && (
//               <p className="text-sm text-red-600">{formErrors.specialization}</p>
//             )}
//           </div>

//           {/* <div className="space-y-2">
//             <Label htmlFor="user_address">Address</Label>
//             <Input
//               id="user_address"
//               name="user_address"
//               value={formData.user_address}
//               onChange={handleInputChange}
//               required
//             />
//             {formErrors.user_address && (
//               <p className="text-sm text-red-600">{formErrors.user_address}</p>
//             )}
//           </div> */}
//         </div>
//       </EditDialog>

//       {/* Delete CV Dialog */}
//       <DeleteDialog
//         open={isDeleteOpen}
//         onOpenChange={setIsDeleteOpen}
//         selectedRow={selectedRow}
//         title="Delete CV"
//         description="Are you sure you want to delete this CV? This action cannot be undone."
//         onConfirm={handleDeleteConfirm}
//         loading={loadingDelete}
//       />

//       {/* Delete Account Dialog */}
//       <DeleteDialog
//         open={isDeleteAccountOpen}
//         onOpenChange={setIsDeleteAccountOpen}
//         selectedRow={selectedRow}
//         title="Delete Account"
//         description="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
//         onConfirm={handleDeleteConfirm}
//         loading={loadingDelete}
//       />
//     </div>
//   );
// };

// export default Profile;

"use client";

import FullPageLoader from "@/components/Loading";
import { useChangeState } from "@/Hooks/useChangeState";
import { useDelete } from "@/Hooks/useDelete";
import { useGet } from "@/Hooks/UseGet";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/DeleteDialog";
import { EditDialog } from "@/components/EditDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {
  FiDownload,
  FiTrash2,
  FiEdit,
  FiUser,
  FiCheckCircle,
  FiBriefcase,
  FiMapPin,
  FiFileText,
  FiPlus,
  FiCamera,
  FiAward,
  FiStar,
  FiX,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import { usePost } from "@/Hooks/UsePost";

const animatedComponents = makeAnimated();

const Profile = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const {
    refetch: refetchProfile,
    loading: loadingProfile,
    data: profileData,
  } = useGet({
    url: `${apiUrl}/user/profile`,
  });
  const {
    refetch: refetchSpecialization,
    loading: loadingSpecialization,
    data: specializationData,
  } = useGet({
    url: `${apiUrl}/user/specializations/get`,
  });
  const {
    refetch: refetchRegion,
    loading: loadingRegion,
    data: regionData,
  } = useGet({
    url: `${apiUrl}/city-country`,
  });
  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/user/add-cv`,
  });
  const { changeState, loading: loadingChange } = useChangeState();
  const { deleteData, loading: loadingDelete } = useDelete();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [profile, setProfile] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    user_address: "",
    age: "",
    specialization: [],
    cv_files: [],
    country_id: "",
    city_id: "",
    experience: "",
    image: null, // Changed from profile_image to image
    image_link: "", // For displaying the image
  });
  const [formErrors, setFormErrors] = useState({});
  const [uploadCvError, setUploadCvError] = useState(null);
  const [uploadCvSuccess, setUploadCvSuccess] = useState(null);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [profileCompletion, setProfileCompletion] = useState(0);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null); // Separate ref for image upload

  // Format options for Select
  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [experienceOptions, setExperienceOptions] = useState([]);

  // Calculate profile completion percentage
  const calculateProfileCompletion = (userData) => {
    if (!userData) return 0;

    const fields = [
      { key: 'first_name', weight: 10 },
      { key: 'last_name', weight: 10 },
      { key: 'email', weight: 10 },
      { key: 'phone', weight: 10 },
      { key: 'age', weight: 10 },
      // { key: 'user_address', weight: 5 },
      { key: 'country_id', weight: 10 },
      { key: 'city_id', weight: 10 },
      { key: 'experience', weight: 10 },
      { key: 'specializations', weight: 10, check: (val) => val && val.length > 0 },
      { key: 'image_link', weight: 10, check: (val) => !!val },
    ];

    let completion = 0;
    fields.forEach(field => {
      const value = userData[field.key];
      if (field.check ? field.check(value) : (value && value !== '' && value !== 0)) {
        completion += field.weight;
      }
    });

    return Math.min(completion, 100);
  };

  useEffect(() => {
    refetchProfile();
    refetchSpecialization();
    refetchRegion();
  }, [refetchProfile, refetchSpecialization, refetchRegion]);

  useEffect(() => {
    if (profileData && profileData.user) {
      const userData = profileData.user;
      setProfile(userData);
      setProfileCompletion(calculateProfileCompletion(userData));
      
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        password: "",
        password_confirmation: "",
        user_address: userData.user_address || "",
        age: userData.age ? String(userData.age) : "",
        specialization: userData.specializations?.map((spec) => spec.id.toString()) || [],
        cv_files: [],
        country_id: userData.country_id || "",
        city_id: userData.city_id || "",
        experience: userData.experience || "",
        image: null,
        image_link: userData.image_link || "", // Set existing image link
      });

      if (userData.country_id) {
        setSelectedCountry(userData.country_id.toString());
      }
      if (userData.city_id) {
        setSelectedCity(userData.city_id.toString());
      }
      if (userData.experience) {
        setSelectedExperience(userData.experience);
      }
    }
  }, [profileData]);

  useEffect(() => {
    if (specializationData && specializationData.specializations) {
      setSpecializations(specializationData.specializations);

      const formattedSpecializations = specializationData.specializations.map(spec => ({
        value: spec.id.toString(),
        label: spec.name
      }));
      setSpecializationOptions(formattedSpecializations);

      if (specializationData.experince) {
        setExperiences(specializationData.experince);
        
        const formattedExperiences = specializationData.experince.map(exp => ({
          value: exp,
          label: exp
        }));
        setExperienceOptions(formattedExperiences);
      }
    }
  }, [specializationData]);

  useEffect(() => {
    if (regionData?.countries && regionData?.cities) {
      setCountries(regionData.countries);
      setCities(regionData.cities);

      const formattedCountries = regionData.countries.map(country => ({
        value: country.id.toString(),
        label: country.name
      }));
      setCountryOptions(formattedCountries);

      if (selectedCountry) {
        const filtered = regionData.cities.filter(
          (city) => city.country_id?.toString() === selectedCountry
        );
        setFilteredCities(filtered);

        const formattedCities = filtered.map(city => ({
          value: city.id.toString(),
          label: city.name
        }));
        setCityOptions(formattedCities);
      } else {
        setFilteredCities(regionData.cities);

        const formattedCities = regionData.cities.map(city => ({
          value: city.id.toString(),
          label: city.name
        }));
        setCityOptions(formattedCities);
      }
    }
  }, [regionData, selectedCountry]);

  // Image Upload Handler for Edit Form
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    // Convert image to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result;
      
      // Update form data with base64 image and preview
      setFormData(prev => ({
        ...prev,
        image: base64String, // Base64 string for sending to API
        image_link: base64String // For preview in the form
      }));
    };
    
    reader.onerror = () => {
      toast.error('Failed to read the image file');
    };
    
    reader.readAsDataURL(file);
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      image_link: profile.image_link || "" // Reset to original image or empty
    }));
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  // Trigger image upload
  const triggerImageUpload = () => {
    imageInputRef.current?.click();
  };

  // Profile Completion Indicator Component
  const ProfileCompletionIndicator = ({ completion }) => {
    const getCompletionColor = (percent) => {
      if (percent >= 80) return 'from-green-500 to-emerald-600';
      if (percent >= 60) return 'from-blue-500 to-cyan-600';
      if (percent >= 40) return 'from-yellow-500 to-amber-600';
      return 'from-red-500 to-orange-600';
    };

    const getCompletionMessage = (percent) => {
      if (percent >= 90) return 'Excellent! Your profile is almost complete';
      if (percent >= 70) return 'Great progress! Almost there';
      if (percent >= 50) return 'Good start! Keep going';
      if (percent >= 30) return 'Getting started! Add more info';
      return 'Complete your profile to get noticed';
    };

    const getCompletionIcon = (percent) => {
      if (percent >= 80) return <FiAward className="text-2xl" />;
      if (percent >= 60) return <FiStar className="text-2xl" />;
      if (percent >= 40) return <FiCheckCircle className="text-2xl" />;
      return <FiUser className="text-2xl" />;
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getCompletionIcon(completion)}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Profile Completion</h3>
              <p className="text-sm text-gray-600">{getCompletionMessage(completion)}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-800">{completion}%</span>
          </div>
        </div>
        
        {/* Animated Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full bg-gradient-to-r ${getCompletionColor(completion)} transition-all duration-1000 ease-out`}
            style={{ width: `${completion}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>Complete your profile</span>
          <span>100%</span>
        </div>

        {completion < 100 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Tip:</strong> {completion < 50 ? 'Add your experience and location to increase visibility' : 
                                  completion < 80 ? 'Upload a profile photo and CV to stand out' : 
                                  'You\'re almost there! Complete all sections for best results'}
            </p>
          </div>
        )}
      </div>
    );
  };

  const triggerProfileImageUpload = () => {
    fileInputRef.current?.click();
  };

  // Enhanced Profile Header with Image Upload
  const EnhancedProfileHeader = () => (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
      {/* Profile Image Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
            {profile.image_link ? (
              <img 
                src={profile.image_link} 
                alt={profile.full_name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <FiUser className="text-4xl text-white/70" />
            )}
          </div>
          {/* <button
            onClick={triggerProfileImageUpload}
            className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 border-2 border-white hover:bg-blue-600 transition-all duration-200 group-hover:scale-110"
          >
            <FiCamera className="text-white text-sm" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfileImageUpload}
            accept="image/*"
            className="hidden"
          /> */}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile.full_name}</h1>
          <p className="flex items-center mt-1">
            <FiBriefcase className="mr-2" />
            {profile.role}
          </p>
          {profile.experience && (
            <p className="flex items-center mt-1">
              <span className="bg-white/20 px-2 py-1 rounded text-sm">
                {profile.experience}
              </span>
            </p>
          )}
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={() => setIsEditOpen(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center"
          >
            <FiEdit className="mr-2" /> Edit Profile
          </Button>
          <Button
            onClick={handleDeleteAccount}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FiTrash2 className="mr-2" /> Delete Account
          </Button>
        </div>
      </div>
    </div>
  );

  // Rest of your existing handlers remain the same...
  const handleCountryChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setSelectedCountry(value);
    setFormData((prev) => ({ ...prev, country_id: value, city_id: "" }));
    setSelectedCity("");

    if (value && cities.length > 0) {
      const filtered = cities.filter(
        (city) => city.country_id?.toString() === value
      );
      setFilteredCities(filtered);

      const formattedCities = filtered.map(city => ({
        value: city.id.toString(),
        label: city.name
      }));
      setCityOptions(formattedCities);
    } else {
      setFilteredCities(cities);

      const formattedCities = cities.map(city => ({
        value: city.id.toString(),
        label: city.name
      }));
      setCityOptions(formattedCities);
    }

    setFormErrors((prev) => ({ ...prev, country_id: null }));
  };

  const handleCityChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setSelectedCity(value);
    setFormData((prev) => ({ ...prev, city_id: value }));
    setFormErrors((prev) => ({ ...prev, city_id: null }));
  };

  const handleSpecializationChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData((prev) => ({ ...prev, specialization: values }));
    setFormErrors((prev) => ({ ...prev, specialization: null }));
  };

  const handleExperienceChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setSelectedExperience(value);
    setFormData((prev) => ({ ...prev, experience: value }));
    setFormErrors((prev) => ({ ...prev, experience: null }));
  };

  const getSelectedCountry = () => {
    return countryOptions.find(option => option.value === selectedCountry) || null;
  };

  const getSelectedCity = () => {
    return cityOptions.find(option => option.value === selectedCity) || null;
  };

  const getSelectedExperience = () => {
    return experienceOptions.find(option => option.value === selectedExperience) || null;
  };

  const getSelectedSpecializations = () => {
    return specializationOptions.filter(option => 
      formData.specialization.includes(option.value)
    );
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const errors = {};
    const validFiles = [];

    files.forEach((file) => {
      if (file.type !== "application/pdf") {
        errors.cv_files = "Please upload only PDF files";
      } else {
        validFiles.push(file);
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors((prev) => ({ ...prev, ...errors }));
      setUploadCvError(errors.cv_files);
      return;
    }

    const fileReaders = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            name: file.name,
            content: event.target.result,
            isNew: true,
            size: file.size,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders).then((newCvFiles) => {
      setFormData((prev) => ({
        ...prev,
        cv_files: [...prev.cv_files, ...newCvFiles],
      }));
      setFormErrors((prev) => ({ ...prev, cv_files: null }));
      setUploadCvError(null);
    });
  };

  const handleRemoveCv = (index) => {
    setFormData((prev) => ({
      ...prev,
      cv_files: prev.cv_files.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteCv = (cv) => {
    setSelectedRow(cv);
    setIsDeleteOpen(true);
  };

  const handleDeleteAccount = () => {
    setSelectedRow(profile);
    setIsDeleteAccountOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRow) return;

    if (isDeleteOpen) {
      const success = await deleteData(
        `${apiUrl}/user/delete-cv`,
        { cv_id: selectedRow.id },
        "CV Deleted Successfully."
      );

      if (success) {
        refetchProfile();
      }
      setIsDeleteOpen(false);
    } else if (isDeleteAccountOpen) {
      const success = await deleteData(
        `${apiUrl}/user/profile/delete`,
        {},
        "Account Deleted Successfully."
      );

      if (success) {
        window.location.href = "/";
      }
      setIsDeleteAccountOpen(false);
    }
  };

  const handleChangeProfile = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.age) errors.age = "Age is required";
    if (formData.password && formData.password !== formData.password_confirmation) {
      errors.password_confirmation = "Passwords do not match";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      user_address: formData.user_address,
      age: parseInt(formData.age),
      specialization: formData.specialization.map(id => parseInt(id)),
      country_id: formData.country_id ? parseInt(formData.country_id) : null,
      city_id: formData.city_id ? parseInt(formData.city_id) : null,
      experience: formData.experience,
    };

    // Add image to payload if uploaded
    if (formData.image) {
      payload.image = formData.image; // Send base64 string with key "image"
    }

    if (formData.password) {
      payload.password = formData.password;
      payload.password_confirmation = formData.password_confirmation;
    }

    try {
      await changeState(
        `${apiUrl}/user/profile/update`,
        "Profile Updated Successfully.",
        payload,
      );
      setIsEditOpen(false);
      setFormErrors({});
      setFormData((prev) => ({
        ...prev,
        password: "",
        password_confirmation: "",
        image: null, // Reset image after upload
      }));
      refetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error);
      setFormErrors(error.response?.data?.errors || { general: "Failed to update profile" });
    }
  };

  const handleUploadCv = async () => {
    if (!formData.age || formData.age === "0") {
      toast.error("Age is required. Please update your profile.", {
        duration: 4000,
        position: "top-center",
      });
      setIsEditOpen(true);
      return;
    }

    if (formData.cv_files.length === 0) {
      setUploadCvError("Please select at least one PDF file to upload");
      return;
    }

    const cvs = formData.cv_files.map((cvFile) => ({
      cv_file: cvFile.content,
    }));

    const payload = {
      cvs: cvs,
    };

    try {
      await postData(payload);

      setUploadCvError(null);
      setUploadCvSuccess("CVs uploaded successfully!");
      setFormData((prev) => ({
        ...prev,
        cv_files: [],
      }));
      refetchProfile();
      setTimeout(() => setUploadCvSuccess(null), 3000);
    } catch (error) {
      console.error("Error uploading CV:", error.response?.data || error);
      setUploadCvError(error.response?.data?.errors?.cv_file || "Failed to upload CV");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? String(value) : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const getCvDownloadLink = (cv, index) => {
    if (!cv.cv_file_url) return null;
    return (
      <Card className="overflow-hidden border-none shadow-xl">
        <CardContent className="p-3 flex items-center justify-between border-none">
          <div className="flex items-center">
            <FiFileText className="text-blue-500 mr-2" />
            <span className="text-gray-700 truncate max-w-xs">CV {index + 1 || "CV"}</span>
          </div>
          <div className="flex items-center">
            <a
              href={cv.cv_file_url}
              download={cv.file_name || "user_cv.pdf"}
              className="text-blue-500 hover:text-blue-700 flex items-center ml-4"
            >
              <FiDownload className="mr-1" /> Download
            </a>
            <button
              onClick={() => handleDeleteCv(cv)}
              className="text-red-500 hover:text-red-700 ml-4 p-1 rounded-full hover:bg-red-50"
            >
              <FiTrash2 />
            </button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loadingProfile || loadingSpecialization) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="w-full p-4">
        
        {/* Profile Completion Indicator */}
        <ProfileCompletionIndicator completion={profileCompletion} />

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Enhanced Profile Header with Image Upload */}
          <EnhancedProfileHeader />

          {/* Profile Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center">
                <FiUser className="mr-2 text-blue-500" /> Personal Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{profile.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <div className="flex items-center">
                    <p className="font-medium">{profile.email}</p>
                    {profile.email_verified && (
                      <FiCheckCircle className="ml-2 text-green-500" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{profile.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{profile.age || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center">
                <FiBriefcase className="mr-2 text-blue-500" /> Professional Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Specializations</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.specializations?.length > 0 ? (
                      profile.specializations.map((spec) => (
                        <span
                          key={spec.id}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {spec.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">None</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">{profile.experience || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <div className="flex items-center">
                    <FiMapPin className="mr-1 text-gray-400" />
                    <p className="font-medium">
                      {profile.city
                        ? `${profile.city.name}, ${profile.country?.name}`
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CV Section - Full Width */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center">
                <FiFileText className="mr-2 text-blue-500" /> CV Documents
              </h2>
              {profile.usercvs?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.usercvs.map((cv, index) => (
                    <div key={index}>{getCvDownloadLink(cv, index)}</div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No CVs uploaded</p>
              )}

              {/* CV Upload Section */}
              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-700 mb-3">Add New CVs</h3>

                {formData.cv_files.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Selected CVs:</p>
                    <div className="space-y-2">
                      {formData.cv_files.map((cv, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex items-center truncate">
                            <FiFileText className="text-blue-500 mr-2 flex-shrink-0" />
                            <span className="truncate">{cv.name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({(cv.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveCv(index)}
                            className="text-red-500 hover:text-red-700 ml-2 p-1 rounded-full hover:bg-red-50"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={handleUploadCv}
                      disabled={loadingPost || formData.cv_files.length === 0}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full"
                    >
                      {loadingPost ? "Uploading..." : `Upload ${formData.cv_files.length} CV(s)`}
                    </Button>
                  </div>
                )}

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    name="cv_upload"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="cv-upload-direct"
                    multiple
                  />
                  <label
                    htmlFor="cv-upload-direct"
                    className="cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg flex items-center"
                  >
                    <FiPlus className="mr-2" /> Select CV Files
                  </label>
                  <p className="mt-2 text-xs text-gray-500">Select one or more PDF files</p>
                </div>

                {uploadCvError && (
                  <p className="mt-2 text-sm text-red-600">{uploadCvError}</p>
                )}
                {uploadCvSuccess && (
                  <p className="mt-2 text-sm text-green-600">{uploadCvSuccess}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog with Image Upload */}
      <EditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        selectedRow={profile}
        title="Edit Profile"
        onSave={handleChangeProfile}
        loading={loadingChange}
      >
        <div className="w-full space-y-4">
          {formErrors.general && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">{formErrors.general}</div>
          )}

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="profile_image">Profile Image</Label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                  {formData.image_link ? (
                    <img 
                      src={formData.image_link} 
                      alt="Profile preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-2xl text-gray-400" />
                  )}
                </div>
                {formData.image_link && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <FiX className="text-xs" />
                  </button>
                )}
              </div>
              
              <div className="flex-1">
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg inline-flex items-center"
                >
                  <FiCamera className="mr-2" /> 
                  {formData.image_link ? 'Change Image' : 'Upload Image'}
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG, GIF (max 5MB). Image will be sent as base64.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
              />
              {formErrors.first_name && (
                <p className="text-sm text-red-600">{formErrors.first_name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
              />
              {formErrors.last_name && (
                <p className="text-sm text-red-600">{formErrors.last_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="off"
              />
              {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              {formErrors.phone && <p className="text-sm text-red-600">{formErrors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="new-password"
                placeholder="Enter new password"
              />
              {formErrors.password && (
                <p className="text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                autoComplete="new-password"
                placeholder="Confirm new password"
              />
              {formErrors.password_confirmation && (
                <p className="text-sm text-red-600">{formErrors.password_confirmation}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
              {formErrors.age && <p className="text-sm text-red-600">{formErrors.age}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Select
                value={getSelectedExperience()}
                onChange={handleExperienceChange}
                options={experienceOptions}
                placeholder="Select experience level"
                className="react-select-container"
                classNamePrefix="react-select"
                isClearable
              />
              {formErrors.experience && (
                <p className="text-sm text-red-600">{formErrors.experience}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={getSelectedCountry()}
                onChange={handleCountryChange}
                options={countryOptions}
                placeholder="Select a country"
                className="react-select-container"
                classNamePrefix="react-select"
                isClearable
              />
              {formErrors.country_id && (
                <p className="text-sm text-red-600">{formErrors.country_id}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select
                value={getSelectedCity()}
                onChange={handleCityChange}
                options={cityOptions}
                placeholder="Select a city"
                isDisabled={!selectedCountry}
                className="react-select-container"
                classNamePrefix="react-select"
                isClearable
              />
              {formErrors.city_id && <p className="text-sm text-red-600">{formErrors.city_id}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specializations">Specializations</Label>
            <Select
              value={getSelectedSpecializations()}
              onChange={handleSpecializationChange}
              options={specializationOptions}
              placeholder="Select specializations"
              isMulti
              closeMenuOnSelect={false}
              components={animatedComponents}
              className="react-select-container"
              classNamePrefix="react-select"
            />
            {formErrors.specialization && (
              <p className="text-sm text-red-600">{formErrors.specialization}</p>
            )}
          </div>
        </div>
      </EditDialog>

      {/* Delete CV Dialog */}
      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        selectedRow={selectedRow}
        title="Delete CV"
        description="Are you sure you want to delete this CV? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        loading={loadingDelete}
      />

      {/* Delete Account Dialog */}
      <DeleteDialog
        open={isDeleteAccountOpen}
        onOpenChange={setIsDeleteAccountOpen}
        selectedRow={selectedRow}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
        onConfirm={handleDeleteConfirm}
        loading={loadingDelete}
      />
    </div>
  );
};

export default Profile;