package repo

import (
	"context"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoRepo struct {
	userCollection *mongo.Collection
}

func NewMongoRepo(mongoUri string) Repo {
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(mongoUri))
	if err != nil {
		panic(err)
	}
	return &MongoRepo{
		userCollection: client.Database("yubiguard").Collection("users"),
	}
}

func (r *MongoRepo) GetUserById(userId uuid.UUID) (*User, error) {
	var user User
	err := r.userCollection.FindOne(context.Background(), bson.M{"_id": userId}).Decode(&user)
	return &user, err
}

func (r *MongoRepo) GetUserToKey(keyId uuid.UUID) (*User, error) {
	var user User
	err := r.userCollection.FindOne(context.Background(), bson.M{"keys": keyId}).Decode(&user)
	return &user, err
}

func (r *MongoRepo) CreateUser(user *User) error {
	if user.Keys == nil {
		user.Keys = []uuid.UUID{}
	}
	_, err := r.userCollection.InsertOne(context.Background(), user)
	return err
}

func (r *MongoRepo) AddKeyToUser(userId uuid.UUID, keyId uuid.UUID) error {
	_, err := r.userCollection.UpdateOne(context.Background(), bson.M{"_id": userId}, bson.M{"$push": bson.M{"keys": keyId}})
	return err
}

func (r *MongoRepo) GetAllUsers() ([]*User, error) {
	cursor, err := r.userCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var users []*User
	for cursor.Next(context.Background()) {
		var user User
		if err := cursor.Decode(&user); err != nil {
			return nil, err
		}
		users = append(users, &user)
	}
	return users, cursor.Err()
}
