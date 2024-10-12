package server

import (
	"log"
	"net/http"
	"time"

	"github.com/alpacahq/alpaca-trade-api-go/v3/alpaca"
	"github.com/trading-backend/internal/lib"
	"github.com/trading-backend/internal/service/auth"
)

func (s *Server) getDashboardHandler(w http.ResponseWriter, r *http.Request) {

	userFromCtx, ok := r.Context().Value(userKey).(*auth.UserClaims)
	if !ok || userFromCtx == nil {
		http.Error(w, "failed to fetch user", http.StatusInternalServerError)
		return
	}

	cacheKey := "user-alpaca-dashboard:" + userFromCtx.UserID
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
	}

	lib.RespondJSON(w, http.StatusOK, dashboardData)
}

func (s *Server) getAccountHandler(w http.ResponseWriter, r *http.Request) {

	userFromCtx, ok := r.Context().Value(userKey).(*auth.UserClaims)
	if !ok || userFromCtx == nil {
		http.Error(w, "failed to fetch user", http.StatusInternalServerError)
		return
	}

	cacheKey := "user-alpaca-account:" + userFromCtx.UserID

	var account *alpaca.Account
	var accountActivities []alpaca.AccountActivity
	var accountConfigs *alpaca.AccountConfigurations

	var accountData = map[string]interface{}{
		"account":           account,
		"accountActivities": accountActivities,
		"accountConfigs":    accountConfigs,
	}

	err := s.getCachedData(r.Context(), cacheKey, &accountData)
	if err == nil {
		log.Println("cache hit")
		lib.RespondJSON(w, http.StatusOK, accountData)
		return
	}

	account, err = s.apca.GetAccount()
	if err != nil {
		log.Println("failed to get account", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	accountActivities, err = s.apca.GetAccountActivities(alpaca.GetAccountActivitiesRequest{})
	if err != nil {
		log.Println("failed to get account activities", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	accountConfigs, err = s.apca.GetAccountConfigurations()
	if err != nil {
		log.Println("failed to get account configurations", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	accountData["account"] = account
	accountData["accountActivities"] = accountActivities
	accountData["accountConfigs"] = accountConfigs

	err = s.cacheData(r.Context(), cacheKey, accountData, 15*time.Minute)
	if err != nil {
		log.Println("failed to cache data")
	}

	lib.RespondJSON(w, http.StatusOK, accountData)

}

func (s *Server) getPortfolioHandler(w http.ResponseWriter, r *http.Request) {
	userFromCtx, ok := r.Context().Value(userKey).(*auth.UserClaims)
	if !ok || userFromCtx == nil {
		http.Error(w, "failed to fetch user", http.StatusInternalServerError)
		return
	}

	cacheKey := "user-alpaca-portfolio:" + userFromCtx.UserID
	var openPositions []alpaca.Position
	var portfolioHistory *alpaca.PortfolioHistory

	var portfolioData = map[string]interface{}{
		"openPositions":    openPositions,
		"portfolioHistory": portfolioHistory,
	}

	err := s.getCachedData(r.Context(), cacheKey, &portfolioData)
	if err == nil {
		log.Println("cache hit")
		lib.RespondJSON(w, http.StatusOK, portfolioData)
		return
	}

	openPositions, err = s.apca.GetPositions()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	portfolioHistory, err = s.apca.GetPortfolioHistory(alpaca.GetPortfolioHistoryRequest{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	portfolioData["openPositions"] = openPositions
	portfolioData["portfolioHistory"] = portfolioHistory

	err = s.cacheData(r.Context(), cacheKey, portfolioData, 15*time.Minute)
	if err != nil {
		log.Println("failed to cache data")
	}

	lib.RespondJSON(w, http.StatusOK, portfolioData)
}
