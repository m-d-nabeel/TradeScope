import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function TooltipComponent({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-help flex justify-center items-center whitespace-nowrap">
          {label}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="-translate-x-32">{value}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
