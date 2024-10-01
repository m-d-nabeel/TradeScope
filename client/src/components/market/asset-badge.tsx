import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function AssetBadge({
  label,
  value,
}: {
  label: string;
  value: boolean;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={value ? "default" : "secondary"}
            className="col-span-2 flex cursor-help items-center justify-center whitespace-nowrap md:col-span-1"
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
