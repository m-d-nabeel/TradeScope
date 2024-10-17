package server

import (
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/trading-backend/internal/database/sqlc"
	"github.com/trading-backend/internal/lib"
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
	asset, err := s.apca.GetAsset("AAPL")
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to fetch asset", http.StatusInternalServerError)
		return
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
	lib.RespondJSON(w, http.StatusAccepted, lib.DbAssetsToAssets(assets))
}

func (s *Server) assetsPaginationHandler(w http.ResponseWriter, r *http.Request) {
	pageStr := chi.URLParam(r, "page")
	pageNo, err := strconv.Atoi(pageStr)
	if err != nil || pageNo < 1 {
		log.Println(err)
		pageNo = 1
	}

	dbQuery := sqlc.New(s.db.GetPool())
	assets, err := dbQuery.GetAssetsWithKeysetPagination(r.Context(), sqlc.GetAssetsWithKeysetPaginationParams{
		SeqID: int32((pageNo - 1) * 20),
		Limit: 200,
	})

	if err != nil {
		log.Println(err)
		http.Error(w, "failed to fetch assets", http.StatusInternalServerError)
		return
	}
	lib.RespondJSON(w, http.StatusAccepted, lib.DbAssetsToAssets(assets))
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
