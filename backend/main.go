package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// ColorConfig holds the dashboard color settings
type ColorConfig struct {
	Primary       string `json:"primary"`
	Secondary     string `json:"secondary"`
	AccentGreen   string `json:"accent_green"`
	AccentRed     string `json:"accent_red"`
	AccentOrange  string `json:"accent_orange"`
	AccentYellow  string `json:"accent_yellow"`
	AccentPurple  string `json:"accent_purple"`
}

// ImageResponse for serving image
type ImageResponse struct {
	URL string `json:"url"`
}

// UploadResponse for upload endpoint
type UploadResponse struct {
	Message string `json:"message"`
	URL     string `json:"url"`
}

var (
	uploadDir   = "uploads"
	colorsFile  = "colors.json"
	currentImage = ""
)

func init() {
	// Create uploads directory if it doesn't exist
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		log.Printf("Error creating uploads directory: %v\n", err)
	}
}

// UploadImage handles image uploads
func UploadImage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse multipart form
	if err := r.ParseMultipartForm(50 * 1024 * 1024); err != nil { // 50MB max
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	file, handler, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Failed to retrieve image", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Generate unique filename
	ext := filepath.Ext(handler.Filename)
	filename := fmt.Sprintf("dashboard_%d%s", time.Now().Unix(), ext)
	filepath := filepath.Join(uploadDir, filename)

	// Create file
	dst, err := os.Create(filepath)
	if err != nil {
		http.Error(w, "Failed to create file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy file contents
	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}

	// Store current image path
	currentImage = filename

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(UploadResponse{
		Message: "Image uploaded successfully",
		URL:     fmt.Sprintf("/api/image/%s", filename),
	})
}

// GetImage serves the uploaded image
func GetImage(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	filename := vars["filename"]

	// Validate filename to prevent directory traversal
	if filename == "" || filename == ".." {
		http.Error(w, "Invalid filename", http.StatusBadRequest)
		return
	}

	filepath := filepath.Join(uploadDir, filename)

	// Check if file exists
	if _, err := os.Stat(filepath); os.IsNotExist(err) {
		http.Error(w, "Image not found", http.StatusNotFound)
		return
	}

	http.ServeFile(w, r, filepath)
}

// GetCurrentImage returns the current background image
func GetCurrentImage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if currentImage == "" {
		json.NewEncoder(w).Encode(ImageResponse{URL: ""})
		return
	}

	json.NewEncoder(w).Encode(ImageResponse{
		URL: fmt.Sprintf("/api/image/%s", currentImage),
	})
}

// GetColors returns current color configuration
func GetColors(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	data, err := ioutil.ReadFile(colorsFile)
	if err != nil {
		http.Error(w, "Failed to read colors", http.StatusInternalServerError)
		return
	}

	var colors ColorConfig
	if err := json.Unmarshal(data, &colors); err != nil {
		http.Error(w, "Failed to parse colors", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(colors)
}

// UpdateColors updates the color configuration
func UpdateColors(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost && r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var colors ColorConfig
	if err := json.NewDecoder(r.Body).Decode(&colors); err != nil {
		http.Error(w, "Failed to parse colors", http.StatusBadRequest)
		return
	}

	// Save to file
	data, err := json.MarshalIndent(colors, "", "  ")
	if err != nil {
		http.Error(w, "Failed to marshal colors", http.StatusInternalServerError)
		return
	}

	if err := ioutil.WriteFile(colorsFile, data, 0644); err != nil {
		http.Error(w, "Failed to save colors", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Colors updated successfully"})
}

// HealthCheck endpoint
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func main() {
	router := mux.NewRouter()

	// API Routes
	router.HandleFunc("/api/health", HealthCheck).Methods("GET")
	router.HandleFunc("/api/upload", UploadImage).Methods("POST")
	router.HandleFunc("/api/image/{filename}", GetImage).Methods("GET")
	router.HandleFunc("/api/current-image", GetCurrentImage).Methods("GET")
	router.HandleFunc("/api/colors", GetColors).Methods("GET")
	router.HandleFunc("/api/colors", UpdateColors).Methods("POST", "PUT")

	// CORS configuration
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000", "*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           300,
	})

	handler := c.Handler(router)

	// Start server
	port := 8080
	log.Printf("Starting Vigilance backend on http://localhost:%d\n", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%d", port), handler); err != nil {
		log.Fatal(err)
	}
}
