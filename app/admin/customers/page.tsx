import { prisma } from "@/lib/db";
import { CustomersTable } from "./CustomersTable";

export const dynamic = "force-dynamic";

type CustomerSummary = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  latestOrderAt: string;
  latestPackage: string;
  latestStatus: string;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

function getCustomerKey(email: string) {
  return email.trim().toLowerCase();
}

export default async function CustomersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      package: true,
    },
  });

  const customers = Array.from(
    orders
      .reduce((map, order) => {
        const key = getCustomerKey(order.customerEmail);
        const existing = map.get(key);

        if (!existing) {
          map.set(key, {
            id: key,
            name: order.customerName,
            email: order.customerEmail,
            phone: order.customerPhone,
            orderCount: 1,
            totalSpent: order.totalPrice,
            latestOrderAt: order.createdAt.toISOString(),
            latestPackage: order.package?.name ?? "Paket sudah dihapus",
            latestStatus: order.status,
          });
          return map;
        }

        existing.orderCount += 1;
        existing.totalSpent += order.totalPrice;
        return map;
      }, new Map<string, CustomerSummary>())
      .values(),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">
          Data customer otomatis diambil dari form checkout yang sudah masuk.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Total Customer
          </p>
          <p className="mt-2 text-3xl font-black text-[#173472]">
            {customers.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total Order</p>
          <p className="mt-2 text-3xl font-black text-[#173472]">
            {orders.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Total Revenue
          </p>
          <p className="mt-2 text-3xl font-black text-[#173472]">
            {formatCurrency(
              orders.reduce((total, order) => total + order.totalPrice, 0),
            )}
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-black text-slate-950">
            Data Customer
          </h2>
          <p className="text-sm text-slate-500">
            Satu customer dikelompokkan berdasarkan email.
          </p>
        </div>

        <CustomersTable customers={customers} />
      </section>
    </div>
  );
}
