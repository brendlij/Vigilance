package services

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"time"

	"vigilance/models"
)

// ThemeService handles theme operations (offline default themes only)
type ThemeService struct {
	storageDir string
}

// NewThemeService creates a new theme service
func NewThemeService(storageDir string) *ThemeService {
	return &ThemeService{
		storageDir: storageDir,
	}
}

// GetDefaultThemes returns all default themes (offline, bundled)
func (ts *ThemeService) GetDefaultThemes() ([]models.Theme, error) {
	defaultDir := filepath.Join(ts.storageDir, "themes", "default")
	return ts.readThemesFromDir(defaultDir, "default")
}

// GetUserThemes returns themes uploaded by a specific user
func (ts *ThemeService) GetUserThemes(userID string) ([]models.Theme, error) {
	userDir := filepath.Join(ts.storageDir, "uploads", userID)
	return ts.readThemesFromDir(userDir, "user")
}

// GetThemeContent returns the full TOML content of a theme
func (ts *ThemeService) GetThemeContent(source, author, themeName string) (string, error) {
	var themePath string

	switch source {
	case "default":
		themePath = filepath.Join(ts.storageDir, "themes", "default", themeName+".toml")
	case "user":
		themePath = filepath.Join(ts.storageDir, "uploads", author, themeName+".toml")
	default:
		return "", fmt.Errorf("unknown theme source: %s", source)
	}

	content, err := ioutil.ReadFile(themePath)
	if err != nil {
		return "", fmt.Errorf("failed to read theme file: %w", err)
	}

	return string(content), nil
}

// SaveUserTheme saves a theme uploaded by a user
func (ts *ThemeService) SaveUserTheme(userID, themeName, content string) error {
	userDir := filepath.Join(ts.storageDir, "uploads", userID)

	if err := os.MkdirAll(userDir, 0755); err != nil {
		return fmt.Errorf("failed to create user directory: %w", err)
	}

	themePath := filepath.Join(userDir, themeName+".toml")

	if err := ioutil.WriteFile(themePath, []byte(content), 0644); err != nil {
		return fmt.Errorf("failed to write theme file: %w", err)
	}

	return nil
}

// DeleteUserTheme deletes a user's theme
func (ts *ThemeService) DeleteUserTheme(userID, themeName string) error {
	themePath := filepath.Join(ts.storageDir, "uploads", userID, themeName+".toml")

	if err := os.Remove(themePath); err != nil {
		return fmt.Errorf("failed to delete theme: %w", err)
	}

	return nil
}

// readThemesFromDir reads all TOML themes from a directory
func (ts *ThemeService) readThemesFromDir(dir string, source string) ([]models.Theme, error) {
	var themes []models.Theme

	if _, err := os.Stat(dir); os.IsNotExist(err) {
		return themes, nil
	}

	files, err := ioutil.ReadDir(dir)
	if err != nil {
		return nil, fmt.Errorf("failed to read directory: %w", err)
	}

	for _, file := range files {
		if !strings.HasSuffix(file.Name(), ".toml") || file.IsDir() {
			continue
		}

		themeName := strings.TrimSuffix(file.Name(), ".toml")
		themePath := filepath.Join(dir, file.Name())

		theme, err := ts.parseThemeMetadata(themePath, themeName, source)
		if err != nil {
			continue
		}

		themes = append(themes, theme)
	}

	return themes, nil
}

// parseThemeMetadata extracts metadata from a TOML theme file
func (ts *ThemeService) parseThemeMetadata(filePath, themeName, source string) (models.Theme, error) {
	content, err := ioutil.ReadFile(filePath)
	if err != nil {
		return models.Theme{}, err
	}

	contentStr := string(content)

	theme := models.Theme{
		ID:          fmt.Sprintf("%s_%s_%d", source, themeName, time.Now().Unix()),
		Name:        ts.extractTOMLValue(contentStr, "name"),
		Description: ts.extractTOMLValue(contentStr, "description"),
		Version:     ts.extractTOMLValue(contentStr, "version"),
		Author:      ts.extractTOMLValue(contentStr, "author"),
		Source:      source,
		Path:        filePath,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if theme.Name == "" {
		theme.Name = themeName
	}

	return theme, nil
}

// extractTOMLValue extracts a string value from TOML content
func (ts *ThemeService) extractTOMLValue(content, key string) string {
	lines := strings.Split(content, "\n")

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, key+" =") {
			start := strings.Index(line, "\"")
			end := strings.LastIndex(line, "\"")

			if start != -1 && end != -1 && start < end {
				return line[start+1 : end]
			}
		}
	}

	return ""
}
