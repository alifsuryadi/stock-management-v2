// frontend/src/app/transactions/page.tsx
"use client";
import { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import api from "@/lib/api";
import { Product } from "@/types";
import toast from "react-hot-toast";

export default function TransactionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactionType, setTransactionType] = useState<
    "stock_in" | "stock_out"
  >("stock_in");
  const [selectedProducts, setSelectedProducts] = useState<
    { productId: number; quantity: number }[]
  >([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch {
      toast.error("Failed to fetch products");
    }
  };

  const addProductToTransaction = () => {
    setSelectedProducts([...selectedProducts, { productId: 0, quantity: 1 }]);
  };

  const updateSelectedProduct = (
    index: number,
    field: "productId" | "quantity",
    value: number
  ) => {
    const updated = [...selectedProducts];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedProducts(updated);
  };

  const removeProductFromTransaction = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    setLoading(true);
    try {
      await api.post("/transactions", {
        type: transactionType,
        items: selectedProducts.filter((item) => item.productId > 0),
        notes: notes || undefined,
      });
      toast.success("Transaction created successfully");
      setSelectedProducts([]);
      setNotes("");
      fetchProducts(); // Refresh to get updated stock
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      toast.error(errorMessage || "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Transaction</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTransactionType("stock_in")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              transactionType === "stock_in"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Stock In
          </button>
          <button
            onClick={() => setTransactionType("stock_out")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              transactionType === "stock_out"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Stock Out
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <div
              className={`px-3 py-2 border rounded-md ${
                transactionType === "stock_in"
                  ? "border-green-300 bg-green-50"
                  : "border-red-300 bg-red-50"
              }`}
            >
              <span
                className={`text-sm font-medium ${
                  transactionType === "stock_in"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {transactionType === "stock_in"
                  ? "Stock In - Adding products to inventory"
                  : "Stock Out - Removing products from inventory"}
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Products
              </label>
              <button
                type="button"
                onClick={addProductToTransaction}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Product
              </button>
            </div>

            <div className="space-y-3">
              {selectedProducts.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 border rounded-md bg-gray-50"
                >
                  <select
                    value={item.productId}
                    onChange={(e) =>
                      updateSelectedProduct(
                        index,
                        "productId",
                        parseInt(e.target.value)
                      )
                    }
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value={0}>Select Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Stock: {product.stock})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateSelectedProduct(
                        index,
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-20 border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Qty"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeProductFromTransaction(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Add any notes about this transaction..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || selectedProducts.length === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
