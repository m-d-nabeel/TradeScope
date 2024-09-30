package alpacamarket

import (
	"encoding/json"
	"log"
	"net/http"
)

func GetHistoricalBars() (BarsResponse, error) {
	alpacaRequest, err := newAlpacaRequest("GET", StocksBarsEndpoint)

	if err != nil {
		log.Printf("Error creating request to Alpaca API: %v", err)
		return BarsResponse{}, err
	}

	// Add query parameters
	query := alpacaRequest.URL.Query()
	for key, value := range MarketBarQuery {
		if value == "" {
			continue
		}
		query.Add(key, value)
	}

	alpacaRequest.URL.RawQuery = query.Encode()

	log.Printf("Request URL: %v", alpacaRequest.URL.String())

	// Send request
	resp, err := http.DefaultClient.Do(alpacaRequest)
	if err != nil {
		log.Printf("Error sending request to Alpaca API: %v", err)
		return BarsResponse{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("Error response from Alpaca API: %v", resp.Status)
		return BarsResponse{}, err
	}

	// Parse response
	var barsResponse BarsResponse
	err = json.NewDecoder(resp.Body).Decode(&barsResponse)
	if err != nil {
		log.Printf("Error decoding response: %v", err)
		return BarsResponse{}, err
	}

	return barsResponse, nil
}

func GetHistoricalAuctions() (AuctionsResponse, error) {
	alpacaRequest, err := newAlpacaRequest("GET", StocksAuctionEndpoint)

	if err != nil {
		log.Printf("Error creating request to Alpaca API: %v", err)
		return AuctionsResponse{}, err
	}

	// Add query parameters
	query := alpacaRequest.URL.Query()
	for key, value := range MarketAuctionQuery {
		if value == "" {
			continue
		}
		query.Add(key, value)
	}

	alpacaRequest.URL.RawQuery = query.Encode()

	log.Printf("Request URL: %v", alpacaRequest.URL.String())

	// Send request
	resp, err := http.DefaultClient.Do(alpacaRequest)
	if err != nil {
		log.Printf("Error sending request to Alpaca API: %v", err)
		return AuctionsResponse{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("Error response from Alpaca API: %v", resp.Status)
		return AuctionsResponse{}, err
	}

	// Parse response
	var auctionsResponse AuctionsResponse
	err = json.NewDecoder(resp.Body).Decode(&auctionsResponse)
	if err != nil {
		log.Printf("Error decoding response: %v", err)
		return AuctionsResponse{}, err
	}

	return auctionsResponse, nil
}
