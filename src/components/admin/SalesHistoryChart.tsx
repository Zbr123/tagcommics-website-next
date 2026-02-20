"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Maximum sales for the white background bars
const MAX_SALES = 100;

const data = [
  { month: "Jan", sales: 45, remaining: MAX_SALES - 45 },
  { month: "Feb", sales: 72, remaining: MAX_SALES - 72 },
  { month: "Mar", sales: 68, remaining: MAX_SALES - 68 },
  { month: "Apr", sales: 87, remaining: MAX_SALES - 87 },
  { month: "May", sales: 59, remaining: MAX_SALES - 59 },
  { month: "Jun", sales: 94, remaining: MAX_SALES - 94 },
  { month: "Jul", sales: 67, remaining: MAX_SALES - 67 },
];

const SalesTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const { month, sales } = payload[0].payload;

  return (
    <div className="rounded-lg bg-white border-2 border-yellow-400 px-3 py-2 shadow-lg min-w-[150px]">
      <div className="text-lg font-semibold text-gray-900">{sales} Orders</div>
      <div className="text-sm text-gray-500">{month}</div>
    </div>
  );
};

interface SalesHistoryChartProps {
  title?: string;
}

const SalesHistoryChart: React.FC<SalesHistoryChartProps> = ({ title = "Sales History" }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 shadow-sm">
      <h3 className="text-lg m-3 font-semibold text-white">{title}</h3>

      <div className="bg-gray-800/30 rounded-xl px-3 py-2 pb-3">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            barCategoryGap="15%"
            margin={{ top: 10, right: 10, bottom: 5, left: 10 }}
          >
            <XAxis
              dataKey="month"
              tick={{ fontSize: 13, fill: "#9CA3AF", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis hide domain={[0, MAX_SALES]} />
            <Tooltip content={<SalesTooltip />} cursor={false} />

            <Bar
              dataKey="sales"
              stackId="stack"
              barSize={50}
              radius={[4, 4, 4, 4]}
              fill="#FACC15"
            />

            <Bar
              dataKey="remaining"
              stackId="stack"
              barSize={50}
              radius={[4, 4, 0, 0]}
              fill="#374151"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesHistoryChart;

