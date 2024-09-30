package server

import (
	"log"
	"net/http"

	"github.com/trading-backend/internal/lib"
	alpacamarket "github.com/trading-backend/internal/service/alpaca_market"
	"github.com/trading-backend/pkg/validator"
)

func (s *Server) GetHistoricalBarsHandler(w http.ResponseWriter, r *http.Request) {

	queryVals := r.URL.Query()

	symbols := queryVals.Get("symbols")
	timeframe := queryVals.Get("timeframe")
	start := queryVals.Get("start")
	end := queryVals.Get("end")

	log.Printf("symbols: %s, timeframe: %s, start: %s, end: %s", symbols, timeframe, start, end)

	if err := validator.ValidateMarketQuery(symbols, timeframe, start, end); err != nil {
		log.Printf("Error validating query: %v", err)
		lib.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	if symbols != "" {
		alpacamarket.MarketBarQuery["symbols"] = symbols
	}
	if timeframe != "" {
		alpacamarket.MarketBarQuery["timeframe"] = timeframe
	}
	if start != "" {
		alpacamarket.MarketBarQuery["start"] = start
	}
	if end != "" {
		alpacamarket.MarketBarQuery["end"] = end
	}

	data, err := alpacamarket.GetHistoricalBars()
	if err != nil {
		log.Printf("Error getting historical bars: %v", err)
		lib.RespondError(w, http.StatusInternalServerError, err.Error())
	}

	lib.RespondJSON(w, http.StatusOK, data)
}

func (s *Server) GetHistoricalAuctionsHandler(w http.ResponseWriter, r *http.Request) {

	queryVals := r.URL.Query()

	symbols := queryVals.Get("symbols")
	start := queryVals.Get("start")
	end := queryVals.Get("end")

	if err := validator.ValidateMarketQuery(symbols, "", start, end); err != nil {
		log.Printf("Error validating query: %v", err)
		lib.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	if symbols != "" {
		alpacamarket.MarketAuctionQuery["symbols"] = symbols
	}
	if start != "" {
		alpacamarket.MarketAuctionQuery["start"] = start
	}
	if end != "" {
		alpacamarket.MarketAuctionQuery["end"] = end
	}

	data, err := alpacamarket.GetHistoricalAuctions()
	if err != nil {
		log.Printf("Error getting historical auctions: %v", err)
		lib.RespondError(w, http.StatusInternalServerError, err.Error())
	}

	lib.RespondJSON(w, http.StatusOK, data)
}
