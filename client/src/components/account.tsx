import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlpacaAccount } from "@/types/alpaca.types";
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

function formatCurrency(value: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(parseFloat(value));
}

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number | boolean;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Icon className="w-5 h-5 text-gray-400" />
      <span className="text-sm font-medium text-gray-500">{label}:</span>
      <span className="text-sm font-semibold">
        {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
      </span>
    </div>
  );
}

export function AlpacaAccountDisplay({ account }: { account: AlpacaAccount }) {
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);

  return (
    <TooltipProvider>
      <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Alpaca Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Account Information
            </h3>
            <InfoItem
              label="Account Number"
              value={
                showSensitiveInfo ? account.account_number : "************"
              }
              icon={DollarSign}
            />
            <InfoItem
              label="Status"
              value={account.status}
              icon={AlertCircle}
            />
            <InfoItem
              label="Crypto Status"
              value={account.crypto_status}
              icon={Zap}
            />
            <InfoItem
              label="Currency"
              value={account.currency}
              icon={DollarSign}
            />
            <InfoItem
              label="Created At"
              value={new Date(account.created_at).toLocaleDateString()}
              icon={Calendar}
            />
            <div className="flex space-x-2">
              <Badge
                variant={
                  account.pattern_day_trader ? "destructive" : "secondary"
                }
              >
                {account.pattern_day_trader
                  ? "Pattern Day Trader"
                  : "Not Pattern Day Trader"}
              </Badge>
              <Badge
                variant={account.shorting_enabled ? "default" : "secondary"}
              >
                {account.shorting_enabled
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
              value={formatCurrency(account.portfolio_value)}
              icon={TrendingUp}
            />
            <InfoItem
              label="Cash"
              value={formatCurrency(account.cash)}
              icon={DollarSign}
            />
            <InfoItem
              label="Buying Power"
              value={formatCurrency(account.buying_power)}
              icon={Zap}
            />
            <InfoItem
              label="Daytrading Buying Power"
              value={formatCurrency(account.daytrading_buying_power)}
              icon={Zap}
            />
            <InfoItem
              label="Equity"
              value={formatCurrency(account.equity)}
              icon={TrendingUp}
            />
            <InfoItem
              label="Last Equity"
              value={formatCurrency(account.last_equity)}
              icon={TrendingUp}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Market Values
            </h3>
            <InfoItem
              label="Long Market Value"
              value={formatCurrency(account.long_market_value)}
              icon={TrendingUp}
            />
            <InfoItem
              label="Short Market Value"
              value={formatCurrency(account.short_market_value)}
              icon={TrendingUp}
            />
            <InfoItem
              label="Position Market Value"
              value={formatCurrency(account.position_market_value)}
              icon={TrendingUp}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Margins</h3>
            <InfoItem
              label="Initial Margin"
              value={formatCurrency(account.initial_margin)}
              icon={DollarSign}
            />
            <InfoItem
              label="Maintenance Margin"
              value={formatCurrency(account.maintenance_margin)}
              icon={DollarSign}
            />
            <InfoItem
              label="Last Maintenance Margin"
              value={formatCurrency(account.last_maintenance_margin)}
              icon={DollarSign}
            />
            <InfoItem
              label="SMA"
              value={formatCurrency(account.sma)}
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
                value={account.trading_blocked}
                icon={account.trading_blocked ? Lock : Unlock}
              />
              <InfoItem
                label="Transfers Blocked"
                value={account.transfers_blocked}
                icon={account.transfers_blocked ? Lock : Unlock}
              />
              <InfoItem
                label="Account Blocked"
                value={account.account_blocked}
                icon={account.account_blocked ? Lock : Unlock}
              />
              <InfoItem
                label="Trade Suspended by User"
                value={account.trade_suspended_by_user}
                icon={account.trade_suspended_by_user ? Lock : Unlock}
              />
            </div>
          </div>

          <div className="col-span-full flex justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
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
