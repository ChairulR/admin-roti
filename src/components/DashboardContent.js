"use client";

import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "@/lib/action";
import { formatterCurrency, formatDateToDMY } from "@/lib/utils";

const statusTabs = [
  { key: "PURCHASED", label: "Purchased" },
  { key: "PROCESS", label: "Process" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

export default function DashboardContent() {
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState("PURCHASED");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // Menyimpan detail pesanan

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await getAllOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => order.status === activeStatus);
  async function handleUpdateStatus(orderId, newStatus) {
    setUpdatingId(orderId);

    // Tampilkan konfirmasi jika ingin mengubah ke "Completed" atau "Cancelled"
    if (["COMPLETED", "CANCELLED"].includes(newStatus)) {
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
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="bg-gray-900 rounded-2xl shadow-lg p-8 max-w-full relative">
      <h2 className="text-2xl font-extrabold mb-6 text-white">📊 Ringkasan Pesanan</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-700">
        {statusTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={`pb-3 text-base font-semibold transition-colors duration-300 focus:outline-none ${
              activeStatus === tab.key ? "border-b-4 border-gray-400 text-white" : "text-gray-500 hover:text-white"
            }`}
            aria-current={activeStatus === tab.key ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error message */}
      {error && <p className="mb-4 text-center text-red-500 font-semibold">{error}</p>}

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-400 italic">Memuat data...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-400 italic">Tidak ada pesanan dengan status ini.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-auto text-sm">
            <thead>
              <tr className="bg-gray-800 text-white uppercase tracking-wide text-left">
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
                  className="border-b border-gray-700 hover:bg-gray-800 transition duration-200 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="py-3 px-4 font-mono text-gray-300">{order.id}</td>
                  <td className="py-3 px-4 font-semibold text-gray-200">{order.product.name}</td>
                  <td className="py-3 px-4 text-gray-400">{order.user.name}</td>
                  <td className="py-3 px-4 text-center text-gray-400">{order.qty}</td>
                  <td className="py-3 px-4 text-right font-semibold text-white">
                    Rp{formatterCurrency.format(order.product.price * order.qty)}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-400">{formatDateToDMY(order.createdAt)}</td>
                  <td className="py-3 px-4 text-center text-gray-400">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    {/* Popup Detail Pesanan */}
    {selectedOrder && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 relative">
          <button
            className="absolute top-2 right-3 text-gray-400 hover:text-white"
            onClick={() => setSelectedOrder(null)}
          >
            ✖
          </button>
          <h3 className="text-xl font-bold text-white mb-4">📄 Detail Pesanan</h3>
          <p className="text-gray-300"><strong>ID:</strong> {selectedOrder.id}</p>
          <p className="text-gray-300"><strong>Nama Produk:</strong> {selectedOrder.product.name}</p>
          <p className="text-gray-300"><strong>Jumlah:</strong> {selectedOrder.qty}</p>
          <p className="text-gray-300"><strong>Total:</strong> Rp{formatterCurrency.format(selectedOrder.product.price * selectedOrder.qty)}</p>
          <p className="text-gray-300"><strong>Tanggal:</strong> {formatDateToDMY(selectedOrder.createdAt)}</p>
          <hr className="my-3 border-gray-600" />
          <p className="text-gray-300"><strong>Nama Pemesan:</strong> {selectedOrder.user.name}</p>
          <p className="text-gray-300"><strong>Email:</strong> {selectedOrder.user.email}</p>
          <p className="text-gray-300"><strong>Alamat:</strong> {selectedOrder.user.address || "Tidak tersedia"}</p>

          {/* Dropdown untuk Edit Status */}
          <div className="mt-4">
            <p className="text-gray-300"><strong>Status Pesanan:</strong></p>
            <select
              className="border border-gray-500 rounded px-2 py-1 bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 w-full"
              value={selectedOrder.status}
              disabled={["COMPLETED", "CANCELLED"].includes(selectedOrder.status) || updatingId === selectedOrder.id}
              onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
            >
              {statusTabs.map(tab => (
                <option key={tab.key} value={tab.key}>
                  {tab.label}
                </option>
              ))}
            </select>

            {/* Tampilkan pesan jika pesanan sudah selesai atau dibatalkan */}
            {["COMPLETED", "CANCELLED"].includes(selectedOrder.status) && (
              <p className="text-xs text-gray-500 mt-1 italic">Status pesanan ini tidak dapat diubah.</p>
            )}

            {updatingId === selectedOrder.id && (
              <p className="text-yellow-500 text-xs italic mt-2">Memperbarui...</p>
            )}
          </div>
        </div>
      </div>
    )}
    </div>
  );
}