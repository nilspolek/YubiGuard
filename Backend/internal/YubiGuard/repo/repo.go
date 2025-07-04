package repo

import "github.com/google/uuid"

type User struct {
	ID        uuid.UUID   `json:"id" bson:"_id"`
	Email     string      `json:"email" bson:"email"`
	FirstName string      `json:"first_name" bson:"first_name"`
	LastName  string      `json:"last_name" bson:"last_name"`
	Keys      []uuid.UUID `json:"keys" bson:"keys"`
}

type Repo interface {
	GetAllUsers() ([]*User, error)
	GetUserById(userId uuid.UUID) (*User, error)
	GetUserToKey(keyId uuid.UUID) (*User, error)
	CreateUser(*User) error
	AddKeyToUser(userId uuid.UUID, keyId uuid.UUID) error
}
