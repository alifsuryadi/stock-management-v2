// frontend/src/app/transactions/page.tsx
"use client";
import { useEffect, useState } from "react";
import {
  PlusIcon,
  TrashIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import api from "@/lib/api";
import { Product } from "@/types";
import toast from "react-hot-toast";
import LoadingButton from "@/components/LoadingButton";

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
  const [fetchingProducts, setFetchingProducts] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (_error) {
      toast.error("Failed to fetch products");
    } finally {
      setFetchingProducts(false);
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

  const getProductStock = (productId: number): number => {
    const product = products.find((p) => p.id === productId);
    return product?.stock || 0;
  };

  const getProductName = (productId: number): string => {
    const product = products.find((p) => p.id === productId);
    return product?.name || "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    const validProducts = selectedProducts.filter((item) => item.productId > 0);
    if (validProducts.length === 0) {
      toast.error("Please select valid products");
      return;
    }

    // Validate stock for stock_out transactions
    if (transactionType === "stock_out") {
      for (const item of validProducts) {
        const availableStock = getProductStock(item.productId);
        if (item.quantity > availableStock) {
          const productName = getProductName(item.productId);
          toast.error(
            `Insufficient stock for ${productName}. Available: ${availableStock}`
          );
          return;
        }
      }
    }

    setLoading(true);
    try {
      await api.post("/transactions", {
        type: transactionType,
        items: validProducts,
        notes: notes || undefined,
      });
      toast.success(
        `${
          transactionType === "stock_in" ? "Stock In" : "Stock Out"
        } transaction completed successfully! 🎉`
      );
      setSelectedProducts([]);
      setNotes("");
      fetchProducts(); // Refresh to get updated stock
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : undefined;
      toast.error(errorMessage || "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProducts) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-6 animate-shimmer"></div>
          <div className="card-dark rounded-xl p-8">
            <div className="space-y-4">
              <div className="h-6 bg-gray-700 rounded animate-shimmer"></div>
              <div className="h-32 bg-gray-700 rounded animate-shimmer"></div>
              <div className="h-20 bg-gray-700 rounded animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Create Transaction
          </h1>
          <p className="text-gray-400">
            Manage inventory with stock in and stock out transactions
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setTransactionType("stock_in")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              transactionType === "stock_in"
                ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/25"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <ArrowTrendingUpIcon className="h-5 w-5" />
            <span>Stock In</span>
          </button>
          <button
            onClick={() => setTransactionType("stock_out")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              transactionType === "stock_out"
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <ArrowTrendingDownIcon className="h-5 w-5" />
            <span>Stock Out</span>
          </button>
        </div>
      </div>

      {/* Transaction Form */}
      <div className="card-dark rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Transaction Type Indicator */}
          <div
            className={`p-4 rounded-xl border ${
              transactionType === "stock_in"
                ? "bg-green-900/20 border-green-700/50"
                : "bg-red-900/20 border-red-700/50"
            }`}
          >
            <div className="flex items-center space-x-3">
              {transactionType === "stock_in" ? (
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-400" />
              ) : (
                <ArrowTrendingDownIcon className="h-6 w-6 text-red-400" />
              )}
              <div>
                <h3
                  className={`font-semibold ${
                    transactionType === "stock_in"
                      ? "text-green-300"
                      : "text-red-300"
                  }`}
                >
                  {transactionType === "stock_in"
                    ? "Stock In Transaction"
                    : "Stock Out Transaction"}
                </h3>
                <p
                  className={`text-sm ${
                    transactionType === "stock_in"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {transactionType === "stock_in"
                    ? "Adding products to inventory"
                    : "Removing products from inventory"}
                </p>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-lg font-semibold text-white">
                Products
              </label>
              <button
                type="button"
                onClick={addProductToTransaction}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="space-y-4">
              {selectedProducts.map((item, index) => {
                const selectedProduct = products.find(
                  (p) => p.id === item.productId
                );
                const maxQuantity =
                  transactionType === "stock_out"
                    ? selectedProduct?.stock || 0
                    : 9999;

                return (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex-1">
                      <select
                        value={item.productId}
                        onChange={(e) =>
                          updateSelectedProduct(
                            index,
                            "productId",
                            parseInt(e.target.value)
                          )
                        }
                        className="select-dark w-full"
                        required
                      >
                        <option value={0}>Select Product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} (Stock: {product.stock})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-32">
                      <input
                        type="number"
                        min="1"
                        max={maxQuantity}
                        value={item.quantity}
                        onChange={(e) =>
                          updateSelectedProduct(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="input-dark w-full text-center"
                        placeholder="Qty"
                        required
                      />
                    </div>

                    {selectedProduct && transactionType === "stock_out" && (
                      <div className="text-xs text-gray-400 w-20 text-center">
                        Max: {selectedProduct.stock}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removeProductFromTransaction(index)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}

              {selectedProducts.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
                  <p className="text-gray-400 mb-4">No products added yet</p>
                  <button
                    type="button"
                    onClick={addProductToTransaction}
                    className="btn-primary"
                  >
                    Add Your First Product
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <label className="block text-lg font-semibold text-white mb-3">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="textarea-dark w-full"
              placeholder="Add any notes about this transaction..."
            />
          </div>

          {/* Submit Section */}
          <div className="flex justify-end pt-6 border-t border-gray-700">
            <LoadingButton
              type="submit"
              loading={loading}
              variant="primary"
              disabled={selectedProducts.length === 0}
              className="px-8 py-3 text-base"
            >
              {loading
                ? "Processing..."
                : `Complete ${
                    transactionType === "stock_in" ? "Stock In" : "Stock Out"
                  }`}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}
