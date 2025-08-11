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
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-900">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-700 rounded mb-4 sm:mb-6 animate-shimmer"></div>
          <div className="space-y-3 sm:space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-20 sm:h-24 bg-gray-700 rounded-xl animate-shimmer"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
          Transaction History
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Complete history of all stock transactions
        </p>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="card-dark-hover rounded-xl p-4 sm:p-6">
            {/* Transaction Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.type === "stock_in"
                        ? "badge-success"
                        : "badge-danger"
                    }`}
                  >
                    {transaction.type === "stock_in" ? "Stock In" : "Stock Out"}
                  </span>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-semibold text-white">
                    Transaction #{transaction.id}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    by {transaction.admin?.firstName} {transaction.admin?.lastName}
                  </div>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-400 sm:text-right">
                <div>{new Date(transaction.createdAt).toLocaleDateString()}</div>
                <div>{new Date(transaction.createdAt).toLocaleTimeString()}</div>
              </div>
            </div>

            {/* Transaction Items */}
            {transaction.items && transaction.items.length > 0 && (
              <div className="mb-4 p-3 sm:p-4 bg-gray-800 rounded-lg">
                <div className="text-sm font-semibold text-white mb-3">
                  Items ({transaction.items.length}):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {transaction.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 bg-gray-750 rounded text-sm"
                    >
                      <span className="text-gray-300 truncate mr-2">
                        {item.product?.name}
                      </span>
                      <span className="text-white font-medium whitespace-nowrap">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transaction Notes */}
            {transaction.notes && (
              <div className="p-3 sm:p-4 bg-gray-800 rounded-lg">
                <div className="text-sm">
                  <span className="font-semibold text-white">Notes:</span>{" "}
                  <span className="text-gray-300">{transaction.notes}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {transactions.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <div className="card-dark rounded-xl p-8 sm:p-12 max-w-md mx-auto">
            <svg className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-300 text-lg sm:text-xl mb-2">
              No transactions found
            </p>
            <p className="text-gray-500 text-sm sm:text-base">
              Transaction history will appear here once you start recording stock movements
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
