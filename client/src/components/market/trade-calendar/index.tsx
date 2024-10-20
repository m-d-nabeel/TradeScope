import { ErrorComponent } from "@/components/common/error-component";
import { Loading } from "@/components/common/loading";
import { Card, CardContent } from "@/components/ui/card";
import { useAlpacaQueries } from "@/hooks/use-alpaca.hook";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useState } from "react";
import { CalendarDay } from "./calendar-day";
import { CalendarHeader } from "./calendar-header";

export function TradingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { calendarQuery } = useAlpacaQueries();
  const { data: tradingCalendar, isLoading, error } = calendarQuery;

  if (isLoading) return <Loading />;
  if (!tradingCalendar) return <ErrorComponent error={Error(error?.message)} />;

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <Card className="container mx-auto my-4 w-full max-w-7xl bg-gradient-to-br from-gray-50 to-white shadow-xl sm:my-8">
      <CardContent className="p-2 sm:p-6">
        <CalendarHeader
          currentDate={currentDate}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />
        <div className="mt-4 grid grid-cols-7 gap-1 sm:mt-8 sm:gap-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 sm:text-sm">
              {day}
            </div>
          ))}
          {days.map((day) => (
            <CalendarDay
              key={day.toISOString()}
              day={day}
              isCurrentMonth={isSameMonth(day, currentDate)}
              tradingDay={tradingCalendar.find((d) => isSameDay(new Date(d.date), day))}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
