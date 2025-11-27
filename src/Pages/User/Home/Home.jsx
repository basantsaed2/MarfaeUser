"use client";
import React, { useState, useEffect } from "react";
import Hero from "./Hero";
import Features from "./Features";
import Partners from "./Partners";
import Contact from "./Contact";
import Reviews from "./Reviews";
import Footer from "./Footer";
import JobsSection from "./JobsSection";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../../Store/authSlice";
import { toast } from "react-toastify";
import DoctorsSection from "./DoctorsSection";
import Plans from "../Plans/Plans";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");

  useEffect(() => {
    checkCrossDomainAuth();
    
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [navigate]);

  const decodeData = (encodedData) => {
    try {
      return JSON.parse(decodeURIComponent(escape(atob(encodedData))));
    } catch (error) {
      throw new Error("Invalid authentication data");
    }
  };

  const checkCrossDomainAuth = () => {
    const existingToken = localStorage.getItem("token");
    const existingUser = localStorage.getItem("user");
    
    if (existingToken && existingUser) {
      console.log("User already logged in");
      return;
    }

    const authType = searchParams.get('auth');
    const encodedData = searchParams.get('d');
    
    if (authType === 'data' && encodedData) {
      processAuthData(encodedData);
    }
  };

  const processAuthData = async (encodedData) => {
    setIsProcessingAuth(true);
    
    try {
      const authData = decodeData(encodedData);
      
      console.log("Received auth data:", authData);

      if (!authData.token || !authData.user) {
        throw new Error("Invalid authentication data: missing token or user");
      }

      if (typeof authData.token !== 'string' || !authData.token.includes('|')) {
        throw new Error("Invalid token format");
      }

      if (!authData.user.id) {
        throw new Error("Invalid user data: missing user ID");
      }

      localStorage.setItem("token", authData.token);
      localStorage.setItem("user", JSON.stringify(authData));

      dispatch(setUser(authData));

      toast.success("Successfully logged in from employer account!");

      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);

      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error('Error processing auth data:', error);
      toast.error(`Authentication failed: ${error.message}`);
      
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    } finally {
      setIsProcessingAuth(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (isProcessingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bg-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Authentication</h2>
          <p className="text-gray-600">Logging you in from employer account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      
      {/* Tabs Section */}
      <div className="bg-white py-8">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-full p-1 flex">
              <button
                onClick={() => setActiveTab("jobs")}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === "jobs"
                    ? "bg-bg-primary text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Jobs
              </button>
              <button
                onClick={() => setActiveTab("doctors")}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === "doctors"
                    ? "bg-bg-primary text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Doctors
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {activeTab === "jobs" && <JobsSection />}
            {activeTab === "doctors" && <DoctorsSection />}
          </div>
      </div>

      <Plans/>

      <Features />
      <Partners />
      {/* <Contact /> */}
      <Reviews />
      <Footer />

      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-bg-primary text-white p-3 rounded-full shadow-lg hover:bg-bg-secondary transition-colors duration-300"
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Home;