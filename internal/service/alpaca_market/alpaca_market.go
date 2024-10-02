package alpacamarket

import (
	"log"
	"net/http"
	"strconv"

	"github.com/trading-backend/config"
)

const (
	// Alpaca API endpoints
	StocksBarsEndpoint    = "/stocks/bars"
	StocksAuctionEndpoint = "/stocks/auctions"
	MetaStocksExchanges   = "/stocks/meta/exchanges"
)

type Bar struct {
	ClosingPrice      float64 `json:"c"`
	HighPrice         float64 `json:"h"`
	LowPrice          float64 `json:"l"`
	TradeCountInBar   int64   `json:"n"`
	Opening           float64 `json:"o"`
	Timestamp         string  `json:"t"`
	BarVolume         int64   `json:"v"`
	VolumeWeightedAvg float64 `json:"vw"`
}

type AuctionFields struct {
	Timestamp     string  `json:"t"`
	ExchangeCode  string  `json:"x"` // See v2/stocks/meta/exchanges for more details.
	AuctionPrice  float64 `json:"p"` // Auction price
	AuctionSize   int64   `json:"s"` // Auction trade size
	ConditionFlag string  `json:"c"` // The condition flag indicating that this is an auction. See v2/stocks/meta/conditions/trade for more details.
}

type Auction struct {
	Date            string          `json:"d"`
	OpeningAuctions []AuctionFields `json:"o"`
	ClosingAuctions []AuctionFields `json:"c"`
}

type BarsResponse struct {
	Bars          map[string][]Bar `json:"bars"`
	NextPageToken string           `json:"next_page_token"`
	Currency      string           `json:"currency"`
}

type AuctionsResponse struct {
	Auctions      map[string][]Auction `json:"auctions"`
	NextPageToken string               `json:"next_page_token"`
	Currency      string               `json:"currency"`
}

// Default query parameters for Alpaca API requests
var MarketAuctionQuery = map[string]string{
	"symbols":    "AAPL",             // Comma-separated list of symbols
	"start":      "",                 // Start date in RFC-3339 format
	"end":        "",                 // End date in RFC-3339 format
	"limit":      strconv.Itoa(1000), // Maximum number of bars to return
	"asof":       "",                 // As-of date (default is current date)
	"feed":       "sip",              // Data feed ("sip", "iex", "otc")
	"currency":   "USD",              // Currency (default is USD)
	"sort":       "asc",              // Sort order ("asc" or "desc")
	"page_token": "",                 // Page token for pagination
}

var MarketBarQuery = map[string]string{
	"symbols":    "AAPL",             // Comma-separated list of symbols
	"timeframe":  "1W",               // Timeframe for the bars (e.g., 1Min, 1H, 1D, 1W, 1M)
	"start":      "",                 // Start date in RFC-3339 format
	"end":        "",                 // End date in RFC-3339 format
	"limit":      strconv.Itoa(1000), // Maximum number of bars to return
	"adjustment": "raw",              // Adjustment type ("raw", "split", "dividend", "all")
	"asof":       "",                 // As-of date (default is current date)
	"feed":       "sip",              // Data feed ("sip", "iex", "otc")
	"currency":   "USD",              // Currency (default is USD)
	"sort":       "asc",              // Sort order ("asc" or "desc")
	"page_token": "",                 // Page token for pagination
}

type MarketService interface {
	newAlpacaRequest(method, path string) (*http.Request, error)
	GetHistoricalBars() (BarsResponse, error)
}

// newAlpacaRequest creates a new HTTP request to the Alpaca API
func newAlpacaRequest(method, path string) (*http.Request, error) {
	alpacaRequest, err := http.NewRequest(
		method,
		"https://data.alpaca.markets/v2"+path,
		nil,
	)

	if err != nil {
		log.Printf("Error creating request to Alpaca API: %v", err)
		return nil, err
	}

	alpacaRequest.Header.Add("APCA-API-KEY-ID", config.Envs.ApcaApiKeyId)
	alpacaRequest.Header.Add("APCA-API-SECRET-KEY", config.Envs.ApcaApiSecretKey)

	return alpacaRequest, nil
}
