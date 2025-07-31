"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  HomeIcon, 
  CubeIcon, 
  UsersIcon, 
  ClockIcon,
  ArrowRightOnRectangleIcon 
} from "@heroicons/react/24/outline";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Assets", href: "/assets", icon: CubeIcon },
    ...(user?.role === "hod"
      ? [
          { name: "Users", href: "/users", icon: UsersIcon },
          { name: "Login Logs", href: "/logs", icon: ClockIcon },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
          <div className="flex h-full flex-col">
            {/* Logo + Hamburger */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
              <h1 className="text-xl font-bold text-gray-900">
                University Asset Management
              </h1>
              <button
                className="ml-2 p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                onClick={() => setSidebarOpen(false)}
                aria-label="Hide sidebar"
              >
                <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-4 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            {/* User info and logout */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Hamburger to show sidebar */}
      {!sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow hover:bg-gray-100 focus:outline-none"
          onClick={() => setSidebarOpen(true)}
          aria-label="Show sidebar"
        >
          <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      )}
      {/* Main content */}
      <div className={sidebarOpen ? "pl-64" : "pl-0"}>
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 