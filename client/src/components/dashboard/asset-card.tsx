import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlpacaAsset } from "@/types/alpaca.types";
import { motion } from "framer-motion";
import { Briefcase, TrendingUp } from "lucide-react";

export function AssetCard({
  asset,
  index,
}: {
  asset: AlpacaAsset;
  index: number;
}) {
  return (
    <motion.div
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
                {asset.symbol}
              </h2>
              <p className="text-sm text-gray-500">{asset.name}</p>
            </div>
            <Badge
              variant={asset.status === "active" ? "default" : "secondary"}
            >
              {asset.status}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="text-gray-400" size={16} />
              <span className="text-sm font-medium">{asset.class}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-gray-400" size={16} />
              <span className="text-sm font-medium">{asset.exchange}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <AssetBadge label="Tradable" value={asset.tradable} />
            <AssetBadge label="Marginable" value={asset.marginable ?? false} />
            <AssetBadge label="Shortable" value={asset.shortable} />
            <AssetBadge label="Fractionable" value={asset.fractionable} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AssetBadge({ label, value }: { label: string; value: boolean }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={value ? "default" : "secondary"}>
            {value ? label : `Not ${label}`}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            This asset {value ? "can" : "cannot"} be {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
