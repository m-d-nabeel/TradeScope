package lib

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

func UUIDToString(uuid pgtype.UUID) string {
	if !uuid.Valid {
		return ""
	}
	return fmt.Sprintf("%x-%x-%x-%x-%x",
		uuid.Bytes[0:4],
		uuid.Bytes[4:6],
		uuid.Bytes[6:8],
		uuid.Bytes[8:10],
		uuid.Bytes[10:16])
}

func UUIDFromString(userUUID string) (pgtype.UUID, error) {
	uuidBytes, err := hex.DecodeString(strings.ReplaceAll(userUUID, "-", ""))

	if err != nil {
		return pgtype.UUID{}, err
	}

	userUUIDBytes, err := uuid.FromBytes(uuidBytes)

	if err != nil {
		return pgtype.UUID{}, err
	}

	return pgtype.UUID{
		Bytes: userUUIDBytes,
		Valid: true,
	}, nil
}

func RespondJSON(w http.ResponseWriter, status int, payload interface{}) {
	data, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Error marshalling JSON: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(data)
}

func RespondError(w http.ResponseWriter, statusCode int, message string) {
	if statusCode > 499 {
		log.Printf("Responding with 5XX error: %s", message)
	}
	type errorResponse struct {
		Error string `json:"error"`
	}
	RespondJSON(w, statusCode, errorResponse{
		Error: message,
	})
}
