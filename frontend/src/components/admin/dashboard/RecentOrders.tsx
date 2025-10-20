import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin } from "lucide-react";

// Mock data theo từng trạng thái
const orderData = {
  new: [
    {
      id: 1,
      sender: { name: "Myrtle Ullrich", address: "101 Boulder, California(CA), 959595" },
      receiver: { name: "Barry Schowalter", address: "939 orange, California(CA), 92118" }
    },
    {
      id: 2,
      sender: { name: "Lucas Smith", address: "203 Riverdale, New York(NY), 10001" },
      receiver: { name: "Emma Johnson", address: "305 Maple Avenue, Austin, Texas(TX), 73301" }
    }
  ],
  pending: [
    {
      id: 3,
      sender: { name: "David Wilson", address: "789 Oak Street, Miami, Florida(FL), 33101" },
      receiver: { name: "Sarah Davis", address: "456 Pine Road, Seattle, Washington(WA), 98101" }
    },
    {
      id: 4,
      sender: { name: "Michael Brown", address: "321 Elm Avenue, Chicago, Illinois(IL), 60601" },
      receiver: { name: "Lisa Garcia", address: "654 Cedar Lane, Denver, Colorado(CO), 80201" }
    }
  ],
  shipping: [
    {
      id: 5,
      sender: { name: "Jennifer Miller", address: "987 Birch Street, Portland, Oregon(OR), 97201" },
      receiver: { name: "Robert Taylor", address: "147 Spruce Way, Phoenix, Arizona(AZ), 85001" }
    },
    {
      id: 6,
      sender: { name: "Amanda Wilson", address: "258 Walnut Drive, Boston, Massachusetts(MA), 02101" },
      receiver: { name: "Kevin Martinez", address: "369 Cherry Court, Las Vegas, Nevada(NV), 89101" }
    }
  ]
};

const tabs = [
  { name: 'Mới', value: 'new' },
  { name: 'Đang xử lí ', value: 'pending' },
  { name: 'Đang vận chuyển ', value: 'shipping' }
];

function OrderItem({ order }: { order: typeof orderData.new[0] }) {
  return (
    <div className="space-y-4 py-4 border-b last:border-b-0">
      <div className="flex items-start gap-3">
        <User className="w-4 h-4 mt-1 text-gray-500" />
        <div>
          <p className="text-sm text-gray-500">Sender</p>
          <p className="font-medium text-gray-900">{order.sender.name}</p>
          <p className="text-xs text-gray-600">{order.sender.address}</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <MapPin className="w-4 h-4 mt-1 text-gray-500" />
        <div>
          <p className="text-sm text-gray-500">Receiver</p>
          <p className="font-medium text-gray-900">{order.receiver.name}</p>
          <p className="text-xs text-gray-600">{order.receiver.address}</p>
        </div>
      </div>
    </div>
  );
}

export default function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Orders
          <span className="text-sm text-gray-500 font-normal">20 đơn hàng đang xử lí</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="new" className="w-full">
          <TabsList className="bg-background w-full justify-start rounded-none border-b p-0 h-auto">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="bg-background data-[state=active]:border-b-black h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value} className="mt-4">
              <div className="space-y-0">
                {orderData[tab.value as keyof typeof orderData].map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}