import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Briefcase, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function AssetCard({ asset, index }: { asset: any; index: number }) {
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
                {asset.Symbol}
              </h2>
              <p className="text-sm text-gray-500">{asset.Name}</p>
            </div>
            <Badge
              variant={asset.Status === "active" ? "default" : "secondary"}
            >
              {asset.Status}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="text-gray-400" size={16} />
              <span className="text-sm font-medium">{asset.Class}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-gray-400" size={16} />
              <span className="text-sm font-medium">{asset.Exchange}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <AssetBadge label="Tradable" value={asset.Tradable} />
            <AssetBadge label="Marginable" value={asset.Marginable} />
            <AssetBadge label="Shortable" value={asset.Shortable} />
            <AssetBadge label="Fractionable" value={asset.Fractionable} />
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
