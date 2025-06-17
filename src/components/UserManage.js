"use client";

import { useEffect, useState } from "react";
import { getAllUsers, updateUserStatus } from "@/lib/action"; // Pastikan fungsi ini tersedia

export default function UserManage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Menyimpan detail pengguna
  const [updatingId, setUpdatingId] = useState(null); // Status sedang diupdate

  useEffect(() => {
    async function fetchUsers() {
      try {
        const result = await getAllUsers();
        if (result.success) {
          setUsers(result.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  const handleStatusChange = async (userId, isAdmin) => {
    setUpdatingId(userId);

    try {
      const result = await updateUserStatus(userId, !isAdmin); // Toggle admin status
      if (result.success) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, isAdmin: !isAdmin } : user
          )
        );
        setSelectedUser(prev => ({ ...prev, isAdmin: !isAdmin }));
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 relative">
      <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">👥 Daftar Pengguna</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-gray-300 text-sm">
            <tr>
              <th className="border border-gray-600 px-4 py-3 text-left">ID</th>
              <th className="border border-gray-600 px-4 py-3 text-left">Nama</th>
              <th className="border border-gray-600 px-4 py-3 text-left">Email</th>
              <th className="border border-gray-600 px-4 py-3 text-left">Alamat</th>
              <th className="border border-gray-600 px-4 py-3 text-center">Admin</th>
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`hover:bg-gray-800 transition duration-150 cursor-pointer ${
                  index % 2 === 1 ? "bg-gray-800/40" : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <td className="px-4 py-3 text-sm text-gray-300">{user.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-white">{user.name}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{user.email}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{user.address || "-"}</td>
                <td className="px-4 py-3 text-center text-lg">
                  {user.isAdmin ? (
                    <span className="text-green-400">✔️</span>
                  ) : (
                    <span className="text-red-500">❌</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Detail Pengguna */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-white"
              onClick={() => setSelectedUser(null)}
            >
              ✖
            </button>
            <h3 className="text-xl font-bold text-white mb-4">📄 Detail Pengguna</h3>
            <p className="text-gray-300"><strong>ID:</strong> {selectedUser.id}</p>
            <p className="text-gray-300"><strong>Nama:</strong> {selectedUser.name}</p>
            <p className="text-gray-300"><strong>Email:</strong> {selectedUser.email}</p>
            <p className="text-gray-300"><strong>Alamat:</strong> {selectedUser.address || "Tidak tersedia"}</p>

            <hr className="my-3 border-gray-600" />

            {/* Dropdown untuk Edit Status Admin */}
            <div className="flex items-center gap-4">
              <p className="text-gray-300"><strong>Status Admin:</strong></p>
              <select
                className="border border-gray-500 rounded px-2 py-1 bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={selectedUser.isAdmin ? "Admin" : "User"}
                disabled={updatingId === selectedUser.id}
                onChange={() => handleStatusChange(selectedUser.id, selectedUser.isAdmin)}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {updatingId === selectedUser.id && (
              <p className="text-yellow-500 text-xs italic mt-2">Memperbarui...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}