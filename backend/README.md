# Vigilance Backend

Go backend server for Vigilance dashboard with image upload and color customization.

## Features

- **Image Upload**: Upload custom background images
- **Image Serving**: Serve uploaded images
- **Color Customization**: Save and manage accent colors
- **CORS Support**: Cross-origin requests from Vue frontend

## Setup

### Prerequisites

- Go 1.21 or higher
- Windows/Mac/Linux

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Download dependencies:
```bash
go mod download
```

3. Run the server:
```bash
go run main.go
```

The server will start on `http://localhost:8080`

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if server is running

### Image Management
- **POST** `/api/upload` - Upload a new background image
  - Form data: `image` (multipart file)
  - Returns: `{ "message": "...", "url": "/api/image/filename" }`

- **GET** `/api/image/{filename}` - Get image file

- **GET** `/api/current-image` - Get current background image URL
  - Returns: `{ "url": "/api/image/filename" }`

### Color Configuration
- **GET** `/api/colors` - Get current color settings
  - Returns: `{ "primary": "#3b82f6", "secondary": "#8b5cf6", ... }`

- **POST/PUT** `/api/colors` - Update color settings
  - Body: `{ "primary": "#...", "secondary": "#...", ... }`
  - Returns: `{ "message": "Colors updated successfully" }`

## Color Properties

```json
{
  "primary": "#3b82f6",
  "secondary": "#8b5cf6",
  "accent_green": "#10b981",
  "accent_red": "#ef4444",
  "accent_orange": "#f97316",
  "accent_yellow": "#eab308",
  "accent_purple": "#a855f7"
}
```

## File Structure

```
backend/
├── main.go           # Main server code
├── go.mod            # Go module file
├── go.sum            # Go dependencies (auto-generated)
├── colors.json       # Color configuration
└── uploads/          # Uploaded images directory
```

## Usage Examples

### Upload Image
```bash
curl -X POST -F "image=@/path/to/image.jpg" http://localhost:8080/api/upload
```

### Get Current Image
```bash
curl http://localhost:8080/api/current-image
```

### Get Colors
```bash
curl http://localhost:8080/api/colors
```

### Update Colors
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"primary":"#ff0000","secondary":"#00ff00","accent_green":"#0000ff","accent_red":"#ff00ff","accent_orange":"#ffff00","accent_yellow":"#00ffff","accent_purple":"#ff0080"}' \
  http://localhost:8080/api/colors
```
