"use client";
import React, { useState, useEffect } from "react";
import { useGet } from "@/Hooks/UseGet";
import { useChangeState } from "@/Hooks/useChangeState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FiUser,
  FiCamera,
  FiX,
} from "react-icons/fi";

const animatedComponents = makeAnimated();

const EditProfileDialog = ({ open, onOpenChange, profile, isMedicalProfessional, onProfileUpdate }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // API calls for data
  const {
    refetch: refetchSpecialization,
    loading: loadingSpecialization,
    data: specializationData,
  } = useGet({ url: `${apiUrl}/user/specializations/get` });

  const {
    refetch: refetchRegion,
    loading: loadingRegion,
    data: regionData,
  } = useGet({ url: `${apiUrl}/city-country` });

  const {
    refetch: refetchCompanies,
    loading: loadingCompanies,
    data: companiesData,
  } = useGet({ url: `${apiUrl}/user/getCompanies` });

  const {
    refetch: refetchDrugs,
    loading: loadingDrugs,
    data: drugsData,
  } = useGet({ url: `${apiUrl}/user/getDrugs` });

  // New API call for job titles and subtitles
  const {
    refetch: refetchJobTitles,
    loading: loadingJobTitles,
    data: jobTitlesData,
  } = useGet({ url: `${apiUrl}/user/job-titles-subtitles` });

  const { changeState, loading: loadingChange, responseChange } = useChangeState();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    user_address: "",
    age: "",
    specialization: [],
    drug: [],
    company_id: "",
    job_title_id: "",
    job_sub_title_id: "",
    start_date: "",
    end_date: "",
    qualification: "",
    expected_salary: "",
    country_id: "",
    city_id: "",
    experience: "",
    image: null,
    image_link: "",
    hospital_clinic_name: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedJobSubTitle, setSelectedJobSubTitle] = useState("");
  const [jobTitles, setJobTitles] = useState([]);
  const [jobSubTitles, setJobSubTitles] = useState([]);
  const [filteredJobSubTitles, setFilteredJobSubTitles] = useState([]);
  const imageInputRef = React.useRef(null);

  // Format options for Select
  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [experienceOptions, setExperienceOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [drugOptions, setDrugOptions] = useState([]);
  const [jobTitleOptions, setJobTitleOptions] = useState([]);
  const [jobSubTitleOptions, setJobSubTitleOptions] = useState([]);

  useEffect(() => {
    if (open) {
      refetchSpecialization();
      refetchRegion();
      refetchCompanies();
      refetchDrugs();
      refetchJobTitles();
    }
  }, [open, refetchSpecialization, refetchRegion, refetchCompanies, refetchDrugs, refetchJobTitles]);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        user_address: profile.user_address || "",
        age: profile.age ? String(profile.age) : "",
        specialization: profile.specializations?.map((spec) => spec.id.toString()) || [],
        drug: profile.drugs?.map((drug) => drug.id.toString()) || [],
        company_id: profile.company_id || "",
        job_title_id: profile.job_title_id || "",
        job_sub_title_id: profile.job_sub_title_id || "",
        start_date: profile.start_date || "",
        end_date: profile.end_date || "",
        qualification: profile.qualification || "",
        expected_salary: profile.expected_salary ? String(profile.expected_salary) : "",
        country_id: profile.country_id || "",
        city_id: profile.city_id || "",
        experience: profile.experience || "",
        image: null,
        image_link: profile.image_link || "",
        hospital_clinic_name: profile.hospital_clinic_name || "",
      });

      if (profile.country_id) setSelectedCountry(profile.country_id.toString());
      if (profile.city_id) setSelectedCity(profile.city_id.toString());
      if (profile.experience) setSelectedExperience(profile.experience);
      if (profile.company_id) setSelectedCompany(profile.company_id.toString());
      if (profile.job_title_id) setSelectedJobTitle(profile.job_title_id.toString());
      if (profile.job_sub_title_id) setSelectedJobSubTitle(profile.job_sub_title_id.toString());
    }
  }, [profile]);

  // Load job titles and subtitles
  useEffect(() => {
    if (jobTitlesData) {
      // Assuming the API returns { job_titles: [], job_sub_titles: [] }
      if (jobTitlesData.job_titles) {
        const formattedJobTitles = jobTitlesData.job_titles.map(title => ({
          value: title.id.toString(),
          label: title.name,
        }));
        setJobTitles(jobTitlesData.job_titles);
        setJobTitleOptions(formattedJobTitles);
      }

      if (jobTitlesData.job_sub_titles) {
        const formattedSubTitles = jobTitlesData.job_sub_titles.map(subTitle => ({
          value: subTitle.id.toString(),
          label: subTitle.sub_title_name || subTitle.name,
          job_title_id: subTitle.job_title_id.toString(),
        }));
        setJobSubTitles(formattedSubTitles);
        setJobSubTitleOptions(formattedSubTitles);
      }
    }
  }, [jobTitlesData]);

  // Filter job subtitles when job title changes
  useEffect(() => {
    if (selectedJobTitle && jobSubTitles.length > 0) {
      const filtered = jobSubTitles.filter(
        (subTitle) => subTitle.job_title_id === selectedJobTitle
      );
      setFilteredJobSubTitles(filtered);
      // Clear selected subtitle when title changes
      setSelectedJobSubTitle("");
      setFormData(prev => ({ ...prev, job_sub_title_id: "" }));
    } else {
      setFilteredJobSubTitles([]);
      setSelectedJobSubTitle("");
      setFormData(prev => ({ ...prev, job_sub_title_id: "" }));
    }
  }, [selectedJobTitle, jobSubTitles]);

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

  useEffect(() => {
    if (specializationData && specializationData.specializations) {
      const formattedSpecializations = specializationData.specializations.map(spec => ({
        value: spec.id.toString(),
        label: spec.name
      }));
      setSpecializationOptions(formattedSpecializations);

      if (specializationData.experince) {
        const formattedExperiences = specializationData.experince.map(exp => ({
          value: exp,
          label: exp
        }));
        setExperienceOptions(formattedExperiences);
      }
    }
  }, [specializationData]);

  useEffect(() => {
    if (companiesData && companiesData.companies) {
      const formattedCompanies = companiesData.companies.map(company => ({
        value: company.id.toString(),
        label: company.name
      }));
      setCompanyOptions(formattedCompanies);
    }
  }, [companiesData]);

  useEffect(() => {
    if (drugsData && drugsData.drugs) {
      const formattedDrugs = drugsData.drugs.map(drug => ({
        value: drug.id.toString(),
        label: drug.name
      }));
      setDrugOptions(formattedDrugs);
    }
  }, [drugsData]);

  // Image Upload Handler
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormErrors(prev => ({ ...prev, image: 'Please upload an image file (JPEG, PNG, etc.)' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result;

      setFormData(prev => ({
        ...prev,
        image: base64String,
        image_link: base64String
      }));
      setFormErrors(prev => ({ ...prev, image: null }));
    };

    reader.onerror = () => {
      setFormErrors(prev => ({ ...prev, image: 'Failed to read the image file' }));
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      image_link: profile.image_link || ""
    }));
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const triggerImageUpload = () => {
    imageInputRef.current?.click();
  };

  // Handlers for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" || name === "expected_salary" ? String(value) : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleCountryChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setSelectedCountry(value);
    setFormData((prev) => ({ ...prev, country_id: value, city_id: "" }));
    setSelectedCity("");
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

  const handleCompanyChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setSelectedCompany(value);
    setFormData((prev) => ({ ...prev, company_id: value }));
    setFormErrors((prev) => ({ ...prev, company_id: null }));
  };

  const handleDrugChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData((prev) => ({ ...prev, drug: values }));
    setFormErrors((prev) => ({ ...prev, drug: null }));
  };

  const handleJobTitleChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setSelectedJobTitle(value);
    setFormData((prev) => ({ ...prev, job_title_id: value }));
    setFormErrors((prev) => ({ ...prev, job_title_id: null }));
  };

  const handleJobSubTitleChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setSelectedJobSubTitle(value);
    setFormData((prev) => ({ ...prev, job_sub_title_id: value }));
    setFormErrors((prev) => ({ ...prev, job_sub_title_id: null }));
  };

  // Get selected values for Select components
  const getSelectedCountry = () => countryOptions.find(option => option.value === selectedCountry) || null;
  const getSelectedCity = () => cityOptions.find(option => option.value === selectedCity) || null;
  const getSelectedExperience = () => experienceOptions.find(option => option.value === selectedExperience) || null;
  const getSelectedCompany = () => companyOptions.find(option => option.value === selectedCompany) || null;
  const getSelectedJobTitle = () => jobTitleOptions.find(option => option.value === selectedJobTitle) || null;
  const getSelectedJobSubTitle = () => filteredJobSubTitles.find(option => option.value === selectedJobSubTitle) || null;
  const getSelectedSpecializations = () => specializationOptions.filter(option => formData.specialization.includes(option.value));
  const getSelectedDrugs = () => drugOptions.filter(option => formData.drug.includes(option.value));

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.age) errors.age = "Age is required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const isMedical = isMedicalProfessional;

    const payload = {
      ...(formData.first_name && { first_name: formData.first_name }),
      ...(formData.last_name && { last_name: formData.last_name }),
      ...(formData.email && { email: formData.email }),
      ...(formData.phone && { phone: formData.phone }),
      ...(formData.user_address && { user_address: formData.user_address }),
      ...(formData.age && { age: parseInt(formData.age) }),
      ...(formData.specialization.length > 0 && {
        specialization: formData.specialization.map(id => parseInt(id))
      }),
      ...(formData.job_title_id && { job_title_id: parseInt(formData.job_title_id) }),
      ...(formData.job_sub_title_id && { job_sub_title_id: parseInt(formData.job_sub_title_id) }),
      ...(formData.start_date && { start_date: formData.start_date }),
      ...(formData.end_date && { end_date: formData.end_date }),
      ...(formData.qualification && { qualification: formData.qualification }),
      ...(formData.expected_salary && {
        expected_salary: parseInt(formData.expected_salary)
      }),
      ...(formData.country_id && { country_id: parseInt(formData.country_id) }),
      ...(formData.city_id && { city_id: parseInt(formData.city_id) }),
      ...(formData.experience && { experience: formData.experience }),
    };

    // Add conditional fields based on job type
    if (isMedical) {
      // For medical professionals: remove company and drugs, add hospital_clinic_name
      if (formData.hospital_clinic_name) {
        payload.hospital_clinic_name = formData.hospital_clinic_name;
      }
    } else {
      // For non-medical professionals: add company and drugs
      if (formData.company_id) {
        payload.company_id = parseInt(formData.company_id);
      }
      if (formData.drug.length > 0) {
        payload.drug = formData.drug.map(id => parseInt(id));
      }
    }

    // Add image to payload if uploaded
    if (formData.image) {
      payload.image = formData.image;
    }


    try {
      await changeState(
        `${apiUrl}/user/profile/update`,
        "Profile Updated Successfully.",
        payload,
      );
      onProfileUpdate();
      onOpenChange(false);
      setFormErrors({});
      setFormData((prev) => ({
        ...prev,
        image: null,
      }));
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error);
      setFormErrors(error.response?.data?.errors || { general: "Failed to update profile" });
    }
  };

  const isMedical = isMedicalProfessional;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-bg-primary">Edit Profile</DialogTitle>
          <DialogDescription className="text-gray-600">
            Update your personal and professional information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {formErrors.general && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">{formErrors.general}</div>
          )}

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="profile_image" className="text-sm font-medium text-gray-700">Profile Image</Label>
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
                  className="cursor-pointer bg-bg-primary/10 text-bg-primary hover:bg-bg-primary/20 px-4 py-2 rounded-lg inline-flex items-center"
                >
                  <FiCamera className="mr-2" />
                  {formData.image_link ? 'Change Image' : 'Upload Image'}
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG, GIF (max 5MB). Image will be sent as base64.
                </p>
                {formErrors.image && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.image}</p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full focus:ring-bg-primary focus:border-bg-primary"
              />
              {formErrors.first_name && (
                <p className="text-sm text-red-600">{formErrors.first_name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full focus:ring-bg-primary focus:border-bg-primary"
              />
              {formErrors.last_name && (
                <p className="text-sm text-red-600">{formErrors.last_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="off"
                className="w-full focus:ring-bg-primary focus:border-bg-primary"
              />
              {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full focus:ring-bg-primary focus:border-bg-primary"
              />
              {formErrors.phone && <p className="text-sm text-red-600">{formErrors.phone}</p>}
            </div>
          </div>


          {/* Professional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium text-gray-700">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                required
                className="w-full focus:ring-bg-primary focus:border-bg-primary"
              />
              {formErrors.age && <p className="text-sm text-red-600">{formErrors.age}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-sm font-medium text-gray-700">Experience</Label>
              <Select
                value={getSelectedExperience()}
                onChange={handleExperienceChange}
                options={experienceOptions}
                placeholder="Select experience level"
                className="react-select-container"
                classNamePrefix="react-select"
                isClearable
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                  control: (provided) => ({
                    ...provided,
                    borderColor: '#d1d5db',
                    '&:hover': {
                      borderColor: 'var(--color-bg-primary)',
                    },
                    '&:focus-within': {
                      borderColor: 'var(--color-bg-primary)',
                      boxShadow: '0 0 0 2px var(--color-bg-primary)/20',
                    },
                  }),
                }}
              />
              {formErrors.experience && (
                <p className="text-sm text-red-600">{formErrors.experience}</p>
              )}
            </div>
          </div>

          {/* Job Titles and Sub Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job_title" className="text-sm font-medium text-gray-700">Job Title</Label>
              <Select
                value={getSelectedJobTitle()}
                onChange={handleJobTitleChange}
                options={jobTitleOptions}
                placeholder="Select job title"
                isLoading={loadingJobTitles}
                className="react-select-container"
                classNamePrefix="react-select"
                isClearable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderColor: '#d1d5db',
                    '&:hover': {
                      borderColor: 'var(--color-bg-primary)',
                    },
                  }),
                }}
              />
              {formErrors.job_title_id && (
                <p className="text-sm text-red-600">{formErrors.job_title_id}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="job_sub_title" className="text-sm font-medium text-gray-700">Job Sub Title</Label>
              <Select
                value={getSelectedJobSubTitle()}
                onChange={handleJobSubTitleChange}
                options={filteredJobSubTitles}
                placeholder={selectedJobTitle ? "Select job sub title" : "Select job title first"}
                isDisabled={!selectedJobTitle || filteredJobSubTitles.length === 0}
                className="react-select-container"
                classNamePrefix="react-select"
                isClearable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderColor: '#d1d5db',
                    '&:hover': {
                      borderColor: 'var(--color-bg-primary)',
                    },
                  }),
                }}
              />
              {formErrors.job_sub_title_id && (
                <p className="text-sm text-red-600">{formErrors.job_sub_title_id}</p>
              )}
            </div>
          </div>

          {/* Employment Information */}
          <div className="border-t border-b pb-6 pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Employment Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Show Company for non-medical, Hospital/Clinic for medical */}
              {isMedical ? (
                <div className="space-y-2">
                  <Label htmlFor="hospital_clinic_name" className="text-sm font-medium text-gray-700">Hospital/Clinic Name</Label>
                  <Input
                    id="hospital_clinic_name"
                    name="hospital_clinic_name"
                    value={formData.hospital_clinic_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Cairo Medical Center"
                    className="w-full focus:ring-bg-primary focus:border-bg-primary"
                  />
                  {formErrors.hospital_clinic_name && (
                    <p className="text-sm text-red-600">{formErrors.hospital_clinic_name}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium text-gray-700">Company</Label>
                  <Select
                    value={getSelectedCompany()}
                    onChange={handleCompanyChange}
                    options={companyOptions}
                    placeholder="Select a company"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isClearable
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        borderColor: '#d1d5db',
                        '&:hover': {
                          borderColor: 'var(--color-bg-primary)',
                        },
                      }),
                    }}
                  />
                  {formErrors.company_id && (
                    <p className="text-sm text-red-600">{formErrors.company_id}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="qualification" className="text-sm font-medium text-gray-700">Qualification</Label>
                <Input
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor of Pharmacy"
                  className="w-full focus:ring-bg-primary focus:border-bg-primary"
                />
                {formErrors.qualification && (
                  <p className="text-sm text-red-600">{formErrors.qualification}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-sm font-medium text-gray-700">Start Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full focus:ring-bg-primary focus:border-bg-primary"
                />
                {formErrors.start_date && (
                  <p className="text-sm text-red-600">{formErrors.start_date}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-sm font-medium text-gray-700">End Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full focus:ring-bg-primary focus:border-bg-primary"
                />
                {formErrors.end_date && (
                  <p className="text-sm text-red-600">{formErrors.end_date}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected_salary" className="text-sm font-medium text-gray-700">Expected Salary (EGP)</Label>
            <Input
              id="expected_salary"
              name="expected_salary"
              type="number"
              value={formData.expected_salary}
              onChange={handleInputChange}
              placeholder="e.g., 10000"
              className="w-full focus:ring-bg-primary focus:border-bg-primary"
            />
            {formErrors.expected_salary && (
              <p className="text-sm text-red-600">{formErrors.expected_salary}</p>
            )}
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
              <Select
                value={getSelectedCountry()}
                onChange={handleCountryChange}
                options={countryOptions}
                placeholder="Select a country"
                className="react-select-container"
                classNamePrefix="react-select"
                isClearable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderColor: '#d1d5db',
                    '&:hover': {
                      borderColor: 'var(--color-bg-primary)',
                    },
                  }),
                }}
              />
              {formErrors.country_id && (
                <p className="text-sm text-red-600">{formErrors.country_id}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
              <Select
                value={getSelectedCity()}
                onChange={handleCityChange}
                options={cityOptions}
                placeholder="Select a city"
                isDisabled={!selectedCountry}
                className="react-select-container"
                classNamePrefix="react-select"
                isClearable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderColor: '#d1d5db',
                    '&:hover': {
                      borderColor: 'var(--color-bg-primary)',
                    },
                  }),
                }}
              />
              {formErrors.city_id && <p className="text-sm text-red-600">{formErrors.city_id}</p>}
            </div>
          </div>

          {/* Multi-select Fields */}
          <div className="space-y-2">
            <Label htmlFor="specializations" className="text-sm font-medium text-gray-700">Specializations</Label>
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
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderColor: '#d1d5db',
                  '&:hover': {
                    borderColor: 'var(--color-bg-primary)',
                  },
                }),
              }}
            />
            {formErrors.specialization && (
              <p className="text-sm text-red-600">{formErrors.specialization}</p>
            )}
          </div>

          {/* Show Drugs only if NOT medical professional */}
          {!isMedical && (
            <div className="space-y-2">
              <Label htmlFor="drugs" className="text-sm font-medium text-gray-700">Drugs</Label>
              <Select
                value={getSelectedDrugs()}
                onChange={handleDrugChange}
                options={drugOptions}
                placeholder="Select drugs"
                isMulti
                closeMenuOnSelect={false}
                components={animatedComponents}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderColor: '#d1d5db',
                    '&:hover': {
                      borderColor: 'var(--color-bg-primary)',
                    },
                  }),
                }}
              />
              {formErrors.drug && (
                <p className="text-sm text-red-600">{formErrors.drug}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="user_address" className="text-sm font-medium text-gray-700">Address</Label>
            <Input
              id="user_address"
              name="user_address"
              value={formData.user_address}
              onChange={handleInputChange}
              placeholder="Enter your full address"
              className="w-full focus:ring-bg-primary focus:border-bg-primary"
            />
            {formErrors.user_address && (
              <p className="text-sm text-red-600">{formErrors.user_address}</p>
            )}
          </div>

          <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto border-bg-primary text-bg-primary hover:bg-bg-primary/10"
              disabled={loadingChange}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loadingChange}
              className="w-full text-white sm:w-auto bg-bg-primary hover:bg-bg-primary/90"
            >
              {loadingChange ? "Updating..." : "Update Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;