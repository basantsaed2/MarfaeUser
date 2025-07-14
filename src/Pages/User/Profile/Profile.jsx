"use client";

import FullPageLoader from "@/components/Loading";
import { useChangeState } from "@/Hooks/useChangeState";
import { useDelete } from "@/Hooks/useDelete";
import { useGet } from "@/Hooks/UseGet";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/DeleteDialog";
import { EditDialog } from "@/components/EditDialog";
import Select from "react-select";
import { FiDownload, FiTrash2, FiEdit, FiUser, FiMail, FiPhone, FiCalendar, FiCheckCircle, FiBriefcase, FiMapPin, FiFileText } from "react-icons/fi";

const Profile = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchProfile, loading: loadingProfile, data: profileData } = useGet({
        url: `${apiUrl}/user/profile`,
    });
    const { refetch: refetchSpecialization, loading: loadingSpecialization, data: specializationData } = useGet({
        url: `${apiUrl}/user/specializations/get`,
    });
    const { changeState, loadingChange } = useChangeState();
    const { deleteData, loadingDelete } = useDelete();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [profile, setProfile] = useState([]);
    const [specializations, setSpecializations] = useState([]);
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
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        refetchProfile();
        refetchSpecialization();
    }, [refetchProfile, refetchSpecialization]);

    useEffect(() => {
        if (profileData && profileData.user) {
            setProfile(profileData.user);
            setFormData({
                first_name: profileData.user.first_name || "",
                last_name: profileData.user.last_name || "",
                email: profileData.user.email || "",
                phone: profileData.user.phone || "",
                password: "", // Explicitly empty to prevent autofill
                password_confirmation: "", // Explicitly empty to prevent autofill
                user_address: profileData.user.user_address || "",
                age: profileData.user.age ? String(profileData.user.age) : "",
                specialization: profileData.user.specializations?.map(spec => spec.id) || [],
                cv_files: profileData.user.usercvs || [],
            });
        }
    }, [profileData]);

    useEffect(() => {
        if (specializationData && specializationData.specializations) {
            setSpecializations(specializationData.specializations);
        }
    }, [specializationData]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const errors = {};
        if (file.type !== "application/pdf") {
            errors.cv_files = "Please upload a valid PDF file";
            setFormErrors(prev => ({ ...prev, ...errors }));
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData(prev => ({
                ...prev,
                cv_files: [{ name: file.name, content: event.target.result, isNew: true }]
            }));
        };
        reader.onerror = () => {
            errors.cv_files = "Failed to read PDF file";
            setFormErrors(prev => ({ ...prev, ...errors }));
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveCv = (index) => {
        setFormData(prev => ({
            ...prev,
            cv_files: prev.cv_files.filter((_, i) => i !== index)
        }));
    };

    const handleChangeProfile = async (e) => {
        e.preventDefault();

        // Client-side validation
        const errors = {};
        if (!formData.age) errors.age = "Age is required";
        if (!profile.usercvs?.length && formData.cv_files.length === 0) {
            errors.cv_files = "At least one CV file is required";
        }
        if (formData.password && formData.password !== formData.password_confirmation) {
            errors.password_confirmation = "Passwords do not match";
        }
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Prepare JSON payload
        const payload = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            user_address: formData.user_address,
            age: parseInt(formData.age),
            specialization: formData.specialization,
        };

        // Only include password fields if provided
        if (formData.password) {
            payload.password = formData.password;
            payload.password_confirmation = formData.password_confirmation;
        }

        // Only include cv_file if new files were uploaded
        const newCvFiles = formData.cv_files.filter(f => f.isNew);
        if (newCvFiles.length > 0) {
            payload.cv_file = newCvFiles[0].content;
        }

        try {
            await changeState(
                `${apiUrl}/user/profile/update`,
                "Profile Updated Successfully.",
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setIsEditOpen(false);
            setFormErrors({});
            setFormData(prev => ({
                ...prev,
                password: "", // Clear password fields after submission
                password_confirmation: "",
            }));
            refetchProfile();
        } catch (error) {
            console.error("Error updating profile:", error.response?.data || error);
            setFormErrors(error.response?.data?.errors || { general: "Failed to update profile" });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? String(value) : value,
        }));
        setFormErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSpecializationChange = (selectedOptions) => {
        const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData(prev => ({ ...prev, specialization: selectedIds }));
        setFormErrors(prev => ({ ...prev, specialization: null }));
    };

    const handleDelete = (item) => {
        setSelectedRow(item);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;

        const success = await deleteData(
            `${apiUrl}/user/profile/delete`,
            "Account Deleted Successfully."
        );

        if (success) {
            window.location.href = "/";
        }
        setIsDeleteOpen(false);
    };

    const getCvDownloadLink = (cv) => {
        if (!cv.cv_file_url) return null;
        return (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                    <FiFileText className="text-blue-500 mr-2" />
                    <span className="text-gray-700 truncate max-w-xs">{cv.file_name || "CV"}</span>
                </div>
                <a
                    href={cv.cv_file_url}
                    download={cv.file_name || "user_cv.pdf"}
                    className="text-blue-500 hover:text-blue-700 flex items-center ml-4"
                >
                    <FiDownload className="mr-1" /> Download
                </a>
            </div>
        );
    };

    const specializationOptions = specializations.map(spec => ({
        value: spec.id,
        label: spec.name
    }));

    const selectedSpecializations = specializationOptions.filter(option => 
        formData.specialization.includes(option.value)
    );

    if (loadingProfile || loadingSpecialization) {
        return <FullPageLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                                <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                                <p className="flex items-center mt-1">
                                    <FiBriefcase className="mr-2" />
                                    {profile.role}
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-0 flex space-x-3">
                                <Button
                                    onClick={() => setIsEditOpen(true)}
                                    className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center"
                                >
                                    <FiEdit className="mr-2" /> Edit Profile
                                </Button>
                                <Button
                                    onClick={() => handleDelete(profile)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                                >
                                    <FiTrash2 className="mr-2" /> Delete Account
                                </Button>
                            </div>
                        </div>
                    </div>

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
                                    <p className="text-sm text-gray-500">Status</p>
                                    <p className="font-medium capitalize">{profile.status}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Specializations</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {profile.specializations?.length > 0 ? (
                                            profile.specializations.map(spec => (
                                                <span key={spec.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                    {spec.name}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">None</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <div className="flex items-center">
                                        <FiMapPin className="mr-1 text-gray-400" />
                                        <p className="font-medium">{profile.user_address || "Not provided"}</p>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {profile.usercvs.map((cv, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                                            {getCvDownloadLink(cv)}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No CVs uploaded</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <EditDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                selectedRow={profile}
                title="Edit Profile"
                onSave={handleChangeProfile}
                loading={loadingChange}
            >
                <div className="space-y-4">
                    {formErrors.general && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg">
                            {formErrors.general}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.first_name && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.first_name}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.last_name && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.last_name}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                autoComplete="off" // Prevent autofill for email
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.phone && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                autoComplete="new-password" // Prevent autofill
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter new password"
                            />
                            {formErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleInputChange}
                                autoComplete="new-password" // Prevent autofill
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Confirm new password"
                            />
                            {formErrors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.password_confirmation}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                            <input
                                type преп="number"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            {formErrors.age && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.age}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
                            <Select
                                isMulti
                                name="specialization"
                                options={specializationOptions}
                                value={selectedSpecializations}
                                onChange={handleSpecializationChange}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                placeholder="Select specializations..."
                            />
                            {formErrors.specialization && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.specialization}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                            type="text"
                            name="user_address"
                            value={formData.user_address}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {formErrors.user_address && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.user_address}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CV File</label>
                        <div className="space-y-3">
                            {formData.cv_files.length > 0 && (
                                <div className="space-y-2">
                                    {formData.cv_files.map((cv, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center truncate">
                                                <FiFileText className="text-blue-500 mr-2 flex-shrink-0" />
                                                <span className="truncate">{cv.name || cv.file_name || `CV ${index + 1}`}</span>
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
                            )}
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                                <input
                                    type="file"
                                    name="cv_files"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="cv-upload"
                                />
                                <label
                                    htmlFor="cv-upload"
                                    className="cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg flex items-center"
                                >
                                    <FiFileText className="mr-2" /> Upload CV (PDF)
                                </label>
                                <p className="mt-2 text-xs text-gray-500">Upload a single PDF file</p>
                            </div>
                            {formErrors.cv_files && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.cv_files}</p>
                            )}
                        </div>
                    </div>
                </div>
            </EditDialog>

            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                selectedRow={selectedRow}
                title="Delete Account"
                description="Are you sure you want to delete your account? This action cannot be undone."
                onConfirm={handleDeleteConfirm}
                loading={loadingDelete}
            />
        </div>
    );
};

export default Profile;