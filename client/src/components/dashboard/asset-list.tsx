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
import { motion } from "framer-motion";

export function AssetList({ assets }: { assets: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Exchange</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Properties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset, index) => (
            <motion.tr
              key={asset.ID}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TableCell className="font-medium">{asset.Symbol}</TableCell>
              <TableCell>{asset.Name}</TableCell>
              <TableCell>{asset.Class}</TableCell>
              <TableCell>{asset.Exchange}</TableCell>
              <TableCell>
                <Badge
                  variant={asset.Status === "active" ? "default" : "secondary"}
                >
                  {asset.Status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  <AssetBadge label="Tradable" value={asset.Tradable} />
                  <AssetBadge label="Marginable" value={asset.Marginable} />
                  <AssetBadge label="Shortable" value={asset.Shortable} />
                  <AssetBadge label="Fractionable" value={asset.Fractionable} />
                </div>
              </TableCell>
            </motion.tr>
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
            className="cursor-help"
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
