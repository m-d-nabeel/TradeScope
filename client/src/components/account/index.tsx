import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAlpacaQueries } from "@/hooks/use-alpaca.hook";
import { formatCurrency } from "@/lib/utils";
import {
  AlertCircle,
  Calendar,
  DollarSign,
  Lock,
  TrendingUp,
  Unlock,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { InfoItem } from "./info-item";

export function AlpacaAccountDisplay() {
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const { accountQuery } = useAlpacaQueries();
  const { data, isSuccess } = accountQuery;

  if (!isSuccess) {
    return (
      <Card className="mx-auto w-full max-w-4xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Alpaca Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex h-48 items-center justify-center">
            <p className="text-lg text-gray-500">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="mx-auto w-full max-w-4xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Alpaca Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex h-48 items-center justify-center">
            <p className="text-lg text-gray-500">No account data found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="mx-auto w-full max-w-4xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Alpaca Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Account Information
            </h3>
            <InfoItem
              label="Account Number"
              value={showSensitiveInfo ? data.account_number : "************"}
              icon={DollarSign}
            />
            <InfoItem label="Status" value={data.status} icon={AlertCircle} />
            <InfoItem
              label="Crypto Status"
              value={data.crypto_status}
              icon={Zap}
            />
            <InfoItem
              label="Currency"
              value={data.currency}
              icon={DollarSign}
            />
            <InfoItem
              label="Created At"
              value={new Date(data.created_at).toLocaleDateString()}
              icon={Calendar}
            />
            <div className="flex space-x-2">
              <Badge
                variant={data.pattern_day_trader ? "destructive" : "secondary"}
              >
                {data.pattern_day_trader
                  ? "Pattern Day Trader"
                  : "Not Pattern Day Trader"}
              </Badge>
              <Badge variant={data.shorting_enabled ? "default" : "secondary"}>
                {data.shorting_enabled
                  ? "Shorting Enabled"
                  : "Shorting Disabled"}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Financial Overview
            </h3>
            <InfoItem
              label="Portfolio Value"
              value={formatCurrency(data.portfolio_value)}
              icon={TrendingUp}
            />
            <InfoItem
              label="Cash"
              value={formatCurrency(data.cash)}
              icon={DollarSign}
            />
            <InfoItem
              label="Buying Power"
              value={formatCurrency(data.buying_power)}
              icon={Zap}
            />
            <InfoItem
              label="Daytrading Buying Power"
              value={formatCurrency(data.daytrading_buying_power)}
              icon={Zap}
            />
            <InfoItem
              label="Equity"
              value={formatCurrency(data.equity)}
              icon={TrendingUp}
            />
            <InfoItem
              label="Last Equity"
              value={formatCurrency(data.last_equity)}
              icon={TrendingUp}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Market Values
            </h3>
            <InfoItem
              label="Long Market Value"
              value={formatCurrency(data.long_market_value)}
              icon={TrendingUp}
            />
            <InfoItem
              label="Short Market Value"
              value={formatCurrency(data.short_market_value)}
              icon={TrendingUp}
            />
            <InfoItem
              label="Position Market Value"
              value={formatCurrency(data.position_market_value)}
              icon={TrendingUp}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Margins</h3>
            <InfoItem
              label="Initial Margin"
              value={formatCurrency(data.initial_margin)}
              icon={DollarSign}
            />
            <InfoItem
              label="Maintenance Margin"
              value={formatCurrency(data.maintenance_margin)}
              icon={DollarSign}
            />
            <InfoItem
              label="Last Maintenance Margin"
              value={formatCurrency(data.last_maintenance_margin)}
              icon={DollarSign}
            />
            <InfoItem
              label="SMA"
              value={formatCurrency(data.sma)}
              icon={DollarSign}
            />
          </div>

          <div className="col-span-full space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Account Restrictions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label="Trading Blocked"
                value={data.trading_blocked}
                icon={data.trading_blocked ? Lock : Unlock}
              />
              <InfoItem
                label="Transfers Blocked"
                value={data.transfers_blocked}
                icon={data.transfers_blocked ? Lock : Unlock}
              />
              <InfoItem
                label="Account Blocked"
                value={data.account_blocked}
                icon={data.account_blocked ? Lock : Unlock}
              />
              <InfoItem
                label="Trade Suspended by User"
                value={data.trade_suspended_by_user}
                icon={data.trade_suspended_by_user ? Lock : Unlock}
              />
            </div>
          </div>

          <div className="col-span-full flex justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                  className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors duration-200 hover:bg-gray-300"
                >
                  {showSensitiveInfo ? "Hide" : "Show"} Sensitive Info
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle visibility of sensitive account information</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
