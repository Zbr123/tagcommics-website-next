"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Simple tooltip with yellow theme
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border-2 border-brand rounded-lg px-3 py-2 shadow-lg">
        <div className="text-lg font-semibold text-brand">
          {payload[0].value} orders
        </div>
      </div>
    );
  }
  return null;
};

interface OrdersActivityChartProps {
  title?: string;
  data?: { label: string; value: number }[] | null;
}

function recentDayLabels(count: number): string[] {
  const now = new Date();
  const labels: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    labels.push(d.toLocaleDateString("en-US", { day: "2-digit", month: "short" }));
  }
  return labels;
}

const OrdersActivityChart: React.FC<OrdersActivityChartProps> = ({
  title = "Orders Activity",
  data,
}) => {
  const sourceFromApi = Array.isArray(data)
    ? data.map((item) => ({ date: item.label, orders: item.value }))
    : [];

  const source =
    sourceFromApi.length > 0
      ? sourceFromApi
      : recentDayLabels(7).map((day) => ({
          date: day,
          orders: 0,
        }));

  const maxOrders = Math.max(sourceFromApi.length > 0 ? 30 : 1, ...source.map((item) => Number(item.orders) || 0));

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 shadow-sm">
      {/* Heading inside the card */}
      <h3 className="text-lg m-3 font-semibold text-white">{title}</h3>

      {/* Chart card with dotted grid background */}
      <div className="bg-gray-800/30 rounded-xl pr-6 pt-2 pb-3">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={source}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#58E8C1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#58E8C1" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            {/* Vertical Dotted Grid Background */}
            <CartesianGrid
              strokeDasharray="1 4"
              stroke="#374151"
              horizontal={true}
              vertical={true}
            />

            {/* X-Axis with tick marks */}
            <XAxis
              dataKey="date"
              tick={{ fontSize: 13, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={{ stroke: "#6B7280", strokeWidth: 1 }}
              tickSize={5}
              interval={0}
              angle={0}
            />

            {/* Y-Axis with tick marks */}
            <YAxis
              tick={{ fontSize: 13, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={{ stroke: "#6B7280", strokeWidth: 1 }}
              tickSize={5}
              domain={[0, maxOrders]}
            />

            {/* Tooltip with simple yellow text */}
            <Tooltip content={<CustomTooltip />} cursor={false} />

            {/* Area with smooth natural curve - dots only on hover */}
            <Area
              type="natural"
              dataKey="orders"
              stroke="#58E8C1"
              strokeWidth={3}
              fill="url(#colorOrders)"
              dot={false}
              activeDot={{
                r: 8,
                fill: "#58E8C1",
                stroke: "#000",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrdersActivityChart;

