"use client"

import { useState, useEffect } from "react"
import { Home, Menu, X } from "lucide-react"
import Link from "next/link"


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
    <>
      <div className="fixed top-4 left-4 z-30 md:hidden">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-white shadow-md text-gray-700 hover:bg-gray-100"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobile && isMobileOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" />}
      <div
        className={`sidebar-content fixed md:static inset-y-0 left-0 z-30 w-64 bg-yellow-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobile ? (isMobileOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        } md:translate-x-0`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <Link href="/" className="flex items-center">
          <h1 className="text-xl font-bold text-amber-700">Admin Roti</h1>
          </Link>
          {isMobile && (
            <button
              title="x"
              onClick={() => setIsMobileOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 md:hidden"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
          <button
            onClick={() => handleMenuItemClick("dashboard")}
            className={`flex items-center w-full p-3 rounded-lg text-left ${
              activeTab === "dashboard" ? "bg-yellow-500 text-white" : "text-brown-700 hover:bg-amber-200"
            }`}
          >
                <Home className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
