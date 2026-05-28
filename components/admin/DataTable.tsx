"use client";

import React, { useMemo, useState } from "react";
import {
  FiDownload,
  FiEdit2,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";

export type DataTableColumn<T> = {
  key: keyof T | "actions";
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
};

export type DataTableFilterOption = {
  label: string;
  value: string;
};

export type DataTableFilter<T> = {
  id: string;
  label: string;
  allLabel?: string;
  display?: "tabs" | "select";
  options: DataTableFilterOption[];
  getValue: (
    row: T,
  ) =>
    | string
    | number
    | boolean
    | null
    | undefined
    | Array<string | number | boolean | null | undefined>;
};

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void | Promise<void>;
  actions?: (row: T) => React.ReactNode;
  exportFilename?: string;
  exportRow?: (row: T) => Record<string, string | number | boolean | null>;
  searchFields?: (
    row: T,
  ) => Array<string | number | boolean | null | undefined>;
  searchPlaceholder?: string;
  filters?: DataTableFilter<T>[];
  initialPageSize?: number;
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
  filters = [],
  initialPageSize = 10,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [exporting, setExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = initialPageSize;
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    () => Object.fromEntries(filters.map((filter) => [filter.id, "all"])),
  );

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return data.filter((row) => {
      const matchesSearch =
        !query ||
        getSearchText(row, columns, searchFields).toLowerCase().includes(query);

      if (!matchesSearch) return false;

      return filters.every((filter) => {
        const activeValue = activeFilters[filter.id] ?? "all";
        if (activeValue === "all") return true;

        const rowValue = filter.getValue(row);
        const normalizedValues = Array.isArray(rowValue)
          ? rowValue
          : [rowValue];

        return normalizedValues.some(
          (value) => normalizeFilterValue(value) === activeValue,
        );
      });
    });
  }, [activeFilters, columns, data, filters, searchFields, searchQuery]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    filters.some((filter) => (activeFilters[filter.id] ?? "all") !== "all");
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = filteredData.length ? (safeCurrentPage - 1) * pageSize : 0;
  const endIndex = Math.min(startIndex + pageSize, filteredData.length);
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const pageNumbers = getVisiblePageNumbers(safeCurrentPage, totalPages);

  const resetFilters = () => {
    setSearchQuery("");
    setActiveFilters(
      Object.fromEntries(filters.map((filter) => [filter.id, "all"])),
    );
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterId: string, value: string) => {
    setActiveFilters((current) => ({
      ...current,
      [filterId]: value,
    }));
    setCurrentPage(1);
  };

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

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !onDelete) return;

    setDeleting(true);
    try {
      await onDelete(deleteTarget);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <div className="inline-block animate-pulse text-sm font-semibold text-gray-600">
          Memuat...
        </div>
      </div>
    );
  }

  const shouldRenderActions =
    (onEdit || onDelete || actions) &&
    !columns.some((column) => column.key === "actions");

  return (
    <>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="space-y-4 border-b border-gray-200 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full lg:max-w-sm">
              <FiSearch
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#173472] focus:ring-2 focus:ring-[#173472]/15"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-100 px-3 text-xs font-bold text-slate-600">
                <FiFilter aria-hidden />
                {filteredData.length} dari {data.length} data
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  <FiX aria-hidden />
                  Reset Filter
                </button>
              )}

              {exportFilename && (
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={exporting || filteredData.length === 0}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#173472] px-4 text-sm font-bold text-[#173472] transition hover:bg-[#173472] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiDownload aria-hidden />
                  {exporting ? "Mengekspor..." : "Export Excel"}
                </button>
              )}
            </div>
          </div>

          {filters.length > 0 && (
            <div className="space-y-3">
              {filters.map((filter) => {
                const activeValue = activeFilters[filter.id] ?? "all";
                const allOption = {
                  label: filter.allLabel ?? `Semua ${filter.label}`,
                  value: "all",
                };
                const options = [allOption, ...filter.options];

                if (filter.display === "select") {
                  return (
                    <label
                      key={filter.id}
                      className="inline-flex min-w-52 flex-col gap-1 text-xs font-bold text-slate-600"
                    >
                      {filter.label}
                      <select
                        value={activeValue}
                        onChange={(event) =>
                          handleFilterChange(filter.id, event.target.value)
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#173472] focus:ring-2 focus:ring-[#173472]/15"
                      >
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  );
                }

                return (
                  <div key={filter.id} className="space-y-2">
                    <p className="text-xs font-black uppercase text-slate-400">
                      {filter.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {options.map((option) => {
                        const active = activeValue === option.value;
                        const count = getFilterOptionCount(
                          data,
                          filter,
                          option.value,
                        );

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              handleFilterChange(filter.id, option.value)
                            }
                            className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-xs font-bold transition ${
                              active
                                ? "border-[#173472] bg-[#173472] text-white shadow-lg shadow-blue-950/10"
                                : "border-slate-200 bg-white text-slate-600 hover:border-[#173472]/40 hover:bg-slate-50"
                            }`}
                          >
                            {option.label}
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] ${
                                active
                                  ? "bg-white/20 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {filteredData.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">
              {data.length === 0 ? "Belum ada data" : "Data tidak ditemukan"}
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
                      Aksi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((row, idx) => (
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
                            type="button"
                            onClick={() => onEdit(row)}
                            className="inline-flex items-center gap-1.5 text-[#173472] hover:text-[#131C36]"
                          >
                            <FiEdit2 aria-hidden />
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(row)}
                            className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 aria-hidden />
                            Hapus
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

        {filteredData.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span>
                Menampilkan{" "}
                <strong className="font-black text-slate-900">
                  {startIndex + 1}-{endIndex}
                </strong>{" "}
                dari{" "}
                <strong className="font-black text-slate-900">
                  {filteredData.length}
                </strong>{" "}
                data
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
                className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiChevronLeft aria-hidden />
                Prev
              </button>

              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`grid size-9 place-items-center rounded-lg border text-xs font-black transition ${
                    pageNumber === safeCurrentPage
                      ? "border-[#173472] bg-[#173472] text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={safeCurrentPage === totalPages}
                className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <FiChevronRight aria-hidden />
              </button>
            </div>
          </div>
        )}
      </div>
      {deleteTarget && (
        <div className="fixed inset-0 z-95 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-5 py-4">
              <p className="text-xs font-black uppercase text-red-500">
                Konfirmasi Hapus
              </p>
              <h3 className="mt-1 text-xl font-black text-slate-950">
                Hapus data ini?
              </h3>
            </div>

            <div className="px-5 py-4">
              <p className="text-sm leading-relaxed text-slate-600">
                Data{" "}
                <span className="font-bold text-slate-950">
                  {getRowLabel(deleteTarget)}
                </span>{" "}
                akan dihapus. Tindakan ini tidak bisa dibatalkan dari halaman
                ini.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function normalizeFilterValue(
  value: string | number | boolean | null | undefined,
) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function getFilterOptionCount<T>(
  data: T[],
  filter: DataTableFilter<T>,
  optionValue: string,
) {
  if (optionValue === "all") return data.length;

  return data.filter((row) => {
    const value = filter.getValue(row);
    const values = Array.isArray(value) ? value : [value];
    return values.some((item) => normalizeFilterValue(item) === optionValue);
  }).length;
}

function getVisiblePageNumbers(currentPage: number, totalPages: number) {
  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + maxVisible - 1);

  start = Math.max(1, end - maxVisible + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function getRowLabel(row: unknown) {
  if (!row || typeof row !== "object") return "ini";

  const record = row as Record<string, unknown>;
  const value =
    record.name ??
    record.title ??
    record.email ??
    record.brand ??
    record.code ??
    record.id;

  return value ? String(value) : "ini";
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Ya" : "Tidak";
  if (typeof value === "object") return JSON.stringify(value);
  if (typeof value === "number" && String(value).includes(".")) {
    return value.toFixed(2);
  }
  return String(value);
}

function getSearchText<T>(
  row: T,
  columns: DataTableColumn<T>[],
  searchFields?: (
    row: T,
  ) => Array<string | number | boolean | null | undefined>,
) {
  const values = [
    ...flattenSearchValues(row),
    ...columns
      .filter((column) => column.key !== "actions")
      .map((column) => row[column.key as keyof T]),
    ...(searchFields ? searchFields(row) : []),
  ];

  return Array.from(new Set(values.map(formatValue))).join(" ");
}

function flattenSearchValues(value: unknown): unknown[] {
  if (value === null || value === undefined) return [];

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return [value];
  }

  if (value instanceof Date) {
    return [value.toISOString()];
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenSearchValues);
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(
      flattenSearchValues,
    );
  }

  return [];
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

function normalizeExportValue(
  value: unknown,
): string | number | boolean | null {
  if (value === undefined) return null;
  if (value === null) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value;
  return JSON.stringify(value);
}
