import { createBrowserRouter, Outlet } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";
import ProtAuth from "./Auth/ProtAuth";
import LoginUser from "./Pages/Autherzation/LoginUser";
import NotFound from "./Pages/NotFound";
import ProtectedRoute from "./Auth/ProtectedRoute";
import AuthLayout from "./Layout/AuthLayout";
import RegisterUser from "./Pages/Autherzation/RegisterUser";
import ForgotPassword from "./Pages/Autherzation/ForgotPassword";
import Profile from "./Pages/User/Profile/Profile";
import Companies from "./Pages/User/Companies/Companies";
import Jobs from "./Pages/User/Jobs/Jobs";
import Drugs from "./Pages/User/Drugs/Drugs";
import ContactUs from "./Pages/User/ContactUs/ContactUs";
import JobsTracked from "./Pages/User/Jobs/JobsTracked";
import Home from "./Pages/User/Home/Home";
import SavedJobs from "./Pages/User/Jobs/SavedJobs";
import JobDetailPage from "./Pages/User/Home/JobDetailPage";
import AboutUs from "./Pages/User/AboutUs/AboutUs";
import Doctors from "./Pages/User/Doctors/Doctors";
import Plans from "./Pages/User/Plans/Plans";
import Articles from "./Pages/User/Articles/Articles";

const router = createBrowserRouter([
  // ✅ صفحات تسجيل الدخول و auth layout
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <ProtAuth>
            <LoginUser />
          </ProtAuth>
        ),
      },
      {
        path: "register",
        element: (
          <ProtAuth>
            <RegisterUser />
          </ProtAuth>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <ProtAuth>
            <ForgotPassword />
          </ProtAuth>
        ),
      },
    ],
  },

  // ✅ الصفحات المحمية داخل MainLayout
  {
    element: (
      <AdminLayout />
    ),
    children: [
      {
        path: "/",
        element: (
          // <ProtectedRoute>
          <Home />
          // </ProtectedRoute>
        ),
      },
      {
        path: "jobs/:id",
        element: <JobDetailPage />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "companies",
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <Companies />
          },
          // {
          //   path:"company_profile",
          //   element
          // }
        ]
      },
      {
        path: "jobs",
        element: <Jobs />
      },
      {
        path: "doctors",
        element: <Doctors />,
      },
      {
        path: "saved_jobs",
        element: <SavedJobs />
      },
      {
        path: "tracking_jobs",
        element: <JobsTracked />
      },
      {
        path: "drugs",
        element: <Drugs />
      },
      {
        path: "plans",
        element: <Plans />
      },
      {
        path: "contact_us",
        element: <ContactUs />
      },
      {
        path: "about_us",
        element: <AboutUs />
      },
      {
        path: "articles",
        element: <Articles />
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
