package server

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/trading-backend/internal/lib"
	alpacamarket "github.com/trading-backend/internal/service/alpaca_market"
	"github.com/trading-backend/pkg/validator"
)

func (s *Server) getHistoricalBarsHandler(w http.ResponseWriter, r *http.Request) {

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

func (s *Server) getHistoricalAuctionsHandler(w http.ResponseWriter, r *http.Request) {

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

func (s *Server) getStocksExchangesHandler(w http.ResponseWriter, r *http.Request) {

	// Check cache
	cacheKey := "stocks:meta-exchanges"
	cachedData, err := s.rdb.Get(r.Context(), cacheKey)
	if err == nil {
		log.Println("cache hit")
		var exchanges map[string]string
		err = json.Unmarshal([]byte(cachedData), &exchanges)

		if err != nil {
			log.Println(err)
		} else {
			lib.RespondJSON(w, http.StatusOK, exchanges)
			return
		}
	}

	exchanges, err := alpacamarket.GetStocksExchanges()
	if err != nil {
		log.Printf("Error getting stocks exchanges: %v", err)
		lib.RespondError(w, http.StatusInternalServerError, err.Error())
	}

	// Cache exchanges
	exchangesJSON, err := json.Marshal(exchanges)
	if err == nil {
		err = s.rdb.Set(r.Context(), cacheKey, exchangesJSON, 15*time.Minute)
		if err != nil {
			log.Println("Error caching account:", err)
		}
	} else {
		log.Println("Error unmarshaling account from cache:", err)
	}

	lib.RespondJSON(w, http.StatusOK, exchanges)
}
