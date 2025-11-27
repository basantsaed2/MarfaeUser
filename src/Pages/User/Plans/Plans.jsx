import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Crown, Zap, Shield, Target } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGet } from "@/Hooks/UseGet";
import { usePost } from "@/Hooks/UsePost";
import FullPageLoader from "@/components/Loading";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";

const Plans = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const {
        refetch: refetchPlans,
        loading: loadingPlans,
        data: dataPlans
    } = useGet({
        url: `${apiUrl}/user/getPlans`,
    });

    const {
        refetch: refetchPaymentMethod,
        loading: loadingPaymentMethod,
        data: dataPaymentMethod
    } = useGet({
        url: `${apiUrl}/user/get-payment-methods`,
    });

    const {
        postData,
        loading: loadingPost,
        response
    } = usePost({
        url: `${apiUrl}/user/make-plan-payment`,
    });

    const [plans, setPlans] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("monthly");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [selectedReceiptImage, setSelectedReceiptImage] = useState(null);
    const [receiptImageBase64, setReceiptImageBase64] = useState(null);

    useEffect(() => {
        refetchPlans();
        refetchPaymentMethod();
    }, []);

    useEffect(() => {
        if (dataPlans?.plans) {
            const formattedPlans = dataPlans.plans.map((plan) => ({
                id: plan.id,
                name: plan.name,
                description: plan.description,
                price: plan.price,
                price_after_discount: plan.price_after_discount || plan.price,
                status: plan.status,
                type: plan.type,
                features: plan.features,
                created_at: plan.created_at,
                updated_at: plan.updated_at,
                top_picked: plan.top_picked,
                is_my_plan: plan.is_my_plan,
                job_categories: Array.isArray(plan.job_categories)
                    ? plan.job_categories.map((category) => ({
                        id: category?.id,
                        name: category?.name || "—",
                    }))
                    : [],
            }));
            setPlans(formattedPlans);
        }
    }, [dataPlans]);

    useEffect(() => {
        if (dataPaymentMethod?.payment_methods) {
            const formattedMethods = dataPaymentMethod.payment_methods.map((method) => ({
                id: method.id,
                name: method.name,
                account: method.account,
                image: method.image_link,
            }));
            setPaymentMethods(formattedMethods);
        }
    }, [dataPaymentMethod]);

    useEffect(() => {
        if (response) {
            if (response.status === 200) {
                toast.success("Plan purchase request sent. Please wait for admin approval.");
                setIsModalOpen(false);
                setSelectedPaymentMethod(null);
                setSelectedReceiptImage(null);
                setReceiptImageBase64(null);
                refetchPlans();
            } else {
                toast.error(response.message || "Failed to submit payment. Please try again.");
            }
        }
    }, [response]);

    const getFeatureName = (key) => {
        const featureNames = {
            'cv_number': 'CV Access',
            'featured_job': 'Featured Jobs',
            'duration': 'Duration (days)',
            'support': 'Support',
            'analytics': 'Analytics Dashboard',
            'candidate_messages': 'Candidate Messages',
            'company_profile': 'Company Profile'
        };

        return featureNames[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (planId, paymentMethodId) => {
        const body = new FormData();
        body.append("plan_id", planId);
        body.append("payment_method_id", paymentMethodId);

        if (receiptImageBase64) {
            body.append("receipt_image", receiptImageBase64);
        }

        await postData(body);
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedReceiptImage(file);
            try {
                const base64String = await convertToBase64(file);
                setReceiptImageBase64(base64String);
            } catch (error) {
                toast.error("Failed to process image. Please try again.");
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPaymentMethod(null);
        setSelectedReceiptImage(null);
        setReceiptImageBase64(null);
    };

    const getPlanIcon = (planName) => {
        const name = planName.toLowerCase();
        if (name.includes('premium') || name.includes('pro')) return <Crown className="w-6 h-6" />;
        if (name.includes('business') || name.includes('enterprise')) return <Shield className="w-6 h-6" />;
        if (name.includes('starter') || name.includes('basic')) return <Target className="w-6 h-6" />;
        return <Zap className="w-6 h-6" />;
    };

    const PlanCard = ({ plan }) => {
        const isCurrentPlan = plan.is_my_plan === true;
        const discount = plan.price_after_discount < plan.price ?
            Math.round(((plan.price - plan.price_after_discount) / plan.price) * 100) : 0;

        return (
            <div
                className={`relative flex flex-col justify-between bg-white rounded-2xl shadow-xl p-8 border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${isCurrentPlan
                    ? "border-bg-primary shadow-bg-primary/20 ring-2 ring-bg-primary/30"
                    : plan.top_picked === 1
                        ? "border-bg-primary shadow-bg-primary/20 ring-2 ring-bg-primary/20"
                        : "border-gray-100 hover:border-bg-primary/50"
                    } w-full max-w-sm mx-auto group overflow-hidden`}
            >
                {/* Background Gradient */}
                <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500 ${plan.top_picked === 1 ? 'bg-gradient-to-br from-bg-primary to-blue-600' : 'bg-gradient-to-br from-bg-primary to-blue-400'
                    }`}></div>

                {/* Top badges */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="flex items-center gap-2">
                        {getPlanIcon(plan.name)}
                        <span className="text-lg font-bold text-bg-primary">
                            {plan.name}
                        </span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {isCurrentPlan && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-bg-primary text-white flex items-center shadow-lg">
                                <CheckCircle className="w-3 h-3 mr-1" /> Current Plan
                            </span>
                        )}
                        {plan.top_picked === 1 && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-bg-primary text-white flex items-center shadow-lg">
                                <Star className="w-3 h-3 mr-1" /> Popular
                            </span>
                        )}
                        {discount > 0 && (
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                                Save {discount}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Price Section */}
                <div className="text-center mb-8 relative z-10">
                    <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold text-gray-900">{plan.price_after_discount}</span>
                        <span className="text-bg-primary font-semibold">EGP</span>
                    </div>
                    {plan.price_after_discount < plan.price && (
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="text-lg text-gray-400 line-through">{plan.price} EGP</span>
                        </div>
                    )}
                    <p className="text-sm text-gray-500 mt-2">per {plan.type}</p>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8 relative z-10 flex-1">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                    {Object.entries(plan.features)
                        .filter(([key]) => key !== 'job_add')
                        .map(([key, value], index) => (
                            <div key={index} className="flex items-center gap-3 group/item">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-bg-primary/10 flex items-center justify-center">
                                    <CheckCircle className="w-3 h-3 text-bg-primary" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-sm font-medium text-gray-700">
                                        {getFeatureName(key)}
                                    </span>
                                    <span className="block text-xs text-gray-500">
                                        {typeof value === "object" ? value.value || "—" : value}
                                    </span>
                                </div>
                            </div>
                        ))}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>

                {/* Buy Now Button */}
                <div className="relative z-10">
                    <Button
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${isCurrentPlan
                            ? "bg-gray-400 cursor-not-allowed border border-gray-500"
                            : "bg-gradient-to-r from-bg-primary to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            }`}
                        onClick={() => {
                            if (!isCurrentPlan) {
                                setSelectedPlan(plan);
                                setIsModalOpen(true);
                            }
                        }}
                        disabled={isCurrentPlan}
                    >
                        {isCurrentPlan ? (
                            "Active Plan"
                        ) : (
                            <>
                                <Zap className="w-4 h-4 mr-2" />
                                Get Started
                            </>
                        )}
                    </Button>
                </div>
            </div>
        );
    };

    if (loadingPlans || loadingPaymentMethod) {
        return <FullPageLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Choose Your Perfect Plan
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Select the plan that fits your needs and unlock powerful recruitment features
                    </p>
                </div>

                {/* Enhanced Yearly/Monthly Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100">
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <Button
                                variant="ghost"
                                onClick={() => setActiveTab("monthly")}
                                className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 relative ${activeTab === "monthly"
                                    ? "bg-white text-bg-primary shadow-md"
                                    : "text-gray-600 hover:text-bg-primary"
                                    }`}
                            >
                                Monthly
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setActiveTab("yearly")}
                                className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 relative ${activeTab === "yearly"
                                    ? "bg-white text-bg-primary shadow-md"
                                    : "text-gray-600 hover:text-bg-primary"
                                    }`}
                            >
                                Yearly
                                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full rotate-3 transform shadow-sm">
                                    Save 20%
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {plans
                        .filter((plan) => plan.type === activeTab)
                        .map((plan) => (
                            <PlanCard key={plan.id} plan={plan} />
                        ))}
                </div>

                {/* Features Section */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Our Platform?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Experience the difference with our comprehensive recruitment solutions
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 group hover:transform hover:scale-105 transition-all duration-300">
                            <div className="w-16 h-16 bg-bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-bg-primary/20 transition-colors">
                                <Shield className="w-8 h-8 text-bg-primary" />
                            </div>
                            <h3 className="font-bold text-lg mb-3 text-gray-900">Trusted Platform</h3>
                            <p className="text-gray-600 text-sm">Secure and reliable recruitment platform trusted by thousands of companies</p>
                        </div>
                        <div className="text-center p-6 group hover:transform hover:scale-105 transition-all duration-300">
                            <div className="w-16 h-16 bg-bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-bg-primary/20 transition-colors">
                                <Target className="w-8 h-8 text-bg-primary" />
                            </div>
                            <h3 className="font-bold text-lg mb-3 text-gray-900">Precision Matching</h3>
                            <p className="text-gray-600 text-sm">Advanced algorithms to match you with the perfect candidates for your needs</p>
                        </div>
                        <div className="text-center p-6 group hover:transform hover:scale-105 transition-all duration-300">
                            <div className="w-16 h-16 bg-bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-bg-primary/20 transition-colors">
                                <Zap className="w-8 h-8 text-bg-primary" />
                            </div>
                            <h3 className="font-bold text-lg mb-3 text-gray-900">Fast Results</h3>
                            <p className="text-gray-600 text-sm">Quick and efficient hiring process to get you the right talent faster</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-white rounded-2xl p-6 max-w-md mx-auto shadow-2xl border-0">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900 text-center mb-2">
                            Complete Your Purchase
                        </DialogTitle>
                        <p className="text-center text-gray-600 text-sm">
                            for <span className="font-semibold text-bg-primary">{selectedPlan?.name}</span> plan
                        </p>
                    </DialogHeader>

                    {!selectedPaymentMethod ? (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.id}
                                    className="flex items-center p-4 bg-white rounded-xl transition-all duration-200 cursor-pointer border-2 border-gray-100 hover:border-bg-primary hover:shadow-lg"
                                    onClick={() => setSelectedPaymentMethod(method)}
                                >
                                    {method.image && (
                                        <img
                                            src={method.image}
                                            alt={method.name}
                                            className="w-12 h-12 rounded-lg mr-4 object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{method.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{method.account}</p>
                                    </div>
                                    <Button className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors shrink-0">
                                        Select
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Selected Payment Method */}
                            <div className="flex items-center p-4 bg-bg-primary/5 rounded-xl border-2 border-bg-primary">
                                {selectedPaymentMethod.image && (
                                    <img
                                        src={selectedPaymentMethod.image}
                                        alt={selectedPaymentMethod.name}
                                        className="w-12 h-12 rounded-lg mr-4 object-cover"
                                    />
                                )}
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{selectedPaymentMethod.name}</p>
                                    <p className="text-xs text-gray-600">{selectedPaymentMethod.account}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
                                    onClick={() => setSelectedPaymentMethod(null)}
                                >
                                    Change
                                </Button>
                            </div>

                            {/* Upload Receipt */}
                            <div>
                                <label className="block font-semibold text-gray-800 mb-3 text-sm">
                                    Upload Payment Receipt
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-bg-primary transition-colors cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="receipt-upload"
                                    />
                                    <label htmlFor="receipt-upload" className="cursor-pointer">
                                        <div className="w-12 h-12 bg-bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-bg-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {selectedReceiptImage ? selectedReceiptImage.name : 'Click to upload receipt'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                                    </label>
                                </div>
                            </div>

                            {/* Confirm Button */}
                            <Button
                                className="w-full bg-gradient-to-r from-bg-primary to-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleSubmit(selectedPlan.id, selectedPaymentMethod.id)}
                                disabled={!selectedReceiptImage || loadingPost}
                            >
                                {loadingPost ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    "Confirm Payment"
                                )}
                            </Button>
                        </div>
                    )}

                    <DialogFooter className="mt-6">
                        <Button
                            variant="outline"
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-xl"
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Plans;