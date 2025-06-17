"use client"
import React, { useState } from "react"
import Sidebar from "./SideBar"
import DashboardContent from "./DashboardContent"
import UserManage from "./UserManage"
import ProductManager from "./ProductManager"
import Statistics from "./Statistics"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex h-screen bg-gray-800">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "user-settings" && <UserManage />}
          {activeTab === "manage-products" && <ProductManager />}
          {activeTab === "sales-statistics" && <Statistics />}
        </main>
      </div>
    </div>
  )
}
