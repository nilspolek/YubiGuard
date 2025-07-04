package main

import (
	"YubiGuard/internal/YubiGuard/controller"
	"YubiGuard/internal/YubiGuard/repo"
	"YubiGuard/internal/YubiGuard/service"
	"os"
)

func main() {
	repo := repo.NewMongoRepo(os.Getenv("MONGO_URI"))
	service := service.NewService(repo)
	controller := controller.NewController(service, 8080)
	panic(controller.ListenAndServe())
}
