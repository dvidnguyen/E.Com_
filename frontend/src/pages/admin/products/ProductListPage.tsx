import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Eye, Edit, Trash2, Plus } from "lucide-react";

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
  { id: 4, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-4.png", name: "Apple Watch Series 9", category: "Wearables", price: 399, stock: 8, status: "active", publishStatus: "published", stockStatus: "in_stock", sales: 134, revenue: 53466 },
  { id: 5, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-5.png", name: "Razer DeathAdder V3", category: "Gaming", price: 69, stock: 89, status: "active", publishStatus: "draft", stockStatus: "in_stock", sales: 98, revenue: 6762 },
  { id: 6, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-6.png", name: "MacBook Pro M3", category: "Electronics", price: 1999, stock: 15, status: "active", publishStatus: "published", stockStatus: "in_stock", sales: 87, revenue: 173913 },
];

const categories = ["All Categories", "Electronics", "Audio", "Wearables", "Gaming"];
const statusOptions = ["All Status", "Active", "Inactive"];
const publishOptions = ["All Publish", "Published", "Draft"];
const stockOptions = ["All Stock", "In Stock", "Out of Stock"];

export default function ProductListPage() {
  const navigate = useNavigate();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [publishFilter, setPublishFilter] = useState("All Publish");
  const [stockFilter, setStockFilter] = useState("All Stock");
  const [toggleStatus, setToggleStatus] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All Categories" || product.category === categoryFilter;
      const matchesStatus = statusFilter === "All Status" ||
        product.status === statusFilter.toLowerCase();
      const matchesPublish = publishFilter === "All Publish" ||
        product.publishStatus === publishFilter.toLowerCase();
      const matchesStock = stockFilter === "All Stock" ||
        (stockFilter === "In Stock" && product.stockStatus === "in_stock") ||
        (stockFilter === "Out of Stock" && product.stockStatus === "out_of_stock");
      const matchesToggle = toggleStatus === "All" ||
        (toggleStatus === "Published" && product.publishStatus === "published") ||
        (toggleStatus === "Draft" && product.publishStatus === "draft") ||
        (toggleStatus === "Active" && product.status === "active") ||
        (toggleStatus === "Inactive" && product.status === "inactive");

      return matchesSearch && matchesCategory && matchesStatus && matchesPublish && matchesStock && matchesToggle;
    });
  }, [searchTerm, categoryFilter, statusFilter, publishFilter, stockFilter, toggleStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const getActivityStatusBadge = (status: string) => {
    return status === 'active'
      ? <Badge variant="default" className="bg-green-600/10 text-green-600">Active</Badge>
      : <Badge variant="secondary" className="bg-gray-600/10 text-gray-600">Inactive</Badge>;
  };

  const getPublishStatusBadge = (status: string) => {
    return status === 'published'
      ? <Badge variant="default" className="bg-blue-600/10 text-blue-600">Published</Badge>
      : <Badge variant="secondary" className="bg-yellow-600/10 text-yellow-600">Draft</Badge>;
  };

  const getStockStatusBadge = (status: string) => {
    return status === 'in_stock'
      ? <Badge variant="default" className="bg-green-600/10 text-green-600">In Stock</Badge>
      : <Badge variant="secondary" className="bg-red-600/10 text-red-600">Out of Stock</Badge>;
  };

  const handleAction = (action: string, productId: number) => {
    switch (action) {
      case 'add':
        navigate('/admin/products/new');
        break;
      case 'view':
        // Navigate to product detail page (we can create this later)
        console.log(`View product ${productId}`);
        break;
      case 'edit':
        navigate(`/admin/products/edit/${productId}`);
        break;
      case 'delete':
        // Show delete confirmation dialog
        if (confirm(`Are you sure you want to delete product ${productId}?`)) {
          console.log(`Delete product ${productId}`);
          // Add delete logic here
        }
        break;
      default:
        console.log(`Unknown action: ${action} for product ${productId}`);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => handleAction('add', 0)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-row justify-between gap-6">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
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
          <div className="flex flex-row justify-between gap-6">
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
            <div className="flex-1"></div>
          </div>
        </CardContent>
      </Card>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={toggleStatus === "All" ? "default" : "outline"}
            onClick={() => setToggleStatus("All")}
          >
            All
          </Button>
          <Button
            variant={toggleStatus === "Published" ? "default" : "outline"}
            onClick={() => setToggleStatus("Published")}
          >
            Published
          </Button>
          <Button
            variant={toggleStatus === "Draft" ? "default" : "outline"}
            onClick={() => setToggleStatus("Draft")}
          >
            Draft
          </Button>
          <Button
            variant={toggleStatus === "Active" ? "default" : "outline"}
            onClick={() => setToggleStatus("Active")}
          >
            Active
          </Button>
          <Button
            variant={toggleStatus === "Inactive" ? "default" : "outline"}
            onClick={() => setToggleStatus("Inactive")}
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded" />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Publish</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell>{getActivityStatusBadge(product.status)}</TableCell>
                  <TableCell>{getPublishStatusBadge(product.publishStatus)}</TableCell>
                  <TableCell>{getStockStatusBadge(product.stockStatus)}</TableCell>
                  <TableCell>${product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={product.stock < 10 ? "text-red-600" : ""}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
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
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('edit', product.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
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
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
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