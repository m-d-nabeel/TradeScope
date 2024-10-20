import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAlpacaQueries } from "@/hooks/use-alpaca.hook";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import Fuse from "fuse.js";
import { FilterIcon, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Loading} from "../common/loading";

type AlpacaSymbol = {
  id: string;
  symbol: string;
  name: string;
};

export function FilterMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSymbolsDropdown, setShowSymbolsDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<AlpacaSymbol | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const searchQuery = useSearch({ from: "/_main/trade/" });
  const navigate = useNavigate();

  const { symbolsQuery } = useAlpacaQueries();
  const { data: symbolsData, isLoading, isError } = symbolsQuery;

  useEffect(() => {
    setStartDate(searchQuery.startDate ? new Date(searchQuery.startDate) : new Date("2024-01-01"));
    setEndDate(searchQuery.endDate ? new Date(searchQuery.endDate) : null);
    setSearchTerm(searchQuery.symbols?.split(",")[0] ?? "");
  }, [searchQuery]);

  const fuse = React.useMemo(() => {
    return new Fuse(symbolsData || [], {
      keys: ["symbol", "name"],
      threshold: 0.3,
      includeScore: true,
    });
  }, [symbolsData]);

  const filteredSymbols = React.useMemo(() => {
    if (!searchTerm) return symbolsData?.slice(0, 20) || [];
    return fuse
      .search(searchTerm)
      .slice(0, 20)
      .map((result) => result.item);
  }, [searchTerm, symbolsData, fuse]);

  const handleApplyFilters = () => {
    navigate({
      to: "/trade",
      search: {
        symbols: selectedSymbol?.symbol || "",
        startDate: startDate ? startDate.toISOString() : "",
        endDate: endDate ? endDate.toISOString() : "",
        name: selectedSymbol?.name || "",
      },
    });
    setIsOpen(false);
  };

  if (isLoading) return <Loading />;
  if (isError) return <p>Failed to load data.</p>;

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
            <p className="text-sm text-muted-foreground">Set the filters for your analysis</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Symbol</Label>
              <div className="relative">
                <Input
                  id="stock"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSymbolsDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSymbolsDropdown(false), 200)}
                  placeholder="Search stocks..."
                  className="pr-10"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
              <AnimatePresence>
                {showSymbolsDropdown && (
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
                          setSelectedSymbol(symbol);
                          setSearchTerm(symbol.symbol);
                          setShowSymbolsDropdown(false);
                        }}
                      >
                        <span className="block truncate font-semibold">{symbol.symbol}</span>
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
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <DatePicker
                    id="start-date"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    maxDate={endDate || new Date()}
                    dateFormat="yyyy-MM-dd"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <DatePicker
                    id="end-date"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    minDate={startDate ?? new Date("2024-01-01")}
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
