"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/src/components/admin/MetricCard";
import SalesHistoryChart from "@/src/components/admin/SalesHistoryChart";
import OrdersActivityChart from "@/src/components/admin/OrdersActivityChart";
import { useAuth } from "@/src/hooks/use-auth";
import { fetchAdminOverview, fetchAdminSales, type AdminSalesPoint } from "@/src/lib/admin-dashboard-api";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    lowStock: 0,
  });
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

      const [overview, sales] = await Promise.all([
        fetchAdminOverview(token),
        fetchAdminSales(token, "month"),
      ]);

      if (!mounted) return;

      if (overview.ok) {
        setStats(overview.data);
      } else {
        setError(overview.error);
      }

      if (sales.ok) {
        setSalesData(sales.data);
      }

      setLoading(false);
    };

    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  const ordersChart = useMemo(
    () => salesData.map((p) => ({ label: p.period, value: p.orders })),
    [salesData]
  );
  const revenueChart = useMemo(
    () => salesData.map((p) => ({ label: p.period, value: p.revenue })),
    [salesData]
  );

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      iconColor: "text-gray-400",
      subtitle: "Live",
      accent: "gray" as const,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      iconColor: "text-gray-400",
      subtitle: "Live",
      accent: "gray" as const,
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconColor: "text-gray-400",
      subtitle: "Paid orders",
      accent: "green" as const,
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      iconColor: "text-gray-400",
      subtitle: "Registered customers",
      accent: "blue" as const,
    },
  ];

  const alertCards = [
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      color: "text-brand",
      bgColor: "bg-brand/10",
      borderColor: "border-brand/30",
      href: "/admin/orders?status=placed",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStock,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      borderColor: "border-red-400/30",
      href: "/admin/products?stock=low",
    },
  ];


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to the admin panel. Here's what's happening with your store.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-amber-400/30 bg-amber-950/25 px-4 py-3 text-sm text-amber-100">
          <p className="font-bold text-amber-200">Could not load live dashboard metrics</p>
          <p className="mt-1 text-amber-100/90">{error}</p>
        </div>
      ) : null}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <MetricCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            accent={stat.accent}
            delay={index * 0.08}
          />
        ))}
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alertCards.map((alert, index) => (
          <motion.a
            key={index}
            href={alert.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            className={`group relative overflow-hidden ${alert.bgColor} ${alert.borderColor} border-2 rounded-2xl p-6 cursor-pointer backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${alert.color === "text-brand" ? "from-brand/10" : "from-red-400/10"} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative flex items-center justify-between">
              <div className="space-y-2">
                <h3 className={`text-sm font-bold ${alert.color} uppercase tracking-wider`}>
                  {alert.title}
                </h3>
                <motion.p
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-4xl font-black text-white tracking-tight"
                >
                  {alert.value}
                </motion.p>
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className={`relative`}
              >
                <div className={`absolute inset-0 ${alert.color} opacity-20 blur-xl`} />
                <svg className={`relative w-16 h-16 ${alert.color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </motion.div>
            </div>
            
            {/* Bottom accent line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${alert.color === "text-brand" ? "bg-brand" : "bg-red-400"} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </motion.a>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesHistoryChart title="Sales Revenue" data={revenueChart} unit="Revenue" />
        <OrdersActivityChart title="Orders Activity" data={ordersChart} />
      </div>

      {loading ? <p className="text-sm text-gray-500">Refreshing dashboard metrics...</p> : null}

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-black text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products"
            className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-brand hover:bg-brand/10 transition-all cursor-pointer"
          >
            <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-white font-semibold">View Product</span>
          </a>
          <a
            href="/admin/orders"
            className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-brand hover:bg-brand/10 transition-all cursor-pointer"
          >
            <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-white font-semibold">View Orders</span>
          </a>
        </div>
      </div>
    </div>
  );
}

