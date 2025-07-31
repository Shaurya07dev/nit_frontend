"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { LoginLog } from "@/types";
import * as XLSX from "xlsx";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface LogsTableProps {
  logs: LoginLog[];
}

const columnHelper = createColumnHelper<LoginLog>();

export default function LogsTable({ logs }: LogsTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => [
      columnHelper.accessor("user_name", {
        header: "User Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("user_email", {
        header: "Email",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("login_time", {
        header: "Login Time",
        cell: (info) => new Date(info.getValue()).toLocaleString(),
      }),
      columnHelper.accessor("logout_time", {
        header: "Logout Time",
        cell: (info) => {
          const value = info.getValue();
          return value ? new Date(value).toLocaleString() : "Active Session";
        },
      }),
      columnHelper.accessor("duration_minutes", {
        header: "Duration",
        cell: (info) => {
          const value = info.getValue();
          if (!value) return "Active";
          
          const hours = Math.floor(value / 60);
          const minutes = value % 60;
          
          if (hours > 0) {
            return `${hours}h ${minutes}m`;
          }
          return `${minutes}m`;
        },
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        cell: (info) => {
          const logoutTime = info.row.original.logout_time;
          return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              logoutTime 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {logoutTime ? "Completed" : "Active"}
            </span>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const exportToExcel = () => {
    const exportData = logs.map(log => ({
      "User Name": log.user_name,
      "Email": log.user_email,
      "Login Time": new Date(log.login_time).toLocaleString(),
      "Logout Time": log.logout_time ? new Date(log.logout_time).toLocaleString() : "Active Session",
      "Duration (minutes)": log.duration_minutes || "Active",
      "Status": log.logout_time ? "Completed" : "Active",
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, "Login Logs");
    XLSX.writeFile(wb, "login_logs.xlsx");
  };

  const getStats = () => {
    const totalLogs = logs.length;
    const activeSessions = logs.filter(log => !log.logout_time).length;
    const completedSessions = totalLogs - activeSessions;
    const avgDuration = logs
      .filter(log => log.duration_minutes)
      .reduce((acc, log) => acc + (log.duration_minutes || 0), 0) / 
      logs.filter(log => log.duration_minutes).length || 0;

    return {
      totalLogs,
      activeSessions,
      completedSessions,
      avgDuration: Math.round(avgDuration),
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Logins
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalLogs}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 bg-yellow-400 rounded-full"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Sessions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.activeSessions}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 bg-green-400 rounded-full"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Sessions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.completedSessions}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg Duration
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.avgDuration}m
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full bg-gray-800 text-white placeholder-gray-400"
          />
        </div>
        
        <button
          onClick={exportToExcel}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          Export to Excel
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {logs.length === 0 && (
        <div className="text-center py-12">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No login logs</h3>
          <p className="mt-1 text-sm text-gray-500">
            No login activity has been recorded yet.
          </p>
        </div>
      )}
    </div>
  );
} 