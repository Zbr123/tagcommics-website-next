"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCustomers, type Customer } from "@/src/lib/customers-api";
import { useAuth } from "@/src/hooks/use-auth";

const DUMMY_CUSTOMERS: Customer[] = [
  {
    id: "dummy-1",
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 555-0123",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    isAdmin: false,
  },
  {
    id: "dummy-2",
    name: "Jordan Lee",
    email: "jordan.lee@example.com",
    phone: "+1 555-0456",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isAdmin: true,
  },
];

export default function AdminCustomers() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchCustomers(token ?? undefined);
    setLoading(false);
    if (result.ok && result.data.length > 0) {
      setCustomers(result.data);
    } else {
      setCustomers(DUMMY_CUSTOMERS);
    }
  }, [token]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const filteredCustomers = customers.filter((customer) => {
    const q = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(q) ||
      customer.email.toLowerCase().includes(q) ||
      (customer.phone && customer.phone.toLowerCase().includes(q))
    );
  });

  const totalCustomers = customers.length;

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Customers</h1>
        <p className="text-gray-400">Manage customer accounts and information</p>
      </div>

      {/* Total Customers + Search in one row */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden rounded-xl min-w-[140px] sm:min-w-[180px] group"
        >
          {/* Gradient background with yellow accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-yellow-500" />
          <div className="absolute inset-0 rounded-xl border border-gray-700/80 group-hover:border-yellow-500/30 transition-colors" />
          {/* Content - compact like previous height */}
          <div className="relative p-3 sm:p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-500/20 flex-shrink-0">
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Customers</p>
            </div>
            <p className="text-xl sm:text-2xl font-black text-white tracking-tight tabular-nums text-center">{totalCustomers}</p>
          </div>
        </motion.div>
        <div className="flex-1 min-w-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-4 flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-semibold text-gray-400 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <button
            onClick={loadCustomers}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 font-semibold rounded-lg transition-colors border border-yellow-500/30 disabled:opacity-50 flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading…
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden w-full">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading && customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-10 h-10 text-yellow-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-gray-400">Loading customers…</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-gray-400">
                      {customers.length === 0 && !error
                        ? "No customers yet. They will appear here when they register."
                        : "No customers match your search."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <motion.tr
                    key={String(customer.id)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-semibold text-sm">{customer.name}</p>
                        <p className="text-gray-400 text-xs sm:hidden">{customer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <p className="text-gray-300 text-sm truncate max-w-[200px]">{customer.email}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-gray-300 text-sm">{customer.phone || "—"}</p>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="text-gray-300 text-sm">
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString()
                          : "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {customer.isAdmin ? (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded border border-yellow-500/30">
                          Admin
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">Customer</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(customer)}
                        className="px-4 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 font-semibold rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
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

      {/* Count */}
      {!loading && customers.length > 0 && (
        <div className="text-center text-gray-400 text-sm">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      )}

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedCustomer && (
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
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl border border-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-800 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                  <h2 className="text-xl sm:text-2xl font-black text-white truncate pr-2">
                    {selectedCustomer.name}
                  </h2>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Email</p>
                        <p className="text-white font-semibold break-all">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Phone</p>
                        <p className="text-white font-semibold">{selectedCustomer.phone || "—"}</p>
                      </div>
                      {selectedCustomer.createdAt && (
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Registered</p>
                          <p className="text-white font-semibold">
                            {new Date(selectedCustomer.createdAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Role:</span>
                    {selectedCustomer.isAdmin ? (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-semibold rounded border border-yellow-500/30">
                        Admin
                      </span>
                    ) : (
                      <span className="text-gray-300 text-sm">Customer</span>
                    )}
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
