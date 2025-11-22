package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"

	"github.com/gin-gonic/gin"
)

type HealthResponse struct {
	Status string `json:"status"`
	Code   int    `json:"code"`
}

type WeatherData struct {
	City       string  `json:"city"`
	Country    string  `json:"country"`
	Temp       float64 `json:"temp"`
	FeelsLike  float64 `json:"feels_like"`
	Humidity   int     `json:"humidity"`
	Pressure   int     `json:"pressure"`
	Description string `json:"description"`
	Icon       string  `json:"icon"`
	WindSpeed  float64 `json:"wind_speed"`
}

type OpenWeatherResponse struct {
	Main struct {
		Temp      float64 `json:"temp"`
		FeelsLike float64 `json:"feels_like"`
		Humidity  int     `json:"humidity"`
		Pressure  int     `json:"pressure"`
	} `json:"main"`
	Weather []struct {
		Description string `json:"description"`
		Icon        string `json:"icon"`
	} `json:"weather"`
	Wind struct {
		Speed float64 `json:"speed"`
	} `json:"wind"`
	Name    string `json:"name"`
	Sys struct {
		Country string `json:"country"`
	} `json:"sys"`
}

func healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, HealthResponse{
		Status: "healthy",
		Code:   http.StatusOK,
	})
}

func weatherHandler(c *gin.Context) {
	location := c.Query("location")
	if location == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "City/Location not specified",
		})
		return
	}

	apiKey := c.Query("apiKey")
	if apiKey == "" {
		apiKey = os.Getenv("OPENWEATHER_API_KEY")
	}
	if apiKey == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "No API Key provided",
		})
		return
	}

	// Call OpenWeatherMap API
	query := url.QueryEscape(location)
	apiURL := fmt.Sprintf("https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric", query, apiKey)

	resp, err := http.Get(apiURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch weather data",
		})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusUnauthorized {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Wrong API Key",
		})
		return
	}

	if resp.StatusCode == http.StatusNotFound {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "City not found",
		})
		return
	}

	if resp.StatusCode != http.StatusOK {
		c.JSON(resp.StatusCode, gin.H{
			"error": "Failed to fetch weather data",
		})
		return
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to read weather response",
		})
		return
	}

	var weatherResp OpenWeatherResponse
	err = json.Unmarshal(body, &weatherResp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to parse weather data",
		})
		return
	}

	weatherData := WeatherData{
		City:        weatherResp.Name,
		Country:     weatherResp.Sys.Country,
		Temp:        weatherResp.Main.Temp,
		FeelsLike:   weatherResp.Main.FeelsLike,
		Humidity:    weatherResp.Main.Humidity,
		Pressure:    weatherResp.Main.Pressure,
		WindSpeed:   weatherResp.Wind.Speed,
	}

	if len(weatherResp.Weather) > 0 {
		weatherData.Description = weatherResp.Weather[0].Description
		weatherData.Icon = weatherResp.Weather[0].Icon
	}

	c.JSON(http.StatusOK, weatherData)
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin == "" {
			origin = "*"
		}
		c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-API-Key")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	router := gin.Default()

	// Apply CORS middleware FIRST, before any other middleware or routes
	router.Use(corsMiddleware())

	// Health check endpoint
	router.GET("/health", healthHandler)

	// Weather endpoint
	router.GET("/weather", weatherHandler)

	// Run the server on port 8080
	router.Run(":8080")
}
