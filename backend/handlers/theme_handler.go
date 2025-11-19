package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"vigilance/models"
	"vigilance/services"
)

// ThemeHandler handles theme-related endpoints
type ThemeHandler struct {
	themeService *services.ThemeService
}

// NewThemeHandler creates a new theme handler
func NewThemeHandler(themeService *services.ThemeService) *ThemeHandler {
	return &ThemeHandler{
		themeService: themeService,
	}
}

// GetAllThemes returns all available themes (default only - community from GitHub on frontend)
func (th *ThemeHandler) GetAllThemes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	result := make(map[string]interface{})

	// Get default themes (offline, bundled)
	defaultThemes, err := th.themeService.GetDefaultThemes()
	if err != nil {
		http.Error(w, "Failed to load default themes", http.StatusInternalServerError)
		return
	}
	result["default"] = defaultThemes

	response := models.ThemeResponse{
		Success: true,
		Data:    result,
	}

	json.NewEncoder(w).Encode(response)
}

// GetTheme returns a specific theme with its full content
func (th *ThemeHandler) GetTheme(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Parse query parameters
	source := r.URL.Query().Get("source")
	author := r.URL.Query().Get("author")
	theme := r.URL.Query().Get("theme")

	if source == "" || theme == "" {
		response := models.ThemeResponse{
			Success: false,
			Message: "Missing required parameters: source, theme",
		}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Get theme content
	content, err := th.themeService.GetThemeContent(source, author, theme)
	if err != nil {
		response := models.ThemeResponse{
			Success: false,
			Message: fmt.Sprintf("Theme not found: %v", err),
		}
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(response)
		return
	}

	response := models.ThemeResponse{
		Success: true,
		Data: map[string]string{
			"content": content,
		},
	}

	json.NewEncoder(w).Encode(response)
}

// GetUserThemes returns themes uploaded by a specific user
func (th *ThemeHandler) GetUserThemes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		response := models.ThemeResponse{
			Success: false,
			Message: "Missing required parameter: user_id",
		}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	themes, err := th.themeService.GetUserThemes(userID)
	if err != nil {
		response := models.ThemeResponse{
			Success: false,
			Message: fmt.Sprintf("Failed to load user themes: %v", err),
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	response := models.ThemeListResponse{
		Success: true,
		Themes:  themes,
	}

	json.NewEncoder(w).Encode(response)
}

// UploadTheme handles theme uploads from users
func (th *ThemeHandler) UploadTheme(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(models.ThemeResponse{
			Success: false,
			Message: "Method not allowed",
		})
		return
	}

	// Parse multipart form
	if err := r.ParseMultipartForm(5 * 1024 * 1024); err != nil { // 5MB max
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ThemeResponse{
			Success: false,
			Message: "Failed to parse form",
		})
		return
	}

	userID := r.FormValue("user_id")
	themeName := r.FormValue("theme_name")

	if userID == "" || themeName == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ThemeResponse{
			Success: false,
			Message: "Missing required fields: user_id, theme_name",
		})
		return
	}

	// Validate theme name (alphanumeric, dash, underscore)
	if !isValidThemeName(themeName) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ThemeResponse{
			Success: false,
			Message: "Invalid theme name. Use only alphanumeric, dash, and underscore",
		})
		return
	}

	// Get uploaded file
	file, _, err := r.FormFile("theme_file")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ThemeResponse{
			Success: false,
			Message: "No file provided",
		})
		return
	}
	defer file.Close()

	// Read file content
	content, err := ioutil.ReadAll(file)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ThemeResponse{
			Success: false,
			Message: "Failed to read file",
		})
		return
	}

	// Basic validation: should be TOML
	contentStr := string(content)
	if !strings.Contains(contentStr, "[") || !strings.Contains(contentStr, "]") {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ThemeResponse{
			Success: false,
			Message: "Invalid TOML format",
		})
		return
	}

	// Save theme
	if err := th.themeService.SaveUserTheme(userID, themeName, contentStr); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ThemeResponse{
			Success: false,
			Message: fmt.Sprintf("Failed to save theme: %v", err),
		})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(models.ThemeResponse{
		Success: true,
		Message: "Theme uploaded successfully",
		Data: map[string]string{
			"theme_id": themeName,
		},
	})
}

// GetCommunityThemes fetches community themes from GitHub repo (frontend calls this)
func (th *ThemeHandler) GetCommunityThemes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// GitHub repo info
	const repoOwner = "brendlij"
	const repoName = "vigilance-community"
	const themesPath = "themes"

	// This URL gets the GitHub API response for themes directory
	apiURL := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/%s", repoOwner, repoName, themesPath)

	// Create request with optional auth header (helps with rate limits)
	client := &http.Client{}
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		th.returnMockCommunityThemes(w)
		return
	}

	// Add User-Agent header (GitHub API requires it)
	req.Header.Set("User-Agent", "Vigilance-Theme-Loader")

	resp, err := client.Do(req)
	if err != nil {
		th.returnMockCommunityThemes(w)
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		th.returnMockCommunityThemes(w)
		return
	}

	// Check for GitHub API errors - fallback to mock on rate limit
	if resp.StatusCode == 403 {
		fmt.Println("GitHub API rate limit hit, returning mock community themes")
		th.returnMockCommunityThemes(w)
		return
	}

	if resp.StatusCode == 404 {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(models.ThemeResponse{
			Success: false,
			Message: "Community themes repository not found on GitHub",
		})
		return
	}

	if resp.StatusCode != 200 {
		th.returnMockCommunityThemes(w)
		return
	}

	// Pass through GitHub API response (frontend will parse it)
	w.WriteHeader(http.StatusOK)
	w.Write(body)
}

// returnMockCommunityThemes returns mock community themes when GitHub API fails
func (th *ThemeHandler) returnMockCommunityThemes(w http.ResponseWriter) {
	// Mock response that mimics GitHub API structure
	mockThemes := []map[string]interface{}{
		{
			"name":  "vigilance-team",
			"path":  "themes/vigilance-team",
			"sha":   "mock-sha-1",
			"size":  0,
			"url":   "https://api.github.com/repos/brendlij/vigilance-community/contents/themes/vigilance-team",
			"html_url": "https://github.com/brendlij/vigilance-community/tree/main/themes/vigilance-team",
			"git_url": "https://api.github.com/repos/brendlij/vigilance-community/git/trees/mock-sha-1",
			"download_url": nil,
			"type": "dir",
			"_links": map[string]string{
				"self": "https://api.github.com/repos/brendlij/vigilance-community/contents/themes/vigilance-team",
				"git":  "https://api.github.com/repos/brendlij/vigilance-community/git/trees/mock-sha-1",
				"html": "https://github.com/brendlij/vigilance-community/tree/main/themes/vigilance-team",
			},
		},
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mockThemes)
}

// DeleteTheme deletes a user's theme
func (th *ThemeHandler) DeleteTheme(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodDelete {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(models.ThemeResponse{
			Success: false,
			Message: "Method not allowed",
		})
		return
	}

	userID := r.URL.Query().Get("user_id")
	themeName := r.URL.Query().Get("theme_name")

	if userID == "" || themeName == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(models.ThemeResponse{
			Success: false,
			Message: "Missing required parameters: user_id, theme_name",
		})
		return
	}

	if err := th.themeService.DeleteUserTheme(userID, themeName); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(models.ThemeResponse{
			Success: false,
			Message: fmt.Sprintf("Failed to delete theme: %v", err),
		})
		return
	}

	json.NewEncoder(w).Encode(models.ThemeResponse{
		Success: true,
		Message: "Theme deleted successfully",
	})
}

// isValidThemeName validates theme name
func isValidThemeName(name string) bool {
	if len(name) == 0 || len(name) > 100 {
		return false
	}

	for _, r := range name {
		if !((r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '-' || r == '_') {
			return false
		}
	}

	return true
}
