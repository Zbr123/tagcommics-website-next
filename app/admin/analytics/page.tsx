"use client";

import { useEffect, useMemo, useState } from "react";
import MetricCard from "@/src/components/admin/MetricCard";
import SalesHistoryChart from "@/src/components/admin/SalesHistoryChart";
import OrdersActivityChart from "@/src/components/admin/OrdersActivityChart";
import { useAuth } from "@/src/hooks/use-auth";
import { fetchAdminSales, type AdminSalesPoint } from "@/src/lib/admin-dashboard-api";

export default function AdminAnalytics() {
  const { token } = useAuth();
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [salesData, setSalesData] = useState<AdminSalesPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      const result = await fetchAdminSales(token, period);
      if (!mounted) return;
      if (result.ok) {
        setSalesData(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [token, period]);

  const revenueSeries = useMemo(
    () => salesData.map((p) => ({ label: p.period, value: p.revenue })),
    [salesData]
  );
  const ordersSeries = useMemo(
    () => salesData.map((p) => ({ label: p.period, value: p.orders })),
    [salesData]
  );

  const totals = useMemo(() => {
    const totalRevenue = salesData.reduce((sum, p) => sum + p.revenue, 0);
    const totalOrders = salesData.reduce((sum, p) => sum + p.orders, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return { totalRevenue, totalOrders, averageOrderValue };
  }, [salesData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Analytics</h1>
        <p className="text-gray-400">View detailed analytics and reports</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(["week", "month", "year"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
              period === p
                ? "border-brand bg-brand/15 text-brand"
                : "border-white/15 bg-white/5 text-gray-300 hover:border-brand/40"
            }`}
          >
            {p[0].toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-xl border border-amber-400/30 bg-amber-950/25 px-4 py-3 text-sm text-amber-100">
          <p className="font-bold text-amber-200">Could not load analytics</p>
          <p className="mt-1 text-amber-100/90">{error}</p>
        </div>
      ) : null}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesHistoryChart title="Sales Revenue" data={revenueSeries} unit="Revenue" />
        <OrdersActivityChart title="Orders Trend" data={ordersSeries} />
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Average Order Value"
          value={`$${totals.averageOrderValue.toFixed(2)}`}
          subtitle={`Derived from ${totals.totalOrders.toLocaleString()} orders`}
          accent="brand"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${totals.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle={`For selected ${period} period`}
          accent="green"
        />
        <MetricCard
          title="Total Orders"
          value={totals.totalOrders.toLocaleString()}
          subtitle={loading ? "Refreshing..." : "From paid sales dataset"}
          accent="blue"
        />
      </div>
    </div>
  );
}

