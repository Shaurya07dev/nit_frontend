"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { fetchAssets, fetchUsers, fetchLoginLogs } from "@/lib/api";
import { Asset, User, LoginLog } from "@/types";
import { 
  CubeIcon, 
  UsersIcon, 
  ClockIcon, 
  BuildingOfficeIcon 
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalUsers: 0,
    totalLogs: 0,
    recentLogins: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const assets = await fetchAssets();
        setStats(prev => ({ ...prev, totalAssets: assets.length }));

        if (user?.role === "hod") {
          const users = await fetchUsers();
          const logs = await fetchLoginLogs();
          const recentLogins = logs.filter((log: LoginLog) => {
            const loginDate = new Date(log.login_time);
            const now = new Date();
            const diffInHours = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
            return diffInHours <= 24;
          }).length;

          setStats(prev => ({
            ...prev,
            totalUsers: users.length,
            totalLogs: logs.length,
            recentLogins,
          }));
        }
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      }
    };

    loadStats();
  }, [user?.role]);

  const statCards = [
    {
      name: "Total Assets",
      value: stats.totalAssets,
      icon: CubeIcon,
      color: "bg-blue-500",
    },
    ...(user?.role === "hod" ? [
      {
        name: "Total Users",
        value: stats.totalUsers,
        icon: UsersIcon,
        color: "bg-green-500",
      },
      {
        name: "Total Login Logs",
        value: stats.totalLogs,
        icon: ClockIcon,
        color: "bg-purple-500",
      },
      {
        name: "Recent Logins (24h)",
        value: stats.recentLogins,
        icon: BuildingOfficeIcon,
        color: "bg-orange-500",
      },
    ] : []),
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {user?.name}! Here's an overview of your system.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <div
                key={stat.name}
                className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
              >
                <dt>
                  <div className={`absolute rounded-md p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                </dt>
                <dd className="ml-16 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </dd>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <a
                  href="/assets"
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <CubeIcon className="h-6 w-6 text-blue-500" />
                  <div>
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">View Assets</p>
                    <p className="text-sm text-gray-500">Manage and edit assets</p>
                  </div>
                </a>

                {user?.role === "hod" && (
                  <>
                    <a
                      href="/users"
                      className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <UsersIcon className="h-6 w-6 text-green-500" />
                      <div>
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">Manage Users</p>
                        <p className="text-sm text-gray-500">Add, edit, or remove users</p>
                      </div>
                    </a>

                    <a
                      href="/logs"
                      className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <ClockIcon className="h-6 w-6 text-purple-500" />
                      <div>
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">View Logs</p>
                        <p className="text-sm text-gray-500">Check login activity</p>
                      </div>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 