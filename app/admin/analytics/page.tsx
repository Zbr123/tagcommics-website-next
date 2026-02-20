"use client";

import SalesHistoryChart from "@/src/components/admin/SalesHistoryChart";
import OrdersActivityChart from "@/src/components/admin/OrdersActivityChart";

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Analytics</h1>
        <p className="text-gray-400">View detailed analytics and reports</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesHistoryChart title="Monthly Sales Overview" />
        <OrdersActivityChart title="Daily Orders Trend" />
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Average Order Value</h3>
          <p className="text-3xl font-black text-yellow-400">$45.67</p>
          <p className="text-xs text-green-400 mt-2">+12% from last month</p>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Conversion Rate</h3>
          <p className="text-3xl font-black text-yellow-400">3.24%</p>
          <p className="text-xs text-green-400 mt-2">+0.5% from last month</p>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Top Category</h3>
          <p className="text-3xl font-black text-yellow-400">Comics</p>
          <p className="text-xs text-gray-400 mt-2">42% of total sales</p>
        </div>
      </div>
    </div>
  );
}

