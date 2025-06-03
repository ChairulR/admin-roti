"use client"
import React, { useState } from "react"
import Sidebar from "./SideBar"
import DashboardContent from "./DashboardContent"
import UserManage from "./UserManage"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex h-screen bg-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "user-settings" && <UserManage />}
        </main>
      </div>
    </div>
  )
}
