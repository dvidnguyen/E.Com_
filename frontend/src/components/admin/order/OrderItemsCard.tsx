import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrderItem {
  id: number;
  image: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

interface OrderItemsCardProps {
  items: OrderItem[];
}

export function OrderItemsCard({ items }: OrderItemsCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Items</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={item.image} alt={item.name} />
                    <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                <TableCell className="text-right font-medium">
                  ${(item.quantity * item.price).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}