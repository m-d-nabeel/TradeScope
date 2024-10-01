export type AlpacaAccount = {
  id: string;
  account_number: string;
  status: string;
  crypto_status: string;
  currency: string;
  buying_power: string;
  regt_buying_power: string;
  daytrading_buying_power: string;
  effective_buying_power: string;
  non_marginable_buying_power: string;
  bod_dtbp: string;
  cash: string;
  accrued_fees: string;
  portfolio_value: string;
  pattern_day_trader: boolean;
  trading_blocked: boolean;
  transfers_blocked: boolean;
  account_blocked: boolean;
  shorting_enabled: boolean;
  trade_suspended_by_user: boolean;
  created_at: string;
  multiplier: string;
  equity: string;
  last_equity: string;
  long_market_value: string;
  short_market_value: string;
  position_market_value: string;
  initial_margin: string;
  maintenance_margin: string;
  last_maintenance_margin: string;
  sma: string;
  daytrade_count: number;
  crypto_tier: number;
};

export type AlpacaAsset = {
  id: string;
  class: string;
  easyToBorrow: boolean;
  exchange: string;
  fractionable: boolean;
  maintenanceMarginRequirement: string;
  marginRequirementLong?: string;
  marginRequirementShort?: string;
  marginable?: boolean;
  name: string;
  seqID: number;
  shortable: boolean;
  status: string;
  symbol: string;
  tradable: boolean;
  attributes: string[];
};

type AlpacaAuctionFields = {
  t: string;
  x: string;
  p: number;
  s: number;
  c: string;
};

export type AlpacaAuction = {
  d: string;
  o: AlpacaAuctionFields[] | null;
  c: AlpacaAuctionFields[] | null;
};

export type AlpacaAuctions = {
  auctions: Record<string, AlpacaAuction[]>;
  next_page_token: string;
  currency: string;
};
