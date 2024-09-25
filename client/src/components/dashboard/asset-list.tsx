import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Briefcase, TrendingUp } from "lucide-react";

export function AssetList({ assets }: { assets: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <Briefcase className="text-gray-400" size={16} />
                <span className="text-sm font-medium">Class</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-gray-400" size={16} />
                <span className="text-sm font-medium">Exchange</span>
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Properties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.ID} className="h-fit">
              <TableCell className="font-medium">{asset.Symbol}</TableCell>
              <TableCell>{asset.Name}</TableCell>
              <TableCell className="text-center">{asset.Class}</TableCell>
              <TableCell className="text-center">{asset.Exchange}</TableCell>
              <TableCell>
                <Badge
                  variant={asset.Status === "active" ? "default" : "secondary"}
                >
                  {asset.Status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="grid gap-2 grid-cols-4">
                  <AssetBadge label="Tradable" value={asset.Tradable} />
                  <AssetBadge label="Marginable" value={asset.Marginable} />
                  <AssetBadge label="Shortable" value={asset.Shortable} />
                  <AssetBadge label="Fractionable" value={asset.Fractionable} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AssetBadge({ label, value }: { label: string; value: boolean }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={value ? "default" : "secondary"}
            className="cursor-help flex justify-center items-center whitespace-nowrap col-span-2 md:col-span-1"
          >
            {value ? label[0] : `-${label[0]}`}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{value ? label : `Not ${label}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
