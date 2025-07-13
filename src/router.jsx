import { createBrowserRouter, Outlet } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";
import ProtAuth from "./Auth/ProtAuth";
import LoginEmployer from "./Pages/Autherzation/LoginEmployer";
import NotFound from "./Pages/NotFound";
import ProtectedRoute from "./Auth/ProtectedRoute";
import AuthLayout from "./Layout/AuthLayout";
import RegisterEmployer from "./Pages/Autherzation/RegisterEmployer";
import Profile from "./Pages/User/Profile/Profile";
import Companies from "./Pages/User/Companies/Companies";
import Jobs from "./Pages/User/Jobs/Jobs";
import Drugs from "./Pages/User/Drugs/Drugs";
import ContactUs from "./Pages/User/ContactUs/ContactUs";
import JobsTracked from "./Pages/User/Jobs/JobsTracked";
import Home from "./Pages/User/Home/Home";

const router = createBrowserRouter([
  // ✅ صفحات تسجيل الدخول و auth layout
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <ProtAuth>
            <LoginEmployer />
          </ProtAuth>
        ),
      },
      {
        path: "register",
        element: (
          <ProtAuth>
            <RegisterEmployer />
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
        path: "tracking_jobs",
        element: <JobsTracked />
      },
      {
        path: "drugs",
        element: <Drugs />
      },
      {
        path: "contact_us",
        element: <ContactUs />
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
