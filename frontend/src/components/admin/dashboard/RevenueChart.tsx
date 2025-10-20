import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data cho revenue chart (simplified)
const revenueData = [
  { month: 'Jan', revenue: 45000000 },
  { month: 'Feb', revenue: 52000000 },
  { month: 'Mar', revenue: 48000000 },
  { month: 'Apr', revenue: 61000000 },
  { month: 'May', revenue: 55000000 },
  { month: 'Jun', revenue: 67000000 },
];

export default function RevenueChart() {
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple bar chart representation */}
          <div className="flex items-end justify-between h-40 border-b">
            {revenueData.map((data) => {
              const height = (data.revenue / maxRevenue) * 140;
              return (
                <div key={data.month} className="flex flex-col items-center space-y-2">
                  <div
                    className="w-8 bg-blue-500 rounded-t"
                    style={{ height: `${height}px` }}
                  ></div>
                  <span className="text-xs text-gray-600">{data.month}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">67M₫</p>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">+12.5%</p>
              <p className="text-sm text-gray-600">Growth</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">55M₫</p>
              <p className="text-sm text-gray-600">Last Month</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}