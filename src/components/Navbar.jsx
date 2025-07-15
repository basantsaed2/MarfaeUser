// import React, { useContext, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { LanguageContext } from "./../context/LanguageContext";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { LogOut, ChevronDown, X, Menu, Contact, BookOpen, Briefcase, Bookmark, List, Building, Pill } from "lucide-react";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import Logo from "../assets/Logo.jpeg";

// export default function Navbar({ className }) {
//   const { t } = useTranslation();
//   const { language, changeLanguage } = useContext(LanguageContext);
//   const userData = JSON.parse(localStorage.getItem("user"));
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const userName = userData?.user?.first_name + " " + userData?.user?.last_name || userData?.user?.full_name || "";
//   const userInitials = userName
//     ? userName.split(" ").slice(0, 2).map((word) => word[0]).join("")
//     : "AD";

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     navigate("/login");
//     setDropdownOpen(false);
//   };

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const handleProfileClick = () => {
//     navigate("/profile");
//     setDropdownOpen(false);
//   };

//   const isActive = (path) => location.pathname === path;

//   // Navigation items (top-level, only for authenticated users)
//   const navItems = [
//     { to: "/contact_us", label: t("Contact Us"), icon: Contact },
//     // { to: "/blog", label: t("blog"), icon: BookOpen },
//     { to: "/jobs", label: t("Jobs"), icon: Briefcase },
//   ];

//   // Dropdown items for Lists (including Saved Jobs and Job Tracker, only for authenticated users)
//   const listItems = [
//     { to: "/companies", label: t("Companies"), icon: Building },
//     { to: "/drugs", label: t("Drugs"), icon: Pill },
//     { to: "/saved_jobs", label: t("Saved Jobs"), icon: Bookmark },
//     { to: "/tracking_jobs", label: t("Job Tracker"), icon: List },
//   ];

//   return (
//     <header className={`w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 font-inter shadow-lg transition-all duration-300 ${className}`}>
//       <div className="flex items-center">
//         <Link to="/">
//           <img
//             src={Logo}
//             alt="Logo"
//             className="h-14 w-auto object-contain transition-transform hover:scale-105 cursor-pointer"
//           />
//         </Link>
//       </div>

//       {/* Middle - Navigation links (only for authenticated users) */}
//       {userData && (
//         <nav className="hidden lg:flex items-center gap-8">
//           {navItems.map((item) => (
//             <Link
//               key={item.to}
//               to={item.to}
//               className={`flex items-center gap-2 text-white text-lg font-semibold tracking-tight transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-white after:transition-all after:duration-200 ${
//                 isActive(item.to) ? "after:w-full text-white font-bold" : "hover:after:w-full hover:text-white"
//               }`}
//             >
//               <item.icon className="h-5 w-5" />
//               {item.label}
//             </Link>
//           ))}
//           {/* Lists Dropdown */}
//           <div className="relative">
//             <button
//               onClick={toggleDropdown}
//               className="flex items-center gap-2 text-white text-lg font-semibold tracking-tight hover:text-white transition-colors duration-200"
//             >
//               <List className="h-5 w-5" />
//               {t("Lists")}
//               <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
//             </button>
//             {dropdownOpen && (
//               <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-20 border border-gray-100">
//                 {listItems.map((item) => (
//                   <Link
//                     key={item.to}
//                     to={item.to}
//                     className={`flex items-center gap-2 px-4 py-2 text-gray-800 text-base font-medium tracking-tight hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150 ${
//                       isActive(item.to) ? "bg-indigo-50 text-indigo-600" : ""
//                     }`}
//                     onClick={() => setDropdownOpen(false)}
//                   >
//                     <item.icon className="h-5 w-5" />
//                     {item.label}
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </nav>
//       )}

//       {/* Right side - Auth or Profile */}
//       <div className="flex items-center gap-3">
//         {userData ? (
//           <div className="flex items-center gap-3">
//             <button
//               onClick={handleProfileClick}
//               className="flex items-center gap-2 group"
//             >
//               <Avatar className="h-10 w-10 bg-white ring-2 ring-white/30 group-hover:ring-white transition-all duration-200">
//                 <AvatarFallback className="text-indigo-600 font-semibold">{userInitials}</AvatarFallback>
//               </Avatar>
//               <span className="text-lg text-white font-semibold tracking-tight group-hover:text-white transition-colors duration-200">
//                 {userName}
//               </span>
//             </button>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleLogout}
//               className="text-white hover:text-red-400 hover:bg-white/10 transition-colors duration-200"
//             >
//               <LogOut className="h-4 w-4 mr-1" />
//               {t("logout")}
//             </Button>
//           </div>
//         ) : (
//           <>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => navigate("/login")}
//               className="text-white text-base font-medium tracking-tight border-white/30 hover:bg-white/20 hover:border-white hover:text-white transition-all duration-200"
//             >
//               {t("login")}
//             </Button>
//             <Button
//               size="sm"
//               onClick={() => navigate("/signup")}
//               className="bg-white text-indigo-600 text-base font-medium tracking-tight hover:bg-indigo-100 transition-colors duration-200"
//             >
//               {t("signup")}
//             </Button>
//           </>
//         )}
//       </div>

//       {/* Mobile Menu Button (only for authenticated users) */}
//       {userData && (
//         <div className="lg:hidden">
//           <button
//             onClick={toggleDropdown}
//             className="text-white hover:text-white focus:outline-none transition-colors duration-200"
//           >
//             {dropdownOpen ? (
//               <X className="h-6 w-6" />
//             ) : (
//               <Menu className="h-6 w-6" />
//             )}
//           </button>
//         </div>
//       )}

//       {/* Mobile Menu (only for authenticated users) */}
//       {userData && dropdownOpen && (
//         <div className="lg:hidden absolute top-20 left-0 w-full bg-white shadow-xl z-20 border-t border-gray-100">
//           <nav className="flex flex-col p-4 gap-2">
//             {navItems.map((item) => (
//               <Link
//                 key={item.to}
//                 to={item.to}
//                 className={`flex items-center gap-2 px-4 py-2 text-gray-800 text-base font-medium tracking-tight hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150 ${
//                   isActive(item.to) ? "bg-indigo-50 text-indigo-600" : ""
//                 }`}
//                 onClick={() => setDropdownOpen(false)}
//               >
//                 <item.icon className="h-5 w-5" />
//                 {item.label}
//               </Link>
//             ))}
//             <div className="border-t border-gray-200 my-2" />
//             {listItems.map((item) => (
//               <Link
//                 key={item.to}
//                 to={item.to}
//                 className={`flex items-center gap-2 px-4 py-2 text-gray-800 text-base font-medium tracking-tight hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150 ${
//                   isActive(item.to) ? "bg-indigo-50 text-indigo-600" : ""
//                 }`}
//                 onClick={() => setDropdownOpen(false)}
//               >
//                 <item.icon className="h-5 w-5" />
//                 {item.label}
//               </Link>
//             ))}
//             <div className="border-t border-gray-200 my-2" />
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 px-4 py-2 text-left text-red-600 text-base font-medium tracking-tight hover:bg-red-50 transition-colors duration-150"
//             >
//               <LogOut className="h-5 w-5" />
//               {t("logout")}
//             </button>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }

import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "./../context/LanguageContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, ChevronDown, X, Menu, Contact, BookOpen, Briefcase, Bookmark, List, Building, Pill } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "../assets/Logo.jpeg";

export default function Navbar({ className }) {
  const { t } = useTranslation();
  const { language, changeLanguage } = useContext(LanguageContext);
  const userData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [region, setRegion] = useState("Egypt"); // State for region selection

  const userName = userData?.user?.first_name + " " + userData?.user?.last_name || userData?.user?.full_name || "";
  const userInitials = userName
    ? userName.split(" ").slice(0, 2).map((word) => word[0]).join("")
    : "AD";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    // Optional: Trigger an action to update job listings based on region
    // e.g., dispatch an action or update a context
    setDropdownOpen(false); // Close dropdown on mobile after selection
  };

  // Navigation items
  const navItems = [
    { to: "/contact_us", label: t("Contact Us"), icon: Contact },
    { to: "/jobs", label: t("Jobs"), icon: Briefcase },
  ];

  // Dropdown items for Lists
  const listItems = [
    { to: "/companies", label: t("Companies"), icon: Building },
    { to: "/drugs", label: t("Drugs"), icon: Pill },
    { to: "/saved_jobs", label: t("Saved Jobs"), icon: Bookmark },
    { to: "/tracking_jobs", label: t("Job Tracker"), icon: List },
  ];

  return (
    <header
      className={`w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 font-inter shadow-lg transition-all duration-300 ${className}`}
    >
      <div className="flex items-center">
        <Link to="/">
          <img
            src={Logo}
            alt="Logo"
            className="h-14 w-auto object-contain transition-transform hover:scale-105 cursor-pointer"
          />
        </Link>
      </div>

      {/* Middle - Navigation links (only for authenticated users) */}
      {userData && (
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 text-white text-lg font-semibold tracking-tight transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-white after:transition-all after:duration-200 ${
                isActive(item.to) ? "after:w-full text-white font-bold" : "hover:after:w-full hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
          {/* Lists Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 text-white text-lg font-semibold tracking-tight hover:text-white transition-colors duration-200"
            >
              <List className="h-5 w-5" />
              {t("Lists")}
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-20 border border-gray-100">
                {listItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2 px-4 py-2 text-gray-800 text-base font-medium tracking-tight hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150 ${
                      isActive(item.to) ? "bg-indigo-50 text-indigo-600" : ""
                    }`}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/* Region Toggle */}
          <div className="flex items-center bg-white/10 rounded-full p-1">
            <button
              onClick={() => handleRegionChange("Egypt")}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                region === "Egypt" ? "bg-white text-indigo-600" : "text-white hover:bg-white/20"
              }`}
            >
              {t("مصر")}
            </button>
            <button
              onClick={() => handleRegionChange("Gulf")}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                region === "Gulf" ? "bg-white text-indigo-600" : "text-white hover:bg-white/20"
              }`}
            >
              {t("الخليج العربي")}
            </button>
          </div>
        </nav>
      )}

      {/* Right side - Auth or Profile */}
      <div className="flex items-center gap-3">
        {userData ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 group"
            >
              <Avatar className="h-10 w-10 bg-white ring-2 ring-white/30 group-hover:ring-white transition-all duration-200">
                <AvatarFallback className="text-indigo-600 font-semibold">{userInitials}</AvatarFallback>
              </Avatar>
              <span className="text-lg text-white font-semibold tracking-tight group-hover:text-white transition-colors duration-200">
                {userName}
              </span>
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:text-red-400 hover:bg-white/10 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 mr-1" />
              {t("logout")}
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/login")}
              className="text-white text-base font-medium tracking-tight border-white/30 hover:bg-white/20 hover:border-white hover:text-white transition-all duration-200"
            >
              {t("login")}
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/signup")}
              className="bg-white text-indigo-600 text-base font-medium tracking-tight hover:bg-indigo-100 transition-colors duration-200"
            >
              {t("signup")}
            </Button>
          </>
        )}
      </div>

      {/* Mobile Menu Button (only for authenticated users) */}
      {userData && (
        <div className="lg:hidden">
          <button
            onClick={toggleDropdown}
            className="text-white hover:text-white focus:outline-none transition-colors duration-200"
          >
            {dropdownOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      )}

      {/* Mobile Menu (only for authenticated users) */}
      {userData && dropdownOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white shadow-xl z-20 border-t border-gray-100">
          <nav className="flex flex-col p-4 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-4 py-2 text-gray-800 text-base font-medium tracking-tight hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150 ${
                  isActive(item.to) ? "bg-indigo-50 text-indigo-600" : ""
                }`}
                onClick={() => setDropdownOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 my-2" />
            {listItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-4 py-2 text-gray-800 text-base font-medium tracking-tight hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150 ${
                  isActive(item.to) ? "bg-indigo-50 text-indigo-600" : ""
                }`}
                onClick={() => setDropdownOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 my-2" />
            {/* Region Selector for Mobile */}
            <div className="flex flex-col gap-2 px-4 py-2">
              <span className="text-gray-800 text-base font-medium">{t("Region")}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRegionChange("Egypt")}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    region === "Egypt" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-indigo-50"
                  }`}
                >
                  {t("مصر")}
                </button>
                <button
                  onClick={() => handleRegionChange("Gulf")}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    region === "Gulf" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-indigo-50"
                  }`}
                >
                  {t("الخليج العربي")}
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200 my-2" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-left text-red-600 text-base font-medium tracking-tight hover:bg-red-50 transition-colors duration-150"
            >
              <LogOut className="h-5 w-5" />
              {t("logout")}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}