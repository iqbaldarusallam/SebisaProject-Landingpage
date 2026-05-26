"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiSave, FiX } from "react-icons/fi";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/admin/DataTable";
import { Select, TextInput } from "@/components/admin/FormField";

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

type AdminForm = {
  name: string;
  email: string;
  role: string;
  password: string;
};

const emptyForm: AdminForm = {
  name: "",
  email: "",
  role: "admin",
  password: "",
};

const adminRoleOption = [{ value: "admin", label: "Admin" }];
const superAdminRoleOption = [
  { value: "super_admin", label: "Super Admin" },
];

function getRoleLabel(role: string) {
  return role === "super_admin" ? "Super Admin" : "Admin";
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [formData, setFormData] = useState<AdminForm>(emptyForm);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admins");
      const data = await res.json();
      setAdmins(data.data || []);
    } catch (error) {
      console.error(error);
      setError("Gagal memuat data admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const resetForm = () => {
    setEditingAdmin(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      password: "",
    });
  };

  const handleDelete = async (admin: Admin) => {
    if (admin.role === "super_admin") {
      alert("Super admin utama tidak boleh dihapus");
      return;
    }

    if (!confirm(`Delete admin "${admin.email}"?`)) return;

    try {
      const res = await fetch(`/api/admins/${admin.id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setAdmins((current) => current.filter((item) => item.id !== admin.id));
      if (editingAdmin?.id === admin.id) resetForm();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Gagal menghapus admin");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const method = editingAdmin ? "PUT" : "POST";
      const url = editingAdmin ? `/api/admins/${editingAdmin.id}` : "/api/admins";
      const payload = editingAdmin
        ? { ...formData, password: formData.password || "" }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.message || "Gagal menyimpan admin");
        return;
      }

      if (editingAdmin) {
        setAdmins((current) =>
          current.map((item) => (item.id === data.data.id ? data.data : item)),
        );
      } else {
        setAdmins((current) => [data.data, ...current]);
      }

      resetForm();
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan saat menyimpan admin");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: DataTableColumn<Admin>[] = [
    { key: "name", label: "Nama" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (value) => getRoleLabel(String(value)),
    },
    {
      key: "createdAt",
      label: "Dibuat",
      render: (value) => new Date(String(value)).toLocaleString("id-ID"),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admins</h1>
        <p className="text-gray-600">
          Kelola akun admin yang bisa masuk ke panel ini.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-black text-slate-950">
            {editingAdmin ? "Edit Admin" : "Tambah Admin"}
          </h2>
          {editingAdmin && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <FiX aria-hidden />
              Batal Edit
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Nama Admin"
            value={formData.name}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, name: event.target.value }))
            }
            required
          />
          <TextInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, email: event.target.value }))
            }
            required
          />
          <Select
            label="Role"
            value={formData.role}
            options={
              editingAdmin?.role === "super_admin"
                ? superAdminRoleOption
                : adminRoleOption
            }
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, role: event.target.value }))
            }
            disabled={editingAdmin?.role === "super_admin"}
            required
          />
          <TextInput
            label={editingAdmin ? "Password Baru" : "Password"}
            type="password"
            value={formData.password}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
            placeholder={editingAdmin ? "Kosongkan jika tidak diganti" : ""}
            required={!editingAdmin}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-[#173472] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#131C36] disabled:opacity-50"
        >
          {editingAdmin ? <FiSave aria-hidden /> : <FiPlus aria-hidden />}
          {submitting
            ? "Menyimpan..."
            : editingAdmin
              ? "Simpan Admin"
              : "Tambah Admin"}
        </button>
      </form>

      <DataTable
        columns={columns}
        data={admins}
        loading={loading}
        exportFilename="admins"
        searchPlaceholder="Cari admin..."
        searchFields={(admin) => [
          admin.name,
          admin.email,
          getRoleLabel(admin.role),
          new Date(admin.createdAt).toLocaleString("id-ID"),
        ]}
        exportRow={(admin) => ({
          ID: admin.id,
          Nama: admin.name,
          Email: admin.email,
          Role: getRoleLabel(admin.role),
          "Dibuat Pada": new Date(admin.createdAt).toLocaleString("id-ID"),
        })}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
