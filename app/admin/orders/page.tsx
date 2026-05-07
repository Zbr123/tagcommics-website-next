"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/src/hooks/use-auth";
import {
  listAdminOrders,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
  updateAdminTrackingNumber,
  type AdminOrder as Order,
} from "@/src/lib/admin-orders-api";

interface OrderItem {
  id: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  image: string;
}

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as const;
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed"] as const;

export default function AdminOrders() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("All");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (!statusParam) return;
    const normalized = statusParam.toLowerCase();
    if (normalized === "placed") setFilterStatus("Pending");
    else if (normalized === "pending") setFilterStatus("Pending");
    else if (normalized === "processing") setFilterStatus("Processing");
    else if (normalized === "shipped") setFilterStatus("Shipped");
    else if (normalized === "delivered") setFilterStatus("Delivered");
    else if (normalized === "cancelled") setFilterStatus("Cancelled");
  }, [searchParams]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setOrders([]);
      return;
    }

    let mounted = true;
    const loadOrders = async () => {
      setLoading(true);
      setError(null);
      const result = await listAdminOrders(token);
      if (!mounted) return;
      if (result.ok) {
        setOrders(result.data);
      } else {
        setOrders([]);
        setError(result.error);
      }
      setLoading(false);
    };

    loadOrders();
    return () => {
      mounted = false;
    };
  }, [token]);

  const applyUpdatedOrder = (updated: Order) => {
    setOrders((prev) => prev.map((order) => (order.id === updated.id ? updated : order)));
    setSelectedOrder((prev) => (prev && prev.id === updated.id ? updated : prev));
  };

  const handleStatusChange = async (orderId: string, newStatus: typeof ORDER_STATUSES[number]) => {
    if (!token) return;
    const result = await updateAdminOrderStatus(token, orderId, newStatus.toLowerCase());
    if (result.ok) {
      applyUpdatedOrder(result.data);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newPaymentStatus: typeof PAYMENT_STATUSES[number]) => {
    if (!token) return;
    const result = await updateAdminPaymentStatus(token, orderId, newPaymentStatus.toLowerCase());
    if (result.ok) {
      applyUpdatedOrder(result.data);
    }
  };

  const handleTrackingInputChange = (orderId: string, trackingNumber: string) => {
    setSelectedOrder((prev) => (prev && prev.id === orderId ? { ...prev, trackingNumber } : prev));
  };

  const handleTrackingPersist = async (orderId: string, trackingNumber: string) => {
    if (!token) return;
    const normalized = trackingNumber.trim();
    if (!normalized) return;
    const result = await updateAdminTrackingNumber(token, orderId, normalized);
    if (result.ok) {
      applyUpdatedOrder(result.data);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const matchesPaymentStatus =
      filterPaymentStatus === "All" || order.paymentStatus === filterPaymentStatus;

    const orderDate = new Date(order.orderDate);
    const matchesDateRange =
      (!dateRange.start || orderDate >= new Date(dateRange.start)) &&
      (!dateRange.end || orderDate <= new Date(dateRange.end + "T23:59:59"));

    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDateRange;
  });

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    processing: orders.filter((o) => o.status === "Processing").length,
    shipped: orders.filter((o) => o.status === "Shipped").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    cancelled: orders.filter((o) => o.status === "Cancelled").length,
    totalRevenue: orders
      .filter((o) => o.status === "Delivered")
      .reduce((sum, o) => sum + o.total, 0),
    pendingPayment: orders.filter((o) => o.paymentStatus === "Pending").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Processing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Shipped":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Orders</h1>
        <p className="text-gray-400">Manage and track customer orders</p>
      </div>
      {error ? (
        <div className="rounded-xl border border-amber-400/30 bg-amber-950/25 px-4 py-3 text-sm text-amber-100">
          <p className="font-bold text-amber-200">Could not load orders</p>
          <p className="mt-1 text-amber-100/90">{error}</p>
        </div>
      ) : null}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-3 sm:p-4"
        >
          <p className="text-gray-400 text-xs font-semibold mb-1">Total</p>
          <p className="text-xl sm:text-2xl font-black text-white">{stats.total}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-brand/30 p-3 sm:p-4"
        >
          <p className="text-yellow-400 text-xs font-semibold mb-1">Pending</p>
          <p className="text-xl sm:text-2xl font-black text-white">{stats.pending}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-blue-500/30 p-3 sm:p-4"
        >
          <p className="text-blue-400 text-xs font-semibold mb-1">Processing</p>
          <p className="text-xl sm:text-2xl font-black text-white">{stats.processing}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-brand/30 p-3 sm:p-4"
        >
          <p className="text-purple-400 text-xs font-semibold mb-1">Shipped</p>
          <p className="text-xl sm:text-2xl font-black text-white">{stats.shipped}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-green-500/30 p-3 sm:p-4"
        >
          <p className="text-green-400 text-xs font-semibold mb-1">Delivered</p>
          <p className="text-xl sm:text-2xl font-black text-white">{stats.delivered}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-red-500/30 p-3 sm:p-4"
        >
          <p className="text-red-400 text-xs font-semibold mb-1">Cancelled</p>
          <p className="text-xl sm:text-2xl font-black text-white">{stats.cancelled}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-brand/30 p-3 sm:p-4"
        >
          <p className="text-yellow-400 text-xs font-semibold mb-1">Revenue</p>
          <p className="text-lg sm:text-xl font-black text-white">${stats.totalRevenue.toFixed(2)}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-brand/30 p-3 sm:p-4"
        >
          <p className="text-yellow-400 text-xs font-semibold mb-1">Pending Payment</p>
          <p className="text-xl sm:text-2xl font-black text-white">{stats.pendingPayment}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Search</label>
            <input
              type="text"
              placeholder="Order #, Customer, Email, Tracking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Order Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand"
            >
              <option value="All">All Statuses</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Payment Status</label>
            <select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand"
            >
              <option value="All">All Payment Statuses</option>
              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand"
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden w-full">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <p className="text-gray-400">Loading orders...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <p className="text-gray-400">No orders found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-white font-semibold text-sm">{order.orderNumber}</p>
                      {order.trackingNumber && (
                        <p className="text-gray-400 text-xs mt-1">Track: {order.trackingNumber}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-semibold text-sm">{order.customerName}</p>
                        <p className="text-gray-400 text-xs hidden sm:block">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-gray-300 text-sm">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(order.orderDate).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <p className="text-white font-semibold text-sm">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-bold text-sm">${order.total.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value as typeof ORDER_STATUSES[number]
                          )
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-brand/50 min-w-[150px] w-auto ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          handlePaymentStatusChange(
                            order.id,
                            e.target.value as typeof PAYMENT_STATUSES[number]
                          )
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-brand/50 min-w-[130px] w-auto ${getPaymentStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        {PAYMENT_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="px-4 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-brand font-semibold rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Count */}
      <div className="text-center text-gray-400 text-sm">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedOrder && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsDetailModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            >
              <div
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl border border-gray-800 w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-800 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                  <div className="flex-1 min-w-0 pr-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white truncate">{selectedOrder.orderNumber}</h2>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      Placed on {new Date(selectedOrder.orderDate).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Status and Payment Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-400 mb-2">
                        Order Status
                      </label>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) =>
                          handleStatusChange(
                            selectedOrder.id,
                            e.target.value as typeof ORDER_STATUSES[number]
                          )
                        }
                        className={`w-full px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border focus:outline-none focus:ring-2 focus:ring-brand/50 ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-400 mb-2">
                        Payment Status
                      </label>
                      <select
                        value={selectedOrder.paymentStatus}
                        onChange={(e) =>
                          handlePaymentStatusChange(
                            selectedOrder.id,
                            e.target.value as typeof PAYMENT_STATUSES[number]
                          )
                        }
                        className={`w-full px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border focus:outline-none focus:ring-2 focus:ring-brand/50 ${getPaymentStatusColor(
                          selectedOrder.paymentStatus
                        )}`}
                      >
                        {PAYMENT_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700">
                    <h3 className="text-base sm:text-lg font-black text-white mb-3 sm:mb-4">Customer Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Name</p>
                        <p className="text-white font-semibold">{selectedOrder.customerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Email</p>
                        <p className="text-white font-semibold">{selectedOrder.customerEmail}</p>
                      </div>
                      {selectedOrder.customerPhone && (
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Phone</p>
                          <p className="text-white font-semibold">{selectedOrder.customerPhone}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Payment Method</p>
                        <p className="text-white font-semibold">{selectedOrder.paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700">
                    <h3 className="text-base sm:text-lg font-black text-white mb-3 sm:mb-4">Shipping Address</h3>
                    <div className="text-white">
                      <p className="font-semibold">{selectedOrder.shippingAddress.fullName}</p>
                      <p className="text-gray-300">{selectedOrder.shippingAddress.address}</p>
                      <p className="text-gray-300">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-300">{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>

                  {/* Tracking Number */}
                  {(selectedOrder.status === "Shipped" ||
                    selectedOrder.status === "Delivered") && (
                    <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-400 mb-2">
                        Tracking Number
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={selectedOrder.trackingNumber || ""}
                          onChange={(e) => handleTrackingInputChange(selectedOrder.id, e.target.value)}
                          onBlur={(e) => handleTrackingPersist(selectedOrder.id, e.target.value)}
                          placeholder="Enter tracking number"
                          className="flex-1 px-3 sm:px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand text-sm"
                        />
                      </div>
                      {selectedOrder.estimatedDelivery && (
                        <p className="text-gray-400 text-xs mt-2">
                          Estimated Delivery:{" "}
                          {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}
                        </p>
                      )}
                      {selectedOrder.deliveredDate && (
                        <p className="text-green-400 text-xs mt-2">
                          Delivered: {new Date(selectedOrder.deliveredDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700">
                    <h3 className="text-base sm:text-lg font-black text-white mb-3 sm:mb-4">Order Items</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 bg-gray-900/50 rounded-lg"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm sm:text-base truncate">{item.title}</p>
                            <p className="text-gray-400 text-xs sm:text-sm truncate">{item.author}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-white font-semibold text-xs sm:text-sm">Qty: {item.quantity}</p>
                            <p className="text-yellow-400 font-bold text-sm sm:text-base">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700">
                    <h3 className="text-base sm:text-lg font-black text-white mb-3 sm:mb-4">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-400">
                        <span>Subtotal</span>
                        <span className="text-white">${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Shipping</span>
                        <span className="text-white">
                          {selectedOrder.shipping === 0 ? (
                            <span className="text-green-400">FREE</span>
                          ) : (
                            `$${selectedOrder.shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Tax</span>
                        <span className="text-white">${selectedOrder.tax.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-700 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-black text-white">Total</span>
                          <span className="text-2xl font-black text-yellow-400">
                            ${selectedOrder.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700">
                    <h3 className="text-base sm:text-lg font-black text-white mb-3 sm:mb-4">Order Timeline</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <div>
                          <p className="text-white text-sm font-semibold">Order Placed</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(selectedOrder.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {selectedOrder.status !== "Pending" && (
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                          <div>
                            <p className="text-white text-sm font-semibold">
                              Status: {selectedOrder.status}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {new Date(selectedOrder.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedOrder.deliveredDate && (
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          <div>
                            <p className="text-white text-sm font-semibold">Delivered</p>
                            <p className="text-gray-400 text-xs">
                              {new Date(selectedOrder.deliveredDate).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
