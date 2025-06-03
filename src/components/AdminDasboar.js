"use client"
import React, { useState } from "react"
import Sidebar from "./SideBar"
import Header from "./Header"
import DashboardContent from "./DashboardContent"


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
    const [showUserDropdown, setShowUserDropdown] = useState()

  return (
    <div className="flex h-screen bg-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setShowUserDropdown={setShowUserDropdown} showUserDropdown={showUserDropdown}/>
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && <DashboardContent/>}
        </main>
      </div>
    </div>
  )
}

