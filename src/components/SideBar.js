"use client";

import { useState, useEffect } from "react";
import { Home, UserCog, Package, Menu, X, BarChart } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-30 w-64 bg-gray-900 shadow-md rounded-lg backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
          isMobile ? (isMobileOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        } md:translate-x-0`}
      >
        {/* Header Sidebar */}
        <div className="p-5 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white tracking-wide">Admin Roti</h1>
          {isMobile && (
            <button
              title="Tutup Sidebar"
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-full hover:bg-gray-700 transition-all md:hidden"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          )}
        </div>

        {/* Navigasi Sidebar */}
        <nav className="p-4">
          <ul className="space-y-2">
            {/* Dashboard */}
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center w-full p-3 rounded-lg text-left transition-all ${
                  activeTab === "dashboard"
                    ? "bg-gray-700 text-white shadow-md"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-600"
                }`}
              >
                <Home className="w-5 h-5 mr-3" />
                <span className="font-semibold">Dashboard</span>
              </button>
            </li>

            {/* Manage Produk */}
            <li>
              <button
                onClick={() => setActiveTab("manage-products")}
                className={`flex items-center w-full p-3 rounded-lg text-left transition-all ${
                  activeTab === "manage-products"
                    ? "bg-gray-700 text-white shadow-md"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-600"
                }`}
              >
                <Package className="w-5 h-5 mr-3" />
                <span className="font-semibold">Manage Produk</span>
              </button>
            </li>

            {/* Statistik Penjualan */}
            <li>
              <button
                onClick={() => setActiveTab("sales-statistics")}
                className={`flex items-center w-full p-3 rounded-lg text-left transition-all ${
                  activeTab === "sales-statistics"
                    ? "bg-gray-700 text-white shadow-md"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-600"
                }`}
              >
                <BarChart className="w-5 h-5 mr-3" />
                <span className="font-semibold">Statistik Penjualan</span>
              </button>
            </li>

            {/* Pengaturan User */}
            <li>
              <button
                onClick={() => setActiveTab("user-settings")}
                className={`flex items-center w-full p-3 rounded-lg text-left transition-all ${
                  activeTab === "user-settings"
                    ? "bg-gray-700 text-white shadow-md"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-600"
                }`}
              >
                <UserCog className="w-5 h-5 mr-3" />
                <span className="font-semibold">Pengaturan User</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}