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
  sales: number;
  revenue: number;
}

const mockProducts: Product[] = [
  { id: 1, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-1.png", name: "Laptop Gaming ASUS ROG", category: "Electronics", price: 1299, stock: 45, status: "active", sales: 342, revenue: 444558 },
  { id: 2, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-2.png", name: "iPhone 15 Pro Max", category: "Electronics", price: 1199, stock: 23, status: "active", sales: 289, revenue: 346411 },
  { id: 3, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-3.png", name: "Sony WH-1000XM5", category: "Audio", price: 399, stock: 0, status: "inactive", sales: 156, revenue: 62244 },
  { id: 4, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-4.png", name: "Apple Watch Series 9", category: "Wearables", price: 399, stock: 8, status: "active", sales: 134, revenue: 53466 },
  { id: 5, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-5.png", name: "Razer DeathAdder V3", category: "Gaming", price: 69, stock: 89, status: "active", sales: 98, revenue: 6762 },
  { id: 6, image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-6.png", name: "MacBook Pro M3", category: "Electronics", price: 1999, stock: 15, status: "active", sales: 87, revenue: 173913 },
];

const categories = ["All Categories", "Electronics", "Audio", "Wearables", "Gaming"];
const statusOptions = ["All Status", "Active", "Inactive"];

export default function ProductListPage() {
  const navigate = useNavigate();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
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
      const matchesToggle = toggleStatus === "All" ||
        (toggleStatus === "Published" && product.status === "active") ||
        (toggleStatus === "Draft" && product.status === "inactive");

      return matchesSearch && matchesCategory && matchesStatus && matchesToggle;
    });
  }, [searchTerm, categoryFilter, statusFilter, toggleStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? <Badge variant="default" className="bg-green-600/10 text-green-600">Published</Badge>
      : <Badge variant="secondary" className="bg-amber-600/10 text-amber-600">Draft</Badge>;
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
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
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
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
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