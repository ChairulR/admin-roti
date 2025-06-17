"use client";

import { useEffect, useState } from "react";
import { getSalesStatistics } from "@/lib/action"; // Pastikan fungsi API tersedia
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  async function fetchStatistics() {
    setLoading(true);
    try {
      const result = await getSalesStatistics();
      console.log("Data Statistik:", result); // Debugging output API
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setError("Gagal mengambil data statistik.");
    } finally {
      setLoading(false);
    }
  }
    fetchStatistics();
}, []);

  const chartData = {
    labels: stats ? stats.map((data) => data.month) : [],
    datasets: [
      {
        label: "Total Penjualan",
        data: stats ? stats.map((data) => data.totalSales) : [],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-5">📊 Statistik Penjualan</h2>

      {loading ? (
        <p className="text-center text-gray-400 italic">Memuat data statistik...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="bg-gray-800 p-4 rounded-lg mb-5">
            <h3 className="text-lg font-semibold text-white mb-3">Ringkasan Penjualan</h3>
            <p className="text-gray-300"><strong>Total Pesanan:</strong> {stats?.totalOrders}</p>
            <p className="text-gray-300"><strong>Total Pendapatan:</strong> Rp{stats?.totalRevenue}</p>
          </div>

          {/* Grafik Penjualan */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Tren Penjualan Bulanan</h3>
            <Bar data={chartData} />
          </div>
        </>
      )}
    </div>
  );
}