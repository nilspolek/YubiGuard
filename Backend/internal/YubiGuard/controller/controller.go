package controller

import (
	"YubiGuard/internal/YubiGuard/repo"
	"YubiGuard/internal/YubiGuard/service"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

const DEFAULT_PORT = 8080

type Controller struct {
	service *service.Service
	port    int
	mux     *mux.Router
}

func NewController(service *service.Service, port int) *Controller {
	if port == 0 {
		port = DEFAULT_PORT
	}

	controller := &Controller{
		service: service,
		port:    port,
		mux:     mux.NewRouter(),
	}
	controller.registerRoutes()
	return controller
}

func (c *Controller) ListenAndServe() error {
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}), // or specify your frontend origin
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)(c.mux)
	return http.ListenAndServe(fmt.Sprintf(":%d", c.port), corsHandler)
}

func (c *Controller) registerRoutes() {

	c.mux.HandleFunc("/users", c.HandleGetAllUsers).Methods(http.MethodGet)
	c.mux.HandleFunc("/users/{userId}", c.HandleGetUser).Methods(http.MethodGet)
	c.mux.HandleFunc("/users", c.HandleCreateUser).Methods(http.MethodPost)
	c.mux.HandleFunc("/users/{userId}/add/{keyId}", c.HandleAddKey).Methods(http.MethodPost)
	c.mux.HandleFunc("/{keyId}", c.HandleGetUserByKeyId).Methods(http.MethodGet)
}

func (c *Controller) HandleGetUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["userId"]

	userId_UUID, err := uuid.Parse(userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	user, err := c.service.GetUserById(userId_UUID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func (c *Controller) HandleGetAllUsers(w http.ResponseWriter, r *http.Request) {
	users, err := c.service.GetAllUsers()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(users)
}

func (c *Controller) HandleAddKey(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	keyId := vars["keyId"]
	userId := vars["userId"]

	keyUUID, err := uuid.Parse(keyId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userUUID, err := uuid.Parse(userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := c.service.AddKeyToUser(userUUID, keyUUID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(userUUID)
}

func (c *Controller) HandleCreateUser(w http.ResponseWriter, r *http.Request) {
	var user repo.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := c.service.CreateUser(&user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func (c *Controller) HandleGetUserByKeyId(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	keyId := vars["keyId"]

	keyUUID, err := uuid.Parse(keyId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := c.service.GetUserByKeyId(keyUUID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}
