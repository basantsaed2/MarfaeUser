// src/components/layout/AdminLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { useSelector } from "react-redux";

export default function AdminLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isLoading = useSelector((state) => state.loader.isLoading);

  return (
      <div className="w-full flex flex-col min-h-screen font-cairo">
          {!isLoginPage && <Navbar className="p-2" />}
          <div className="w-full relative flex-1">
            {isLoading && <Loading />}
            <Outlet />
          </div>
      </div>
  );
}