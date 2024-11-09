package server

import (
	"log"
	"net/http"
	"time"

	"github.com/alpacahq/alpaca-trade-api-go/v3/alpaca"
	"github.com/go-chi/chi/v5"
	"github.com/trading-backend/internal/database/sqlc"
	"github.com/trading-backend/internal/lib"
	alpacaservice "github.com/trading-backend/internal/service/alpaca_service"
)

func (s *Server) getPositionsHandler(w http.ResponseWriter, r *http.Request) {
	positions, err := s.apca.GetPositions()
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to fetch positions", http.StatusInternalServerError)
		return
	}
	lib.RespondJSON(w, http.StatusAccepted, positions)
}

func (s *Server) getAssetHandler(w http.ResponseWriter, r *http.Request) {

	symbol := chi.URLParam(r, "symbol")
	if symbol == "" {
		log.Println("Invalid symbol")
		lib.RespondError(w, http.StatusInternalServerError, "Invalid symbol")
		return
	}

	cacheKey := "asset: " + symbol
	var asset *alpaca.Asset
	err := s.getCachedData(r.Context(), cacheKey, &asset)

	if err == nil {
		log.Println("cache hit")
		lib.RespondJSON(w, http.StatusOK, asset)
		return
	}
	asset, err = s.apca.GetAsset(symbol)
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to fetch asset", http.StatusInternalServerError)
		return
	}

	err = s.cacheData(r.Context(), cacheKey, asset, 15*time.Minute)
	if err != nil {
		log.Println("failed to cache data")
	}

	lib.RespondJSON(w, http.StatusAccepted, asset)
}

func (s *Server) getAssetsHandler(w http.ResponseWriter, r *http.Request) {
	dbQuery := sqlc.New(s.db.GetPool())
	assets, err := dbQuery.ListAssets(r.Context())
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to fetch assets", http.StatusInternalServerError)
		return
	}

	assetsRes := lib.SortAssetsByTradable(lib.DbAssetsToAssets(assets))

	lib.RespondJSON(w, http.StatusAccepted, assetsRes)
}

func (s *Server) getAssetByIdHandler(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	if idStr == "" {
		log.Println("Invalid ID")
		lib.RespondError(w, http.StatusInternalServerError, "Invalid ID")
		return
	}

	pguuid, err := lib.UUIDFromString(idStr)
	if err != nil {
		log.Println(err)
		lib.RespondError(w, http.StatusInternalServerError, "Invalid ID")
		return
	}

	dbQuery := sqlc.New(s.db.GetPool())

	asset, err := dbQuery.GetAssetByID(r.Context(), pguuid)
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to fetch asset", http.StatusInternalServerError)
		return
	}
	lib.RespondJSON(w, http.StatusAccepted, lib.DbAssetToAsset(asset))
}

func (s *Server) getAssetSymbolsHandler(w http.ResponseWriter, r *http.Request) {
	dbQuery := sqlc.New(s.db.GetPool())
	symbols, err := dbQuery.ListSymbols(r.Context())
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to fetch asset symbols", http.StatusInternalServerError)
		return
	}
	lib.RespondJSON(w, http.StatusAccepted, lib.DbSymbolsToSymbols(symbols))
}

func (s *Server) getTradingCalendarHandler(w http.ResponseWriter, r *http.Request) {
	cacheKey := "trading-calendar"
	var calendar []alpacaservice.CalendarDay
	err := s.getCachedData(r.Context(), cacheKey, &calendar)

	if err == nil {
		log.Println("cache hit")
		lib.RespondJSON(w, http.StatusOK, calendar)
		return
	}

	calendar, err = alpacaservice.GetCalendar()
	if err != nil {
		log.Printf("Error getting trading calendar: %v", err)
		lib.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	err = s.cacheData(r.Context(), cacheKey, calendar, 15*time.Minute)
	if err != nil {
		log.Println("failed to cache data")
	}

	lib.RespondJSON(w, http.StatusOK, calendar)
}

func (s *Server) getClockHandler(w http.ResponseWriter, r *http.Request) {
	clock, err := s.apca.GetClock()
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to fetch clock", http.StatusInternalServerError)
		return
	}
	lib.RespondJSON(w, http.StatusAccepted, clock)
}
