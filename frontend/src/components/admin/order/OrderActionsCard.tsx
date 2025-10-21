import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Printer, XCircle } from "lucide-react";

interface OrderActionsCardProps {
  fulfillmentStatus: string;
  onFulfill: () => void;
  onPrintInvoice: () => void;
  onCancel: () => void;
}

export function OrderActionsCard({
  fulfillmentStatus,
  onFulfill,
  onPrintInvoice,
  onCancel
}: OrderActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {fulfillmentStatus === "pending" && (
          <Button onClick={onFulfill} className="w-full">
            <Package className="w-4 h-4 mr-2" />
            Start Shipping
          </Button>
        )}

        {fulfillmentStatus === "shipping" && (
          <Button onClick={onFulfill} className="w-full">
            <Package className="w-4 h-4 mr-2" />
            Mark as Completed
          </Button>
        )}

        <Button variant="outline" onClick={onPrintInvoice} className="w-full">
          <Printer className="w-4 h-4 mr-2" />
          Print Invoice
        </Button>

        {fulfillmentStatus !== "completed" && (
          <Button
            variant="destructive"
            onClick={onCancel}
            className="w-full"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel/Refund Order
          </Button>
        )}
      </CardContent>
    </Card>
  );
}