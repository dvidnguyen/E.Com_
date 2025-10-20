"use client"

import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Mock data cho visitors hàng ngày
const chartData = [
  { date: "2024-10-01", desktop: 1200, mobile: 800 },
  { date: "2024-10-02", desktop: 1100, mobile: 900 },
  { date: "2024-10-03", desktop: 1300, mobile: 700 },
  { date: "2024-10-04", desktop: 1400, mobile: 1100 },
  { date: "2024-10-05", desktop: 1250, mobile: 950 },
  { date: "2024-10-06", desktop: 1600, mobile: 1200 },
  { date: "2024-10-07", desktop: 1800, mobile: 1400 },
  { date: "2024-10-08", desktop: 1350, mobile: 1050 },
  { date: "2024-10-09", desktop: 1500, mobile: 1300 },
  { date: "2024-10-10", desktop: 1700, mobile: 1100 },
  { date: "2024-10-11", desktop: 1450, mobile: 1250 },
  { date: "2024-10-12", desktop: 1900, mobile: 1500 },
  { date: "2024-10-13", desktop: 1650, mobile: 1350 },
  { date: "2024-10-14", desktop: 1750, mobile: 1200 },
  { date: "2024-10-15", desktop: 2000, mobile: 1600 }
]

export default function VisitorsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lượt Truy Cập Hàng Ngày</CardTitle>
        <p className="text-sm text-gray-600">
          Tổng số khách truy cập trong 15 ngày gần đây
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} className="opacity-30" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("vi-VN", {
                    month: "short",
                    day: "numeric",
                  })
                }}
                className="text-xs"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const total = Number(payload[0]?.value || 0) + Number(payload[1]?.value || 0);
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="text-sm font-medium">{new Date(label).toLocaleDateString("vi-VN")}</p>
                        <p className="text-sm text-blue-600">
                          Desktop: {payload[1]?.value?.toLocaleString()}
                        </p>
                        <p className="text-sm text-cyan-600">
                          Mobile: {payload[0]?.value?.toLocaleString()}
                        </p>
                        <p className="text-sm font-semibold border-t pt-1 mt-1">
                          Tổng: {total.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                dataKey="mobile"
                type="monotone"
                fill="url(#fillMobile)"
                stroke="#06b6d4"
                strokeWidth={1}
                stackId="a"
              />
              <Area
                dataKey="desktop"
                type="monotone"
                fill="url(#fillDesktop)"
                stroke="#3b82f6"
                strokeWidth={2}
                stackId="a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Desktop</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
            <span className="text-gray-600">Mobile</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">47.2K</p>
            <p className="text-xs text-gray-600">Tháng này</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">+18.3%</p>
            <p className="text-xs text-gray-600">Tăng trưởng</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">39.8K</p>
            <p className="text-xs text-gray-600">Tháng trước</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}