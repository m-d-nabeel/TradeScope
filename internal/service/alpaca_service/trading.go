package alpacaservice

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type CalendarDay struct {
	Date           string `json:"date"`
	Open           string `json:"open"`
	Close          string `json:"close"`
	SessionOpen    string `json:"session_open"`
	SessionClose   string `json:"session_close"`
	SettlementDate string `json:"settlement_date"`
}

func GetCalendar() ([]CalendarDay, error) {
	alpacaRequest, err := newAlpacaTradingRequest("GET", CalendarEndpoint)

	if err != nil {
		log.Printf("Error creating request to Alpaca API: %v", err)
		return []CalendarDay{}, err
	}

	query := alpacaRequest.URL.Query()
	query.Add("start", time.Now().AddDate(-2, 0, 0).Format("2006-01-02"))
	query.Add("end", time.Now().AddDate(2, 0, 0).Format("2006-01-02"))

	alpacaRequest.URL.RawQuery = query.Encode()

	log.Printf("Request URL: %v", alpacaRequest.URL.String())

	resp, err := http.DefaultClient.Do(alpacaRequest)
	if err != nil {
		log.Printf("Error sending request to Alpaca API: %v", err)
		return []CalendarDay{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("Error response from Alpaca API: %v", resp.Status)
		return []CalendarDay{}, err
	}

	var calendar []CalendarDay
	err = json.NewDecoder(resp.Body).Decode(&calendar)
	if err != nil {
		log.Printf("Error decoding response: %v", err)
		return []CalendarDay{}, err
	}

	return calendar, nil
}
