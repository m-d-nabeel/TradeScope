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
		lib.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	if symbols != "" {
		alpacamarket.MarketDataQuery["symbols"] = symbols
	}
	if timeframe != "" {
		alpacamarket.MarketDataQuery["timeframe"] = timeframe
	}
	if start != "" {
		alpacamarket.MarketDataQuery["start"] = start
	}
	if end != "" {
		alpacamarket.MarketDataQuery["end"] = end
	}

	data, err := alpacamarket.GetHistoricalBars()
	if err != nil {
		lib.RespondError(w, http.StatusInternalServerError, err.Error())
	}

	lib.RespondJSON(w, http.StatusOK, data)
}
