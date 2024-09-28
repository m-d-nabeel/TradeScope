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
	StocksAuctionEndpoint = "/stocks/auction"
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

type BarsResponse struct {
	Bars map[string][]Bar `json:"bars"`
}

// Default query parameters for Alpaca API requests
var MarketDataQuery = map[string]string{
	"symbols":    "AAPL",                 // Comma-separated list of symbols
	"timeframe":  "1W",                   // Timeframe for the bars (e.g., 1Min, 1H, 1D, 1W, 1M)
	"start":      "2022-01-01T00:00:00Z", // Start date in RFC-3339 format
	"end":        "",                     // End date in RFC-3339 format
	"limit":      strconv.Itoa(1000),     // Maximum number of bars to return
	"adjustment": "raw",                  // Adjustment type ("raw", "split", "dividend", "all")
	"asof":       "",                     // As-of date (default is current date)
	"feed":       "sip",                  // Data feed ("sip", "iex", "otc")
	"currency":   "USD",                  // Currency (default is USD)
	"sort":       "asc",                  // Sort order ("asc" or "desc")
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
