package lib

import (
	"log"
	"time"

	"github.com/alpacahq/alpaca-trade-api-go/v3/alpaca"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/trading-backend/internal/database/sqlc"
)

type User struct {
	ID               uuid.UUID `json:"id"`
	Name             string    `json:"name"`
	Email            string    `json:"email"`
	PasswordHash     string    `json:"password_hash"`
	AvatarUrl        string    `json:"avatar_url"`
	Provider         string    `json:"provider"`
	IsActive         bool      `json:"is_active"`
	Role             string    `json:"role"`
	RefreshTokenHash string    `json:"refresh_token_hash"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

func DbUserToUser(dbUser sqlc.User) User {
	return User{
		ID:               uuid.UUID(dbUser.ID.Bytes),
		Name:             dbUser.Name,
		Email:            dbUser.Email,
		PasswordHash:     dbUser.PasswordHash.String,
		AvatarUrl:        dbUser.AvatarUrl.String,
		Provider:         dbUser.Provider.String,
		IsActive:         dbUser.IsActive.Bool,
		Role:             string(dbUser.Role.RoleEnum),
		RefreshTokenHash: dbUser.RefreshTokenHash.String,
		CreatedAt:        dbUser.CreatedAt.Time,
		UpdatedAt:        dbUser.UpdatedAt.Time,
	}
}

type Asset struct {
	ID                           uuid.UUID `json:"id"`
	SeqID                        int32     `json:"seq_id"`
	Class                        string    `json:"class"`
	Exchange                     string    `json:"exchange"`
	Symbol                       string    `json:"symbol"`
	Name                         string    `json:"name"`
	Status                       string    `json:"status"`
	Tradable                     bool      `json:"tradable"`
	Marginable                   bool      `json:"marginable"`
	Shortable                    bool      `json:"shortable"`
	EasyToBorrow                 bool      `json:"easy_to_borrow"`
	Fractionable                 bool      `json:"fractionable"`
	MaintenanceMarginRequirement int32     `json:"maintenance_margin_requirement"`
	MarginRequirementLong        string    `json:"margin_requirement_long"`
	MarginRequirementShort       string    `json:"margin_requirement_short"`
	Attributes                   []string  `json:"attributes"`
}

func DbAssetToAsset(dbAsset sqlc.Asset) Asset {
	return Asset{
		ID:                           uuid.UUID(dbAsset.ID.Bytes),
		SeqID:                        dbAsset.SeqID,
		Class:                        dbAsset.Class,
		Exchange:                     dbAsset.Exchange,
		Symbol:                       dbAsset.Symbol,
		Name:                         dbAsset.Name,
		Status:                       dbAsset.Status,
		Tradable:                     dbAsset.Tradable,
		Marginable:                   dbAsset.Marginable,
		Shortable:                    dbAsset.Shortable,
		EasyToBorrow:                 dbAsset.EasyToBorrow,
		Fractionable:                 dbAsset.Fractionable,
		MaintenanceMarginRequirement: dbAsset.MaintenanceMarginRequirement.Int32,
		MarginRequirementLong:        dbAsset.MarginRequirementLong.String,
		MarginRequirementShort:       dbAsset.MarginRequirementShort.String,
		Attributes:                   dbAsset.Attributes,
	}
}

func DbAssetsToAssets(dbAssets []sqlc.Asset) []Asset {
	assets := make([]Asset, len(dbAssets))
	for i, dbAsset := range dbAssets {
		assets[i] = DbAssetToAsset(dbAsset)
	}
	return assets
}

func SortAssetsByTradable(assets []Asset) []Asset {
	var tradable []Asset
	var notTradable []Asset
	tradableCount := 0
	for _, asset := range assets {
		if asset.Tradable {
			tradable = append(tradable, asset)
			tradableCount++
		} else {
			notTradable = append(notTradable, asset)
		}
	}
	log.Printf("Tradable assets: %d", tradableCount)
	return append(tradable, notTradable...)
}

type Symbol struct {
	ID     uuid.UUID `json:"id"`
	Symbol string    `json:"symbol"`
	Name   string    `json:"name"`
}

func DbSymbolToSymbol(dbSymbol sqlc.Symbol) Symbol {
	return Symbol{
		ID:     uuid.UUID(dbSymbol.ID.Bytes),
		Symbol: dbSymbol.Symbol,
		Name:   dbSymbol.Name,
	}
}

func DbSymbolsToSymbols(dbSymbols []sqlc.Symbol) []Symbol {
	symbols := make([]Symbol, len(dbSymbols))
	for i, dbSymbol := range dbSymbols {
		symbols[i] = DbSymbolToSymbol(dbSymbol)
	}
	return symbols
}

func PrepareBatchData(alpacaAssets []alpaca.Asset) ([]sqlc.CreateAssetsBatchParams, []sqlc.CreateSymbolsBatchParams) {
	assets := make([]sqlc.CreateAssetsBatchParams, len(alpacaAssets))
	symbols := make([]sqlc.CreateSymbolsBatchParams, len(alpacaAssets))
	for idx, asset := range alpacaAssets {
		uuidID, err := UUIDFromString(asset.ID)
		if err != nil {
			log.Printf("Error converting asset ID to UUID: %v", err)
			return nil, nil
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

		symbols[idx] = sqlc.CreateSymbolsBatchParams{
			Symbol: asset.Symbol,
			Name:   asset.Name,
		}
	}

	return assets, symbols
}
