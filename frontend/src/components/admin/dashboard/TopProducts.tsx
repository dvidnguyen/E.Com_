import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, Filter, Eye, Edit, Trash2, Plus, Download } from "lucide-react";

interface Product {
  id: number;
  image: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  publishStatus: 'published' | 'draft';
  stockStatus: 'in_stock' | 'out_of_stock';
  sales: number;
  revenue: number;
}

const mockProducts: Product[] = [
  { id: 1, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-1.png", name: "Laptop Gaming ASUS ROG", category: "Electronics", price: 1299, stock: 45, status: "active", publishStatus: "published", stockStatus: "in_stock", sales: 342, revenue: 444558 },
  { id: 2, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-2.png", name: "iPhone 15 Pro Max", category: "Electronics", price: 1199, stock: 23, status: "active", publishStatus: "published", stockStatus: "in_stock", sales: 289, revenue: 346411 },
  { id: 3, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-3.png", name: "Sony WH-1000XM5", category: "Audio", price: 399, stock: 0, status: "inactive", publishStatus: "draft", stockStatus: "out_of_stock", sales: 156, revenue: 62244 },
  { id: 4, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-4.png", name: "Apple Watch Series 9", category: "Wearables", price: 399, stock: 12, status: "active", publishStatus: "published", stockStatus: "in_stock", sales: 134, revenue: 53466 },
  { id: 5, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-5.png", name: "Razer DeathAdder V3", category: "Gaming", price: 69, stock: 89, status: "active", publishStatus: "published", stockStatus: "in_stock", sales: 98, revenue: 6762 },
  { id: 6, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-6.png", name: "MacBook Pro M3", category: "Electronics", price: 1999, stock: 15, status: "active", publishStatus: "published", stockStatus: "in_stock", sales: 87, revenue: 173913 },
  { id: 7, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-7.png", name: "Samsung Galaxy S24", category: "Electronics", price: 899, stock: 34, status: "active", publishStatus: "published", stockStatus: "in_stock", sales: 76, revenue: 68324 },
  { id: 8, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-8.png", name: "Nintendo Switch OLED", category: "Gaming", price: 349, stock: 0, status: "inactive", publishStatus: "draft", stockStatus: "out_of_stock", sales: 65, revenue: 22685 },
  { id: 9, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-9.png", name: "iPad Pro 12.9", category: "Electronics", price: 1099, stock: 28, status: "active", publishStatus: "published", stockStatus: "in_stock", sales: 54, revenue: 59346 },
  { id: 10, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-10.png", name: "AirPods Pro 2", category: "Audio", price: 249, stock: 67, status: "active", publishStatus: "published", stockStatus: "in_stock", sales: 43, revenue: 10707 },
  { id: 11, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-11.png", name: "Dell XPS 13", category: "Electronics", price: 1299, stock: 19, status: "active", publishStatus: "draft", stockStatus: "in_stock", sales: 38, revenue: 49362 },
  { id: 12, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-12.png", name: "Mechanical Keyboard", category: "Gaming", price: 159, stock: 45, status: "active", publishStatus: "published", stockStatus: "in_stock", sales: 32, revenue: 5088 },
];

const categories = ["All Categories", "Electronics", "Audio", "Wearables", "Gaming"];
const stockOptions = ["All Stock", "In Stock", "Out of Stock"];
const statusOptions = ["All Status", "Active", "Inactive"];
const publishOptions = ["All Publish", "Published", "Draft"];

export default function ProductsDataTable() {
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("All Stock");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [publishFilter, setPublishFilter] = useState("All Publish");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states - Task 3.1: New pageSize state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All Categories" || product.category === categoryFilter;
      const matchesStock = stockFilter === "All Stock" ||
        (stockFilter === "In Stock" && product.stockStatus === "in_stock") ||
        (stockFilter === "Out of Stock" && product.stockStatus === "out_of_stock");
      const matchesStatus = statusFilter === "All Status" ||
        product.status === statusFilter.toLowerCase();
      const matchesPublish = publishFilter === "All Publish" ||
        product.publishStatus === publishFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesStock && matchesStatus && matchesPublish;
    });
  }, [searchTerm, categoryFilter, stockFilter, statusFilter, publishFilter]);

  // Pagination logic - Task 3.2: Updated to use pageSize
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, stockFilter, statusFilter, publishFilter]);

  const getStockBadge = (stockStatus: string) => {
    return stockStatus === 'in_stock'
      ? <Badge className="bg-green-600/10 text-green-600">In Stock</Badge>
      : <Badge className="bg-destructive/10 text-destructive">Out of Stock</Badge>;
  };

  const getActivityStatusBadge = (status: string) => {
    return status === 'active'
      ? <Badge variant="default">Active</Badge>
      : <Badge variant="secondary">Inactive</Badge>;
  };

  const getPublishStatusBadge = (status: string) => {
    return status === 'published'
      ? <Badge className="bg-blue-600/10 text-blue-600">Published</Badge>
      : <Badge className="bg-yellow-600/10 text-yellow-600">Draft</Badge>;
  };

  const handleAction = (action: string, productId: number) => {
    console.log(`${action} product ${productId}`);
    // Implement actual actions here
  };

  const handleExport = () => {
    console.log('Export data');
    // Implement export functionality here
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2  xl">Products Management</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Task 1.1 & 1.2: Restructured Header Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Left side: Search input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:pb-0.5placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Right side: Action buttons group */}
          <div className="flex items-center gap-3">
            {/* Rows Per Page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows:</span>
              <Select value={pageSize.toString()} onValueChange={(value: string) => setPageSize(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Export button */}
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            {/* Add Product button */}
            <Button onClick={() => handleAction('add', 0)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Filter toggle button */}
        <div className="flex">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        {/* Task 2.1: Filter Card with Fixed Minimum Height */}
        {showFilters && (
          <div className="p-2 border rounded-lg bg-muted/50 min-h-[100px]">
            <div className="flex flex-row justify-between gap-6">
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Stock Status</label>
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stockOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Publish Status</label>
                <Select value={publishFilter} onValueChange={setPublishFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {publishOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded" />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Publish</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <input type="checkbox" className="rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toLocaleString()}</TableCell>
                  <TableCell>{getActivityStatusBadge(product.status)}</TableCell>
                  <TableCell>{getPublishStatusBadge(product.publishStatus)}</TableCell>
                  <TableCell>{getStockBadge(product.stockStatus)}</TableCell>
                  <TableCell>{product.sales}</TableCell>
                  <TableCell>${product.revenue.toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction('view', product.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('edit', product.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('delete', product.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredProducts.length)} of {filteredProducts.length} results
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage > totalPages - 3) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}