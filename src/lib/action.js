"use server";

import { prisma } from "@/lib/prisma"; // pastikan prisma.js di-setup
import { format, subDays, eachDayOfInterval } from "date-fns";
import id from "date-fns/locale/id";

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
        product: {
          select: {
            name: true,
            price: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            address: true, // ✅ tambahkan ini
          },
        },
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

export async function updateUserStatus(userId, isAdmin) {
  try {
    console.log(userId)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, message: "User tidak ditemukan." };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin },
    });

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false, message: "Terjadi kesalahan saat memperbarui status." };
  }
}

export const addProduct = async (formdata) => {
  const { name, price, stock, flavor } = formdata;

  if (!name || !price || !stock || !flavor) {
    return { success: false, message: "Semua field harus diisi." };
  }

  if (!["sweet", "savory"].includes(flavor.toLowerCase())) {
    return { success: false, message: "Flavor harus berupa 'sweet' atau 'savory'." };
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseInt(price),
        stock: parseInt(stock),
        flavor: flavor.toLowerCase(),
        image: "default.jpg" // atau sesuaikan jika kamu punya upload
      },
    });

    return { success: true, data: newProduct };
  } catch (error) {
    console.error("Error addProduct:", error);
    return { success: false, message: "Gagal menambahkan produk." };
  }
};


export const updateProduct = async (id, formdata) => {
  const { name, price, stock, flavor } = formdata;

  if (!name || !price || !stock || !flavor) {
    return { success: false, message: "Semua field harus diisi." };
  }

  if (!["sweet", "savory"].includes(flavor.toLowerCase())) {
    return { success: false, message: "Flavor harus berupa 'sweet' atau 'savory'." };
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        price: parseInt(price),
        stock: parseInt(stock),
        flavor: flavor.toLowerCase(),
      },
    });

    return { success: true, data: updatedProduct };
  } catch (error) {
    console.error("Error updateProduct:", error);
    return { success: false, message: "Gagal memperbarui produk." };
  }
};


export async function deleteProduct(productId) {
  try {
    // Cek apakah produk ada
    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!existingProduct) {
      return { success: false, message: "Produk tidak ditemukan." };
    }

    // Hapus produk dari database
    await prisma.product.delete({ where: { id: productId } });

    return { success: true, message: "Produk berhasil dihapus." };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: "Terjadi kesalahan saat menghapus produk." };
  }
}

export async function getAllProducts() {
  try {
    // Mengambil semua produk dari database
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" }, // Urutkan produk berdasarkan nama
    });

    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, message: "Terjadi kesalahan saat mengambil produk." };
  }
}

export async function getSalesStatistics(range = "monthly") {
  try {
    const orders = await prisma.order.findMany({
      where: { status: "COMPLETED" },
      include: { product: true },
    });

    let chartMap = new Map();

    if (range === "daily") {
      const today = new Date();
      const daysBack = 7; // Ubah ke 30 jika mau 30 hari terakhir
      const startDate = subDays(today, daysBack - 1);

      // Inisialisasi semua hari dengan 0
      const days = eachDayOfInterval({ start: startDate, end: today });
      for (let day of days) {
        const label = format(day, "dd MMM", { locale: id });
        chartMap.set(label, 0);
      }

      for (let order of orders) {
        const label = format(new Date(order.createdAt), "dd MMM", { locale: id });
        if (chartMap.has(label)) {
          chartMap.set(label, chartMap.get(label) + order.product.price * order.qty);
        }
      }

    } else if (range === "monthly") {
      for (let order of orders) {
        const label = format(new Date(order.createdAt), "MMM yyyy", { locale: id });
        chartMap.set(label, (chartMap.get(label) || 0) + order.product.price * order.qty);
      }

    } else if (range === "yearly") {
      for (let order of orders) {
        const label = format(new Date(order.createdAt), "yyyy", { locale: id });
        chartMap.set(label, (chartMap.get(label) || 0) + order.product.price * order.qty);
      }
    }

    const chart = Array.from(chartMap.entries()).map(([label, totalSales]) => ({
      label,
      totalSales,
    }));

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.product.price * order.qty,
      0
    );

    return {
      success: true,
      data: {
        totalOrders: orders.length,
        totalRevenue,
        chart,
      },
    };
  } catch (error) {
    console.error("Error in getSalesStatistics:", error);
    return { success: false, message: "Gagal mengambil data statistik." };
  }
}
