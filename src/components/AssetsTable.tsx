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
import { Asset } from "@/types";
import { editAsset, createAsset, deleteAsset } from "@/lib/api";
import * as XLSX from "xlsx";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

interface AssetsTableProps {
  assets: Asset[];
  onAssetUpdate: () => void;
}

const columnHelper = createColumnHelper<Asset>();

export default function AssetsTable({ assets, onAssetUpdate }: AssetsTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newAsset, setNewAsset] = useState({
    year_of_purchase: "",
    item_name: "",
    quantity: "",
    inventory_number: "",
    room_number: "",
    floor_number: "",
    building_block: "",
    remarks: "",
    department_origin: "own"
  });
  const [columnFilters, setColumnFilters] = useState({});
  const [sortBy, setSortBy] = useState({ column: "", order: "asc" });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo(
    () => [
      columnHelper.accessor("item_name", {
        header: "Item Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("quantity", {
        header: "Quantity",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("inventory_number", {
        header: "Inventory #",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("room_number", {
        header: "Room",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("floor_number", {
        header: "Floor",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("building_block", {
        header: "Building",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("year_of_purchase", {
        header: "Year",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("department_origin", {
        header: "Origin",
        cell: (info) => (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            info.getValue() === "own" 
              ? "bg-green-100 text-green-800" 
              : "bg-blue-100 text-blue-800"
          }`}>
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("remarks", {
        header: "Remarks",
        cell: (info) => (
          <div className="max-w-xs truncate" title={info.getValue()}>
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEditingAsset(info.row.original)}
              className="text-blue-600 hover:text-blue-900"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteAsset(info.row.original.id)}
              className="text-red-600 hover:text-red-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9 0a3 3 0 11-6 0 3 3 0 016 0zm-12 0a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: assets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
      columnFilters,
      sorting: sortBy,
      pagination: {
        pageIndex: page,
        pageSize: pageSize,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSortBy,
    onPaginationChange: setPage,
  });

  const handleEditAsset = async (updatedData: Partial<Asset>) => {
    if (!editingAsset) return;
    
    setIsEditing(true);
    try {
      await editAsset(editingAsset.id, updatedData);
      onAssetUpdate();
      setEditingAsset(null);
    } catch (error) {
      console.error("Error updating asset:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createAsset({
        ...newAsset,
        year_of_purchase: Number(newAsset.year_of_purchase),
        quantity: Number(newAsset.quantity)
      });
      setAddModalOpen(false);
      setNewAsset({
        year_of_purchase: "",
        item_name: "",
        quantity: "",
        inventory_number: "",
        room_number: "",
        floor_number: "",
        building_block: "",
        remarks: "",
        department_origin: "own"
      });
      onAssetUpdate();
    } catch (err) {
      alert("Failed to add asset");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    try {
      await deleteAsset(id);
      onAssetUpdate();
    } catch (err) {
      alert("Failed to delete asset");
    }
  };

  const exportToExcel = () => {
    const exportData = assets.map(asset => ({
      "Item Name": asset.item_name,
      "Quantity": asset.quantity,
      "Inventory Number": asset.inventory_number,
      "Room Number": asset.room_number,
      "Floor Number": asset.floor_number,
      "Building Block": asset.building_block,
      "Year of Purchase": asset.year_of_purchase,
      "Department Origin": asset.department_origin,
      "Remarks": asset.remarks,
      "Last Updated": new Date(asset.last_updated).toLocaleDateString(),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, "Assets");
    XLSX.writeFile(wb, "assets.xlsx");
  };

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets..."
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

      {/* Edit Modal */}
      {editingAsset && (
        <EditAssetModal
          asset={editingAsset}
          onClose={() => setEditingAsset(null)}
          onSave={handleEditAsset}
          isLoading={isEditing}
        />
      )}

      {/* Add Asset Modal */}
      {addModalOpen && (
        <AddAssetModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSave={handleAddAsset}
          isLoading={isCreating}
          newAsset={newAsset}
          setNewAsset={setNewAsset}
        />
      )}
    </div>
  );
}

interface EditAssetModalProps {
  asset: Asset;
  onClose: () => void;
  onSave: (data: Partial<Asset>) => Promise<void>;
  isLoading: boolean;
}

function EditAssetModal({ asset, onClose, onSave, isLoading }: EditAssetModalProps) {
  const [formData, setFormData] = useState({
    quantity: asset.quantity || 0,
    remarks: asset.remarks || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFormData(prev => ({ ...prev, quantity: value }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Edit Asset: {asset.item_name}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={handleQuantityChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                required
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Remarks
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  newAsset: Asset;
  setNewAsset: React.Dispatch<React.SetStateAction<Asset>>;
}

function AddAssetModal({ isOpen, onClose, onSave, isLoading, newAsset, setNewAsset }: AddAssetModalProps) {
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAsset(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Add New Asset
          </h3>
          
          <form onSubmit={onSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Item Name
              </label>
              <input
                type="text"
                name="item_name"
                value={newAsset.item_name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={newAsset.quantity}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Inventory Number
              </label>
              <input
                type="text"
                name="inventory_number"
                value={newAsset.inventory_number}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Room Number
              </label>
              <input
                type="text"
                name="room_number"
                value={newAsset.room_number}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Floor Number
              </label>
              <input
                type="text"
                name="floor_number"
                value={newAsset.floor_number}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Building Block
              </label>
              <input
                type="text"
                name="building_block"
                value={newAsset.building_block}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year of Purchase
              </label>
              <input
                type="number"
                name="year_of_purchase"
                value={newAsset.year_of_purchase}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department Origin
              </label>
              <select
                name="department_origin"
                value={newAsset.department_origin}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
              >
                <option value="own">Own</option>
                <option value="donated">Donated</option>
                <option value="purchased">Purchased</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={newAsset.remarks}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Add Asset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 