"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Maximum sales for the white background bars
const MAX_SALES = 100;

export interface SalesHistoryPoint {
  label: string;
  value: number;
}

interface SalesHistoryChartProps {
  title?: string;
  data?: SalesHistoryPoint[] | null;
  unit?: string;
}

function recentMonthLabels(count: number): string[] {
  const now = new Date();
  const labels: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(d.toLocaleString("en-US", { month: "short" }));
  }
  return labels;
}

const SalesHistoryChart: React.FC<SalesHistoryChartProps> = ({
  title = "Sales History",
  data,
  unit = "Orders",
}) => {
  const sourceFromApi = Array.isArray(data)
    ? data.map((item) => ({ month: item.label, sales: item.value }))
    : [];

  const source =
    sourceFromApi.length > 0
      ? sourceFromApi
      : recentMonthLabels(7).map((month) => ({
          month,
          sales: 0,
        }));

  const maxSales = Math.max(
    sourceFromApi.length > 0 ? MAX_SALES : 1,
    ...source.map((item) => Number(item.sales) || 0)
  );
  const chartData = source.map((item) => ({
    month: item.month,
    sales: item.sales,
    remaining: Math.max(0, maxSales - Number(item.sales)),
  }));

  const tooltipLabel = unit.toLowerCase();

  const DynamicTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const { month, sales } = payload[0].payload;

    return (
      <div className="rounded-lg bg-white border-2 border-brand px-3 py-2 shadow-lg min-w-[150px]">
        <div className="text-lg font-semibold text-gray-900">
          {unit === "Revenue" ? `$${Number(sales).toFixed(2)}` : `${sales} ${tooltipLabel}`}
        </div>
        <div className="text-sm text-gray-500">{month}</div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 shadow-sm">
      <h3 className="text-lg m-3 font-semibold text-white">{title}</h3>

      <div className="bg-gray-800/30 rounded-xl px-3 py-2 pb-3">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
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
            <YAxis hide domain={[0, maxSales]} />
            <Tooltip content={<DynamicTooltip />} cursor={false} />

            <Bar
              dataKey="sales"
              stackId="stack"
              barSize={50}
              radius={[4, 4, 4, 4]}
              fill="#58E8C1"
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

