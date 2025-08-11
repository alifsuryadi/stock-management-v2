// frontend/src/app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Product, Transaction } from "@/types";
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalTransactionsToday: 0,
    stockInToday: 0,
    stockOutToday: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, transactionsRes] = await Promise.all([
        api.get("/products"),
        api.get("/transactions"),
      ]);

      const products: Product[] = productsRes.data;
      const transactions: Transaction[] = transactionsRes.data;

      const lowStock = products.filter((p) => p.stock < 10);
      const today = new Date().toDateString();
      const todayTransactions = transactions.filter(
        (t) => new Date(t.createdAt).toDateString() === today
      );

      setStats({
        totalProducts: products.length,
        lowStockProducts: lowStock.length,
        totalTransactionsToday: todayTransactions.length,
        stockInToday: todayTransactions.filter((t) => t.type === "stock_in")
          .length,
        stockOutToday: todayTransactions.filter((t) => t.type === "stock_out")
          .length,
      });

      setLowStockProducts(lowStock.slice(0, 5));
      setRecentTransactions(transactions.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Overview of your stock management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="card-dark-hover rounded-xl p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                <CubeIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <p className="text-sm font-medium text-gray-400 truncate">
                Total Products
              </p>
              <p className="text-2xl font-bold text-white">
                {stats.totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="card-dark-hover rounded-xl p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-gradient-to-br from-red-600 to-red-700 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <p className="text-sm font-medium text-gray-400 truncate">
                Low Stock
              </p>
              <p className="text-2xl font-bold text-red-400">
                {stats.lowStockProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="card-dark-hover rounded-xl p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-lg">
                <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <p className="text-sm font-medium text-gray-400 truncate">
                Stock In Today
              </p>
              <p className="text-2xl font-bold text-green-400">
                {stats.stockInToday}
              </p>
            </div>
          </div>
        </div>

        <div className="card-dark-hover rounded-xl p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg">
                <ArrowTrendingDownIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <p className="text-sm font-medium text-gray-400 truncate">
                Stock Out Today
              </p>
              <p className="text-2xl font-bold text-orange-400">
                {stats.stockOutToday}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Low Stock Alert */}
        <div className="card-dark rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
            Low Stock Alert
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-white truncate">
                      {product.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">
                      {product.category?.name}
                    </p>
                  </div>
                  <span className="badge-danger px-2 sm:px-3 py-1 rounded-full text-xs font-medium ml-3">
                    {product.stock} left
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8">
                <p className="text-gray-400">No low stock products</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card-dark rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
            Recent Transactions
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-white">
                      Transaction #{transaction.id}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ml-3 ${
                      transaction.type === "stock_in"
                        ? "badge-success"
                        : "badge-danger"
                    }`}
                  >
                    {transaction.type === "stock_in"
                      ? "Stock In"
                      : "Stock Out"}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8">
                <p className="text-gray-400">No recent transactions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
