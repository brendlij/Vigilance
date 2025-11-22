# Vigilance Backend

Simple Go backend for the Vigilance project.

## Requirements

- Go 1.21 or higher

## Installation

```sh
cd backend
go mod download
```

## Development

```sh
go run main.go
```

The server will start on `http://localhost:8080`

## Endpoints

### Health Check

```
GET /health
```

Returns the health status of the backend.

**Response:**

```json
{
  "status": "healthy",
  "code": 200
}
```

### Weather

```
GET /weather?location=<city>
```

Fetches weather data for a specific location from OpenWeatherMap API.

**Query Parameters:**

- `location` (required): City name (e.g., "London", "New York")

**Response:**

```json
{
  "city": "London",
  "country": "GB",
  "temp": 12.5,
  "feels_like": 11.2,
  "humidity": 75,
  "pressure": 1013,
  "description": "partly cloudy",
  "icon": "02d",
  "wind_speed": 3.5
}
```

**Example:**

```
GET http://localhost:8080/weather?location=London
```

## Environment Variables

- `OPENWEATHER_API_KEY` - OpenWeatherMap API key (required for weather endpoint)

To get an API key, sign up at [OpenWeatherMap](https://openweathermap.org/api)

## Future Endpoints

- Notification management
- Docker integration
- Home Assistant integration
- Pi-hole integration
- Smart Assistant integration
