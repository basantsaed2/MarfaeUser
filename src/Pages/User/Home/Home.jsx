// "use client";
// import React, { useState, useEffect } from "react";
// import Hero from "./Hero";
// import Features from "./Features";
// import Partners from "./Partners";
// import Contact from "./Contact";
// import Reviews from "./Reviews";
// import Footer from "./Footer";
// import JobsSection from "./JobsSection";

// const Home = () => {
//   const [isVisible, setIsVisible] = useState(false);

//   // Show button when user scrolls down 300px
//   useEffect(() => {
//     const toggleVisibility = () => {
//       if (window.scrollY > 300) {
//         setIsVisible(true);
//       } else {
//         setIsVisible(false);
//       }
//     };

//     window.addEventListener("scroll", toggleVisibility);

//     // Cleanup event listener on component unmount
//     return () => window.removeEventListener("scroll", toggleVisibility);
//   }, []);

//   // Scroll to top function
//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Hero />
//       <JobsSection />
//       <Features />
//       <Partners />
//       {/* <Contact /> */}
//       <Reviews />
//       <Footer />

//       {/* Scroll to Top Button */}
//       {isVisible && (
//         <button
//           onClick={scrollToTop}
//           className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
//           aria-label="Scroll to top"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M5 10l7-7m0 0l7 7m-7-7v18"
//             />
//           </svg>
//         </button>
//       )}
//     </div>
//   );
// };

// export default Home;

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

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);

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

  // Base64 decoding function
  const decodeData = (encodedData) => {
    try {
      return JSON.parse(decodeURIComponent(escape(atob(encodedData))));
    } catch (error) {
      throw new Error("Invalid authentication data");
    }
  };

  // Check for cross-domain authentication data
  const checkCrossDomainAuth = () => {
    // First, check if user is already logged in
    const existingToken = localStorage.getItem("token");
    const existingUser = localStorage.getItem("user");
    
    if (existingToken && existingUser) {
      console.log("User already logged in");
      return;
    }

    // Check URL for auth data parameter
    const authType = searchParams.get('auth');
    const encodedData = searchParams.get('d');
    
    if (authType === 'data' && encodedData) {
      processAuthData(encodedData);
    }
  };

  // Process authentication data from URL
  const processAuthData = async (encodedData) => {
    setIsProcessingAuth(true);
    
    try {
      const authData = decodeData(encodedData);
      
      console.log("Received auth data:", authData);

      // Verify we have required data
      if (!authData.token || !authData.user) {
        throw new Error("Invalid authentication data: missing token or user");
      }

      // Verify token format (basic check)
      if (typeof authData.token !== 'string' || !authData.token.includes('|')) {
        throw new Error("Invalid token format");
      }

      // Verify user object has required fields
      if (!authData.user.id) {
        throw new Error("Invalid user data: missing user ID");
      }

      // Store in localStorage - exact same structure as your login
      localStorage.setItem("token", authData.token);
      localStorage.setItem("user", JSON.stringify(authData));

      // Update Redux store with the exact data structure
      dispatch(setUser(authData));

      toast.success("Successfully logged in from employer account!");

      // Clean URL - remove the auth parameters
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error('Error processing auth data:', error);
      toast.error(`Authentication failed: ${error.message}`);
      
      // Clean URL on error too
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    } finally {
      setIsProcessingAuth(false);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Show loading state while processing authentication
  if (isProcessingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Authentication</h2>
          <p className="text-gray-600">Logging you in from employer account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <JobsSection />
      <Features />
      <Partners />
      {/* <Contact /> */}
      <Reviews />
      <Footer />

      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
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