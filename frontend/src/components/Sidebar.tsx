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
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-800">Stock Management</h1>
        <p className="text-sm text-gray-500">Welcome, {admin?.firstName}</p>
      </div>

      <nav className="mt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-64 p-4">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
