package main

import (
	"fmt"
	"net/http"
	"path/filepath"

	"vigilance/handlers"
	"vigilance/middleware"
	"vigilance/services"
)

func main() {
	// Initialize storage directory
	storageDir := filepath.Join(".", "storage")

	// Initialize services
	themeService := services.NewThemeService(storageDir)
	themeHandler := handlers.NewThemeHandler(themeService)

	// Register routes
	// Health
	http.HandleFunc("/health", middleware.CORSMiddleware(handlers.HealthHandler))

	// Theme endpoints
	http.HandleFunc("/api/themes", middleware.CORSMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			themeHandler.GetAllThemes(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/api/themes/get", middleware.CORSMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			themeHandler.GetTheme(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/api/themes/my", middleware.CORSMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			themeHandler.GetUserThemes(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/api/themes/upload", middleware.CORSMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			themeHandler.UploadTheme(w, r)
		} else if r.Method == http.MethodDelete {
			themeHandler.DeleteTheme(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))

	// Start server
	fmt.Println("🚀 Backend läuft auf http://localhost:8080")
	fmt.Println("📊 Health Check: http://localhost:8080/health")
	fmt.Println("🎨 Themes API: http://localhost:8080/api/themes")

	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Println("Error:", err)
	}
}
