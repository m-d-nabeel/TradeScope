import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterIcon } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function FilterMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState("");
  const [startDate, setStartDate] = useState(new Date("2023-01-01"));
  const [endDate, setEndDate] = useState(new Date());

  const stocks = ["AAPL", "GOOGL", "MSFT", "AMZN", "META"];

  const handleApplyFilters = () => {
    console.log("Filters applied:", { selectedStock, startDate, endDate });
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-5 right-5 h-12 w-12 rounded-full p-0"
        >
          <FilterIcon className="h-6 w-6" />
          <span className="sr-only">Open filter menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Set the filters for your analysis
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="stock">Stock</Label>
              <select
                id="stock"
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Select a stock</option>
                {stocks.map((stock) => (
                  <option key={stock} value={stock}>
                    {stock}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="start-date">Start Date</Label>
              <DatePicker
                id="start-date"
                selected={startDate}
                onChange={(date) => setStartDate(date!)}
                selectsStart
                startDate={startDate}
                maxDate={endDate}
                showYearDropdown
                dateFormatCalendar="MMMM"
                yearDropdownItemNumber={15}
                scrollableYearDropdown
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="end-date">End Date</Label>
              <DatePicker
                id="end-date"
                selected={endDate}
                onChange={(date) => setEndDate(date!)}
                selectsEnd
                startDate={startDate}
                maxDate={new Date()}
                showYearDropdown
                dateFormatCalendar="MMMM"
                yearDropdownItemNumber={15}
                scrollableYearDropdown
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
