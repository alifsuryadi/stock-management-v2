// frontend/src/components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  HomeIcon,
  UserGroupIcon,
  TagIcon,
  CubeIcon,
  ArrowsRightLeftIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Admins", href: "/admins", icon: UserGroupIcon },
  { name: "Categories", href: "/categories", icon: TagIcon },
  { name: "Products", href: "/products", icon: CubeIcon },
  { name: "Transactions", href: "/transactions", icon: ArrowsRightLeftIcon },
  { name: "History", href: "/history", icon: ClockIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="w-64 bg-white dark:bg-dark-800 shadow-xl transition-colors duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-dark-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <CubeIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-white">StockFlow</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Management System</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                {admin?.firstName?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {admin?.firstName} {admin?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {admin?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 transition-colors ${
                isActive 
                  ? "text-primary-600 dark:text-primary-400" 
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
              }`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-200 dark:border-dark-700">
        <button
          onClick={toggleTheme}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200 mb-2"
        >
          {isDark ? (
            <SunIcon className="mr-3 h-5 w-5 text-yellow-500" />
          ) : (
            <MoonIcon className="mr-3 h-5 w-5 text-gray-500" />
          )}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
        
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
