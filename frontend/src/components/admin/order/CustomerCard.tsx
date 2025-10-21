import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone } from "lucide-react";

interface Customer {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface CustomerCardProps {
  customer: Customer;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={customer.avatar} alt={customer.name} />
            <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{customer.name}</h3>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{customer.email}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{customer.phone}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}