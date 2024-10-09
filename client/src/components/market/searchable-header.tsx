import { AlpacaAsset } from "@/types/alpaca.types";
import { Table } from "@tanstack/react-table";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export const SearchableHeader = ({
  column,
  title,
  icon,
}: {
  column: any;
  table: Table<AlpacaAsset>;
  title: string;
  icon?: React.ReactNode;
}) => {
  const [isSearching, setIsSearching] = useState(false);

  if (isSearching) {
    return (
      <div className="flex items-center">
        <input
          type="text"
          placeholder={`Search ${title}...`}
          value={(column.getFilterValue() as string) ?? ""}
          onChange={(e) => column.setFilterValue(e.target.value)}
          className="w-full rounded border px-2 py-1"
        />
        <Button
          variant="ghost"
          onClick={() => {
            setIsSearching(false);
            column.setFilterValue("");
          }}
          className="ml-2"
        >
          <XIcon size={16} />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={() => setIsSearching(true)}
      className="w-full justify-between"
    >
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
    </Button>
  );
};
