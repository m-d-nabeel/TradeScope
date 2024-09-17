package lib

import (
	"reflect"
	"testing"

	"github.com/jackc/pgx/v5/pgtype"
)

func TestUUIDToString(t *testing.T) {
	type args struct {
		uuid pgtype.UUID
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		// Valid UUIDs
		{name: "Test 1", args: args{uuid: pgtype.UUID{Bytes: [16]byte{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01}, Valid: true}}, want: "00000000-0000-0000-0000-000000000001"},
		{name: "Test 2", args: args{uuid: pgtype.UUID{Bytes: [16]byte{0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0, 0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0}, Valid: true}}, want: "12345678-9abc-def0-1234-56789abcdef0"},
		{name: "Test 3", args: args{uuid: pgtype.UUID{Bytes: [16]byte{0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff}, Valid: true}}, want: "ffffffff-ffff-ffff-ffff-ffffffffffff"},

		// Edge Cases
		{name: "Empty UUID", args: args{uuid: pgtype.UUID{Bytes: [16]byte{}, Valid: true}}, want: "00000000-0000-0000-0000-000000000000"},
		{name: "Invalid UUID", args: args{uuid: pgtype.UUID{Valid: false}}, want: ""}, // Assuming an invalid UUID should return an empty string

		// Additional edge cases
		{name: "Single Byte UUID", args: args{uuid: pgtype.UUID{Bytes: [16]byte{0x01}, Valid: true}}, want: "01000000-0000-0000-0000-000000000000"}, // Expected output with trailing zeros
		{name: "Max Byte UUID", args: args{uuid: pgtype.UUID{Bytes: [16]byte{0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff}, Valid: true}}, want: "ffffffff-ffff-ffff-ffff-ffffffffffff"},

		// Various formats
		{name: "UUID with Leading Zeros", args: args{uuid: pgtype.UUID{Bytes: [16]byte{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01}, Valid: true}}, want: "00000000-0000-0000-0000-000000000001"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := UUIDToString(tt.args.uuid); got != tt.want {
				t.Errorf("UUIDToString() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestUUIDFromString(t *testing.T) {
	type args struct {
		userUUID string
	}
	tests := []struct {
		name    string
		args    args
		want    pgtype.UUID
		wantErr bool
	}{
		// Valid UUIDs
		{name: "Valid UUID without hyphens", args: args{userUUID: "00000000000000000000000000000001"}, want: pgtype.UUID{Bytes: [16]byte{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01}, Valid: true}, wantErr: false},
		{name: "Valid UUID with hyphens", args: args{userUUID: "00000000-0000-0000-0000-000000000001"}, want: pgtype.UUID{Bytes: [16]byte{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01}, Valid: true}, wantErr: false},
		{name: "Valid UUID with uppercase letters", args: args{userUUID: "123E4567-E89B-12D3-A456-426614174000"}, want: pgtype.UUID{Bytes: [16]byte{0x12, 0x3E, 0x45, 0x67, 0xE8, 0x9B, 0x12, 0xD3, 0xA4, 0x56, 0x42, 0x66, 0x14, 0x17, 0x40, 0x00}, Valid: true}, wantErr: false},
		{name: "Valid UUID with lowercase letters", args: args{userUUID: "123e4567-e89b-12d3-a456-426614174000"}, want: pgtype.UUID{Bytes: [16]byte{0x12, 0x3E, 0x45, 0x67, 0xE8, 0x9B, 0x12, 0xD3, 0xA4, 0x56, 0x42, 0x66, 0x14, 0x17, 0x40, 0x00}, Valid: true}, wantErr: false},

		// Invalid UUIDs
		{name: "Invalid UUID with non-hex characters", args: args{userUUID: "G23E4567-E89B-12D3-A456-426614174000"}, want: pgtype.UUID{}, wantErr: true},
		{name: "Invalid UUID with wrong length", args: args{userUUID: "123e4567-e89b-12d3-a456-42661417"}, want: pgtype.UUID{}, wantErr: true},
		{name: "Invalid UUID with empty string", args: args{userUUID: ""}, want: pgtype.UUID{}, wantErr: true},
		// {name: "Invalid UUID with extra hyphens", args: args{userUUID: "123e4567--e89b-12d3--a456-426614174000"}, want: pgtype.UUID{}, wantErr: true},

		// Edge Cases
		{name: "UUID with all zeroes", args: args{userUUID: "00000000-0000-0000-0000-000000000000"}, want: pgtype.UUID{Bytes: [16]byte{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00}, Valid: true}, wantErr: false},
		{name: "UUID with lowercase hexadecimal", args: args{userUUID: "abcd1234-abcd-1234-abcd-1234567890ab"}, want: pgtype.UUID{Bytes: [16]byte{0xab, 0xcd, 0x12, 0x34, 0xab, 0xcd, 0x12, 0x34, 0xab, 0xcd, 0x12, 0x34, 0x56, 0x78, 0x90, 0xab}, Valid: true}, wantErr: false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := UUIDFromString(tt.args.userUUID)
			if (err != nil) != tt.wantErr {
				t.Errorf("UUIDFromString() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("UUIDFromString() = %v, want %v", got, tt.want)
			}
		})
	}
}
