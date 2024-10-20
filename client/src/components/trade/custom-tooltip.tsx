import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card className="h-fit w-fit border-border bg-background p-1 drop-shadow">
        <CardHeader className="p-0 pb-1">
          <CardTitle className="text-sm font-medium">
            {format(parseISO(label), "MMM d, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent className="m-0 h-fit w-fit p-0">
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="flex justify-stretch text-sm">
              <span className="font-medium" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="ml-auto italic">${entry.value.toFixed(2)}</span>
            </p>
          ))}
        </CardContent>
      </Card>
    );
  }
  return null;
};
