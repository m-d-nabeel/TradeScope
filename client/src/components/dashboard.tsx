import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAlpaca } from "@/hooks/useAlpaca";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Search,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

export const Dashboard = () => {
  const { assets, pageNumber, setPageNumber } = useAlpaca();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");

  console.log(assets);

  const filteredAssets = useMemo(() => {
    return (
      assets?.[pageNumber].filter(
        (asset: any) =>
          asset.Symbol.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (filterClass === "" || asset.Class === filterClass)
      ) || []
    );
  }, [assets, pageNumber, searchTerm, filterClass]);

  const currentAssets = filteredAssets;

  const assetClasses = useMemo(() => {
    return [
      ...new Set(assets?.[pageNumber].map((asset: any) => asset.Class) || []),
    ];
  }, [assets, pageNumber]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Alpaca Assets Dashboard
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 w-full sm:w-auto">
            <Button
              variant={filterClass === "" ? "default" : "outline"}
              onClick={() => setFilterClass("")}
              className="whitespace-nowrap"
            >
              All
            </Button>
            {assetClasses.map((cls: any) => (
              <Button
                key={cls}
                variant={filterClass === cls ? "default" : "outline"}
                onClick={() => setFilterClass(cls)}
                className="whitespace-nowrap"
              >
                {cls}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {currentAssets.map((asset: any, index: number) => (
              <motion.div
                key={asset.ID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          {asset.Symbol}
                        </h2>
                        <p className="text-sm text-gray-500">{asset.Name}</p>
                      </div>
                      <Badge
                        variant={
                          asset.Status === "active" ? "default" : "secondary"
                        }
                      >
                        {asset.Status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="text-gray-400" size={16} />
                        <span className="text-sm font-medium">
                          {asset.Class}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="text-gray-400" size={16} />
                        <span className="text-sm font-medium">
                          {asset.Exchange}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant={asset.Tradable ? "default" : "secondary"}
                            >
                              {asset.Tradable ? "Tradable" : "Not Tradable"}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              This asset {asset.Tradable ? "can" : "cannot"} be
                              traded
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant={
                                asset.Marginable ? "default" : "secondary"
                              }
                            >
                              {asset.Marginable
                                ? "Marginable"
                                : "Not Marginable"}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              This asset {asset.Marginable ? "can" : "cannot"}{" "}
                              be traded on margin
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant={
                                asset.Shortable ? "default" : "secondary"
                              }
                            >
                              {asset.Shortable ? "Shortable" : "Not Shortable"}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              This asset {asset.Shortable ? "can" : "cannot"} be
                              sold short
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant={
                                asset.Fractionable ? "default" : "secondary"
                              }
                            >
                              {asset.Fractionable
                                ? "Fractionable"
                                : "Not Fractionable"}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              This asset{" "}
                              {asset.Fractionable
                                ? "supports"
                                : "does not support"}{" "}
                              fractional shares
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center">
          <Button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber === 1}
            variant="outline"
          >
            <ChevronLeft className="mr-2" size={16} /> Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {pageNumber} of {Infinity}
          </span>
          <Button
            onClick={() => setPageNumber((prev) => Math.min(prev + 1, Infinity))}
            disabled={pageNumber === Infinity}
            variant="outline"
          >
            Next <ChevronRight className="ml-2" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
