// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package sqlc

import (
	"database/sql/driver"
	"fmt"

	"github.com/jackc/pgx/v5/pgtype"
)

type RoleEnum string

const (
	RoleEnumAdmin     RoleEnum = "admin"
	RoleEnumModerator RoleEnum = "moderator"
	RoleEnumUser      RoleEnum = "user"
)

func (e *RoleEnum) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = RoleEnum(s)
	case string:
		*e = RoleEnum(s)
	default:
		return fmt.Errorf("unsupported scan type for RoleEnum: %T", src)
	}
	return nil
}

type NullRoleEnum struct {
	RoleEnum RoleEnum
	Valid    bool // Valid is true if RoleEnum is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullRoleEnum) Scan(value interface{}) error {
	if value == nil {
		ns.RoleEnum, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.RoleEnum.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullRoleEnum) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.RoleEnum), nil
}

type Order struct {
	ID        pgtype.UUID
	UserID    pgtype.UUID
	Symbol    string
	OrderType string
	Quantity  pgtype.Numeric
	Price     pgtype.Numeric
	Status    string
	CreatedAt pgtype.Timestamptz
	UpdatedAt pgtype.Timestamptz
}

type User struct {
	ID               pgtype.UUID
	Name             string
	Email            string
	PasswordHash     pgtype.Text
	AvatarUrl        pgtype.Text
	Provider         pgtype.Text
	IsActive         pgtype.Bool
	Role             NullRoleEnum
	RefreshTokenHash pgtype.Text
	CreatedAt        pgtype.Timestamptz
	UpdatedAt        pgtype.Timestamptz
}
