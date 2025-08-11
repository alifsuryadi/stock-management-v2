// frontend/src/app/products/page.tsx
"use client";
import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import api from "@/lib/api";
import { Product } from "@/types";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="aspect-w-1 aspect-h-1 w-full">
              {product.imageUrl ? (
                <Image
                  className="h-48 w-full object-cover"
                  src={`${process.env.NEXT_PUBLIC_API_URL}${product.imageUrl}`}
                  alt={product.name}
                  width={192}
                  height={192}
                />
              ) : (
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.stock > 10
                      ? "bg-green-100 text-green-800"
                      : product.stock > 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock} in stock
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {product.category?.name}
              </p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {product.description || "No description"}
              </p>
              <div className="mt-4 flex justify-between">
                <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-900 text-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
