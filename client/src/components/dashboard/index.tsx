"use client";

import { Button } from "@/components/ui/button";
import { useAlpaca } from "@/hooks/useAlpaca";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { AssetCard } from "./asset-card";
import { AssetList } from "./asset-list";
import { Pagination } from "./pagination";
import { SearchAndFilter } from "./search-and-filter";

export function Dashboard() {
  const { assets, pageNumber, setPageNumber } = useAlpaca();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredAssets =
    assets?.[pageNumber]?.filter(
      (asset: any) =>
        asset.Symbol.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterClass === "" || asset.Class === filterClass)
    ) || [];

  const assetClasses = [
    ...new Set(assets?.[pageNumber]?.map((asset: any) => asset.Class) || []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-teal-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Alpaca Assets Dashboard
        </h1>

        <div className="flex justify-between items-center mb-6">
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterClass={filterClass}
            setFilterClass={setFilterClass}
            assetClasses={assetClasses as string[]}
          />
          <div className="flex space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
              size="icon"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              size="icon"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === "list" && <AssetList assets={filteredAssets} />}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset: any, index: number) => (
              <AssetCard key={asset.Symbol} asset={asset} index={index} />
            ))}
          </div>
        )}

        <Pagination
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          totalPages={Infinity}
        />
      </div>
    </div>
  );
}
