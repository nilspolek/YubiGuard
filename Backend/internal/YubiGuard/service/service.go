package service

import (
	"YubiGuard/internal/YubiGuard/repo"

	"github.com/google/uuid"
)

type Service struct {
	repo repo.Repo
}

func NewService(repo repo.Repo) *Service {
	return &Service{
		repo: repo,
	}
}

func (s *Service) GetUserById(userId uuid.UUID) (*repo.User, error) {
	return s.repo.GetUserById(userId)
}

func (s *Service) GetAllUsers() ([]*repo.User, error) {
	return s.repo.GetAllUsers()
}

func (s *Service) GetUserByKeyId(keyId uuid.UUID) (*repo.User, error) {
	return s.repo.GetUserToKey(keyId)
}

func (s *Service) CreateUser(user *repo.User) error {
	user.ID = uuid.New()
	return s.repo.CreateUser(user)
}

func (s *Service) AddKeyToUser(userId uuid.UUID, keyId uuid.UUID) error {
	return s.repo.AddKeyToUser(userId, keyId)
}
