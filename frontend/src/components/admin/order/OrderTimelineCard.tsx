import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  type: "success" | "warning" | "info";
}

interface OrderTimelineCardProps {
  events: OrderEvent[];
}

export function OrderTimelineCard({ events }: OrderTimelineCardProps) {
  const getEventBadge = (type: string) => {
    switch (type) {
      case 'success':
        return <Badge variant="default" className="bg-green-600/10 text-green-600">Success</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-amber-600/10 text-amber-600">Pending</Badge>;
      case 'info':
        return <Badge variant="secondary" className="bg-blue-600/10 text-blue-600">Info</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${event.type === 'success' ? 'bg-green-600' :
                  event.type === 'warning' ? 'bg-amber-600' : 'bg-blue-600'
                }`} />
              {index !== events.length - 1 && (
                <div className="w-px h-8 bg-gray-200 mt-2" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{event.title}</h4>
                {getEventBadge(event.type)}
              </div>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(event.date).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}