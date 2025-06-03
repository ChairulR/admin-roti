"use server";

import { prisma } from "@/lib/prisma"; // pastikan prisma.js di-setup

// Mendapatkan semua user
export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        address: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, message: "Gagal mengambil data pengguna." };
  }
};

// Menghapus user berdasarkan ID
export const deleteUserById = async (id) => {
  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    return { success: true, message: "User berhasil dihapus" };
  } catch (error) {
    console.error("Gagal menghapus user:", error);
    return { success: false, message: "Gagal menghapus user" };
  }
};

// Mengubah status admin user
export const toggleAdminStatus = async (id, isAdmin) => {
  try {
    await prisma.user.update({
      where: { id: Number(id) },
      data: {
        isAdmin: Boolean(isAdmin),
      },
    });
    return { success: true, message: "Status admin diperbarui" };
  } catch (error) {
    console.error("Gagal mengubah status admin:", error);
    return { success: false, message: "Gagal mengubah status admin" };
  }
};

// Statistik pengguna & pesanan
export const getDashboardStats = async () => {
  try {
    const totalUsers = await prisma.user.count();
    const totalOrders = await prisma.order.count();
    const completedOrders = await prisma.order.count({
      where: { status: "COMPLETED" },
    });

    return {
      success: true,
      data: {
        totalUsers,
        totalOrders,
        completedOrders,
      },
    };
  } catch (error) {
    console.error("Error mengambil statistik:", error);
    return { success: false, message: "Gagal mengambil statistik." };
  }
};

export const getAllOrders = async () => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        product: { select: { name: true, price: true } },
        user: { select: { name: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return {
      success: true,
      data: orders,
    }
  } catch (error) {
    console.error("Error fetching all orders:", error)
    return { success: false, message: "Failed to fetch orders" }
  }
}

export async function updateOrderStatus(orderId, status) {
    const validStatuses = ['PURCHASED', 'PROCESS', 'COMPLETED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
        return { success: false, message: 'Status tidak valid' }
    }

    try {
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                product: { select: { id: true, name: true, price: true } },
                user: { select: { id: true, name: true } },
            },
        })

        return { success: true, data: updatedOrder }

    } catch (error) {
        console.error('Gagal memperbarui status pesanan:', error)
        return { success: false, message: 'Kesalahan saat update pesanan' }
    }
}