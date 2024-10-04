import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as React from "react";

interface InfoItemProps {
  label?: string;
  value?: string | number | boolean;
  icon: React.ElementType;
  className?: string;
}

export function InfoItem({
  label,
  value,
  icon: Icon,
  className,
}: InfoItemProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const formattedValue = React.useMemo(() => {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    return value;
  }, [value]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              "group flex items-center space-x-3 rounded-lg bg-white p-3 shadow-md transition-all duration-300 ease-in-out hover:bg-primary/5 hover:shadow-lg",
              className,
            )}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.0125 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="rounded-full bg-primary/10 p-2 text-primary"
              animate={{
                rotate: isHovered ? [0, -10, 10, -10, 10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                {label}
              </span>
              <span className="text-base font-semibold text-foreground">
                {formattedValue}
              </span>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {label}: {formattedValue}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
