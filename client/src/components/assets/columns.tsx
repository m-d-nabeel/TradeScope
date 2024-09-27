import { AlpacaAsset } from "@/types/alpaca.types";
import { ColumnDef } from "@tanstack/react-table";
import { Briefcase, ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import { TooltipComponent } from "../common/tooltip-provider";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { AssetBadge } from "./asset-badge";

export const columns: ColumnDef<AlpacaAsset>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("symbol")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "class",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="flex items-center space-x-2">
            <Briefcase className="text-gray-400" size={16} />
            <span className="text-sm font-medium">Class</span>
          </div>
          {column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("class")}</div>
    ),
  },
  {
    accessorKey: "exchange",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-gray-400" size={16} />
            <span className="text-sm font-medium">Exchange</span>
          </div>
          {column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("exchange")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-gray-400" size={16} />
            <span className="text-sm font-medium">Status</span>
          </div>
          {column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "properties",
    header: () => <div className="grid place-items-center">Properties</div>,
    cell: ({ row }) => {
      const asset = row.original;
      return (
        <div className="grid gap-2 grid-cols-5">
          <AssetBadge label="Tradable" value={asset.tradable} />
          <AssetBadge label="Marginable" value={asset.marginable ?? false} />
          <AssetBadge label="Shortable" value={asset.shortable} />
          <AssetBadge label="Fractionable" value={asset.fractionable} />
          <AssetBadge label="Easy To Borrow" value={asset.easyToBorrow} />
        </div>
      );
    },
  },
  {
    accessorKey: "maintenance_margin_requirement",
    header: () => (
      <TooltipComponent label="Margin" value="Maintenance Margin Requirement" />
    ),
  },
];
