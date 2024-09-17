package server

import (
	"log"
	"net/http"

	"github.com/alpacahq/alpaca-trade-api-go/v3/alpaca"
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

		var attributes []sqlc.AttributesEnum

		for _, attr := range asset.Attributes {
			attrEnum := sqlc.AttributesEnum(attr)
			if attrEnum == sqlc.AttributesEnum("") {
				log.Println("unknown attribute", attr)
				continue
			}
			attributes = append(attributes, attrEnum)
		}

		err = dbQuery.CreateAsset(r.Context(), sqlc.CreateAssetParams{
			ID:           uuidID,
			Class:        sqlc.AssetClassEnum(asset.Class),
			Exchange:     sqlc.ExchangeEnum(asset.Exchange),
			Symbol:       asset.Symbol,
			Name:         asset.Name,
			Status:       sqlc.AssetStatusEnum(asset.Status),
			Tradable:     asset.Tradable,
			Marginable:   asset.Marginable,
			Shortable:    asset.Shortable,
			EasyToBorrow: asset.EasyToBorrow,
			Fractionable: asset.Fractionable,
			Attributes:   attributes,
		})

		if err != nil {
			log.Println(err)
			http.Error(w, "failed to create asset", http.StatusInternalServerError)
			return
		}
	}
	lib.RespondJSON(w, http.StatusAccepted, nil)
}
