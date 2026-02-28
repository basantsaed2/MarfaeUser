"use client";
import FullPageLoader from "@/components/Loading";
import { useDelete } from "@/Hooks/useDelete";
import { useGet } from "@/Hooks/UseGet";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/DeleteDialog";
import { Card, CardContent } from "@/components/ui/card";
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
  FiAward,
  FiStar,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import { usePost } from "@/Hooks/UsePost";
import EditProfileDialog from "./EditProfileDialog";

const Profile = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const {
    refetch: refetchProfile,
    loading: loadingProfile,
    data: profileData,
  } = useGet({ url: `${apiUrl}/user/profile` });

  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/user/add-cv` });
  const { deleteData, loading: loadingDelete } = useDelete();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [profile, setProfile] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [uploadCvError, setUploadCvError] = useState(null);
  const [uploadCvSuccess, setUploadCvSuccess] = useState(null);
  const [cvFiles, setCvFiles] = useState([]);

  // Check if user is doctor or nurse
  const isMedicalProfessional = () => {
    const jobTitle = allUserData?.job_title?.name?.toLowerCase();
    return jobTitle === 'doctor' || jobTitle === 'nurse';
  };

  // Calculate profile completion - updated for medical professionals
  const calculateProfileCompletion = (userData) => {
    if (!userData) return 0;

    const isMedical = isMedicalProfessional();

    const fields = [
      { key: 'first_name', weight: 8 },
      { key: 'last_name', weight: 8 },
      { key: 'email', weight: 8 },
      { key: 'phone', weight: 8 },
      { key: 'age', weight: 8 },
      { key: 'country_id', weight: 8 },
      { key: 'city_id', weight: 8 },
      { key: 'experience', weight: 8 },
      { key: 'specializations', weight: 8, check: (val) => val && val.length > 0 },
      { key: 'qualification', weight: 8, check: (val) => val && val !== '' },
      { key: 'image_link', weight: 4, check: (val) => !!val },
    ];

    // Add conditional fields based on job type
    if (isMedical) {
      fields.push(
        { key: 'hospital_clinic_name', weight: 8, check: (val) => val && val !== '' }
      );
    } else {
      fields.push(
        { key: 'drugs', weight: 8, check: (val) => val && val.length > 0 },
        { key: 'company_id', weight: 8, check: (val) => val && val !== '' }
      );
    }

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
  }, [refetchProfile]);

  useEffect(() => {
    if (profileData && profileData.user) {
      const userData = {
        ...profileData.user,
        job_title: profileData.job_title?.name,
      }
      setAllUserData(profileData)
      setProfile(userData);
      setProfileCompletion(calculateProfileCompletion(userData));
    }
  }, [profileData]);

  // File Upload Handlers
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
      setCvFiles(prev => [...prev, ...newCvFiles]);
      setUploadCvError(null);
    });
  };

  const handleRemoveCv = (index) => {
    setCvFiles(prev => prev.filter((_, i) => i !== index));
  };

  // CV Upload Handler
  const handleUploadCv = async () => {
    if (!profile.age || profile.age === "0") {
      toast.error("Age is required. Please update your profile.", {
        duration: 4000,
        position: "top-center",
      });
      setIsEditOpen(true);
      return;
    }

    if (cvFiles.length === 0) {
      setUploadCvError("Please select at least one PDF file to upload");
      return;
    }

    const cvs = cvFiles.map((cvFile) => ({
      cv_file: cvFile.content,
    }));

    const payload = {
      cvs: cvs,
    };

    try {
      await postData(payload);

      setUploadCvError(null);
      setUploadCvSuccess("CVs uploaded successfully!");
      setCvFiles([]);
      refetchProfile();
      setTimeout(() => setUploadCvSuccess(null), 3000);
    } catch (error) {
      console.error("Error uploading CV:", error.response?.data || error);
      setUploadCvError(error.response?.data?.errors?.cv_file || "Failed to upload CV");
    }
  };

  // Delete Handlers
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

  // CV Download Link
  const getCvDownloadLink = (cv, index) => {
    if (!cv.cv_file_url) return null;
    return (
      <Card className="overflow-hidden border-none shadow-xl">
        <CardContent className="p-3 flex items-center justify-between border-none">
          <div className="flex items-center">
            <FiFileText className="text-bg-primary mr-2" />
            <span className="text-gray-700 truncate max-w-xs">CV {index + 1 || "CV"}</span>
          </div>
          <div className="flex items-center">
            <a
              href={cv.cv_file_url}
              download={cv.file_name || "user_cv.pdf"}
              className="text-bg-primary hover:text-bg-primary/80 flex items-center ml-4"
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

  // Profile Completion Indicator Component
  const ProfileCompletionIndicator = ({ completion }) => {
    const getCompletionColor = (percent) => {
      if (percent >= 80) return 'from-green-500 to-emerald-600';
      if (percent >= 60) return 'from-bg-primary to-cyan-600';
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
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-bg-primary">
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
          <div className="mt-4 p-3 bg-bg-primary/10 rounded-lg">
            <p className="text-sm text-bg-primary">
              <strong>Tip:</strong> {completion < 50 ? 'Add your experience, company, and drugs to increase visibility' :
                completion < 80 ? 'Upload a profile photo and add qualifications to stand out' :
                  'You\'re almost there! Complete all sections for best results'}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Enhanced Profile Header
  const EnhancedProfileHeader = () => (
    <div className="bg-gradient-to-r from-bg-primary to-bg-primary/80 p-6 text-white relative">
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
            className="bg-white text-bg-primary hover:text-white hover:bg-bg-primary/10 px-4 py-2 rounded-lg flex items-center"
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

  if (loadingProfile) {
    return <FullPageLoader />;
  }

  const isMedical = isMedicalProfessional();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-bg-primary/5 py-8 px-4 sm:px-6 lg:px-8">
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
                <FiUser className="mr-2 text-bg-primary" /> Personal Information
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
                <div>
                  <p className="text-sm text-gray-500">Qualification</p>
                  <p className="font-medium">{profile.qualification || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Job Title</p>
                  <p className="font-medium">{profile.job_title || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Job Sub Title</p>
                  <p className="font-medium">{profile.job_sub_title || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center">
                <FiBriefcase className="mr-2 text-bg-primary" /> Professional Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Specializations</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.specializations?.length > 0 ? (
                      profile.specializations.map((spec) => (
                        <span
                          key={spec.id}
                          className="bg-bg-primary/10 text-bg-primary text-xs px-2 py-1 rounded"
                        >
                          {spec.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">None</p>
                    )}
                  </div>
                </div>

                {/* Show Drugs only if NOT medical professional */}
                {!isMedical && (
                  <div>
                    <p className="text-sm text-gray-500">Drugs</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.drugs?.length > 0 ? (
                        profile.drugs.map((drug) => (
                          <span
                            key={drug.id}
                            className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                          >
                            {drug.name}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">None</p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">{profile.experience || "Not provided"}</p>
                </div>

                {/* Show Company for non-medical, Hospital/Clinic for medical */}
                {isMedical ? (
                  <div>
                    <p className="text-sm text-gray-500">Hospital/Clinic</p>
                    <p className="font-medium">
                      {profile.hospital_clinic_name || "Not provided"}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium">
                      {profile.company ? profile.company.name : "Not provided"}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">Employment Period</p>
                  <p className="font-medium">
                    {profile.start_date && profile.end_date
                      ? `${new Date(profile.start_date).toLocaleDateString()} - ${new Date(profile.end_date).toLocaleDateString()}`
                      : "Not provided"
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expected Salary</p>
                  <p className="font-medium">
                    {profile.expected_salary
                      ? `${profile.expected_salary.toLocaleString()} EGP`
                      : "Not provided"
                    }
                  </p>
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
                <FiFileText className="mr-2 text-bg-primary" /> CV Documents
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

                {cvFiles.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Selected CVs:</p>
                    <div className="space-y-2">
                      {cvFiles.map((cv, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex items-center truncate">
                            <FiFileText className="text-bg-primary mr-2 flex-shrink-0" />
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
                      disabled={loadingPost || cvFiles.length === 0}
                      className="mt-4 bg-bg-primary hover:bg-bg-primary/90 text-white font-semibold py-2 px-6 rounded-full"
                    >
                      {loadingPost ? "Uploading..." : `Upload ${cvFiles.length} CV(s)`}
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
                    className="cursor-pointer bg-bg-primary/10 text-bg-primary hover:bg-bg-primary/20 px-4 py-2 rounded-lg flex items-center"
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

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        profile={profile}
        isMedicalProfessional={isMedicalProfessional()}
        onProfileUpdate={refetchProfile}
      />

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