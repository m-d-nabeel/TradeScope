import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  filterClass,
  setFilterClass,
  assetClasses,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterClass: string;
  setFilterClass: (cls: string) => void;
  assetClasses: string[];
}) {
  return (
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
        {assetClasses.map((cls) => (
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
  );
}
