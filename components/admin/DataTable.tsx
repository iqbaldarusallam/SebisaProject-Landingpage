"use client";

import React, { useMemo, useState } from "react";
import { FiDownload, FiEdit2, FiSearch, FiTrash2 } from "react-icons/fi";

export type DataTableColumn<T> = {
  key: keyof T | "actions";
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
};

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
  exportFilename?: string;
  exportRow?: (row: T) => Record<string, string | number | boolean | null>;
  searchFields?: (row: T) => Array<string | number | boolean | null | undefined>;
  searchPlaceholder?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
  actions,
  exportFilename,
  exportRow,
  searchFields,
  searchPlaceholder = "Cari data...",
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [exporting, setExporting] = useState(false);

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return data;

    return data.filter((row) =>
      getSearchText(row, columns, searchFields).toLowerCase().includes(query),
    );
  }, [columns, data, searchFields, searchQuery]);

  const handleExport = async () => {
    if (!exportFilename || filteredData.length === 0) return;

    setExporting(true);
    try {
      const XLSX = await import("xlsx");
      const rows = filteredData.map((row) =>
        exportRow ? exportRow(row) : defaultExportRow(row, columns),
      );
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      XLSX.writeFile(workbook, `${exportFilename}.xlsx`);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <div className="inline-block animate-pulse text-sm font-semibold text-gray-600">
          Loading...
        </div>
      </div>
    );
  }

  const shouldRenderActions =
    (onEdit || onDelete || actions) &&
    !columns.some((column) => column.key === "actions");

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-xs">
          <FiSearch
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm outline-none transition focus:border-[#173472] focus:ring-2 focus:ring-[#173472]/15"
          />
        </label>

        {exportFilename && (
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting || filteredData.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#173472] px-4 py-2 text-sm font-bold text-[#173472] transition hover:bg-[#173472] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiDownload aria-hidden />
            {exporting ? "Exporting..." : "Export Excel"}
          </button>
        )}
      </div>

      {filteredData.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-600">
            {data.length === 0 ? "No data found" : "Data tidak ditemukan"}
          </p>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${
                    col.width || ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
              {shouldRenderActions && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                  >
                    {col.key === "actions"
                      ? actions
                        ? actions(row)
                        : null
                      : col.render
                        ? col.render(row[col.key], row)
                        : formatValue(row[col.key])}
                  </td>
                ))}
                {shouldRenderActions && (
                  <td className="space-x-3 whitespace-nowrap px-6 py-4 text-sm font-medium">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="inline-flex items-center gap-1.5 text-[#173472] hover:text-[#131C36]"
                      >
                        <FiEdit2 aria-hidden />
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 aria-hidden />
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  if (typeof value === "number" && String(value).includes(".")) {
    return value.toFixed(2);
  }
  return String(value);
}

function getSearchText<T>(
  row: T,
  columns: DataTableColumn<T>[],
  searchFields?: (row: T) => Array<string | number | boolean | null | undefined>,
) {
  if (searchFields) {
    return searchFields(row).map(formatValue).join(" ");
  }

  return columns
    .filter((column) => column.key !== "actions")
    .map((column) => formatValue(row[column.key as keyof T]))
    .join(" ");
}

function defaultExportRow<T>(
  row: T,
  columns: DataTableColumn<T>[],
): Record<string, string | number | boolean | null> {
  return columns
    .filter((column) => column.key !== "actions")
    .reduce<Record<string, string | number | boolean | null>>((acc, column) => {
      const value = row[column.key as keyof T];
      acc[column.label] = normalizeExportValue(value);
      return acc;
    }, {});
}

function normalizeExportValue(value: unknown): string | number | boolean | null {
  if (value === undefined) return null;
  if (value === null) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value;
  return JSON.stringify(value);
}
