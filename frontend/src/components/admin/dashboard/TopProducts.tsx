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
  sales: number;
  revenue: number;
}

const mockProducts: Product[] = [
  { id: 1, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-1.png", name: "Laptop Gaming ASUS ROG", category: "Electronics", price: 1299, stock: 45, status: "active", sales: 342, revenue: 444558 },
  { id: 2, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-2.png", name: "iPhone 15 Pro Max", category: "Electronics", price: 1199, stock: 23, status: "active", sales: 289, revenue: 346411 },
  { id: 3, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-3.png", name: "Sony WH-1000XM5", category: "Audio", price: 399, stock: 0, status: "inactive", sales: 156, revenue: 62244 },
  { id: 4, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-4.png", name: "Apple Watch Series 9", category: "Wearables", price: 399, stock: 12, status: "active", sales: 134, revenue: 53466 },
  { id: 5, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-5.png", name: "Razer DeathAdder V3", category: "Gaming", price: 69, stock: 89, status: "active", sales: 98, revenue: 6762 },
  { id: 6, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-6.png", name: "MacBook Pro M3", category: "Electronics", price: 1999, stock: 15, status: "active", sales: 87, revenue: 173913 },
  { id: 7, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-7.png", name: "Samsung Galaxy S24", category: "Electronics", price: 899, stock: 34, status: "active", sales: 76, revenue: 68324 },
  { id: 8, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-8.png", name: "Nintendo Switch OLED", category: "Gaming", price: 349, stock: 0, status: "inactive", sales: 65, revenue: 22685 },
  { id: 9, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-9.png", name: "iPad Pro 12.9", category: "Electronics", price: 1099, stock: 28, status: "active", sales: 54, revenue: 59346 },
  { id: 10, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-10.png", name: "AirPods Pro 2", category: "Audio", price: 249, stock: 67, status: "active", sales: 43, revenue: 10707 },
  { id: 11, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-11.png", name: "Dell XPS 13", category: "Electronics", price: 1299, stock: 19, status: "active", sales: 38, revenue: 49362 },
  { id: 12, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-12.png", name: "Mechanical Keyboard", category: "Gaming", price: 159, stock: 45, status: "active", sales: 32, revenue: 5088 },
];

const categories = ["All Categories", "Electronics", "Audio", "Wearables", "Gaming"];
const stockOptions = ["All Stock", "In Stock", "Low Stock", "Out of Stock"];
const statusOptions = ["All Status", "Active", "Inactive"];

export default function ProductsDataTable() {
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("All Stock");
  const [statusFilter, setStatusFilter] = useState("All Status");
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
        (stockFilter === "In Stock" && product.stock > 10) ||
        (stockFilter === "Low Stock" && product.stock > 0 && product.stock <= 10) ||
        (stockFilter === "Out of Stock" && product.stock === 0);
      const matchesStatus = statusFilter === "All Status" ||
        product.status === statusFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesStock && matchesStatus;
    });
  }, [searchTerm, categoryFilter, stockFilter, statusFilter]);

  // Pagination logic - Task 3.2: Updated to use pageSize
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, stockFilter, statusFilter]);

  const getStockBadge = (stock: number) => {
    const getStockStyles = (availability: string) => {
      const styles = {
        'In Stock':
          'bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5',
        'Out of Stock':
          'bg-destructive/10 [a&]:hover:bg-destructive/5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive',
        Limited:
          'bg-amber-600/10 text-amber-600 focus-visible:ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:focus-visible:ring-amber-400/40 [a&]:hover:bg-amber-600/5 dark:[a&]:hover:bg-amber-400/5'
      }[availability]

      return styles;
    };

    if (stock === 0) {
      return <Badge className={getStockStyles('Out of Stock')}>Out of Stock</Badge>;
    }
    if (stock <= 10) {
      return <Badge className={getStockStyles('Limited')}>Low Stock</Badge>;
    }
    return <Badge className={getStockStyles('In Stock')}>In Stock</Badge>;
  };

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? <Badge variant="default">Active</Badge>
      : <Badge variant="secondary">Inactive</Badge>;
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
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{product.stock}</span>
                      {getStockBadge(product.stock)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
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