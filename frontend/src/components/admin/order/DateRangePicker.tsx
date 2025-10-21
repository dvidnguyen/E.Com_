import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";

interface DateRange {
  from: string;
  to: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDateRange = () => {
    if (!value.from && !value.to) return "Select date range";
    if (value.from && value.to) {
      return `${new Date(value.from).toLocaleDateString()} - ${new Date(value.to).toLocaleDateString()}`;
    }
    if (value.from) return `From ${new Date(value.from).toLocaleDateString()}`;
    return "Select date range";
  };

  const handleFromChange = (date: string) => {
    onChange({ ...value, from: date });
  };

  const handleToChange = (date: string) => {
    onChange({ ...value, to: date });
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="justify-start text-left font-normal min-w-[200px]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {formatDateRange()}
      </Button>

      {isExpanded && (
        <div className="absolute top-full mt-2 p-4 bg-white border rounded-lg shadow-lg z-50 min-w-[300px]">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">From</label>
              <Input
                type="date"
                value={value.from}
                onChange={(e) => handleFromChange(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">To</label>
              <Input
                type="date"
                value={value.to}
                onChange={(e) => handleToChange(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                Apply
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onChange({ from: "", to: "" });
                  setIsExpanded(false);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}