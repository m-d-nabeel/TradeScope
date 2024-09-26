package server

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/alpacahq/alpaca-trade-api-go/v3/alpaca"
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/trading-backend/internal/database/sqlc"
	"github.com/trading-backend/internal/lib"
	"github.com/trading-backend/internal/service/auth"
)

func (s *Server) getAccountHandler(w http.ResponseWriter, r *http.Request) {
	userFromCtx, ok := r.Context().Value(userKey).(*auth.UserClaims)
	if !ok || userFromCtx == nil {
		http.Error(w, "failed to fetch user", http.StatusInternalServerError)
		return
	}

	cacheKey := "account:userid:" + userFromCtx.UserID
	cachedData, err := s.rdb.Get(r.Context(), cacheKey)
	if err == nil {
		log.Println("cache hit")
		var act alpaca.Account
		err = json.Unmarshal([]byte(cachedData), &act)

		if err != nil {
			log.Println(err)
		} else {
			lib.RespondJSON(w, http.StatusOK, act)
			return
		}
	}

	account, err := s.apca.GetAccount()
	if err != nil {
		log.Println(err)
		http.Error(w, "failed to fetch account", http.StatusInternalServerError)
		return
	}
	accountJSON, err := json.Marshal(account)
	if err == nil {
		err = s.rdb.Set(r.Context(), cacheKey, accountJSON, 5*time.Minute)
		if err != nil {
			log.Println("Error caching account:", err)
		}
	} else {
		log.Println("Error unmarshaling account from cache:", err)
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
	lib.RespondJSON(w, http.StatusAccepted, assets)
}

func (s *Server) updateAssetsHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Updating assets")
	alpacaAssets, err := s.apca.GetAssets(alpaca.GetAssetsRequest{})
	if err != nil {
		log.Printf("Error fetching assets from Alpaca: %v", err)
		return
	}

	assets := make([]sqlc.CreateAssetsBatchParams, len(alpacaAssets))
	for idx, asset := range alpacaAssets {
		uuidID, err := lib.UUIDFromString(asset.ID)
		if err != nil {
			log.Printf("Error converting asset ID to UUID: %v", err)
			return
		}
		assets[idx] = sqlc.CreateAssetsBatchParams{
			ID:           uuidID,
			SeqID:        int32(idx + 1),
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
		}
	}

	tx, err := s.db.GetPool().Begin(r.Context())
	if err != nil {
		log.Printf("Error starting transaction: %v", err)
		return
	}
	defer func() {
		if err != nil {
			if rbErr := tx.Rollback(r.Context()); rbErr != nil {
				log.Printf("Error rolling back transaction: %v", rbErr)
			}
		}
	}()

	txQuery := sqlc.New(tx)

	// Truncate the assets table
	if err = txQuery.TruncateAssets(r.Context()); err != nil {
		log.Printf("Error truncating assets: %v", err)
		return
	}

	// Insert new data into assets table
	if _, err = txQuery.CreateAssetsBatch(r.Context(), assets); err != nil {
		log.Printf("Error inserting assets: %v", err)
		return
	}

	if err = tx.Commit(r.Context()); err != nil {
		log.Printf("Error committing transaction: %v", err)
		return
	}

	log.Printf("Successfully updated %d assets", len(assets))
	lib.RespondJSON(w, http.StatusAccepted, struct {
		Message string `json:"message"`
	}{
		Message: "Assets updated",
	})
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
