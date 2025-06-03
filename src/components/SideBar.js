"use client"

import { useState, useEffect } from "react"
import { Home, UserCog, Menu, X } from "lucide-react"

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <div className="flex">
      <div
        className={`fixed md:relative inset-y-0 left-0 z-30 w-64 bg-yellow-50 shadow-md rounded-lg backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
          isMobile ? (isMobileOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        } md:translate-x-0`}
      >
        <div className="p-5 border-b border-yellow-300 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-700 tracking-wide">Admin Roti</h1>
          {isMobile && (
            <button
              title="Tutup Sidebar"
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-full hover:bg-yellow-200 transition-all md:hidden"
            >
              <X className="w-6 h-6 text-black" />
            </button>
          )}
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center w-full p-3 rounded-lg text-left transition-all ${
                  activeTab === "dashboard"
                    ? "bg-yellow-500 text-white shadow-md"
                    : "bg-yellow-200 text-yellow-700 hover:bg-yellow-100 border border-yellow-400"
                }`}
              >
                <Home className="w-5 h-5 mr-3" />
                <span className="font-semibold">Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("user-settings")}
                className={`flex items-center w-full p-3 rounded-lg text-left transition-all ${
                  activeTab === "user-settings"
                    ? "bg-yellow-500 text-white shadow-md"
                    : "bg-yellow-200 text-yellow-700 hover:bg-yellow-100 border border-yellow-400"
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
  )
}
