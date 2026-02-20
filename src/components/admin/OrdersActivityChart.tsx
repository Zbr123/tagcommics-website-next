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

// More varied data with ups and downs to create dynamic curves
const data = [
  { date: "01 Jul", orders: 12 },
  { date: "02 Jul", orders: 19 },
  { date: "03 Jul", orders: 8 },
  { date: "04 Jul", orders: 25 },
  { date: "05 Jul", orders: 15 },
  { date: "06 Jul", orders: 22 },
  { date: "07 Jul", orders: 18 },
  { date: "08 Jul", orders: 14 },
  { date: "09 Jul", orders: 28 },
];

// Simple tooltip with yellow theme
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg px-3 py-2 shadow-lg">
        <div className="text-lg font-semibold text-yellow-400">
          {payload[0].value} orders
        </div>
      </div>
    );
  }
  return null;
};

interface OrdersActivityChartProps {
  title?: string;
}

const OrdersActivityChart: React.FC<OrdersActivityChartProps> = ({
  title = "Orders Activity",
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 shadow-sm">
      {/* Heading inside the card */}
      <h3 className="text-lg m-3 font-semibold text-white">{title}</h3>

      {/* Chart card with dotted grid background */}
      <div className="bg-gray-800/30 rounded-xl pr-6 pt-2 pb-3">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FACC15" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#FEF3C7" stopOpacity={0.1} />
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
              domain={[0, 30]}
              ticks={[0, 5, 10, 15, 20, 25, 30]}
            />

            {/* Tooltip with simple yellow text */}
            <Tooltip content={<CustomTooltip />} cursor={false} />

            {/* Area with smooth natural curve - dots only on hover */}
            <Area
              type="natural"
              dataKey="orders"
              stroke="#FACC15"
              strokeWidth={3}
              fill="url(#colorOrders)"
              dot={false}
              activeDot={{
                r: 8,
                fill: "#FACC15",
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

