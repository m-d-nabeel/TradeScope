package validator

import (
	"errors"
	"strconv"
	"time"
)

func ValidateMarketQuery(symbol, timeframe, start, end string) error {
	if symbol == "" {
		return errors.New("symbol is required")
	}
	if start == "" {
		return errors.New("start date is required")
	}
	if err := validateRFC3339Date(start); err != nil {
		return errors.New("start date must be a valid RFC-3339 date: " + err.Error())
	}
	if end != "" {
		if err := validateRFC3339Date(end); err != nil {
			return errors.New("end date must be a valid RFC-3339 date: " + err.Error())
		}
	}
	_, err := time.Parse(time.RFC3339, start)

	if err != nil {
		return errors.New("start date must be a valid RFC-3339 date")
	}

	if err := validateTimeframe(timeframe); err != nil {
		return errors.New("timeframe is invalid")
	}

	return nil
}

// validateRFC3339Date checks if a date string is a valid RFC-3339 format.
func validateRFC3339Date(date string) error {
	_, err := time.Parse(time.RFC3339, date)
	if err != nil {
		// Try parsing it as a simple date (YYYY-MM-DD)
		_, simpleErr := time.Parse("2006-01-02", date)
		if simpleErr != nil {
			return err // Return original error if both fail
		}
	}
	return nil
}

// validateTimeframe checks if the provided timeframe is valid according to the rules.
func validateTimeframe(timeframe string) error {
	var numStr string
	var unit string

	// Separate numeric part from the unit part
	for i, c := range timeframe {
		if c >= '0' && c <= '9' {
			numStr += string(c)
		} else {
			unit = timeframe[i:]
			break
		}
	}

	// Convert the numeric part to an integer
	num, err := strconv.Atoi(numStr)
	if err != nil {
		return errors.New("invalid numeric part in timeframe: " + timeframe)
	}

	// Validate based on the unit
	switch unit {
	case "Min", "T":
		if num < 1 || num > 59 {
			return errors.New("invalid timeframe: " + timeframe)
		}
	case "Hour", "H":
		if num < 1 || num > 23 {
			return errors.New("invalid timeframe: " + timeframe)
		}
	case "Day", "D":
		if num != 1 {
			return errors.New("invalid timeframe: only '1Day' or '1D' is valid")
		}
	case "Week", "W":
		if num != 1 {
			return errors.New("invalid timeframe: only '1Week' or '1W' is valid")
		}
	case "Month", "M":
		validMonths := map[int]bool{1: true, 2: true, 3: true, 4: true, 6: true, 12: true}
		if !validMonths[num] {
			return errors.New("invalid timeframe: only '1, 2, 3, 4, 6, 12Month' or 'M' is valid")
		}
	default:
		return errors.New("invalid timeframe unit: " + timeframe)
	}

	return nil
}
