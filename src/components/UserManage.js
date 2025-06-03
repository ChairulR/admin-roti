"use client"

import { useEffect, useState } from "react"
import { getAllUsers } from "@/lib/action"

export default function UserManage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function fetchUsers() {
      try {
        const result = await getAllUsers()
        if (result.success) {
          setUsers(result.data)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="bg-yellow-50 rounded-xl shadow-lg p-6 border border-yellow-200">
    <h2 className="text-2xl font-bold text-amber-700 mb-5 flex items-center gap-2">
        👥 Daftar Pengguna
    </h2>

    <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse rounded-lg overflow-hidden">
        <thead className="bg-amber-100 text-amber-800 text-sm">
            <tr>
            <th className="border border-yellow-200 px-4 py-3 text-left">ID</th>
            <th className="border border-yellow-200 px-4 py-3 text-left">Nama</th>
            <th className="border border-yellow-200 px-4 py-3 text-left">Email</th>
            <th className="border border-yellow-200 px-4 py-3 text-left">Alamat</th>
            <th className="border border-yellow-200 px-4 py-3 text-center">Admin</th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-yellow-100">
            {users.map((user, index) => (
            <tr
                key={user.id}
                className={`hover:bg-yellow-50 transition duration-150 ${
                index % 2 === 1 ? "bg-yellow-50/40" : ""
                }`}
            >
                <td className="px-4 py-3 text-sm text-gray-800">{user.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{user.address || "-"}</td>
                <td className="px-4 py-3 text-center text-lg">
                {user.isAdmin ? (
                    <span className="text-green-600">✔️</span>
                ) : (
                    <span className="text-red-500">❌</span>
                )}
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    </div>

  )
}
