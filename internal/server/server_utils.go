package server

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/alpacahq/alpaca-trade-api-go/v3/alpaca"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/robfig/cron/v3"
	"github.com/trading-backend/internal/database/sqlc"
	"github.com/trading-backend/internal/lib"
	"github.com/trading-backend/internal/service/auth"
)

func (s *Server) UpdateAssetsJob() {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

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

	tx, err := s.db.GetPool().Begin(ctx)
	if err != nil {
		log.Printf("Error starting transaction: %v", err)
		return
	}
	defer func() {
		if err != nil {
			if rbErr := tx.Rollback(ctx); rbErr != nil {
				log.Printf("Error rolling back transaction: %v", rbErr)
			}
		}
	}()

	txQuery := sqlc.New(tx)

	// Truncate the assets table
	if err = txQuery.TruncateAssets(ctx); err != nil {
		log.Printf("Error truncating assets: %v", err)
		return
	}

	// Insert new data into assets table
	if _, err = txQuery.CreateAssetsBatch(ctx, assets); err != nil {
		log.Printf("Error inserting assets: %v", err)
		return
	}

	if err = tx.Commit(ctx); err != nil {
		log.Printf("Error committing transaction: %v", err)
		return
	}

	log.Printf("Successfully updated %d assets", len(assets))
}

func (s *Server) InitCronScheduler() *cron.Cron {
	c := cron.New()
	c.AddFunc("*/30 * * * *", s.UpdateAssetsJob)
	c.Start()
	log.Println("Cron job started")
	return c
}

// Cookie functions
func SetCookies(w http.ResponseWriter, accessToken, refreshToken string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
		Secure:   true,
		Path:     "/",
		Expires:  time.Now().Add(auth.AccessTokenExpiry),
	})
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
		Secure:   true,
		Path:     "/auth/refresh",
		Expires:  time.Now().Add(auth.RefreshTokenExpiry),
	})

	log.Println("Cookies set")
	log.Println("AccessToken: ", accessToken)
	log.Println("RefreshToken: ", refreshToken)
}

func RemoveCookies(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    "",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		Path:     "/",
		Expires:  time.Now().Add(-1 * time.Hour),
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		Path:     "/auth/refresh",
		Expires:  time.Now().Add(-1 * time.Hour),
	})

	log.Println("Cookies removed")
}

func (s *Server) getCachedData(ctx context.Context, key string, data interface{}) error {
	cachedData, err := s.rdb.Get(ctx, key)
	if err != nil {
		return err
	}

	err = json.Unmarshal([]byte(cachedData), &data)
	if err != nil {
		return err
	}

	return nil
}

func (s *Server) cacheData(ctx context.Context, key string, data interface{}, expiration time.Duration) error {
	dataJSON, err := json.Marshal(data)
	if err != nil {
		return err
	}

	err = s.rdb.Set(ctx, key, dataJSON, expiration)
	if err != nil {
		return err
	}

	return nil
}
