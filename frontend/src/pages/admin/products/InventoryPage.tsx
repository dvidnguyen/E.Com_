import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  id: number;
  productName: string;
  variantName: string;
  sku: string;
  quantity: number;
  location: string;
  image: string;
}

const mockInventory: InventoryItem[] = [
  { id: 1, productName: "iPhone 15 Pro", variantName: "Natural Titanium / 128GB", sku: "IPH15-NT-128", quantity: 45, location: "Warehouse A", image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-1.png" },
  { id: 2, productName: "MacBook Pro", variantName: "Space Gray / M3 / 16GB", sku: "MBP-SG-M3-16", quantity: 23, location: "Warehouse A", image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-2.png" },
  { id: 3, productName: "AirPods Pro", variantName: "White / 2nd Gen", sku: "APP-WH-2G", quantity: 0, location: "Warehouse B", image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-3.png" },
  { id: 4, productName: "Apple Watch", variantName: "Midnight / 45mm", sku: "AW9-MD-45", quantity: 8, location: "Warehouse A", image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-4.png" },
  { id: 5, productName: "iPad Air", variantName: "Blue / 256GB", sku: "IPA-BL-256", quantity: 67, location: "Warehouse C", image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-5.png" },
  { id: 6, productName: "Magic Keyboard", variantName: "White / US Layout", sku: "MK-WH-US", quantity: 156, location: "Warehouse B", image: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-6.png" },
];

export default function InventoryPage() {
  const [inventoryData, setInventoryData] = useState(mockInventory);
  const [stockFilter, setStockFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const { toast } = useToast();

  const filteredInventory = inventoryData.filter(item => {
    const matchesStock = stockFilter === "All" ||
      (stockFilter === "In Stock" && item.quantity > 10) ||
      (stockFilter === "Low Stock" && item.quantity > 0 && item.quantity <= 10) ||
      (stockFilter === "Out of Stock" && item.quantity === 0);

    const matchesLocation = locationFilter === "All Locations" || item.location === locationFilter;

    return matchesStock && matchesLocation;
  });

  const updateQuantity = (id: number, newQuantity: number) => {
    setInventoryData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    toast({
      title: "Inventory updated",
      description: "Product quantity has been successfully updated.",
    });
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: "Out of Stock", color: "text-red-600" };
    if (quantity <= 10) return { text: "Low Stock", color: "text-amber-600" };
    return { text: "In Stock", color: "text-green-600" };
  };

  const locations = ["All Locations", "Warehouse A", "Warehouse B", "Warehouse C"];

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">Fast quantity updates and stock monitoring</p>
      </div>

      {/* Filter Section */}
      <div className="flex items-center gap-4">
        {/* Stock Status Toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant={stockFilter === "All" ? "default" : "outline"}
            onClick={() => setStockFilter("All")}
          >
            All
          </Button>
          <Button
            variant={stockFilter === "In Stock" ? "default" : "outline"}
            onClick={() => setStockFilter("In Stock")}
          >
            In Stock
          </Button>
          <Button
            variant={stockFilter === "Low Stock" ? "default" : "outline"}
            onClick={() => setStockFilter("Low Stock")}
          >
            Low Stock
          </Button>
          <Button
            variant={stockFilter === "Out of Stock" ? "default" : "outline"}
            onClick={() => setStockFilter("Out of Stock")}
          >
            Out of Stock
          </Button>
        </div>

        {/* Location Filter */}
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locations.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <InventoryRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  getStockStatus={getStockStatus}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{inventoryData.length}</div>
            <p className="text-xs text-muted-foreground">Total Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {inventoryData.filter(item => item.quantity > 10).length}
            </div>
            <p className="text-xs text-muted-foreground">In Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-amber-600">
              {inventoryData.filter(item => item.quantity > 0 && item.quantity <= 10).length}
            </div>
            <p className="text-xs text-muted-foreground">Low Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">
              {inventoryData.filter(item => item.quantity === 0).length}
            </div>
            <p className="text-xs text-muted-foreground">Out of Stock</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Separate component for inventory row to optimize performance
function InventoryRow({
  item,
  onUpdateQuantity,
  getStockStatus
}: {
  item: InventoryItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  getStockStatus: (quantity: number) => { text: string; color: string };
}) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdateQuantity(item.id, quantity);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setQuantity(item.quantity);
    setIsEditing(false);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(e.target.value) || 0);
  };

  const status = getStockStatus(item.quantity);

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <img
            src={item.image}
            alt={item.productName}
            className="w-10 h-10 rounded-md object-cover"
          />
          <div>
            <p className="font-medium">{item.productName}</p>
            <p className="text-sm text-muted-foreground">{item.variantName}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-20"
            min="0"
            autoFocus
            onBlur={handleCancel}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
        ) : (
          <span
            className="cursor-pointer hover:bg-muted px-2 py-1 rounded"
            onClick={() => setIsEditing(true)}
          >
            {item.quantity}
          </span>
        )}
      </TableCell>
      <TableCell>{item.location}</TableCell>
      <TableCell>
        <span className={status.color}>{status.text}</span>
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}