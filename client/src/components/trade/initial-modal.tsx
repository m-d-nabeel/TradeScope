import react from 'react'
import { useNavigate, useSearch } from "@tanstack/react-router"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAlpacaQueries } from "@/hooks/use-alpaca.hook"
import { AnimatePresence, motion } from "framer-motion"
import Fuse from "fuse.js"
import { Search } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Loading } from "@/components/common/loading"

type AlpacaSymbol = {
  id: string
  symbol: string
  name: string
}

export function InitialFilterModal() {
  const [showSymbolsDropdown, setShowSymbolsDropdown] = react.useState(false)
  const [searchTerm, setSearchTerm] = react.useState("")
  const [selectedSymbol, setSelectedSymbol] = react.useState<AlpacaSymbol | null>(null)
  const [startDate, setStartDate] = react.useState<Date | null>(new Date("2024-01-01"))
  const [endDate, setEndDate] = react.useState<Date | null>(null)
  const searchQuery = useSearch({ from: "/_main/trade/" })
  const navigate = useNavigate()

  const { symbolsQuery } = useAlpacaQueries()
  const { data: symbolsData, isLoading, isError } = symbolsQuery

  const fuse = new Fuse(symbolsData || [], {
    keys: ["symbol", "name"],
    threshold: 0.3,
    includeScore: true,
  })

  const filteredSymbols = searchTerm
    ? fuse.search(searchTerm).slice(0, 20).map((result) => result.item)
    : symbolsData?.slice(0, 20) || []

  const handleApplyFilters = () => {
    if (selectedSymbol && startDate) {
      navigate({
        to: "/trade",
        search: {
          symbols: selectedSymbol.symbol,
          startDate: startDate.toISOString(),
          endDate: endDate ? endDate.toISOString() : "",
          name: selectedSymbol.name,
        },
      })
    }
  }

  const isModalOpen = !searchQuery.symbols || !searchQuery.startDate

  if (isLoading) return <Loading />
  if (isError) return <p>Failed to load data.</p>

  return (
    <Dialog open={isModalOpen} onOpenChange={() => { }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Symbol and Date Range</DialogTitle>
          <DialogDescription>
            Please choose a symbol and date range to view the trade visualisation.
          </DialogDescription>
        </DialogHeader>
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
                        setSelectedSymbol(symbol)
                        setSearchTerm(symbol.symbol)
                        setShowSymbolsDropdown(false)
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
                <Label htmlFor="start-date">Start Date</Label>
                <DatePicker
                  id="start-date"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="w-full">
                <Label htmlFor="end-date">End Date</Label>
                <DatePicker
                  id="end-date"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  minDate={startDate ?? new Date()}
                  maxDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
          <Button
            onClick={handleApplyFilters}
            className="w-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            disabled={!selectedSymbol || !startDate}
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
