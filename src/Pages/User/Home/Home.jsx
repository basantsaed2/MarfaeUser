// "use client";
// import React from "react";
// import Hero from "./Hero";
// import Features from "./Features";
// import Partners from "./Partners";
// import Contact from "./Contact";
// import Reviews from "./Reviews";
// import Footer from "./Footer";
// import JobsSection from "./JobsSection";

// const Home = () => {

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Hero />
//       <JobsSection />
//       <Features />
//       <Partners />
//       <Contact />
//       <Reviews />
//       <Footer />
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

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <JobsSection />
      <Features />
      <Partners />
      <Contact />
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