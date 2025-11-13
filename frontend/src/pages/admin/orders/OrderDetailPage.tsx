import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { OrderItemsCard } from "@/components/admin/order/OrderItemsCard";
import { PriceSummaryCard } from "@/components/admin/order/PriceSummaryCard";
import { OrderTimelineCard } from "@/components/admin/order/OrderTimelineCard";
import { OrderActionsCard } from "@/components/admin/order/OrderActionsCard";
import { CustomerCard } from "@/components/admin/order/CustomerCard";
import { AddressCard } from "@/components/admin/order/AddressCard";
import AdminBreadcrumb from "@/components/admin/layout/AdminBreadcrumb";

type PaymentStatus = "cash_on_delivery" | "bank_transfer" | "refunded";
type FulfillmentStatus = "pending" | "shipping" | "completed";
type EventType = "success" | "warning" | "info";

interface OrderData {
  id: string;
  date: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  customer: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  items: Array<{
    id: number;
    name: string;
    sku: string;
    image: string;
    quantity: number;
    price: number;
  }>;
  priceSummary: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  timeline: Array<{
    id: number;
    title: string;
    description: string;
    date: string;
    type: EventType;
  }>;
}

// Mock data - in real app this would come from API
const mockOrderData: OrderData = {
  id: "#10234",
  date: "2024-01-15",
  paymentStatus: "cash_on_delivery" as PaymentStatus,
  fulfillmentStatus: "pending" as FulfillmentStatus,
  customer: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
  },
  items: [
    {
      id: 1,
      name: "Laptop Gaming ASUS ROG",
      sku: "ASUS-ROG-001",
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=60&h=60&fit=crop",
      quantity: 1,
      price: 1299.99
    },
    {
      id: 2,
      name: "Wireless Mouse",
      sku: "MOUSE-WL-002",
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=60&h=60&fit=crop",
      quantity: 2,
      price: 49.99
    }
  ],
  priceSummary: {
    subtotal: 1399.97,
    shipping: 15.00,
    tax: 112.00,
    discount: 50.00,
    total: 1476.97
  },
  shippingAddress: {
    name: "John Doe",
    street: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States"
  },
  billingAddress: {
    name: "John Doe",
    street: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States"
  },
  timeline: [
    {
      id: 1,
      title: "Order Placed",
      description: "Order #10234 was successfully placed",
      date: "2024-01-15T10:00:00Z",
      type: "success" as EventType
    },
    {
      id: 2,
      title: "Payment Method Selected",
      description: "Cash on Delivery (COD) selected as payment method",
      date: "2024-01-15T10:05:00Z",
      type: "info" as EventType
    },
    {
      id: 3,
      title: "Order Processing",
      description: "Order is being prepared for shipment",
      date: "2024-01-15T11:00:00Z",
      type: "warning" as EventType
    }
  ]
};

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(mockOrderData);

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'cash_on_delivery':
        return <Badge variant="secondary" className="bg-orange-600/10 text-orange-600">COD</Badge>;
      case 'bank_transfer':
        return <Badge variant="default" className="bg-green-600/10 text-green-600">Bank Transfer</Badge>;
      case 'refunded':
        return <Badge variant="secondary" className="bg-gray-600/10 text-gray-600">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getFulfillmentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-600/10 text-green-600">Completed</Badge>;
      case 'shipping':
        return <Badge variant="secondary" className="bg-blue-600/10 text-blue-600">Shipping</Badge>;
      case 'pending':
        return <Badge variant="destructive" className="bg-red-600/10 text-red-600">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleFulfillOrder = () => {
    // If currently pending, move to shipping first
    if (orderData.fulfillmentStatus === "pending") {
      setOrderData(prev => ({
        ...prev,
        fulfillmentStatus: "shipping" as FulfillmentStatus,
        timeline: [
          ...prev.timeline,
          {
            id: prev.timeline.length + 1,
            title: "Order Shipped",
            description: "Order has been shipped and is on the way to customer",
            date: new Date().toISOString(),
            type: "info" as EventType
          }
        ]
      }));
    } else if (orderData.fulfillmentStatus === "shipping") {
      // If currently shipping, complete the order
      setOrderData(prev => ({
        ...prev,
        fulfillmentStatus: "completed" as FulfillmentStatus,
        timeline: [
          ...prev.timeline,
          {
            id: prev.timeline.length + 1,
            title: "Order Completed",
            description: "Order has been delivered and completed successfully",
            date: new Date().toISOString(),
            type: "success" as EventType
          }
        ]
      }));
    }
    console.log("Order status updated");
  };

  const handlePrintInvoice = () => {
    console.log("Printing invoice for order", orderId);
    // In real app, this would generate and download PDF
  };

  const handleCancelOrder = () => {
    if (confirm("Are you sure you want to cancel/refund this order?")) {
      setOrderData(prev => ({
        ...prev,
        fulfillmentStatus: "pending" as FulfillmentStatus,
        paymentStatus: "refunded" as PaymentStatus,
        timeline: [
          ...prev.timeline,
          {
            id: prev.timeline.length + 1,
            title: "Order Canceled & Refunded",
            description: "Order has been canceled and refund has been processed",
            date: new Date().toISOString(),
            type: "info" as EventType
          }
        ]
      }));
      console.log("Order canceled");
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/orders")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order {orderData.id}</h1>
            <p className="text-muted-foreground">
              Placed on {new Date(orderData.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getPaymentStatusBadge(orderData.paymentStatus)}
          {getFulfillmentStatusBadge(orderData.fulfillmentStatus)}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column (Left Side) - 65% */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <OrderItemsCard items={orderData.items} />

          {/* Price Summary */}
          <PriceSummaryCard summary={orderData.priceSummary} />

          {/* Order Timeline */}
          <OrderTimelineCard events={orderData.timeline} />
        </div>

        {/* Sidebar Column (Right Side) - 35% */}
        <div className="space-y-6">
          {/* Actions */}
          <OrderActionsCard
            fulfillmentStatus={orderData.fulfillmentStatus}
            onFulfill={handleFulfillOrder}
            onPrintInvoice={handlePrintInvoice}
            onCancel={handleCancelOrder}
          />

          {/* Customer */}
          <CustomerCard customer={orderData.customer} />

          {/* Shipping Address */}
          <AddressCard
            title="Shipping Address"
            address={orderData.shippingAddress}
          />

          {/* Billing Address */}
          <AddressCard
            title="Billing Address"
            address={orderData.billingAddress}
          />
        </div>
      </div>
    </div>
  );
}