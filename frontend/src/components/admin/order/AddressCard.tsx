import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddressCardProps {
  title: string;
  address: Address;
}

export function AddressCard({ title, address }: AddressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="font-medium">{address.name}</div>
        <div className="text-sm text-muted-foreground">
          <div>{address.street}</div>
          <div>{address.city}, {address.state} {address.zipCode}</div>
          <div>{address.country}</div>
        </div>
      </CardContent>
    </Card>
  );
}