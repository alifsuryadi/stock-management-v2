// frontend/src/app/history/page.tsx
"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Transaction } from "@/types";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");
      setTransactions(response.data);
    } catch {
      toast.error("Failed to fetch transaction history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Transaction History
      </h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === "stock_in"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.type === "stock_in"
                          ? "Stock In"
                          : "Stock Out"}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        Transaction #{transaction.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        by {transaction.admin?.firstName}{" "}
                        {transaction.admin?.lastName}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}{" "}
                    {new Date(transaction.createdAt).toLocaleTimeString()}
                  </div>
                </div>

                {transaction.items && transaction.items.length > 0 && (
                  <div className="mt-3 ml-6">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Items:
                    </div>
                    <div className="space-y-1">
                      {transaction.items.map((item) => (
                        <div
                          key={item.id}
                          className="text-sm text-gray-600 flex justify-between"
                        >
                          <span>{item.product?.name}</span>
                          <span className="font-medium">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {transaction.notes && (
                  <div className="mt-2 ml-6">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span>{" "}
                      {transaction.notes}
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        {transactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
