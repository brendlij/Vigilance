# Vigilance - Modern Dashboard with Backend

A beautiful, transparent homelab/server monitoring dashboard built with Vue 3, TypeScript, and a Go backend. Features custom image uploads and accent color customization.

## 🎨 Features

- **Modern Transparent UI** - Glass-morphism design with backdrop blur effects
- **Custom Background Images** - Upload your own dashboard background images via the backend
- **Accent Color Customization** - Personalize the dashboard with custom accent colors
- **Service Monitoring** - Monitor multiple services with online/offline status
- **System Stats** - Real-time clock, weather, and system resource monitoring
- **Quick Links** - Fast access to frequently used services
- **Responsive Design** - Beautiful on desktop and tablet

## 🏗️ Architecture

### Frontend
- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** build tool with hot reload
- **Vue Router** for page navigation
- **Pinia** for state management
- **Iconify** with Material Design Icons
- **Custom CSS** system with CSS variables

### Backend
- **Go 1.21+** HTTP server
- **Gorilla Mux** for routing
- **CORS Support** for frontend communication
- **File Upload** with size limits (50MB)
- **Color Persistence** with JSON config

## 📋 Prerequisites

- **Node.js** 18+ and npm/bun
- **Go** 1.21+
- **Git**

## 🚀 Quick Start

### Frontend Setup

```bash
# Install dependencies
bun install
# or
npm install

# Start development server
bun run dev
# or
npm run dev
```

Frontend runs on `http://localhost:5173`

### Backend Setup

```bash
cd backend

# Download dependencies
go mod download

# Run the server
go run main.go
```

Backend runs on `http://localhost:8080`

## 📁 Project Structure

```
vigilance/
├── src/
│   ├── components/
│   │   ├── widgets/
│   │   │   ├── ClockWidget.vue
│   │   │   ├── WeatherWidget.vue
│   │   │   └── SystemStatsWidget.vue
│   │   ├── QuickLink.vue
│   │   └── ServiceCard.vue
│   ├── views/
│   │   ├── HomeView.vue
│   │   └── SettingsView.vue
│   ├── stores/
│   │   └── dashboardStore.ts
│   ├── utils/
│   │   ├── backgroundHelper.ts
│   │   ├── colorHelper.ts
│   │   └── dummyData.ts
│   ├── router/
│   │   └── index.ts
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── backend/
│   ├── main.go
│   ├── go.mod
│   ├── colors.json
│   ├── uploads/
│   └── README.md
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

## 🎯 Usage

### Dashboard Home
Navigate to `http://localhost:5173` to see the main dashboard with:
- System overview widgets
- Service status monitoring
- Quick access links

### Settings Page
Go to `http://localhost:5173/#/settings` to:
1. **Upload Background Image**
   - Drag and drop or click to upload
   - Supports JPG, PNG, GIF, etc.
   - Max file size: 50MB

2. **Customize Colors**
   - Click color inputs to open picker
   - Modify primary, secondary, and accent colors
   - Changes apply in real-time
   - Click "Save Colors" to persist

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```

### Image Management
```
POST /api/upload
- Form data: image (multipart file)
- Returns: { "message": "...", "url": "/api/image/filename" }

GET /api/image/{filename}
- Returns the image file

GET /api/current-image
- Returns: { "url": "/api/image/filename" }
```

### Color Configuration
```
GET /api/colors
- Returns: { "primary": "#...", "secondary": "#...", ... }

POST /api/colors
PUT /api/colors
- Body: JSON with color values
- Returns: { "message": "Colors updated successfully" }
```

## 🎨 Customization

### Edit Dashboard Widgets
1. Create new widget in `src/components/widgets/`
2. Import in `HomeView.vue`
3. Add to widgets grid

### Modify Dashboard Data
1. Edit `src/utils/dummyData.ts` to replace mock data
2. Connect to your real APIs in `src/stores/dashboardStore.ts`

### Change Color Scheme
1. Edit `src/style.css` CSS variables
2. Or use Settings UI to customize dynamically

### Adjust Layout
- Edit `src/views/HomeView.vue` for dashboard layout
- Modify CSS grid columns for different breakpoints

## 🔧 Build for Production

### Frontend
```bash
bun run build
# or
npm run build
```

Creates `dist/` folder with production-ready files.

### Backend
```bash
cd backend
go build -o vigilance-backend
./vigilance-backend
```

Creates executable `vigilance-backend`

## 📦 Dependencies

### Frontend
- vue@3.5.24
- vue-router@4.6.3
- pinia@3.0.4
- @iconify/vue@5.0.0
- vite@7.2.2

### Backend
- github.com/gorilla/mux@1.8.1
- github.com/rs/cors@1.10.1

## 🚀 Deployment

### Vercel (Frontend)
```bash
bun run build
# Push dist/ to GitHub, connect to Vercel
```

### Docker (Both)
```dockerfile
# Backend Dockerfile
FROM golang:1.21-alpine
WORKDIR /app
COPY backend .
RUN go build -o vigilance-backend
EXPOSE 8080
CMD ["./vigilance-backend"]

# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

## 🐛 Troubleshooting

### Backend not connecting
- Ensure backend is running on `http://localhost:8080`
- Check CORS is enabled
- Verify firewall allows port 8080

### Images not loading
- Check `backend/uploads/` directory permissions
- Ensure file size is under 50MB
- Verify file format is supported

### Colors not applying
- Clear browser cache (Ctrl+Shift+Delete)
- Restart frontend server
- Check browser console for errors

## 📝 License

MIT - Feel free to use and modify

## 🤝 Contributing

Feel free to fork, modify, and submit pull requests!

---

**Built with Vue 3, Go, and ❤️**
