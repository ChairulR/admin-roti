"use client";

import dynamic from "next/dynamic";

const MermaidRenderer = dynamic(() => import("@/components/MermaidRenderer"), {
  ssr: false,
});

export default function DiagramPage() {
  const chart = `
classDiagram
    class AdminDashboard {
        -activeTab: string
        -showUserDropdown: boolean
        +renderDashboard()
    }

    class Sidebar {
        -isMobileOpen: boolean
        -activeTab: string
        +handleNavigation()
    }

    class UserManage {
        -users: User[]
        +fetchUsers()
        +renderTable()
        +toggleAdminRights()
    }

    class ProductManager {
        -products: Product[]
        -selectedProduct: Product
        -formName: String
        -formPrice: Int
        -formStock: Int
        -formFlavor: String
        +addProduct()
        +updateProduct()
        +deleteProduct()
    }

    class DashboardContent {
        -orders: Order[]
        -activeStatus: string
        +fetchOrders()
        +handleStatusChange()
        +filterByStatus()
    }

    class Statistics {
        -stats: any
        -range: string
        +getSalesStatistics()
        +filterByRange()
    }

    class User {
        +id: Int
        +name: String
        +email: String
        +address: String
        +isAdmin: Boolean
    }

    class Product {
        +id: Int
        +name: String
        +price: Int
        +stock: Int
        +flavor: String
    }

    class Order {
        +id: Int
        +userId: Int
        +productId: Int
        +qty: Int
        +status: OrderStatus
        +payment: PaymentMethod
    }

    class Comment {
        +id: Int
        +userId: Int
        +productId: Int
        +orderId: Int
        +content: String
        +rate: Int
    }

    class OrderStatus {
        PURCHASED
        PROCESS
        COMPLETED
        CANCELLED
    }

    class PaymentMethod {
        QRIS
        COD
    }

    %% === Relasi antar komponen admin
    AdminDashboard --> Sidebar : "mengatur navigasi"
    AdminDashboard --> DashboardContent : "menampilkan data pesanan"

    Sidebar --> UserManage : "akses ke manajemen user"
    Sidebar --> ProductManager : "akses ke manajemen produk"
    Sidebar --> Statistics : "akses ke statistik penjualan"

    %% === Hubungan ke model data
    UserManage --> User : "mengelola data user"
    ProductManager --> Product : "mengelola produk"
    DashboardContent --> Order : "mengakses data pesanan"
    DashboardContent --> User : "melihat detail pemesan"
    DashboardContent --> Product : "melihat produk dipesan"
    Statistics --> Order : "menghitung total pesanan"

    %% === Hubungan antar entitas
    Order --> User : "dimiliki oleh"
    Order --> Product : "berisi produk"
    Order --> Comment : "memiliki ulasan"
    Comment --> Product : "merujuk pada"
    Comment --> User : "ditulis oleh"

  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white px-6 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 border border-yellow-200">
        <div className="mb-6 border-b border-yellow-300 pb-4">
          <h1 className="text-3xl font-bold text-yellow-700">📐 Diagram Kelas - Admin Toko Roti</h1>
          <p className="text-gray-600 mt-1">Berikut adalah visualisasi hubungan antar entitas dalam sistem.</p>
        </div>

        <div className="overflow-auto bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-[80vh]">
          <MermaidRenderer chart={chart} />
        </div>
      </div>
    </div>
  );
}
