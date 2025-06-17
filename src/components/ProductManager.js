"use client";

import { useState, useEffect } from "react";
import { getAllProducts, addProduct, updateProduct, deleteProduct } from "@/lib/action";
import { Edit, Trash, Plus } from "lucide-react";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const result = await getAllProducts();
        if (result.success) {
          setProducts(result.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Gagal mengambil data produk.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async () => {
    try {
      const result = await addProduct(form);
      if (result.success) {
        setProducts([...products, result.data]);
        setForm({ name: "", price: "", stock: "" });
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      if (!selectedProduct) return;
      const result = await updateProduct(selectedProduct.id, form);
      if (result.success) {
        setProducts(
          products.map((prod) => (prod.id === selectedProduct.id ? result.data : prod))
        );
        setSelectedProduct(null);
        setForm({ name: "", price: "", stock: "" });
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Apakah kamu yakin ingin menghapus produk ini?");
    if (!confirmDelete) return;

    try {
      const result = await deleteProduct(id);
      if (result.success) {
        setProducts(products.filter((prod) => prod.id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
        📦 Manage Produk
      </h2>

      {/* Form untuk menambah atau mengedit produk */}
      <div className="bg-gray-800 p-4 rounded-lg mb-5">
        <h3 className="text-lg font-semibold text-white mb-3">
          {selectedProduct ? "Edit Produk" : "Tambah Produk"}
        </h3>
        <div className="space-y-2">
          <input
            type="text"
            name="name"
            placeholder="Nama Produk"
            value={form.name}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600 focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="number"
            name="price"
            placeholder="Harga"
            value={form.price}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600 focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stok"
            value={form.stock}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700 text-gray-300 border border-gray-600 focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={selectedProduct ? handleUpdateProduct : handleAddProduct}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{selectedProduct ? "Update Produk" : "Tambah Produk"}</span>
          </button>
          {selectedProduct && (
            <button
              onClick={() => {
                setSelectedProduct(null);
                setForm({ name: "", price: "", stock: "" });
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {/* Tabel daftar produk */}
      {loading ? (
        <p className="text-center text-gray-400 italic">Memuat data produk...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 italic">Tidak ada produk tersedia.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-gray-300 text-sm">
              <tr>
                <th className="border border-gray-600 px-4 py-3 text-left">Nama</th>
                <th className="border border-gray-600 px-4 py-3 text-left">Harga</th>
                <th className="border border-gray-600 px-4 py-3 text-left">Stok</th>
                <th className="border border-gray-600 px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-800 transition duration-150">
                  <td className="px-4 py-3 text-sm font-medium text-white">{prod.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">Rp{prod.price}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{prod.stock}</td>
                  <td className="px-4 py-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(prod);
                        setForm({ name: prod.name, price: prod.price, stock: prod.stock });
                      }}
                      className="p-2 rounded bg-gray-600 hover:bg-gray-500 text-white flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-2 rounded bg-red-600 hover:bg-red-500 text-white flex items-center gap-1"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}