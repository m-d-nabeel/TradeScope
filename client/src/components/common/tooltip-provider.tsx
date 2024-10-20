import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export function TooltipComponent({ label, value }: { label: string; value: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="flex cursor-help items-center justify-center whitespace-nowrap">
          {label}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="-translate-x-32">
          {value}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
