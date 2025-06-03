"use client"
import { useEffect, useState } from "react"
import { getAllOrders, updateOrderStatus } from "@/lib/action" // pastikan fungsi updateOrderStatus tersedia
import { formatterCurrency, formatDateToDMY } from "@/lib/utils"

const statusTabs = [
  { key: "PURCHASED", label: "📦 Purchased" },
  { key: "PROCESS", label: "🔄 Process" },
  { key: "COMPLETED", label: "✅ Completed" },
  { key: "CANCELLED", label: "❌ Cancelled" },
]

export default function DashboardContent() {
  const [orders, setOrders] = useState([])
  const [activeStatus, setActiveStatus] = useState("PURCHASED")
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null) // track order yg sedang diupdate
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      try {
        const res = await getAllOrders()
        if (res.success) {
          setOrders(res.data)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = orders.filter(order => order.status === activeStatus)

  // Handle update status pesanan
  async function handleStatusChange(orderId, newStatus) {
    setError(null);
    setUpdatingId(orderId);

    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Jika status baru sama dengan status lama, abaikan
    if (order.status === newStatus) {
      setUpdatingId(null);
      return;
    }

    // Konfirmasi jika akan mengubah ke COMPLETED atau CANCELLED
    if (
      newStatus === "COMPLETED" ||
      newStatus === "CANCELLED"
    ) {
      const confirmMsg =
        newStatus === "COMPLETED"
          ? "Apakah kamu yakin ingin menandai pesanan ini sebagai SELESAI?"
          : "Apakah kamu yakin ingin membatalkan pesanan ini?";
      const confirmed = window.confirm(confirmMsg);
      if (!confirmed) {
        setUpdatingId(null);
        return;
      }
    }

    try {
      const { updateOrderStatus } = await import("@/lib/action");
      const result = await updateOrderStatus(orderId, newStatus);

      if (result.success) {
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? result.data : order))
        );
        if (newStatus !== activeStatus) {
          setActiveStatus(newStatus);
        }
      } else {
        setError(result.message || "Gagal memperbarui status.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Terjadi kesalahan saat memperbarui status.");
    } finally {
      setUpdatingId(null);
    }
  }



  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-full">
      <h2 className="text-2xl font-extrabold mb-6 text-yellow-600">📊 Ringkasan Pesanan</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-yellow-300">
        {statusTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={`pb-3 text-base font-semibold transition-colors duration-300 focus:outline-none ${
              activeStatus === tab.key
                ? "border-b-4 border-yellow-600 text-yellow-700"
                : "text-yellow-400 hover:text-yellow-600"
            }`}
            aria-current={activeStatus === tab.key ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <p className="mb-4 text-center text-red-600 font-semibold">{error}</p>
      )}

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-400 italic">Memuat data...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-400 italic">Tidak ada pesanan dengan status ini.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-auto text-sm">
            <thead>
              <tr className="bg-yellow-100 text-yellow-900 uppercase tracking-wide text-left">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Produk</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Tanggal</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr
                  key={order.id}
                  className="border-b border-yellow-200 hover:bg-yellow-50 transition-colors duration-200"
                >
                  <td className="py-3 px-4 font-mono text-yellow-700">{order.id}</td>
                  <td className="py-3 px-4 font-semibold text-yellow-800">{order.product.name}</td>
                  <td className="py-3 px-4 text-yellow-700">{order.user.name}</td>
                  <td className="py-3 px-4 text-center">{order.qty}</td>
                  <td className="py-3 px-4 text-right font-semibold text-yellow-900">
                    Rp{formatterCurrency.format(order.product.price * order.qty)}
                  </td>
                  <td className="py-3 px-4 text-center text-yellow-700">
                    {formatDateToDMY(order.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <select
                      className="border border-yellow-300 rounded px-2 py-1 text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                      value={order.status}
                      disabled={updatingId === order.id || order.status === "COMPLETED" || order.status === "CANCELLED"}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                    >
                      {statusTabs.map(tab => (
                        <option key={tab.key} value={tab.key}>
                          {tab.label}
                        </option>
                      ))}
                    </select>

                    {updatingId === order.id && (
                      <span className="ml-2 text-yellow-500 text-xs italic">Updating...</span>
                    )}

                    {/* Pindahkan <p> ini ke luar <select> */}
                    {["COMPLETED", "CANCELLED"].includes(order.status) && (
                      <p className="text-xs text-gray-500 mt-1 italic">Status tidak bisa diubah</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
