package domain

import (
	"errors"
	"fmt"
	"strings"

	"github.com/google/uuid"
)

type User struct {
	id       uuid.UUID
	userName string
	email    string
	password string
	salt     string
	phone    string
	role     Role
	status   string
	avatar   string
}

func NewUser(id uuid.UUID, userName string, email string, password string, salt string, phone string, role Role) (*User, error) {

	if strings.TrimSpace(email) == "" {
		return nil, errors.New("email is required")
	}
	// Check password rỗng
	if strings.TrimSpace(password) == "" {
		return nil, fmt.Errorf("password is required")
	}

	return &User{id: id, userName: userName, email: email, password: password, salt: salt, phone: phone, role: role}, nil
}
func (u User) Id() uuid.UUID {
	return u.id
}

func (u *User) UserName() string {
	return u.userName
}

func (u *User) SetUserName(userName string) {
	u.userName = userName
}

func (u *User) Email() string {
	return u.email
}

func (u *User) SetEmail(email string) {
	u.email = email
}

func (u *User) Password() string {
	return u.password
}

func (u *User) SetPassword(password string) {
	u.password = password
}

func (u *User) Salt() string {
	return u.salt
}

func (u *User) SetSalt(salt string) {
	u.salt = salt
}

func (u *User) Phone() string {
	return u.phone
}

func (u *User) SetPhone(phone string) {
	u.phone = phone
}

func (u *User) Role() Role {
	return u.role
}

func (u *User) SetRole(role Role) {
	u.role = role
}

func (u *User) Status() string {
	return u.status
}

func (u *User) SetStatus(status string) {
	u.status = status
}

func (u *User) Avatar() string {
	return u.avatar
}

func (u *User) SetAvatar(avatar string) {
	u.avatar = avatar
}

type Role int

const (
	RoleUser Role = iota
	RoleAdmin
)

func (r Role) String() string {
	return [2]string{"user", "admin"}[r]
}
func GetRole(s string) Role {
	switch strings.TrimSpace(strings.ToLower(s)) {
	case "admin":
		return RoleAdmin
	default:
		return RoleUser
	}
}
