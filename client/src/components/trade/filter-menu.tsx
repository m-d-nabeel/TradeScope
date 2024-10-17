import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAlpacaQueries } from "@/hooks/use-alpaca.hook";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import Fuse from "fuse.js";
import { FilterIcon, Search } from "lucide-react";
import { useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "../common/loading";

type AlpacaSymbol = {
  id: string;
  symbol: string;
  name: string;
};

export function FilterMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<AlpacaSymbol | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(new Date("2023-01-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [showStocksDropdown, setShowStocksDropdown] = useState(false);
  const navigate = useNavigate();

  const { symbolsQuery } = useAlpacaQueries();
  const { data: symbolsData, isLoading, isSuccess } = symbolsQuery;

  if (isLoading) {
    return <Loading />;
  }

  if (!isSuccess || !symbolsData) {
    return <p>Failed to load data.</p>;
  }

  const fuse = new Fuse(symbolsData, {
    keys: ["symbol", "name"],
    threshold: 0.3,
    includeScore: true,
  });

  const filteredSymbols = searchTerm
    ? fuse
        .search(searchTerm)
        .slice(0, 20)
        .map((result) => result.item)
    : symbolsData?.slice(0, 20);

  const handleApplyFilters = () => {
    navigate({
      to: "/trade",
      search: {
        symbols: selectedStock?.symbol || "",
        start: startDate ? startDate.toISOString() : "",
        end: endDate ? endDate.toISOString() : "",
        name: selectedStock?.name || "",
      },
    });

    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-5 right-5 h-14 w-14 rounded-full p-0 shadow-lg transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
        >
          <FilterIcon className="h-6 w-6" />
          <span className="sr-only">Open filter menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Set the filters for your analysis
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <div className="relative">
                <Input
                  id="stock"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowStocksDropdown(true)}
                  onBlur={() => setShowStocksDropdown(false)}
                  placeholder="Search stocks..."
                  className="pr-10"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
              <AnimatePresence>
                {showStocksDropdown && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  >
                    {filteredSymbols.map((symbol) => (
                      <li
                        key={symbol.id}
                        className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          setSelectedStock(symbol);
                          setSearchTerm(symbol.symbol);
                          setShowStocksDropdown(false);
                        }}
                      >
                        <span className="block truncate font-semibold">
                          {symbol.symbol}
                        </span>
                        <span className="block truncate text-sm text-muted-foreground">
                          {symbol.name}
                        </span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-x-2">
                <div className="w-full">
                  <label
                    htmlFor="start-date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <DatePicker
                    id="start-date"
                    popperClassName="relative -mx-8 shadow-lg"
                    selected={startDate}
                    onChange={(date) => setStartDate(date as Date)}
                    maxDate={endDate}
                    dateFormat="yyyy-MM-dd"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="end-date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <DatePicker
                    id="end-date"
                    popperClassName="relative -mx-8 shadow-lg"
                    selected={endDate}
                    onChange={(date) => setEndDate(date as Date)}
                    maxDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={handleApplyFilters}
            className="w-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            Apply Filters
          </Button>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
