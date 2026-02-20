"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SalesHistoryChart from "@/src/components/admin/SalesHistoryChart";
import OrdersActivityChart from "@/src/components/admin/OrdersActivityChart";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    lowStock: 0,
  });

  // Simulate loading stats (replace with actual API calls)
  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      totalProducts: 156,
      totalOrders: 1243,
      totalRevenue: 45678.90,
      totalCustomers: 892,
      pendingOrders: 23,
      lowStock: 12,
    });
  }, []);

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
      change: "+12%",
      changeColor: "text-emerald-400",
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
      change: "+8%",
      changeColor: "text-emerald-400",
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
      change: "+15%",
      changeColor: "text-emerald-400",
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
      change: "+5%",
      changeColor: "text-emerald-400",
    },
  ];

  const alertCards = [
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/30",
      href: "/admin/orders?status=pending",
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-800/50 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-yellow-400/50 transition-all duration-300"
          >
            {/* Yellow gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="relative p-6">
              {/* Header with icon and change badge */}
              <div className="flex items-start justify-between mb-6">
                <div className={`${stat.iconColor} group-hover:text-yellow-400 transition-colors duration-300`}>
                  {stat.icon}
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm`}
                >
                  <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className={`text-xs font-bold ${stat.changeColor}`}>
                    {stat.change}
                  </span>
                </motion.div>
              </div>

              {/* Title and Value */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider group-hover:text-gray-300 transition-colors duration-300">
                  {stat.title}
                </h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="text-3xl font-black text-white tracking-tight group-hover:text-yellow-400 transition-colors duration-300"
                >
                  {stat.value}
                </motion.p>
              </div>

              {/* Yellow bottom accent on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
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
            <div className={`absolute inset-0 bg-gradient-to-br ${alert.color === "text-yellow-400" ? "from-yellow-400/10" : "from-red-400/10"} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
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
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${alert.color === "text-yellow-400" ? "bg-yellow-400" : "bg-red-400"} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </motion.a>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesHistoryChart title="Sales History" />
        <OrdersActivityChart title="Orders Activity" />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-black text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products/new"
            className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all cursor-pointer"
          >
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-white font-semibold">Add New Product</span>
          </a>
          <a
            href="/admin/orders"
            className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all cursor-pointer"
          >
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-white font-semibold">View Orders</span>
          </a>
        </div>
      </div>
    </div>
  );
}

