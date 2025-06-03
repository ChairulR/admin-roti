"use client"
import React, { useState } from "react"
import Sidebar from "./SideBar"
import Header from "./Header"
import DashboardContent from "./DashboardContent"


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header/>
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && <DashboardContent/>}
        </main>
      </div>
    </div>
  )
}

