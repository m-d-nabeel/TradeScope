package server

import (
	"log"
	"net/http"
	"strconv"

	"github.com/alpacahq/alpaca-trade-api-go/v3/alpaca"
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/trading-backend/internal/database/sqlc"
	"github.com/trading-backend/internal/lib"
)

func (s *Server) getAccountHandler(w http.ResponseWriter, r *http.Request) {
	account, err := s.apca.GetAccount()
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to fetch account", http.StatusInternalServerError)
		return
	}

	lib.RespondJSON(w, http.StatusAccepted, account)
}

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
	log.Println(assets)
	lib.RespondJSON(w, http.StatusAccepted, assets)
}

func (s *Server) updateAssetsHandler(w http.ResponseWriter, r *http.Request) {
	assets, err := s.apca.GetAssets(alpaca.GetAssetsRequest{})
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to fetch assets", http.StatusInternalServerError)
		return
	}
	dbQuery := sqlc.New(s.db.GetPool())
	for _, asset := range assets {

		uuidID, err := lib.UUIDFromString(asset.ID)

		if err != nil {
			log.Println(err)
			http.Error(w, "failed to parse asset ID", http.StatusInternalServerError)
			return
		}

		err = dbQuery.CreateAsset(r.Context(), sqlc.CreateAssetParams{
			ID:           uuidID,
			Class:        string(asset.Class),
			Exchange:     asset.Exchange,
			Symbol:       asset.Symbol,
			Name:         asset.Name,
			Tradable:     asset.Tradable,
			Marginable:   asset.Marginable,
			Shortable:    asset.Shortable,
			EasyToBorrow: asset.EasyToBorrow,
			Fractionable: asset.Fractionable,
			Status:       string(asset.Status),
			MaintenanceMarginRequirement: pgtype.Int4{
				Int32: int32(asset.MaintenanceMarginRequirement),
				Valid: true,
			},
			Attributes: asset.Attributes,
		})

		if err != nil {
			log.Println(err)
			log.Println("failed to create asset", asset)
			http.Error(w, "failed to create asset", http.StatusInternalServerError)
			return
		}
	}
	lib.RespondJSON(w, http.StatusAccepted, nil)
}

func (s *Server) assetsPaginationHandler(w http.ResponseWriter, r *http.Request) {
	pageStr := chi.URLParam(r, "page")
	pageNo, err := strconv.Atoi(pageStr)
	if err != nil {
		log.Println(err)
		pageNo = 1
	}
	dbQuery := sqlc.New(s.db.GetPool())
	assets, err := dbQuery.GetAssetsWithKeysetPagination(r.Context(), sqlc.GetAssetsWithKeysetPaginationParams{
		SeqID: pgtype.Int8{
			Int64: int64((pageNo - 1) * 20),
			Valid: true,
		},
		SeqID_2: pgtype.Int8{
			Int64: int64(pageNo * 20),
			Valid: true,
		},
	})

	if err != nil {
		log.Println(err)
		http.Error(w, "failed to fetch assets", http.StatusInternalServerError)
		return
	}
	lib.RespondJSON(w, http.StatusAccepted, assets)
}
