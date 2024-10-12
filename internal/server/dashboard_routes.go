package server

import (
	"log"
	"net/http"
	"time"

	"github.com/alpacahq/alpaca-trade-api-go/v3/alpaca"
	"github.com/trading-backend/internal/lib"
	"github.com/trading-backend/internal/service/auth"
)

func (s *Server) dashboardHandler(w http.ResponseWriter, r *http.Request) {

	userFromCtx, ok := r.Context().Value(userKey).(*auth.UserClaims)
	if !ok || userFromCtx == nil {
		http.Error(w, "failed to fetch user", http.StatusInternalServerError)
		return
	}

	cacheKey := "user-dashboard:" + userFromCtx.UserID
	var account *alpaca.Account
	var accountHistory []alpaca.AccountActivity
	var portfolioHistory *alpaca.PortfolioHistory

	var dashboardData = map[string]interface{}{
		"account":          account,
		"accountHistory":   accountHistory,
		"portfolioHistory": portfolioHistory,
	}

	err := s.getCachedData(r.Context(), cacheKey, &dashboardData)
	if err == nil {
		log.Println("cache hit")
		lib.RespondJSON(w, http.StatusOK, dashboardData)
		return
	}

	account, err = s.apca.GetAccount()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	accountHistory, err = s.apca.GetAccountActivities(alpaca.GetAccountActivitiesRequest{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	portfolioHistory, err = s.apca.GetPortfolioHistory(alpaca.GetPortfolioHistoryRequest{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	dashboardData["account"] = account
	dashboardData["accountHistory"] = accountHistory
	dashboardData["portfolioHistory"] = portfolioHistory

	err = s.cacheData(r.Context(), cacheKey, dashboardData, 15*time.Minute)
	if err != nil {
		log.Println("failed to cache data")
		return
	}

	lib.RespondJSON(w, http.StatusOK, dashboardData)
}
