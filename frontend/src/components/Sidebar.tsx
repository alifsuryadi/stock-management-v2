// frontend/src/components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  HomeIcon,
  UserGroupIcon,
  TagIcon,
  CubeIcon,
  ArrowsRightLeftIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
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

  return (
    <div className="w-64 bg-gray-800 shadow-xl border-r border-gray-700">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M12 11V7" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Stock Management</h1>
            <p className="text-xs text-gray-400">Welcome, {admin?.firstName}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                <item.icon 
                  className={`mr-3 h-5 w-5 transition-colors ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                  }`} 
                />
                <span>{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
        {admin && (
          <div className="mb-3 p-3 bg-gray-750 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {admin.firstName[0]}{admin.lastName[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {admin.firstName} {admin.lastName}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {admin.email}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );
}
