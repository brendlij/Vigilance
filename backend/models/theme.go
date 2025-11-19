package models

import "time"

// Theme represents a theme configuration
type Theme struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Version     string    `json:"version"`
	Author      string    `json:"author"`
	Source      string    `json:"source"` // "default", "community", "user"
	Path        string    `json:"path"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ThemeContent contains the actual TOML content
type ThemeContent struct {
	Theme   Theme  `json:"theme"`
	Content string `json:"content"` // Raw TOML content
}

// ThemeResponse for API responses
type ThemeResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

// ThemeListResponse for listing themes
type ThemeListResponse struct {
	Success bool    `json:"success"`
	Themes  []Theme `json:"themes"`
}

// CommunityTheme represents a theme from the community repo
type CommunityTheme struct {
	Author string   `json:"author"`
	Themes []Theme  `json:"themes"`
}
