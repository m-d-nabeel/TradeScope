package server

import (
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/trading-backend/internal/lib"
	alpacamarket "github.com/trading-backend/internal/service/alpaca_service"
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

	cacheKey := strings.Join([]string{symbols, start, end, timeframe}, ":")
	var barsResponse alpacamarket.BarsResponse
	err := s.getCachedData(r.Context(), cacheKey, &barsResponse)

	if err == nil {
		log.Println("cache hit")
		lib.RespondJSON(w, http.StatusOK, barsResponse)
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

	barsResponse, err = alpacamarket.GetHistoricalBars()
	if err != nil {
		log.Printf("Error getting historical bars: %v", err)
		lib.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	s.cacheData(r.Context(), cacheKey, barsResponse, 15*time.Minute)

	lib.RespondJSON(w, http.StatusOK, barsResponse)
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

	cacheKey := strings.Join([]string{symbols, start, end}, ":")
	var auctionsResponse alpacamarket.AuctionsResponse
	err := s.getCachedData(r.Context(), cacheKey, &auctionsResponse)

	if err == nil {
		log.Println("cache hit")
		lib.RespondJSON(w, http.StatusOK, auctionsResponse)
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

	auctionsResponse, err = alpacamarket.GetHistoricalAuctions()
	if err != nil {
		log.Printf("Error getting historical auctions: %v", err)
		lib.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	s.cacheData(r.Context(), cacheKey, auctionsResponse, 15*time.Minute)

	lib.RespondJSON(w, http.StatusOK, auctionsResponse)
}

func (s *Server) getStocksExchangesHandler(w http.ResponseWriter, r *http.Request) {

	cacheKey := "stocks:meta-exchanges"
	var exchanges map[string]string
	err := s.getCachedData(r.Context(), cacheKey, &exchanges)

	if err == nil {
		log.Println("cache hit")
		lib.RespondJSON(w, http.StatusOK, exchanges)
		return
	}

	exchanges, err = alpacamarket.GetStocksExchanges()
	if err != nil {
		log.Printf("Error getting stocks exchanges: %v", err)
		lib.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	s.cacheData(r.Context(), cacheKey, exchanges, 15*time.Minute)

	lib.RespondJSON(w, http.StatusOK, exchanges)
}
