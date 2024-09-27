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
