import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, X } from "lucide-react";
import { useState } from "react";

interface TradingDay {
  date: string;
  open: string;
  close: string;
  session_open: string;
  session_close: string;
  settlement_date: string;
}

interface CalendarDayProps {
  day: Date;
  isCurrentMonth: boolean;
  tradingDay?: TradingDay;
}

export function CalendarDay({ day, isCurrentMonth, tradingDay }: CalendarDayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatSessionTime = (time: string) => {
    const hours = time.slice(0, 2);
    const minutes = time.slice(2);
    return `${hours}:${minutes}`;
  };

  const dayClasses = cn(
    "p-1 sm:p-3 rounded-xl transition-all duration-300 ease-in-out relative overflow-hidden",
    isCurrentMonth ? "bg-gradient-to-br from-blue-50 to-indigo-100" : "bg-gray-100 text-gray-400",
    tradingDay ? "cursor-pointer hover:shadow-lg hover:scale-105 transform" : "",
  );

  return (
    <>
      <motion.div
        className={dayClasses}
        onClick={() => tradingDay && setIsExpanded(!isExpanded)}
        layout
      >
        <motion.div
          className={cn(
            "absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold sm:left-2 sm:top-2 sm:h-8 sm:w-8 sm:text-sm",
            isCurrentMonth ? "bg-indigo-500 text-white" : "bg-gray-300 text-gray-600",
          )}
          layoutId={`date-${day.toISOString()}`}
        >
          {format(day, "d")}
        </motion.div>
        {tradingDay && (
          <div className="mt-4 space-y-1 text-[8px] sm:mt-8 sm:text-xs">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1 text-green-600">
                    <Clock className="h-2 w-2 sm:h-3 sm:w-3" />
                    <span>{tradingDay.open}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Market opening time</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1 text-red-600">
                    <Clock className="h-2 w-2 sm:h-3 sm:w-3" />
                    <span>{tradingDay.close}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Market closing time</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </motion.div>
      <AnimatePresence>
        {isExpanded && tradingDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between bg-indigo-500 p-4 text-white">
                <h3 className="text-lg font-semibold">
                  {format(parseISO(tradingDay.date), "MMMM d, yyyy")}
                </h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="rounded-full p-1 transition-colors hover:bg-indigo-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4 p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm text-gray-700">Market Hours:</span>
                  <span className="font-medium text-indigo-700">
                    {tradingDay.open} - {tradingDay.close}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm text-gray-700">Session:</span>
                  <span className="font-medium text-indigo-700">
                    {formatSessionTime(tradingDay.session_open)} -{" "}
                    {formatSessionTime(tradingDay.session_close)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm text-gray-700">Settlement:</span>
                  <span className="font-medium text-indigo-700">
                    {format(parseISO(tradingDay.settlement_date), "MMMM d, yyyy")}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
