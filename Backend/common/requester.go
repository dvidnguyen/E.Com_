package common

import "github.com/google/uuid"

type Requester interface {
	UserId() uuid.UUID
	TokenId() uuid.UUID
	UserName() string
	Phone() string
	Role() string
}

type requesterData struct {
	userId   uuid.UUID
	tid      uuid.UUID
	userName string
	phone    string
	role     string
}

func (r *requesterData) UserId() uuid.UUID {
	return r.userId
}
func (r *requesterData) TokenId() uuid.UUID {
	return r.tid
}
func (r *requesterData) UserName() string { return r.userName }
func (r *requesterData) Phone() string    { return r.phone }
func (r *requesterData) Role() string     { return r.role }

func NewRequester(sub, tid uuid.UUID, userName, phone, role string) Requester {
	return &requesterData{
		userId:   sub,
		tid:      tid,
		userName: userName,
		phone:    phone,
		role:     role,
	}
}
