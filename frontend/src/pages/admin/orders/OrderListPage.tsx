import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, Eye, Edit, Trash2, Calendar, Printer, X } from "lucide-react";
import { DateRangePicker } from "@/components/admin/order/DateRangePicker";
import AdminBreadcrumb from "@/components/admin/layout/AdminBreadcrumb";

interface Order {
  id: string;
  date: string;
  customer: string;
  email: string;
  total: number;
  paymentStatus: "cash_on_delivery" | "bank_transfer" | "refunded";
  fulfillmentStatus: "pending" | "shipping" | "completed";
  items: number;
}

const mockOrders: Order[] = [
  {
    id: "#10234",
    date: "2024-01-15",
    customer: "John Doe",
    email: "john@example.com",
    total: 299.99,
    paymentStatus: "cash_on_delivery",
    fulfillmentStatus: "pending",
    items: 3
  },
  {
    id: "#10235",
    date: "2024-01-15",
    customer: "Sarah Wilson",
    email: "sarah@example.com",
    total: 149.50,
    paymentStatus: "bank_transfer",
    fulfillmentStatus: "completed",
    items: 2
  },
  {
    id: "#10236",
    date: "2024-01-14",
    customer: "Mike Johnson",
    email: "mike@example.com",
    total: 89.99,
    paymentStatus: "cash_on_delivery",
    fulfillmentStatus: "shipping",
    items: 1
  },
  {
    id: "#10237",
    date: "2024-01-14",
    customer: "Emily Brown",
    email: "emily@example.com",
    total: 199.99,
    paymentStatus: "refunded",
    fulfillmentStatus: "pending",
    items: 2
  },
  {
    id: "#10238",
    date: "2024-01-13",
    customer: "David Lee",
    email: "david@example.com",
    total: 399.99,
    paymentStatus: "bank_transfer",
    fulfillmentStatus: "completed",
    items: 4
  },
  {
    id: "#10239",
    date: "2024-01-13",
    customer: "Lisa Taylor",
    email: "lisa@example.com",
    total: 59.99,
    paymentStatus: "cash_on_delivery",
    fulfillmentStatus: "shipping",
    items: 1
  }
];

export default function OrderListPage() {
  const navigate = useNavigate();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [fulfillmentStatusFilter, setFulfillmentStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtering logic
  const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPayment = paymentStatusFilter === "all" || order.paymentStatus === paymentStatusFilter;
      const matchesFulfillment = fulfillmentStatusFilter === "all" || order.fulfillmentStatus === fulfillmentStatusFilter;

      let matchesDate = true;
      if (dateRange.from && dateRange.to) {
        const orderDate = new Date(order.date);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        matchesDate = orderDate >= fromDate && orderDate <= toDate;
      }

      return matchesSearch && matchesPayment && matchesFulfillment && matchesDate;
    });
  }, [searchTerm, paymentStatusFilter, fulfillmentStatusFilter, dateRange]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

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

  const handleAction = (action: string, orderId: string) => {
    switch (action) {
      case 'view':
        navigate(`/admin/orders/${orderId.replace('#', '')}`);
        break;
      case 'print':
        console.log(`Print invoice for order ${orderId}`);
        break;
      case 'cancel':
        if (confirm(`Are you sure you want to cancel order ${orderId}?`)) {
          console.log(`Cancel order ${orderId}`);
        }
        break;
      default:
        console.log(`Unknown action: ${action} for order ${orderId}`);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb />

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage and track your store orders</p>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end gap-4">
            {/* Left Side - Search */}
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Order ID, Customer Name, or Email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Right Side - Filters */}
            <div className="flex gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <DateRangePicker value={dateRange} onChange={setDateRange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Status</label>
                <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="cash_on_delivery">COD</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fulfillment Status</label>
                <Select value={fulfillmentStatusFilter} onValueChange={setFulfillmentStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Fulfillment Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <button
                      onClick={() => handleAction('view', order.id)}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {order.id}
                    </button>
                  </TableCell>
                  <TableCell>
                    {new Date(order.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-sm text-muted-foreground">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${order.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    {getFulfillmentStatusBadge(order.fulfillmentStatus)}
                  </TableCell>
                  <TableCell>
                    {order.items} item{order.items !== 1 ? 's' : ''}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction('view', order.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('print', order.id)}>
                          <Printer className="w-4 h-4 mr-2" />
                          Print Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction('cancel', order.id)}
                          className="text-red-600"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}